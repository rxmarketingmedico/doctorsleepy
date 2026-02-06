import { cn } from "@/lib/utils";
import doctorAvatar from "@/assets/doctor-avatar.png";

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
        "w-full h-full flex items-center justify-center",
        "transition-transform duration-300",
        state === "speaking" && "scale-105",
      )}>
        <img 
          src={doctorAvatar} 
          alt="Doutor Soneca"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
