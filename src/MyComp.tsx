import {
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
} from "remotion";

interface MyCompProps {
  title: string;
  subtitle: string;
}

export const MyComp = ({ title, subtitle }: MyCompProps) => {
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

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
      }}
    >
      <h1 style={{ fontSize: 72, fontWeight: 700 }}>{title}</h1>
      <p style={{ fontSize: 32, opacity: 0.7 }}>{subtitle}</p>
      <p style={{ fontSize: 20, opacity: 0.5, marginTop: 40 }}>
        Frame: {frame} / {durationInFrames}
      </p>
    </AbsoluteFill>
  );
};