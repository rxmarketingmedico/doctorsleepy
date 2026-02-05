import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmergencyButtonProps {
  icon: LucideIcon;
  label: string;
  variant: "hunger" | "sleep" | "discomfort" | "cry" | "night";
  onClick: () => void;
}

const variantStyles = {
  hunger: "bg-hunger text-hunger-foreground hover:bg-hunger/90",
  sleep: "bg-sleep text-sleep-foreground hover:bg-sleep/90",
  discomfort: "bg-discomfort text-discomfort-foreground hover:bg-discomfort/90",
  cry: "bg-cry text-cry-foreground hover:bg-cry/90",
  night: "bg-night text-night-foreground hover:bg-night/90",
};

export function EmergencyButton({ icon: Icon, label, variant, onClick }: EmergencyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "btn-emergency w-full",
        variantStyles[variant]
      )}
    >
      <Icon className="w-8 h-8" />
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}
