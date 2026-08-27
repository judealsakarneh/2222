import React from 'react';
import {MONO} from '../../lib/fonts';
import {C} from '../lib/tokens';

/**
 * The membership card, drawn for film.
 *
 * Solid CTRL Teal rather than another black rectangle — the deck gives three
 * colours, and spending the teal on the most photographed object in the brand
 * is what makes the palette read as chosen. Everything inside is sized in `em`
 * off one font-size so the whole card scales from a single number.
 */
export const CtrlCard: React.FC<{width: number}> = ({width}) => {
  const u = width / 29.6; // one em, so the layout matches the website's card

  return (
    <div
      style={{
        width,
        aspectRatio: '1.585 / 1',
        borderRadius: width * 0.044,
        overflow: 'hidden',
        position: 'relative',
        fontSize: u,
        background:
          'linear-gradient(148deg, #0C918C 0%, #007370 32%, #005250 66%, #00302F 100%)',
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.16), inset 1px 1px 0 0 rgba(255,255,255,0.26)`,
      }}
    >
      {/* The oversized press, bleeding off the right edge. */}
      <span
        style={{
          position: 'absolute',
          right: '-0.3em',
          top: '50%',
          transform: 'translateY(-52%)',
          fontSize: '11em',
          fontWeight: 900,
          letterSpacing: '-0.06em',
          lineHeight: 1,
          color: 'transparent',
          textShadow:
            '0 1.5px 0 rgba(255,255,255,0.075), 0 -1.5px 0 rgba(0,0,0,0.16)',
          whiteSpace: 'nowrap',
        }}
      >
        CTRL
      </span>

      {/* One specular band across the face. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(122deg, rgba(255,255,255,0.17) 0%, rgba(255,255,255,0.03) 26%, rgba(255,255,255,0) 52%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          height: '100%',
          padding: '1.5em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: C.white,
        }}
      >
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
          <span style={{display: 'inline-flex', alignItems: 'baseline', gap: '0.45em', lineHeight: 1}}>
            <span style={{fontSize: '1.5em', fontWeight: 900, letterSpacing: '-0.03em'}}>CTRL</span>
            <span
              style={{
                fontSize: '0.72em',
                fontWeight: 500,
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              ROOM
            </span>
          </span>
          {/* Signal bars */}
          <svg width="1.15em" height="1.15em" viewBox="0 0 14 14" fill="rgba(255,255,255,0.6)">
            <rect x="0" y="9" width="3" height="5" />
            <rect x="5.5" y="5" width="3" height="9" />
            <rect x="11" y="0" width="3" height="14" />
          </svg>
        </div>

        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <div style={{fontFamily: MONO}}>
            <span
              style={{
                display: 'block',
                fontSize: '0.52em',
                fontWeight: 500,
                letterSpacing: '0.26em',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              MEMBER
            </span>
            <span
              style={{
                display: 'block',
                marginTop: '0.4em',
                fontSize: '1.15em',
                fontWeight: 500,
                letterSpacing: '0.06em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              0142
            </span>
          </div>
          <span
            style={{
              fontFamily: MONO,
              fontSize: '0.52em',
              fontWeight: 500,
              letterSpacing: '0.26em',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            AMMAN · JO
          </span>
        </div>
      </div>
    </div>
  );
};
