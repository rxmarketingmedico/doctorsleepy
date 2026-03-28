# 🌙 Dr. Sleepy — Infant Sleep Assistant

A full-stack AI-powered infant sleep assistant for first-time parents. Dr. Sleepy provides personalized guidance on baby sleep, feeding, crying analysis, and daily routines through an empathetic AI pediatrician persona.

**Live URL**: [https://doctorsleepy.lovable.app](https://doctorsleepy.lovable.app)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Edge Functions (Backend)](#edge-functions-backend)
- [Database Schema](#database-schema)
- [Integrations](#integrations)
- [Authentication & Authorization](#authentication--authorization)
- [Getting Started](#getting-started)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Emergency Mode** | Quick-access buttons for common baby emergencies (hunger, sleep, discomfort, inconsolable crying, night waking) |
| **AI Chat** | Real-time streaming chat with Dr. Sleepy AI — context-aware, uses baby profile + sleep logs for personalized advice |
| **Cry Translator** | Audio recording + AI analysis that classifies crying into categories (hunger, diaper, emotional, pain) with confidence bars |
| **Smart Routine** | Dashboard with sleep/nap/feeding/diaper logs, weekly charts, wake window tracking, and smart alerts |
| **Content Library** | 20+ educational articles on infant sleep rendered via `react-markdown` in a slide-out panel |
| **Audio Library** | Curated lullabies and white noise with Jamendo search integration |
| **Sales Page** | High-conversion landing page with social proof, testimonials, FAQ, and Hotmart checkout integration |
| **Admin Panel** | User management, audio library management, purchase logs, and support ticket system |
| **Support Tickets** | In-app ticket system with real-time chat between users and admins |
| **Dark Mode** | Full dark mode support optimized for nighttime use |

---

## 🛠 Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** + **shadcn/ui** — design system
- **Framer Motion** — animations
- **Lottie React** — animated avatar
- **React Router v6** — routing with lazy-loaded pages
- **TanStack React Query** — data fetching & caching
- **Recharts** — charts & data visualization

### Backend (Lovable Cloud)
- **Authentication** — email/password with email confirmation
- **PostgreSQL Database** — profiles, chat history, sleep logs, subscriptions
- **Edge Functions** — AI chat, cry analysis, webhooks, avatar generation
- **Storage** — logo and media assets
- **Row-Level Security (RLS)** — data isolation per user

### External Integrations
- **Hotmart** — payment processing & subscription management (webhooks)
- **Resend** — transactional emails (welcome email, admin notifications)
- **Meta Pixel** — conversion tracking
- **Jamendo API** — music search for audio library
- **Lovable AI Gateway** — AI chat (Gemini 3 Flash) and cry analysis

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Root component with routing
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
├── hooks/
│   ├── useAuth.tsx            # Auth state management
│   ├── useProfile.tsx         # User profile data
│   ├── useSubscription.tsx    # Subscription status
│   ├── useAdminRole.tsx       # Admin role verification
│   ├── useDynamicSuggestions  # Context-aware chat suggestions
│   ├── useScrollReveal.tsx    # Scroll animation hook
│   └── useTheme.tsx           # Dark/light mode
├── pages/
│   ├── Home.tsx               # Emergency mode (main dashboard)
│   ├── Chat.tsx               # AI chat with Dr. Sleepy
│   ├── Routine.tsx            # Sleep/feeding routine tracker
│   ├── CryTranslator.tsx      # Cry analysis tool
│   ├── Library.tsx            # Educational articles
│   ├── AudioLibrary.tsx       # Lullabies & white noise
│   ├── Profile.tsx            # User profile view
│   ├── EditProfile.tsx        # Edit baby/parent info
│   ├── Auth.tsx               # Login/signup
│   ├── Onboarding.tsx         # Post-purchase setup wizard
│   ├── SalesPage.tsx          # Landing/sales page
│   ├── Help.tsx               # Support tickets list
│   ├── TicketChat.tsx         # Individual ticket chat
│   └── admin/
│       ├── AdminLayout.tsx    # Admin shell with sidebar
│       ├── AdminDashboard.tsx # Stats & overview
│       ├── AdminUsers.tsx     # User management
│       ├── AdminAudios.tsx    # Audio library CRUD
│       ├── AdminPurchaseLogs  # Purchase history
│       └── AdminTickets.tsx   # Support tickets management
├── components/
│   ├── Avatar.tsx             # Dr. Sleepy avatar display
│   ├── AvatarAI.tsx           # Animated AI avatar
│   ├── BottomNav.tsx          # Mobile bottom navigation
│   ├── EmergencyButton.tsx    # Emergency mode buttons
│   ├── GuidedTutorial.tsx     # First-time user tutorial
│   ├── SubscriptionGate.tsx   # Paywall wrapper
│   ├── SubscriptionManager   # Subscription status UI
│   ├── ThemeToggle.tsx        # Dark/light mode toggle
│   ├── MetaPixel.tsx          # Meta Pixel tracking
│   ├── chat/
│   │   └── QuickReplies.tsx   # Quick reply suggestions
│   ├── audio/
│   │   └── JamendoSearch.tsx  # Music search component
│   └── sales/                 # Sales page sections
│       ├── SalesHero.tsx
│       ├── SalesPricingSection.tsx
│       ├── SalesTestimonialsSection.tsx
│       └── ...
├── data/
│   └── library-articles.ts   # Educational content data
└── integrations/
    └── supabase/
        ├── client.ts          # Auto-generated client
        └── types.ts           # Auto-generated types

supabase/
└── functions/
    ├── chat/                  # AI chat with streaming responses
    ├── analyze-cry/           # Cry audio analysis
    ├── hotmart-webhook/       # Payment webhook handler
    ├── save-assistant-message/ # Persist AI responses
    ├── generate-avatar/       # Avatar image generation
    ├── search-jamendo/        # Jamendo API proxy
    ├── meta-conversions/      # Meta Conversions API
    └── test-purchase-flow/    # Test webhook simulation
```

---

## 🗺 Pages & Routes

| Route | Access | Component | Description |
|-------|--------|-----------|-------------|
| `/vendas` | Public | `SalesPage` | Landing page with pricing & Hotmart checkout |
| `/auth` | Public (redirects if logged in) | `Auth` | Login & signup |
| `/onboarding` | Authenticated (pre-onboarding) | `Onboarding` | Step-by-step baby profile setup |
| `/` | Protected | `Home` | Emergency mode dashboard |
| `/chat` | Protected | `Chat` | AI chat with Dr. Sleepy |
| `/routine` | Protected | `Routine` | Sleep & feeding tracker |
| `/cry-translator` | Protected | `CryTranslator` | Cry analysis tool |
| `/library` | Protected | `Library` | Educational articles |
| `/audio-library` | Protected | `AudioLibrary` | Lullabies & sounds |
| `/profile` | Protected | `Profile` | User profile |
| `/profile/edit` | Protected | `EditProfile` | Edit profile |
| `/help` | Protected | `Help` | Support tickets |
| `/help/:ticketId` | Protected | `TicketChat` | Ticket conversation |
| `/admin` | Protected + Admin role | `AdminLayout` | Admin dashboard |
| `/admin/users` | Protected + Admin role | `AdminUsers` | User management |
| `/admin/audios` | Protected + Admin role | `AdminAudios` | Audio CRUD |
| `/admin/purchases` | Protected + Admin role | `AdminPurchaseLogs` | Purchase logs |
| `/admin/tickets` | Protected + Admin role | `AdminTickets` | Support tickets |

---

## ⚡ Edge Functions (Backend)

| Function | Purpose |
|----------|---------|
| `chat` | Streams AI responses via Lovable AI Gateway (Gemini 3 Flash). Builds context from user profile, chat history, and 7-day sleep logs. |
| `analyze-cry` | Analyzes cry audio recordings and returns probability breakdown by category. |
| `hotmart-webhook` | Processes Hotmart payment events (purchase, renewal, cancellation, plan change). Auto-creates user accounts, sends welcome emails via Resend, and notifies admin. |
| `save-assistant-message` | Persists AI assistant responses to `chat_messages` table after streaming completes. |
| `generate-avatar` | Generates custom avatar images. |
| `search-jamendo` | Proxies search requests to the Jamendo music API. |
| `meta-conversions` | Sends conversion events to Meta Conversions API. |
| `test-purchase-flow` | Simulates a Hotmart purchase for testing purposes. |

---

## 🗄 Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User & baby data (name, birth date, feeding type, sleep preferences, subscription info) |
| `chat_messages` | Chat history (role, content, context_type) |
| `sleep_logs` | Routine entries (sleep, nap, feeding, diaper, crying, play, bath) with start/end times |
| `audio_library` | Audio tracks (title, URL, category, duration, author) |
| `audio_plays` | Play tracking per user per audio |
| `favorites` | User-favorited content |
| `support_tickets` | Help tickets with status tracking |
| `ticket_messages` | Messages within support tickets |
| `user_roles` | Role-based access (`admin`, `moderator`, `user`) |
| `pending_activations` | Queued Hotmart activations for users not yet registered |
| `profiles_safe` | Read-only view of profiles (excludes sensitive fields) |

---

## 🔗 Integrations

### Hotmart (Payments)
- **Webhook URL**: `https://ytucoisaanzxgnjkfggg.supabase.co/functions/v1/hotmart-webhook`
- **Events handled**: `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`, `SUBSCRIPTION_CANCELLATION`, `SUBSCRIPTION_REACTIVATION`, `SWITCH_PLAN`, `SUBSCRIPTION_RENEWAL_CHARGE`
- **Flow**: Purchase → webhook → auto-create account → welcome email with login link → admin notification

### Resend (Emails)
- **From**: `Dr. Sleepy <noreply@doutorsoneca.com>`
- **Welcome email**: Sent on purchase with temporary password and login link
- **Admin notification**: Sent to `agenciadbsdigital@gmail.com` on every new purchase

### Meta Pixel
- Tracks page views and purchase conversions via both client-side pixel and server-side Conversions API

---

## 🔐 Authentication & Authorization

- **Auth method**: Email/password (email confirmation required)
- **Account creation**: Automatic via Hotmart webhook on purchase
- **Role system**: `user_roles` table with `has_role()` security definer function
- **RLS**: All tables protected with row-level security policies
- **Route protection**: `ProtectedRoute` wrapper checks auth → onboarding → subscription status
- **Admin access**: Verified via `user_roles` table (never client-side)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Environment Variables (auto-configured)
- `VITE_SUPABASE_URL` — Backend API URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Public API key
- `VITE_SUPABASE_PROJECT_ID` — Project identifier

### Edge Function Secrets
- `HOTMART_HOTTOK` — Hotmart webhook authentication token
- `RESEND_API_KEY` — Resend email service API key
- `META_ACCESS_TOKEN` — Meta Conversions API token
- `META_PIXEL_ID` — Meta Pixel ID
- `LOVABLE_API_KEY` — AI Gateway access key
- `JAMENDO_CLIENT_ID` — Jamendo music API key

---

## 📄 License

Private project. All rights reserved.
