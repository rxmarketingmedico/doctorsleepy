import { cn } from "@/lib/utils";

interface AvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  state?: "idle" | "thinking" | "speaking" | "listening";
}

const sizeMap = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-28 h-28",
  xl: "w-40 h-40",
};

// Professional 3D-style doctor avatar with state-based animations
const DoctorAvatar = ({ state }: { state: string }) => {
  const isThinking = state === "thinking";
  const isSpeaking = state === "speaking";
  const isListening = state === "listening";

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
      <defs>
        {/* Gradients for 3D effect */}
        <radialGradient id="skinGradient" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FFE8D6" />
          <stop offset="50%" stopColor="#FFDAB9" />
          <stop offset="100%" stopColor="#E8C4A8" />
        </radialGradient>
        
        <radialGradient id="coatGradient" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F5F5F5" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </radialGradient>
        
        <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="50%" stopColor="#4E342E" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>
        
        <radialGradient id="stethGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#64B5F6" />
          <stop offset="100%" stopColor="#1976D2" />
        </radialGradient>

        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.15"/>
        </filter>

        <filter id="innerGlow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* Coat/Body with 3D shading */}
      <g filter="url(#softShadow)">
        <ellipse cx="100" cy="180" rx="55" ry="30" fill="url(#coatGradient)" />
        <rect x="55" y="145" width="90" height="40" rx="15" fill="url(#coatGradient)" />
        {/* Coat collar */}
        <path d="M70 145 L100 165 L130 145" fill="none" stroke="#E0E0E0" strokeWidth="3"/>
      </g>

      {/* Head with 3D gradient */}
      <g filter="url(#softShadow)">
        <ellipse 
          cx="100" 
          cy="85" 
          rx="52" 
          ry="55" 
          fill="url(#skinGradient)"
          className={cn(
            "transition-transform duration-300 origin-center",
            isThinking && "animate-[tilt_2s_ease-in-out_infinite]"
          )}
        />
      </g>

      {/* Hair with volume */}
      <g>
        <ellipse cx="100" cy="45" rx="45" ry="28" fill="url(#hairGradient)" />
        <ellipse cx="65" cy="55" rx="18" ry="22" fill="url(#hairGradient)" />
        <ellipse cx="135" cy="55" rx="18" ry="22" fill="url(#hairGradient)" />
        {/* Hair highlights */}
        <ellipse cx="85" cy="40" rx="15" ry="8" fill="#6D4C41" opacity="0.3" />
      </g>

      {/* Ears */}
      <ellipse cx="48" cy="85" rx="8" ry="12" fill="#FFDAB9" />
      <ellipse cx="152" cy="85" rx="8" ry="12" fill="#FFDAB9" />

      {/* Eyes with expressions */}
      <g className={cn(
        "transition-all duration-200",
        isListening && "translate-y-[-2px]"
      )}>
        {isThinking ? (
          // Thinking - looking up
          <>
            <ellipse cx="78" cy="78" rx="10" ry="5" fill="#3E2723" />
            <ellipse cx="122" cy="78" rx="10" ry="5" fill="#3E2723" />
          </>
        ) : (
          // Normal eyes with 3D depth
          <>
            {/* Eye whites */}
            <ellipse cx="78" cy="82" rx="14" ry="12" fill="white" />
            <ellipse cx="122" cy="82" rx="14" ry="12" fill="white" />
            
            {/* Irises */}
            <circle 
              cx={isListening ? 80 : 78} 
              cy={isListening ? 80 : 82} 
              r="8" 
              fill="#5D4037"
            >
              {isSpeaking && (
                <animate attributeName="cy" values="82;80;82" dur="0.3s" repeatCount="indefinite" />
              )}
            </circle>
            <circle 
              cx={isListening ? 124 : 122} 
              cy={isListening ? 80 : 82} 
              r="8" 
              fill="#5D4037"
            >
              {isSpeaking && (
                <animate attributeName="cy" values="82;80;82" dur="0.3s" repeatCount="indefinite" />
              )}
            </circle>
            
            {/* Pupils */}
            <circle cx="79" cy="81" r="4" fill="#1A1A1A" />
            <circle cx="123" cy="81" r="4" fill="#1A1A1A" />
            
            {/* Eye highlights */}
            <circle cx="82" cy="78" r="3" fill="white" />
            <circle cx="126" cy="78" r="3" fill="white" />
            <circle cx="76" cy="84" r="1.5" fill="white" opacity="0.6" />
            <circle cx="120" cy="84" r="1.5" fill="white" opacity="0.6" />
          </>
        )}
      </g>

      {/* Eyebrows with expressions */}
      <g className="transition-transform duration-200">
        <path 
          d={isThinking 
            ? "M62 65 Q78 58 94 65" 
            : isSpeaking 
              ? "M62 68 Q78 62 94 68"
              : "M62 70 Q78 68 94 70"
          } 
          stroke="url(#hairGradient)" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round"
        />
        <path 
          d={isThinking 
            ? "M106 65 Q122 58 138 65" 
            : isSpeaking 
              ? "M106 68 Q122 62 138 68"
              : "M106 70 Q122 68 138 70"
          } 
          stroke="url(#hairGradient)" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round"
        />
      </g>

      {/* Nose */}
      <ellipse cx="100" cy="98" rx="6" ry="4" fill="#E8C4A8" />

      {/* Cheeks with blush */}
      <ellipse cx="60" cy="98" rx="12" ry="8" fill="#FFCDD2" opacity="0.6" />
      <ellipse cx="140" cy="98" rx="12" ry="8" fill="#FFCDD2" opacity="0.6" />

      {/* Mouth with states */}
      {isSpeaking ? (
        <g>
          <ellipse cx="100" cy="115" rx="14" ry="10" fill="#C62828">
            <animate attributeName="ry" values="10;8;12;8;10" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="100" cy="112" rx="10" ry="5" fill="#EF5350" />
          {/* Teeth hint */}
          <rect x="92" y="110" width="16" height="4" rx="1" fill="white" opacity="0.8" />
        </g>
      ) : isThinking ? (
        <g>
          <circle cx="108" cy="115" r="6" fill="#E57373" />
          <circle cx="108" cy="115" r="3" fill="#C62828" />
        </g>
      ) : isListening ? (
        <ellipse cx="100" cy="115" rx="8" ry="6" fill="#E57373" />
      ) : (
        <path 
          d="M85 112 Q100 128 115 112" 
          stroke="#C62828" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round"
        />
      )}

      {/* Stethoscope with 3D effect */}
      <g filter="url(#softShadow)">
        <circle cx="100" cy="160" r="14" fill="url(#stethGradient)" />
        <circle cx="100" cy="160" r="9" fill="#1565C0" />
        <circle cx="97" cy="157" r="3" fill="#90CAF9" opacity="0.6" />
        <path 
          d="M86 160 Q86 145 100 145 Q114 145 114 160" 
          stroke="#42A5F5" 
          strokeWidth="5" 
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Ambient animation for idle state */}
      {state === "idle" && (
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-2; 0,0"
            dur="3s"
            repeatCount="indefinite"
          />
        </g>
      )}

      <style>
        {`
          @keyframes tilt {
            0%, 100% { transform: rotate(0deg) translateX(0); }
            25% { transform: rotate(-3deg) translateX(-2px); }
            75% { transform: rotate(3deg) translateX(2px); }
          }
        `}
      </style>
    </svg>
  );
};

export function Avatar({ size = "md", className, state = "idle" }: AvatarProps) {
  return (
    <div 
      className={cn(
        "avatar-container rounded-full overflow-hidden",
        "bg-gradient-to-br from-sky-50 via-white to-blue-50",
        "dark:from-slate-800 dark:via-slate-900 dark:to-slate-800",
        "shadow-xl ring-2 ring-white/50 dark:ring-white/10",
        sizeMap[size],
        state === "thinking" && "animate-pulse",
        state === "speaking" && "ring-4 ring-primary/50 shadow-primary/20 shadow-2xl",
        state === "listening" && "ring-4 ring-emerald-400/50 shadow-emerald-400/20 shadow-xl",
        "transition-all duration-300",
        className
      )}
    >
      <div className={cn(
        "w-full h-full flex items-center justify-center p-1",
        "transition-transform duration-300",
        state === "speaking" && "scale-105",
      )}>
        <DoctorAvatar state={state} />
      </div>
    </div>
  );
}
