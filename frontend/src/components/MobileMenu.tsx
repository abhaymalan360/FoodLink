'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  {
    label: 'Explore',
    items: [
      { href: '/impact',  icon: 'public',  label: 'Public Impact' },
      { href: '/heatmap', icon: 'map',     label: 'Global Logistics' },
    ],
  },
  {
    label: 'Restaurant',
    items: [
      { href: '/restaurant/dashboard',    icon: 'restaurant',  label: 'Dashboard' },
      { href: '/restaurant/list-surplus', icon: 'add_circle',  label: 'List Surplus' },
    ],
  },
  {
    label: 'NGO',
    items: [
      { href: '/ngo/dashboard', icon: 'volunteer_activism', label: 'Dashboard' },
      { href: '/ngo/post-need', icon: 'campaign',           label: 'Post Need' },
    ],
  },
  {
    label: 'Volunteer',
    items: [
      { href: '/volunteer/dashboard',      icon: 'directions_run', label: 'My Dashboard' },
      { href: '/volunteer/opportunities',  icon: 'search',         label: 'Find Opportunities' },
      { href: '/volunteer/report-urgency', icon: 'emergency_share',label: 'Report Urgency', urgent: true },
    ],
  },
  {
    label: 'Logistics',
    items: [
      { href: '#', icon: 'local_shipping', label: 'Active Pickups' },
      { href: '#', icon: 'route',          label: 'Delivery Routes' },
    ],
  },
  {
    label: 'Community',
    items: [
      { href: '#', icon: 'emoji_events', label: 'Leaderboard & Impact' },
      { href: '#', icon: 'handshake',    label: 'Partner Network' },
      { href: '#', icon: 'assessment',   label: 'Annual Reports' },
      { href: '#', icon: 'help',         label: 'Help & Support' },
    ],
  },
]

export default function MobileMenu({ trigger, variant }: { trigger?: React.ReactNode, variant?: 'default' | 'header' | 'sidebar' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: vol } = await supabase.from('volunteer_profiles').select('name').eq('id', user.id).single()
        if (vol) { setDisplayName(vol.name); return }
        const { data: prof } = await supabase.from('profiles').select('name').eq('id', user.id).single()
        if (prof) setDisplayName(prof.name)
      }
    }
    fetchUser()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null); setDisplayName(null); setIsOpen(false)
    router.push('/'); router.refresh()
  }

  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <>
      <div onClick={(e) => { e.stopPropagation(); setIsOpen(true); }} className="cursor-pointer">
        {trigger || (
          variant === 'header' ? (
            <div className="relative p-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-full transition-colors active:scale-95 flex items-center justify-center">
              <span className="material-symbols-outlined">menu</span>
            </div>
          ) : variant === 'sidebar' ? (
            <button className="w-full group flex items-center gap-3 px-3 py-2.5 mx-3 rounded-xl transition-all duration-200 relative text-on-surface-variant hover:bg-surface-container-high/40 hover:text-on-surface border border-transparent cursor-pointer">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface-variant transition-colors" style={{ fontVariationSettings: "'FILL' 0" }}>menu</span>
              <span className="text-[13.5px] tracking-tight font-medium transition-colors">More Options</span>
            </button>
          ) : (
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-lowest/10 transition-colors">
              <span className="material-symbols-outlined text-on-primary text-[22px]">menu</span>
            </button>
          )
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

          <aside
            className="relative w-[280px] bg-surface-container-lowest h-full flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'slideIn 0.2s cubic-bezier(0.25,0.46,0.45,0.94)' }}
          >
            {/* Logo header */}
            <div className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[15px]">restaurant</span>
                </div>
                <span className="text-on-surface font-semibold text-[15px] tracking-tight">FoodLink</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-outline-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-3 [&::-webkit-scrollbar]:w-0">
              {NAV.map((section, si) => (
                <div key={si} className="mb-1">
                  <p className="px-4 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-on-surface-variant uppercase">
                    {section.label}
                  </p>
                  {section.items.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`group mx-2 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-100
                        ${(item as any).urgent
                          ? 'hover:bg-red-50 text-red-600 hover:text-red-700'
                          : 'hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                        }`}
                    >
                      <span className={`material-symbols-outlined text-[17px] shrink-0 transition-colors
                        ${(item as any).urgent ? 'text-red-500' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                        {item.icon}
                      </span>
                      <span className="text-[13px] font-medium flex-1 leading-none">{item.label}</span>
                    </Link>
                  ))}
                  {si < NAV.length - 1 && (
                    <div className="mx-4 mt-2 mb-1 h-px bg-surface-container-high" />
                  )}
                </div>
              ))}
            </nav>

            {/* User footer */}
            <div className="border-t border-outline-variant px-3 py-3">
              {user ? (
                <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-container-low transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-on-surface truncate leading-tight">{displayName ?? user.email}</p>
                    <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">Signed in</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign out"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-outline-variant hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-white text-[18px]">login</span>
                  <span className="text-white font-semibold text-[13px]">Sign in to FoodLink</span>
                </Link>
              )}
            </div>
          </aside>

          <style>{`
            @keyframes slideIn {
              from { transform: translateX(-100%); opacity: 0.6; }
              to   { transform: translateX(0);    opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  )
}
