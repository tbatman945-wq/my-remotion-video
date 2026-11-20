import {
  Canvas,
  useFrame,
  useThree,
  PerspectiveCamera,
  Group,
  mesh,
  SphereGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  BoxGeometry,
  PlaneGeometry,
  CylinderGeometry,
  ConeGeometry,
  Group as ThreeGroup,
} from "@remotion/three";
import * as THREE from "three";
import {
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  spring,
  AbsoluteFill,
  Audio,
} from "remotion";
import { ReactElement } from "react";

// PS2/8-bit color palette
const PS2_COLORS = {
  // Winter whites/grays
  snow: 0xf0f0f0,
  snowShadow: 0xc0c0c0,
  ice: 0x88ccff,
  // Dark muted tones
  darkGray: 0x333333,
  mediumGray: 0x555555,
  lightGray: 0x888888,
  // Character colors (muted PS2 style)
  skin: 0xd4a574,
  jacket: 0x2d3a4a,
  jacketHighlight: 0x3d4a5a,
  pants: 0x1a1a2e,
  boots: 0x0d0d0d,
  hair: 0x2c1810,
  // Environment
  sidewalk: 0x666666,
  sidewalkCrack: 0x444444,
  road: 0x2a2a2a,
  building: 0x3d3d4d,
  buildingDark: 0x2a2a3a,
  window: 0x1a1a2e,
  windowLit: 0x4a4a2a,
  streetLight: 0x222222,
  lightGlow: 0xffcc66,
  skyTop: 0x1a1a3a,
  skyBottom: 0x3a3a5a,
  fog: 0x8888aa,
  // Particles
  snowflake: 0xffffff,
  breath: 0xcccccc,
};

interface PS2WinterWalkProps {
  durationInFrames?: number;
  fps?: number;
}

