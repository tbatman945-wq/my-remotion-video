import { GoogleFont } from "@remotion/google-fonts";
import {
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
} from "remotion";
import { ReactElement } from "react";

// Font configurations
const FONTS = [
  { family: "Inter", weight: "400", label: "Inter (UI Font)" },
  { family: "Space Grotesk", weight: "700", label: "Space Grotesk (Display)" },
  { family: "JetBrains Mono", weight: "400", label: "JetBrains Mono (Code)" },
  { family: "Outfit", weight: "600", label: "Outfit (Geometric)" },
  { family: "Syne", weight: "800", label: "Syne (Variable)" },
  { family: "Plus Jakarta Sans", weight: "500", label: "Plus Jakarta Sans (Humanist)" },
  { family: "DM Sans", weight: "400", label: "DM Sans (Low Contrast)" },
  { family: "Manrope", weight: "600", label: "Manrope (Modern)" },
];

export const FontsDemo = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: 60,
        color: "white",
        fontFamily: "system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          background: "linear-gradient(90deg, #00d9ff, #fff, #ff6b6b)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
        }}
      >
        @remotion/google-fonts
      </div>

      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 18 }}>
        Self-hosted Google Fonts in Remotion — zero layout shift
      </div>

      {/* Font showcase grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 30,
          maxWidth: 1400,
          width: "100%",
        }}
      >
        {FONTS.map(({ family, weight, label }) => (
          <FontCard
            key={family}
            family={family}
            weight={weight}
            label={label}
            frame={frame}
          />
        ))}
      </div>

      {/* Animated text example */}
      <FontAnimationDemo frame={frame} width={width} />
    </AbsoluteFill>
  );
};

const FontCard = ({
  family,
  weight,
  label,
  frame,
}: {
  family: string;
  weight: string;
  label: string;
  frame: number;
}) => {
  const delay = FONTS.findIndex((f) => f.family === family) * 100;
  const animFrame = Math.max(0, frame - delay);
  const opacity = interpolate(animFrame, [0, 30], [0, 1]);
  const y = interpolate(animFrame, [0, 30], [40, 0]);

  return (
    <GoogleFont fontFamily={family} fontWeight={weight as any}>
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,217,255,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ fontFamily: family, fontWeight: weight, fontSize: 36, color: "#00d9ff" }}>
          {family}
        </div>
        <div style={{ fontFamily: family, fontWeight: weight, fontSize: 18, color: "rgba(255,255,255,0.7)" }}>
          The quick brown fox jumps over the lazy dog.
        </div>
        <div style={{ fontFamily: family, fontWeight: weight, fontSize: 16, color: "rgba(255,255,255,0.5)" }}>
          1234567890 !@#$%^&*()
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "system-ui" }}>
          {label}
        </div>
      </div>
    </GoogleFont>
  );
};

const FontAnimationDemo = ({ frame, width }: { frame: number; width: number }) => {
  const text = "REMOTION";
  const chars = text.split("");

  return (
    <GoogleFont fontFamily="Space Grotesk" fontWeight="700">
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 40,
          perspective: "1000px",
        }}
      >
        {chars.map((char, i) => {
          const delay = i * 100;
          const animFrame = Math.max(0, frame - delay);
          const rotationX = interpolate(animFrame, [0, 60], [90, 0]);
          const opacity = interpolate(animFrame, [0, 30], [0, 1]);
          const scale = interpolate(animFrame, [0, 40], [0.5, 1]);
          const hue = (frame + i * 30) % 360;

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `rotateX(${rotationX}deg) scale(${scale})`,
                transformOrigin: "center bottom",
                fontSize: 64,
                fontWeight: 700,
                fontFamily: "Space Grotesk",
                background: `linear-gradient(90deg, hsl(${hue}, 80%, 55%), hsl(${(hue + 60) % 360}, 80%, 55%))`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              {char}
            </div>
          );
        })}
      </div>
    </GoogleFont>
  );
};

// Variable font demo
export const VariableFontDemo = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: 60,
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <GoogleFont fontFamily="Syne" fontWeight="400 800">
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
          Variable Font: Syne (Weight 400→800)
        </div>

        <div
          style={{
            fontFamily: "Syne",
            fontSize: 80,
            fontVariationSettings: `'wght' ${interpolate(frame, [0, 150], [400, 800])}`,
            background: "linear-gradient(90deg, #00d9ff, #ff6b6b)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          VARIABLE
        </div>

        <div
          style={{
            fontFamily: "Syne",
            fontSize: 20,
            fontVariationSettings: `'wght' ${interpolate(frame, [0, 150], [400, 800])}`,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Weight: {Math.round(interpolate(frame, [0, 150], [400, 800]))}
        </div>
      </GoogleFont>
    </AbsoluteFill>
  );
};