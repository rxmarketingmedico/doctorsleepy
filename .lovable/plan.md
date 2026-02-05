

# Doutor Soneca - Plano de Implementação

## Visão Geral
Aplicativo completo de assistência ao sono infantil para pais de primeira viagem, com IA real, avatar animado Lottie, e backend completo com autenticação e persistência de dados. **Modelo 100% pago (R$ 49/mês)** com acesso completo a todos os recursos.

---

## 🎨 Design System
- **Paleta**: Tons pastel suaves (azuis claros, verdes menta, lavanda)
- **Tipografia**: Amigável e legível (Inter/Nunito)
- **Componentes**: Cantos arredondados, botões grandes, espaçamento generoso
- **Acessibilidade**: Contraste adequado, textos alternativos, suporte a leitores de tela
- **Dark Mode**: Suporte completo para uso noturno

---

## 1. Onboarding
- Tela de boas-vindas com apresentação do app
- Apresentação dos benefícios e valor do app
- Tela de pagamento/assinatura (R$ 49/mês)
- Após pagamento: perguntas passo a passo (idade do bebê, local de sono, uso de chupeta, mamadas noturnas)
- Termo de consentimento claro
- Progress indicator visual
- Botões grandes para fácil navegação

## 2. Home - Modo Emergência
- Título "Modo Emergência" com visual calmo
- 5 botões grandes e coloridos:
  - "Pode ser fome?"
  - "Pode ser sono?"
  - "Pode ser desconforto?"
  - "Choro inconsolável"
  - "Acordou de madrugada"
- Navegação inferior: Rotina, Tradutor de Choro, Biblioteca, Perfil
- Avatar animado presente na tela

## 3. Chat de Orientação (IA Real)
- Chat com balões de fala estilizados
- Avatar animado com feedback visual
- Disclaimer médico no topo
- Perguntas contextuais com IA (Lovable AI)
- Sugestões rápidas de resposta
- Botão de áudio para ouvir orientações
- Acesso ilimitado para todos os assinantes

## 4. Avatar Animado (Lottie)
- Personagem com fisionomia neutra e tranquila
- Animações suaves de feedback:
  - Pensando, respondendo, ouvindo
  - Expressões contextuais
- Presente em todas as seções
- Voz sintetizada disponível para todos

## 5. Rotina Inteligente
- Dashboard completo com cards visuais
- Gráficos de janelas de sono
- Contador de despertares e mamadas
- Botão "Registrar sono/mamada"
- Alertas inteligentes com previsões
- Histórico visual da semana

## 6. Tradutor de Choro
- Botão grande para gravar áudio
- Visualização de gravação em andamento
- Barras de probabilidade: fome, fralda, emocional, dor
- Explicação de cada categoria
- Sugestões de ação
- Traduções ilimitadas
- Aviso médico obrigatório

## 7. Biblioteca de Conteúdos
- Grade de cards com textos e áudios curtos
- Título, tempo de leitura/escuta, ícone
- Filtro por idade do bebê
- Busca por palavra-chave
- Marcação de favoritos
- Acesso completo a todo conteúdo

## 8. Perfil e Configurações
- Dados do bebê editáveis
- Configurações de notificações e alertas personalizados
- Gestão de assinatura (cancelar, atualizar pagamento)
- Histórico de uso

---

## 🔧 Infraestrutura Técnica

### Backend (Lovable Cloud + Supabase)
- Autenticação de usuários
- Banco de dados para perfis, registros de sono, histórico
- Edge functions para integração com IA
- Armazenamento de áudios do tradutor de choro

### Pagamentos (Stripe)
- Assinatura mensal de R$ 49/mês
- Gestão de pagamentos e cancelamentos
- Período de trial (se desejado)

### Integrações
- **Lovable AI**: Chat inteligente e análise contextual
- **Animações Lottie**: Avatar em todas as telas
- **Text-to-Speech**: Voz do avatar

