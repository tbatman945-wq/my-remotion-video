import { Canvas, useFrame, useThree } from "@remotion/three";
import * as THREE from "three";
import { useVideoConfig, useCurrentFrame, interpolate } from "remotion";

export const ThreeDScene = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  // Animate camera position
  const cameraZ = interpolate(frame, [0, 150], [5, 2]);
  const rotationY = interpolate(frame, [0, 150], [0, Math.PI * 2]);

  return (
    <Canvas
      camera={{ position: [0, 0, cameraZ], fov: 50 }}
      style={{ width, height }}
      shadows
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1} castShadow />

      {/* Rotating cube group */}
      <group rotation={[0, rotationY, 0]}>
        {/* Main cube */}
        <mesh
          position={[-1.5, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#00d9ff"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Wireframe cube */}
        <mesh position={[1.5, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ff6b6b" wireframe />
        </mesh>

        {/* Sphere */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color="#ffd93d" metalness={0.1} roughness={0.8} />
        </mesh>

        {/* Torus */}
        <mesh position={[0, -1.5, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.5, 0.2, 16, 32]} />
          <meshStandardMaterial color="#6bcb77" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Ground plane */}
      <mesh
        position={[0, -2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>
    </Canvas>
  );
};

// Alternative: Custom animated mesh component
export const AnimatedCube = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = interpolate(frame, [0, 30], [0.1, 1]);
  const hue = (frame / 150) * 360;

  return (
    <mesh
      scale={scale}
      rotation={[frame * 0.01, frame * 0.02, 0]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={`hsl(${hue}, 70%, 50%)`}
        metalness={0.2}
        roughness={0.5}
      />
    </mesh>
  );
};