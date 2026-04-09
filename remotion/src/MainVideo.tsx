import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { IPhoneFrame } from "./components/IPhoneFrame";
import { Scene1Home } from "./scenes/Scene1Home";
import { Scene2Transition } from "./scenes/Scene2Transition";
import { Scene3Chat } from "./scenes/Scene3Chat";
import { Scene4CryTranslator } from "./scenes/Scene4CryTranslator";
import { Scene5Closing } from "./scenes/Scene5Closing";

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Phone entrance animation
  const phoneScale = spring({ frame: frame - 5, fps, config: { damping: 15, stiffness: 80 } });
  const phoneY = interpolate(phoneScale, [0, 1], [100, 0]);

  // Background gradient shift
  const bgHue = interpolate(frame, [0, 1200], [220, 260], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, 
          hsl(${bgHue}, 30%, 15%) 0%, 
          hsl(${bgHue + 20}, 25%, 22%) 50%,
          hsl(${bgHue + 40}, 20%, 18%) 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Subtle floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 4 + i * 2,
            height: 4 + i * 2,
            borderRadius: "50%",
            background: `rgba(139,184,232,${0.05 + i * 0.02})`,
            left: 200 + i * 250 + Math.sin(frame * 0.02 + i) * 50,
            top: 150 + i * 120 + Math.cos(frame * 0.015 + i * 2) * 40,
          }}
        />
      ))}

      {/* Phone container */}
      <div
        style={{
          transform: `translateY(${phoneY}px) scale(${phoneScale})`,
          filter: `drop-shadow(0 40px 80px rgba(0,0,0,0.4))`,
        }}
      >
        <IPhoneFrame>
          <TransitionSeries>
            {/* Scene 1: Home (0-5s = 150 frames) */}
            <TransitionSeries.Sequence durationInFrames={150}>
              <Scene1Home />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={fade()}
              timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
            />

            {/* Scene 2: Transition (brief, 30 frames) */}
            <TransitionSeries.Sequence durationInFrames={30}>
              <Scene2Transition />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={slide({ direction: "from-right" })}
              timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
            />

            {/* Scene 3: Chat (12-22s = 300 frames) */}
            <TransitionSeries.Sequence durationInFrames={300}>
              <Scene3Chat />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={slide({ direction: "from-right" })}
              timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
            />

            {/* Scene 4: Cry Translator (22-35s = 390 frames) */}
            <TransitionSeries.Sequence durationInFrames={270}>
              <Scene4CryTranslator />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={fade()}
              timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
            />

            {/* Scene 5: Closing (35-40s = 150 frames) */}
            <TransitionSeries.Sequence durationInFrames={150}>
              <Scene5Closing />
            </TransitionSeries.Sequence>
          </TransitionSeries>
        </IPhoneFrame>
      </div>

      {/* App name label below phone */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.4)",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Dr. Sleepy — AI Sleep Assistant
      </div>
    </AbsoluteFill>
  );
};
