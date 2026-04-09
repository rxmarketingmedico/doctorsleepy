import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

// Chat with Dr. Sleepy
export const Scene3Chat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const aiMessage1 = "Hi! I see you're having trouble with your baby's sleep. Let me help! 💤\n\nHere are some quick tips:\n\n✅ Dim the lights 30 min before bed\n✅ White noise can help\n✅ Keep the room at 68-72°F";
  
  const userMessage = "She keeps waking up every 2 hours 😩";
  
  const aiMessage2 = "That's very common at this age! Here's a personalized plan:\n\n1️⃣ Create a wind-down routine\n2️⃣ Try the 'pause' method - wait 2 min before responding\n3️⃣ Consistent bedtime at 7:30 PM";

  // Calculate visible characters for typing effect
  const ai1Chars = Math.floor(interpolate(frame, [20, 120], [0, aiMessage1.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const userAppear = spring({ frame: frame - 140, fps, config: { damping: 15 } });
  const ai2Chars = Math.floor(interpolate(frame, [170, 270], [0, aiMessage2.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ background: "#f0f4f8", paddingTop: 44 }}>
      {/* Chat header */}
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
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            background: "linear-gradient(135deg, #8bb8e8, #a5d4a5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🧸
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#2d4a6f" }}>Dr. Sleepy</div>
          <div style={{ fontSize: 10, color: "#66bb6a" }}>● Online</div>
        </div>
      </div>

      {/* Messages container */}
      <div style={{ padding: "12px 12px", display: "flex", flexDirection: "column", gap: 10, overflowY: "hidden", flex: 1 }}>
        {/* Context chip */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <div
            style={{
              background: "#e3ecf5",
              borderRadius: 12,
              padding: "4px 12px",
              fontSize: 10,
              color: "#5a7a9a",
              opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            🌙 Sleep assistance
          </div>
        </div>

        {/* AI message 1 */}
        {ai1Chars > 0 && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: "linear-gradient(135deg, #8bb8e8, #a5d4a5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              🧸
            </div>
            <div
              style={{
                background: "white",
                borderRadius: "4px 16px 16px 16px",
                padding: "10px 14px",
                fontSize: 11,
                lineHeight: 1.5,
                color: "#2d4a6f",
                maxWidth: "80%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                whiteSpace: "pre-wrap",
              }}
            >
              {aiMessage1.slice(0, ai1Chars)}
              {ai1Chars < aiMessage1.length && (
                <span style={{ opacity: interpolate(frame % 20, [0, 10, 20], [1, 0.3, 1]) }}>▋</span>
              )}
            </div>
          </div>
        )}

        {/* User message */}
        {userAppear > 0.1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              transform: `translateY(${interpolate(userAppear, [0, 1], [20, 0])}px)`,
              opacity: userAppear,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #8bb8e8, #7aaad8)",
                borderRadius: "16px 4px 16px 16px",
                padding: "10px 14px",
                fontSize: 11,
                color: "white",
                maxWidth: "75%",
                boxShadow: "0 2px 6px rgba(139,184,232,0.3)",
              }}
            >
              {userMessage}
            </div>
          </div>
        )}

        {/* AI message 2 */}
        {ai2Chars > 0 && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: "linear-gradient(135deg, #8bb8e8, #a5d4a5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              🧸
            </div>
            <div
              style={{
                background: "white",
                borderRadius: "4px 16px 16px 16px",
                padding: "10px 14px",
                fontSize: 11,
                lineHeight: 1.5,
                color: "#2d4a6f",
                maxWidth: "80%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                whiteSpace: "pre-wrap",
              }}
            >
              {aiMessage2.slice(0, ai2Chars)}
              {ai2Chars < aiMessage2.length && (
                <span style={{ opacity: interpolate(frame % 20, [0, 10, 20], [1, 0.3, 1]) }}>▋</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "10px 12px",
          background: "white",
          borderTop: "1px solid #e0e6ed",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            flex: 1,
            background: "#f0f4f8",
            borderRadius: 20,
            padding: "8px 14px",
            fontSize: 11,
            color: "#aab8c8",
          }}
        >
          Type your message...
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            background: "linear-gradient(135deg, #8bb8e8, #7aaad8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          ➤
        </div>
      </div>
    </AbsoluteFill>
  );
};
