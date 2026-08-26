import {GlyphMesh} from './GlyphMesh';

/**
 * The background treatment: a foil-stamped "ctrl" pressed into the page, with
 * the micro-pattern mesh over it.
 *
 * The wordmark is set at 34vw and cropped by the section, so on any screen it
 * reads as a texture the page was printed on rather than as a piece of large
 * type someone forgot to delete. Both layers are masked to fade out before they
 * reach the content, which is the whole difference between "embossed leather"
 * and "busy background".
 */
export function Watermark({
  word = 'ctrl',
  className = '',
  meshId = 'page-mesh',
}: {
  word?: string;
  className?: string;
  meshId?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            'radial-gradient(70% 62% at 50% 46%, black 8%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(70% 62% at 50% 46%, black 8%, transparent 78%)',
        }}
      >
        <GlyphMesh id={meshId} opacity={0.016} scale={1.15} />
      </div>

      {/* The press is masked to the left of the frame so it never crosses the
          card. Two near-black shapes overlapping — a debossed letterform and a
          product shot — cancel each other out; separating them lets both read. */}
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            'radial-gradient(58% 66% at 34% 52%, black 6%, transparent 76%)',
          WebkitMaskImage:
            'radial-gradient(58% 66% at 34% 52%, black 6%, transparent 76%)',
        }}
      >
        <span
          className="deboss absolute left-[36%] top-1/2 select-none font-bold leading-none"
          style={{
            fontSize: '32vw',
            letterSpacing: '-0.07em',
            transform: 'translate(-50%, -50%)',
            // No blur in the shadow stack. A blurred copy under type this large
            // stops reading as a pressed edge and starts reading as a grey shape
            // sitting on top of the page.
            // The two edges are kept close in weight. Let the dark edge run
            // much stronger than the light one and the letterform stops being a
            // press and becomes a black outline drawn on the page.
            textShadow:
              '0 1.5px 0 rgba(255,255,255,0.05), 0 -1.5px 0 rgba(0,0,0,0.42)',
          }}
        >
          {word}
        </span>
      </div>
    </div>
  );
}
