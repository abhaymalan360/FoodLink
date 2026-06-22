'use client'

import { useEffect, useState } from 'react'
import MobileMenu from '@/components/MobileMenu'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function FindOpportunities() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [claimedId, setClaimedId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('surplus_listings')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
      
      if (data) setOpportunities(data)
      setLoading(false)
    }
    fetchData()
  }, [supabase])

  const handleClaim = (id: string) => {
    // For now, mock the claiming interaction
    setClaimedId(id)
    setTimeout(() => {
      setOpportunities(prev => prev.filter(o => o.id !== id))
      setClaimedId(null)
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-surface md:bg-surface-container pb-20 md:pb-0">
      <header className="bg-primary text-on-primary sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileMenu />
            <h1 className="font-headline-md text-headline-md font-bold">Find Opportunities</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 mt-4">
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          <button className="shrink-0 bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-md font-bold border border-primary/20">All Tasks</button>
          <button className="shrink-0 bg-surface text-on-surface-variant px-4 py-2 rounded-full font-label-md border border-outline-variant hover:bg-surface-variant transition-colors">Nearby</button>
          <button className="shrink-0 bg-surface text-on-surface-variant px-4 py-2 rounded-full font-label-md border border-outline-variant hover:bg-surface-variant transition-colors">Urgent</button>
          <button className="shrink-0 bg-surface text-on-surface-variant px-4 py-2 rounded-full font-label-md border border-outline-variant hover:bg-surface-variant transition-colors">Large Vehicle</button>
        </div>

        {/* Opportunity Feed */}
        {loading ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center p-10 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">done_all</span>
            <h3 className="font-headline-sm text-on-surface font-bold">No Active Tasks!</h3>
            <p className="text-on-surface-variant mt-2">All surplus has been successfully delivered. Check back soon!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {opportunities.map(opp => {
              const isEmergency = opp.food_name?.startsWith('Emergency Report')
              const isClaiming = claimedId === opp.id
              
              return (
                <div key={opp.id} className={`bg-surface-container-lowest rounded-xl shadow-sm border ${isEmergency ? 'border-error/50' : 'border-outline-variant'} overflow-hidden relative transition-all ${isClaiming ? 'opacity-50 scale-[0.98]' : ''}`}>
                  {isClaiming && (
                    <div className="absolute inset-0 bg-surface-container-lowest/80 z-10 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-primary text-on-primary px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-bounce">
                        <span className="material-symbols-outlined">check_circle</span>
                        Task Claimed!
                      </div>
                    </div>
                  )}
                  
                  <div className={`h-2 w-full ${isEmergency ? 'bg-error' : 'bg-primary'}`}></div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      {isEmergency ? (
                        <span className="font-label-caps text-error bg-error/10 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">emergency</span> URGENT PICKUP
                        </span>
                      ) : (
                        <span className="font-label-caps text-primary bg-primary-container/30 px-2 py-0.5 rounded text-xs">STANDARD PICKUP</span>
                      )}
                      <span className="font-body-sm text-on-surface-variant">
                        {new Date(opp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <h3 className={`font-headline-sm ${isEmergency ? 'text-error' : 'text-on-surface'} font-bold mb-1`}>{opp.food_name}</h3>
                    <p className="font-body-md text-on-surface-variant mb-4">
                      {opp.quantity} {opp.unit} • Est. weight: {opp.quantity * 0.5}kg
                    </p>
                    
                    <div className="bg-surface-variant/30 rounded-lg p-3 mb-4 flex flex-col gap-2">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">store</span>
                        <div>
                          <p className="font-label-sm font-bold text-on-surface">Pickup</p>
                          <p className="font-body-sm text-on-surface-variant truncate">{opp.pickup_address}</p>
                        </div>
                      </div>
                      <div className="ml-[9px] w-0.5 h-3 bg-outline-variant"></div>
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">location_on</span>
                        <div>
                          <p className="font-label-sm font-bold text-on-surface">Dropoff</p>
                          <p className="font-body-sm text-on-surface-variant">Local NGO Hub (TBD)</p>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleClaim(opp.id)}
                      className={`w-full py-3 rounded-lg font-bold transition-all ${isEmergency ? 'bg-error text-onError hover:brightness-110' : 'bg-primary text-on-primary hover:brightness-110'}`}
                    >
                      {isEmergency ? 'Claim Urgent Task' : 'Claim Task'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
