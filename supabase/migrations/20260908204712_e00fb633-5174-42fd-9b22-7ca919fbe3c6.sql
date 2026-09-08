
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin','cliente');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  nome TEXT,
  telefone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, telefone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'telefone')
  ON CONFLICT (id) DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'cliente') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- VEICULOS
CREATE TABLE public.veiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  versao TEXT,
  ano INTEGER NOT NULL,
  ano_modelo INTEGER,
  km INTEGER NOT NULL DEFAULT 0,
  preco NUMERIC(12,2) NOT NULL,
  preco_promocional NUMERIC(12,2),
  combustivel TEXT NOT NULL DEFAULT 'Flex' CHECK (combustivel IN ('Flex','Gasolina','Etanol','Diesel','Híbrido','Elétrico','GNV')),
  cambio TEXT NOT NULL DEFAULT 'Manual' CHECK (cambio IN ('Manual','Automático','Automatizado','CVT')),
  cor TEXT,
  carroceria TEXT NOT NULL DEFAULT 'Hatch' CHECK (carroceria IN ('Hatch','Sedã','SUV','Picape','Minivan','Utilitário','Cupê','Conversível')),
  portas INTEGER DEFAULT 4,
  placa TEXT,
  descricao TEXT,
  opcionais TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel','reservado','vendido')),
  destaque BOOLEAN NOT NULL DEFAULT false,
  publicado BOOLEAN NOT NULL DEFAULT true,
  localizacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.veiculos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.veiculos TO authenticated;
GRANT ALL ON public.veiculos TO service_role;
ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "veiculos_public_read" ON public.veiculos FOR SELECT TO anon, authenticated USING (publicado = true OR public.is_admin());
CREATE POLICY "veiculos_admin_write" ON public.veiculos FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE INDEX idx_veiculos_marca ON public.veiculos (marca);
CREATE INDEX idx_veiculos_preco ON public.veiculos (preco);
CREATE INDEX idx_veiculos_ano ON public.veiculos (ano);
CREATE INDEX idx_veiculos_status ON public.veiculos (status);
CREATE INDEX idx_veiculos_publicado ON public.veiculos (publicado);
CREATE TRIGGER veiculos_touch BEFORE UPDATE ON public.veiculos FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.veiculo_fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  veiculo_id UUID NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  capa BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.veiculo_fotos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.veiculo_fotos TO authenticated;
GRANT ALL ON public.veiculo_fotos TO service_role;
ALTER TABLE public.veiculo_fotos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fotos_public_read" ON public.veiculo_fotos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "fotos_admin_write" ON public.veiculo_fotos FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE INDEX idx_fotos_veiculo ON public.veiculo_fotos (veiculo_id);

-- FAVORITOS
CREATE TABLE public.favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  veiculo_id UUID NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, veiculo_id)
);
GRANT SELECT, INSERT, DELETE ON public.favoritos TO authenticated;
GRANT ALL ON public.favoritos TO service_role;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favoritos_own" ON public.favoritos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_favoritos_user ON public.favoritos (user_id);

-- LEADS
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  mensagem TEXT,
  origem TEXT NOT NULL DEFAULT 'veiculo',
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','em_atendimento','concluido','descartado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_insert_any" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "leads_select" ON public.leads FOR SELECT TO authenticated USING (public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "leads_admin_manage" ON public.leads FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "leads_admin_delete" ON public.leads FOR DELETE TO authenticated USING (public.is_admin());
CREATE INDEX idx_leads_status ON public.leads (status);
CREATE INDEX idx_leads_user ON public.leads (user_id);

