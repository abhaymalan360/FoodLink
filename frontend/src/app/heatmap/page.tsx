'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import MobileMenu from '@/components/MobileMenu'
import dynamic from 'next/dynamic'

// Dynamically import the map so it only loads on the client
// Leaflet breaks if loaded during SSR because it relies on the window object
const MapComponent = dynamic(
  () => import('@/components/Map/LeafletMap'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center font-bold text-primary">Loading Map...</div>
  }
)

export default function HeatmapPage() {
  const [demands, setDemands] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, title?: string, isEmergency?: boolean} | null>(null)
  const [isLocating, setIsLocating] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'needs' | 'surplus'>('all')
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: d } = await supabase.from('demand_requests').select('*').eq('status', 'active').order('created_at', { ascending: false })
      if (d) setDemands(d)

      const { data: l } = await supabase.from('surplus_listings').select('*').eq('status', 'available').order('created_at', { ascending: false })
      if (l) setListings(l)
    }

    fetchData()

    const demandSub = supabase.channel('demand_heatmap')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'demand_requests' }, fetchData).subscribe()
    const listingSub = supabase.channel('listing_heatmap')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'surplus_listings' }, fetchData).subscribe()

    return () => {
      supabase.removeChannel(demandSub)
      supabase.removeChannel(listingSub)
    }
  }, [supabase])

  return (
    <div className="bg-background text-on-background font-body-md overflow-hidden h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-margin-desktop h-14 z-50 shrink-0">
        <div className="flex items-center gap-stack-md">
          <MobileMenu />
          <Link href="/" className="flex items-center gap-2">
            <h1 className="font-headline-md text-headline-md font-bold text-primary">FoodLink</h1>
          </Link>
          <div className="h-6 w-px bg-outline-variant ml-stack-md"></div>
          <div className="flex items-center gap-stack-sm text-on-surface-variant px-stack-md">
            <span className="material-symbols-outlined text-[20px]">location_on</span>
            <span className="font-body-md font-semibold text-on-surface">Global View</span>
            <span className="material-symbols-outlined cursor-pointer">expand_more</span>
          </div>
        </div>
        <div className="flex items-center gap-stack-lg">
          <div className="flex bg-surface-container rounded-lg p-unit">
            <button className="px-stack-md py-unit bg-primary text-on-primary rounded-lg font-label-caps text-label-caps transition-all">REAL-TIME</button>
            <Link href="/impact" className="px-stack-md py-unit text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-all">IMPACT</Link>
          </div>
          <div className="flex items-center gap-stack-md">
            <div className="flex flex-col items-end">
              <span className="text-label-caps font-label-caps text-on-surface-variant">OPS STATUS</span>
              <span className="text-primary font-bold text-label-caps flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span> NOMINAL
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant hover:bg-surface-variant/50 p-unit rounded-full cursor-pointer transition-all">notifications</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        {/* Main Map Area */}
        <section className="relative flex-1 bg-surface-container-low overflow-hidden">
          <div className="absolute inset-0 w-full h-full z-0">
            <MapComponent demands={demands} listings={listings} selectedLocation={selectedLocation} />
          </div>

          {/* Legend Overlay */}
          <div className="absolute top-stack-lg left-stack-lg bg-white/90 backdrop-blur-md border border-outline-variant p-stack-md rounded-xl shadow-xl w-64 z-10">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm">COMMAND FILTERS</h3>
            <div className="flex flex-col gap-unit">
              <label className="flex items-center justify-between p-stack-sm hover:bg-surface-container cursor-pointer rounded-lg transition-colors">
                <div className="flex items-center gap-stack-sm">
                  <span className="w-3 h-3 bg-tertiary rounded-full"></span>
                  <span className="font-body-md text-on-surface">Critical Needs</span>
                </div>
                <input defaultChecked className="rounded border-outline-variant text-tertiary focus:ring-tertiary" type="checkbox"/>
              </label>
              <label className="flex items-center justify-between p-stack-sm hover:bg-surface-container cursor-pointer rounded-lg transition-colors">
                <div className="flex items-center gap-stack-sm">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                  <span className="font-body-md text-on-surface">Surplus Available</span>
                </div>
                <input defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
              </label>
            </div>
          </div>
        </section>

        {/* Right Sidebar */}
        <aside 
          className={`bg-white border-l border-outline-variant flex flex-col h-full transition-all duration-300 relative z-20 ${isSidebarOpen ? 'w-[380px]' : 'w-[0px] border-l-0'}`}
        >
          {/* Collapse Toggle Button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`absolute top-1/2 -translate-y-1/2 w-8 h-12 bg-white border border-outline-variant rounded-l-xl shadow-md flex items-center justify-center hover:bg-surface-variant transition-colors z-50 ${isSidebarOpen ? '-left-4' : '-left-8'}`}
          >
            <span className="material-symbols-outlined text-[20px]">{isSidebarOpen ? 'chevron_right' : 'chevron_left'}</span>
          </button>

          <div className="w-[380px] h-full flex flex-col overflow-hidden">
            {/* Quick Stats Header */}
            <div className="p-stack-md border-b border-outline-variant bg-surface-container-low shrink-0">
              <div className="flex items-center justify-between mb-stack-md">
                <h2 className="font-headline-sm text-headline-sm">Operational Pulse</h2>
                <span className="text-label-caps font-label-caps bg-primary-container text-on-primary-container px-2 py-1 rounded">LIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-stack-md mb-stack-lg shrink-0">
                <div 
                  onClick={() => setActiveFilter(activeFilter === 'needs' ? 'all' : 'needs')}
                  className={`p-stack-md rounded-xl border shadow-sm cursor-pointer transition-all ${activeFilter === 'needs' ? 'bg-error/10 border-error' : 'bg-white border-outline-variant hover:border-error/50'}`}
                >
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">ACTIVE NEEDS</h3>
                  <div className="font-headline-lg text-headline-lg text-error">
                    {demands.length + listings.filter(l => l.food_name?.startsWith('Emergency Report')).length}
                  </div>
                </div>
                <div 
                  onClick={() => setActiveFilter(activeFilter === 'surplus' ? 'all' : 'surplus')}
                  className={`p-stack-md rounded-xl border shadow-sm cursor-pointer transition-all ${activeFilter === 'surplus' ? 'bg-primary/10 border-primary' : 'bg-white border-outline-variant hover:border-primary/50'}`}
                >
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">AVAILABLE SURPLUS</h3>
                  <div className="font-headline-lg text-headline-lg text-primary">
                    {listings.filter(l => !l.food_name?.startsWith('Emergency Report')).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Feed */}
            <div className="flex-1 overflow-y-auto p-stack-md flex flex-col gap-stack-md">
              <div className="flex items-center justify-between">
                <h3 className="font-label-caps text-label-caps text-on-surface-variant">REAL-TIME ACTIVITY</h3>
                <span className="material-symbols-outlined text-[18px] text-outline cursor-pointer">sort</span>
              </div>

              {/* Feed Items */}
              <div className="flex flex-col gap-stack-sm relative">
                {isLocating && (
                  <div className="absolute top-0 left-0 w-full h-full bg-white/70 z-10 flex items-center justify-center backdrop-blur-sm rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 font-bold text-primary">Locating {isLocating}...</span>
                  </div>
                )}
                
                {(activeFilter === 'all' || activeFilter === 'needs') && demands.map(d => (
                  <div 
                    key={d.id} 
                    onClick={async () => {
                      if (d.lat && d.lng && (Math.abs(d.lat - 40.7128) > 0.01 || Math.abs(d.lng - -74.0060) > 0.01)) {
                        setSelectedLocation({ lat: d.lat, lng: d.lng })
                      } else if (d.area) {
                        setIsLocating("Demand")
                        try {
                          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(d.area)}`);
                          const data = await res.json();
                          if (data && data.length > 0) setSelectedLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
                          else alert("Could not find exact location on the map for this address.")
                        } catch (e) { alert("Network error while finding location.") }
                        setIsLocating(null)
                      }
                    }}
                    className="group border-l-4 border-tertiary bg-white border border-outline-variant p-stack-md rounded-r-xl hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-unit">
                      <span className="font-label-caps text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded">DEMAND</span>
                      <span className="font-body-md text-tertiary font-bold">{new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h4 className="font-headline-sm text-[16px] text-on-surface">{d.area || 'General Location'}</h4>
                    <p className="text-body-md text-on-surface-variant mb-stack-md">Need for {d.headcount} people. Urgency: {d.urgency}</p>
                  </div>
                ))}
                
                {listings.map(l => {
                  const isEmergency = l.food_name && l.food_name.startsWith('Emergency Report');
                  
                  if (activeFilter === 'needs' && !isEmergency) return null;
                  if (activeFilter === 'surplus' && isEmergency) return null;

                  return (
                  <div 
                    key={l.id} 
                    onClick={async () => {
                      if (l.lat && l.lng && (Math.abs(l.lat - 40.7128) > 0.01 || Math.abs(l.lng - -74.0060) > 0.01)) {
                        setSelectedLocation({ lat: l.lat, lng: l.lng, title: l.food_name, isEmergency })
                      } else if (l.pickup_address) {
                        setIsLocating("Surplus")
                        try {
                          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(l.pickup_address)}`);
                          const data = await res.json();
                          if (data && data.length > 0) setSelectedLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), title: l.food_name, isEmergency });
                          else alert("Could not find exact location on the map for this address.")
                        } catch (e) { alert("Network error while finding location.") }
                        setIsLocating(null)
                      }
                    }}
                    className={`group border-l-4 ${isEmergency ? 'border-error' : 'border-primary'} bg-white border border-outline-variant p-stack-md rounded-r-xl hover:shadow-md transition-all cursor-pointer`}
                  >
                    <div className="flex justify-between items-start mb-unit">
                      <span className={`font-label-caps ${isEmergency ? 'text-error bg-error/10' : 'text-primary bg-primary-container/30'} px-2 py-0.5 rounded`}>{isEmergency ? 'EMERGENCY' : 'SURPLUS'}</span>
                      <span className="font-body-md text-on-surface-variant">{new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h4 className={`font-headline-sm text-[16px] ${isEmergency ? 'text-error' : 'text-on-surface'}`}>{l.food_name}</h4>
                    <p className="text-body-md text-on-surface-variant">{l.quantity} {l.unit} available at {l.pickup_address}</p>
                  </div>
                )})}

                {demands.length === 0 && listings.length === 0 && (
                  <p className="text-center text-on-surface-variant font-medium mt-4">No active data at the moment.</p>
                )}
              </div>
            </div>
            
            {/* Footer Action */}
            <div className="p-stack-md border-t border-outline-variant bg-surface-container shrink-0">
              <Link href="/auth" className="w-full bg-primary text-on-primary h-14 rounded-xl font-headline-sm flex items-center justify-center gap-stack-md hover:brightness-110 active:scale-[0.98] transition-all shadow-lg">
                <span className="material-symbols-outlined">add_box</span>
                JOIN NETWORK
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
