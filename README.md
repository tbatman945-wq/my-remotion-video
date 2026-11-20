# My Remotion Video — 3D, Audio, Voice & Transitions

A comprehensive Remotion project showcasing:
- **3D Animation** with `@remotion/three` + Three.js
- **Audio & Waveforms** with `@remotion/media-utils`
- **Voice Narration** with `@remotion/elevenlabs` (ElevenLabs TTS)
- **Scene Transitions** with `@remotion/transitions`
- **Google Fonts** with `@remotion/google-fonts`

## Quick Start

```bash
# Install dependencies
npm install

# Generate voice narration (requires ElevenLabs API key)
export ELEVENLABS_API_KEY=your_key_here
npm run generate:voice

# Start Remotion Studio (dev preview)
npm run dev

# Render main video
npm run build

# Render all compositions
npm run render:all
```

## Project Structure

```
my-video/
├── public/
│   ├── music/          # Background music (ambient.mp3)
│   ├── sfx/            # Sound effects (whoosh.mp3, pop.mp3)
│   ├── voice/          # Generated narration (intro.mp3, 3d.mp3, etc.)
│   ├── audio/          # Audio for waveform viz (demo.mp3)
│   ├── fonts/          # Local font files (woff2)
│   └── images/         # Image assets
├── src/
│   ├── Root.tsx              # Composition registration
│   ├── MyComp.tsx            # Main demo composition
│   ├── ThreeDScene.tsx       # Three.js 3D scenes
│   ├── AudioScene.tsx        # Audio playback & waveforms
│   ├── VoiceNarration.tsx    # ElevenLabs TTS integration
│   ├── WaveformVisualizer.tsx # Real-time waveform (media-utils)
│   ├── TransitionsDemo.tsx   # 12 transition types
│   ├── FontsDemo.tsx         # Google Fonts showcase
│   ├── index.ts              # All exports
│   └── scripts/
│       └── generate-voice.ts # Voice generation script
├── package.json
├── tsconfig.json
├── remotion.config.ts
└── README.md
```

## Compositions (in Root.tsx)

| Composition | Resolution | FPS | Duration | Use Case |
|-------------|------------|-----|----------|----------|
| `MyComp` | 1920×1080 | 30 | 5s | Main demo |
| `ThreeDDemo` | 1920×1080 | 30 | 5s | 3D only |
| `MyComp` (square) | 1080×1080 | 30 | 5s | Instagram |
| `MyComp` (vertical) | 1080×1920 | 30 | 5s | Reels/TikTok |
| `MyComp` (4K) | 3840×2160 | 30 | 5s | Ultra HD |
| `MyComp` (60fps) | 1920×1080 | 60 | 5s | Smooth motion |
| `MyComp` (loop) | 1920×1080 | 30 | 4s | Seamless loop |

Render specific composition:
```bash
npx remotion render MyComp out/video.mp4 --composition=ThreeDDemo
```

## Features Overview

### 3D Animation (`ThreeDScene.tsx`)

```tsx
import { Canvas, useFrame } from "@remotion/three";
import * as THREE from "three";

<Canvas camera={{ position: [0, 0, 5] }} shadows>
  <ambientLight intensity={0.5} />
  <directionalLight position={[5, 10, 7]} castShadow />
  <mesh castShadow receiveShadow>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#00d9ff" />
  </mesh>
</Canvas>
```

**Features:**
- Full Three.js integration (geometries, materials, lights, shadows)
- Frame-perfect animation with `useCurrentFrame()` + `interpolate()`
- Post-processing ready (add `@remotion/three` effects)

### Audio & Waveforms (`AudioScene.tsx`, `WaveformVisualizer.tsx`)

```tsx
import { Audio } from "remotion";
import { getAudioData } from "@remotion/media-utils";

<Audio src="/audio/track.mp3" startFrom={0} endAt={150} volume={0.8} />

// Real waveform data
const audioData = await getAudioData("/audio/track.mp3");
// Float32Array with amplitude per sample
```

**Features:**
- Multiple audio tracks with individual volume/timing
- Background music with auto-ducking during narration
- Sound effects synced to exact frames
- Real-time waveform visualization (linear & circular)
- Audio level meter (dB monitoring)

### Voice Narration (`VoiceNarration.tsx`)

