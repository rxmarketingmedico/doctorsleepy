import { cn } from "@/lib/utils";
import { useAvatarImage } from "@/hooks/useAvatarImage";
import { Loader2 } from "lucide-react";

interface AvatarAIProps {
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

// Fallback SVG avatar for when image is loading or fails
const FallbackAvatar = ({ state }: { state: string }) => {
  const isThinking = state === "thinking";
  const isSpeaking = state === "speaking";
  const isListening = state === "listening";

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
      <defs>
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
      </defs>

      {/* Body */}
      <g filter="url(#softShadow)">
        <ellipse cx="100" cy="180" rx="55" ry="30" fill="url(#coatGradient)" />
        <rect x="55" y="145" width="90" height="40" rx="15" fill="url(#coatGradient)" />
      </g>

      {/* Head */}
      <g filter="url(#softShadow)">
        <ellipse cx="100" cy="85" rx="52" ry="55" fill="url(#skinGradient)" />
      </g>

      {/* Hair */}
      <g>
        <ellipse cx="100" cy="45" rx="45" ry="28" fill="url(#hairGradient)" />
        <ellipse cx="65" cy="55" rx="18" ry="22" fill="url(#hairGradient)" />
        <ellipse cx="135" cy="55" rx="18" ry="22" fill="url(#hairGradient)" />
      </g>

      {/* Ears */}
      <ellipse cx="48" cy="85" rx="8" ry="12" fill="#FFDAB9" />
      <ellipse cx="152" cy="85" rx="8" ry="12" fill="#FFDAB9" />

      {/* Eyes */}
      {isThinking ? (
        <>
          <ellipse cx="78" cy="78" rx="10" ry="5" fill="#3E2723" />
          <ellipse cx="122" cy="78" rx="10" ry="5" fill="#3E2723" />
        </>
      ) : (
        <>
          <ellipse cx="78" cy="82" rx="14" ry="12" fill="white" />
          <ellipse cx="122" cy="82" rx="14" ry="12" fill="white" />
          <circle cx={isListening ? 80 : 78} cy={isListening ? 80 : 82} r="8" fill="#5D4037" />
          <circle cx={isListening ? 124 : 122} cy={isListening ? 80 : 82} r="8" fill="#5D4037" />
          <circle cx="79" cy="81" r="4" fill="#1A1A1A" />
          <circle cx="123" cy="81" r="4" fill="#1A1A1A" />
          <circle cx="82" cy="78" r="3" fill="white" />
          <circle cx="126" cy="78" r="3" fill="white" />
        </>
      )}

      {/* Eyebrows */}
      <path 
        d={isThinking ? "M62 65 Q78 58 94 65" : isSpeaking ? "M62 68 Q78 62 94 68" : "M62 70 Q78 68 94 70"} 
        stroke="url(#hairGradient)" strokeWidth="4" fill="none" strokeLinecap="round"
      />
      <path 
        d={isThinking ? "M106 65 Q122 58 138 65" : isSpeaking ? "M106 68 Q122 62 138 68" : "M106 70 Q122 68 138 70"} 
        stroke="url(#hairGradient)" strokeWidth="4" fill="none" strokeLinecap="round"
      />

      {/* Nose */}
      <ellipse cx="100" cy="98" rx="6" ry="4" fill="#E8C4A8" />

      {/* Cheeks */}
      <ellipse cx="60" cy="98" rx="12" ry="8" fill="#FFCDD2" opacity="0.6" />
      <ellipse cx="140" cy="98" rx="12" ry="8" fill="#FFCDD2" opacity="0.6" />

      {/* Mouth */}
      {isSpeaking ? (
        <ellipse cx="100" cy="115" rx="14" ry="10" fill="#C62828">
          <animate attributeName="ry" values="10;8;12;8;10" dur="0.4s" repeatCount="indefinite" />
        </ellipse>
      ) : isThinking ? (
        <circle cx="108" cy="115" r="6" fill="#E57373" />
      ) : isListening ? (
        <ellipse cx="100" cy="115" rx="8" ry="6" fill="#E57373" />
      ) : (
        <path d="M85 112 Q100 128 115 112" stroke="#C62828" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}

      {/* Stethoscope */}
      <g filter="url(#softShadow)">
        <circle cx="100" cy="160" r="14" fill="url(#stethGradient)" />
        <circle cx="100" cy="160" r="9" fill="#1565C0" />
        <path d="M86 160 Q86 145 100 145 Q114 145 114 160" stroke="#42A5F5" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export function AvatarAI({ size = "md", className, state = "idle" }: AvatarAIProps) {
  const { imageUrl, isLoading, error } = useAvatarImage(state);

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
        "w-full h-full flex items-center justify-center",
        "transition-transform duration-300",
        state === "speaking" && "scale-105",
      )}>
        {isLoading && !imageUrl ? (
          <div className="flex items-center justify-center w-full h-full bg-muted/50">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : imageUrl && !error ? (
          <img 
            src={imageUrl} 
            alt={`Doctor avatar - ${state}`}
            className="w-full h-full object-cover"
            onError={() => console.log('Image failed to load, using fallback')}
          />
        ) : (
          <div className="w-full h-full p-1">
            <FallbackAvatar state={state} />
          </div>
        )}
      </div>
    </div>
  );
}
