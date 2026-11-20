import {
  useVideoConfig,
  useCurrentFrame,
  useAsset,
  AbsoluteFill,
  staticFile,
} from "remotion";
import { getAudioData } from "@remotion/media-utils";
import { useEffect, useState } from "react";

interface WaveformVisualizerProps {
  /** Audio file in public/ folder */
  src: string;
  /** Number of frequency bands */
  bands?: number;
  /** Bar color */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Height of waveform */
  height?: number;
  /** Width percentage */
  widthPercent?: number;
}

export const WaveformVisualizer = ({
  src,
  bands = 64,
  color = "#00d9ff",
  backgroundColor = "rgba(0,0,0,0)",
  height = 150,
  widthPercent = 80,
}: WaveformVisualizerProps) => {
  const { fps, durationInFrames, width } = useVideoConfig();
  const frame = useCurrentFrame();
  const [waveformData, setWaveformData] = useState<Float32Array | null>(null);

  // Load audio data once
  useEffect(() => {
    const loadAudioData = async () => {
      try {
        // Get audio data for the entire duration
        const data = await getAudioData(src, {
          sampleRate: fps * 2, // 2 samples per frame for smoother visualization
        });
        setWaveformData(data);
      } catch (error) {
        console.error("Failed to load audio data:", error);
      }
    };
    loadAudioData();
  }, [src, fps]);

  if (!waveformData) {
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.4)",
          fontSize: 18,
        }}
      >
        Loading waveform...
      </AbsoluteFill>
    );
  }

  const samplesPerFrame = Math.ceil(waveformData.length / durationInFrames);
  const startSample = frame * samplesPerFrame;
  const endSample = Math.min(startSample + samplesPerFrame, waveformData.length);
  const frameData = waveformData.slice(startSample, endSample);

  // Calculate frequency bands using simple FFT-like grouping
  const bandData = new Array(bands).fill(0);
  const samplesPerBand = Math.max(1, Math.floor(frameData.length / bands));

  for (let i = 0; i < bands; i++) {
    const bandStart = i * samplesPerBand;
    const bandEnd = Math.min(bandStart + samplesPerBand, frameData.length);
    let sum = 0;
    for (let j = bandStart; j < bandEnd; j++) {
      sum += Math.abs(frameData[j]);
    }
    bandData[i] = sum / samplesPerBand;
  }

  const barWidth = (width * (widthPercent / 100)) / bands;
  const maxHeight = height;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: Math.max(1, barWidth * 0.15),
        height: maxHeight,
        padding: 20,
        background: backgroundColor,
      }}
    >
      {bandData.map((amplitude, i) => {
        const barHeight = Math.max(2, amplitude * maxHeight * 3);
        const hue = 180 + (i / bands) * 60; // Cyan to green
        const saturation = 70;
        const lightness = 40 + amplitude * 40;

        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: barHeight,
              background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
              borderRadius: Math.max(1, barWidth / 2),
              boxShadow: `0 0 ${barHeight * 0.5}px hsl(${hue}, ${saturation}%, ${lightness}%)`,
              transition: "height 0.03s linear, background 0.03s linear",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Circular waveform visualizer
export const CircularWaveform = ({
  src,
  bands = 128,
  color = "#00d9ff",
  radius = 100,
  strokeWidth = 4,
}: WaveformVisualizerProps & { radius?: number; strokeWidth?: number }) => {
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const [waveformData, setWaveformData] = useState<Float32Array | null>(null);

  useEffect(() => {
    getAudioData(src, { sampleRate: fps * 2 }).then(setWaveformData).catch(console.error);
  }, [src, fps]);

  if (!waveformData) return null;

  const samplesPerFrame = Math.ceil(waveformData.length / durationInFrames);
  const startSample = frame * samplesPerFrame;
  const endSample = Math.min(startSample + samplesPerFrame, waveformData.length);
  const frameData = waveformData.slice(startSample, endSample);

  const bandData = new Array(bands).fill(0);
  const samplesPerBand = Math.max(1, Math.floor(frameData.length / bands));

  for (let i = 0; i < bands; i++) {
    const bandStart = i * samplesPerBand;
    const bandEnd = Math.min(bandStart + samplesPerBand, frameData.length);
    let sum = 0;
    for (let j = bandStart; j < bandEnd; j++) {
      sum += Math.abs(frameData[j]);
    }
    bandData[i] = sum / samplesPerBand;
  }

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={width} height={height} style={{ transform: "rotate(-90deg)" }}>
        {bandData.map((amplitude, i) => {
          const angle = (i / bands) * 2 * Math.PI;
          const barLength = amplitude * radius * 2;
          const x1 = width / 2 + Math.cos(angle) * radius;
          const y1 = height / 2 + Math.sin(angle) * radius;
          const x2 = width / 2 + Math.cos(angle) * (radius + barLength);
          const y2 = height / 2 + Math.sin(angle) * (radius + barLength);
          const hue = (i / bands) * 360;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={`hsl(${hue}, 80%, 55%)`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 ${strokeWidth * 2}px hsl(${hue}, 80%, 55%))` }}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Audio level meter (for voice narration monitoring)
export const AudioLevelMeter = ({
  src,
  startFrom = 0,
  endAt,
  bars = 20,
}: {
  src: string;
  startFrom?: number;
  endAt?: number;
  bars?: number;
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const [audioData, setAudioData] = useState<Float32Array | null>(null);

  useEffect(() => {
    getAudioData(src, { sampleRate: fps }).then(setAudioData).catch(console.error);
  }, [src, fps]);

  if (!audioData) return null;

  const active = frame >= startFrom && (!endAt || frame <= endAt);
  if (!active) return null;

  const samplesPerFrame = Math.ceil(audioData.length / durationInFrames);
  const startSample = frame * samplesPerFrame;
  const endSample = Math.min(startSample + samplesPerFrame, audioData.length);
  const frameData = audioData.slice(startSample, endSample);

  // RMS level
  let sum = 0;
  for (const sample of frameData) {
    sum += sample * sample;
  }
  const rms = Math.sqrt(sum / frameData.length);
  const db = 20 * Math.log10(rms + 0.0001);

  // Simple bar visualization of recent levels
  const recentFrames = 30;
  const levels = Array.from({ length: recentFrames }, (_, i) => {
    const f = frame - recentFrames + i;
    if (f < 0) return 0;
    const s = f * samplesPerFrame;
    const e = Math.min(s + samplesPerFrame, audioData.length);
    let s2 = 0;
    for (let j = s; j < e; j++) s2 += audioData[j] * audioData[j];
    return Math.sqrt(s2 / (e - s));
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 3,
        padding: 20,
        pointerEvents: "none",
      }}
    >
      {levels.map((level, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: Math.max(2, level * 100),
            background: level > 0.5 ? "#ff4444" : level > 0.2 ? "#ffaa00" : "#00d9ff",
            borderRadius: 2,
            opacity: (i + 1) / recentFrames,
          }}
        />
      ))}
      <div style={{ position: "absolute", bottom: 60, color: "white", fontFamily: "monospace" }}>
        {db.toFixed(1)} dB
      </div>
    </AbsoluteFill>
  );
};