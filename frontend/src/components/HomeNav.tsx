'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HomeNav({ scrolled = false }: { scrolled?: boolean }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Check if they are a restaurant/NGO (have a profile with a role)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, name')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        } else {
          // Check volunteer_profiles
          const { data: volData } = await supabase
            .from('volunteer_profiles')
            .select('name')
            .eq('id', user.id)
            .single()
          if (volData) setProfile({ role: 'volunteer', name: volData.name })
        }
      }
      setLoading(false)
    }
    getUser()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.refresh()
  }

  if (loading) return null

  if (user && profile) {
    const dashLink =
      profile.role === 'volunteer' ? '/volunteer/dashboard'
      : profile.role === 'restaurant' ? '/restaurant/dashboard'
      : profile.role === 'ngo' ? '/ngo/dashboard'
      : '/'

    const initials = profile.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'

    return (
      <div className="flex items-center gap-3">
        <Link href={dashLink}
          className={`px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2 ${scrolled ? 'text-on-surface hover:text-on-surface' : 'text-white/90 hover:text-white'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${scrolled ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>{initials}</span>
          My Dashboard
        </Link>
        <button onClick={handleLogout}
          className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? 'text-on-surface-variant hover:text-on-surface' : 'text-white/70 hover:text-white'}`}>
          Log Out
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-4 items-center">
      <Link href="/auth" className={`px-4 py-2 text-sm font-semibold transition-colors ${scrolled ? 'text-on-surface hover:text-on-surface' : 'text-white hover:text-white/80'}`}>
        Log In
      </Link>
      <Link href="/auth" className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 ${scrolled ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`}>
        Get Started
      </Link>
    </div>
  )
}
