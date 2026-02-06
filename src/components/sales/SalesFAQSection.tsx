import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "O Doutor Soneca substitui o pediatra?",
    a: "Não. O Doutor Soneca é um assistente educacional que oferece orientações baseadas em evidências sobre sono infantil. Ele não faz diagnósticos e não substitui acompanhamento médico.",
  },
  {
    q: "A partir de qual idade posso usar?",
    a: "O app é pensado para pais de bebês de 0 a 3 anos. As orientações se adaptam à idade do seu bebê.",
  },
  {
    q: "Como funciona o Tradutor de Choro?",
    a: "Você grava o choro do bebê e a inteligência artificial analisa padrões sonoros para sugerir possíveis causas: fome, sono, desconforto ou dor. É uma ferramenta de apoio, não um diagnóstico.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. Sem burocracia, sem multa. Você cancela direto pela Hotmart a qualquer momento.",
  },
  {
    q: "O pagamento é seguro?",
    a: "Sim. O pagamento é processado pela Hotmart, a maior plataforma de produtos digitais da América Latina, com criptografia de ponta.",
  },
  {
    q: "Como acesso o app depois de pagar?",
    a: "Após o pagamento, você cria sua conta com o mesmo e-mail usado na compra. O acesso é liberado automaticamente.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm md:text-base pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed animate-fade-in">
          {a}
        </div>
      )}
    </div>
  );
}

export default function SalesFAQSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
          Perguntas frequentes
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
