import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MobileMenu from '@/components/MobileMenu'

export default async function NgoLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  // Fetch profile to get name
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-on-surface">
      {/* SIDEBAR NAVIGATION (LEFT) */}
      <aside className="w-64 bg-surface-container border-r border-outline-variant hidden md:flex flex-col z-40">
        <div className="p-stack-lg">
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">FoodLink</span>
        </div>
        <nav className="flex-1 px-stack-md py-stack-sm space-y-unit">
          <Link className="flex items-center gap-stack-md px-stack-md py-3 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary rounded-lg transition-all duration-200" href="/ngo/dashboard">
            <span className="material-symbols-outlined">home</span>
            <span className="font-headline-sm text-headline-sm">Home</span>
          </Link>
          <Link className="flex items-center gap-stack-md px-stack-md py-3 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary rounded-lg transition-all duration-200" href="/ngo/post-need">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="font-headline-sm text-headline-sm">Post</span>
          </Link>
          <Link className="flex items-center gap-stack-md px-stack-md py-3 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary rounded-lg transition-all duration-200" href="/impact">
            <span className="material-symbols-outlined">insights</span>
            <span className="font-headline-sm text-headline-sm">Impact</span>
          </Link>
          <Link className="flex items-center gap-stack-md px-stack-md py-3 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary rounded-lg transition-all duration-200" href="/heatmap">
            <span className="material-symbols-outlined">map</span>
            <span className="font-headline-sm text-headline-sm">Heatmap</span>
          </Link>
          <MobileMenu 
            trigger={
              <div className="flex items-center gap-stack-md px-stack-md py-3 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary rounded-lg transition-all duration-200 cursor-pointer">
                <span className="material-symbols-outlined">menu</span>
                <span className="font-headline-sm text-headline-sm">More Options</span>
              </div>
            }
          />
        </nav>
        <div className="p-stack-md mt-auto border-t border-outline-variant">
          <form action={async () => {
            'use server'
            const supabase = createClient()
            await supabase.auth.signOut()
            redirect('/')
          }}>
            <button type="submit" className="w-full flex items-center gap-stack-md p-stack-sm rounded-lg hover:bg-surface-variant/50 cursor-pointer text-left">
              <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-on-primary-fixed">
                <span className="material-symbols-outlined">corporate_fare</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-on-surface">{profile?.name || 'NGO User'}</span>
                <span className="text-[12px] text-error flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-[14px]">logout</span> Sign Out</span>
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
          <div className="flex items-center gap-stack-lg hidden md:flex">
            <button className="relative p-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full border-2 border-surface"></span>
            </button>
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
