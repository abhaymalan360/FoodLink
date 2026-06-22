'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToastStore } from '@/store/toastStore'
import { useCountUp } from '@/hooks/useCountUp'
import Skeleton from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import StatusDot from '@/components/ui/StatusDot'
import DataRefreshBar from '@/components/ui/DataRefreshBar'
import PageTransition from '@/components/ui/PageTransition'
import { Navigation, FileSearch, Search } from 'lucide-react'

export default function DashboardClient({ initialDemands, initialMatches, userId }: any) {
  const [demands, setDemands] = useState(initialDemands || [])
  const [matches, setMatches] = useState(initialMatches || [])
  const [isFetching, setIsFetching] = useState(false)
  const addToast = useToastStore((state) => state.addToast)
  const supabase = createClient()

  useEffect(() => {
    // Realtime subscriptions
    const demandSub = supabase
      .channel('demand_requests_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'demand_requests', filter: `ngo_id=eq.${userId}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setDemands((prev: any) => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setDemands((prev: any) => prev.map((d: any) => d.id === payload.new.id ? payload.new : d))
        }
      }).subscribe()

    const matchSub = supabase
      .channel('matches_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches', filter: `ngo_id=eq.${userId}` }, async (payload) => {
        if (payload.eventType === 'INSERT') {
          const { data } = await supabase.from('matches').select('*, surplus_listings(food_name, pickup_address)').eq('id', payload.new.id).single()
          if(data) setMatches((prev: any) => [data, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setMatches((prev: any) => prev.map((m: any) => m.id === payload.new.id ? { ...m, ...payload.new } : m))
        }
      }).subscribe()

    return () => {
      supabase.removeChannel(demandSub)
      supabase.removeChannel(matchSub)
    }
  }, [userId, supabase])

  const confirmPickup = async (matchId: string) => {
    try {
      await supabase.from('matches').update({ status: 'completed' }).eq('id', matchId)
      addToast('Pickup confirmed!', 'success')
    } catch (error) {
      addToast('Failed to confirm pickup', 'error')
    }
  }

  const activeDemand = demands[0] // take the latest for the active need card
  const { count: animatedImpact, elementRef: impactRef } = useCountUp(8241)

  return (
    <PageTransition>
    <DataRefreshBar isFetching={isFetching} />
    <main className="p-margin-desktop grid grid-cols-12 gap-gutter max-w-[1440px] mx-auto">
      {/* COLUMN 1: ACTIVE NEED STATUS */}
      <div className="col-span-12 lg:col-span-3 space-y-stack-lg">
        <div className="w-full">
          <a href="/ngo/post-need" className="w-full py-4 bg-primary text-on-primary font-headline-sm rounded-xl hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 interactive-btn">
            <span className="material-symbols-outlined text-[24px]">add_circle</span> 
            <span>Post New Need</span>
          </a>
        </div>
        {activeDemand ? (
            <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-md overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
            <div className="flex justify-between items-start mb-stack-md">
                <span className="bg-secondary-container text-on-secondary-container font-status-indicator text-status-indicator px-2 py-0.5 rounded">
                    ACTIVE NEED
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">LVL 2</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg mb-unit">{activeDemand.headcount} People</h3>
            <p className="text-on-surface-variant font-body-md mb-stack-lg">Seeking surplus food in <span className="font-bold text-on-surface">{activeDemand.area}</span>. Urgency: {activeDemand.urgency}.</p>
            <div className="space-y-stack-md">
                <div className="flex items-center justify-between text-body-md">
                <span className="text-on-surface-variant">Status</span>
                <span className="font-bold">{activeDemand.status.toUpperCase()}</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: activeDemand.status === 'matched' ? '100%' : '30%' }}></div>
                </div>
            </div>
            <button className="w-full mt-stack-lg py-4 border-2 border-dashed border-outline text-on-surface-variant hover:border-primary hover:text-primary transition-all rounded-lg font-headline-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">edit</span> Update Request
            </button>
            </section>
        ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl">
              <EmptyState icon={FileSearch} heading="No active requests" subtext="Create a new demand request to start matching." />
            </div>
        )}

        <section className="bg-surface-container-low p-stack-md rounded-lg">
          <h4 className="font-label-caps text-label-caps mb-stack-md text-on-surface-variant">OPERATIONAL MAP</h4>
          <div className="aspect-square bg-surface-variant rounded-lg overflow-hidden border border-outline-variant relative group">
            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTha8QkaN9UbJhkN_axeOJ_YkcxtTKHdOIQ5WJ4X7_Ixqj9JN_Go0Z5TgpOSLSdfrQPRNvzPWoS1F0WiehezNi5ir8i6Ax4Rl82L3FfAkm_1oOBQAJWWW6gl6uHebAZUMHjB_bOeKRWRxlhZh72D54blTfZA8zd65Al2Az_WE4z9DEoVb8Uj96eHsrXSdcT8KtR_2aj0vqE8bdcs81R4lfJEIaRKZyp6W0fUQlRCSOMcSleoUkk6htt8G9aj-17X5lCOtKenwkP7A')" }}></div>
            <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="material-symbols-outlined text-tertiary text-4xl animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </div>
          </div>
        </section>
      </div>

      {/* COLUMN 2: INCOMING MATCHES FEED */}
      <div className="col-span-12 lg:col-span-6">
        <div className="flex items-center justify-between mb-stack-lg">
          <h3 className="font-headline-md text-headline-md text-on-surface">Incoming Deliveries</h3>
          <div className="flex gap-stack-sm">
            <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-caps text-label-caps">{matches.length} MATCHES FOUND</span>
          </div>
        </div>

        <div className="space-y-stack-md">
          {matches.map((match: any) => (
            <div key={match.id} className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg transition-colors group interactive-card ${match.status === 'completed' ? 'opacity-80' : 'hover:border-primary'}`}>
              <div className="flex justify-between items-start mb-stack-md">
                <div className="flex items-center gap-stack-md">
                  <div className="w-12 h-12 rounded bg-surface-variant flex items-center justify-center relative overflow-hidden flex-shrink-0 border border-outline-variant/30">
                    <img 
                      src={`https://image.pollinations.ai/prompt/${encodeURIComponent(`A bowl or plate of authentic Indian cooked ${match.surplus_listings?.food_name || 'food'}, simple realistic food photography, pure vegetarian, single dish, no extra items`)}?width=128&height=128&nologo=true`} 
                      alt={match.surplus_listings?.food_name || 'food'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 -z-10 flex items-center justify-center bg-surface-variant">
                      <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm">{match.surplus_listings?.food_name || 'Surplus Food'}</h4>
                    <div className="flex items-center gap-1 text-on-surface-variant text-body-md">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>Status: <span className="text-tertiary font-bold uppercase">{match.status}</span></span>
                    </div>
                  </div>
                </div>
                <span className="font-label-caps text-label-caps bg-surface-container px-2 py-1 rounded">MATCHED</span>
              </div>
              <div className="bg-surface-container-low p-stack-md rounded mb-stack-lg border-l-4 border-primary">
                <p className="text-on-surface-variant italic font-body-md text-sm">Pickup Address: {match.surplus_listings?.pickup_address}</p>
              </div>
              <div className="flex gap-stack-md">
                {match.status === 'pending' ? (
                  <button onClick={() => confirmPickup(match.id)} className="flex-1 py-4 bg-primary text-on-primary font-headline-sm rounded-lg hover:bg-primary-container hover:text-on-primary-container interactive-btn flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span> Confirm Pickup
                  </button>
                ) : (
                  <button disabled className="flex-1 py-4 bg-surface-variant text-on-surface-variant font-headline-sm rounded-lg cursor-not-allowed opacity-50 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">task_alt</span> Picked Up
                  </button>
                )}
                <button className="w-14 h-14 border border-outline rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/20 interactive-btn">
                  <Navigation className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}

          {matches.length === 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl">
              <EmptyState icon={Search} heading="Scanning for matches" subtext="Active supply will appear here as soon as it is matched." />
            </div>
          )}
        </div>
      </div>

      {/* COLUMN 3: HISTORY & ANALYTICS */}
      <div className="col-span-12 lg:col-span-3 space-y-stack-lg">
        {/* IMPACT CARD */}
        <section ref={impactRef as any} className="bg-primary text-on-primary rounded-xl p-stack-lg shadow-xl relative overflow-hidden interactive-card">
          <div className="relative z-10">
            <h4 className="font-label-caps text-label-caps mb-stack-md opacity-80 uppercase tracking-widest">Global Impact Score</h4>
            <div className="flex items-baseline gap-2 mb-stack-sm">
              <span className="font-headline-lg text-[40px] leading-none">{animatedImpact.toLocaleString()}</span>
              <span className="font-body-md">meals saved</span>
            </div>
            <p className="text-on-primary/70 text-sm mb-stack-md font-body-md">You're in the top 5% of community partners this month.</p>
            <div className="w-full bg-surface-container-lowest/20 h-1 rounded-full">
              <div className="bg-surface-container-lowest h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </section>

        {/* SYSTEM HEALTH */}
        <div className="bg-surface-container-low border border-outline-variant rounded-lg p-stack-md">
          <div className="flex items-center gap-stack-sm mb-stack-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-label-caps text-label-caps text-on-surface">LIVE LOGISTICS FEED</span>
          </div>
          <div className="text-[12px] text-on-surface-variant font-mono space-y-1">
            <p>&gt; Connected to Logistics Relay</p>
            <p>&gt; Sync Heartbeat: OK</p>
            <p>&gt; Data Latency: 24ms</p>
          </div>
        </div>
      </div>
    </main>
    </PageTransition>
  )
}
