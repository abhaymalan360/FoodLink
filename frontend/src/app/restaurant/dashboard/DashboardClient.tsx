'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function DashboardClient({ initialListings, initialMatches, userId }: any) {
  const [listings, setListings] = useState(initialListings || [])
  const [matches, setMatches] = useState(initialMatches || [])
  const [editMenuOpen, setEditMenuOpen] = useState<string | null>(null)
  const [editingListing, setEditingListing] = useState<any | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Realtime subscriptions
    const listingSub = supabase
      .channel('listings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'surplus_listings', filter: `restaurant_id=eq.${userId}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setListings((prev: any) => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setListings((prev: any) => prev.map((l: any) => l.id === payload.new.id ? payload.new : l))
        }
      }).subscribe()

    const matchSub = supabase
      .channel('matches_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches', filter: `restaurant_id=eq.${userId}` }, async (payload) => {
        if (payload.eventType === 'INSERT') {
          const { data } = await supabase.from('matches').select('*, demand_requests(ngo_id)').eq('id', payload.new.id).single()
          if(data) setMatches((prev: any) => [data, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setMatches((prev: any) => prev.map((m: any) => m.id === payload.new.id ? { ...m, ...payload.new } : m))
        }
      }).subscribe()

    return () => {
      supabase.removeChannel(listingSub)
      supabase.removeChannel(matchSub)
    }
  }, [userId, supabase])

  const totalMealsSaved = listings.reduce((acc: number, cur: any) => cur.status === 'matched' ? acc + cur.quantity : acc, 0)
  const activeListingsCount = listings.filter((l: any) => l.status === 'available').length

  const activeMatches = matches.filter((m: any) => m.status === 'pending')

  return (
    <main className="pt-stack-md pb-12 px-margin-desktop max-w-[1440px] mx-auto">
      {/* Impact Ticker */}
      <section className="mb-stack-lg bg-primary-container/10 border border-primary/20 rounded-xl px-stack-md py-stack-sm flex items-center justify-between">
        <div className="flex items-center gap-stack-md">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
          <p className="font-body-lg text-body-lg text-primary font-bold">You've saved {totalMealsSaved} meals</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label-caps text-label-caps text-primary bg-primary/10 px-2 py-1 rounded">Top 5% Donor</span>
          <span className="material-symbols-outlined text-primary">trending_up</span>
        </div>
      </section>

      {/* Top Summary Bar */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
        <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex items-center justify-between">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Meals Saved</p>
            <h3 className="font-headline-lg text-headline-lg text-primary">{totalMealsSaved}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">restaurant</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex items-center justify-between">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Active Listings</p>
            <h3 className="font-headline-lg text-headline-lg text-secondary">{activeListingsCount.toString().padStart(2, '0')}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary">inventory_2</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex items-center justify-between">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Matches Completed</p>
            <h3 className="font-headline-lg text-headline-lg text-tertiary">{matches.filter((m:any) => m.status === 'completed').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary">handshake</span>
          </div>
        </div>
      </section>

      {/* Two-Panel Layout */}
      <section className="grid grid-cols-12 gap-gutter mb-stack-lg">
        {/* Left Panel: Current Listings */}
        <div className="col-span-12 lg:col-span-7 space-y-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <div className="px-stack-md py-stack-md border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">pending_actions</span> Current Listing Status
              </h2>
              <Link href="/restaurant/list-surplus" className="bg-primary text-on-primary px-stack-md py-2 rounded-lg font-label-caps text-label-caps hover:bg-primary-container transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add_circle</span> LIST SURPLUS
              </Link>
            </div>
            <div className="p-stack-md space-y-stack-md">
              {listings.filter((l:any) => l.status !== 'matched').length === 0 ? (
                <div className="text-center py-4 text-on-surface-variant">No active surplus listings.</div>
              ) : listings.map((listing: any) => (
                <div key={listing.id} className="group border border-outline-variant rounded-xl p-stack-md hover:border-primary transition-all relative">
                  {listing.status === 'matched' && <div className="absolute top-0 left-0 bg-secondary px-3 py-1 rounded-br-lg font-status-indicator text-status-indicator text-white">MATCHED</div>}
                  <div className="flex justify-between items-start pt-6">
                    <div className="flex gap-stack-md">
                      <div className="w-16 h-16 rounded-lg bg-surface-variant flex-shrink-0 flex items-center justify-center">
                         <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
                      </div>
                      <div>
                        <h4 className="font-headline-sm text-headline-sm text-on-surface">{listing.food_name}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant">{listing.quantity} Servings • Listed {new Date(listing.created_at).toLocaleDateString()}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="material-symbols-outlined text-on-surface-variant text-[16px]">schedule</span>
                          <span className="font-label-caps text-label-caps text-tertiary">Expires in 4h</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right relative">
                      <div className="flex items-center gap-2 justify-end mb-2">
                        <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-label-caps text-label-caps">{listing.status.toUpperCase()}</span>
                        <button 
                          onClick={() => setEditMenuOpen(editMenuOpen === listing.id ? null : listing.id)}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-1"
                        >
                          more_vert
                        </button>
                      </div>
                      
                      {editMenuOpen === listing.id && (
                        <div className="absolute right-0 top-8 bg-white border border-outline-variant rounded-lg shadow-lg z-10 w-32 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                            onClick={() => {
                              setEditingListing(listing);
                              setEditMenuOpen(null);
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-2"
                            onClick={async () => {
                              await supabase.from('surplus_listings').delete().eq('id', listing.id);
                              setListings((prev: any[]) => prev.filter(l => l.id !== listing.id));
                              setEditMenuOpen(null);
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-stack-md bg-surface-container-low text-center">
              <button className="text-primary font-label-caps text-label-caps hover:underline">View all listings</button>
            </div>
          </div>
        </div>

        {/* Right Panel: Active Match Details */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl h-full flex flex-col">
            <div className="px-stack-md py-stack-md border-b border-outline-variant">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                Pickup in Progress
              </h2>
            </div>
            <div className="p-stack-md flex-grow space-y-stack-md">
              {activeMatches.length === 0 ? (
                <div className="text-center py-4 text-on-surface-variant">No active pickups.</div>
              ) : activeMatches.map((match: any) => (
                <div key={match.id} className="border-b border-outline-variant pb-4 mb-4">
                  <div className="bg-primary/5 rounded-xl p-stack-md mb-stack-md border border-primary/10">
                    <div className="flex items-center justify-between mb-stack-md">
                      <span className="font-label-caps text-label-caps text-primary">ETA: 18 MINUTES</span>
                      <span className="material-symbols-outlined text-primary animate-pulse">radio_button_checked</span>
                    </div>
                    <div className="flex items-center gap-stack-md">
                      <div className="w-12 h-12 rounded-full bg-outline-variant flex items-center justify-center">
                         <span className="material-symbols-outlined text-white">person</span>
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-bold">NGO Driver</p>
                        <p className="font-label-caps text-label-caps text-on-surface-variant">Matched User</p>
                      </div>
                      <button className="ml-auto w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">call</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-stack-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">MATCH STATUS</span>
                      <span className="font-body-md text-body-md font-bold uppercase">{match.status}</span>
                    </div>
                    <div className="w-full bg-outline-variant rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-full w-[50%]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Edit Listing Modal */}
      {editingListing && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Edit Listing</h3>
              <button 
                onClick={() => setEditingListing(null)}
                className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
              >
                close
              </button>
            </div>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updates = {
                  food_name: formData.get('food_name'),
                  quantity: parseInt(formData.get('quantity') as string),
                };
                
                const { error } = await supabase
                  .from('surplus_listings')
                  .update(updates)
                  .eq('id', editingListing.id);
                  
                if (!error) {
                  setListings((prev: any[]) => prev.map(l => l.id === editingListing.id ? { ...l, ...updates } : l));
                  setEditingListing(null);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Food Name</label>
                <input 
                  type="text" 
                  name="food_name" 
                  defaultValue={editingListing.food_name} 
                  required 
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Quantity (Servings)</label>
                <input 
                  type="number" 
                  name="quantity" 
                  defaultValue={editingListing.quantity} 
                  required 
                  min="1"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              
              <div className="flex gap-4 pt-4 mt-6 border-t border-outline-variant">
                <button 
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="flex-1 px-4 py-2 rounded-full border border-outline-variant text-on-surface hover:bg-surface-container-low font-label-caps transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-caps transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
