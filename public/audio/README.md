# Audio Files for Visualization

Place audio files for waveform visualization here:

- `demo.mp3` - Audio track to visualize with waveform

## Requirements

- Format: MP3, WAV, or OGG
- Duration: ~3 seconds (matches SCENES.audio: frames 90-120 @ 30fps)
- Used with `<AudioScene showWaveform={true} />`

## Waveform Visualization

The `AudioScene` component uses `@remotion/media-utils` for real waveform data:

```tsx
import { getAudioData } from "@remotion/media-utils";

const audioData = await getAudioData("demo.mp3");
// Returns Float32Array with amplitude data per frame
```

Then map to visual bars in the render loop.