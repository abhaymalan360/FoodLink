-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TYPE user_role AS ENUM ('ngo', 'restaurant', 'admin');
CREATE TABLE profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role not null,
  name text not null,
  phone text,
  address text,
  city text,
  lat double precision,
  lng double precision,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NGO side
CREATE TYPE urgency_level AS ENUM ('moderate', 'urgent', 'critical');
CREATE TYPE demand_status AS ENUM ('active', 'matched', 'fulfilled');

CREATE TABLE demand_requests (
  id uuid primary key default uuid_generate_v4(),
  ngo_id uuid references profiles(id) on delete cascade not null,
  headcount integer not null,
  urgency urgency_level not null,
  food_type text[],
  area text,
  lat double precision,
  lng double precision,
  status demand_status default 'active' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null
);

-- Restaurant side
CREATE TYPE surplus_status AS ENUM ('available', 'matched', 'picked_up');

CREATE TABLE surplus_listings (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references profiles(id) on delete cascade not null,
  food_name text not null,
  quantity numeric not null,
  unit text not null,
  available_until timestamp with time zone not null,
  pickup_address text not null,
  lat double precision,
  lng double precision,
  photo_url text,
  status surplus_status default 'available' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Matching
CREATE TYPE match_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

CREATE TABLE matches (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references surplus_listings(id) on delete cascade not null,
  demand_id uuid references demand_requests(id) on delete cascade not null,
  restaurant_id uuid references profiles(id) not null,
  ngo_id uuid references profiles(id) not null,
  status match_status default 'pending' not null,
  matched_at timestamp with time zone default timezone('utc'::text, now()) not null,
  confirmed_at timestamp with time zone,
  picked_up_at timestamp with time zone
);

-- Impact
CREATE TABLE impact_logs (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete set null,
  meals_saved numeric not null,
  waste_kg_prevented numeric not null,
  city text not null,
  logged_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE surplus_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_logs ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for demand_requests
CREATE POLICY "Demands are viewable by everyone." ON demand_requests FOR SELECT USING (true);
CREATE POLICY "NGOs can insert demands." ON demand_requests FOR INSERT WITH CHECK (auth.uid() = ngo_id);
CREATE POLICY "NGOs can update own demands." ON demand_requests FOR UPDATE USING (auth.uid() = ngo_id);

-- Policies for surplus_listings
CREATE POLICY "Listings are viewable by everyone." ON surplus_listings FOR SELECT USING (true);
CREATE POLICY "Restaurants can insert listings." ON surplus_listings FOR INSERT WITH CHECK (auth.uid() = restaurant_id);
CREATE POLICY "Restaurants can update own listings." ON surplus_listings FOR UPDATE USING (auth.uid() = restaurant_id);
CREATE POLICY "Restaurants can delete own listings." ON surplus_listings FOR DELETE USING (auth.uid() = restaurant_id);

-- Policies for matches
CREATE POLICY "Matches viewable by involved parties" ON matches FOR SELECT USING (auth.uid() = restaurant_id OR auth.uid() = ngo_id);
-- Match creation is done via our matching engine API (service role), but users can update status
CREATE POLICY "Matches updatable by involved parties" ON matches FOR UPDATE USING (auth.uid() = restaurant_id OR auth.uid() = ngo_id);

-- Policies for impact_logs
CREATE POLICY "Impact logs are viewable by everyone." ON impact_logs FOR SELECT USING (true);

-- Set up Realtime
-- This ensures Supabase broadcasts changes to these tables to listening clients
ALTER PUBLICATION supabase_realtime ADD TABLE demand_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE surplus_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
