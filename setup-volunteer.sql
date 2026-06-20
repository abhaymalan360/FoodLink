-- VOLUNTEER PROFILES TABLE
CREATE TABLE volunteer_profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  phone text,
  permanent_address text,
  state text,
  pincode text,
  availability text, -- 'day', 'night', 'anytime'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- URGENCY POSTS TABLE
CREATE TABLE urgency_posts (
  id uuid primary key default uuid_generate_v4(),
  volunteer_id uuid references volunteer_profiles(id) on delete cascade not null,
  photo_url text,
  caption text not null,
  location text not null,
  lat double precision,
  lng double precision,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENABLE RLS
ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE urgency_posts ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Public can view volunteer profiles" ON volunteer_profiles FOR SELECT USING (true);
CREATE POLICY "Volunteers can insert own profile" ON volunteer_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Volunteers can update own profile" ON volunteer_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view urgency posts" ON urgency_posts FOR SELECT USING (true);
CREATE POLICY "Volunteers can insert urgency posts" ON urgency_posts FOR INSERT WITH CHECK (auth.uid() = volunteer_id);
CREATE POLICY "Volunteers can update own posts" ON urgency_posts FOR UPDATE USING (auth.uid() = volunteer_id);

-- REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE urgency_posts;
