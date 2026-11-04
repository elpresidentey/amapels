-- Lock customer orders and product administration behind server-side service-role routes.
-- The service_role key must never be exposed to browsers.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE public.orders FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.products FROM anon, authenticated;
GRANT SELECT ON TABLE public.products TO anon, authenticated;

DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orders' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.orders', p.policyname);
  END LOOP;
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.products', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "Public can read products" ON public.products
  FOR SELECT TO anon, authenticated USING (true);

-- Remove policies that reference this bucket, then allow only public image reads.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (coalesce(qual, '') || coalesce(with_check, '')) ILIKE '%product-images%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'product-images');
