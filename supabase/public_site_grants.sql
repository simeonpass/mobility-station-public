-- Public site role grants (run in Supabase SQL editor)
-- Create role first if it does not exist:
-- CREATE ROLE public_site NOLOGIN;

GRANT USAGE ON SCHEMA public TO public_site;

GRANT SELECT ON public.products TO public_site;
GRANT SELECT ON public.product_variants TO public_site;
GRANT SELECT ON public.categories TO public_site;
GRANT SELECT ON public.brands TO public_site;
GRANT SELECT ON public.product_images TO public_site;
GRANT SELECT ON public.product_accessories TO public_site;
GRANT SELECT ON public.branches TO public_site;
GRANT SELECT ON public.blog_posts TO public_site;
GRANT SELECT ON public.reviews TO public_site;
GRANT SELECT ON public.enquiries TO public_site;
GRANT INSERT ON public.enquiries TO public_site;
GRANT SELECT ON public.settings TO public_site;
GRANT SELECT ON public.product_specifications TO public_site;
GRANT SELECT ON public.compatible_accessories TO public_site;

-- Example RLS policy pattern (adjust column names to match your schema):
-- CREATE POLICY "public_site_read_published_products"
-- ON public.products FOR SELECT TO public_site
-- USING (published = true);
