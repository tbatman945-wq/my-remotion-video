import { Audio, useVideoConfig, useCurrentFrame, interpolate } from "remotion";
import { ReactElement } from "react";

interface VoiceNarrationProps {
  /** Text to narrate */
  text: string;
  /** Start frame for narration */
  startFrame: number;
  /** Voice ID (ElevenLabs) or voice name */
  voiceId?: string;
  /** ElevenLabs API key (set via env: ELEVENLABS_API_KEY) */
  apiKey?: string;
  /** Model to use */
  model?: "eleven_multilingual_v2" | "eleven_turbo_v2" | "eleven_english_v2";
  /** Stability (0-1) */
  stability?: number;
  /** Similarity boost (0-1) */
  similarityBoost?: number;
  /** Style exaggeration (0-1) */
  style?: number;
  /** Use speaker boost */
  useSpeakerBoost?: boolean;
  /** Pre-generated audio URL (if not using API) */
  preGeneratedUrl?: string;
}

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description: string;
  preview_url: string;
}

// Pre-defined voice presets
export const VOICE_PRESETS = {
  narrator: {
    voiceId: "pNInz6obpgDQGcFmaJgB", // Adam - deep, authoritative
    stability: 0.7,
    similarityBoost: 0.8,
    style: 0.2,
  },
  storyteller: {
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel - warm, engaging
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.3,
  },
  energetic: {
    voiceId: "AZnzlk1XvdvUeBnXmlld", // Domi - energetic, upbeat
    stability: 0.4,
    similarityBoost: 0.7,
    style: 0.5,
  },
  calm: {
    voiceId: "MF3mGyEYCl7XYWbV9V6O", // Elli - calm, soothing
    stability: 0.8,
    similarityBoost: 0.6,
    style: 0.1,
  },
  professional: {
    voiceId: "TxGEqnHWrfWFTfGW9XjX", // Josh - professional, clear
    stability: 0.6,
    similarityBoost: 0.85,
    style: 0.15,
  },
} as const;

/**
 * Voice narration using ElevenLabs TTS
 * Requires ELEVENLABS_API_KEY environment variable
 */
export const VoiceNarration = ({
  text,
  startFrame,
  voiceId,
  apiKey,
  model = "eleven_multilingual_v2",
  stability = 0.5,
  similarityBoost = 0.75,
  style = 0,
  useSpeakerBoost = true,
  preGeneratedUrl,
}: VoiceNarrationProps) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  // Use pre-generated audio if provided, otherwise would call ElevenLabs API
  const audioSrc = preGeneratedUrl || generateElevenLabsUrl(text, voiceId, apiKey, model, stability, similarityBoost, style, useSpeakerBoost);

  const isActive = frame >= startFrame;
  const fadeInFrames = fps * 0.5; // 0.5 second fade in
  const fadeOutFrames = fps * 0.5;

  // We don't know exact duration without the audio file
  // In practice, use @remotion/media-utils to get duration
  const estimatedDurationFrames = Math.ceil(text.length * 0.08 * fps); // Rough estimate
  const endFrame = startFrame + estimatedDurationFrames;

  const localFrame = frame - startFrame;
  let volume = 0;

  if (isActive && localFrame < estimatedDurationFrames) {
    if (localFrame < fadeInFrames) {
      volume = interpolate(localFrame, [0, fadeInFrames], [0, 1]);
    } else if (localFrame > estimatedDurationFrames - fadeOutFrames) {
      volume = interpolate(localFrame, [estimatedDurationFrames - fadeOutFrames, estimatedDurationFrames], [1, 0]);
    } else {
      volume = 1;
    }
  }

  if (!isActive || frame >= endFrame) return null;

  return (
    <Audio
      src={audioSrc}
      startFrom={startFrame}
      endAt={endFrame}
      volume={volume}
    />
  );
};

/**
 * Generate ElevenLabs API URL for TTS
 * Note: In production, generate audio files at build time and use preGeneratedUrl
 */
function generateElevenLabsUrl(
  text: string,
  voiceId: string | undefined,
  apiKey: string | undefined,
  model: string,
  stability: number,
  similarityBoost: number,
  style: number,
  useSpeakerBoost: boolean
): string {
  const voice = voiceId || VOICE_PRESETS.narrator.voiceId;
  const key = apiKey || process.env.ELEVENLABS_API_KEY;

  if (!key) {
    console.warn("ElevenLabs API key not set. Set ELEVENLABS_API_KEY env var or pass apiKey prop.");
    return "";
  }

  // This is the API endpoint format - actual generation should happen at build time
  // For runtime, use pre-generated audio files
  const params = new URLSearchParams({
    text,
    model_id: model,
    voice_settings: JSON.stringify({
      stability,
      similarity_boost: similarityBoost,
      style,
      use_speaker_boost: useSpeakerBoost,
    }),
  });

  return `https://api.elevenlabs.io/v1/text-to-speech/${voice}/stream?${params.toString()}`;
}

/**
 * Pre-generate narration audio files at build time
 * Run this script during build to generate all audio files
 * @see scripts-gen/generate-voice.ts for the implementation
 */
export const generateNarrationAudio = async (
  _narrations: Array<{
    id: string;
    text: string;
    voiceId?: string;
    outputPath: string;
  }>,
  _apiKey: string
): Promise<void> => {
  throw new Error(
    "generateNarrationAudio is a Node.js-only function. " +
    "Use scripts-gen/generate-voice.ts instead (run: npm run generate:voice)"
  );
};

/**
 * Simple text-to-speech using Web Speech API (browser only, for preview)
 * Not suitable for final render - use for Remotion Studio preview only
 */
export const PreviewVoiceNarration = ({
  text,
  startFrame,
  voice = "Google US English",
  rate = 1,
  pitch = 1,
  volume = 1,
}: {
  text: string;
  startFrame: number;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // This only works in browser preview (Remotion Studio)
  // For actual rendering, use pre-generated audio files
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    // Trigger speech at startFrame
    // Note: This is a simplified example - real implementation needs more care
  }

  // Return null for actual renders, use pre-generated audio instead
  return null;
};

/**
 * Sequence of narrations for a complete script
 */
export const NarrationSequence = ({
  segments,
  defaultVoice = VOICE_PRESETS.narrator,
}: {
  segments: Array<{
    text: string;
    startFrame: number;
    voicePreset?: keyof typeof VOICE_PRESETS;
    voiceId?: string;
    preGeneratedUrl?: string;
  }>;
  defaultVoice?: typeof VOICE_PRESETS.narrator;
}) => {
  return (
    <>
      {segments.map((segment, index) => (
        <VoiceNarration
          key={index}
          text={segment.text}
          startFrame={segment.startFrame}
          voiceId={segment.voiceId || (segment.voicePreset ? VOICE_PRESETS[segment.voicePreset].voiceId : defaultVoice.voiceId)}
          stability={segment.voicePreset ? VOICE_PRESETS[segment.voicePreset].stability : defaultVoice.stability}
          similarityBoost={segment.voicePreset ? VOICE_PRESETS[segment.voicePreset].similarityBoost : defaultVoice.similarityBoost}
          style={segment.voicePreset ? VOICE_PRESETS[segment.voicePreset].style : defaultVoice.style}
          preGeneratedUrl={segment.preGeneratedUrl}
        />
      ))}
    </>
  );
};