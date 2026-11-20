import { registerRoot, Composition } from "remotion";
import { MyComp } from "./MyComp";
import { PS2WinterWalkWithAudio } from "./PS2WinterWalk";

registerRoot(
  <>
    {/* Main demo composition */}
    <Composition
      id="MyComp"
      component={MyComp}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "Hello Remotion",
        subtitle: "3D • Audio • Voice — All in React",
      }}
    />

    {/* PS2 Winter Walk - 8-bit style */}
    <Composition
      id="PS2WinterWalk"
      component={PS2WinterWalkWithAudio}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />

    {/* PS2 Winter Walk - Square format for social */}
    <Composition
      id="PS2WinterWalkSquare"
      component={PS2WinterWalkWithAudio}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{}}
    />

    {/* PS2 Winter Walk - Vertical for Reels/TikTok */}
    <Composition
      id="PS2WinterWalkVertical"
      component={PS2WinterWalkWithAudio}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  </>
);