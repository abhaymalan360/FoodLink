import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // If user is already logged in, check their role and redirect them to their dashboard
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    
    if (profile?.role === 'restaurant') {
      redirect('/restaurant/dashboard')
    } else if (profile?.role === 'ngo') {
      redirect('/ngo/dashboard')
    }
    
    // Check if volunteer
    const { data: volProfile } = await supabase.from('volunteer_profiles').select('id').eq('id', user.id).single()
    if (volProfile) {
      redirect('/volunteer/dashboard')
    }

    // Fallback if role is unknown
    redirect('/impact')
  }

  return <>{children}</>
}
