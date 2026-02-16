import { useMemo } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialSuggestions: Record<string, string[]> = {
  hunger: ["Fed less than 1 hour ago", "Fed 2-3 hours ago", "Fed more than 3 hours ago"],
  sleep: ["Awake less than 1 hour", "Awake 1-2 hours", "Awake more than 2 hours"],
  discomfort: ["Clean diaper", "Comfortable clothes", "Pleasant environment"],
  inconsolable: ["Yes, baby is fed", "Yes, clean diaper", "I need urgent help"],
  "night-waking": ["Slept at 7 PM", "Slept at 8-9 PM", "Slept after 10 PM"],
  general: ["How to create a sleep routine?", "How many hours should my baby sleep?", "Tips to calm the baby"],
};

const topicSuggestions: { keywords: RegExp; replies: string[] }[] = [
  {
    keywords: /sleep|nap|wake|night|bedtime/i,
    replies: ["What's the best bedtime?", "Baby wakes up many times at night", "How to get baby to sleep alone?", "How long should naps be?"],
  },
  {
    keywords: /feed|breast|hunger|eat|milk|formula/i,
    replies: ["How much milk per feeding?", "When to introduce solid foods?", "Baby spits up a lot, is that normal?", "How many feedings per day?"],
  },
  {
    keywords: /cry|crying|inconsolable|fussy|colic/i,
    replies: ["How to tell if it's colic?", "Techniques to calm the baby", "How much crying is normal?", "Should I be worried about this crying?"],
  },
  {
    keywords: /diaper|poop|pee|change|rash/i,
    replies: ["How many changes per day is normal?", "How to treat diaper rash?", "Is the poop color normal?", "When should I worry?"],
  },
  {
    keywords: /routine|schedule|organize/i,
    replies: ["Create a routine for my baby", "How to adjust nap schedule?", "What's the ideal wake window?", "How to handle routine changes?"],
  },
  {
    keywords: /fever|sick|cold|cough|doctor|emergency/i,
    replies: ["When should I go to the doctor?", "How to take temperature correctly?", "What to do while waiting for the appointment?", "Is this an emergency?"],
  },
  {
    keywords: /development|growth|weight|height|milestone|crawl|walk|talk/i,
    replies: ["Is baby developing well?", "When should baby crawl?", "Development milestones for this age", "How to stimulate development?"],
  },
  {
    keywords: /bath|hygiene|clean|navel|nail/i,
    replies: ["What's the ideal bath temperature?", "How many baths per day?", "How to care for the umbilical cord?", "When can I cut the nails?"],
  },
  {
    keywords: /question|ask|help|anything else/i,
    replies: ["Yes, I have another question", "How to improve sleep routine?", "Tips for daily care", "Thank you, that's all! 😊"],
  },
];

export function useDynamicSuggestions(messages: Message[], context: string): string[] {
  return useMemo(() => {
    if (messages.length <= 1) {
      return initialSuggestions[context] || initialSuggestions.general;
    }

    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return [];

    const content = lastAssistant.content;

    for (const topic of topicSuggestions) {
      if (topic.keywords.test(content)) {
        const start = content.length % 2;
        return topic.replies.slice(start, start + 3);
      }
    }

    return ["I have another question", "Can you explain more?", "Thank you! 😊"];
  }, [messages, context]);
}
