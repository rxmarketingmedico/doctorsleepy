

## Plano: Mockup Animado Interativo na Hero (sem vídeo)

Substituir o `<video>` atual na hero por um **componente React animado** — um mockup de celular que cicla automaticamente pelas funcionalidades principais do app, com textos explicativos ao lado e CTA no final.

### Conceito

Um mockup de iPhone (mesmo estilo dos que já existem na página — `ChatPhoneMockup`, `SalesEmergencySection`, `SalesCryTranslatorSection`) que **troca de tela automaticamente** em loop, simulando alguém usando o app. Ao lado (ou abaixo em mobile), textos curtos explicam o que está acontecendo.

### Fluxo da animação (4 telas, ~20s loop)

1. **Home Screen** (4s) — Tela inicial do app com Emergency Mode visível, botões de navegação. Texto: "24/7 AI guidance at your fingertips"
2. **Chat com Dr. Sleepy** (6s) — Mensagens aparecendo com efeito de digitação (reusa padrão do `ChatPhoneMockup`). Texto: "Ask anything — get expert answers instantly"
3. **Cry Translator** (6s) — Botão de gravação pulsando → resultado com barras de análise. Texto: "Decode your baby's cry in seconds"
4. **CTA Final** (4s) — Tela com logo, "Your baby sleeps tonight." + "Starting at $1.65/mo — Try free for 7 days" + botão "Start now" estilizado

Depois do CTA, volta para a tela 1 em loop infinito.

### Layout

- **Desktop**: Mockup à esquerda, texto explicativo + indicadores de progresso à direita
- **Mobile**: Mockup centralizado, texto abaixo

### O que muda

- **Criar**: `src/components/sales/HeroDemoMockup.tsx` — componente com o mockup animado multi-tela + textos laterais + dots de progresso + CTA final
- **Editar**: `src/components/sales/SalesHero.tsx` — remover o bloco `<video>` e importar o novo `HeroDemoMockup`
- **Editar**: `src/i18n/sales-translations.ts` — adicionar chaves para os textos de cada tela do mockup
- **Remover**: Referência ao `/videos/dr-sleepy-demo.mp4` (pode manter o arquivo para uso futuro)

### Detalhes técnicos

- Usa o mesmo padrão visual dos mockups existentes (rounded-[2.5rem], border-[6px], status bar, home indicator)
- Transições entre telas com `animate-fade-in` do Tailwind já configurado
- Indicadores de progresso (dots) mostram qual tela está ativa
- Textos ao lado mudam junto com a tela do mockup
- Tela do CTA final inclui botão funcional que scrolla até o pricing
- Tudo em CSS/React — zero dependências externas, zero vídeo

