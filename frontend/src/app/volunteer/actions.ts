'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function saveVolunteerProfile(formData: FormData) {
  const supabase = createClient()
  const supabaseAdmin = createAdmin(supabaseUrl, supabaseServiceKey)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const permanent_address = formData.get('permanent_address') as string
  const state = formData.get('state') as string
  const pincode = formData.get('pincode') as string
  const availability = formData.get('availability') as string

  if (!name || !phone || !permanent_address || !state || !pincode || !availability) {
    return { error: 'All fields are required.' }
  }

  const { error } = await supabaseAdmin
    .from('volunteer_profiles')
    .upsert({
      id: user.id,
      name,
      phone,
      permanent_address,
      state,
      pincode,
      availability,
    }, { onConflict: 'id' })

  if (error) return { error: error.message }

  revalidatePath('/volunteer/dashboard')
  return { success: true }
}

export async function submitUrgencyPost(formData: FormData) {
  const supabase = createClient()
  const supabaseAdmin = createAdmin(supabaseUrl, supabaseServiceKey)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const caption = formData.get('caption') as string
  const location = formData.get('location') as string
  const photo_url = formData.get('photo_url') as string

  if (!caption || !location) return { error: 'Caption and location are required.' }

  // Geocode the location
  let lat = null, lng = null
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`, {
      headers: { 'User-Agent': 'FoodLinkApp/1.0' }
    })
    const data = await res.json()
    if (data?.length > 0) {
      lat = parseFloat(data[0].lat)
      lng = parseFloat(data[0].lon)
    }
  } catch {}

  const { error } = await supabaseAdmin
    .from('urgency_posts')
    .insert({
      volunteer_id: user.id,
      caption,
      location,
      photo_url: photo_url || null,
      lat,
      lng,
      status: 'active'
    })

  if (error) return { error: error.message }

  revalidatePath('/volunteer/dashboard')
  return { success: true }
}

export async function getVolunteerData() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [profileRes, postsRes] = await Promise.all([
    supabase.from('volunteer_profiles').select('*').eq('id', user.id).single(),
    supabase.from('urgency_posts').select('*').eq('volunteer_id', user.id).order('created_at', { ascending: false })
  ])

  return {
    user,
    profile: profileRes.data,
    posts: postsRes.data ?? []
  }
}
