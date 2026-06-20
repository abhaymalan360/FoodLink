'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function login(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  const role = data.user.user_metadata?.role
  if (role) {
    return { url: `/${role}/dashboard` }
  } else {
    return { error: 'No role assigned to user' }
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string // 'ngo' or 'restaurant'
  const name = formData.get('name') as string

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        name
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { error: profileError } = await adminSupabase.from('profiles').insert({
      id: data.user.id,
      role,
      name
    })
    
    if (profileError) {
      console.error('Profile creation error:', profileError)
      return { error: profileError.message }
    }
  }

  revalidatePath('/', 'layout')
  
  if (!data.session) {
    return { error: 'Please check your email to verify your account before logging in.' }
  }

  return { url: `/${role}/dashboard` }
}
