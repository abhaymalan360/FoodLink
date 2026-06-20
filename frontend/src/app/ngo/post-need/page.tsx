'use client'

import { useState } from 'react'
import { postNeed } from '../actions'

export default function PostNeedPage() {
  const [loading, setLoading] = useState(false)

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
            {/* Location (Area) */}
            <div className="space-y-stack-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Delivery / Distribution Location (Area)</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-stack-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">location_on</span>
                <input 
                  name="area"
                  required
                  className="w-full pl-12 pr-stack-md py-stack-md bg-surface border-2 border-outline-variant rounded-lg focus:border-primary focus:ring-0 transition-all font-body-md" 
                  placeholder="Enter street address or facility name" 
                  type="text"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
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

              {/* Contact Number (Mock) */}
              <div className="space-y-stack-sm">
                <label className="font-label-caps text-label-caps text-on-surface-variant block">On-Site Coordinator Phone</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-stack-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">call</span>
                  <input 
                    className="w-full pl-12 pr-stack-md py-stack-md bg-surface border-2 border-outline-variant rounded-lg focus:border-primary focus:ring-0 transition-all font-body-md" 
                    placeholder="+1 (555) 000-0000" 
                    type="tel"
                  />
                </div>
              </div>
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
            <input type="hidden" name="lat" value="40.7128" />
            <input type="hidden" name="lng" value="-74.0060" />

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
            <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTnouEPNfUBWWh6buGnbJZW5aU7i36_ZqcsEmpQD-x2zEzWWmvLgV1p7Cq-iReHmrT2MQ0E0MrNu_-q0LIjo4vfdv4CmujhAr2YZzrpVcGi__lF7AImPs1WFxoqSgoIsomxt7BvRdofwdD7Yw8MABPPuWN9gmrxws494jCT60mRK7JXwWYaT-Rpl5GLSomziA73qjQ8flnGCxQIOJfKXVYMnIc_UCLeEsc_u9_evMI7nMKmtN89sJS-Fjs-2gujTBEZxRDTEmfg2Q')" }}></div>
            
            {/* Active Markers (Simulated) */}
            <div className="absolute top-1/4 left-1/3">
              <div className="relative group cursor-pointer">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-unit w-48 bg-white p-stack-sm rounded-lg shadow-lg border border-outline-variant opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="font-label-caps text-label-caps text-primary">Green Grocer Hub</p>
                  <p className="text-[12px] text-on-surface-variant">25kg Fresh Salad Mix</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-1/3 right-1/4">
              <div className="relative group cursor-pointer">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-unit w-48 bg-white p-stack-sm rounded-lg shadow-lg border border-outline-variant opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="font-label-caps text-label-caps text-secondary">Downtown Bakery</p>
                  <p className="text-[12px] text-on-surface-variant">50+ Pastries available</p>
                </div>
              </div>
            </div>
            
            {/* Legend Overlay */}
            <div className="absolute bottom-stack-md left-stack-md bg-white/90 backdrop-blur-sm border border-outline-variant p-stack-sm rounded-lg">
              <h4 className="font-label-caps text-label-caps text-on-surface mb-unit">Nearby Surplus</h4>
              <div className="flex items-center gap-stack-sm">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-[12px] text-on-surface-variant">Verified Partners</span>
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="text-[12px] text-on-surface-variant">Active Surplus</span>
              </div>
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
