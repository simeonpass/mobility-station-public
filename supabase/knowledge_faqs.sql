-- Knowledge FAQs: anonymised Q&A published from Lovable after human review.
-- Public site reads published rows only (see public_site_grants.sql).
-- NEVER store customer names, phone numbers, emails, addresses or job IDs here.

CREATE TABLE IF NOT EXISTS public.knowledge_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  question text NOT NULL,
  answer text NOT NULL,
  answer_html text,
  category text NOT NULL,
  related_href text,
  related_label text,
  source text NOT NULL DEFAULT 'editorial'
    CHECK (source IN ('editorial', 'call_summary')),
  is_published boolean NOT NULL DEFAULT false,
  reviewed_at timestamptz,
  published_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS knowledge_faqs_published_idx
  ON public.knowledge_faqs (is_published, published_at DESC)
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS knowledge_faqs_category_idx
  ON public.knowledge_faqs (category)
  WHERE is_published = true;

COMMENT ON TABLE public.knowledge_faqs IS
  'Public FAQ answers derived from editorial copy or anonymised call themes. No PII.';

-- Example RLS (adjust if your project already enables RLS differently):
-- ALTER TABLE public.knowledge_faqs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "public_site_read_published_knowledge_faqs"
--   ON public.knowledge_faqs FOR SELECT TO public_site
--   USING (is_published = true);