// Low-poly character model
const PS2Character = ({
  frame,
  fps,
  walkSpeed = 1,
}: {
  frame: number;
  fps: number;
  walkSpeed?: number;
}) => {
  const walkCycle = (frame * walkSpeed * 0.3) % (Math.PI * 2);
  const armSwing = Math.sin(walkCycle) * 0.6;
  const legSwing = Math.sin(walkCycle) * 0.8;
  const bodyBob = Math.abs(Math.sin(walkCycle * 2)) * 0.05;
  const bodySide = Math.sin(walkCycle) * 0.02;

  // Breath effect (every 2 seconds)
  const breathCycle = (frame / (fps * 2)) % 1;
  const breathSize = breathCycle < 0.3 ? breathCycle / 0.3 * 0.15 : 0;

  return (
    <ThreeGroup position={[0, bodyBob, 0]} rotation={[0, bodySide, 0]}>
      {/* Head */}
      <mesh position={[0, 1.45, 0]} scale={0.35}>
        <BoxGeometry args={[1, 1, 1]} />
        <MeshStandardMaterial color={PS2_COLORS.skin} roughness={0.9} metalness={0} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.65, 0.05]} scale={[0.38, 0.25, 0.38]}>
        <BoxGeometry args={[1, 1, 1]} />
        <MeshStandardMaterial color={PS2_COLORS.hair} roughness={1} metalness={0} />
      </mesh>

      {/* Body / Jacket */}
      <mesh position={[0, 1.05, 0]} scale={[0.45, 0.55, 0.25]}>
        <BoxGeometry args={[1, 1, 1]} />
        <MeshStandardMaterial color={PS2_COLORS.jacket} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Jacket collar */}
      <mesh position={[0, 1.38, 0.15]} scale={[0.5, 0.15, 0.1]}>
        <BoxGeometry args={[1, 1, 1]} />
        <MeshStandardMaterial color={PS2_COLORS.jacketHighlight} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Arms */}
      {/* Left arm */}
      <ThreeGroup position={[-0.35, 1.2, 0]} rotation={[armSwing, 0, 0.1]}>
        <mesh position={[0, -0.25, 0]} scale={[0.15, 0.5, 0.15]}>
          <BoxGeometry args={[1, 1, 1]} />
          <MeshStandardMaterial color={PS2_COLORS.jacket} roughness={0.8} metalness={0} />
        </mesh>
        <mesh position={[0, -0.55, 0]} scale={[0.13, 0.13, 0.13]}>
          <SphereGeometry args={[1, 8, 8]} />
          <MeshStandardMaterial color={PS2_COLORS.skin} roughness={0.9} metalness={0} />
        </mesh>
      </ThreeGroup>

      {/* Right arm */}
      <ThreeGroup position={[0.35, 1.2, 0]} rotation={[-armSwing, 0, -0.1]}>
        <mesh position={[0, -0.25, 0]} scale={[0.15, 0.5, 0.15]}>
          <BoxGeometry args={[1, 1, 1]} />
          <MeshStandardMaterial color={PS2_COLORS.jacket} roughness={0.8} metalness={0} />
        </mesh>
        <mesh position={[0, -0.55, 0]} scale={[0.13, 0.13, 0.13]}>
          <SphereGeometry args={[1, 8, 8]} />
          <MeshStandardMaterial color={PS2_COLORS.skin} roughness={0.9} metalness={0} />
        </mesh>
      </ThreeGroup>

      {/* Legs */}
      {/* Left leg */}
      <ThreeGroup position={[-0.15, 0.55, 0]} rotation={[legSwing * 0.5, 0, 0]}>
        <mesh position={[0, -0.25, 0]} scale={[0.15, 0.5, 0.15]}>
          <BoxGeometry args={[1, 1, 1]} />
          <MeshStandardMaterial color={PS2_COLORS.pants} roughness={0.9} metalness={0} />
        </mesh>
        <mesh position={[0, -0.55, 0.05]} scale={[0.18, 0.1, 0.25]}>
          <BoxGeometry args={[1, 1, 1]} />
          <MeshStandardMaterial color={PS2_COLORS.boots} roughness={0.3} metalness={0.5} />
        </mesh>
      </ThreeGroup>

      {/* Right leg */}
      <ThreeGroup position={[0.15, 0.55, 0]} rotation={[-legSwing * 0.5, 0, 0]}>
        <mesh position={[0, -0.25, 0]} scale={[0.15, 0.5, 0.15]}>
          <BoxGeometry args={[1, 1, 1]} />
          <MeshStandardMaterial color={PS2_COLORS.pants} roughness={0.9} metalness={0} />
        </mesh>
        <mesh position={[0, -0.55, 0.05]} scale={[0.18, 0.1, 0.25]}>
          <BoxGeometry args={[1, 1, 1]} />
          <MeshStandardMaterial color={PS2_COLORS.boots} roughness={0.3} metalness={0.5} />
        </mesh>
      </ThreeGroup>

      {/* Breath particle */}
      {breathSize > 0 && (
        <mesh
          position={[0, 1.7, 0.4]}
          scale={breathSize}
          material={{
            color: PS2_COLORS.breath,
            transparent: true,
            opacity: 0.4 * (1 - breathCycle / 0.3),
            depthWrite: false,
          }}
        >
          <SphereGeometry args={[1, 6, 6]} />
        </mesh>
      )}
    </ThreeGroup>
  );
};

// PS2-style building
const PS2Building = ({
  x,
  z,
  width = 4,
  height = 12,
  depth = 4,
  floors = 4,
  seed = 0,
}: {
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  floors: number;
  seed: number;
}) => {
  const rand = (n: number) => Math.sin(n * 12.9898 + seed * 78.233) * 43758.5453 % 1;

  return (
    <ThreeGroup position={[x, height / 2, z]}>
      {/* Building base */}
      <mesh
        scale={[width, height, depth]}
        material={{ color: PS2_COLORS.building, roughness: 0.9, metalness: 0 }}
      >
        <BoxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* Windows */}
      {Array.from({ length: floors }, (_, f) => {
        const floorY = (f - floors / 2 + 0.5) * (height / floors);
        const windowsPerFloor = Math.max(1, Math.floor(width / 1.2));

        return Array.from({ length: windowsPerFloor }, (_, w) => {
          const windowX = (w - (windowsPerFloor - 1) / 2) * 1.2;
          const isLit = rand(f * 100 + w * 10 + seed) > 0.7;

          return (
            <mesh
              key={`win-${f}-${w}`}
              position={[windowX, floorY, depth / 2 + 0.02]}
              scale={[0.7, height / floors * 0.7, 0.1]}
              material={{
                color: isLit ? PS2_COLORS.windowLit : PS2_COLORS.window,
                emissive: isLit ? PS2_COLORS.windowLit : 0x000000,
                emissiveIntensity: isLit ? 0.3 : 0,
                roughness: 0.1,
                metalness: 0.8,
              }}
            >
              <BoxGeometry args={[1, 1, 1]} />
            </mesh>
          );
        });
      })}

      {/* Roof */}
      <mesh
        position={[0, height / 2 + 0.2, 0]}
        scale={[width + 0.4, 0.4, depth + 0.4]}
        material={{ color: PS2_COLORS.darkGray, roughness: 0.8, metalness: 0.2 }}
      >
        <BoxGeometry args={[1, 1, 1]} />
      </mesh>
    </ThreeGroup>
  );
};

