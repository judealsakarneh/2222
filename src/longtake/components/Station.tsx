import React from 'react';
import {useCurrentFrame} from 'remotion';
import {cameraZAt, depthBlur, depthOpacity, stationZ} from '../lib/camera';

/**
 * Places one station in the world and applies the camera's depth response.
 *
 * `tz` is the station's position relative to the camera. Negative = still ahead,
 * 0 = exactly at the screen plane, positive = the camera has passed through it
 * (and it blows up and blurs out behind the lens).
 *
 * Note on 3D: this element sets `opacity`, which forces `transform-style: flat`
 * on its subtree. That is fine here because station content is 2D — but any
 * station that wants internal depth must establish its OWN perspective inside,
 * or its children will collapse to z = 0. StDeck and StHook both do this.
 */
export const Station: React.FC<{
  index: number;
  children: React.ReactNode;
}> = ({index, children}) => {
  const frame = useCurrentFrame();
  const tz = cameraZAt(frame) - stationZ(index);

  const opacity = depthOpacity(tz);
  if (opacity <= 0.001) {
    return null;
  }

  const blur = depthBlur(tz);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateZ(${tz}px)`,
        opacity,
        filter: blur > 0.15 ? `blur(${blur}px)` : undefined,
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  );
};
