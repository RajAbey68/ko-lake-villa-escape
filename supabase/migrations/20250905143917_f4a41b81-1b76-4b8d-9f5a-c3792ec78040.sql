-- Fix all security vulnerabilities in the Ko Lake Villa database

-- First, create the is_admin function if it doesn't exist (for completeness)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Drop all existing vulnerable policies

-- Contact submissions table
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only authenticated admins can view contact submissions" ON public.contact_submissions;

-- Booking requests table
DROP POLICY IF EXISTS "Admins can view all booking requests" ON public.booking_requests;
DROP POLICY IF EXISTS "Admins can update booking requests" ON public.booking_requests;

-- Bookings table  
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;

-- Pricing updates table
DROP POLICY IF EXISTS "Pricing updates are viewable by everyone" ON public.pricing_updates;
DROP POLICY IF EXISTS "Pricing updates can be managed by admins" ON public.pricing_updates;

-- Create secure policies for contact_submissions
CREATE POLICY "Only authenticated admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

-- Create secure policies for booking_requests
CREATE POLICY "Only authenticated admins can view booking requests" 
ON public.booking_requests 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only authenticated admins can update booking requests" 
ON public.booking_requests 
FOR UPDATE 
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only authenticated admins can delete booking requests" 
ON public.booking_requests 
FOR DELETE 
TO authenticated
USING (public.is_admin(auth.uid()));

-- Create secure policies for bookings
CREATE POLICY "Only authenticated admins can view bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only authenticated admins can update bookings" 
ON public.bookings 
FOR UPDATE 
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only authenticated admins can delete bookings" 
ON public.bookings 
FOR DELETE 
TO authenticated
USING (public.is_admin(auth.uid()));

-- Create secure policies for pricing_updates  
CREATE POLICY "Only authenticated admins can view pricing updates" 
ON public.pricing_updates 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only authenticated admins can manage pricing updates" 
ON public.pricing_updates 
FOR ALL 
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));