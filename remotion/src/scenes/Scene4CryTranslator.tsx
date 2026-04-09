import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

export const Scene4CryTranslator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Recording (0-120)
  // Phase 2: Analyzing (120-160)
  // Phase 3: Results (160+)
  const phase = frame < 120 ? "recording" : frame < 160 ? "analyzing" : "results";

  const pulseScale = phase === "recording"
    ? 1 + 0.15 * Math.sin(frame * 0.15)
    : 1;

  const waveAmplitudes = Array.from({ length: 20 }, (_, i) =>
    phase === "recording"
      ? 8 + 15 * Math.sin(frame * 0.2 + i * 0.5) * Math.cos(frame * 0.1 + i)
      : interpolate(frame, [120, 140], [8, 2], { extrapolateRight: "clamp" })
  );

  const results = [
    { label: "Hunger", percent: 72, color: "#f5c77e", icon: "🍼" },
    { label: "Tiredness", percent: 18, color: "#8bb8e8", icon: "😴" },
    { label: "Discomfort", percent: 10, color: "#e88b8b", icon: "🌡️" },
  ];

  return (
    <AbsoluteFill style={{ background: "#f0f4f8", paddingTop: 44 }}>
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e0e6ed",
          background: "rgba(240,244,248,0.95)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ fontSize: 14, color: "#8899aa" }}>←</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#2d4a6f" }}>
          🎤 Cry Translator
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 30, padding: "0 20px" }}>
        {/* Record button */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            background: phase === "recording"
              ? "linear-gradient(135deg, #e88b8b, #d46b6b)"
              : phase === "analyzing"
                ? "linear-gradient(135deg, #f5c77e, #e5b76e)"
                : "linear-gradient(135deg, #a5d4a5, #85c485)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            transform: `scale(${pulseScale})`,
            boxShadow: phase === "recording"
              ? `0 0 ${20 + 10 * Math.sin(frame * 0.2)}px rgba(232,139,139,0.5)`
              : "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          {phase === "recording" ? "🎤" : phase === "analyzing" ? "🔄" : "✅"}
        </div>

        <div
          style={{
            marginTop: 16,
            fontSize: 14,
            fontWeight: 600,
            color: "#2d4a6f",
          }}
        >
          {phase === "recording" ? "Listening..." : phase === "analyzing" ? "Analyzing cry pattern..." : "Analysis Complete!"}
        </div>

        {/* Sound wave visualization */}
        {(phase === "recording" || phase === "analyzing") && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              marginTop: 20,
              height: 50,
            }}
          >
            {waveAmplitudes.map((amp, i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: Math.abs(amp),
                  borderRadius: 2,
                  background: phase === "recording"
                    ? `rgba(232,139,139,${0.4 + 0.6 * Math.abs(Math.sin(i * 0.3))})`
                    : "#f5c77e",
                }}
              />
            ))}
          </div>
        )}

        {/* Results */}
        {phase === "results" && (
          <div style={{ width: "100%", marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            {results.map((r, i) => {
              const s = spring({ frame: frame - 165 - i * 8, fps, config: { damping: 15 } });
              const barWidth = interpolate(s, [0, 1], [0, r.percent]);

              return (
                <div
                  key={i}
                  style={{
                    opacity: s,
                    transform: `translateX(${interpolate(s, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#2d4a6f" }}>
                      {r.icon} {r.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#2d4a6f" }}>
                      {Math.round(barWidth)}%
                    </span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: "#e8eef5", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: "100%",
                        borderRadius: 5,
                        background: r.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Recommendation */}
            <div
              style={{
                marginTop: 12,
                background: "white",
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                opacity: spring({ frame: frame - 200, fps, config: { damping: 20 } }),
                transform: `translateY(${interpolate(spring({ frame: frame - 200, fps, config: { damping: 20 } }), [0, 1], [20, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#2d4a6f", marginBottom: 6 }}>
                💡 Recommendation
              </div>
              <div style={{ fontSize: 10, color: "#5a7a9a", lineHeight: 1.5 }}>
                Your baby is most likely hungry. Try feeding now — breast or bottle for 15-20 minutes.
              </div>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
