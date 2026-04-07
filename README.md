# Manja.ai

**Seu parceiro de estudos com IA** — plataforma SaaS que gera apresentações, trabalhos, provas, resumos, planos de estudo e análise de editais usando Claude Sonnet 4.6.

---

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth + DB:** Supabase (Postgres + Auth + Storage)
- **IA:** Anthropic API (Claude Sonnet 4.6)
- **Pagamentos:** Stripe
- **Deploy:** Vercel (frontend) + Railway (FastAPI)

---

## Quickstart

### 1. Clone e instale

```bash
git clone https://github.com/seu-usuario/manja-ai
cd manja-ai
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
# Edite .env.local com seus valores reais
```

### 3. Configure o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase-schema.sql`
3. Em **Authentication → URL Configuration**, adicione:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/api/auth/callback`
4. Copie as chaves para `.env.local`

### 4. Rode em desenvolvimento

```bash
npm run dev
# Acesse http://localhost:3000
```

---

## Estrutura

```
manja-ai/
├── app/
│   ├── (auth)/           # Login e cadastro
│   ├── (app)/            # Dashboard, chat, histórico
│   └── api/              # Rotas API (chat, webhook, auth)
├── components/
│   ├── chat/             # ChatInput, MessageBubble, FilePreview
│   └── layout/           # Sidebar
├── lib/
│   ├── anthropic/        # Client + prompts + parser
│   ├── supabase/         # Client browser e server
│   └── stripe/           # Planos e webhooks
├── hooks/                # useChat, useAuth
├── types/                # TypeScript types
└── supabase-schema.sql   # Schema completo do banco
```

---

## Planos

| Feature              | Free       | Pro (R$49/mês)  |
|----------------------|------------|-----------------|
| Gerações/mês         | 5          | Ilimitadas      |
| Tipos de material    | Resumo, Prova | Todos (PPTX, DOCX, PDF) |
| Histórico de chats   | 5 chats    | Completo        |
| Análise de edital    | ❌         | ✅              |

---

## Configurar Stripe (pagamentos)

1. Crie conta em [stripe.com](https://stripe.com)
2. Crie um produto "Manja Pro" com preço recorrente de R$49/mês
3. Copie o `Price ID` para `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`
4. Configure webhook: `https://seu-dominio.com/api/webhook/stripe`
   - Eventos: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## Roadmap

- [x] MVP: chat + agente + download de texto
- [ ] Fase 2: FastAPI gerando PPTX/DOCX/PDF reais
- [ ] Fase 2: Stripe integrado
- [ ] Fase 3: Sistema de XP e gamificação
- [ ] Fase 4: App mobile
