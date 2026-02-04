-- =====================================================
-- CLIPPR PLATFORM - Schema Multi-Barbearia v2.0
-- =====================================================

-- Desabilitar temporariamente RLS para executar
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 1. TABELA DE PLANOS DE ASSINATURA
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  max_barbers INTEGER NOT NULL DEFAULT 1,
  max_services INTEGER NOT NULL DEFAULT 10,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir planos
INSERT INTO public.subscription_plans (name, slug, description, price_monthly, price_yearly, max_barbers, max_services, features) VALUES
  ('Starter', 'starter', 'Ideal para barbeiros autônomos', 49.00, 470.40, 1, 10, '["Agendamento online", "Perfil da barbearia", "Notificações push"]'),
  ('Pro', 'pro', 'Perfeito para barbearias em crescimento', 99.00, 1009.80, 5, -1, '["Tudo do Starter", "Programa de fidelidade", "Relatórios básicos", "Múltiplos barbeiros"]'),
  ('Business', 'business', 'Para redes e franquias', 199.00, 2029.80, -1, -1, '["Tudo do Pro", "Multi-filiais", "API de integração", "Relatórios avançados", "Suporte prioritário"]')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 2. TABELA DE BARBEARIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.barbershops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  
  -- Endereço
  address TEXT,
  address_number TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Contato
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  instagram TEXT,
  
  -- Horário de funcionamento (JSON)
  opening_hours JSONB DEFAULT '{
    "monday": {"open": "09:00", "close": "19:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "19:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "19:00", "closed": false},
    "thursday": {"open": "09:00", "close": "19:00", "closed": false},
    "friday": {"open": "09:00", "close": "19:00", "closed": false},
    "saturday": {"open": "09:00", "close": "17:00", "closed": false},
    "sunday": {"open": null, "close": null, "closed": true}
  }'::jsonb,
  
  -- Assinatura
  subscription_plan_id UUID REFERENCES public.subscription_plans(id),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'cancelled', 'expired')),
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Métricas
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ATUALIZAR TABELA DE BARBEIROS
-- =====================================================
ALTER TABLE public.barbers 
  ADD COLUMN IF NOT EXISTS barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 50.00,
  ADD COLUMN IF NOT EXISTS is_owner BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- =====================================================
-- 4. ATUALIZAR TABELA DE SERVIÇOS
-- =====================================================
ALTER TABLE public.services 
  ADD COLUMN IF NOT EXISTS barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE;

-- =====================================================
-- 5. ATUALIZAR TABELA DE AGENDAMENTOS
-- =====================================================
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('cash', 'pix', 'credit_card', 'debit_card', null)),
  ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2);

-- =====================================================
-- 6. TABELA DE AVALIAÇÕES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE NOT NULL,
  barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, booking_id)
);

-- =====================================================
-- 7. TABELA DE FIDELIDADE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE NOT NULL,
  points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  total_visits INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_visit_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, barbershop_id)
);

-- =====================================================
-- 8. TABELA DE FAVORITOS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, barbershop_id)
);

-- =====================================================
-- 9. HABILITAR RLS
-- =====================================================
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbershops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10. POLÍTICAS DE SEGURANÇA
-- =====================================================

-- Planos: todos podem ver
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
  FOR SELECT USING (is_active = true);

-- Barbearias: todos podem ver ativas
CREATE POLICY "Anyone can view active barbershops" ON public.barbershops
  FOR SELECT USING (is_active = true);

-- Donos podem gerenciar suas barbearias
CREATE POLICY "Owners can manage their barbershops" ON public.barbershops
  FOR ALL USING (auth.uid() = owner_id);

-- Reviews: todos podem ver
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

-- Usuários podem criar reviews
CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuários podem editar suas reviews
CREATE POLICY "Users can update their reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Fidelidade: usuários veem suas pontuações
CREATE POLICY "Users can view their loyalty points" ON public.loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

-- Favoritos: usuários gerenciam seus favoritos
CREATE POLICY "Users can manage their favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- Barbeiros: visíveis se a barbearia está ativa
CREATE POLICY "Barbers visible if barbershop active" ON public.barbers
  FOR SELECT USING (
    barbershop_id IS NULL OR 
    EXISTS (SELECT 1 FROM public.barbershops WHERE id = barbershop_id AND is_active = true)
  );

-- Serviços: visíveis se a barbearia está ativa
CREATE POLICY "Services visible if barbershop active" ON public.services
  FOR SELECT USING (
    barbershop_id IS NULL OR 
    EXISTS (SELECT 1 FROM public.barbershops WHERE id = barbershop_id AND is_active = true)
  );

-- =====================================================
-- 11. FUNÇÕES ÚTEIS
-- =====================================================

-- Função para atualizar rating da barbearia
CREATE OR REPLACE FUNCTION update_barbershop_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.barbershops
  SET 
    rating = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE barbershop_id = NEW.barbershop_id),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE barbershop_id = NEW.barbershop_id)
  WHERE id = NEW.barbershop_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar rating após review
DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_barbershop_rating();

-- Função para gerar slug único
CREATE OR REPLACE FUNCTION generate_unique_slug(base_name TEXT, table_name TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
  counter INTEGER := 0;
  final_slug TEXT;
BEGIN
  slug := lower(regexp_replace(base_name, '[^a-zA-Z0-9]', '-', 'g'));
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  
  final_slug := slug;
  
  WHILE EXISTS (SELECT 1 FROM public.barbershops WHERE barbershops.slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 12. ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_barbershops_location ON public.barbershops(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_barbershops_city ON public.barbershops(city);
CREATE INDEX IF NOT EXISTS idx_barbershops_slug ON public.barbershops(slug);
CREATE INDEX IF NOT EXISTS idx_barbers_barbershop ON public.barbers(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_services_barbershop ON public.services(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_bookings_barbershop ON public.bookings(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_reviews_barbershop ON public.reviews(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
