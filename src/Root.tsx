import React from 'react';
import {Composition} from 'remotion';
import {DemoReel} from './DemoReel';
import {RambleAd} from './RambleAd';
import {ZambleTeaser} from './ZambleTeaser';
import {DURATION as TEASER_DURATION} from './teaser/lib/timeline';
import {TOTAL_DURATION_IN_FRAMES} from './lib/sceneTimings';
import './style.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* zamble — 9:16 cyberpunk/glitch v2 teaser. 12.0s at 30fps. */}
      <Composition
        id="ZambleTeaser"
        component={ZambleTeaser}
        durationInFrames={TEASER_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />

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
