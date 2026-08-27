/**
 * CTRL Room — Motion Reel
 * Auto-builds the full comp in After Effects.
 *
 * USE:  File > Scripts > Run Script File…  →  CTRL_Room_Reel.jsx
 * NEEDS: Archivo (Bold / Black) and JetBrains Mono installed. If a font is
 *        missing AE substitutes silently — check the text layers after the run.
 *
 * Everything is expressed in MILLISECONDS at the top and converted once, so the
 * timings here and the timings in the spec sheet are the same numbers.
 */

(function () {
  // ── CONFIG ────────────────────────────────────────────────────────────────
  var W = 1920, H = 1080, FPS = 30, DUR = 5.0;

  var COL = {
    ink:        [0.027, 0.035, 0.039],  // #07090A
    teal:       [0.000, 0.396, 0.388],  // #006563
    tealBright: [0.000, 0.663, 0.643],  // #00A9A4
    tealLight:  [0.310, 0.820, 0.796],  // #4FD1CA
    white:      [1, 1, 1]
  };

  var FONT_DISPLAY = "Archivo-Bold";
  var FONT_BLACK   = "Archivo-Black";
  var FONT_MONO    = "JetBrainsMono-Medium";

  var KEYWORD = "SWITCHED";
  var BRAND_A = "CTRL";
  var BRAND_B = "ROOM";
  var TAGLINE = "JORDAN, SWITCHED ON";

  // ── HELPERS ───────────────────────────────────────────────────────────────
  var s = function (msVal) { return msVal / 1000; };          // ms  -> seconds
  var f = function (msVal) { return (msVal / 1000) * FPS; };  // ms  -> frames

  /**
   * Key a property and shape its speed graph.
   * inf = influence %, the number in the Graph Editor's keyframe dialog.
   *   fast-out / slow-in  ->  out influence low (1), in influence high (88)
   */
  function key(prop, msVal, value, easeInInf, easeOutInf, spd) {
    var t = s(msVal);
    prop.setValueAtTime(t, value);
    var idx = prop.nearestKeyIndex(t);
    var speed = (spd === undefined) ? 0 : spd;
    var ei = (easeInInf === undefined) ? 75 : easeInInf;
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

  function xf(layer)      { return layer.property("ADBE Transform Group"); }
  function pos(layer)     { return xf(layer).property("ADBE Position"); }
  function scale(layer)   { return xf(layer).property("ADBE Scale"); }
  function opacity(layer) { return xf(layer).property("ADBE Opacity"); }

  function addFx(layer, matchName) {
    return layer.property("ADBE Effect Parade").addProperty(matchName);
  }

  function solid(comp, name, color, w, h) {
    return comp.layers.addSolid(color, name, w || W, h || H, 1, DUR);
  }

  // ── COMP ──────────────────────────────────────────────────────────────────
  app.beginUndoGroup("Build CTRL Room Reel");

  var proj = app.project || app.newProject();
  var comp = proj.items.addComp("CTRL_Room_Reel", W, H, 1, DUR, FPS);
  comp.bgColor = COL.ink;
  comp.motionBlur = true;
  comp.shutterAngle = 180;          // brief: 180 degree shutter
  comp.shutterPhase = -90;
  comp.motionBlurSamplesPerFrame = 16;
  comp.motionBlurAdaptiveSampleLimit = 128;
  comp.openInViewer();

  // ══ 01  FIELD — gradient background ═══════════════════════════════════════
  // 0-300ms  opacity 0 -> 100
  var field = solid(comp, "01 FIELD", COL.ink);
  var ramp = addFx(field, "ADBE Ramp");
  ramp.property("ADBE Ramp-0001").setValue([W * 0.30, H * 0.42]);   // start
  ramp.property("ADBE Ramp-0002").setValue(COL.teal);               // start colour
  ramp.property("ADBE Ramp-0003").setValue([W * 0.92, H * 0.96]);   // end
  ramp.property("ADBE Ramp-0004").setValue(COL.ink);                // end colour
  ramp.property("ADBE Ramp-0005").setValue(2);                      // radial
  ramp.property("ADBE Ramp-0007").setValue(28);                     // ramp scatter

  // A second, slower mass so the field never reads as one flat wash.
  var field2 = solid(comp, "01b FIELD BLOOM", COL.tealBright);
  var r2 = addFx(field2, "ADBE Ramp");
  r2.property("ADBE Ramp-0001").setValue([W * 0.74, H * 0.66]);
  r2.property("ADBE Ramp-0002").setValue(COL.tealBright);
  r2.property("ADBE Ramp-0003").setValue([W * 0.20, H * 0.10]);
  r2.property("ADBE Ramp-0004").setValue(COL.ink);
  r2.property("ADBE Ramp-0005").setValue(2);
  addFx(field2, "ADBE Gaussian Blur 2").property("ADBE Gaussian Blur 2-0001").setValue(180);
  field2.blendingMode = BlendingMode.SCREEN;
  opacity(field2).setValue(38);
  // Slow drift, so the background is never static.
  pos(field2).expression =
    "x = Math.sin(time/3.9*Math.PI*2)*90;\n" +
    "y = Math.cos(time/4.7*Math.PI*2)*60;\n" +
    "value + [x, y]";

  key(opacity(field), 0,   0,   1,  1);
  key(opacity(field), 300, 100, 82, 1);
  key(opacity(field2), 0,   0,  1,  1);
  key(opacity(field2), 300, 38, 82, 1);

  // ══ 02  SWEEP — trim path arc ═════════════════════════════════════════════
  // 2200-3500ms  Trim End 0 -> 100.  Linear through the first half, Ease In on
  // the second, so the head accelerates out of frame instead of gliding to a stop.
  var sweep = comp.layers.addShape();
  sweep.name = "02 SWEEP";
  var sgrp = sweep.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  var sc = sgrp.property("ADBE Vectors Group");

  var pathProp = sc.addProperty("ADBE Vector Shape - Group");
  var shp = new Shape();
  shp.vertices = [[-60, 742], [480, 300], [960, 300], [1500, 742], [1980, 470]];
  shp.inTangents  = [[0,0], [-220, 90], [-180, 0], [-160, -120], [-180, 60]];
  shp.outTangents = [[300,0], [220, -90], [260, 0], [160, 120], [0,0]];
  shp.closed = false;
  pathProp.property("ADBE Vector Shape").setValue(shp);

  var stroke = sc.addProperty("ADBE Vector Graphic - Stroke");
  stroke.property("ADBE Vector Stroke Color").setValue(COL.tealBright);
  stroke.property("ADBE Vector Stroke Line Cap").setValue(2);   // round
  var sw = stroke.property("ADBE Vector Stroke Width");

  var trim = sc.addProperty("ADBE Vector Filter - Trim");
  var trimEnd = trim.property("ADBE Vector Trim End");

  key(trimEnd, 2200, 0,   1,  1);          // linear out
  key(trimEnd, 2850, 50,  50, 50);         // linear through the midpoint
  key(trimEnd, 3500, 100, 1,  30);         // ease in, accelerating away

  // Stroke pulses 1 -> 3 -> 1 across the draw.
  key(sw, 2200, 1, 1,  1);
  key(sw, 2850, 3, 70, 70);
  key(sw, 3500, 1, 70, 1);

  var glo = addFx(sweep, "ADBE Glo2");
  glo.property("ADBE Glo2-0002").setValue(1);    // glow based on: alpha
  glo.property("ADBE Glo2-0003").setValue(0);    // threshold
  glo.property("ADBE Glo2-0004").setValue(24);   // radius
  glo.property("ADBE Glo2-0005").setValue(1.4);  // intensity

  key(opacity(sweep), 3400, 100, 1, 1);
  key(opacity(sweep), 3720, 0,   70, 1);

  // ══ 03  PULSE — 3 circles + 2 triangles ═══════════════════════════════════
  // 1800-3200ms  Scale 0 -> 140 -> 110 -> 100 (10% overshoot, then settle)
  var pulseDefs = [
    {n: "CIRCLE A", t: "e", x: 296,  y: 300, sz: 220, d: 0,   c: COL.tealBright},
    {n: "CIRCLE B", t: "e", x: 1618, y: 762, sz: 268, d: 90,  c: COL.teal},
    {n: "CIRCLE C", t: "e", x: 1500, y: 246, sz: 150, d: 180, c: COL.tealLight},
    {n: "TRI A",    t: "p", x: 402,  y: 806, sz: 178, d: 250, c: COL.tealBright},
    {n: "TRI B",    t: "p", x: 1128, y: 176, sz: 122, d: 330, c: COL.teal}
  ];

  for (var i = 0; i < pulseDefs.length; i++) {
    var d = pulseDefs[i];
    var L = comp.layers.addShape();
    L.name = "03 PULSE " + d.n;
    var g = L.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    var c = g.property("ADBE Vectors Group");

    if (d.t === "e") {
      var ell = c.addProperty("ADBE Vector Shape - Ellipse");
      ell.property("ADBE Vector Ellipse Size").setValue([d.sz, d.sz]);
    } else {
      var pg = c.addProperty("ADBE Vector Shape - Star");
      pg.property("ADBE Vector Star Type").setValue(2);          // polygon
      pg.property("ADBE Vector Star Points").setValue(3);
      pg.property("ADBE Vector Star Outer Radius").setValue(d.sz / 2);
      pg.property("ADBE Vector Star Rotation").setValue(0);
    }

    var fill = c.addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue(d.c);
    fill.property("ADBE Vector Fill Opacity").setValue(55);

    var st = c.addProperty("ADBE Vector Graphic - Stroke");
    st.property("ADBE Vector Stroke Color").setValue(COL.white);
    st.property("ADBE Vector Stroke Opacity").setValue(20);      // brief: 20%
    st.property("ADBE Vector Stroke Width").setValue(2);

    // 30px Gaussian on the fill only — the stroke stays crisp, which is what
    // keeps a blurred disc from reading as a smudge.
    var bl = addFx(L, "ADBE Gaussian Blur 2");
    bl.property("ADBE Gaussian Blur 2-0001").setValue(30);
    bl.property("ADBE Gaussian Blur 2-0003").setValue(true);     // repeat edge

    pos(L).setValue([d.x, d.y]);

    var t0 = 1800 + d.d;
    key(scale(L), t0,        [0, 0],       1,  1);
    key(scale(L), t0 + 420,  [140, 140],   62, 8);
    key(scale(L), t0 + 760,  [110, 110],   50, 50);
    key(scale(L), t0 + 1000, [100, 100],   88, 1);

    key(opacity(L), t0,       0,   1,  1);
    key(opacity(L), t0 + 260, 100, 78, 1);
    key(opacity(L), 3260,     100, 1,  1);
    key(opacity(L), 3600,     35,  70, 1);

    // A slow bob, so nothing in frame is ever perfectly still.
    pos(L).expression =
      "value + [0, Math.sin((time - " + s(t0) + ")/3.2*Math.PI*2)*7]";
  }

  // ══ 04  MARK — glass slab brand reveal ════════════════════════════════════
  // 0-500ms  Scale 95 -> 100, glow blooms.  Clears 300-620ms into the keyword.
  var slab = comp.layers.addShape();
  slab.name = "04 MARK SLAB";
  var mg = slab.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  var mc = mg.property("ADBE Vectors Group");
  var rect = mc.addProperty("ADBE Vector Shape - Rect");
  rect.property("ADBE Vector Rect Size").setValue([196, 196]);
  rect.property("ADBE Vector Rect Roundness").setValue(34);
  var mfill = mc.addProperty("ADBE Vector Graphic - Fill");
  mfill.property("ADBE Vector Fill Color").setValue(COL.white);
  mfill.property("ADBE Vector Fill Opacity").setValue(7);
  var mst = mc.addProperty("ADBE Vector Graphic - Stroke");
  mst.property("ADBE Vector Stroke Color").setValue(COL.white);
  mst.property("ADBE Vector Stroke Opacity").setValue(22);
  mst.property("ADBE Vector Stroke Width").setValue(1.5);
  pos(slab).setValue([W / 2, H / 2]);

  var core = comp.layers.addShape();
  core.name = "04 MARK CORE";
  var cg = core.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  var cc = cg.property("ADBE Vectors Group");
  var crect = cc.addProperty("ADBE Vector Shape - Rect");
  crect.property("ADBE Vector Rect Size").setValue([52, 52]);
  var cfill = cc.addProperty("ADBE Vector Graphic - Fill");
  cfill.property("ADBE Vector Fill Color").setValue(COL.tealBright);
  pos(core).setValue([W / 2, H / 2]);
  var cglo = addFx(core, "ADBE Glo2");
  cglo.property("ADBE Glo2-0004").setValue(44);
  var gloInt = cglo.property("ADBE Glo2-0005");
  key(gloInt, 120, 0,   1,  1);
  key(gloInt, 420, 2.2, 70, 8);
  key(gloInt, 900, 0.7, 80, 1);

  var markLayers = [slab, core];
  for (var m = 0; m < markLayers.length; m++) {
    var L2 = markLayers[m];
    key(scale(L2), 0,   [95, 95],   1,  1);
    key(scale(L2), 500, [100, 100], 88, 1);   // cubic-bezier(0.22,1,0.36,1)
    key(scale(L2), 620, [150, 150], 1,  60);  // blooms away as the word lands
    key(opacity(L2), 0,   0,   1,  1);
    key(opacity(L2), 220, 100, 78, 1);
    key(opacity(L2), 300, 100, 1,  1);
    key(opacity(L2), 620, 0,   70, 1);
  }

  // ══ 05  KEYWORD — per-character kinetic type ══════════════════════════════
  // 300-1800ms  Y +60 -> 0, Opacity 0 -> 100, 40ms stagger, 180 shutter on.
  var kw = comp.layers.addText(KEYWORD);
  kw.name = "05 KEYWORD";
  var kdoc = kw.property("ADBE Text Properties").property("ADBE Text Document").value;
  kdoc.resetCharStyle();
  kdoc.font = FONT_DISPLAY;
  kdoc.fontSize = 172;
  kdoc.fillColor = COL.white;
  kdoc.applyFill = true;
  kdoc.applyStroke = false;
  kdoc.tracking = -45;
  kdoc.justification = ParagraphJustification.CENTER_JUSTIFY;
  kw.property("ADBE Text Properties").property("ADBE Text Document").setValue(kdoc);
  pos(kw).setValue([W / 2, H / 2 + 60]);
  kw.motionBlur = true;

  var anims = kw.property("ADBE Text Properties").property("ADBE Text Animators");
  var an = anims.addProperty("ADBE Text Animator");
  an.name = "Y + Opacity";
  var aprops = an.property("ADBE Text Animator Properties");
  aprops.addProperty("ADBE Text Position 3D").setValue([0, 60, 0]);
  aprops.addProperty("ADBE Text Opacity").setValue(0);

  var sel = an.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
  sel.property("ADBE Text Percent Start").setValue(0);
  sel.property("ADBE Text Percent End").setValue(0);
  var adv = sel.property("ADBE Text Range Advanced");
  adv.property("ADBE Text Range Type2").setValue(2);       // shape: Ramp Up
  adv.property("ADBE Text Levels Max Ease").setValue(45);  // brief: Ease Out 45%
  adv.property("ADBE Text Levels Min Ease").setValue(0);

  // Offset drives the cascade. Chars * 40ms stagger + 520ms per char.
  var offs = sel.property("ADBE Text Percent Offset");
  key(offs, 300,  -100, 1,  1);
  key(offs, 1800, 100,  80, 12);

  key(opacity(kw), 300,  100, 1, 1);
  key(opacity(kw), 3300, 100, 1, 1);
  key(opacity(kw), 3560, 0,   70, 1);
  key(pos(kw), 300,  [W / 2, H / 2 + 60], 1,  1);
  key(pos(kw), 3560, [W / 2, H / 2 + 34], 60, 60);

  // ══ 06  LOCKUP — logo + tagline ═══════════════════════════════════════════
  // 3500-4500ms.  Logo scale 0 -> 110 -> 100 over 500ms.
  // Tagline opacity 0 -> 100 + Y +10 -> 0 over 400ms.  Hold to 5000ms.
  var lock = comp.layers.addText(BRAND_A + "   " + BRAND_B);
  lock.name = "06 LOCKUP";
  var ldoc = lock.property("ADBE Text Properties").property("ADBE Text Document").value;
  ldoc.resetCharStyle();
  ldoc.font = FONT_BLACK;
  ldoc.fontSize = 152;
  ldoc.fillColor = COL.white;
  ldoc.applyFill = true;
  ldoc.applyStroke = false;
  ldoc.tracking = -35;
  ldoc.justification = ParagraphJustification.CENTER_JUSTIFY;
  lock.property("ADBE Text Properties").property("ADBE Text Document").setValue(ldoc);
  pos(lock).setValue([W / 2, H / 2 - 20]);

  key(scale(lock), 3500, [0, 0],       1,  1);
  key(scale(lock), 3800, [110, 110],   58, 6);
  key(scale(lock), 4000, [100, 100],   88, 1);
  key(opacity(lock), 3500, 0,   1,  1);
  key(opacity(lock), 3740, 100, 78, 1);

  var rule = solid(comp, "06 RULE", COL.tealBright, 340, 1);
  pos(rule).setValue([W / 2, H / 2 + 70]);
  key(scale(rule), 3820, [0, 100],   1,  1);
  key(scale(rule), 4260, [100, 100], 85, 1);
  key(opacity(rule), 3820, 0,  1, 1);
  key(opacity(rule), 3900, 90, 70, 1);

  var tag = comp.layers.addText(TAGLINE);
  tag.name = "06 TAGLINE";
  var tdoc = tag.property("ADBE Text Properties").property("ADBE Text Document").value;
  tdoc.resetCharStyle();
  tdoc.font = FONT_MONO;
  tdoc.fontSize = 30;
  tdoc.fillColor = COL.white;
  tdoc.applyFill = true;
  tdoc.applyStroke = false;
  tdoc.tracking = 340;
  tdoc.justification = ParagraphJustification.CENTER_JUSTIFY;
  tag.property("ADBE Text Properties").property("ADBE Text Document").setValue(tdoc);
  opacity(tag).setValue(78);

  key(pos(tag), 3920, [W / 2, H / 2 + 150], 1,  1);
  key(pos(tag), 4320, [W / 2, H / 2 + 140], 85, 1);
  key(opacity(tag), 3920, 0,  1,  1);
  key(opacity(tag), 4320, 78, 78, 1);

  // ══ 07  GRAIN + VIGNETTE ══════════════════════════════════════════════════
  var grain = solid(comp, "07 GRAIN", [0.5, 0.5, 0.5]);
  addFx(grain, "ADBE Fractal Noise")
    .property("ADBE Fractal Noise-0007").setValue(24);   // contrast
  grain.blendingMode = BlendingMode.OVERLAY;
  opacity(grain).setValue(5);

  var vig = solid(comp, "07 VIGNETTE", [0, 0, 0]);
  var vigMask = vig.Masks.addProperty("Mask");
  var mShape = new Shape();
  mShape.vertices = [[-200, -200], [W + 200, -200], [W + 200, H + 200], [-200, H + 200]];
  mShape.closed = true;
  vigMask.property("ADBE Mask Shape").setValue(mShape);
  vigMask.maskMode = MaskMode.SUBTRACT;
  vigMask.maskFeather.setValue([320, 320]);
  vigMask.maskExpansion.setValue(-260);
  opacity(vig).setValue(52);

  // ── LAYER ORDER (bottom -> top) ───────────────────────────────────────────
  // AE stacks newest on top, so this reverses into the order the spec lists.
  var order = ["01b FIELD BLOOM", "01 FIELD"];
  for (var q = 0; q < order.length; q++) {
    var lay = comp.layer(order[q]);
    if (lay) lay.moveToEnd();
  }
  comp.layer("07 VIGNETTE").moveToBeginning();
  comp.layer("07 GRAIN").moveToBeginning();

  app.endUndoGroup();

  alert(
    "CTRL Room reel built.\n\n" +
    "Comp: 1920x1080 @ 30fps, 5.000s\n" +
    "Motion blur ON, 180 degree shutter\n\n" +
    "Check the text layers if Archivo or JetBrains Mono are not installed —\n" +
    "AE substitutes a fallback silently."
  );
})();
