import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Grain} from './components/Grain';
import {AppPanel} from './flow/components/AppPanel';
import {Mark} from './flow/components/Mark';
import {Outro} from './flow/components/Outro';
import {Grade, Wallpaper} from './flow/components/Stage';

/**
 * CTRL Flow — 1920x1080, 30 fps, 12.000 s.
 *
 * The beat structure is the Wispr Flow build document's, timing for timing;
 * the product on screen is CTRL Room. Two beats were remapped rather than
 * copied, because copying them would have put a microphone in an app that does
 * not have one: the waveform pulse became the live index's activity bars, and
 * the dictated shopping list became a CTRL Picks result. Every duration,
 * stagger and curve is unchanged.
 *
 * Layer order is the frame's depth: wallpaper, then the mark that hands over to
 * the panel, then the lockup, then the grade and grain over everything. The
 * grade sits under the grain so the grain is not itself graded.
 */
export const CtrlFlow: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0B0B0B'}}>
      <Wallpaper />
      <Mark />
      <AppPanel />
      <Outro />
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};
