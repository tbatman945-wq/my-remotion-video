import {
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  Series,
  Sequence,
  AbsoluteFill,
} from "remotion";
import {
  Wipe,
  Slide,
  Fade,
  Zoom,
  Flip,
  Circle,
  Polygon,
  Dreamy,
  Blur,
  Cube,
  Door,
  PageTurn,
} from "@remotion/transitions";
import { ReactElement } from "react";

interface TransitionsDemoProps {
  durationInFrames?: number;
  fps?: number;
}

const SCENES = [
  { id: 1, color: "#00d9ff", label: "Wipe" },
  { id: 2, color: "#ff6b6b", label: "Slide" },
  { id: 3, color: "#6bcb77", label: "Fade" },
  { id: 4, color: "#ffd93d", label: "Zoom" },
  { id: 5, color: "#a855f7", label: "Flip" },
  { id: 6, color: "#ec4899", label: "Circle" },
  { id: 7, color: "#06b6d4", label: "Polygon" },
  { id: 8, color: "#f97316", label: "Dreamy" },
  { id: 9, color: "#84cc16", label: "Blur" },
  { id: 10, color: "#ef4444", label: "Cube" },
  { id: 11, color: "#3b82f6", label: "Door" },
  { id: 12, color: "#22d3ee", label: "PageTurn" },
];

const TRANSITIONS = [
  Wipe,
  Slide,
  Fade,
  Zoom,
  Flip,
  Circle,
  Polygon,
  Dreamy,
  Blur,
  Cube,
  Door,
  PageTurn,
];

export const TransitionsDemo = ({ durationInFrames = 360, fps = 30 }: TransitionsDemoProps) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const sceneDuration = Math.floor(durationInFrames / SCENES.length);
  const transitionDuration = Math.min(15, Math.floor(sceneDuration * 0.3));

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        color: "white",
        overflow: "hidden",
      }}
    >
      <Series>
        {SCENES.map((scene, index) => {
          const Transition = TRANSITIONS[index % TRANSITIONS.length];
          const isLast = index === SCENES.length - 1;

          return (
            <Sequence
              key={scene.id}
              from={index * sceneDuration}
              durationInFrames={sceneDuration + (isLast ? 0 : transitionDuration)}
            >
              {isLast ? (
                <SceneContent scene={scene} width={width} height={height} frame={frame} />
              ) : (
                <Transition
                  durationInFrames={transitionDuration}
                  // Transition-specific props
                  {...getTransitionProps(Transition, scene)}
                >
                  <SceneContent scene={scene} width={width} height={height} frame={frame} />
                </Transition>
              )}
            </Sequence>
          );
        })}
      </Series>

      {/* Progress indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "10%",
          width: "80%",
          height: 4,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(frame / durationInFrames) * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #00d9ff, #ff6b6b, #6bcb77, #ffd93d)",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Scene labels */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "5%",
          right: "5%",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "monospace",
        }}
      >
        {SCENES.map((s, i) => (
          <span key={s.id} style={{ opacity: getSceneOpacity(frame, i, sceneDuration, transitionDuration) }}>
            {s.label}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SceneContent = ({
  scene,
  width,
  height,
  frame,
}: {
  scene: typeof SCENES[0];
  width: number;
  height: number;
  frame: number;
}) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: `radial-gradient(circle at center, ${scene.color}22, transparent 70%)`,
    }}
  >
    <div
      style={{
        fontSize: 72,
        fontWeight: 700,
        background: `linear-gradient(90deg, ${scene.color}, #fff)`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: `0 4px 30px ${scene.color}44`,
      }}
    >
      {scene.label}
    </div>
    <div
      style={{
        marginTop: 20,
        fontSize: 20,
        color: "rgba(255,255,255,0.5)",
      }}
    >
      @remotion/transitions
    </div>
    <div
      style={{
        marginTop: 40,
        width: 100,
        height: 100,
        border: `3px solid ${scene.color}`,
        borderRadius: "50%",
        animation: "pulse 2s infinite",
      }}
    />
  </AbsoluteFill>
);

function getTransitionProps(Transition: typeof Wipe, scene: typeof SCENES[0]) {
  const props: Record<string, unknown> = {
    color: scene.color,
  };

  // Add transition-specific props based on type
  if (Transition === Wipe) {
    props.direction = "right";
  } else if (Transition === Slide) {
    props.direction = "up";
  } else if (Transition === Zoom) {
    props.scale = 1.5;
  } else if (Transition === Flip) {
    props.axis = "x";
  } else if (Transition === Circle) {
    props.radius = 100;
  } else if (Transition === Polygon) {
    props.sides = 6;
  } else if (Transition === Cube) {
    props.perspective = 1000;
  } else if (Transition === Door) {
    props.direction = "horizontal";
  } else if (Transition === PageTurn) {
    props.direction = "left";
  }

  return props;
}

function getSceneOpacity(frame: number, sceneIndex: number, sceneDuration: number, transitionDuration: number): number {
  const sceneStart = sceneIndex * sceneDuration;
  const sceneEnd = sceneStart + sceneDuration;
  const inTransition = frame >= sceneEnd - transitionDuration && frame < sceneEnd;

  if (frame < sceneStart) return 0.3;
  if (frame >= sceneEnd + transitionDuration) return 0.3;
  if (inTransition) return 0.6;
  return 1;
}

// Individual transition examples for testing
export const WipeTransition = () => (
  <Wipe durationInFrames={30} direction="right" color="#00d9ff">
    <div style={{ background: "#00d9ff", width: "100%", height: "100%" }} />
  </Wipe>
);

export const SlideTransition = () => (
  <Slide durationInFrames={30} direction="up" color="#ff6b6b">
    <div style={{ background: "#ff6b6b", width: "100%", height: "100%" }} />
  </Slide>
);

export const FadeTransition = () => (
  <Fade durationInFrames={30} color="#6bcb77">
    <div style={{ background: "#6bcb77", width: "100%", height: "100%" }} />
  </Fade>
);

export const ZoomTransition = () => (
  <Zoom durationInFrames={30} scale={1.5} color="#ffd93d">
    <div style={{ background: "#ffd93d", width: "100%", height: "100%" }} />
  </Zoom>
);

export const FlipTransition = () => (
  <Flip durationInFrames={30} axis="x" color="#a855f7">
    <div style={{ background: "#a855f7", width: "100%", height: "100%" }} />
  </Flip>
);