-- AVALIACOES
CREATE TABLE public.avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  versao TEXT,
  ano INTEGER NOT NULL,
  km INTEGER NOT NULL DEFAULT 0,
  placa TEXT,
  estado TEXT,
  observacoes TEXT,
  fotos TEXT[] NOT NULL DEFAULT '{}',
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','em_analise','proposta_enviada','concluido','descartado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.avaliacoes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avaliacoes TO authenticated;
GRANT ALL ON public.avaliacoes TO service_role;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "avaliacoes_insert_any" ON public.avaliacoes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "avaliacoes_select" ON public.avaliacoes FOR SELECT TO authenticated USING (public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "avaliacoes_admin_update" ON public.avaliacoes FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "avaliacoes_admin_delete" ON public.avaliacoes FOR DELETE TO authenticated USING (public.is_admin());

-- CONTATOS
CREATE TABLE public.contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT NOT NULL,
  assunto TEXT,
  mensagem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','respondido','arquivado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contatos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contatos TO authenticated;
GRANT ALL ON public.contatos TO service_role;
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contatos_insert_any" ON public.contatos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contatos_select" ON public.contatos FOR SELECT TO authenticated USING (public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "contatos_admin_update" ON public.contatos FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "contatos_admin_delete" ON public.contatos FOR DELETE TO authenticated USING (public.is_admin());

-- FINANCIAMENTOS
CREATE TABLE public.financiamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  cpf TEXT,
  valor_veiculo NUMERIC(12,2) NOT NULL,
  entrada NUMERIC(12,2) NOT NULL DEFAULT 0,
  parcelas INTEGER NOT NULL DEFAULT 48,
  taxa_juros NUMERIC(6,3) NOT NULL DEFAULT 1.49,
  parcela_estimada NUMERIC(12,2),
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','em_analise','aprovado','recusado','concluido')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.financiamentos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financiamentos TO authenticated;
GRANT ALL ON public.financiamentos TO service_role;
ALTER TABLE public.financiamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "financiamentos_insert_any" ON public.financiamentos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "financiamentos_select" ON public.financiamentos FOR SELECT TO authenticated USING (public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "financiamentos_admin_update" ON public.financiamentos FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "financiamentos_admin_delete" ON public.financiamentos FOR DELETE TO authenticated USING (public.is_admin());

-- CONFIGURACOES
CREATE TABLE public.configuracoes (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  nome TEXT NOT NULL DEFAULT 'AUTO SHOP',
  logo_url TEXT,
  telefone TEXT NOT NULL DEFAULT '(14) 3000-0000',
  whatsapp TEXT NOT NULL DEFAULT '5514999999999',
  email TEXT NOT NULL DEFAULT 'contato@autoshop.com.br',
  endereco TEXT NOT NULL DEFAULT 'Av. Brasil, 1000 - Centro, Bastos - SP',
  instagram TEXT DEFAULT 'https://instagram.com/autoshop',
  horario TEXT NOT NULL DEFAULT 'Seg a Sex: 8h às 18h | Sáb: 8h às 13h',
  sobre_texto TEXT NOT NULL DEFAULT 'A AUTO SHOP é uma concessionária de seminovos com curadoria rigorosa: cada veículo passa por vistoria completa antes de entrar no nosso pátio.',
  taxa_juros_padrao NUMERIC(6,3) NOT NULL DEFAULT 1.49,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.configuracoes TO anon;
GRANT SELECT, INSERT, UPDATE ON public.configuracoes TO authenticated;
GRANT ALL ON public.configuracoes TO service_role;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config_public_read" ON public.configuracoes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "config_admin_write" ON public.configuracoes FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
INSERT INTO public.configuracoes (id) VALUES (1);

-- SEED VEICULOS
INSERT INTO public.veiculos (id, marca, modelo, versao, ano, ano_modelo, km, preco, preco_promocional, combustivel, cambio, cor, carroceria, portas, descricao, opcionais, status, destaque, publicado, localizacao) VALUES
('11111111-1111-1111-1111-111111111111','Jeep','Compass','Longitude 1.3 T270 Turbo',2022,2022,38500,139900.00,134900.00,'Flex','Automático','Prata','SUV',4,'SUV completo, único dono, revisões em concessionária e garantia de fábrica vigente.','{"Ar-condicionado digital","Central multimídia","Câmera de ré","Sensor de estacionamento","Bancos em couro","Piloto automático","Faróis full LED"}','disponivel',true,true,'Bastos - SP'),
('22222222-2222-2222-2222-222222222222','Volkswagen','Polo','Highline 200 TSI',2021,2022,42300,89900.00,NULL,'Flex','Automático','Branco','Hatch',4,'Hatch premium com motor TSI, econômico e muito bem conservado.','{"Ar-condicionado","Central multimídia","Câmera de ré","Rodas de liga leve","Controle de estabilidade"}','disponivel',true,true,'Bastos - SP'),
('33333333-3333-3333-3333-333333333333','Toyota','Hilux','SRV 2.8 Diesel 4x4',2020,2021,78900,239900.00,229900.00,'Diesel','Automático','Preto','Picape',4,'Picape robusta 4x4, pronta para trabalho e lazer, com manutenção em dia.','{"Tração 4x4","Ar-condicionado digital","Bancos em couro","Capota marítima","Central multimídia","Controle de descida"}','reservado',true,true,'Bastos - SP'),
('44444444-4444-4444-4444-444444444444','Hyundai','HB20','Comfort Plus 1.0',2019,2019,61200,58900.00,NULL,'Flex','Manual','Cinza','Hatch',4,'Compacto econômico, ideal para o dia a dia na cidade. Documentação em dia.','{"Ar-condicionado","Direção elétrica","Vidros elétricos","Trava elétrica","Airbag duplo"}','disponivel',false,true,'Bastos - SP');

INSERT INTO public.veiculo_fotos (veiculo_id, url, ordem, capa) VALUES
('11111111-1111-1111-1111-111111111111','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80',0,true),
('11111111-1111-1111-1111-111111111111','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80',1,false),
('22222222-2222-2222-2222-222222222222','https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',0,true),
('22222222-2222-2222-2222-222222222222','https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80',1,false),
('33333333-3333-3333-3333-333333333333','https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80',0,true),
('33333333-3333-3333-3333-333333333333','https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',1,false),
('44444444-4444-4444-4444-444444444444','https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80',0,true);
