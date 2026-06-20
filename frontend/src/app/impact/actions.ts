'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Use the service role key to bypass RLS for public submissions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function submitEmergencySurplus(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const location = formData.get('location') as string
  const quantity = formData.get('quantity') as string

  if (!name || !phone || !location || !quantity) {
    return { error: 'All fields are required.' }
  }

  // 1. Geocode the location
  let lat = null
  let lng = null
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`, {
      headers: { 'User-Agent': 'FoodLinkApp/1.0' }
    })
    const data = await res.json()
    if (data && data.length > 0) {
      lat = parseFloat(data[0].lat)
      lng = parseFloat(data[0].lon)
    }
  } catch (e) {
    console.error('Geocoding failed:', e)
  }

  // 2. Find or create the "Anonymous/Emergency Reporter" dummy account
  // We'll just look for a profile with a specific name "Emergency Reporter".
  // If it doesn't exist, we must create a fake auth user first.
  let reporterId = null

  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('name', 'Emergency Reporter')
    .limit(1)

  if (profiles && profiles.length > 0) {
    reporterId = profiles[0].id
  } else {
    // Create a dummy auth user
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: 'emergency@foodlink.app',
      password: 'anonymous_password_123!',
      email_confirm: true
    })

    if (authErr) {
      console.error('Auth error:', authErr)
      return { error: 'Failed to initialize emergency account.' }
    }

    reporterId = authData.user.id

    // Create the profile
    await supabaseAdmin.from('profiles').insert({
      id: reporterId,
      name: 'Emergency Reporter',
      role: 'restaurant', // Must be restaurant to post surplus
      phone: '0000000000',
      address: 'System Account',
      city: 'Global'
    })
  }

  // 3. Insert the surplus listing
  const { error: insertError } = await supabaseAdmin.from('surplus_listings').insert({
    restaurant_id: reporterId,
    food_name: `Emergency Report by ${name} (${phone})`,
    quantity: parseFloat(quantity),
    unit: 'portions/kg',
    available_until: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    pickup_address: location,
    lat: lat,
    lng: lng,
    status: 'available'
  })

  if (insertError) {
    console.error('Insert error:', insertError)
    return { error: 'Failed to submit emergency surplus. ' + insertError.message }
  }

  // Revalidate the impact page so the map updates
  revalidatePath('/impact')
  return { success: true }
}
