import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SidebarNavLinks from '@/components/SidebarNavLink'
import MobileMenu from '@/components/MobileMenu'
import ProfileDropdown from '@/components/ProfileDropdown'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { NotificationDropdown } from '@/components/ui/NotificationDropdown'

export default async function NgoLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  // Fetch profile to get name
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-on-surface">
      {/* SIDEBAR NAVIGATION (LEFT) */}
      <aside className="w-[260px] hidden md:flex flex-col z-40 relative bg-surface-container-lowest border-r border-outline-variant/60">
        {/* Logo */}
        <div className="px-6 pt-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-600 shadow-sm">
              <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[19px] font-bold tracking-tight text-emerald-700 leading-none">FoodLink</span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-on-surface-variant tracking-[0.15em] uppercase">NGO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <SidebarNavLinks
          items={[
            { href: '/ngo/dashboard', icon: 'grid_view', label: 'Dashboard' },
            { href: '/ngo/post-need', icon: 'campaign', label: 'Post Need' },
            { href: '/impact', icon: 'insights', label: 'Impact' },
            { href: '/heatmap', icon: 'map', label: 'Live Map' },
          ]}
          bottomItems={[
            { href: '/', icon: 'home', label: 'Back to Home' },
          ]}
        >
          <MobileMenu 
            trigger={
              <button className="w-full group flex items-center gap-3 px-3 py-2.5 mx-3 rounded-xl transition-all duration-200 relative text-on-surface-variant hover:bg-surface-container-high/40 hover:text-on-surface border border-transparent cursor-pointer">
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface-variant transition-colors" style={{ fontVariationSettings: "'FILL' 0" }}>menu</span>
                <span className="text-[13.5px] tracking-tight font-medium transition-colors">More Options</span>
              </button>
            }
          />
        </SidebarNavLinks>

        {/* User Footer */}
        <div className="p-4 mx-3 mb-4">
          <form action={async () => {
            'use server'
            const supabase = createClient()
            await supabase.auth.signOut()
            redirect('/')
          }}>
            <button type="submit" className="w-full flex items-center gap-3 p-2.5 rounded-xl cursor-pointer text-left group hover:bg-surface-container-lowest border border-transparent hover:border-outline-variant/60 hover:shadow-sm transition-all">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 font-bold text-[13px] text-on-surface bg-surface-container-high/50 group-hover:bg-surface-container border border-outline-variant/50">
                {(profile?.name || 'N').charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[13px] font-semibold text-on-surface truncate">{profile?.name || 'NGO User'}</span>
                <span className="text-[11px] font-medium text-on-surface-variant">Manage Account</span>
              </div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-on-surface-variant transition-colors">logout</span>
              </div>
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* HEADER BAR */}
        <header className="h-14 bg-surface px-margin-desktop flex items-center justify-between border-b border-outline-variant sticky top-0 z-30">
          <div className="flex items-center gap-stack-md">
            <div className="flex items-center bg-surface-container-low px-stack-md py-1.5 rounded-full border border-outline-variant cursor-pointer hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-[18px] mr-2">location_on</span>
              <span className="font-label-caps text-label-caps uppercase">{profile?.city || 'Global District'}</span>
            </div>
            <span className="h-4 w-[1px] bg-outline-variant"></span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface-variant">NGO Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationDropdown />
            <ProfileDropdown
              name={profile?.name || 'NGO User'}
              role="ngo"
              initial={(profile?.name || 'N').charAt(0).toUpperCase()}
            />
            <MobileMenu variant="header" />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="pb-24 md:pb-0">
            {children}
        </div>
      </div>

      {/* BOTTOM NAVIGATION (MOBILE ONLY) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin-mobile py-stack-sm bg-surface border-t border-outline-variant md:hidden">
        <Link href="/ngo/dashboard" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary px-stack-md py-unit transition-all duration-300">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-label-caps mt-1">Home</span>
        </Link>
        <Link href="/ngo/post-need" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary px-stack-md py-unit transition-all duration-300">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="font-label-caps text-label-caps mt-1">Post</span>
        </Link>
        <Link href="/heatmap" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary px-stack-md py-unit transition-all duration-300">
          <span className="material-symbols-outlined">map</span>
          <span className="font-label-caps text-label-caps mt-1">Map</span>
        </Link>
        <form action={async () => {
            'use server'
            const supabase = createClient()
            await supabase.auth.signOut()
            redirect('/')
        }}>
            <button type="submit" className="flex flex-col items-center justify-center text-error px-stack-md py-unit transition-all duration-300">
                <span className="material-symbols-outlined">logout</span>
                <span className="font-label-caps text-label-caps mt-1">Out</span>
            </button>
        </form>
      </nav>
    </div>
  )
}
