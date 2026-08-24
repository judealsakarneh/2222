import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Background} from './components/Background';
import {SceneWrapper} from './lib/transitions';
import {SCENES} from './lib/sceneTimings';
import {Scene1Arrow} from './scenes/Scene1Arrow';
import {Scene2Logo} from './scenes/Scene2Logo';
import {Scene3Search} from './scenes/Scene3Search';
import {Scene4AppGrid} from './scenes/Scene4AppGrid';
import {Scene5Notification} from './scenes/Scene5Notification';
import {Scene6Outro} from './scenes/Scene6Outro';

// The full 15s / 450-frame reel. Six AE-style scenes, each in its own
// Sequence, crossfaded with a short motion-blur transition at the seams
// (see lib/transitions.tsx). Background sits behind everything so the
// crossfades never reveal a hard cut to a different backdrop.
export const DemoReel: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0b0b0e'}}>
      <Background />

      {/* Scene 1 — Glowing Arrow */}
      <Sequence from={SCENES.arrow.from} durationInFrames={SCENES.arrow.duration} name="Scene 1 — Glowing Arrow">
        <SceneWrapper durationInFrames={SCENES.arrow.duration} disableEnter>
          <Scene1Arrow />
        </SceneWrapper>
      </Sequence>

      {/* Scene 2 — Logo Reveal */}
      <Sequence from={SCENES.logo.from} durationInFrames={SCENES.logo.duration} name="Scene 2 — Logo Reveal">
        <SceneWrapper durationInFrames={SCENES.logo.duration}>
          <Scene2Logo />
        </SceneWrapper>
      </Sequence>

      {/* Scene 3 — Search Bar */}
      <Sequence from={SCENES.search.from} durationInFrames={SCENES.search.duration} name="Scene 3 — Search Bar">
        <SceneWrapper durationInFrames={SCENES.search.duration}>
          <Scene3Search />
        </SceneWrapper>
      </Sequence>

      {/* Scene 4 — App Icon Grid */}
      <Sequence from={SCENES.grid.from} durationInFrames={SCENES.grid.duration} name="Scene 4 — App Icon Grid">
        <SceneWrapper durationInFrames={SCENES.grid.duration}>
          <Scene4AppGrid />
        </SceneWrapper>
      </Sequence>

      {/* Scene 5 — Notification */}
      <Sequence
        from={SCENES.notification.from}
        durationInFrames={SCENES.notification.duration}
        name="Scene 5 — Notification"
      >
        <SceneWrapper durationInFrames={SCENES.notification.duration}>
          <Scene5Notification />
        </SceneWrapper>
      </Sequence>

      {/* Scene 6 — Outro */}
      <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.duration} name="Scene 6 — Outro">
        <SceneWrapper durationInFrames={SCENES.outro.duration} disableExit>
          <Scene6Outro />
        </SceneWrapper>
      </Sequence>
    </AbsoluteFill>
  );
};
