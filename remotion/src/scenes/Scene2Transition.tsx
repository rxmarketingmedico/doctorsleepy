import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

// Transition from Home to Chat - ripple effect from button
export const Scene2Transition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rippleScale = interpolate(frame, [0, 30], [0, 15], { extrapolateRight: "clamp" });
  const rippleOpacity = interpolate(frame, [0, 10, 25, 30], [1, 0.8, 0.3, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#f0f4f8" }}>
      {/* Ripple from tap */}
      <div
        style={{
          position: "absolute",
          left: "60%",
          top: "42%",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(139,184,232,0.5)",
          transform: `translate(-50%, -50%) scale(${rippleScale})`,
          opacity: rippleOpacity,
        }}
      />
      {/* Loading text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 16,
          color: "#2d4a6f",
          fontWeight: 600,
          opacity: interpolate(frame, [10, 20, 25, 30], [0, 1, 1, 0], { extrapolateRight: "clamp" }),
        }}
      >
        💬 Opening chat...
      </div>
    </AbsoluteFill>
  );
};
