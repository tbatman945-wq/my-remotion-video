// Main exports
export * from "./MyComp";
export * from "./Root";

// 3D
export { ThreeDScene, AnimatedCube } from "./ThreeDScene";

// PS2 Winter Walk
export {
  PS2WinterWalk,
  PS2WinterWalkAudio,
  PS2WinterWalkWithAudio,
} from "./PS2WinterWalk";

// Audio
export {
  AudioScene,
  BackgroundMusic,
  SoundEffect,
  AudioWaveformVisualizer,
  PreviewVoiceNarration,
  NarrationSequence,
  VOICE_PRESETS,
} from "./AudioScene";

export { WaveformVisualizer, CircularWaveform, AudioLevelMeter } from "./WaveformVisualizer";

// Voice Narration
export {
  VoiceNarration,
  NarrationSequence as VoiceNarrationSequence,
  VOICE_PRESETS,
  generateNarrationAudio,
  type VoiceNarrationProps,
  type ElevenLabsVoice,
} from "./VoiceNarration";

// Transitions
export {
  TransitionsDemo,
  WipeTransition,
  SlideTransition,
  FadeTransition,
  ZoomTransition,
  FlipTransition,
} from "./TransitionsDemo";

// Fonts
export { FontsDemo, VariableFontDemo, FontCard, FontAnimationDemo } from "./FontsDemo";

// Types
export interface MyCompProps {
  title: string;
  subtitle: string;
}

export interface ThreeDSceneProps {}

export interface AudioSceneProps {
  src: string;
  startFrom?: number;
  endAt?: number;
  volume?: number;
  showWaveform?: boolean;
}

export interface VoiceNarrationProps {
  text: string;
  startFrame: number;
  voiceId?: string;
  apiKey?: string;
  model?: "eleven_multilingual_v2" | "eleven_turbo_v2" | "eleven_english_v2";
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
  preGeneratedUrl?: string;
}

export interface TransitionsDemoProps {
  durationInFrames?: number;
  fps?: number;
}