'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleLogout}
      title="Log Out"
      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-on-primary/70 hover:text-on-primary"
    >
      <span className="material-symbols-outlined text-[20px]">logout</span>
    </button>
  )
}
