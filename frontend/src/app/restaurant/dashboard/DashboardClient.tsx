'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Utensils, ClipboardList, Handshake, Truck, CheckCircle2, Bike, Package, HandHeart, Clock3, Phone, MoreVertical, Edit2, Trash2, RotateCcw, ListTodo, PlusCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import html2canvas from 'html2canvas'
import { useToastStore } from '@/store/toastStore'
import { useCountUp } from '@/hooks/useCountUp'
import Skeleton from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import StatusDot from '@/components/ui/StatusDot'
import Greeting from '@/components/ui/Greeting'
import DataRefreshBar from '@/components/ui/DataRefreshBar'
import PageTransition from '@/components/ui/PageTransition'

function ListingCountdown({ createdAt, expiresHours = 4, onExpire }: { createdAt: string, expiresHours?: number, onExpire: () => void }) {
  const [timeLeft, setTimeLeft] = useState<{h: number, m: number, s: number} | null>(null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const expireTime = new Date(createdAt).getTime() + expiresHours * 60 * 60 * 1000
    
    const tick = () => {
      const now = new Date().getTime()
      const diff = expireTime - now
      if (diff <= 0) {
        if (!expired) {
          setExpired(true)
          onExpire()
        }
        setTimeLeft({h: 0, m: 0, s: 0})
        return
      }
      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({h, m, s})
    }
    
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [createdAt, expiresHours, expired, onExpire])

  if (!timeLeft) return null
  if (expired) return <span className="font-label-caps text-[11px] text-on-surface-variant">Expired</span>

  const isUnder30m = timeLeft.h === 0 && timeLeft.m < 30
  const isUnder1h = timeLeft.h === 0 && !isUnder30m

  let colorClass = "text-on-surface-variant"
  let animateClass = ""
  if (isUnder30m) {
    colorClass = "text-red-500 font-bold"
    animateClass = "animate-pulse"
  } else if (isUnder1h) {
    colorClass = "text-amber-500 font-bold"
  }

  return (
    <span className={`font-label-caps text-[11px] ${colorClass} ${animateClass}`}>
      Expires in {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
    </span>
  )
}

export default function DashboardClient({ initialListings, initialMatches, userId, profileName }: any) {
  const [listings, setListings] = useState(initialListings || [])
  const [matches, setMatches] = useState(initialMatches || [])
  const [editMenuOpen, setEditMenuOpen] = useState<string | null>(null)
  const [editingListing, setEditingListing] = useState<any | null>(null)
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false)
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false)
  
  // New State for Premium Features
  const [nearestNGOs, setNearestNGOs] = useState<any[]>([])
  const [recentImpact, setRecentImpact] = useState<any[]>([])
  const [monthlyImpactData, setMonthlyImpactData] = useState<any[]>([])
  const [peakHours, setPeakHours] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  
  const addToast = useToastStore((state) => state.addToast)
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

  useEffect(() => {
    // Premium Data Fetching
    const fetchPremiumData = async () => {
      // Recent Impact (Completed Matches)
      const { data: recent } = await supabase
        .from('matches')
        .select('*, surplus_listings(food_name, quantity)')
        .eq('restaurant_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(5);
      if (recent) setRecentImpact(recent);

      // Fetch Real NGOs
      const { data: ngos } = await supabase.from('profiles').select('*').eq('role', 'ngo');
      
      const updateNGOs = (userLat: number | null, userLng: number | null) => {
        if (!ngos || ngos.length === 0) {
          setNearestNGOs([]);
          return;
        }

        const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
          const R = 3958.8; // Radius of the earth in miles
          const dLat = (lat2 - lat1) * (Math.PI / 180);  
          const dLon = (lon2 - lon1) * (Math.PI / 180); 
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          return R * c;
        };

        const ngosWithDistance = ngos.map(ngo => {
          const distance = (userLat && userLng) ? getDistance(userLat, userLng, ngo.lat, ngo.lng) : Infinity;
          return {
            id: ngo.id,
            name: ngo.name || 'NGO Partner',
            distanceVal: distance,
            distance: distance === Infinity ? 'Location not set' : `${distance.toFixed(1)} miles`,
            color: distance < 5 ? "border-l-teal-600" : distance < 15 ? "border-l-amber-500" : "border-l-slate-400"
          };
        }).sort((a, b) => a.distanceVal - b.distanceVal).slice(0, 3);
        
        setNearestNGOs(ngosWithDistance);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            updateNGOs(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
             console.warn("Geolocation denied or error, showing unsorted NGOs.");
             updateNGOs(null, null);
          }
        );
      } else {
         updateNGOs(null, null);
      }

      // Mock Monthly Graph Data (since impact_logs with daily agg isn't natively exposed without RPC)
      setMonthlyImpactData([
        { day: '1', meals: 15 },
        { day: '5', meals: 25 },
        { day: '12', meals: 10 },
        { day: '18', meals: 40 },
        { day: '25', meals: 20 },
      ]);
      
      // Mock Peak Hours
      setPeakHours("Your listings match fastest between 6 PM – 8 PM");
    }
    
    const load = async () => {
      setIsFetching(true)
      try {
        await fetchPremiumData()
      } catch (err) {
        addToast("Failed to load dashboard data", "error")
      } finally {
        setIsFetching(false)
      }
    }
    load()
  }, [userId, supabase]);

  const totalMealsSaved = listings.reduce((acc: number, cur: any) => cur.status === 'matched' ? acc + cur.quantity : acc, 0)
  const activeListingsCount = listings.filter((l: any) => l.status === 'available').length

  const activeMatches = matches.filter((m: any) => m.status === 'pending')

  const { count: animatedMeals, elementRef: mealsRef } = useCountUp(totalMealsSaved)
  const { count: animatedListings, elementRef: listingsRef } = useCountUp(activeListingsCount)
  const { count: animatedMatches, elementRef: matchesRef } = useCountUp(matches.filter((m:any) => m.status === 'completed').length)

  // Derived Premium Metrics
  const today = new Date().toISOString().split('T')[0]
  const listingsToday = listings.filter((l: any) => l.created_at?.startsWith(today)).length
  const matchesToday = matches.filter((m: any) => m.created_at?.startsWith(today)).length
  
  // Streak Calculation (Simplistic mock for demonstration)
  const streak = 3; 
  
  // Badges calculation
  const badges = [];
  if (listings.length > 0) badges.push({ name: "First Listing", desc: "You posted your first surplus listing." });
  if (totalMealsSaved >= 10) badges.push({ name: "10 Meals Saved", desc: "You have saved over 10 meals!" });
  if (totalMealsSaved >= 25) badges.push({ name: "25 Meals Saved", desc: "Incredible, 25 meals saved!" });
  if (matches.filter((m:any) => m.status === 'completed').length >= 5) badges.push({ name: "5 Matches", desc: "5 successful pickups completed." });
  if (totalMealsSaved >= 100) badges.push({ name: "Top Donor", desc: "You are in the top tier of donors." });

  // Share Functionality
  const handleShare = async () => {
    const card = document.createElement('div');
    card.style.position = 'fixed';
    card.style.top = '-9999px';
    card.style.left = '-9999px';
    card.style.width = '600px';
    card.style.padding = '40px';
    card.style.backgroundColor = '#ffffff';
    card.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
        <div>
          <h1 style="color: #0d9488; font-size: 24px; font-weight: bold; margin: 0; display: flex; align-items: center; gap: 8px;">
            FoodLink
          </h1>
        </div>
        <div style="text-align: right;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <div style="margin-bottom: 24px;">
        <p style="color: #64748b; font-size: 16px; margin: 0 0 8px 0;">Impact Report</p>
      </div>
      <div style="margin-bottom: 40px;">
        <h2 style="color: #0d9488; font-size: 64px; font-weight: bold; margin: 0; line-height: 1;">${totalMealsSaved}</h2>
        <p style="color: #64748b; font-size: 18px; margin: 8px 0 0 0;">Total Meals Saved</p>
      </div>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
        <p style="color: #1e293b; font-size: 16px; font-weight: 500; margin: 0;">Thank you for fighting food waste.</p>
      </div>
    `;
    document.body.appendChild(card);
    
    try {
      const canvas = await html2canvas(card, { scale: 2, backgroundColor: '#ffffff' });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'foodlink-impact.png';
      a.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      document.body.removeChild(card);
    }
  };

  return (
    <PageTransition>
    <DataRefreshBar isFetching={isFetching} />
    <main className="pt-stack-md pb-12 px-margin-desktop max-w-[1440px] mx-auto">
      <div className="mb-6">
        <Greeting name={profileName} />
      </div>
      {/* Impact Ticker */}
      <section className="mb-4 bg-primary-container/10 border border-primary/20 rounded-xl px-stack-md py-stack-sm flex items-center justify-between">
        <div className="flex items-center gap-stack-md">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
          <p className="font-body-lg text-body-lg text-primary font-bold">You've saved {totalMealsSaved} meals</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label-caps text-label-caps text-primary bg-primary/10 px-2 py-1 rounded">Top 5% Donor</span>
          <span className="material-symbols-outlined text-primary">trending_up</span>
        </div>
      </section>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {badges.map((b) => (
            <span key={b.name} title={b.desc} className="px-3 py-1 rounded-full border border-teal-600 text-teal-600 text-[11px] font-medium cursor-help interactive-btn">
              {b.name}
            </span>
          ))}
        </div>
      )}

      {/* Today's Summary Bar */}
      <div className="w-full flex items-center gap-4 text-[13px] text-on-surface-variant mb-1">
        <span>{listingsToday} Listings posted today</span>
        <span className="text-outline-variant">|</span>
        <span>{matchesToday} Meals matched today</span>
        <span className="text-outline-variant">|</span>
        <span>Last activity: Just now</span>
      </div>
      
      {/* Streak Counter */}
      {streak > 1 && (
        <div className="text-[12px] text-on-surface-variant mb-stack-lg">
          Listed surplus {streak} days in a row
        </div>
      )}

      {/* Top Summary Bar */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
        <div ref={mealsRef as any} className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex items-center justify-between interactive-card">
          <div>
            <p className="font-label-caps text-[11px] font-bold tracking-wider text-on-surface-variant">Meals Saved</p>
            <h3 className="font-headline-lg text-3xl font-bold text-on-surface mt-1">{animatedMeals}</h3>
          </div>
          <Utensils className="text-teal-600 w-8 h-8" strokeWidth={1.5} />
        </div>
        <div ref={listingsRef as any} className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex items-center justify-between interactive-card">
          <div>
            <p className="font-label-caps text-[11px] font-bold tracking-wider text-on-surface-variant">Active Listings</p>
            <h3 className="font-headline-lg text-3xl font-bold text-on-surface mt-1">{animatedListings.toString().padStart(2, '0')}</h3>
          </div>
          <ClipboardList className="text-teal-600 w-8 h-8" strokeWidth={1.5} />
        </div>
        <div ref={matchesRef as any} className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex items-center justify-between interactive-card">
          <div>
            <p className="font-label-caps text-[11px] font-bold tracking-wider text-on-surface-variant">Matches Completed</p>
            <h3 className="font-headline-lg text-3xl font-bold text-on-surface mt-1">{animatedMatches}</h3>
          </div>
          <Handshake className="text-teal-600 w-8 h-8" strokeWidth={1.5} />
        </div>
      </section>

      {/* Two-Panel Layout */}
      <section className="grid grid-cols-12 gap-gutter mb-stack-lg">
        {/* Left Panel: Current Listings */}
        <div className="col-span-12 lg:col-span-7 space-y-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <div className="px-stack-md py-stack-md border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <ListTodo className="text-teal-600 w-5 h-5" strokeWidth={1.5} /> Current Listing Status
              </h2>
              <Link href="/restaurant/list-surplus" className="bg-primary text-on-primary px-stack-md py-2 rounded-lg font-label-caps text-label-caps hover:bg-primary-container transition-colors flex items-center gap-2">
                <PlusCircle className="w-[18px] h-[18px]" strokeWidth={1.5} /> LIST SURPLUS
              </Link>
            </div>
            <div className="p-stack-md space-y-stack-md">
              {isFetching ? (
                <>
                  <Skeleton variant="card" />
                  <Skeleton variant="card" />
                </>
              ) : listings.filter((l:any) => l.status === 'available').length === 0 ? (
                <EmptyState icon={ClipboardList} heading="No active surplus listings" subtext="Any active donations will be displayed here." />
              ) : listings.filter((l:any) => l.status === 'available').map((listing: any) => (
                <div key={listing.id} className="group border border-outline-variant rounded-xl p-stack-md hover:border-primary interactive-card relative">
                  {listing.status === 'matched' && <div className="absolute top-0 left-0 bg-secondary px-3 py-1 rounded-br-lg font-status-indicator text-status-indicator text-white">MATCHED</div>}
                  <div className="flex justify-between items-start pt-6">
                    <div className="flex gap-stack-md">
                      <div className="w-16 h-16 rounded-lg bg-surface-variant flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-outline-variant/30">
                        <img 
                          src={`https://image.pollinations.ai/prompt/${encodeURIComponent(`A bowl or plate of authentic Indian cooked ${listing.food_name}, simple realistic food photography, pure vegetarian, single dish, no extra items`)}?width=128&height=128&nologo=true`} 
                          alt={listing.food_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-surface-variant">
                          <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[15px] text-on-surface mb-1">{listing.food_name}</h4>
                        <p className="text-[13px] text-on-surface-variant mb-3">
                          {listing.quantity} {listing.unit || 'Servings'} • Listed {new Date(listing.created_at).toLocaleDateString()} at {new Date(listing.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock3 className="text-on-surface-variant w-4 h-4" strokeWidth={1.5} />
                          <ListingCountdown 
                            createdAt={listing.created_at} 
                            onExpire={async () => {
                              await supabase.from('surplus_listings').update({ status: 'expired' }).eq('id', listing.id);
                              setListings((prev: any[]) => prev.map(l => l.id === listing.id ? { ...l, status: 'expired' } : l));
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right relative">
                      <div className="flex items-center gap-3 justify-end mb-2">
                        <Link 
                          href={`/restaurant/list-surplus?food_name=${encodeURIComponent(listing.food_name)}&quantity=${listing.quantity}`}
                          className="opacity-0 group-hover:opacity-100 text-[13px] font-medium text-teal-600 hover:text-teal-700 transition-opacity"
                        >
                          Relist
                        </Link>
                        <div className="flex items-center bg-surface-container-high px-3 py-1 rounded-full font-label-caps text-label-caps">
                          <StatusDot status={listing.status as any} />
                          <span className="text-on-surface-variant">{listing.status.toUpperCase()}</span>
                        </div>
                        <button 
                          onClick={() => setEditMenuOpen(editMenuOpen === listing.id ? null : listing.id)}
                          className="text-on-surface-variant hover:text-teal-600 transition-colors p-1"
                        >
                          <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                      </div>
                      
                      {editMenuOpen === listing.id && (
                        <div className="absolute right-0 top-8 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-10 w-32 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <Link 
                            href={`/restaurant/list-surplus?food_name=${encodeURIComponent(listing.food_name)}&quantity=${listing.quantity}`}
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
                          >
                            <RotateCcw className="w-[16px] h-[16px]" strokeWidth={1.5} /> Relist
                          </Link>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
                            onClick={() => {
                              setEditingListing(listing);
                              setEditMenuOpen(null);
                            }}
                          >
                            <Edit2 className="w-[16px] h-[16px]" strokeWidth={1.5} /> Edit
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2"
                            onClick={async () => {
                              try {
                                await supabase.from('surplus_listings').delete().eq('id', listing.id);
                                setListings((prev: any[]) => prev.filter(l => l.id !== listing.id));
                                addToast('Listing deleted successfully', 'success');
                              } catch (err) {
                                addToast('Failed to delete listing', 'error');
                              }
                              setEditMenuOpen(null);
                            }}
                          >
                            <Trash2 className="w-[16px] h-[16px]" strokeWidth={1.5} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-stack-md bg-surface-container-low text-center">
              <button className="text-primary font-label-caps text-label-caps hover:underline interactive-btn">View all listings</button>
            </div>
          </div>
          
          {/* Nearest NGOs Panel */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden mt-6">
            <div className="px-5 py-4 border-b border-outline-variant">
              <h3 className="font-semibold text-[13px] text-on-surface uppercase tracking-wider">NGOs Near You</h3>
            </div>
            <div className="flex flex-col">
              {isFetching ? (
                <>
                  <Skeleton variant="row" className="mx-5 my-3" />
                  <Skeleton variant="row" className="mx-5 my-3" />
                </>
              ) : nearestNGOs.length === 0 ? (
                <EmptyState icon={CheckCircle2} heading="No NGOs nearby" subtext="No registered NGOs found in your area." />
              ) : nearestNGOs.map((ngo) => (
                <div key={ngo.id} className={`flex justify-between items-center px-5 py-3 border-b border-slate-50 last:border-b-0 border-l-4 ${ngo.color} interactive-row`}>
                  <span className="font-medium text-[13px] text-on-surface">{ngo.name}</span>
                  <span className="text-[12px] text-on-surface-variant">{ngo.distance}</span>
                </div>
              ))}
              <div className="px-5 py-3 bg-surface-container-low border-t border-outline-variant">
                <Link href="/heatmap" className="text-[12px] font-medium text-teal-600 hover:text-teal-700 transition-colors">
                  View all on map
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Active Match Details & Volunteer Banner */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl h-full flex flex-col shadow-sm">
            <div className="px-5 py-4 border-b border-outline-variant">
              <h2 className="font-semibold text-[15px] text-on-surface flex items-center gap-2">
                Pickup in Progress
              </h2>
            </div>
            <div className="p-5 flex-grow flex flex-col">
              {isFetching ? (
                <Skeleton variant="card" />
              ) : activeMatches.length === 0 ? (
                <EmptyState icon={Truck} heading="No active pickups right now" subtext="When an NGO claims your listing, live pickup status appears here" className="py-12 border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-low/50" />
              ) : activeMatches.map((match: any) => {
                // Mock stages logic based on status
                // Status could be 'pending', 'accepted' (on the way), 'picked_up', 'delivered'
                // Based on DB schema, usually pending -> completed. We'll simulate stages.
                const stage = match.status === 'pending' ? 0 : 3;
                
                return (
                <div key={match.id} className="flex flex-col">
                  {/* Top Header */}
                  <div className="mb-6">
                    <h3 className="text-[15px] font-bold text-on-surface">NGO Organization Name</h3>
                    <p className="text-[13px] text-on-surface-variant mt-0.5">{match.surplus_listings?.food_name || 'Surplus Item'} • {match.surplus_listings?.quantity || 'Multiple'} Servings</p>
                  </div>

                  {/* Horizontal Stepper */}
                  <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute top-[11px] left-0 right-0 h-[1px] bg-surface-container-high z-0"></div>
                    {/* Stage 1: Matched */}
                    <div className="flex flex-col items-center gap-2 relative z-10 bg-surface-container-lowest px-2">
                      <CheckCircle2 className="w-[22px] h-[22px] text-teal-600 bg-surface-container-lowest" strokeWidth={1.5} />
                      <span className="text-[10px] font-medium text-on-surface-variant">Matched</span>
                    </div>
                    {/* Stage 2: On the Way */}
                    <div className="flex flex-col items-center gap-2 relative z-10 bg-surface-container-lowest px-2">
                      <Bike className="w-[22px] h-[22px] text-teal-600 bg-surface-container-lowest animate-pulse" strokeWidth={1.5} />
                      <span className="text-[10px] font-medium text-on-surface-variant">On the Way</span>
                    </div>
                    {/* Stage 3: Picked Up */}
                    <div className="flex flex-col items-center gap-2 relative z-10 bg-surface-container-lowest px-2">
                      <Package className="w-[22px] h-[22px] text-outline-variant bg-surface-container-lowest" strokeWidth={1.5} />
                      <span className="text-[10px] font-medium text-outline-variant">Picked Up</span>
                    </div>
                    {/* Stage 4: Delivered */}
                    <div className="flex flex-col items-center gap-2 relative z-10 bg-surface-container-lowest px-2">
                      <HandHeart className="w-[22px] h-[22px] text-outline-variant bg-surface-container-lowest" strokeWidth={1.5} />
                      <span className="text-[10px] font-medium text-outline-variant">Delivered</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock3 className="w-4 h-4 text-on-surface-variant" strokeWidth={1.5} />
                      <span className="text-[13px] text-on-surface-variant">Expected in ~20 mins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-on-surface-variant" strokeWidth={1.5} />
                      <a href="#" className="text-[13px] font-medium text-teal-600 hover:text-teal-700 transition-colors">+1 234 567 8900</a>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={async () => {
                       await supabase.from('matches').update({ status: 'completed' }).eq('id', match.id);
                       setMatches((prev: any[]) => prev.map(m => m.id === match.id ? { ...m, status: 'completed' } : m));
                    }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium text-[13px] py-2.5 rounded-lg transition-colors mt-auto"
                  >
                    Mark as Picked Up
                  </button>
                </div>
              )})}
            </div>
          </div>

          {/* Volunteer Waitlist Banner */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-start gap-3 interactive-card">
            <Bike className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.5} />
            <div className="flex-grow">
              <p className="text-[13px] font-medium text-on-surface">Volunteer delivery network coming soon</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Register interest to be notified when it launches in your city</p>
            </div>
            <button 
              onClick={() => setVolunteerModalOpen(true)}
              className="text-[13px] font-medium text-teal-600 hover:text-teal-700 transition-colors ml-2 interactive-btn"
            >
              Join
            </button>
          </div>

          {/* Recent Impact Feed */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-outline-variant">
              <h3 className="font-semibold text-[13px] text-on-surface uppercase tracking-wider">Recent Impact</h3>
            </div>
            <div className="flex flex-col">
              {isFetching ? (
                <>
                  <Skeleton variant="row" className="mx-5 my-3" />
                  <Skeleton variant="row" className="mx-5 my-3" />
                </>
              ) : recentImpact.length === 0 ? (
                <EmptyState icon={HandHeart} heading="No impact yet" subtext="Your first completed delivery will appear here." />
              ) : recentImpact.map((impact) => (
                <div key={impact.id} className="flex justify-between items-center px-5 py-3 border-b border-slate-50 last:border-b-0 interactive-row">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-[13px] text-on-surface">NGO Partner</span>
                    <span className="text-[12px] text-on-surface-variant">{impact.surplus_listings?.food_name || 'Food'} • {impact.surplus_listings?.quantity || 0} Servings</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[13px] font-medium text-teal-600">{impact.surplus_listings?.quantity || 0} meals</span>
                    <span className="text-[11px] text-outline-variant">{new Date(impact.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Impact Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[13px] text-on-surface uppercase tracking-wider">Your Impact This Month</h3>
              <span className="text-[12px] text-on-surface-variant">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <button onClick={handleShare} className="text-[12px] font-medium text-teal-600 hover:text-teal-700 transition-colors">
              Share
            </button>
          </div>
          
          <div className="h-[200px] w-full">
            {monthlyImpactData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-[12px] text-on-surface-variant border-b border-outline-variant">
                Your impact graph will build as you list surplus food.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyImpactData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                  />
                  <Line type="monotone" dataKey="meals" stroke="#0d9488" strokeWidth={2} dot={{ r: 3, fill: '#0d9488', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Peak Hours Insight Card */}
        <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex flex-col justify-center">
          <h3 className="font-semibold text-[13px] text-on-surface uppercase tracking-wider mb-3">Your Best Time to List</h3>
          {peakHours ? (
            <>
              <p className="text-[15px] font-medium text-on-surface leading-snug">{peakHours}</p>
              <p className="text-[12px] text-on-surface-variant mt-2">Based on your last 10 listings.</p>
            </>
          ) : (
            <p className="text-[13px] text-on-surface-variant">We'll show your peak listing time after 5 matched listings.</p>
          )}
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
      {/* Volunteer Waitlist Modal */}
      {volunteerModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-[320px] w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            {volunteerSubmitted ? (
              <div className="text-center py-4">
                <p className="text-[14px] font-medium text-on-surface">You're on the list.</p>
                <button 
                  onClick={() => { setVolunteerModalOpen(false); setVolunteerSubmitted(false); }}
                  className="mt-4 text-[13px] font-medium text-teal-600 hover:text-teal-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[15px] font-semibold text-on-surface">Join Waitlist</h3>
                  <button 
                    onClick={() => setVolunteerModalOpen(false)}
                    className="material-symbols-outlined text-on-surface-variant hover:text-on-surface-variant transition-colors"
                  >
                    close
                  </button>
                </div>
                
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    await supabase.from('volunteers').insert([{
                      name: formData.get('name'),
                      phone: formData.get('phone'),
                      city: formData.get('city')
                    }]);
                    setVolunteerSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <input type="text" name="name" placeholder="Full Name" required className="w-full border border-outline-variant rounded-lg px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:border-teal-600 transition-colors placeholder:text-on-surface-variant" />
                  </div>
                  <div>
                    <input type="tel" name="phone" placeholder="Phone Number" required className="w-full border border-outline-variant rounded-lg px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:border-teal-600 transition-colors placeholder:text-on-surface-variant" />
                  </div>
                  <div>
                    <input type="text" name="city" placeholder="City" required className="w-full border border-outline-variant rounded-lg px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:border-teal-600 transition-colors placeholder:text-on-surface-variant" />
                  </div>
                  
                  <div className="pt-2">
                    <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium text-[13px] py-2.5 rounded-lg transition-colors">
                      Join
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
    </PageTransition>
  )
}
