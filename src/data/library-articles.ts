export interface Article {
  id: string;
  title: string;
  description: string;
  type: "article" | "audio";
  duration: string;
  category: string;
  ageRange: string;
  content: string;
}

export const articles: Article[] = [
  {
    id: "1",
    title: "Janelas de sono por idade",
    description: "Entenda quanto tempo seu bebê deve ficar acordado",
    type: "article",
    duration: "3 min",
    category: "Sono",
    ageRange: "0-3 meses",
    content: `## O que são janelas de sono?

Janelas de sono são os períodos em que o bebê fica acordado entre um cochilo e outro. Respeitar essas janelas é essencial para evitar que o bebê fique **cansado demais** — o que, ironicamente, dificulta o sono.

### Por idade

**0 a 1 mês:** 45 minutos a 1 hora
O recém-nascido tem muito pouco tempo de vigília. Se ele estiver acordado há mais de 1 hora, provavelmente já está pronto para dormir novamente.

**1 a 2 meses:** 1 hora a 1h30
Comece a observar os sinais de cansaço: esfregar os olhos, bocejar, olhar fixo.

**2 a 3 meses:** 1h15 a 1h45
Nessa fase, o bebê começa a ter um padrão mais previsível. Aproveite para criar uma mini rotina antes dos cochilos.

### Sinais de que a janela passou

- Bebê fica irritado ou choroso sem motivo aparente
- Dificuldade para pegar no sono mesmo estando cansado
- Cochilos muito curtos (menos de 30 minutos)

### Dica prática

Use um timer no celular para monitorar o tempo acordado. Com o tempo, você vai perceber os sinais naturalmente, mas no começo o timer é um grande aliado.

> **Lembre-se:** cada bebê é único. Esses tempos são referências, não regras rígidas. Observe sempre o seu bebê.`,
  },
  {
    id: "2",
    title: "Ruído branco: benefícios e cuidados",
    description: "Como usar sons para acalmar o bebê",
    type: "article",
    duration: "5 min",
    category: "Sono",
    ageRange: "0-6 meses",
    content: `## Por que o ruído branco funciona?

Dentro do útero, o bebê ouve sons constantes — o fluxo do sangue, a batida do coração e os ruídos do corpo da mãe. Esse som contínuo é **reconfortante** e familiar.

O ruído branco imita esse ambiente e ajuda o bebê a:

- **Adormecer mais rápido**
- **Manter o sono** por mais tempo
- **Bloquear ruídos** do ambiente (TV, conversas, cachorro)

### Como usar corretamente

**Volume:** Nunca ultrapasse 50-60 dB (mais ou menos o volume de um chuveiro). Sons muito altos podem prejudicar a audição do bebê.

**Distância:** Mantenha a fonte de som a pelo menos 1 metro do berço.

**Tipo:** Prefira sons contínuos e monótonos (chuva, ventilador, estática). Evite sons com variações bruscas.

**Duração:** Pode usar durante todo o período de sono, mas tente reduzir gradualmente após os 6 meses.

### Cuidados importantes

⚠️ **Não use fones de ouvido** no bebê — jamais.

⚠️ **Não deixe o celular dentro do berço** como fonte de som.

⚠️ Após os 12 meses, comece a diminuir o uso para que o bebê aprenda a dormir sem ele.

### Alternativas ao ruído branco

- Ventilador ligado no quarto (direcionado para longe do bebê)
- Músicas de caixinha de música em volume baixo
- Sons da natureza (chuva, ondas do mar)

> **Dica:** Na seção de Biblioteca de Áudios do Doutor Soneca você encontra canções de ninar perfeitas para o sono do bebê.`,
  },
  {
    id: "3",
    title: "Sinais de fome vs cansaço",
    description: "Aprenda a diferenciar os sinais do seu bebê",
    type: "article",
    duration: "4 min",
    category: "Alimentação",
    ageRange: "0-12 meses",
    content: `## A confusão mais comum dos pais

Um dos maiores desafios dos primeiros meses é saber **por que** o bebê está chorando. Muitas vezes, os sinais de fome e cansaço se parecem — e confundi-los pode dificultar tanto a alimentação quanto o sono.

### Sinais de FOME

**Iniciais (hora de alimentar):**
- Virar a cabeça para os lados (reflexo de busca)
- Levar as mãos à boca
- Fazer movimentos de sucção com os lábios
- Ficar inquieto e se mexer bastante

**Tardios (já está com muita fome):**
- Choro intenso e agitação
- Corpo tenso e rígido
- Difícil de acalmar

### Sinais de CANSAÇO

**Iniciais (hora de dormir):**
- Esfregar os olhos ou as orelhas
- Bocejar
- Olhar fixo ou "vidrado"
- Diminuir a atividade

**Tardios (já passou da hora):**
- Choro sem motivo aparente
- Arquear as costas
- Irritabilidade extrema
- Resistir ao colo

### Como diferenciar na prática

| Sinal | Fome | Cansaço |
|-------|------|---------|
| Mãos na boca | ✅ Frequente | ❌ Raro |
| Bocejos | ❌ Raro | ✅ Frequente |
| Busca o peito/mamadeira | ✅ Sim | ❌ Não |
| Olhos pesados | ❌ Não | ✅ Sim |
| Acalma ao mamar | ✅ Sim | ⚠️ Temporário |

### Dica de ouro

Anote os horários de alimentação e sono na aba **Rotina** do Doutor Soneca. Com poucos dias de registro, fica muito mais fácil prever se é hora de comer ou dormir.

> **Importante:** Se o bebê mamou recentemente (há menos de 1-2 horas), é mais provável que o choro seja de cansaço, desconforto ou outra necessidade.`,
  },
  {
    id: "4",
    title: "Rotina de sono noturno",
    description: "Passo a passo para criar uma rotina eficaz",
    type: "article",
    duration: "6 min",
    category: "Rotina",
    ageRange: "3-6 meses",
    content: `## Por que a rotina importa tanto?

Bebês não sabem ler o relógio, mas reconhecem **padrões**. Quando você repete as mesmas ações antes de dormir, o cérebro do bebê começa a associar essas atividades ao sono. É como dar um aviso: "ei, está chegando a hora de descansar."

### A rotina ideal (30-45 minutos antes de dormir)

**Passo 1 — Banho morno** 🛁
Um banho relaxante ajuda a baixar a temperatura corporal, sinalizando ao corpo que é hora de descansar. Não precisa ser longo — 5 a 10 minutos bastam.

**Passo 2 — Massagem suave** ✋
Após o banho, faça uma massagem leve com óleo ou hidratante. Movimentos circulares na barriguinha e nas perninhas. Isso reduz o cortisol (hormônio do estresse).

**Passo 3 — Trocar a roupa e preparar o ambiente** 🌙
Vista o pijama, escureça o quarto, ligue o ruído branco (se usar) e diminua os estímulos.

**Passo 4 — Alimentação calma** 🍼
A última mamada do dia deve ser tranquila. Evite brincadeiras ou estímulos visuais durante a mamada.

**Passo 5 — Canção de ninar ou história** 📖
Pode ser uma música suave, uma história curta ou simplesmente conversar baixinho. O importante é que seja sempre o mesmo ritual.

**Passo 6 — Colocar no berço sonolento, mas acordado** 😴
Esse é o passo mais desafiador, mas também o mais importante a longo prazo. O bebê que aprende a adormecer no berço terá mais facilidade para voltar a dormir quando acordar à noite.

### Erros comuns

❌ Variar a rotina todo dia
❌ Fazer atividades estimulantes perto da hora de dormir
❌ Esperar o bebê ficar exausto para iniciar a rotina
❌ Pular etapas quando está cansado (consistência é tudo!)

### Quanto tempo leva para funcionar?

A maioria dos bebês responde à rotina em **1 a 3 semanas**. Seja paciente e consistente — os resultados virão.

> **Use o Doutor Soneca:** Registre na aba Rotina o horário que inicia o ritual todas as noites. Isso ajuda a IA a dar orientações cada vez mais personalizadas.`,
  },
  {
    id: "5",
    title: "Meditação para pais cansados",
    description: "5 minutos de relaxamento guiado",
    type: "article",
    duration: "5 min",
    category: "Bem-estar",
    ageRange: "Todos",
    content: `## Você também precisa descansar

Cuidar de um bebê é exaustivo — física e emocionalmente. Muitos pais se esquecem de cuidar de si mesmos enquanto tentam dar o melhor para o filho. Mas a verdade é: **um pai descansado cuida melhor**.

### Exercício de respiração 4-7-8

Essa técnica simples ativa o sistema nervoso parassimpático, ajudando o corpo a relaxar:

1. **Inspire** pelo nariz contando até **4**
2. **Segure** a respiração contando até **7**
3. **Expire** pela boca contando até **8**

Repita 4 vezes. Pode fazer sentado, deitado ou até mesmo em pé com o bebê no colo.

### Escaneamento corporal (3 minutos)

Feche os olhos e mentalmente "escaneie" cada parte do corpo:

1. Comece pelos **pés** — perceba qualquer tensão e solte
2. Suba para as **pernas** — relaxe conscientemente
3. **Barriga** — respire fundo e solte
4. **Ombros e pescoço** — onde a maioria dos pais acumula tensão
5. **Rosto** — solte a testa, o maxilar, os olhos

### Afirmações para o momento difícil

Quando estiver no limite, repita para si mesmo:

- *"Eu estou fazendo o melhor que posso, e isso é suficiente."*
- *"Essa fase é temporária. Vai passar."*
- *"Pedir ajuda não é fraqueza, é sabedoria."*
- *"Meu bebê não precisa de um pai perfeito, precisa de um pai presente."*

### Quando procurar mais ajuda

Se você sentir:
- Tristeza profunda que não passa
- Raiva descontrolada
- Vontade de se afastar do bebê
- Pensamentos assustadores

**Procure ajuda profissional.** Depressão pós-parto afeta tanto mães quanto pais e tem tratamento. Você não está sozinho(a).

> **Ligue para o CVV (188)** — disponível 24 horas, todos os dias.`,
  },
  {
    id: "6",
    title: "Regressão de sono: o que esperar",
    description: "Por que o sono pode piorar temporariamente",
    type: "article",
    duration: "5 min",
    category: "Sono",
    ageRange: "4-6 meses",
    content: `## O que é a regressão de sono?

Tudo estava indo bem — o bebê dormia longas horas, os cochilos eram previsíveis, e então... de repente, tudo muda. Ele acorda várias vezes à noite, recusa os cochilos e parece ter desaprendido a dormir.

Calma. Isso é uma **regressão de sono** e é completamente **normal**.

### Por que acontece?

As regressões acontecem quando o cérebro do bebê está passando por grandes mudanças no desenvolvimento:

**4 meses** — A mais famosa. O padrão de sono do bebê amadurece e passa a ter ciclos como os de um adulto. É uma mudança permanente (e positiva!), mas o período de adaptação pode ser difícil.

**6 meses** — Coincide com o início da alimentação complementar e, em alguns bebês, com o nascimento dos primeiros dentes.

**8-10 meses** — Período de marcos motores (sentar, engatinhar, ficar em pé). O cérebro quer "praticar" essas habilidades novas — inclusive à noite.

**12 meses** — Transição de 2 para 1 cochilo. Pode causar confusão na rotina.

**18 meses** — Ansiedade de separação no auge + desenvolvimento da linguagem.

### O que fazer durante uma regressão

✅ **Mantenha a rotina** — Não mude tudo por causa da regressão
✅ **Ofereça conforto** — O bebê precisa de segurança nesse momento
✅ **Seja paciente** — A maioria das regressões dura 2 a 4 semanas
✅ **Cuide de você** — Reveze com o parceiro se possível

### O que NÃO fazer

❌ Criar novos hábitos que não quer manter (ex: trazer para a cama dos pais se não era o plano)
❌ Eliminar cochilos diurnos achando que vai melhorar a noite
❌ Se desesperar — isso vai passar!

### Quando se preocupar

Se a regressão durar mais de 6 semanas ou vier acompanhada de febre persistente, perda de peso ou outros sintomas, consulte o pediatra.

> **Dica:** Use o chat do Doutor Soneca para relatar o que está acontecendo. Com base nos logs da rotina, a IA pode ajudar a identificar se é regressão ou outro fator.`,
  },
];
