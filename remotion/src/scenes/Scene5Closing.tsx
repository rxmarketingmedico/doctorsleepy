import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

export const Scene5Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const taglineOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const subtextOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });

  // Floating stars
  const stars = [
    { x: 80, y: 120, delay: 0, size: 20 },
    { x: 260, y: 80, delay: 10, size: 16 },
    { x: 50, y: 400, delay: 20, size: 14 },
    { x: 280, y: 500, delay: 5, size: 18 },
    { x: 170, y: 60, delay: 15, size: 12 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a2a4a 0%, #2d4a6f 50%, #3d5a8f 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Floating stars */}
      {stars.map((star, i) => {
        const floatY = Math.sin((frame + star.delay * 3) * 0.05) * 10;
        const starOpacity = interpolate(frame, [star.delay, star.delay + 20], [0, 0.6], { extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: star.x,
              top: star.y + floatY,
              fontSize: star.size,
              opacity: starOpacity,
            }}
          >
            ✨
          </div>
        );
      })}

      {/* Moon */}
      <div
        style={{
          fontSize: 60,
          transform: `scale(${logoScale})`,
          marginBottom: 16,
          filter: "drop-shadow(0 0 20px rgba(245,199,126,0.5))",
        }}
      >
        🌙
      </div>

      {/* Logo text */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "white",
          transform: `scale(${logoScale})`,
          textShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        Dr. Sleepy
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 16,
          fontSize: 16,
          fontWeight: 600,
          color: "#f5c77e",
          opacity: taglineOpacity,
          letterSpacing: 1,
        }}
      >
        Your baby sleeps tonight 💤
      </div>

      {/* Subtext */}
      <div
        style={{
          marginTop: 12,
          fontSize: 11,
          color: "rgba(255,255,255,0.6)",
          opacity: subtextOpacity,
        }}
      >
        AI-Powered Sleep Assistant
      </div>
    </AbsoluteFill>
  );
};
