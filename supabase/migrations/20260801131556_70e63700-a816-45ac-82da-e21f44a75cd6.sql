CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  symbol text NOT NULL,
  network text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  qr_image_url text NOT NULL DEFAULT '',
  instructions text NOT NULL DEFAULT '',
  confirmations integer NOT NULL DEFAULT 2,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payment_methods TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT ALL ON public.payment_methods TO service_role;

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active payment methods are publicly readable"
  ON public.payment_methods FOR SELECT
  USING (active = true);

CREATE POLICY "Admins manage payment methods"
  ON public.payment_methods FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE TRIGGER payment_methods_set_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();