// Street light
const PS2StreetLight = ({ x, z, frame, fps }: { x: number; z: number; frame: number; fps: number }) => {
  const flicker = Math.sin(frame * 0.05 + x * 10) * 0.1 + 0.9;

  return (
    <ThreeGroup position={[x, 0, z]}>
      {/* Pole */}
      <mesh
        position={[0, 4, 0]}
        scale={[0.1, 8, 0.1]}
        material={{ color: PS2_COLORS.streetLight, roughness: 0.5, metalness: 0.7 }}
      >
        <CylinderGeometry args={[1, 1, 1, 8]} />
      </mesh>

      {/* Light fixture */}
      <mesh
        position={[0, 8.2, 0]}
        scale={[0.5, 0.3, 0.5]}
        material={{ color: PS2_COLORS.streetLight, roughness: 0.3, metalness: 0.8 }}
      >
        <BoxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* Light glow */}
      <mesh
        position={[0, 8, 0]}
        scale={[2, 4, 2]}
        material={{
          color: PS2_COLORS.lightGlow,
          transparent: true,
          opacity: 0.08 * flicker,
          depthWrite: false,
        }}
      >
        <SphereGeometry args={[1, 12, 12]} />
      </mesh>
    </ThreeGroup>
  );
};

// Snow particle system
const PS2SnowSystem = ({
  frame,
  fps,
  count = 500,
  area = 60,
}: {
  frame: number;
  fps: number;
  count?: number;
  area?: number;
}) => {
  // Pre-generate snowflake positions deterministically
  const flakes = Array.from({ length: count }, (_, i) => {
    const seed = i * 13.7;
    return {
      x: (Math.sin(seed) * 43758.5453 % 1) * area - area / 2,
      y: (Math.cos(seed * 2) * 43758.5453 % 1) * 20,
      z: (Math.sin(seed * 3) * 43758.5453 % 1) * area - area / 2,
      speed: 0.5 + (Math.sin(seed * 4) * 43758.5453 % 1) * 0.5,
      drift: (Math.cos(seed * 5) * 43758.5453 % 1) * 0.02,
      size: 0.05 + (Math.sin(seed * 6) * 43758.5453 % 1) * 0.1,
      phase: Math.sin(seed * 7) * Math.PI * 2,
    };
  });

  return (
    <ThreeGroup>
      {flakes.map((flake, i) => {
        const fallProgress = (frame * flake.speed * 0.1 + flake.phase) % (22);
        const y = 20 - fallProgress;
        const x = flake.x + Math.sin(frame * 0.01 + flake.phase) * flake.drift * 100;
        const z = flake.z + Math.cos(frame * 0.01 + flake.phase) * flake.drift * 50;
        const opacity = y > 18 ? (20 - y) / 2 : y < 2 ? y / 2 : 1;

        return (
          <mesh
            key={i}
            position={[x, Math.max(y, 0.1), z]}
            scale={flake.size}
            material={{
              color: PS2_COLORS.snowflake,
              transparent: true,
              opacity: opacity * 0.8,
              depthWrite: false,
            }}
          >
            <PlaneGeometry args={[1, 1]} />
          </mesh>
        );
      })}
    </ThreeGroup>
  );
};

