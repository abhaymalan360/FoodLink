'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function listSurplus(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const foodName = formData.get('food_name') as string
  const quantity = parseFloat(formData.get('quantity') as string)
  const unit = formData.get('unit') as string
  const pickupAddress = formData.get('pickup_address') as string
  const lat = parseFloat(formData.get('lat') as string) || 40.7128
  const lng = parseFloat(formData.get('lng') as string) || -74.0060

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 4) // Default 4 hours available

  const { data, error } = await supabase.from('surplus_listings').insert({
    restaurant_id: user.id,
    food_name: foodName,
    quantity,
    unit,
    pickup_address: pickupAddress,
    lat,
    lng,
    available_until: expiresAt.toISOString(),
    status: 'available'
  }).select().single()

  if (error) {
    console.error('Error posting surplus:', error)
    return { error: error.message }
  }

  // Trigger matching engine
  try {
    await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/api/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ triggerType: 'surplus', recordId: data.id })
    })
  } catch(e) {
    console.error('Match engine failed to trigger', e)
  }

  revalidatePath('/restaurant/dashboard')
  redirect('/restaurant/dashboard')
}
