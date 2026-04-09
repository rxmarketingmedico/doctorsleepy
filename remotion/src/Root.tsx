import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

// 30fps, 40 seconds = 1200 frames
export const RemotionRoot = () => (
  <Composition
    id="main"
    component={MainVideo}
    durationInFrames={1200}
    fps={30}
    width={1920}
    height={1080}
  />
);
