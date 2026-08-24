import React from 'react';
import {Composition} from 'remotion';
import {DemoReel} from './DemoReel';
import {TOTAL_DURATION_IN_FRAMES} from './lib/sceneTimings';
import './style.css';

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AEDemoReel"
      component={DemoReel}
      durationInFrames={TOTAL_DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
