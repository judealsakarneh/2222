// All timings are in frames at 30fps. 15s total = 450 frames.
export const SCENES = {
  arrow: {from: 0, duration: 75}, // 0:00.0 – 0:02.5 — Scene 1: Glowing Arrow
  logo: {from: 75, duration: 75}, // 0:02.5 – 0:05.0 — Scene 2: Logo Reveal
  search: {from: 150, duration: 75}, // 0:05.0 – 0:07.5 — Scene 3: Search Bar
  grid: {from: 225, duration: 90}, // 0:07.5 – 0:10.5 — Scene 4: App Icon Grid
  notification: {from: 315, duration: 75}, // 0:10.5 – 0:13.0 — Scene 5: Notification
  outro: {from: 390, duration: 60}, // 0:13.0 – 0:15.0 — Scene 6: Outro
} as const;

export const TOTAL_DURATION_IN_FRAMES = 450;
