

## Vídeo Demo do App — Screencast Simulado com Remotion

Sim, conseguimos criar isso internamente usando **Remotion** — uma biblioteca que renderiza vídeos em MP4 direto no servidor, sem precisar gravar tela de celular real.

### Como funciona

Em vez de gravar a tela de um celular de verdade, vamos **recriar as telas do app como componentes animados** dentro de um frame de celular (iPhone mockup). As interações (toques, digitação, respostas aparecendo) são todas **animadas frame a frame**, simulando um screencast real.

### Fluxo do vídeo (30-45 segundos)

1. **Cena 1 (0-5s)** — Celular aparece na tela. App abre na Home com o Emergency Mode visível
2. **Cena 2 (5-12s)** — "Dedo" toca em "Could it be sleep?" → transição para o Chat
3. **Cena 3 (12-22s)** — Mensagem do Dr. Sleepy aparece com efeito de digitação. Resposta do usuário aparece. Nova resposta da IA com dicas
4. **Cena 4 (22-35s)** — Transição para o Cry Translator. Animação do botão de gravação pulsando → resultado aparecendo com percentuais e dicas
5. **Cena 5 (35-40s)** — Logo do Dr. Sleepy + tagline "Your baby sleeps tonight"

### O que será criado

- Projeto Remotion em `remotion/` com 5 cenas
- Mockup de iPhone como frame visual
- Recriação simplificada das telas reais do app (Home, Chat, Cry Translator) usando os mesmos cores e layout do app
- Animações de toque, digitação, e transições entre telas
- Output: MP4 em 1080x1920 (vertical) ou 1920x1080 (horizontal) — ideal para embed na hero section
- Geração de fotos realistas dos testemunhos via Gemini Pro (do plano anterior)

### Limitações

- Não é uma gravação real — é uma **simulação animada** das telas
- Visualmente muito próximo do app real, mas simplificado
- Sem áudio (pode adicionar música depois se quiser)

### Formato

O vídeo será renderizado como MP4 e pode ser embedado diretamente na hero section da landing page, ou usado como creative para Meta Ads.

