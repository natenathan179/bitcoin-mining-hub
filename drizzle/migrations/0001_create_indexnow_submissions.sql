CREATE TABLE public.indexnow_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL DEFAULT 'all',
  source text NOT NULL DEFAULT 'admin',
  url_count integer NOT NULL DEFAULT 0,
  accepted integer NOT NULL DEFAULT 0,
  failed integer NOT NULL DEFAULT 0,
  message text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.indexnow_submissions TO authenticated;
GRANT ALL ON public.indexnow_submissions TO service_role;

ALTER TABLE public.indexnow_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read indexnow submissions"
ON public.indexnow_submissions FOR SELECT TO authenticated USING (true);

CREATE INDEX indexnow_submissions_created_at_idx ON public.indexnow_submissions (created_at DESC);