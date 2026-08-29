import React from 'react';
import {Composition} from 'remotion';
import {DemoReel} from './DemoReel';
import {RambleAd} from './RambleAd';
import {ZambleTeaser} from './ZambleTeaser';
import {LongTake} from './LongTake';
import {ScreenCut} from './ScreenCut';
import {ZambleStory} from './ZambleStory';
import {ZambleQuad} from './ZambleQuad';
import {ZambleDemo} from './ZambleDemo';
import {CtrlPromo} from './CtrlPromo';
import {CtrlReel} from './CtrlReel';
import {CtrlFlow} from './CtrlFlow';
import {DURATION as FLOW_DURATION} from './flow/lib/timeline';
import {DURATION as REEL_DURATION} from './reel/tokens';
import {DURATION as CTRL_DURATION} from './ctrl/lib/tokens';
import {DURATION as DEMO_DURATION} from './demo/lib/timeline';
import {DURATION as STORY_DURATION} from './story/lib/timeline';
import {DURATION as SCREENCUT_DURATION} from './desk/lib/timeline';
import {DURATION as TEASER_DURATION} from './teaser/lib/timeline';
import {DURATION as LONGTAKE_DURATION} from './longtake/lib/camera';
import {TOTAL_DURATION_IN_FRAMES} from './lib/sceneTimings';
import './style.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* CTRL Room — "Flow". UI product film on the Wispr Flow beat sheet.
          1920x1080, 12.000s. */}
      <Composition
        id="CtrlFlow"
        component={CtrlFlow}
        durationInFrames={FLOW_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* CTRL Room — 16:9 motion reel. 150 frames / 5.000s. */}
      <Composition
        id="CtrlReel"
        component={CtrlReel}
        durationInFrames={REEL_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* CTRL Room — "Jordan, switched on." 9:16 brand film for Reels. 24.0s. */}
      <Composition
        id="CtrlPromo"
        component={CtrlPromo}
        durationInFrames={CTRL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* zamble — "Demo". SaaS product demo, millisecond-spec. Authored 1080p,
          render with --scale=2 for the spec's 3840x2160. 18.0s. */}
      <Composition
        id="ZambleDemo"
        component={ZambleDemo}
        durationInFrames={DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* zamble — "Quad". Four locked panels, seamless 12.0s loop. */}
      <Composition
        id="ZambleQuad"
        component={ZambleQuad}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* zamble — "Story". Night/paper worlds, shape-driven transitions. 23.0s. */}
      <Composition
        id="ZambleStory"
        component={ZambleStory}
        durationInFrames={STORY_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* zamble — "Screen Cut". 16:9 screen content, five transition mechanics. 16.0s. */}
      <Composition
        id="ScreenCut"
        component={ScreenCut}
        durationInFrames={SCREENCUT_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* zamble — "The Long Take". One unbroken 3D camera move. 30.0s at 30fps. */}
      <Composition
        id="LongTake"
        component={LongTake}
        durationInFrames={LONGTAKE_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />

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
