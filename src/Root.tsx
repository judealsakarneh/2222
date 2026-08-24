import React from 'react';
import {Composition} from 'remotion';
import {DemoReel} from './DemoReel';
import {RambleAd} from './RambleAd';
import {TOTAL_DURATION_IN_FRAMES} from './lib/sceneTimings';
import './style.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ramble. — 9:16 product film for Reels / TikTok. 20.0s at 30fps. */}
      <Composition
        id="RambleAd"
        component={RambleAd}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Square demo reel — six After Effects style animations. 15.0s at 30fps. */}
      <Composition
        id="AEDemoReel"
        component={DemoReel}
        durationInFrames={TOTAL_DURATION_IN_FRAMES}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
