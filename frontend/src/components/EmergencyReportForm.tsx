'use client'

import { useState } from 'react'
import { submitEmergencySurplus } from '@/app/impact/actions'

export default function EmergencyReportForm() {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const res = await submitEmergencySurplus(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex-grow bg-inverse-surface text-inverse-on-surface rounded-xl p-stack-md flex flex-col justify-center items-center text-center">
        <span className="material-symbols-outlined text-5xl mb-2 text-primary">check_circle</span>
        <h4 className="font-headline-sm text-headline-sm text-primary">Report Received</h4>
        <p className="font-body-md mt-2">Your emergency surplus has been mapped and nearby NGOs have been notified.</p>
        <button onClick={() => { setSuccess(false); setExpanded(false) }} className="mt-4 text-sm underline text-on-surface-variant hover:text-primary">Submit another</button>
      </div>
    )
  }

  if (!expanded) {
    return (
      <div className="flex-grow bg-inverse-surface text-inverse-on-surface rounded-xl p-stack-md flex flex-col justify-center items-center text-center">
        <span className="material-symbols-outlined text-4xl mb-2">emergency_share</span>
        <h4 className="font-headline-sm text-headline-sm">Surplus Emergency?</h4>
        <p className="font-body-md mt-2 mb-4">Are you a commercial kitchen with more than 15kg of surplus today?</p>
        <button 
          onClick={() => setExpanded(true)} 
          className="w-full bg-error text-onError py-3 rounded-lg font-bold hover:brightness-110 transition-all text-center"
        >
          Report Immediate Surplus
        </button>
      </div>
    )
  }

  return (
    <div className="flex-grow bg-inverse-surface text-inverse-on-surface rounded-xl p-stack-md flex flex-col justify-center items-center text-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h4 className="font-headline-sm text-headline-sm text-left flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">emergency_share</span>
          Emergency Report
        </h4>
        <button onClick={() => setExpanded(false)} className="material-symbols-outlined text-on-surface-variant hover:text-white">close</button>
      </div>
      
      {error && <div className="w-full p-2 bg-error/20 text-error rounded-md text-sm mb-4 border border-error/50">{error}</div>}
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 text-left">
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1 block">Your Name / Organization</label>
          <input required type="text" name="name" className="w-full p-2 rounded bg-surface border border-outline-variant text-on-surface focus:border-primary focus:outline-none" placeholder="e.g. Divya Jyoti Hospital" />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1 block">Phone Number</label>
          <input required type="tel" name="phone" defaultValue="+91 " className="w-full p-2 rounded bg-surface border border-outline-variant text-on-surface focus:border-primary focus:outline-none" placeholder="+91 98765 43210" />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1 block">Exact Location / Address</label>
          <textarea required name="location" className="w-full p-2 rounded bg-surface border border-outline-variant text-on-surface focus:border-primary focus:outline-none min-h-[60px]" placeholder="e.g. Kharar, near bus stand" />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1 block">Quantity (portions / kg)</label>
          <input required type="number" min="1" name="quantity" className="w-full p-2 rounded bg-surface border border-outline-variant text-on-surface focus:border-primary focus:outline-none" placeholder="e.g. 20" />
        </div>
        
        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-error text-onError py-3 rounded-lg font-bold hover:brightness-110 transition-all text-center mt-2 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading ? 'Submitting...' : 'Plot on Map'}
        </button>
      </form>
    </div>
  )
}
