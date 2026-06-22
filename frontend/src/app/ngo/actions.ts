'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function postNeed(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const headcount = parseInt(formData.get('headcount') as string)
  const urgency = formData.get('urgency') as string
  const area = formData.get('area') as string
  const lat = parseFloat(formData.get('lat') as string) || 20.5937
  const lng = parseFloat(formData.get('lng') as string) || 78.9629

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 2)

  const { data, error } = await supabase.from('demand_requests').insert({
    ngo_id: user.id,
    headcount,
    urgency,
    area,
    lat,
    lng,
    expires_at: expiresAt.toISOString(),
    status: 'active'
  }).select().single()

  if (error) {
    console.error('Error posting need:', error)
    return { error: error.message }
  }

  try {
    await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/api/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ triggerType: 'demand', recordId: data.id })
    })
  } catch(e) {
    console.error('Match engine failed to trigger', e)
  }

  revalidatePath('/ngo/dashboard')
  redirect('/ngo/dashboard')
}