// Footprint system
const PS2Footprints = ({
  frame,
  characterZ,
}: {
  frame: number;
  characterZ: number;
}) => {
  const stepInterval = 15; // frames per step
  const steps = Math.floor(frame / stepInterval);
  const maxVisibleSteps = 20;

  return (
    <ThreeGroup>
      {Array.from({ length: Math.min(steps, maxVisibleSteps) }, (_, i) => {
        const stepFrame = i * stepInterval;
        const age = frame - stepFrame;
        const opacity = Math.max(0, 1 - age / (maxVisibleSteps * stepInterval));
        const z = characterZ - i * 0.8; // Behind character

        if (opacity < 0.05) return null;

        return (
          <ThreeGroup key={i}>
            {/* Left footprint */}
            <mesh
              position={[-0.15, 0.02, z]}
              scale={[0.12, 0.02, 0.2]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={{
                color: PS2_COLORS.snowShadow,
                transparent: true,
                opacity: opacity * 0.5,
                depthWrite: false,
              }}
            >
              <BoxGeometry args={[1, 1, 1]} />
            </mesh>

            {/* Right footprint */}
            <mesh
              position={[0.15, 0.02, z - 0.4]}
              scale={[0.12, 0.02, 0.2]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={{
                color: PS2_COLORS.snowShadow,
                transparent: true,
                opacity: opacity * 0.5,
                depthWrite: false,
              }}
            >
              <BoxGeometry args={[1, 1, 1]} />
            </mesh>
          </ThreeGroup>
        );
      })}
    </ThreeGroup>
  );
};

export const PS2WinterWalk = ({
  durationInFrames = 300,
  fps = 30,
}: PS2WinterWalkProps) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  // Character moves forward along Z axis
  const walkSpeed = 0.3;
  const characterZ = -frame * walkSpeed;
  const characterX = Math.sin(frame * 0.02) * 0.3; // Slight side movement

  // Camera follows character
  const cameraZ = characterZ + 8;
  const cameraY = 3 + Math.sin(frame * 0.1) * 0.2;
  const cameraX = characterX;

  // Sky gradient animation
  const skyPhase = (frame / durationInFrames) * Math.PI * 2;

  return (
    <Canvas
      camera={{
        position: [cameraX, cameraY, cameraZ],
        lookAt: [characterX, 1.2, characterZ - 3],
        fov: 45,
      }}
      style={{ width, height }}
      shadows
      toneMapping="ACESFilmic"
      toneMappingExposure={1.2}
    >
      {/* Fog */}
      <fog
        color={PS2_COLORS.fog}
        near={5}
        far={50}
      />

      {/* Sky dome */}
      <mesh
        position={[0, 0, characterZ]}
        scale={100}
        material={{
          color: PS2_COLORS.skyTop,
          side: THREE.BackSide,
          depthWrite: false,
        }}
      >
        <SphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Ground - Road */}
      <mesh
        position={[0, 0, characterZ]}
        scale={[12, 0.1, 200]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={{ color: PS2_COLORS.road, roughness: 0.95, metalness: 0 }}
        receiveShadow
      >
        <BoxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* Sidewalks */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 7, 0.06, characterZ]}
          scale={[3, 0.1, 200]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={{ color: PS2_COLORS.sidewalk, roughness: 0.9, metalness: 0 }}
          receiveShadow
        >
          <BoxGeometry args={[1, 1, 1]} />
        </mesh>
      ))}

      {/* Sidewalk snow cover */}
      {[-1, 1].map((side) => (
        <mesh
          key={`snow-${side}`}
          position={[side * 7, 0.07, characterZ]}
          scale={[3, 0.02, 200]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={{
            color: PS2_COLORS.snow,
            roughness: 0.95,
            metalness: 0,
            transparent: true,
            opacity: 0.9,
          }}
        >
          <BoxGeometry args={[1, 1, 1]} />
        </mesh>
      ))}

      {/* Sidewalk cracks */}
      {Array.from({ length: 50 }, (_, i) => {
        const z = characterZ - i * 4;
        return [-1, 1].map((side) => (
          <mesh
            key={`crack-${side}-${i}`}
            position={[side * 7 + (i % 2) * 0.5, 0.08, z]}
            scale={[2.5, 0.01, 0.05]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={{ color: PS2_COLORS.sidewalkCrack, roughness: 1, metalness: 0 }}
          >
            <BoxGeometry args={[1, 1, 1]} />
          </mesh>
        ));
      })}

      {/* Buildings - Left side */}
      {Array.from({ length: 15 }, (_, i) => (
        <PS2Building
          key={`building-L-${i}`}
          x={-10}
          z={characterZ - i * 12 - 6}
          width={3 + (i % 3) * 1.5}
          height={8 + (i % 4) * 4}
          depth={3 + (i % 2) * 1}
          floors={2 + (i % 4)}
          seed={i * 1.5}
        />
      ))}

      {/* Buildings - Right side */}
      {Array.from({ length: 15 }, (_, i) => (
        <PS2Building
          key={`building-R-${i}`}
          x={10}
          z={characterZ - i * 12 - 6}
          width={3 + (i % 3) * 1.5}
          height={8 + (i % 4) * 4}
          depth={3 + (i % 2) * 1}
          floors={2 + (i % 4)}
          seed={i * 1.5 + 100}
        />
      ))}

      {/* Street lights - Left */}
      {Array.from({ length: 10 }, (_, i) => (
        <PS2StreetLight
          key={`light-L-${i}`}
          x={-8.5}
          z={characterZ - i * 20 - 10}
          frame={frame}
          fps={fps}
        />
      ))}

      {/* Street lights - Right */}
      {Array.from({ length: 10 }, (_, i) => (
        <PS2StreetLight
          key={`light-R-${i}`}
          x={8.5}
          z={characterZ - i * 20 - 10}
          frame={frame}
          fps={fps}
        />
      ))}

      {/* Snow particles */}
      <PS2SnowSystem frame={frame} fps={fps} count={800} area={80} />

      {/* Character */}
      <PS2Character
        position={[characterX, 0, characterZ]}
        frame={frame}
        fps={fps}
        walkSpeed={1}
      />

      {/* Footprints */}
      <PS2Footprints frame={frame} characterZ={characterZ} />

      {/* Ambient light */}
      <ambientLight color={0x667788} intensity={0.4} />
      <hemisphereLight skyColor={0x8899aa} groundColor={0x445566} intensity={0.3} />

      {/* Main directional light (moon) */}
      <directionalLight
        position={[-20, 30, -10]}
        color={0xaaaacc}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-radius={4}
      />

      {/* Rim light */}
      <directionalLight
        position={[10, 10, 10]}
        color={0x445566}
        intensity={0.2}
      />
    </Canvas>
  );
};

