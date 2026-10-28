import { DEMO_DURATION } from '@mobywatel/content/demo-video';
import { Composition } from 'remotion';

import { Demo, type DemoProps } from './demo.tsx';
import { f, FPS, HEIGHT, WIDTH } from './theme.ts';

export function Root() {
  return (
    <>
      {/* For the landing page: no burned-in captions, the page shows them in the visitor's language. */}
      <Composition
        id="demo"
        component={Demo}
        durationInFrames={f(DEMO_DURATION)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ captions: false } satisfies DemoProps}
      />
      {/* For the submission form and video sites: Polish captions burned in. */}
      <Composition
        id="demo-napisy"
        component={Demo}
        durationInFrames={f(DEMO_DURATION)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ captions: true } satisfies DemoProps}
      />
    </>
  );
}
