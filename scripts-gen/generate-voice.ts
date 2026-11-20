#!/usr/bin/env node
/**
 * Generate voice narration audio files using ElevenLabs API
 * Run: npx tsx scripts/generate-voice.ts
 */

import { writeFile, mkdir } from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Voice presets (matching VoiceNarration.tsx)
const VOICE_PRESETS = {
  narrator: {
    voiceId: "pNInz6obpgDQGcFmaJgB", // Adam
    name: "Adam",
    stability: 0.7,
    similarityBoost: 0.8,
    style: 0.2,
    useSpeakerBoost: true,
  },
  storyteller: {
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel
    name: "Rachel",
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.3,
    useSpeakerBoost: true,
  },
  energetic: {
    voiceId: "AZnzlk1XvdvUeBnXmlld", // Domi
    name: "Domi",
    stability: 0.4,
    similarityBoost: 0.7,
    style: 0.5,
    useSpeakerBoost: true,
  },
  calm: {
    voiceId: "MF3mGyEYCl7XYWbV9V6O", // Elli
    name: "Elli",
    stability: 0.8,
    similarityBoost: 0.6,
    style: 0.1,
    useSpeakerBoost: true,
  },
  professional: {
    voiceId: "TxGEqnHWrfWFTfGW9XjX", // Josh
    name: "Josh",
    stability: 0.6,
    similarityBoost: 0.85,
    style: 0.15,
    useSpeakerBoost: true,
  },
} as const;

// Narration segments (matching MyComp.tsx)
const NARRATIONS = [
  {
    id: "intro",
    text: "Welcome to Remotion — React for video creation.",
    preset: "narrator" as keyof typeof VOICE_PRESETS,
    outputPath: "public/voice/intro.mp3",
  },
  {
    id: "3d",
    text: "Now featuring 3D animations with Three.js integration.",
    preset: "professional" as keyof typeof VOICE_PRESETS,
    outputPath: "public/voice/3d.mp3",
  },
  {
    id: "audio",
    text: "Add audio, waveforms, and voice narration seamlessly.",
    preset: "storyteller" as keyof typeof VOICE_PRESETS,
    outputPath: "public/voice/audio.mp3",
  },
  {
    id: "outro",
    text: "Create stunning videos programmatically.",
    preset: "calm" as keyof typeof VOICE_PRESETS,
    outputPath: "public/voice/outro.mp3",
  },
];

async function generateAudio(
  text: string,
  voiceId: string,
  apiKey: string,
  settings: typeof VOICE_PRESETS.narrator
): Promise<ArrayBuffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarityBoost,
          style: settings.style,
          use_speaker_boost: settings.useSpeakerBoost,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${error}`);
  }

  return response.arrayBuffer();
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.error("❌ ELEVENLABS_API_KEY environment variable not set");
    console.log("   Set it with: export ELEVENLABS_API_KEY=your_key_here");
    console.log("   Get your key at: https://elevenlabs.io/app/settings/api-keys");
    process.exit(1);
  }

  console.log("🎙️  Generating voice narration files...\n");

  for (const narration of NARRATIONS) {
    const preset = VOICE_PRESETS[narration.preset];

    try {
      console.log(`  Generating: ${narration.id} (${preset.name})...`);
      console.log(`    Text: "${narration.text}"`);

      const audioBuffer = await generateAudio(
        narration.text,
        preset.voiceId,
        apiKey,
        preset
      );

      // Ensure output directory exists
      await mkdir(dirname(narration.outputPath), { recursive: true });

      // Write file
      await writeFile(narration.outputPath, Buffer.from(audioBuffer));

      const sizeKB = (audioBuffer.byteLength / 1024).toFixed(1);
      console.log(`    ✅ Saved: ${narration.outputPath} (${sizeKB} KB)\n`);
    } catch (error) {
      console.error(`    ❌ Failed: ${error}\n`);
    }
  }

  console.log("🎉 Voice generation complete!");
  console.log("   Run 'npm run dev' to preview in Remotion Studio");
  console.log("   Run 'npm run build' to render final video");
}

main().catch(console.error);