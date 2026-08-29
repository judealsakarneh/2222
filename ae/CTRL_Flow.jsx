/**
 * CTRL Flow — 1920x1080 · 30 fps · 12.000 s
 * Auto-builds the comp in After Effects.
 *
 * USE:   File > Scripts > Run Script File…  →  CTRL_Flow.jsx
 * NEEDS: Archivo (Black / Medium) and JetBrains Mono installed. If a font is
 *        missing AE substitutes it silently — check the text layers after the
 *        run rather than trusting that it looked fine.
 *
 * The wallpaper: the script looks for ../public/img/flow-wall.webp relative to
 * itself and imports it if it is there. AE cannot read .webp on every version,
 * so if the import fails it builds the layer as a dark solid and tells you at
 * the end. Swap in a PNG or JPG of the same frame and re-run.
 *
 * NOT VERIFIED IN AFTER EFFECTS. This was written against the same beat sheet
 * as the Remotion composition in src/flow, which was rendered and inspected
 * frame by frame — but no copy of After Effects exists in the environment it
 * was written in, so the timings are known good and this file's ExtendScript
 * is not. Run it on a scratch project first.
 *
 * Every time is in MILLISECONDS at the top and converted once, so the numbers
 * here, the numbers in FLOW_SPEC.md and the numbers in src/flow/lib/timeline.ts
 * are the same numbers.
 */

