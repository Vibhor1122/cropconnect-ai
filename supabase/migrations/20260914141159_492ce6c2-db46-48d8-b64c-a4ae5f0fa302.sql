CREATE TABLE public.crop_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_name TEXT NOT NULL,
  crop TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  location TEXT NOT NULL,
  harvest_date DATE,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.crop_listings TO anon;
GRANT SELECT, INSERT ON public.crop_listings TO authenticated;
GRANT ALL ON public.crop_listings TO service_role;

ALTER TABLE public.crop_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view crop listings"
ON public.crop_listings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can create crop listings"
ON public.crop_listings FOR INSERT
TO anon, authenticated
WITH CHECK (true);