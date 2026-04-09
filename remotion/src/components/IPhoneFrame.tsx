import React from "react";

export const IPhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const phoneW = 360;
  const phoneH = 780;
  const bezelRadius = 50;

  return (
    <div
      style={{
        width: phoneW,
        height: phoneH,
        borderRadius: bezelRadius,
        background: "linear-gradient(145deg, #1a1a1a, #2d2d2d)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 2px #444, inset 0 0 0 2px #555",
        padding: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Screen */}
      <div
        style={{
          width: phoneW - 16,
          height: phoneH - 16,
          borderRadius: bezelRadius - 6,
          overflow: "hidden",
          background: "#f0f4f8",
          position: "relative",
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 150,
            height: 30,
            background: "#1a1a1a",
            borderRadius: "0 0 20px 20px",
            zIndex: 100,
          }}
        />
        {/* Status bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 44,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
            fontSize: 12,
            fontWeight: 600,
            color: "#333",
            zIndex: 99,
          }}
        >
          <span>9:41</span>
          <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span>📶</span>
            <span>🔋</span>
          </span>
        </div>
        {/* Content */}
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {children}
        </div>
      </div>
    </div>
  );
};
