'use client'

import { useState } from 'react'
import { listSurplus } from '../actions'
import dynamic from 'next/dynamic'

const LocationPickerDynamic = dynamic(
  () => import('@/components/Map/LocationPicker'),
  { ssr: false, loading: () => <div className="w-full h-64 bg-surface-variant animate-pulse rounded-lg flex items-center justify-center text-on-surface-variant">Loading Map...</div> }
)

export default function ListSurplusPage() {
  const [loading, setLoading] = useState(false)
  const [lat, setLat] = useState<number>(40.7128)
  const [lng, setLng] = useState<number>(-74.0060)

  return (
    <main className="w-full px-margin-desktop py-stack-lg max-w-[1440px] mx-auto grid grid-cols-12 gap-gutter min-h-screen">
      {/* Left Column: Surplus Form */}
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-lg">
          <div className="mb-stack-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-unit">Report Surplus Food</h2>
            <p className="text-on-surface-variant font-body-md">Fill in the details for the immediate pickup request. Real-time matching is active.</p>
          </div>
          
          <form 
            action={(formData) => {
              setLoading(true)
              listSurplus(formData)
            }}
            className="space-y-stack-lg"
          >
            {/* Section 1: Food Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-unit">
                <label className="font-label-caps text-label-caps text-on-surface-variant">FOOD ITEM NAME</label>
                <input 
                  name="food_name"
                  required
                  className="w-full bg-surface border border-outline-variant p-stack-md rounded-lg font-body-md text-on-surface focus:ring-0 focus:border-primary focus:border-2 transition-all outline-none" 
                  placeholder="e.g. Fresh Artisan Bread Rolls" 
                  type="text"
                />
              </div>
              <div className="space-y-unit">
                <label className="font-label-caps text-label-caps text-on-surface-variant">TYPE / CATEGORY</label>
                <select className="w-full bg-surface border border-outline-variant p-stack-md rounded-lg font-body-md text-on-surface focus:ring-0 focus:border-primary focus:border-2 transition-all outline-none">
                  <option>Bakery & Grains</option>
                  <option>Cooked Meals</option>
                  <option>Produce</option>
                  <option>Dairy & Eggs</option>
                </select>
              </div>
            </div>

            {/* Section 2: Quantity & Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-unit">
                <label className="font-label-caps text-label-caps text-on-surface-variant">ESTIMATED QUANTITY</label>
                <div className="flex items-center">
                  <input 
                    name="quantity"
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    className="w-full bg-surface border border-outline-variant p-stack-md rounded-l-lg font-body-md text-on-surface focus:ring-0 focus:border-primary focus:border-2 transition-all outline-none" 
                    placeholder="25" 
                  />
                  <select
                    name="unit"
                    required
                    className="bg-surface-container-high border-y border-r border-outline-variant p-stack-md rounded-r-lg font-label-caps text-label-caps text-on-surface-variant focus:ring-0 focus:border-primary focus:border-2 transition-all outline-none"
                  >
                    <option value="portions">PORTIONS</option>
                    <option value="kg">KG</option>
                    <option value="lbs">LBS</option>
                    <option value="trays">TRAYS</option>
                  </select>
                </div>
              </div>
              <div className="space-y-unit">
                <label className="font-label-caps text-label-caps text-on-surface-variant">AVAILABLE UNTIL (EXPIRY)</label>
                <div className="relative">
                  <input className="w-full bg-surface border border-outline-variant p-stack-md rounded-lg font-body-md text-on-surface focus:ring-0 focus:border-primary focus:border-2 transition-all outline-none" type="datetime-local"/>
                </div>
              </div>
            </div>

            {/* Section 3: Address & Handling */}
            <div className="space-y-unit">
              <label className="font-label-caps text-label-caps text-on-surface-variant">PICKUP ADDRESS & SPECIAL INSTRUCTIONS</label>
              <textarea 
                name="pickup_address"
                required
                className="w-full bg-surface border border-outline-variant p-stack-md rounded-lg font-body-md text-on-surface focus:ring-0 focus:border-primary focus:border-2 transition-all outline-none" 
                placeholder="Kitchen Rear Entrance, Loading Bay B. Mention 'FoodLink' at the gate." 
                rows={3}
              ></textarea>
            </div>

            {/* Hidden Coordinates */}
            <input type="hidden" name="lat" value={lat} />
            <input type="hidden" name="lng" value={lng} />

            {/* Map Location Picker */}
            <div className="space-y-unit">
              <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center justify-between">
                <span>PINPOINT PICKUP LOCATION</span>
                <span className="text-[10px] text-primary lowercase tracking-normal">Click map to move pin</span>
              </label>
              <LocationPickerDynamic onLocationSelect={(newLat: number, newLng: number) => {
                setLat(newLat)
                setLng(newLng)
              }} />
            </div>

            {/* Urgency Level Selection (Visual only for now) */}
            <div className="space-y-stack-md">
              <label className="font-label-caps text-label-caps text-on-surface-variant">URGENCY STATUS</label>
              <div className="grid grid-cols-3 gap-stack-md">
                <button className="flex flex-col items-center justify-center p-stack-md border-2 border-primary bg-primary-container/10 rounded-xl transition-all" type="button">
                  <span className="material-symbols-outlined text-primary mb-unit" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  <span className="font-label-caps text-label-caps text-primary">CRITICAL</span>
                  <span className="text-[10px] text-primary/80">Immediate Pickup</span>
                </button>
                <button className="flex flex-col items-center justify-center p-stack-md border border-outline-variant bg-surface rounded-xl hover:border-secondary transition-all" type="button">
                  <span className="material-symbols-outlined text-secondary mb-unit">schedule</span>
                  <span className="font-label-caps text-label-caps text-on-secondary-fixed-variant">STABLE</span>
                  <span className="text-[10px] text-on-surface-variant">Within 3 Hours</span>
                </button>
                <button className="flex flex-col items-center justify-center p-stack-md border border-outline-variant bg-surface rounded-xl hover:border-outline transition-all" type="button">
                  <span className="material-symbols-outlined text-outline mb-unit">inventory_2</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">END OF DAY</span>
                  <span className="text-[10px] text-on-surface-variant">Flexible</span>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-stack-lg">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-on-primary font-headline-sm text-headline-sm py-stack-md rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-stack-sm disabled:opacity-50"
              >
                <span className="material-symbols-outlined">add_circle</span>
                {loading ? 'Posting...' : 'Post Surplus Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Live NGO Match Feed */}
      <div className="col-span-12 lg:col-span-4 space-y-gutter">
        <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-lg sticky top-24">
          <div className="flex items-center justify-between mb-stack-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Active NGO Needs</h3>
            <div className="flex items-center gap-unit px-stack-sm py-1 bg-tertiary-container text-on-tertiary-container rounded-full animate-pulse">
              <span className="w-2 h-2 bg-on-tertiary-container rounded-full"></span>
              <span class="text-[10px] font-bold">LIVE</span>
            </div>
          </div>
          
          {/* Live Feed List */}
          <div className="space-y-stack-md">
            <div className="p-stack-md border border-outline-variant rounded-lg bg-surface hover:border-primary transition-all group">
              <div className="flex justify-between items-start mb-unit">
                <span className="font-status-indicator text-status-indicator px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded">STREET HEALERS</span>
                <span className="text-tertiary font-label-caps text-label-caps">0.4 MILES</span>
              </div>
              <p className="font-body-md text-on-surface font-semibold mb-stack-sm">Require Cooked Meals for 50 people</p>
              <div className="flex items-center gap-stack-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">alarm</span>
                <span className="text-xs font-label-caps">URGENT: CLOSES IN 42 MIN</span>
              </div>
            </div>
            
            <div className="p-stack-md border border-outline-variant rounded-lg bg-surface hover:border-primary transition-all group">
              <div className="flex justify-between items-start mb-unit">
                <span className="font-status-indicator text-status-indicator px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded">CITY SHELTER WEST</span>
                <span className="text-on-surface-variant font-label-caps text-label-caps">1.2 MILES</span>
              </div>
              <p className="font-body-md text-on-surface font-semibold mb-stack-sm">Fresh Produce or Bread Surplus</p>
              <div className="flex items-center gap-stack-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="text-xs font-label-caps">STABLE: NEED UNTIL 9PM</span>
              </div>
            </div>
            
            <div className="p-stack-md border border-outline-variant rounded-lg bg-surface hover:border-primary transition-all group opacity-75">
              <div className="flex justify-between items-start mb-unit">
                <span className="font-status-indicator text-status-indicator px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded">YOUTH ALLIANCE</span>
                <span className="text-on-surface-variant font-label-caps text-label-caps">2.1 MILES</span>
              </div>
              <p className="font-body-md text-on-surface font-semibold mb-stack-sm">Snacks & Dry Goods</p>
              <div className="flex items-center gap-stack-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="text-xs font-label-caps">STABLE: OPEN 24/7</span>
              </div>
            </div>
          </div>
          
          {/* Real-time Status Card */}
          <div className="mt-stack-lg p-stack-md bg-primary-container/10 border-l-4 border-primary rounded-r-lg">
            <div className="flex gap-stack-md items-start">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <div>
                <p className="font-label-caps text-label-caps text-primary mb-1">DASHBOARD INSIGHT</p>
                <p className="text-xs text-on-surface-variant leading-tight">Your current surplus of "Bakery & Grains" has a 94% match rate with nearby needs. Posting now ensures pickup within 15 minutes.</p>
              </div>
            </div>
          </div>
          
          {/* Local Activity Map Placeholder */}
          <div className="mt-stack-lg rounded-xl overflow-hidden h-40 relative group cursor-pointer border border-outline-variant">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMz_lHo9qmXPZ5VO8Re9TueNTIkBxeIiXhIUSa-Utdd1RTe3um5XDgPTXkrh0N08i5tWlsZ3S3XA6jhMjwKKcxw60a_rLyrMHCu1b3IFYEtjvVgZ-8LaarJI99ObpnQsONaB9W_tfU4FDgRpn_y9imbQzA_HSOcsCtG3Hc6lzkbk1O3TZMqSnsmZb5ZXUGN9RrX8OdFx8pDUbltn9Wdy6vtZWKq_prBkG0ATLMj8bJQq7KgkSpX3zV_vTRNPYrOK4p70jRdQC-oZY')" }}></div>
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-all flex items-center justify-center">
              <div className="bg-surface-container-lowest px-stack-md py-stack-sm rounded-full shadow-lg flex items-center gap-unit">
                <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                <span className="font-label-caps text-[10px] text-on-surface">VIEW NETWORK MAP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
