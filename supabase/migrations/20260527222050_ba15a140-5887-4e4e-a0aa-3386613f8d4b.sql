CREATE TYPE public.quote_status AS ENUM ('pending','accepted','rejected','paid','completed');

CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dentist_id UUID NOT NULL,
  technician_slug TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status public.quote_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotes TO authenticated;
GRANT ALL ON public.quotes TO service_role;

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dentists view own quotes" ON public.quotes
  FOR SELECT TO authenticated USING (auth.uid() = dentist_id);

CREATE POLICY "Dentists insert own quotes" ON public.quotes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = dentist_id);

CREATE POLICY "Dentists update own quotes" ON public.quotes
  FOR UPDATE TO authenticated USING (auth.uid() = dentist_id);

CREATE INDEX idx_quotes_dentist ON public.quotes(dentist_id, created_at DESC);