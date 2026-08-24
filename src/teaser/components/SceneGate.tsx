import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

/**
 * Mounts a scene only inside its frame window.
 *
 * Scenes are NOT <Sequence>-wrapped and do NOT crossfade: this teaser cuts hard,
 * and the glitch that covers each cut lives in GlitchLayer above the whole
 * stack. A dissolve here would soften exactly the thing that should be violent.
 *
 * `lead` mounts a scene a few frames early so its incoming animation is already
 * running underneath the outgoing glitch.
 */
export const SceneGate: React.FC<{
  start: number;
  end: number;
  lead?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({start, end, lead = 0, style, children}) => {
  const frame = useCurrentFrame();

  if (frame < start - lead || frame >= end) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{alignItems: 'center', justifyContent: 'center', ...style}}
    >
      {children}
    </AbsoluteFill>
  );
};
