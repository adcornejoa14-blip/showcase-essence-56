
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL UNIQUE REFERENCES public.quotes(id) ON DELETE CASCADE,
  technician_slug text NOT NULL,
  dentist_id uuid NOT NULL,
  dentist_name text NOT NULL DEFAULT '',
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  quality_rating integer NOT NULL CHECK (quality_rating BETWEEN 1 AND 5),
  communication_rating integer NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
  delivery_rating integer NOT NULL CHECK (delivery_rating BETWEEN 1 AND 5),
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_technician ON public.reviews(technician_slug, created_at DESC);

GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are public"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Dentists insert reviews for own completed quotes"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (
  dentist_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.quotes q
    WHERE q.id = reviews.quote_id
      AND q.dentist_id = auth.uid()
      AND q.status = 'completed'
  )
);

-- Aggregated ratings view
CREATE OR REPLACE VIEW public.technician_ratings AS
SELECT
  technician_slug,
  ROUND(AVG(rating)::numeric, 2)              AS avg_rating,
  ROUND(AVG(quality_rating)::numeric, 2)      AS avg_quality,
  ROUND(AVG(communication_rating)::numeric, 2) AS avg_communication,
  ROUND(AVG(delivery_rating)::numeric, 2)     AS avg_delivery,
  COUNT(*)::int                               AS review_count
FROM public.reviews
GROUP BY technician_slug;

GRANT SELECT ON public.technician_ratings TO anon, authenticated;
