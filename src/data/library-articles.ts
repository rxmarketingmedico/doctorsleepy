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
  {
    id: "7",
    title: "Cólicas: como aliviar",
    description: "Entenda as cólicas e técnicas para acalmar o bebê",
    type: "article",
    duration: "5 min",
    category: "Bem-estar",
    ageRange: "0-3 meses",
    content: `## O que são as cólicas?

As cólicas são episódios de choro intenso, sem causa aparente, que geralmente acontecem no final da tarde ou à noite. Elas afetam cerca de **20-25% dos bebês** e costumam começar por volta das 2 semanas de vida, com pico aos 6 semanas.

### A regra dos 3

Pediatras definem cólica pela "regra dos 3":
- Choro por mais de **3 horas** por dia
- Em mais de **3 dias** por semana
- Por mais de **3 semanas** seguidas

### Técnicas de alívio

**Posição de avião** ✈️
Coloque o bebê de bruços sobre o seu antebraço, com a cabeça apoiada na sua mão. A pressão na barriguinha ajuda a aliviar os gases.

**Massagem na barriga** 🤲
Movimentos circulares no sentido horário ao redor do umbigo. Use óleo de amêndoas morno para tornar mais confortável.

**Bicicletinha** 🚲
Com o bebê deitado de costas, mova as perninhas como se estivesse pedalando. Isso ajuda a liberar gases presos.

**Banho morno** 🛁
A água morna relaxa a musculatura abdominal e ajuda a aliviar a dor.

**Ruído branco** 🔊
O som contínuo (aspirador, secador, app de ruído branco) ajuda a distrair e acalmar o bebê durante as crises.

### O que evitar

❌ Balançar o bebê com força (risco de síndrome do bebê sacudido)
❌ Trocar de leite/fórmula sem orientação pediátrica
❌ Se culpar — cólica NÃO é culpa dos pais

### Quando passa?

A boa notícia: as cólicas desaparecem espontaneamente entre os **3 e 4 meses** de vida. Até lá, paciência e revezamento entre os cuidadores são essenciais.

> **Importante:** Se o choro vier acompanhado de febre, vômitos ou recusa alimentar, procure o pediatra.`,
  },
  {
    id: "8",
    title: "Dentição e sono: o que muda",
    description: "Como os dentes afetam o sono do bebê",
    type: "article",
    duration: "4 min",
    category: "Sono",
    ageRange: "6-12 meses",
    content: `## Quando os dentes começam a nascer?

Os primeiros dentes geralmente aparecem entre os **6 e 10 meses**, mas podem surgir antes ou depois. O processo completo dura até os 2-3 anos.

### Sinais de dentição

- Gengivas inchadas e vermelhas
- Salivação excessiva (babando muito)
- Morder tudo que encontra
- Irritabilidade e choro
- Febre baixa (até 37,5°C)
- Alterações no sono

### Como a dentição afeta o sono

O desconforto da dentição é **mais intenso à noite** porque há menos distrações. O bebê pode:

- Acordar mais vezes durante a noite
- Ter dificuldade para adormecer
- Fazer cochilos mais curtos
- Recusar o peito/mamadeira por dor na gengiva

### O que fazer

**Mordedores gelados** 🧊
Coloque o mordedor na geladeira (não no freezer). O frio alivia a inflamação na gengiva.

**Massagem na gengiva** 🤲
Com o dedo limpo, massageie suavemente a gengiva do bebê. A pressão ajuda a aliviar a dor.

**Paracetamol ou ibuprofeno** 💊
Apenas com orientação do pediatra e na dose correta para o peso do bebê. Nunca medique por conta própria.

**Mantenha a rotina** 🌙
A tentação é mudar tudo, mas manter a rotina de sono ajuda o bebê a se sentir seguro durante esse período.

### O que NÃO usar

⚠️ **Géis anestésicos** — podem ser perigosos para bebês
⚠️ **Colares de âmbar** — risco de estrangulamento e engasgo, sem comprovação científica
⚠️ **Mel na gengiva** — proibido para menores de 1 ano (risco de botulismo)

> **Dica:** Registre na Rotina do Doutor Soneca os períodos de dentição para que a IA considere esse fator nas orientações de sono.`,
  },
  {
    id: "9",
    title: "Ambiente ideal para o sono",
    description: "Como preparar o quarto perfeito para o bebê dormir",
    type: "article",
    duration: "4 min",
    category: "Sono",
    ageRange: "0-12 meses",
    content: `## O quarto do bebê importa (muito!)

O ambiente em que o bebê dorme influencia diretamente a **qualidade e duração** do sono. Pequenos ajustes podem fazer uma grande diferença.

### Temperatura ideal

O quarto deve estar entre **20°C e 22°C**. Bebês dormem melhor em ambientes ligeiramente frescos.

**Como saber se o bebê está confortável:**
- Toque a nuca ou o peito — devem estar mornos, não quentes
- Mãos e pés frios são normais e NÃO indicam que está com frio
- Se estiver suando, está quente demais

### Escuridão

A melatonina (hormônio do sono) é produzida no escuro. Para o sono noturno:

- Use **cortinas blackout** — investimento que vale cada centavo
- Cubra luzes de aparelhos eletrônicos
- Use luz vermelha ou âmbar se precisar enxergar durante a noite (nunca branca ou azul)

### Ruído

- **Silêncio total** pode ser contraproducente — qualquer barulho acorda o bebê
- **Ruído branco constante** mascara sons do ambiente e ajuda a manter o sono
- Mantenha o volume abaixo de 50-60 dB

### O berço seguro

- Colchão **firme** e do tamanho exato do berço
- Sem travesseiros, cobertores soltos, bichos de pelúcia ou protetores
- Bebê sempre **de barriga para cima**
- Sem espaços entre o colchão e as laterais

### Checklist do quarto

- [ ] Temperatura entre 20-22°C
- [ ] Escuro (cortina blackout)
- [ ] Ruído branco ligado
- [ ] Berço sem objetos soltos
- [ ] Roupa de dormir adequada à temperatura
- [ ] Umidificador se o ar estiver seco

> **Importante:** A Sociedade Brasileira de Pediatria recomenda que o bebê durma no quarto dos pais (mas no próprio berço) até os 6 meses de vida.`,
  },
  {
    id: "10",
    title: "Introdução alimentar e sono",
    description: "Como a alimentação complementar influencia o sono",
    type: "article",
    duration: "5 min",
    category: "Alimentação",
    ageRange: "6-12 meses",
    content: `## A partir dos 6 meses tudo muda

A introdução alimentar é um marco importante que pode afetar o sono do bebê — para melhor ou pior. Entender essa relação ajuda a navegar essa fase com mais tranquilidade.

### O mito do "come mais, dorme mais"

Muitos avós dizem: "dá papinha que ele dorme a noite toda." Isso é um **mito parcial**. A introdução alimentar pode melhorar o sono, mas não é mágica e depende de vários fatores.

### Como a alimentação pode MELHORAR o sono

- Alimentos ricos em **triptofano** (banana, aveia, batata-doce) ajudam na produção de melatonina
- Um bebê bem alimentado durante o dia tende a acordar menos à noite por fome
- A saciedade proporcionada por alimentos sólidos pode prolongar o sono noturno

### Como pode ATRAPALHAR o sono

- **Alergias alimentares** podem causar desconforto e despertar
- **Gases e cólicas** por alimentos novos
- **Constipação** ao introduzir novos alimentos
- Oferecer alimentos muito perto da hora de dormir

### Horários ideais para as refeições

| Refeição | Horário sugerido |
|----------|-----------------|
| Almoço | 11h-12h |
| Lanche | 14h-15h |
| Jantar | 17h-18h |

**Regra de ouro:** A última refeição sólida deve ser pelo menos **1-2 horas antes** de dormir.

### Alimentos aliados do sono

🍌 **Banana** — rica em magnésio e triptofano
🍠 **Batata-doce** — carboidrato complexo que dá saciedade
🥑 **Abacate** — gordura boa que sustenta por mais tempo
🥣 **Aveia** — libera energia lentamente durante a noite

### Alimentos para evitar à noite

❌ Frutas cítricas (podem causar refluxo)
❌ Alimentos muito doces
❌ Alimentos que o bebê ainda não testou (teste sempre pela manhã)

> **Dica:** Se o bebê começou a acordar mais após um alimento novo, anote no chat do Doutor Soneca. A IA pode ajudar a identificar possíveis correlações.`,
  },
  {
    id: "11",
    title: "Sono do bebê prematuro",
    description: "Particularidades do sono de prematuros",
    type: "article",
    duration: "5 min",
    category: "Sono",
    ageRange: "0-6 meses",
    content: `## Prematuros dormem diferente?

Sim. Bebês prematuros têm padrões de sono diferentes dos bebês a termo, e isso é completamente **normal**. Entender essas diferenças evita preocupações desnecessárias.

### Idade corrigida vs idade cronológica

Para avaliar o sono do prematuro, use sempre a **idade corrigida**:

*Idade corrigida = Idade cronológica - Semanas de prematuridade*

Exemplo: um bebê de 4 meses que nasceu 2 meses antes tem idade corrigida de **2 meses**. Espere o comportamento de sono de um bebê de 2 meses.

### Diferenças no sono do prematuro

- **Mais sono REM** — O prematuro passa mais tempo em sono leve, o que é importante para o desenvolvimento cerebral
- **Despertares frequentes** — Totalmente esperado e, na verdade, é um mecanismo de proteção
- **Janelas de sono mais curtas** — Use a idade corrigida como referência
- **Desenvolvimento mais lento** da consolidação do sono noturno

### Marcos de sono por idade corrigida

**0-2 meses corrigidos:** Sono fragmentado, sem padrão definido. Normal.

**3-4 meses corrigidos:** Começam a surgir padrões. O sono noturno pode começar a se alongar.

**6 meses corrigidos:** A maioria dos prematuros começa a consolidar o sono noturno.

### Cuidados especiais

✅ Ambiente ainda mais controlado (temperatura, luz, ruído)
✅ Alimentação mais frequente pode ser necessária
✅ Paciência extra com marcos de sono
✅ Acompanhamento pediátrico mais frequente

### Quando se preocupar

Converse com o pediatra se:
- O bebê tem apneias (pausas na respiração) durante o sono
- Não ganha peso adequadamente
- Está excessivamente sonolento e difícil de acordar para mamar

> **Lembre-se:** Cada prematuro tem seu ritmo. Comparar com bebês a termo só gera ansiedade desnecessária. Confie no processo e no acompanhamento médico.`,
  },
  {
    id: "12",
    title: "Co-sleeping: prós, contras e segurança",
    description: "Compartilhar a cama com o bebê de forma segura",
    type: "article",
    duration: "6 min",
    category: "Sono",
    ageRange: "0-12 meses",
    content: `## O que é co-sleeping?

Co-sleeping significa dormir no mesmo ambiente que o bebê. Existem duas formas:

- **Room-sharing (compartilhar o quarto):** Bebê dorme no próprio berço, no quarto dos pais. **Recomendado** pela SBP até os 6 meses.
- **Bed-sharing (compartilhar a cama):** Bebê dorme na cama dos pais. **Controverso** — tem riscos, mas é praticado por muitas famílias.

### Benefícios do room-sharing

- Facilita a amamentação noturna
- Pais percebem rapidamente se algo está errado
- Reduz o risco de SMSL (Síndrome da Morte Súbita do Lactente) em até 50%
- Bebê se sente mais seguro com a proximidade

### Riscos do bed-sharing

⚠️ Risco de sufocamento com travesseiros e cobertores
⚠️ Risco de o bebê cair da cama
⚠️ Risco de sobreaquecimento
⚠️ Pode criar dependência difícil de quebrar

### Se você DECIDIR compartilhar a cama

Algumas famílias optam pelo bed-sharing por questões culturais, práticas ou de amamentação. Se for o caso, siga as regras de segurança:

**Regras essenciais:**
- Colchão firme e plano (nunca sofá, poltrona ou rede)
- Sem travesseiros ou cobertores perto do bebê
- Bebê sempre de barriga para cima
- Sem espaços onde o bebê possa ficar preso
- Cabelo longo dos pais preso

**NUNCA compartilhe a cama se:**
- ❌ Você fumou (mesmo que não fume no quarto)
- ❌ Consumiu álcool ou drogas
- ❌ Tomou medicamentos que causam sonolência
- ❌ Está extremamente cansado(a)
- ❌ O bebê nasceu prematuro ou com baixo peso

### Alternativa segura: berço acoplado (sidecar)

O berço acoplado à cama dos pais oferece o melhor dos dois mundos: proximidade para amamentar com facilidade e espaço seguro e separado para o bebê dormir.

> **O Doutor Soneca não julga sua escolha.** Cada família é única. O importante é que a decisão seja informada e segura.`,
  },
  {
    id: "13",
    title: "Autocuidado para pais de recém-nascidos",
    description: "Estratégias práticas para sobreviver aos primeiros meses",
    type: "article",
    duration: "4 min",
    category: "Bem-estar",
    ageRange: "Todos",
    content: `## Você não pode cuidar do bebê se não cuidar de você

Isso não é egoísmo — é **sobrevivência**. Os primeiros meses com um recém-nascido são os mais intensos da vida de muitos pais. Aqui estão estratégias práticas e realistas.

### Sono dos pais

**"Durma quando o bebê dormir"** — o conselho mais repetido e mais difícil de seguir. Mas tente ao menos uma vez ao dia.

- Aceite que a casa vai ficar bagunçada
- Peça para alguém cuidar do bebê por 1-2 horas para você cochilar
- Reveze com o parceiro(a) em turnos à noite

### Alimentação

Quando se está privado de sono, o corpo pede açúcar e cafeína. Tente equilibrar:

- Prepare refeições simples em lotes (arroz, frango, legumes)
- Tenha frutas e nuts sempre à mão
- Hidrate-se muito (especialmente se estiver amamentando)
- Cafeína com moderação: até 200mg/dia se amamentando

### Rede de apoio

**Não tenha vergonha de pedir ajuda.** Pessoas querem ajudar, mas muitas vezes não sabem como.

Seja específica(o):
- "Pode trazer um almoço amanhã?"
- "Pode ficar com o bebê 1 hora para eu tomar banho?"
- "Pode me ajudar com a roupa suja?"

### Saúde mental

Os "baby blues" (tristeza pós-parto) afetam até 80% das mães nos primeiros 15 dias. É diferente da **depressão pós-parto**, que é mais intensa e duradoura.

**Sinais de alerta para depressão pós-parto:**
- Tristeza que não melhora após 2 semanas
- Desinteresse pelo bebê
- Pensamentos de se machucar ou machucar o bebê
- Ansiedade extrema
- Insônia mesmo quando o bebê dorme

👉 **Procure ajuda profissional se identificar esses sinais.**

### O mínimo para o dia

Nos dias mais difíceis, a meta é:
1. ✅ Todo mundo comeu
2. ✅ Todo mundo está limpo (mais ou menos)
3. ✅ Todo mundo está seguro

Se conseguiu isso, o dia foi um **sucesso**. O resto é bônus.

> **Lembre-se:** Essa fase passa. Parece eterna quando você está vivendo, mas um dia você vai olhar para trás e mal vai lembrar.`,
  },
  {
    id: "14",
    title: "Transição do berço para a cama",
    description: "Quando e como fazer essa mudança com tranquilidade",
    type: "article",
    duration: "4 min",
    category: "Rotina",
    ageRange: "0-3 meses",
    content: `## Quando é a hora certa?

Não existe uma idade exata, mas a maioria das crianças faz a transição entre **18 meses e 3 anos**. Os sinais de que está na hora:

- A criança escala ou tenta pular o berço (questão de **segurança**)
- Demonstra interesse em camas "de gente grande"
- É grande demais para o berço
- Um novo irmão precisa do berço

### Como preparar a transição

**Semana 1-2: Preparação**
- Converse sobre a mudança de forma positiva e empolgante
- Leve a criança para escolher lençóis ou almofada (senso de pertencimento)
- Leia livros sobre dormir na cama grande

**Semana 3: A mudança**
- Monte a cama nova no mesmo lugar do berço (se possível)
- Use grades de proteção lateral
- Mantenha **toda a rotina de sono igual** — só o berço muda
- Coloque um colchão ou tapete ao lado da cama nos primeiros dias

**Semana 4+: Ajuste**
- É normal que a criança saia da cama algumas vezes
- Reconduza com calma, sem brigas, sem recompensas exageradas
- Consistência é a chave

### Erros comuns

❌ Fazer a transição junto com outra mudança grande (novo irmão, mudança de casa, tirar a chupeta)
❌ Voltar ao berço depois de começar — gera confusão
❌ Fazer a transição cedo demais só porque "já está na hora"
❌ Transformar em drama — seja natural e positivo

### Se não estiver funcionando

Se após 2-3 semanas a criança está claramente sofrendo, **voltar ao berço é ok**. Tente novamente em 1-2 meses. Não há pressa.

### Segurança da cama

- Grade de proteção em ambos os lados
- Cama baixa (ou colchão no chão no estilo Montessori)
- Quarto à prova de criança: tomadas protegidas, móveis presos, sem objetos perigosos ao alcance
- Porta do quarto com proteção se necessário

> **Dica:** Registre na Rotina do Doutor Soneca como está sendo o sono na cama nova. A IA pode ajudar com orientações específicas para essa fase.`,
  },
  {
    id: "15",
    title: "Marcos de desenvolvimento e sono",
    description: "Como cada fase do crescimento impacta o sono",
    type: "article",
    duration: "6 min",
    category: "Sono",
    ageRange: "0-12 meses",
    content: `## O cérebro não desliga à noite

Quando o bebê está aprendendo algo novo — rolar, sentar, engatinhar, andar — o cérebro continua "praticando" durante o sono. Isso causa despertares e pode parecer uma regressão.

### Marcos por idade e impacto no sono

**1-2 meses: Sorriso social**
- Impacto leve no sono
- Bebê pode ficar mais alerta e demorar a dormir

**3-4 meses: Rolar**
- O bebê pode rolar no berço e acordar assustado
- Se rola de costas para a barriga e não consegue voltar, pode chorar

**5-6 meses: Sentar**
- Pode sentar no berço em vez de dormir
- Às vezes senta dormindo e acorda confuso

**7-9 meses: Engatinhar e ficar em pé**
- Fase desafiadora! O bebê fica em pé no berço e não sabe descer
- Pratica engatinhar no berço durante a noite
- Ansiedade de separação começa forte

**10-12 meses: Primeiros passos**
- Muita energia cerebral dedicada ao aprendizado motor
- Sono pode ficar fragmentado por 2-4 semanas

**12-18 meses: Linguagem**
- O cérebro processa as palavras novas durante o sono
- Pode falar ou balbuciar durante a noite

### O que fazer durante marcos

✅ **Pratique a nova habilidade durante o dia** — Se o bebê quer ficar em pé, ajude-o a praticar (e a descer!) durante o dia para que não precise praticar à noite.

✅ **Mantenha a rotina** — A consistência é reconfortante em meio a tanta mudança.

✅ **Ofereça mais conforto** — Marcos são exaustivos. Um pouco mais de colo e carinho ajudam.

✅ **Seja paciente** — A maioria dos impactos no sono dura **1 a 3 semanas**.

### Tabela rápida

| Idade | Marco | Duração do impacto |
|-------|-------|-------------------|
| 3-4m | Rolar | 1-2 semanas |
| 5-6m | Sentar | 1-2 semanas |
| 7-9m | Engatinhar/ficar em pé | 2-4 semanas |
| 10-12m | Andar | 2-3 semanas |
| 12-18m | Falar | 1-2 semanas |

> **Use o Doutor Soneca:** Quando perceber um marco novo, mencione no chat. A IA vai adaptar as orientações de sono considerando essa fase do desenvolvimento.`,
  },
  {
    id: "16",
    title: "Chupeta: usar ou não usar?",
    description: "Prós, contras e orientações sobre o uso da chupeta",
    type: "article",
    duration: "5 min",
    category: "Bem-estar",
    ageRange: "0-12 meses",
    content: `## O eterno debate da chupeta

Poucos assuntos dividem tanto os pais quanto a chupeta. A verdade é que **não existe resposta certa universal** — depende do bebê, da família e do contexto.

### Benefícios comprovados

**Redução do risco de SMSI (Síndrome da Morte Súbita Infantil)** 🛡️
Estudos mostram que o uso da chupeta durante o sono está associado a uma diminuição significativa do risco de SMSI, especialmente nos primeiros 6 meses.

**Efeito calmante** 😌
A sucção não nutritiva é um reflexo natural do bebê que traz conforto e ajuda na autorregulação emocional.

**Auxílio no sono** 🌙
A chupeta pode ajudar o bebê a adormecer e a transitar entre ciclos de sono com mais facilidade.

### Possíveis desvantagens

**Interferência na amamentação** 🤱
A Sociedade Brasileira de Pediatria recomenda evitar a chupeta nas primeiras 3-4 semanas de vida para não atrapalhar a pega no peito.

**Dependência** 🔄
O bebê pode acordar chorando toda vez que a chupeta cai — o que significa mais despertares para os pais.

**Problemas ortodônticos** 🦷
O uso prolongado (além dos 2-3 anos) pode afetar a formação da arcada dentária e o palato.

**Otites** 👂
O uso contínuo pode aumentar levemente o risco de infecções de ouvido.

### Se decidir usar

- **Espere** a amamentação estar bem estabelecida (3-4 semanas)
- **Não force** — ofereça, mas respeite se o bebê recusar
- **Nunca** mergulhe em açúcar, mel ou qualquer substância
- **Esterilize** regularmente nos primeiros 6 meses
- **Planeje a retirada** gradual entre 1 e 2 anos

### Se decidir não usar

- Ofereça outras formas de sucção não nutritiva (dedo, mordedor)
- Use técnicas de conforto alternativas (embalar, ruído branco, shushing)
- Não se sinta culpado(a) — é uma decisão válida

### Retirando a chupeta

**Antes de 1 ano:** Reduza gradualmente o uso e ofereça apenas para dormir.

**Após 1 ano:** Estratégias como a "fada da chupeta", troca por um presente ou reduzir progressivamente o tempo de uso podem ajudar.

> **Dica:** Se a chupeta está causando despertares noturnos, converse com o Doutor Soneca no chat. A IA pode sugerir estratégias personalizadas para reduzir a dependência sem sofrimento.`,
  },
  {
    id: "17",
    title: "Amamentação noturna: guia completo",
    description: "Quando alimentar à noite e quando começar a reduzir",
    type: "article",
    duration: "6 min",
    category: "Alimentação",
    ageRange: "0-12 meses",
    content: `## Amamentar à noite é normal

Nos primeiros meses, o bebê **precisa** mamar à noite. O estômago pequeno, o crescimento acelerado e a produção de leite dependem dessas mamadas noturnas. Não é um problema — é biologia.

### Frequência esperada por idade

| Idade | Mamadas noturnas esperadas |
|-------|---------------------------|
| 0-1 mês | 3-4 vezes (a cada 2-3h) |
| 1-3 meses | 2-3 vezes |
| 3-6 meses | 1-2 vezes |
| 6-9 meses | 0-1 vez |
| 9-12 meses | Geralmente desnecessária |

*Valores aproximados — cada bebê tem seu próprio ritmo.*

### Mamada noturna vs. mamada de conforto

É importante distinguir:

**Mamada de fome** 🍼
- Bebê mama ativamente por 10-20 minutos
- Suga com ritmo forte e constante
- Volta a dormir após mamar
- Fralda está molhada na manhã seguinte

**Mamada de conforto** 😴
- Suga por 2-5 minutos e para
- Ritmo lento, mais "chupetando"
- Acorda novamente pouco tempo depois
- Usa o peito como chupeta para adormecer

### Dicas para mamadas noturnas mais tranquilas

**Mantenha o ambiente escuro** 🌑
Use apenas uma luz noturna vermelha ou âmbar. Não acenda luzes brancas — isso inibe a melatonina.

**Minimize a interação** 🤫
Não fale, não brinque, não troque a fralda (a menos que esteja suja). O objetivo é manter o bebê no "modo sono".

**Posição confortável** 🛋️
Tenha uma poltrona ou almofada de amamentação pronta. Você também precisa de conforto às 3h da manhã.

**Reveze com o parceiro** 🤝
Se usar mamadeira ou leite ordenhado, o parceiro pode assumir uma das mamadas para você descansar.

### Quando e como reduzir

**A partir dos 6 meses** (com orientação pediátrica):
1. Elimine uma mamada por vez, começando pela que o bebê menos precisa
2. Aumente gradualmente o intervalo entre as mamadas
3. Ofereça água em vez de leite (após 6 meses)
4. Peça ao parceiro que acalme o bebê sem oferecer o peito

**Importante:** Nunca elimine mamadas abruptamente se estiver amamentando — isso pode causar ingurgitamento e mastite.

> **Lembre-se:** A OMS recomenda amamentação exclusiva até os 6 meses e complementar até os 2 anos ou mais. Respeite o seu ritmo e o do seu bebê.`,
  },
  {
    id: "18",
    title: "Sono compartilhado: riscos e alternativas",
    description: "Entenda o cama compartilhada e como dormir perto do bebê com segurança",
    type: "article",
    duration: "6 min",
    category: "Sono",
    ageRange: "0-12 meses",
    content: `## O que é o sono compartilhado?

Sono compartilhado pode significar coisas diferentes:

**Cama compartilhada (bed-sharing):** Bebê dorme na mesma cama que os pais.

**Quarto compartilhado (room-sharing):** Bebê dorme no próprio berço, mas no quarto dos pais.

A Sociedade Brasileira de Pediatria e a Academia Americana de Pediatria **recomendam o quarto compartilhado** e **não recomendam a cama compartilhada** nos primeiros 12 meses.

### Riscos da cama compartilhada

A cama compartilhada está associada a riscos aumentados de:

- **Sufocamento** por travesseiros, cobertores ou corpo do adulto
- **Queda** da cama
- **Superaquecimento**
- **SMSI** (Síndrome da Morte Súbita Infantil)

### Fatores que aumentam o risco

⚠️ Pais fumantes (mesmo que não fumem no quarto)
⚠️ Uso de álcool, drogas ou medicamentos sedativos
⚠️ Bebê prematuro ou com baixo peso
⚠️ Superfície macia (sofá, poltrona, cama d'água)
⚠️ Cobertores pesados ou muitos travesseiros

### Alternativas seguras

**Berço acoplado (side-car)** 🛏️
O berço fica junto à cama dos pais, com uma lateral aberta. O bebê está perto, mas em superfície própria e segura. É a melhor alternativa para quem quer proximidade.

**Moisés ou berço no quarto** 🌙
Coloque o berço ao lado da sua cama. Você ouve o bebê respirar, pode acalmar com a mão e amamentar facilmente.

**Mini-berço portátil** 🧳
Prático para viagens ou quartos pequenos. Certifique-se de que atende às normas de segurança do INMETRO.

### Se mesmo assim optar pela cama compartilhada

Embora não seja recomendado, se você optar por essa prática:

- Use colchão **firme** e reto (nunca sofá ou poltrona)
- Remova **todos** os travesseiros e cobertores pesados
- Bebê deve dormir de **barriga para cima**
- Cabelo comprido deve ser **preso**
- Nenhum outro filho ou animal na cama
- Nunca se o adulto estiver sob efeito de álcool, drogas ou medicamentos

### O quarto compartilhado funciona

Estudos mostram que o quarto compartilhado (sem cama compartilhada) reduz o risco de SMSI em até **50%** e facilita a amamentação noturna.

> **Recomendação:** A SBP recomenda que o bebê durma no quarto dos pais, em berço próprio, pelo menos até os 6 meses — idealmente até 1 ano.`,
  },
  {
    id: "19",
    title: "Desmame noturno: quando e como",
    description: "Guia prático para eliminar mamadas da madrugada",
    type: "article",
    duration: "5 min",
    category: "Alimentação",
    ageRange: "6-12 meses",
    content: `## O bebê realmente precisa mamar à noite?

A partir dos **6 meses**, a maioria dos bebês saudáveis e com ganho de peso adequado consegue passar a noite sem mamar. Mas isso não significa que todos estejam prontos — e tudo bem.

### Sinais de que o bebê está pronto

- Tem mais de 6 meses e bom ganho de peso
- Come bem durante o dia (leite + alimentação complementar)
- As mamadas noturnas são curtas e mais por hábito que por fome
- Consegue se acalmar sem o peito em outras situações

### Quando NÃO fazer o desmame noturno

❌ Bebê com menos de 6 meses
❌ Bebê prematuro ou com baixo ganho de peso
❌ Durante uma regressão de sono ou doença
❌ Em momentos de grande mudança (mudança de casa, volta ao trabalho)
❌ Sem orientação do pediatra

### Método gradual (recomendado)

**Semana 1-2: Reduza o tempo**
Se o bebê mama por 15 minutos, reduza para 12, depois 10, depois 8... até chegar a 3-4 minutos.

**Semana 2-3: Aumente o intervalo**
Se o bebê acorda às 1h, 3h e 5h, comece eliminando a mamada do meio. Quando acordar, ofereça conforto sem o peito.

**Semana 3-4: Substitua o conforto**
No lugar do peito, ofereça:
- Água no copinho
- Carinho e shushing
- Tapinhas no bumbum
- Presença calma ao lado do berço

### Método do parceiro

Uma estratégia eficaz: por uma semana, o **parceiro** assume os despertares noturnos. Sem o cheiro do leite, o bebê tende a parar de pedir mais rapidamente.

### O que esperar

- **Dias 1-3:** Pode haver protesto. É normal.
- **Dias 4-7:** O bebê começa a se adaptar.
- **Dias 7-14:** A nova rotina se estabelece.

Nem todas as noites serão lineares. Pode haver retrocessos, especialmente se o bebê ficar doente. Seja flexível, mas mantenha a direção.

### Cuidados com a mãe

Se estiver amamentando, a redução das mamadas noturnas pode causar:
- Ingurgitamento nos primeiros dias (ordenhe o suficiente para aliviar)
- Possível redução da produção de leite
- Emoções intensas — é normal sentir culpa ou saudade

> **Dica:** Registre o progresso na Rotina do Doutor Soneca. Ver a evolução em dados concretos ajuda a manter a motivação nos dias difíceis.`,
  },
  {
    id: "20",
    title: "Rituais de ninar pelo mundo",
    description: "Como diferentes culturas colocam os bebês para dormir",
    type: "article",
    duration: "4 min",
    category: "Rotina",
    ageRange: "Todos",
    content: `## Cada cultura tem sua sabedoria

Não existe uma única forma "certa" de colocar um bebê para dormir. Ao redor do mundo, famílias usam rituais diferentes — e todos funcionam dentro do seu contexto. Conhecer essas tradições pode trazer novas ideias e, principalmente, **alívio** para quem acha que está fazendo errado.

### Japão: o sono coletivo 🇯🇵

No Japão, é comum a prática do **"kawanoji"** — a família inteira dorme junta no futón, no chão. O bebê fica entre os pais, formando o ideograma de "rio" (川). Dormir junto é visto como parte do vínculo familiar, e as crianças costumam dormir com os pais até os 6-7 anos.

### Escandinávia: sono ao ar livre 🇸🇪🇳🇴🇫🇮

Na Suécia, Noruega e Finlândia, os pais deixam os bebês cochilarem **ao ar livre** no carrinho, mesmo no inverno (com agasalho adequado). Acredita-se que o ar fresco melhora a qualidade do sono e fortalece o sistema imunológico. Os cochilos ao ar livre podem durar de 1 a 3 horas.

### Bali: sem tocar o chão 🇮🇩

Na cultura balinesa, o bebê **não toca o chão** nos primeiros 105 dias de vida. Ele é carregado o tempo todo — por pais, avós, tios. Dorme no colo, na tipoia, sempre em contato humano. A cerimônia de "tocar o chão" marca um rito de passagem importante.

### Quênia: cantar e embalar 🇰🇪

Em muitas comunidades do Quênia, as mães cantam canções específicas para ninar, passadas de geração em geração. O ritmo da canção é lento e repetitivo, similar a uma batida cardíaca. O bebê é embalado no colo ou nas costas com um tecido chamado **kanga**.

### Brasil: a rede de dormir 🇧🇷

No Norte e Nordeste do Brasil, a **rede** é o berço natural. O balanço suave e o "abraço" do tecido simulam a sensação do útero. Muitas mães relatam que o bebê dorme mais rápido e por mais tempo na rede do que no berço convencional.

### O que podemos aprender

| Cultura | Lição para nós |
|---------|---------------|
| Japão | Proximidade gera segurança |
| Escandinávia | Ar fresco e natureza ajudam |
| Bali | Contato humano é essencial |
| Quênia | A voz da mãe/pai acalma |
| Brasil | O balanço imita o útero |

### O ponto em comum

Apesar das diferenças enormes, **todos os rituais compartilham algo**: presença, repetição e afeto. Não importa se é no futón, na rede ou no berço — o que embala o bebê para dormir é o amor.

> **Reflexão:** Não existe método perfeito. O melhor ritual é aquele que funciona para a **sua** família. Se precisar de ajuda para encontrar o seu, converse com o Doutor Soneca.`,
  },
];