```tsx
import { VoiceNarration, VOICE_PRESETS } from "./VoiceNarration";

<VoiceNarration
  text="Welcome to Remotion!"
  startFrame={30}
  voicePreset="narrator"
  preGeneratedUrl="/voice/intro.mp3"
/>
```

**Voice Presets:**
| Preset | Voice | Style |
|--------|-------|-------|
| `narrator` | Adam | Deep, authoritative |
| `storyteller` | Rachel | Warm, engaging |
| `energetic` | Domi | Upbeat, energetic |
| `calm` | Elli | Soothing, calm |
| `professional` | Josh | Clear, professional |

**Generate audio files:**
```bash
export ELEVENLABS_API_KEY=your_key
npm run generate:voice
```

### Transitions (`TransitionsDemo.tsx`)

12 built-in transitions from `@remotion/transitions`:

| Transition | Effect |
|------------|--------|
| `Wipe` | Directional reveal |
| `Slide` | Slide in/out |
| `Fade` | Cross-fade |
| `Zoom` | Scale transition |
| `Flip` | 3D flip |
| `Circle` | Circular reveal |
| `Polygon` | Polygon mask |
| `Dreamy` | Blur + zoom |
| `Blur` | Blur transition |
| `Cube` | 3D cube rotate |
| `Door` | Door open/close |
| `PageTurn` | Page flip |

```tsx
import { Wipe, Slide, Fade } from "@remotion/transitions";

<Wipe durationInFrames={30} direction="right" color="#00d9ff">
  <NextScene />
</Wipe>
```

### Google Fonts (`FontsDemo.tsx`)

```tsx
import { GoogleFont } from "@remotion/google-fonts";

<GoogleFont fontFamily="Space Grotesk" fontWeight="700">
  <h1>Self-hosted, zero layout shift</h1>
</GoogleFont>

// Variable fonts
<div style={{ fontVariationSettings: `'wght' ${weight}` }}>VARIABLE</div>
```

**Included fonts:** Inter, Space Grotesk, JetBrains Mono, Outfit, Syne, Plus Jakarta Sans, DM Sans, Manrope

## Asset Requirements

Place these files in `public/` before rendering:

```
public/
├── music/ambient.mp3      # Looping background track (~30s+)
├── sfx/whoosh.mp3         # Scene transition (~1s)
├── sfx/pop.mp3            # UI sound (~0.5s)
├── audio/demo.mp3         # Waveform visualization (~3s)
└── voice/
    ├── intro.mp3          # Generated via ElevenLabs
    ├── 3d.mp3
    ├── audio.mp3
    └── outro.mp3
```

## Commands

```bash
# Development
npm run dev                    # Opens Remotion Studio at localhost:3000

# Voice generation
export ELEVENLABS_API_KEY=xxx
npm run generate:voice         # Generates all narration files

# Rendering
npm run build                  # Main composition → out/out.mp4
npm run still                  # Frame 30 → out/out.png
npm run render:all             # All compositions

# Quality presets
npx remotion render MyComp out/4k.mp4 --width=3840 --height=2160 --codec=h264 --crf=18
npx remotion render MyComp out/high.mp4 --codec=prores --profile=hq
```

## Remotion Studio Tips

1. **Frame scrubber** — Drag timeline to preview animations
2. **Component inspector** — Click elements to see props
3. **Audio waveform** — Visualize audio tracks in timeline
4. **Console** — `console.log(frame)` appears in browser devtools
5. **Performance** — Check "Show FPS" in settings

## Deployment

### Cloud Rendering (AWS Lambda)

```bash
npx remotion lambda sites create --region us-east-1
npx remotion lambda render --site=mysite MyComp out/video.mp4
```

### Docker

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx remotion render MyComp out/video.mp4
```

## Resources

- [Remotion Docs](https://www.remotion.dev/docs)
- [Three.js Integration](https://www.remotion.dev/docs/three)
- [Transitions](https://www.remotion.dev/docs/transitions)
- [Media Utils](https://www.remotion.dev/docs/media-utils)
- [ElevenLabs](https://elevenlabs.io/docs)
- [Google Fonts](https://www.remotion.dev/docs/google-fonts)

## License

MIT — Use freely for personal and commercial projects.