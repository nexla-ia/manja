-- ================================================
-- MANJA.AI — Schema Supabase
-- Execute no SQL Editor do seu projeto Supabase
-- ================================================

-- Perfis (extensão do auth.users)
CREATE TABLE public.profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome                  TEXT,
  plano                 TEXT DEFAULT 'free' CHECK (plano IN ('free', 'pro', 'admin')),
  geracoes_mes          INTEGER DEFAULT 0,
  geracoes_reset_em     TIMESTAMPTZ DEFAULT NOW(),
  stripe_customer_id    TEXT,
  stripe_subscription_id TEXT,
  xp_total              INTEGER DEFAULT 0,
  nivel                 INTEGER DEFAULT 1,
  streak_dias           INTEGER DEFAULT 0,
  ultimo_acesso         DATE,
  criado_em             TIMESTAMPTZ DEFAULT NOW()
);

-- Chats
CREATE TABLE public.chats (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  titulo        TEXT DEFAULT 'Novo chat',
  tipo_ultimo   TEXT CHECK (tipo_ultimo IN ('apresentacao','trabalho','prova','resumo','plano','edital')),
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Mensagens
CREATE TABLE public.messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id      UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  role         TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content      TEXT NOT NULL,
  arquivo_url  TEXT,
  arquivo_tipo TEXT CHECK (arquivo_tipo IN ('pptx', 'docx', 'pdf')),
  criado_em    TIMESTAMPTZ DEFAULT NOW()
);

-- Arquivos gerados
CREATE TABLE public.files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chat_id       UUID REFERENCES public.chats(id) ON DELETE SET NULL,
  titulo        TEXT,
  tipo          TEXT NOT NULL,
  url           TEXT NOT NULL,
  tamanho_bytes INTEGER,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- XP Events
CREATE TABLE public.xp_events (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pontos    INTEGER NOT NULL,
  motivo    TEXT NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE public.achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tipo            TEXT NOT NULL,
  desbloqueado_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tipo)
);

-- ================================================
-- RLS (Row Level Security)
-- ================================================

ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile"
  ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users manage own chats"
  ON public.chats FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own messages"
  ON public.messages FOR ALL USING (
    auth.uid() = (SELECT user_id FROM public.chats WHERE id = chat_id)
  );

CREATE POLICY "Users manage own files"
  ON public.files FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own xp"
  ON public.xp_events FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own achievements"
  ON public.achievements FOR ALL USING (auth.uid() = user_id);

-- ================================================
-- Trigger: criar perfil ao registrar usuário
-- ================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- Trigger: resetar gerações mensalmente
-- ================================================

CREATE OR REPLACE FUNCTION public.reset_geracoes_mensais()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET geracoes_mes = 0, geracoes_reset_em = NOW()
  WHERE DATE_TRUNC('month', geracoes_reset_em) < DATE_TRUNC('month', NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
