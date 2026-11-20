import { Audio, useVideoConfig, useCurrentFrame, interpolate } from "remotion";
import { AbsoluteFill } from "remotion";
import { ReactElement } from "react";

interface AudioSceneProps {
  /** Path to audio file in public/ folder */
  src: string;
  /** Start frame for audio */
  startFrom?: number;
  /** End frame for audio */
  endAt?: number;
  /** Volume (0-1) */
  volume?: number;
  /** Show waveform visualization */
  showWaveform?: boolean;
}

export const AudioScene = ({
  src,
  startFrom = 0,
  endAt,
  volume = 1,
  showWaveform = false,
}: AudioSceneProps) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const audioEndFrame = endAt ?? durationInFrames;

  const opacity = interpolate(frame, [startFrom, startFrom + 30], [0, 1]);
  const volumeAnim = interpolate(frame, [startFrom, startFrom + 15], [0, volume]);

  return (
    <>
      <Audio
        src={src}
        startFrom={startFrom}
        endAt={audioEndFrame}
        volume={volumeAnim}
        onStart={() => console.log("Audio started")}
        onEnd={() => console.log("Audio ended")}
      />

      {showWaveform && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity,
            pointerEvents: "none",
          }}
        >
          <AudioWaveformVisualizer
            src={src}
            startFrom={startFrom}
            endAt={audioEndFrame}
            volume={volumeAnim}
          />
        </AbsoluteFill>
      )}
    </>
  );
};

// Waveform visualizer component
interface WaveformProps {
  src: string;
  startFrom: number;
  endAt: number;
  volume: number;
}

const AudioWaveformVisualizer = ({ src, startFrom, endAt, volume }: WaveformProps) => {
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  // This would use @remotion/media-utils in practice
  // For now, a placeholder visualizer
  const progress = (frame - startFrom) / (endAt - startFrom);
  const barCount = 64;
  const barWidth = (width * 0.8) / barCount;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 2,
        height: 100,
        padding: 20,
      }}
    >
      {Array.from({ length: barCount }, (_, i) => {
        // Simulated waveform data
        const pseudoRandom = Math.sin(i * 0.5 + frame * 0.1) * Math.cos(i * 0.3);
        const barHeight = Math.abs(pseudoRandom) * 80 * volume * (0.5 + progress * 0.5);
        const hue = (i / barCount) * 120 + 200; // Blue to green

        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: Math.max(2, barHeight),
              background: `hsl(${hue}, 70%, 50%)`,
              borderRadius: 2,
              transition: "height 0.03s linear",
            }}
          />
        );
      })}
    </div>
  );
};

// Background music with ducking
export const BackgroundMusic = ({
  src,
  startFrom = 0,
  endAt,
  volume = 0.3,
  duckVolume = 0.1,
  duckStartFrame,
  duckEndFrame,
}: AudioSceneProps & {
  duckVolume?: number;
  duckStartFrame?: number;
  duckEndFrame?: number;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const isDucking = duckStartFrame !== undefined &&
    duckEndFrame !== undefined &&
    frame >= duckStartFrame &&
    frame <= duckEndFrame;

  const currentVolume = isDucking ? duckVolume : volume;

  return (
    <Audio
      src={src}
      startFrom={startFrom}
      endAt={endAt ?? durationInFrames}
      volume={currentVolume}
      loop
    />
  );
};

// Sound effect component
export const SoundEffect = ({
  src,
  triggerFrame,
  volume = 1,
  durationFrames = 30,
}: {
  src: string;
  triggerFrame: number;
  volume?: number;
  durationFrames?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPlaying = frame >= triggerFrame && frame < triggerFrame + durationFrames;
  const localFrame = frame - triggerFrame;
  const fadeIn = interpolate(localFrame, [0, fps * 0.1], [0, volume]);
  const fadeOut = interpolate(localFrame, [durationFrames - fps * 0.1, durationFrames], [volume, 0]);
  const currentVolume = isPlaying ? Math.min(fadeIn, fadeOut) : 0;

  if (!isPlaying) return null;

  return <Audio src={src} startFrom={triggerFrame} endAt={triggerFrame + durationFrames} volume={currentVolume} />;
};