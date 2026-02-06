import { Button } from "@/components/ui/button";

interface QuickRepliesProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function QuickReplies({ suggestions, onSelect, disabled }: QuickRepliesProps) {
  if (!suggestions.length) return null;

  return (
    <div className="px-4 pb-2">
      <div className="max-w-lg mx-auto flex flex-wrap gap-2">
        {suggestions.map((reply) => (
          <Button
            key={reply}
            variant="outline"
            size="sm"
            onClick={() => onSelect(reply)}
            disabled={disabled}
            className="rounded-full text-xs"
          >
            {reply}
          </Button>
        ))}
      </div>
    </div>
  );
}
