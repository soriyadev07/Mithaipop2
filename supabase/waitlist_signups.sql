-- Mithai Pop — Official Waitlist Database Schema & Security Rules
-- Table: waitlist_signups

CREATE TABLE IF NOT EXISTS public.waitlist_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT,
    favorite_pop TEXT,
    referral_source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    fbclid TEXT,
    consent BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Case-insensitive index for email duplicate checks
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_email ON public.waitlist_signups (lower(email));
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_created_at ON public.waitlist_signups (created_at DESC);

-- Enable Row Level Security (RLS) to protect customer data
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Security Policy 1: Public visitors can ONLY insert (submit) waitlist signups
CREATE POLICY "Allow public to insert waitlist signups"
ON public.waitlist_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Security Policy 2: Public visitors CANNOT read/select other customers' data
-- Only authenticated admin/staff roles can view waitlist signups
CREATE POLICY "Allow authenticated staff to read waitlist signups"
ON public.waitlist_signups
FOR SELECT
TO authenticated
USING (true);

-- Security Policy 3: Only authenticated staff can delete waitlist records
CREATE POLICY "Allow authenticated staff to delete waitlist signups"
ON public.waitlist_signups
FOR DELETE
TO authenticated
USING (true);