(function () {
  // ── CONFIG ────────────────────────────────────────────────────────────────
  var W = 1920, H = 1080, FPS = 30, DUR = 12.0;

  var COL = {
    ink:        [0.043, 0.043, 0.043],  // #0B0B0B
    panel:      [0.071, 0.078, 0.078],  // #121414
    teal:       [0.000, 0.396, 0.388],  // #006563
    tealBright: [0.000, 0.663, 0.643],  // #00A9A4
    tealLight:  [0.310, 0.820, 0.796],  // #4FD1CA
    white:      [1, 1, 1]
  };

  var FONT_BLACK  = "Archivo-Black";
  var FONT_MEDIUM = "Archivo-Medium";
  var FONT_MONO   = "JetBrainsMono-Medium";

  // Panel geometry, matching src/flow/components/AppPanel.tsx.
  var PW = 1120, PH = 566;
  var PX = (W - PW) / 2, PY = (H - PH) / 2;
  var PAD = 40;

  // PLACEHOLDER CONTENT. None of this is a claim CTRL Room has made. Replace
  // the counter targets with real figures or delete the counter beat.
  var ROWS = [
    "Placeholder Roastery  ·  Um Uthayna  ·  Coffee",
    "Placeholder Kitchen  ·  Sweifieh  ·  Levantine",
    "Placeholder Rooftop  ·  Abdoun  ·  Late"
  ];
  var COUNT_A = 978, COUNT_B = 19;
  var TABS = ["DISCOVER", "EVENTS", "ELITE"];

  // ── BEATS, in ms ──────────────────────────────────────────────────────────
  var B = {
    iconMove: 600, iconOpacity: 300, iconGlow: 500,
    wallFrom: 600, wallMove: 1400,
    panelFrom: 2000, panelMove: 320,
    barsFrom: 3200, barsTo: 4500, barPer: 150, barStagger: 30,
    typeFrom: 4500, perChar: 25, perLine: 60, caret: 500,
    tabSwitch: [6300, 7150], tabMove: 250, tabOut: 150, tabIn: 200, tabOverlap: 50,
    countFrom: 8000, countRun: 1200, countPop: 400, countPopAt: 0.8,
    outroFrom: 10000, outroMove: 400
  };

  // ── HELPERS ───────────────────────────────────────────────────────────────
  var s = function (m) { return m / 1000; };

  /**
   * Key a property and shape its speed graph.
   *
   * inf = influence %, the number in the Graph Editor's keyframe dialog. The
   * house curve is cubic-bezier(0.22, 1, 0.36, 1): out influence 1, in
   * influence 88. It leaves instantly and settles long, and it is the reason
   * everything in the piece shares one physique.
   *
   * Use the Speed Graph, not the Value Graph. The Value Graph shapes position;
   * the Speed Graph shapes velocity, and velocity is what the eye reads as
   * weight.
   */
  function key(prop, m, value, easeInInf, easeOutInf, spd) {
    var t = s(m);
    prop.setValueAtTime(t, value);
    var idx = prop.nearestKeyIndex(t);
    var speed = (spd === undefined) ? 0 : spd;
    var ei = (easeInInf === undefined) ? 88 : easeInInf;
    var eo = (easeOutInf === undefined) ? 1  : easeOutInf;
    var dim = (value instanceof Array) ? value.length : 1;
    var inE = [], outE = [];
    for (var i = 0; i < dim; i++) {
      inE.push(new KeyframeEase(speed, ei));
      outE.push(new KeyframeEase(speed, eo));
    }
    prop.setTemporalEaseAtKey(idx, inE, outE);
    return idx;
  }

  function xf(l)      { return l.property("ADBE Transform Group"); }
  function pos(l)     { return xf(l).property("ADBE Position"); }
  function scl(l)     { return xf(l).property("ADBE Scale"); }
  function opa(l)     { return xf(l).property("ADBE Opacity"); }
  function addFx(l, m){ return l.property("ADBE Effect Parade").addProperty(m); }

  function solid(comp, name, color, w, h) {
    return comp.layers.addSolid(color, name, w || W, h || H, 1, DUR);
  }

  /** A text layer with the document ramp already applied. */
  function text(comp, name, str, font, size, color, tracking, justify) {
    var l = comp.layers.addText(str);
    l.name = name;
    var td = l.property("ADBE Text Properties").property("ADBE Text Document");
    var d = td.value;
    d.font = font;
    d.fontSize = size;
    d.fillColor = color;
    d.applyFill = true;
    d.applyStroke = false;
    if (tracking !== undefined) d.tracking = tracking;
    if (justify !== undefined) d.justification = justify;
    td.setValue(d);
    return l;
  }

  /** A rounded rectangle shape layer, anchored top-left at (x, y). */
  function roundRect(comp, name, x, y, w, h, color, radius, alpha) {
    var l = comp.layers.addShape();
    l.name = name;
    var g = l.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    var c = g.property("ADBE Vectors Group");
    var r = c.addProperty("ADBE Vector Shape - Rect");
    r.property("ADBE Vector Rect Size").setValue([w, h]);
    r.property("ADBE Vector Rect Roundness").setValue(radius || 0);
    var fill = c.addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue(color);
    if (alpha !== undefined) fill.property("ADBE Vector Fill Opacity").setValue(alpha);
    pos(l).setValue([x + w / 2, y + h / 2]);
    return l;
  }

  // ── COMP ──────────────────────────────────────────────────────────────────
  app.beginUndoGroup("Build CTRL Flow");

  var proj = app.project || app.newProject();
  var comp = proj.items.addComp("CTRL_Flow", W, H, 1, DUR, FPS);
  comp.bgColor = COL.ink;
  comp.motionBlur = true;
  comp.shutterAngle = 180;
  comp.shutterPhase = -90;
  comp.motionBlurSamplesPerFrame = 16;
  comp.motionBlurAdaptiveSampleLimit = 128;
  comp.openInViewer();

  var warnings = [];

  // ══ 01  WALLPAPER ═════════════════════════════════════════════════════════
  // 600-2000ms · Blur 100 -> 0 px and Scale 105 -> 100 on the same curve and
  // the same duration. They must match: a blur that lands before the scale does
  // reads as two effects rather than as one lens finding focus.
  var wall = null;
  try {
    var here = new File($.fileName).parent;
    var img = new File(here.fsName + "/../public/img/flow-wall.webp");
    if (img.exists) {
      var io = new ImportOptions(img);
      var footage = proj.importFile(io);
      wall = comp.layers.add(footage);
      wall.name = "01 WALL";
    }
  } catch (e) {
    warnings.push("Wallpaper import failed (" + e.toString() + ").");
  }
  if (wall === null) {
    wall = solid(comp, "01 WALL", [0.10, 0.10, 0.10]);
    warnings.push(
      "Wallpaper not imported — using a flat solid. AE cannot read .webp on " +
      "every version; export the same frame as PNG or JPG into public/img/ " +
      "and re-run, or replace the source of the '01 WALL' layer by hand."
    );
  }

  // Fit to frame, then key the 105 -> 100 over the arrival.
  var wScale = 100;
  if (wall.source && wall.source.width) {
    wScale = Math.max(W / wall.source.width, H / wall.source.height) * 100;
  }
  key(scl(wall), B.wallFrom,               [wScale * 1.05, wScale * 1.05], 1,  1);
  key(scl(wall), B.wallFrom + B.wallMove,  [wScale, wScale],               88, 1);

  var wBlur = addFx(wall, "ADBE Gaussian Blur 2");
  var wBlurAmt = wBlur.property("ADBE Gaussian Blur 2-0001");
  wBlur.property("ADBE Gaussian Blur 2-0003").setValue(true); // repeat edge pixels
  key(wBlurAmt, B.wallFrom,              100, 1,  1);
  key(wBlurAmt, B.wallFrom + B.wallMove,   0, 88, 1);
  // 3200-3520ms · the depth of field the 50mm camera would give. A real camera
  // layer would cost a 3D scene for one value that never changes afterwards.
  key(wBlurAmt, B.panelFrom,                   0,  1, 1);
  key(wBlurAmt, B.panelFrom + B.panelMove,    16, 88, 1);

  opa(wall).setValue(72);
  // 9700-10300ms · the wall gives up two thirds of its level as the panel
  // leaves, which clears the white lockup and closes the film down.
  key(opa(wall),  9700, 72, 1,  1);
  key(opa(wall), 10300, 24, 88, 1);

  // ══ 02  MARK ══════════════════════════════════════════════════════════════
  // 0-600ms · Scale 0 -> 110 -> 100, Opacity over 300, Glow over 500. Three
  // properties on three durations: the shape lands, then the light catches up.
  var markGlow = solid(comp, "02 MARK GLOW", COL.white);
  var mgMask = markGlow.Masks.addProperty("Mask");
  var mgShape = new Shape();
  mgShape.vertices = [
    [W/2 - 140, H/2 - 140], [W/2 + 140, H/2 - 140],
    [W/2 + 140, H/2 + 140], [W/2 - 140, H/2 + 140]
  ];
  mgShape.closed = true;
  mgMask.property("ADBE Mask Shape").setValue(mgShape);
  addFx(markGlow, "ADBE Gaussian Blur 2").property("ADBE Gaussian Blur 2-0001").setValue(40);
  key(opa(markGlow), 0,           0,  1,  1);
  key(opa(markGlow), B.iconGlow, 30, 88,  1);
  key(opa(markGlow), B.iconMove,        30, 70, 1);
  key(opa(markGlow), B.iconMove + 320,   0, 70, 1);

  var slab = roundRect(comp, "02 MARK SLAB", W/2 - 98, H/2 - 98, 196, 196, COL.white, 44, 9);
  var slabStroke = slab.property("ADBE Root Vectors Group")
    .property(1).property("ADBE Vectors Group")
    .addProperty("ADBE Vector Graphic - Stroke");
  slabStroke.property("ADBE Vector Stroke Color").setValue(COL.white);
  slabStroke.property("ADBE Vector Stroke Width").setValue(1);
  slabStroke.property("ADBE Vector Stroke Opacity").setValue(16);

  var markC = text(comp, "02 MARK C", "C", FONT_BLACK, 62, COL.white, -40, ParagraphJustification.CENTER_JUSTIFY);
  pos(markC).setValue([W/2, H/2 + 22]);

  var markTile = roundRect(comp, "02 MARK TILE", W/2 + 46, H/2 + 46, 26, 26, COL.tealBright, 7);

  // One null drives all four, so the overshoot is authored once.
  var markCtl = comp.layers.addNull(DUR);
  markCtl.name = "02 MARK CTRL";
  pos(markCtl).setValue([W/2, H/2]);
  key(scl(markCtl), 0,                       [0, 0],       1,  1);
  key(scl(markCtl), B.iconMove * 0.62,       [110, 110],  62,  8);
  key(scl(markCtl), B.iconMove,              [100, 100],  88,  1);
  // Hands over to the panel: grows and dissolves, so it reads as the camera
  // moving past it rather than as an element being deleted.
  key(scl(markCtl), B.iconMove,              [100, 100],   1,  1);
  key(scl(markCtl), B.iconMove + 320,        [118, 118],  88,  1);
  key(opa(markCtl), 0,                         0,  1,  1);
  key(opa(markCtl), B.iconOpacity,           100, 88,  1);
  key(opa(markCtl), B.iconMove,              100,  1,  1);
  key(opa(markCtl), B.iconMove + 320,          0, 88,  1);

  var markKids = [slab, markC, markTile, markGlow];
  for (var mi = 0; mi < markKids.length; mi++) {
    markKids[mi].parent = markCtl;
    // Opacity does not inherit from a parent, so it is linked instead.
    opa(markKids[mi]).expression =
      'thisComp.layer("02 MARK CTRL").transform.opacity / 100 * value';
  }

  // ══ 03  PANEL ═════════════════════════════════════════════════════════════
  // 2000-2320ms · Y +120 -> 0 with the shadow blooming on the same curve over
  // the same duration. A panel that arrives before its shadow looks pasted on.
  var panel = roundRect(comp, "03 PANEL", PX, PY, PW, PH, COL.panel, 26, 87);
  var pGrp = panel.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group");
  var pStroke = pGrp.addProperty("ADBE Vector Graphic - Stroke");
  pStroke.property("ADBE Vector Stroke Color").setValue(COL.white);
  pStroke.property("ADBE Vector Stroke Width").setValue(1);
  pStroke.property("ADBE Vector Stroke Opacity").setValue(10);

  var pShadow = addFx(panel, "ADBE Drop Shadow");
  pShadow.property("ADBE Drop Shadow-0001").setValue([0, 0, 0]);   // colour
  pShadow.property("ADBE Drop Shadow-0003").setValue(90);          // direction
  pShadow.property("ADBE Drop Shadow-0004").setValue(28);          // distance
  var pShadowOp = pShadow.property("ADBE Drop Shadow-0002");
  var pShadowBl = pShadow.property("ADBE Drop Shadow-0005");
  key(pShadowOp, B.panelFrom,                 0, 1,  1);
  key(pShadowOp, B.panelFrom + B.panelMove, 210, 88, 1);   // 15% of 255, x5.4
  key(pShadowBl, B.panelFrom,                 0, 1,  1);
  key(pShadowBl, B.panelFrom + B.panelMove,  40, 88, 1);

  var panelCtl = comp.layers.addNull(DUR);
  panelCtl.name = "03 PANEL CTRL";
  pos(panelCtl).setValue([W/2, H/2]);
  key(pos(panelCtl), B.panelFrom,                 [W/2, H/2 + 120], 1,  1);
  key(pos(panelCtl), B.panelFrom + B.panelMove,   [W/2, H/2],       88, 1);
  key(opa(panelCtl), B.panelFrom,                 0,   1,  1);
  key(opa(panelCtl), B.panelFrom + B.panelMove, 100,  88,  1);
  key(opa(panelCtl),  9700,                     100,   1,  1);
  key(opa(panelCtl), 10200,                       0,  88,  1);
  panel.parent = panelCtl;
  opa(panel).expression =
    'thisComp.layer("03 PANEL CTRL").transform.opacity / 100 * value';

  // ── Window head ───────────────────────────────────────────────────────────
  var headY = PY + PAD + 22;
  var wm = text(comp, "03 WORDMARK", "CTRL", FONT_BLACK, 19, COL.white, -30);
  pos(wm).setValue([PX + PAD, headY]);
  wm.parent = panelCtl;

  var wmSub = text(comp, "03 WORDMARK SUB", "ROOM", FONT_MONO, 10, COL.tealLight, 140);
  pos(wmSub).setValue([PX + PAD + 72, headY]);
  wmSub.parent = panelCtl;

  var readout = text(comp, "03 READOUT", "LIVE · AMMAN · 31.9539° N", FONT_MONO, 10,
    [1, 1, 1], 140, ParagraphJustification.RIGHT_JUSTIFY);
  pos(readout).setValue([PX + PW - PAD, headY]);
  opa(readout).setValue(50);
  readout.parent = panelCtl;

  // ── Tabs ──────────────────────────────────────────────────────────────────
  // The underline is ONE layer that slides. Three underlines fading in and out
  // would lose the sense of a single indicator moving between destinations.
  var tabY = PY + PAD + 92;
  var tabX = [PX + PAD, PX + PAD + 120, PX + PAD + 240];
  for (var ti = 0; ti < TABS.length; ti++) {
    var tl = text(comp, "04 TAB " + TABS[ti], TABS[ti], FONT_MEDIUM, 13, COL.white, 120);
    pos(tl).setValue([tabX[ti], tabY]);
    tl.parent = panelCtl;
    // Active tab is full white, the others sit back at 42%.
    var onFrom = (ti === 0) ? 0 : B.tabSwitch[ti - 1];
    var onTo   = (ti === TABS.length - 1) ? 999999 : B.tabSwitch[ti];
    opa(tl).expression =
      "var on = time >= " + s(onFrom) + " && time < " + s(onTo) + ";\n" +
      "on ? 100 : 42";
  }

  var rule = solid(comp, "04 TAB RULE", COL.white, PW - PAD * 2, 1);
  pos(rule).setValue([W / 2, tabY + 12]);
  opa(rule).setValue(8);
  rule.parent = panelCtl;

  var underline = solid(comp, "04 TAB UNDERLINE", COL.tealBright, 84, 2);
  pos(underline).setValue([tabX[0] + 42, tabY + 12]);
  underline.parent = panelCtl;
  key(pos(underline), B.tabSwitch[0],             [tabX[0] + 42, tabY + 12], 1,  1);
  key(pos(underline), B.tabSwitch[0] + B.tabMove, [tabX[1] + 42, tabY + 12], 88, 1);
  key(pos(underline), B.tabSwitch[1],             [tabX[1] + 42, tabY + 12], 1,  1);
  key(pos(underline), B.tabSwitch[1] + B.tabMove, [tabX[2] + 42, tabY + 12], 88, 1);

  // ── Tab bodies ────────────────────────────────────────────────────────────
  // Out over 150ms, in over 200ms, with a 50ms overlap so the switch never
  // passes through an empty frame. That overlap is the whole difference
  // between a crossfade and a blink.
  function tabBody(index) {
    var n = comp.layers.addNull(DUR);
    n.name = "05 TAB BODY " + index;
    n.parent = panelCtl;
    var o = opa(n);
    if (index === 0) {
      o.setValue(100);
      key(o, B.tabSwitch[0],              100, 1,  1);
      key(o, B.tabSwitch[0] + B.tabOut,     0, 88, 1);
    } else if (index === 1) {
      o.setValue(0);
      key(o, B.tabSwitch[0] + B.tabOut - B.tabOverlap,           0, 1,  1);
      key(o, B.tabSwitch[0] + B.tabOut - B.tabOverlap + B.tabIn, 100, 88, 1);
      key(o, B.tabSwitch[1],             100, 1,  1);
      key(o, B.tabSwitch[1] + B.tabOut,    0, 88, 1);
    } else {
      o.setValue(0);
      key(o, B.tabSwitch[1] + B.tabOut - B.tabOverlap,           0, 1,  1);
      key(o, B.tabSwitch[1] + B.tabOut - B.tabOverlap + B.tabIn, 100, 88, 1);
    }
    return n;
  }
  var body0 = tabBody(0), body1 = tabBody(1), body2 = tabBody(2);

  function linkOpacity(layer, ctlName) {
    layer.parent = comp.layer(ctlName);
    opa(layer).expression =
      'thisComp.layer("03 PANEL CTRL").transform.opacity / 100 * ' +
      'thisComp.layer("' + ctlName + '").transform.opacity / 100 * value';
  }

  // ══ 06  SIGNAL BARS ═══════════════════════════════════════════════════════
  // 3200-4500ms · Scale Y 20 -> 100 -> 60, 150ms per bar, 30ms stagger.
  //
  // The stagger is why it reads as organic rather than as an equaliser graphic:
  // every bar on the same phase is a graph, each one 30ms behind its neighbour
  // is a wave travelling along the row. It is expression-driven rather than
  // keyed because 26 bars x 3 keys is 78 keyframes nobody wants to re-time.
  var barTop = PY + PAD + 130;
  var BARS = 26;
  for (var bi = 0; bi < BARS; bi++) {
    var bar = solid(comp, "06 BAR " + (bi + 1),
      (bi % 5 === 0) ? COL.tealBright : COL.white, 4, 104);
    pos(bar).setValue([PX + PAD + bi * 11 + 2, barTop + 104]);
    xf(bar).property("ADBE Anchor Point").setValue([2, 104]);   // bottom-centre
    if (bi % 5 !== 0) opa(bar).setValue(55);
    scl(bar).expression =
      "var t0 = " + s(B.barsFrom) + ";\n" +
      "var per = " + s(B.barPer) + ";\n" +
      "var stag = " + s(B.barStagger) + ";\n" +
      "var local = (time - t0 - " + bi + " * stag) / (per * 2);\n" +
      "var phase = local - Math.floor(local);\n" +
      "var h = phase < 0.34 ? linear(phase, 0, 0.34, 20, 100)\n" +
      "      : phase < 0.68 ? linear(phase, 0.34, 0.68, 100, 60)\n" +
      "      : linear(phase, 0.68, 1, 60, 20);\n" +
      "[100, h]";
    linkOpacity(bar, "05 TAB BODY 0");
  }

  var barLabel = text(comp, "06 BAR LABEL", "INDEXING · AMMAN · LIVE", FONT_MONO, 10, COL.white, 140);
  pos(barLabel).setValue([PX + PAD, barTop + 134]);
  opa(barLabel).setValue(46);
  linkOpacity(barLabel, "05 TAB BODY 0");

  // ══ 07  TYPEWRITER ════════════════════════════════════════════════════════
  // 4500ms on · 25ms per character, 60ms between lines, with each glyph
  // arriving from X +8 as it fades. The X offset is what separates this from a
  // fade: every glyph comes from slightly ahead of its slot, so the line has
  // direction.
  //
  // A Range Selector driven by a linear Offset is the AE-native way to do this.
  // Do NOT ease the Offset — the characters must arrive at a constant rate or
  // the typing reads as mechanical at one end and rushed at the other.
  var rowStart = B.typeFrom;
  for (var ri = 0; ri < ROWS.length; ri++) {
    var row = ROWS[ri];
    var rowY = PY + PAD + 300 + ri * 62;

    var num = text(comp, "07 ROW NUM " + (ri + 1),
      (ri + 1 < 10 ? "0" : "") + (ri + 1), FONT_MONO, 10, COL.white, 140);
    pos(num).setValue([PX + PAD, rowY]);
    opa(num).setValue(42);
    linkOpacity(num, "05 TAB BODY 0");

    var rowRule = solid(comp, "07 ROW RULE " + (ri + 1), COL.white, PW - PAD * 2, 1);
    pos(rowRule).setValue([W / 2, rowY - 26]);
    opa(rowRule).setValue(8);
    linkOpacity(rowRule, "05 TAB BODY 0");

    var rowTxt = text(comp, "07 ROW " + (ri + 1), row, FONT_MEDIUM, 21, COL.white, 0);
    pos(rowTxt).setValue([PX + PAD + 34, rowY]);
    opa(rowTxt).setValue(94);
    linkOpacity(rowTxt, "05 TAB BODY 0");

    var anim = rowTxt.property("ADBE Text Properties")
      .property("ADBE Text Animators").addProperty("ADBE Text Animator");
    anim.name = "Type in";
    var sel = anim.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    var selProps = sel.property("ADBE Text Percent Start") ? sel : sel;
    sel.property("ADBE Text Index Start").setValue(0);
    sel.property("ADBE Text Index End").setValue(0);
    var off = sel.property("ADBE Text Index Offset");
    var props = anim.property("ADBE Text Animator Properties");
    props.addProperty("ADBE Text Opacity").setValue(0);
    props.addProperty("ADBE Text Position").setValue([8, 0]);

    var rowEnd = rowStart + row.length * B.perChar;
    key(off, rowStart, 0,          50, 50, 0);
    key(off, rowEnd,   row.length, 50, 50, 0);
    // Linear: constant character rate. Overwrite the eases the helper set.
    off.setInterpolationTypeAtKey(off.nearestKeyIndex(s(rowStart)),
      KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);
    off.setInterpolationTypeAtKey(off.nearestKeyIndex(s(rowEnd)),
      KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);

    rowStart = rowEnd + B.perLine;
  }

  // Caret. 500ms cycle, so 250ms lit and 250ms dark.
  var caret = solid(comp, "07 CARET", COL.tealBright, 2, 20);
  pos(caret).setValue([PX + PAD + 40, PY + PAD + 296]);
  opa(caret).expression =
    "var cyc = " + s(B.caret) + ";\n" +
    "(time % cyc) < cyc / 2 ? 100 : 0";
  linkOpacity(caret, "05 TAB BODY 0");
  warnings.push(
    "The caret is a static bar at the first row's start. Parent it to the end " +
    "of whichever row is typing if you want it to follow, or delete it."
  );

  // ══ 08  EVENT ROWS (tab two) ══════════════════════════════════════════════
  var EVENTS = ["Placeholder Night", "Placeholder Session", "Placeholder Weekend"];
  for (var ei2 = 0; ei2 < EVENTS.length; ei2++) {
    var eY = PY + PAD + 178 + ei2 * 62;
    var eNum = text(comp, "08 EVENT NUM " + (ei2 + 1), "0" + (ei2 + 1), FONT_MONO, 10, COL.white, 140);
    pos(eNum).setValue([PX + PAD, eY]);
    opa(eNum).setValue(42);
    linkOpacity(eNum, "05 TAB BODY 1");

    var eTxt = text(comp, "08 EVENT " + (ei2 + 1), EVENTS[ei2], FONT_MEDIUM, 21, COL.white, 0);
    pos(eTxt).setValue([PX + PAD + 34, eY]);
    opa(eTxt).setValue(94);
    linkOpacity(eTxt, "05 TAB BODY 1");

    var eTbc = text(comp, "08 EVENT TBC " + (ei2 + 1), "TBC", FONT_MONO, 11, COL.white, 140,
      ParagraphJustification.RIGHT_JUSTIFY);
    pos(eTbc).setValue([PX + PW - PAD, eY]);
    opa(eTbc).setValue(42);
    linkOpacity(eTbc, "05 TAB BODY 1");
  }

  // ══ 09  COUNTERS (tab three) ══════════════════════════════════════════════
  // 8000-9200ms · 0 -> target over 1200ms on an ease-out, with the card
  // popping 95 -> 105 -> 100 over 400ms from 80% of that run.
  //
  // The pop landing BEFORE the number stops is the detail: the card is
  // reacting to the count finishing, and a reaction that arrives after the
  // event it is reacting to reads as lag.
  var cardW = (PW - PAD * 2 - 20) / 2, cardH = 150;
  var cardY = PY + PH / 2 - cardH / 2 + 20;
  var COUNTS = [
    {to: COUNT_A, label: "PLACES INDEXED"},
    {to: COUNT_B, label: "AREAS COVERED"}
  ];
  var popStart = B.countFrom + B.countRun * B.countPopAt;

  for (var ci = 0; ci < COUNTS.length; ci++) {
    var cx = PX + PAD + ci * (cardW + 20);
    var card = roundRect(comp, "09 CARD " + (ci + 1), cx, cardY, cardW, cardH, COL.white, 16, 5);
    var cGrp = card.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group");
    var cStroke = cGrp.addProperty("ADBE Vector Graphic - Stroke");
    cStroke.property("ADBE Vector Stroke Color").setValue(COL.white);
    cStroke.property("ADBE Vector Stroke Width").setValue(1);
    cStroke.property("ADBE Vector Stroke Opacity").setValue(10);
    key(scl(card), popStart,                      [95, 95],   1,  1);
    key(scl(card), popStart + B.countPop * 0.45, [105, 105], 62,  8);
    key(scl(card), popStart + B.countPop,        [100, 100], 88,  1);
    linkOpacity(card, "05 TAB BODY 2");

    var fig = text(comp, "09 FIGURE " + (ci + 1), "0", FONT_BLACK, 74, COL.white, -35);
    pos(fig).setValue([cx + 28, cardY + 84]);
    // A Slider carries the value so the number and its easing live on one
    // property that can be re-timed without touching the text.
    var sliderFx = addFx(fig, "ADBE Slider Control");
    var slider = sliderFx.property("ADBE Slider Control-0001");
    key(slider, B.countFrom,               0,           1,  1);
    key(slider, B.countFrom + B.countRun,  COUNTS[ci].to, 88, 1);
    fig.property("ADBE Text Properties").property("ADBE Text Document").expression =
      'Math.round(effect("Slider Control")("Slider")).toFixed(0)';
    linkOpacity(fig, "05 TAB BODY 2");

    var cLabel = text(comp, "09 LABEL " + (ci + 1), COUNTS[ci].label, FONT_MONO, 11, COL.white, 140);
    pos(cLabel).setValue([cx + 28, cardY + 118]);
    opa(cLabel).setValue(50);
    linkOpacity(cLabel, "05 TAB BODY 2");
  }

  // ══ 10  LOCKUP ════════════════════════════════════════════════════════════
  // 10000-10400ms · Opacity 0 -> 100 and Y +10 -> 0, then a 500ms hold. The
  // rule wipes in 160ms late and the tagline 280ms late, so the three elements
  // resolve in reading order rather than together — the same staggered arrival
  // as the mark at the top, which is what closes the loop.
  function riseIn(layer, delay, y) {
    key(opa(layer), B.outroFrom + delay,               0,   1, 1);
    key(opa(layer), B.outroFrom + delay + B.outroMove, 100, 88, 1);
    key(pos(layer), B.outroFrom + delay,               [W/2, y + 10], 1,  1);
    key(pos(layer), B.outroFrom + delay + B.outroMove, [W/2, y],      88, 1);
  }

  var lockup = text(comp, "10 LOCKUP", "CTRL ROOM", FONT_BLACK, 96, COL.white, -45,
    ParagraphJustification.CENTER_JUSTIFY);
  riseIn(lockup, 0, H/2 - 8);

  var outRule = solid(comp, "10 RULE", COL.tealBright, 340, 1);
  pos(outRule).setValue([W/2, H/2 + 52]);
  key(scl(outRule), B.outroFrom + 160,               [0, 100],   1,  1);
  key(scl(outRule), B.outroFrom + 160 + B.outroMove, [100, 100], 88, 1);
  key(opa(outRule), B.outroFrom + 160,               0,   1, 1);
  key(opa(outRule), B.outroFrom + 160 + 120,       100,  88, 1);

  var tagline = text(comp, "10 TAGLINE", "JORDAN, SWITCHED ON.", FONT_MONO, 13, COL.white, 220,
    ParagraphJustification.CENTER_JUSTIFY);
  riseIn(tagline, 280, H/2 + 100);
  // riseIn keys opacity to 100; the tagline sits back at 78.
  var tagOp = opa(tagline);
  tagOp.setValueAtTime(s(B.outroFrom + 280 + B.outroMove), 78);

  // ══ 11  GRADE ═════════════════════════════════════════════════════════════
  // One layer for the whole frame. Grading per element is how a frame ends up
  // incoherent: every element gets graded by the amount whoever built it
  // remembered, rather than by the same amount.
  var lift = solid(comp, "11 LIFT", [0.110, 0.133, 0.133]);
  lift.blendingMode = BlendingMode.SCREEN;
  opa(lift).setValue(5);

  var bloom = solid(comp, "11 BLOOM", COL.tealBright);
  var bRamp = addFx(bloom, "ADBE Ramp");
  bRamp.property("ADBE Ramp-0001").setValue([W * 0.5, H * 0.92]);
  bRamp.property("ADBE Ramp-0002").setValue(COL.tealBright);
  bRamp.property("ADBE Ramp-0003").setValue([W * 0.5, H * 0.30]);
  bRamp.property("ADBE Ramp-0004").setValue(COL.ink);
  bRamp.property("ADBE Ramp-0005").setValue(2);
  bloom.blendingMode = BlendingMode.SCREEN;
  opa(bloom).setValue(13);

  var vig = solid(comp, "11 VIGNETTE", [0, 0, 0]);
  var vMask = vig.Masks.addProperty("Mask");
  var vShape = new Shape();
  vShape.vertices = [
    [W * 0.14, H * 0.06], [W * 0.86, H * 0.06],
    [W * 0.86, H * 0.94], [W * 0.14, H * 0.94]
  ];
  vShape.closed = true;
  vMask.property("ADBE Mask Shape").setValue(vShape);
  vMask.maskMode = MaskMode.SUBTRACT;
  vMask.maskFeather.setValue([320, 320]);
  vMask.maskExpansion.setValue(-40);
  opa(vig).setValue(15);

  var grain = solid(comp, "11 GRAIN", [0.5, 0.5, 0.5]);
  var noise = addFx(grain, "ADBE Fractal Noise");
  noise.property("ADBE Fractal Noise-0001").setValue(3);    // fractal type
  noise.property("ADBE Fractal Noise-0012").setValue(0.9);  // contrast-ish
  noise.property("ADBE Fractal Noise-0007").setValue(4);    // complexity
  // Reseed every frame, or it reads as a texture overlay rather than as film.
  noise.property("ADBE Fractal Noise-0016").expression = "time * 900";
  grain.blendingMode = BlendingMode.OVERLAY;
  opa(grain).setValue(13);

  // ── Layer order: grade over everything, grain last. ───────────────────────
  grain.moveToBeginning();
  vig.moveToBeginning();
  bloom.moveToBeginning();
  lift.moveToBeginning();

  app.endUndoGroup();

  var msg = "CTRL_Flow built: " + comp.numLayers + " layers, 12.000s at 30fps.";
  if (warnings.length) {
    msg += "\n\nCheck these:\n\n· " + warnings.join("\n\n· ");
  }
  alert(msg);
})();
