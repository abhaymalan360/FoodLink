import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import MobileMenu from '@/components/MobileMenu'
import dynamic from 'next/dynamic'
import EmergencyReportForm from '@/components/EmergencyReportForm'
import AnimatedNumber from '@/components/ui/AnimatedNumber'

const MapComponent = dynamic(() => import('@/components/Map/LeafletMap'), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center font-bold text-primary">Loading Map...</div> })

export const revalidate = 60 // revalidate every minute for public dashboard

export default async function ImpactPage() {
  const supabase = createClient()
  
  const { data: logs } = await supabase.from('impact_logs').select('*').order('logged_at', { ascending: false })
  const { data: demands } = await supabase.from('demand_requests').select('*').eq('status', 'active')
  const { data: listings } = await supabase.from('surplus_listings').select('*').eq('status', 'available')

  const totalMeals = logs?.reduce((acc, curr) => acc + Number(curr.meals_saved), 0) || 0
  const totalWaste = logs?.reduce((acc, curr) => acc + Number(curr.waste_kg_prevented), 0) || 0
  
  const citiesSet = new Set(logs?.map(l => l.city))
  const totalCities = citiesSet.size

  return (
    <main className="min-h-screen pb-stack-lg bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation Anchor */}
      <header className="bg-surface sticky top-0 z-50 border-b border-outline-variant flex justify-between items-center w-full px-margin-desktop h-16">
        <div className="flex items-center gap-stack-md">
          <MobileMenu />
          <Link href="/" className="flex items-center gap-2">
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">FoodLink</h1>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-stack-lg">
          <Link href="/impact" className="font-label-caps text-label-caps text-primary border-b-2 border-primary pb-1">Impact</Link>
          <Link href="/heatmap" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">Logistics</Link>
        </nav>
        <div className="flex items-center gap-stack-md">
          <button className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-variant/50 rounded-full transition-colors">notifications</button>
        </div>
      </header>

      {/* Hero Section: Stats Grid */}
      <section className="px-margin-desktop py-stack-lg bg-surface-bright relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 opacity-10">
          <span className="material-symbols-outlined text-[300px] text-primary">eco</span>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-5 space-y-stack-md z-10">
            <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg font-status-indicator text-status-indicator uppercase tracking-wider">Public Dashboard</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Measuring Real-Time <br/><span className="text-primary">Civic Emergency Response</span></h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">Our unified logistics engine coordinates surplus food recovery between commercial kitchens and community organizations at scale.</p>
            <div className="pt-stack-md">
              <Link href="/volunteer/dashboard" className="bg-primary text-on-primary px-stack-lg py-4 rounded-xl font-headline-sm text-headline-sm inline-flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container interactive-btn">
                Join the Network <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-stack-md z-10">
            {/* Stat Card 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex flex-col justify-between h-48 interactive-card">
              <div>
                <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant mt-2">Meals Saved</h3>
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg text-on-surface"><AnimatedNumber value={totalMeals} /></div>
                <div className="text-primary font-status-indicator text-status-indicator flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span> Live metrics
                </div>
              </div>
            </div>
            {/* Stat Card 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex flex-col justify-between h-48 interactive-card">
              <div>
                <span className="material-symbols-outlined text-tertiary text-3xl">delete_sweep</span>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant mt-2">Waste Prevented</h3>
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg text-on-surface"><AnimatedNumber value={totalWaste} /> <span className="text-body-md font-normal text-on-surface-variant">kg</span></div>
                <div className="text-tertiary font-status-indicator text-status-indicator flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">monitoring</span> High Impact Area
                </div>
              </div>
            </div>
            {/* Stat Card 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex flex-col justify-between h-48 interactive-card">
              <div>
                <span className="material-symbols-outlined text-secondary text-3xl">groups</span>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant mt-2">Communities Served</h3>
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg text-on-surface"><AnimatedNumber value={totalCities} /></div>
                <div className="text-secondary font-status-indicator text-status-indicator flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">map</span> Nationwide Expansion
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section Placeholder */}
      <section className="px-margin-desktop py-stack-lg max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-gutter">
          <div className="md:w-2/3 bg-surface-container-low rounded-xl border border-outline-variant p-stack-lg min-h-[600px] relative">
            <div className="flex justify-between items-start mb-stack-md">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Regional Activity</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Live density of surplus recovery across the region.</p>
              </div>
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-primary rounded-full animate-pulse"></span>
                <span className="font-label-caps text-label-caps text-primary">Live Operations</span>
              </div>
            </div>
            <div className="flex items-center justify-center w-full h-[500px]">
              <div className="w-full h-full bg-surface-dim rounded-xl flex items-center justify-center border border-outline-variant relative overflow-hidden">
                <MapComponent demands={demands || []} listings={listings || []} />
              </div>
            </div>
          </div>
          
          <div className="md:w-1/3 flex flex-col gap-gutter">
            <div className="bg-surface-container-highest rounded-xl p-stack-md border border-outline-variant">
              <h4 className="font-headline-sm text-headline-sm mb-stack-sm">Current Active Hubs</h4>
              <div className="space-y-stack-md">
                {Array.from(citiesSet).slice(0, 4).map((city, idx) => (
                  <div key={city} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg border border-outline-variant">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-body-md font-semibold">{city}</span>
                    </div>
                    <span className="font-label-caps text-primary">Active</span>
                  </div>
                ))}
              </div>
            </div>
            <EmergencyReportForm />
          </div>
        </div>
      </section>

      {/* Horizontal Impact Timeline */}
      <section className="py-stack-lg overflow-hidden">
        <div className="px-margin-desktop max-w-7xl mx-auto mb-stack-md flex justify-between items-end">
          <div>
            <h3 className="font-headline-md text-headline-md">Recent Impact Moments</h3>
            <p className="font-body-md text-on-surface-variant">Real-time verification of community distributions.</p>
          </div>
        </div>
        
        <div className="flex gap-gutter px-margin-desktop overflow-x-auto py-4" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {logs?.slice(0, 10).map((log) => (
            <div key={log.id} className="min-w-[320px] bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-surface-container-high rounded font-label-caps text-primary">
                  {new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <p className="font-body-md text-on-surface mb-4">
                <strong>{log.city} Area</strong> recorded a successful distribution of <strong>{log.meals_saved} meals</strong> ({log.waste_kg_prevented}kg).
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-dim overflow-hidden flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                </div>
                <div className="text-xs">
                  <p className="font-bold">Claim Verified</p>
                  <p className="text-on-surface-variant">Logistics ID: #{log.id.slice(0, 6)}</p>
                </div>
              </div>
            </div>
          ))}
          {(!logs || logs.length === 0) && (
            <div className="p-12 w-full text-center text-neutral-500 font-medium">No impact data yet. Be the first to make a difference!</div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low px-margin-desktop py-stack-lg border-t border-outline-variant">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-gutter">
          <div className="text-center md:text-left">
            <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Help Expand the Link</h4>
            <p className="font-body-md text-on-surface-variant">Share this dashboard to encourage more partners to join our national recovery network.</p>
          </div>
          <div className="flex gap-stack-md">
            <button className="flex items-center gap-2 border border-outline-variant px-stack-md py-2 rounded-lg font-bold hover:bg-surface-container-lowest transition-all">
              <span className="material-symbols-outlined">share</span> Copy Link
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-stack-lg flex justify-between items-center text-xs text-on-surface-variant border-t border-outline-variant pt-stack-md">
          <p>© 2024 FoodLink. Global Logistics for Civic Surplus.</p>
          <div className="flex gap-4">
            <Link className="hover:underline" href="#">Privacy Protocol</Link>
            <Link className="hover:underline" href="#">Security Whitepaper</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
