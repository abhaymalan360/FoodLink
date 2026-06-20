import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if profile exists, if not, create it
      let role = searchParams.get('role')
      if (!role || (role !== 'ngo' && role !== 'restaurant')) {
         role = data.user.user_metadata?.role || 'ngo' 
      }
      
      const adminSupabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (!profile) {
         await adminSupabase.from('profiles').insert({
            id: data.user.id,
            role,
            name: data.user.user_metadata?.full_name || 'Google User'
         })
      }

      return NextResponse.redirect(`${origin}/${role}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=Could not authenticate with Google`)
}
