import { useMemo } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialSuggestions: Record<string, string[]> = {
  hunger: ["Mamou há menos de 1 hora", "Mamou há 2-3 horas", "Mamou há mais de 3 horas"],
  sleep: ["Acordado há menos de 1 hora", "Acordado há 1-2 horas", "Acordado há mais de 2 horas"],
  discomfort: ["Fralda limpa", "Roupas confortáveis", "Ambiente agradável"],
  inconsolable: ["Sim, está alimentado", "Sim, fralda limpa", "Preciso de ajuda urgente"],
  "night-waking": ["Dormiu às 19h", "Dormiu às 20h-21h", "Dormiu depois das 22h"],
  general: ["Como criar uma rotina de sono?", "Quantas horas meu bebê deve dormir?", "Dicas para acalmar o bebê"],
};

const topicSuggestions: { keywords: RegExp; replies: string[] }[] = [
  {
    keywords: /sono|dormir|acordar|madrugada|noite|soneca/i,
    replies: [
      "Qual o melhor horário para ele dormir?",
      "Ele acorda muitas vezes à noite",
      "Como fazer ele dormir sozinho?",
      "Quanto tempo de soneca é ideal?",
    ],
  },
  {
    keywords: /mamad|amament|fome|alimenta|comer|leite|fórmula/i,
    replies: [
      "Quanto leite ele deve tomar por mamada?",
      "Quando introduzir alimentos sólidos?",
      "Ele regurgita muito, é normal?",
      "Quantas mamadas por dia são ideais?",
    ],
  },
  {
    keywords: /choro|chorar|inconsolável|irritado|inquieto|cólica/i,
    replies: [
      "Como saber se é cólica?",
      "Técnicas para acalmar o bebê",
      "Quanto tempo de choro é normal?",
      "Devo me preocupar com esse choro?",
    ],
  },
  {
    keywords: /fralda|cocô|xixi|troca|assadura/i,
    replies: [
      "Quantas trocas por dia são normais?",
      "Como tratar assadura?",
      "A cor do cocô está normal?",
      "Quando devo me preocupar?",
    ],
  },
  {
    keywords: /rotina|horário|agenda|organiz/i,
    replies: [
      "Monte uma rotina para meu bebê",
      "Como ajustar a rotina de sonecas?",
      "Qual a janela de sono ideal?",
      "Como lidar com mudanças na rotina?",
    ],
  },
  {
    keywords: /febre|doente|gripe|tosse|resfriado|médico|emergência/i,
    replies: [
      "Quando devo levar ao médico?",
      "Como medir a temperatura corretamente?",
      "O que fazer enquanto espero a consulta?",
      "Isso é motivo de emergência?",
    ],
  },
  {
    keywords: /desenvolvimento|crescimento|peso|altura|marco|engatinhar|andar|falar/i,
    replies: [
      "Ele está se desenvolvendo bem?",
      "Quando ele deveria engatinhar?",
      "Marcos de desenvolvimento para a idade",
      "Como estimular o desenvolvimento?",
    ],
  },
  {
    keywords: /banho|higiene|limpeza|umbigo|unha/i,
    replies: [
      "Qual a temperatura ideal do banho?",
      "Quantos banhos por dia?",
      "Como cuidar do umbigo?",
      "Quando posso cortar as unhas?",
    ],
  },
  {
    keywords: /dúvida|pergunt|ajud|mais alguma/i,
    replies: [
      "Sim, tenho outra dúvida",
      "Como melhorar a rotina de sono?",
      "Dicas para o dia a dia",
      "Obrigado, era só isso! 😊",
    ],
  },
];

export function useDynamicSuggestions(messages: Message[], context: string): string[] {
  return useMemo(() => {
    // Show initial context-based suggestions for first message
    if (messages.length <= 1) {
      return initialSuggestions[context] || initialSuggestions.general;
    }

    // Get last assistant message
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return [];

    const content = lastAssistant.content;

    // Find matching topic and return its suggestions
    for (const topic of topicSuggestions) {
      if (topic.keywords.test(content)) {
        // Return 3 suggestions, shuffled a bit based on content length for variety
        const start = content.length % 2;
        return topic.replies.slice(start, start + 3);
      }
    }

    // Fallback general suggestions
    return [
      "Tenho outra dúvida",
      "Pode explicar melhor?",
      "Obrigado! 😊",
    ];
  }, [messages, context]);
}
