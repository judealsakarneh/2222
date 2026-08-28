import type {ReactNode} from 'react';
import {Bars} from '../site/Marks';

/**
 * The CTRL Room membership card.
 *
 * It is solid CTRL Teal, not another black rectangle. The brand deck gives
 * exactly three colours, and spending the teal on the single most photographed
 * object in the brand — rather than trickling it through borders and dots — is
 * what makes the palette read as chosen.
 *
 * SCALING: the root declares `container-type: inline-size` and everything
 * inside is sized in `cqw`/`em`, so one component renders correctly at 240px in
 * a footer and 620px in a hero with type, radius, padding and edge all in
 * proportion. Media queries cannot do that — the card's width depends on its
 * container, not the viewport.
 */
export function MemberCard({
  overlay,
  className = '',
  member = '0001',
}: {
  overlay?: ReactNode;
  className?: string;
  member?: string;
}) {
  return (
    <div
      className={`relative aspect-[1.585/1] w-full ${className}`}
      style={{containerType: 'inline-size'}}
    >
      {/* Cast shadow, offset with the light. */}
      <div
        className="pointer-events-none absolute inset-x-[7%] bottom-[-6%] top-[12%] rounded-[6cqw]"
        style={{background: 'rgba(0,0,0,0.6)', filter: 'blur(6.5cqw)'}}
      />

      <div
        className="absolute inset-0 overflow-hidden rounded-[4.2cqw]"
        style={{fontSize: '3.4cqw'}}
      >
        {/* Body. Lit from the top-left, the way a card is photographed. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(148deg, #16C4C4 0%, #009C9B 32%, #00706F 66%, #003E3E 100%)',
          }}
        />

        {/* The oversized press, bleeding off the right edge. */}
        <span
          className="pointer-events-none absolute select-none font-extrabold wide"
          style={{
            fontSize: '11em',
            letterSpacing: '-0.06em',
            right: '-0.3em',
            top: '50%',
            transform: 'translateY(-52%)',
            lineHeight: 1,
            color: 'transparent',
            textShadow:
              '0 1.5px 0 rgba(255,255,255,0.075), 0 -1.5px 0 rgba(0,0,0,0.16)',
          }}
          aria-hidden="true"
        >
          CTRL
        </span>

        {/* A single specular band across the face. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(122deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 26%, rgba(255,255,255,0) 52%)',
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-[1.5em] t-1">
          <div className="flex items-start justify-between">
            <span className="inline-flex items-baseline gap-[0.45em] leading-none">
              <span
                className="font-extrabold wide"
                style={{fontSize: '1.5em', letterSpacing: '-0.03em'}}
              >
                CTRL
              </span>
              <span
                className="font-medium text-white/75"
                style={{fontSize: '0.72em', letterSpacing: '0.3em'}}
              >
                ROOM
              </span>
            </span>
            <Bars size={16} className="text-white/60 [width:1.1em] [height:1.1em]" />
          </div>

          <div className="flex items-end justify-between">
            <div>
              <span
                className="block font-mono font-medium text-white/60"
                style={{fontSize: '0.52em', letterSpacing: '0.26em'}}
              >
                MEMBER
              </span>
              <span
                className="nums mt-[0.4em] block font-mono font-medium"
                style={{fontSize: '1.15em', letterSpacing: '0.06em'}}
              >
                {member}
              </span>
            </div>
            <span
              className="font-mono font-medium text-white/60"
              style={{fontSize: '0.52em', letterSpacing: '0.26em'}}
            >
              AMMAN · JO
            </span>
          </div>
        </div>

        {overlay}

        {/* The edge: a bright top-left catch over a full hairline. */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[4.2cqw]"
          style={{
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.16), inset 1px 1px 0 0 rgba(255,255,255,0.26)',
          }}
        />
      </div>
    </div>
  );
}
