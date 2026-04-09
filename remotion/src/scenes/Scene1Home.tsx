import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

// Home screen with Emergency Mode
export const Scene1Home: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emergencyOptions = [
    { icon: "🍼", label: "Could it be hunger?", color: "#f5c77e" },
    { icon: "🌙", label: "Could it be sleep?", color: "#8bb8e8" },
    { icon: "🌡️", label: "Could it be discomfort?", color: "#e88b8b" },
    { icon: "👶", label: "Inconsolable crying", color: "#d4a5d4" },
  ];

  const headerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#f0f4f8", paddingTop: 44 }}>
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          padding: "12px 16px",
          borderBottom: "1px solid #e0e6ed",
          background: "rgba(240,244,248,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, color: "#2d4a6f" }}>
          🌙 Dr. Sleepy
        </div>
        <div style={{ fontSize: 14, color: "#8899aa" }}>☀️</div>
      </div>

      {/* Avatar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            background: "linear-gradient(135deg, #8bb8e8, #a5d4a5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            transform: `scale(${spring({ frame: frame - 10, fps, config: { damping: 12 } })})`,
          }}
        >
          🧸
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 20,
            fontWeight: 700,
            color: "#2d4a6f",
            opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Emergency Mode
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            color: "#8899aa",
            textAlign: "center",
            padding: "0 24px",
            opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Is your baby crying? Choose the option that best describes the situation.
        </div>
      </div>

      {/* Emergency Buttons Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          padding: "16px 16px",
          marginTop: 12,
        }}
      >
        {emergencyOptions.map((opt, i) => {
          const s = spring({ frame: frame - 25 - i * 5, fps, config: { damping: 14 } });
          const isHighlighted = i === 1; // "Could it be sleep?" will be tapped
          const highlightPulse = i === 1 ? interpolate(
            frame,
            [100, 110, 120, 130],
            [1, 1.06, 1, 1.03],
            { extrapolateRight: "clamp" }
          ) : 1;

          return (
            <div
              key={i}
              style={{
                transform: `scale(${s * highlightPulse})`,
                background: opt.color,
                borderRadius: 16,
                padding: "16px 12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                boxShadow: isHighlighted && frame > 100
                  ? "0 0 20px rgba(139,184,232,0.6)"
                  : "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <span style={{ fontSize: 28 }}>{opt.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#2d4a6f", textAlign: "center" }}>
                {opt.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Night waking button */}
      <div style={{ padding: "0 16px", marginTop: 4 }}>
        <div
          style={{
            background: "#b8d4f0",
            borderRadius: 16,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transform: `scale(${spring({ frame: frame - 50, fps, config: { damping: 14 } })})`,
          }}
        >
          <span style={{ fontSize: 22 }}>⏰</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#2d4a6f" }}>Woke up at night</span>
        </div>
      </div>

      {/* Finger tap animation on "Could it be sleep?" */}
      {frame > 110 && (
        <div
          style={{
            position: "absolute",
            left: 220,
            top: 310,
            fontSize: 32,
            transform: `scale(${interpolate(frame, [110, 120, 135, 140], [0, 1, 1, 0.8], { extrapolateRight: "clamp" })})`,
            opacity: interpolate(frame, [110, 115, 135, 145], [0, 1, 1, 0], { extrapolateRight: "clamp" }),
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        >
          👆
        </div>
      )}
    </AbsoluteFill>
  );
};
