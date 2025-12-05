-- Fix function search paths
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN 'ORD-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$;

-- Create departments table for dropdowns
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Departments are publicly readable" ON public.departments
  FOR SELECT USING (true);

-- Insert default departments
INSERT INTO public.departments (name, sort_order) VALUES
  ('Sales', 1),
  ('Customer Service', 2),
  ('Accounts', 3),
  ('Logistics', 4),
  ('General Enquiry', 5);

-- Create sales_representatives table for dropdowns
CREATE TABLE public.sales_representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.sales_representatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sales reps are publicly readable" ON public.sales_representatives
  FOR SELECT USING (true);

-- Insert default sales reps
INSERT INTO public.sales_representatives (name, sort_order) VALUES
  ('John Smith', 1),
  ('Sarah Johnson', 2),
  ('Michael Brown', 3),
  ('Emily Davis', 4),
  ('I don''t know', 99);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department_id UUID REFERENCES public.departments(id),
  department_name TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

-- Create customer_service_requests table
CREATE TABLE public.customer_service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name TEXT NOT NULL,
  account_code TEXT NOT NULL,
  email TEXT,
  invoice_date DATE,
  credit_reason TEXT NOT NULL,
  additional_info TEXT,
  skus TEXT NOT NULL,
  picture_url TEXT,
  sales_rep_id UUID REFERENCES public.sales_representatives(id),
  sales_rep_name TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit service request" ON public.customer_service_requests
  FOR INSERT WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_service_requests_updated_at
  BEFORE UPDATE ON public.customer_service_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();