// Sound effects component
export const PS2WinterWalkAudio = ({
  frame,
  fps,
  durationInFrames = 300,
}: {
  frame: number;
  fps: number;
  durationInFrames?: number;
}) => {
  const stepInterval = 15;
  const isStepFrame = frame % stepInterval === 0;
  const stepNumber = Math.floor(frame / stepInterval);

  return (
    <>
      {/* Footstep sounds - crisp snow crunch */}
      {isStepFrame && stepNumber < 20 && (
        <Audio
          src="/sfx/snow_step.mp3"
          startFrom={frame}
          endAt={frame + fps / 2}
          volume={0.6}
        />
      )}

      {/* Wind howling - continuous */}
      <Audio
        src="/sfx/wind_winter.mp3"
        startFrom={0}
        endAt={durationInFrames}
        volume={0.25}
        loop
      />

      {/* Distant city ambience */}
      <Audio
        src="/sfx/city_ambience.mp3"
        startFrom={0}
        endAt={durationInFrames}
        volume={0.15}
        loop
      />

      {/* Breath sounds - every 2 seconds */}
      {frame % (fps * 2) === 0 && frame < 240 && (
        <Audio
          src="/sfx/breath_cold.mp3"
          startFrom={frame}
          endAt={frame + fps}
          volume={0.4}
        />
      )}

      {/* Clothing rustle - periodic */}
      {frame % (fps * 3) === 0 && frame < 240 && (
        <Audio
          src="/sfx/jacket_rustle.mp3"
          startFrom={frame}
          endAt={frame + fps}
          volume={0.3}
        />
      )}
    </>
  );
};

// Main composition with audio
export const PS2WinterWalkWithAudio = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#1a1a3a", overflow: "hidden" }}>
      <PS2WinterWalk durationInFrames={durationInFrames} fps={fps} />
      <PS2WinterWalkAudio frame={frame} fps={fps} durationInFrames={durationInFrames} />

      {/* UI Overlay */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#88aacc",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 14,
          textShadow: "2px 2px 0 #000",
          pointerEvents: "none",
        }}
      >
        <div>PS2 WINTER WALK</div>
        <div style={{ fontSize: 10, marginTop: 8, opacity: 0.7 }}>
          FRAME: {frame.toString().padStart(4, "0")} / {durationInFrames}
        </div>
        <div style={{ fontSize: 10, opacity: 0.5 }}>
          8-BIT • LOW POLY • 30FPS
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          color: "#88aacc",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          textAlign: "right",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      >
        <div>@remotion/three</div>
        <div>PS2 AESTHETIC</div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>
    </AbsoluteFill>
  );
};