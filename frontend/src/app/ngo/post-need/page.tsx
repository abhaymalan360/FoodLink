'use client'

import { useState, useEffect } from 'react'
import { postNeed } from '../actions'
import dynamic from 'next/dynamic'

const LiveMap = dynamic(
  () => import('@/components/Map/LeafletMap'),
  {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-primary font-bold animate-pulse">Loading Map...</div>
  }
)

const LocationPickerDynamic = dynamic(
  () => import('@/components/Map/LocationPicker'),
  { ssr: false, loading: () => <div className="w-full h-64 bg-surface-variant animate-pulse rounded-lg flex items-center justify-center text-on-surface-variant">Loading Map...</div> }
)

export default function PostNeedPage() {
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [lat, setLat] = useState('20.5937')
  const [lng, setLng] = useState('78.9629')

  useEffect(() => {
    if (address.length < 1) {
      setSuggestions([])
      return
    }
    if (!showSuggestions) return

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=10`)
        const data = await res.json()
        setSuggestions(data)
      } catch (err) {
        console.error(err)
      }
    }, 300) // Reduced debounce time for snappier experience
    return () => clearTimeout(timer)
  }, [address, showSuggestions])

  return (
    <main className="w-full px-margin-desktop py-stack-lg max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-7xl mx-auto">
        {/* Left Column: Demand Reporting Form */}
        <section className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-lg">
          <header>
            <div className="flex items-center gap-stack-sm mb-unit">
              <span className="inline-block px-stack-md py-unit bg-tertiary-container text-on-tertiary-container font-status-indicator text-status-indicator rounded-lg">High Demand Area</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">Report Food Need</h2>
            <p className="text-on-surface-variant font-body-md">Connect surplus food from nearby partners to your community's immediate needs. Accurate reports ensure faster coordination.</p>
          </header>

          <form 
            action={(formData) => {
              setLoading(true)
              postNeed(formData)
            }} 
            className="space-y-stack-lg"
          >
            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              <div className="space-y-stack-sm">
                <label className="font-label-caps text-label-caps text-on-surface-variant block">Coordinator Name</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-stack-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">person</span>
                  <input 
                    name="contact_name"
                    required
                    className="w-full pl-12 pr-stack-md py-stack-md bg-surface border-2 border-outline-variant rounded-lg focus:border-primary focus:ring-0 transition-all font-body-md" 
                    placeholder="e.g. John Doe" 
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-stack-sm">
                <label className="font-label-caps text-label-caps text-on-surface-variant block">Coordinator Phone</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-stack-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">call</span>
                  <input 
                    name="phone"
                    required
                    className="w-full pl-12 pr-stack-md py-stack-md bg-surface border-2 border-outline-variant rounded-lg focus:border-primary focus:ring-0 transition-all font-body-md" 
                    placeholder="+91 98765 43210" 
                    defaultValue="+91 "
                    type="tel"
                  />
                </div>
              </div>
            </div>

            {/* People Count (Headcount) */}
            <div className="space-y-stack-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Estimated People to Serve</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-stack-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">groups</span>
                <input 
                  name="headcount"
                  required
                  min="1"
                  className="w-full pl-12 pr-stack-md py-stack-md bg-surface border-2 border-outline-variant rounded-lg focus:border-primary focus:ring-0 transition-all font-body-md" 
                  placeholder="e.g. 150" 
                  type="number"
                />
              </div>
            </div>

            {/* Location (Area) */}
            <div className="space-y-stack-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Delivery / Distribution Location (Area)</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-stack-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">location_on</span>
                <input 
                  name="area"
                  required
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() => {
                    if (address.length >= 1) setShowSuggestions(true)
                  }}
                  autoComplete="off"
                  className="w-full pl-12 pr-stack-md py-stack-md bg-surface border-2 border-outline-variant rounded-lg focus:border-primary focus:ring-0 transition-all font-body-md" 
                  placeholder="Enter street address or facility name" 
                  type="text"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-50 w-full bg-surface-container-lowest border border-outline-variant rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {suggestions.map((s, i) => (
                      <li 
                        key={i} 
                        className="px-4 py-3 hover:bg-surface-variant/20 cursor-pointer text-sm text-on-surface border-b last:border-0 border-outline-variant/50 flex flex-col"
                        onClick={() => {
                          setAddress(s.display_name)
                          setLat(s.lat)
                          setLng(s.lon)
                          setShowSuggestions(false)
                        }}
                      >
                        <span className="font-semibold truncate">{s.name || s.display_name.split(',')[0]}</span>
                        <span className="text-xs text-on-surface-variant truncate">{s.display_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Map Location Picker */}
            <div className="space-y-unit">
              <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center justify-between">
                <span>PINPOINT EXACT LOCATION</span>
                <span className="text-[10px] text-primary lowercase tracking-normal">Click map to move pin</span>
              </label>
              <LocationPickerDynamic onLocationSelect={(newLat: number, newLng: number) => {
                setLat(newLat)
                setLng(newLng)
              }} />
            </div>

            {/* Urgency Level */}
            <div className="space-y-stack-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Urgency Level</label>
              <div className="grid grid-cols-3 gap-stack-sm">
                <label className="cursor-pointer">
                  <input defaultChecked className="hidden peer" name="urgency" value="moderate" type="radio"/>
                  <div className="flex flex-col items-center gap-unit p-stack-md rounded-lg border-2 border-outline-variant bg-surface hover:bg-surface-variant/20 transition-all peer-checked:border-primary-container peer-checked:bg-primary-container/10">
                    <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                    <span className="font-label-caps text-label-caps">Standard</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input className="hidden peer" name="urgency" value="urgent" type="radio"/>
                  <div className="flex flex-col items-center gap-unit p-stack-md rounded-lg border-2 border-outline-variant bg-surface hover:bg-surface-variant/20 transition-all peer-checked:border-secondary-container peer-checked:bg-secondary-container/10">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                    <span className="font-label-caps text-label-caps">Urgent</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input className="hidden peer" name="urgency" value="critical" type="radio"/>
                  <div className="flex flex-col items-center gap-unit p-stack-md rounded-lg border-2 border-outline-variant bg-surface hover:bg-surface-variant/20 transition-all peer-checked:border-tertiary-container peer-checked:bg-tertiary-container/10">
                    <span className="material-symbols-outlined text-tertiary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                    <span className="font-label-caps text-label-caps">Critical</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Hidden Coordinates */}
            <input type="hidden" name="lat" value={lat} />
            <input type="hidden" name="lng" value={lng} />

            {/* CTA */}
            <div className="pt-stack-md border-t border-outline-variant">
              <button 
                disabled={loading}
                className="w-full bg-primary text-on-primary font-headline-sm text-headline-sm py-stack-md rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-stack-sm disabled:opacity-50" 
                type="submit"
              >
                <span className="material-symbols-outlined">rocket_launch</span>
                {loading ? 'Processing...' : 'Post Need Now'}
              </button>
              <p className="text-center font-label-caps text-label-caps text-on-surface-variant mt-stack-md">Verification code will be sent to the on-site number provided.</p>
            </div>
          </form>
        </section>

        {/* Right Column: Live Map & Activity */}
        <aside className="lg:col-span-5 flex flex-col gap-gutter">
          {/* Map Container */}
          <div className="relative h-[480px] bg-surface-dim border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="absolute inset-0 w-full h-full z-0">
              <LiveMap demands={[]} listings={[]} selectedLocation={null} />
            </div>
          </div>

          {/* Recent Activity / Nearby Feed */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-stack-md overflow-hidden">
            <div className="flex justify-between items-center mb-stack-md">
              <h3 className="font-headline-sm text-headline-sm">Nearby Availability</h3>
              <span className="material-symbols-outlined text-primary">refresh</span>
            </div>
            <div className="space-y-stack-sm">
              <div className="bg-surface-container-lowest p-stack-md rounded-lg border border-outline-variant flex items-center justify-between hover:border-primary transition-all group">
                <div className="flex gap-stack-md">
                  <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">bakery_dining</span>
                  </div>
                  <div>
                    <h4 className="font-body-md font-semibold text-on-surface">Whole Grain Breads</h4>
                    <p className="text-[14px] text-on-surface-variant">Artisan Bakery • 0.8 miles away</p>
                  </div>
                </div>
                <button className="px-stack-md py-unit bg-primary-container text-on-primary-container rounded font-label-caps text-label-caps group-hover:bg-primary group-hover:text-white transition-colors">Claim</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
