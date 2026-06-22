'use client'

import { useState } from 'react'
import { saveVolunteerProfile } from '@/app/volunteer/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Chandigarh','Delhi','Jammu & Kashmir','Ladakh',
  'Lakshadweep','Puducherry'
]

const STEPS = ['Personal', 'Address', 'Availability']

export default function VolunteerOnboarding() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', phone: '', permanent_address: '',
    state: '', pincode: '', availability: ''
  })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setError(null)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    const res = await saveVolunteerProfile(fd)
    if (res?.error) { setError(res.error); setLoading(false) }
    else router.push('/volunteer/dashboard')
  }

  const canNext = [
    form.name.trim() && form.phone.trim(),
    form.permanent_address.trim() && form.state && form.pincode.length === 6,
    !!form.availability
  ]

  return (
    <main className="min-h-screen bg-surface-container-high flex flex-col">

      {/* Top bar */}
      <div className="bg-primary px-6 pt-10 pb-16 text-on-primary relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-surface-container-lowest/10"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-surface-container-high rounded-t-[32px]"></div>
        <div className="flex items-center justify-between mb-5 relative z-10">
          <p className="font-medium text-on-primary/70 text-sm">FoodLink Volunteer Network</p>
          <Link href="/"
            className="flex items-center gap-1.5 bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-on-primary text-xs font-semibold px-3 py-1.5 rounded-full transition-all">
            <span className="material-symbols-outlined text-[15px]">home</span>
            Back to Home
          </Link>
        </div>
        <h1 className="font-bold text-3xl relative z-10">Set up your<br/>volunteer profile</h1>
      </div>

      {/* Step pills */}
      <div className="flex items-center justify-center gap-0 px-8 -mt-1 mb-6">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${i < step ? 'bg-primary text-on-primary' : i === step ? 'bg-primary text-on-primary ring-4 ring-primary/20' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant'}`}>
                {i < step ? <span className="material-symbols-outlined text-[16px]">check</span> : i + 1}
              </div>
              <p className={`text-[10px] font-bold mt-1 ${i === step ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</p>
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-1 mb-4 rounded transition-all ${i < step ? 'bg-primary' : 'bg-outline-variant'}`}></div>}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="flex-1 px-4 pb-8">
        <form onSubmit={handleSubmit}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-5 max-w-lg mx-auto">

            {/* Step 0 – Personal */}
            {step === 0 && (
              <>
                <div>
                  <h2 className="font-bold text-on-surface text-lg mb-0.5">Who are you?</h2>
                  <p className="text-sm text-on-surface-variant">We need your real details to coordinate pickups.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Full Name</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
                      placeholder="e.g. Abhay Malan" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">+91</span>
                      <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g,''))} maxLength={10}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-high border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
                        placeholder="98765 43210" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 1 – Address */}
            {step === 1 && (
              <>
                <div>
                  <h2 className="font-bold text-on-surface text-lg mb-0.5">Where do you live?</h2>
                  <p className="text-sm text-on-surface-variant">We use this to match you with nearby food emergencies.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Street / House Address</label>
                    <textarea required value={form.permanent_address} onChange={e => set('permanent_address', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50 min-h-[80px] resize-none"
                      placeholder="House No., Street, Locality / Village" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">State</label>
                      <select required value={form.state} onChange={e => set('state', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all text-on-surface appearance-none">
                        <option value="">Select...</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Pincode</label>
                      <input required maxLength={6} value={form.pincode} onChange={e => set('pincode', e.target.value.replace(/\D/g,''))}
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
                        placeholder="140413" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2 – Availability */}
            {step === 2 && (
              <>
                <div>
                  <h2 className="font-bold text-on-surface text-lg mb-0.5">When can you help?</h2>
                  <p className="text-sm text-on-surface-variant">Choose when you're typically free to volunteer.</p>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { val: 'day',     icon: 'wb_sunny',  label: 'Daytime',  sub: '8 AM – 6 PM',     color: '#F57F17', bg: '#FFF8E1' },
                    { val: 'night',   icon: 'dark_mode', label: 'Nighttime', sub: '6 PM – 12 AM',    color: '#1A237E', bg: '#E8EAF6' },
                    { val: 'anytime', icon: 'schedule',  label: 'Anytime',   sub: 'Flexible hours',  color: '#1B5E20', bg: '#E8F5E9' },
                  ].map(opt => (
                    <button key={opt.val} type="button" onClick={() => set('availability', opt.val)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all w-full
                        ${form.availability === opt.val ? 'border-primary bg-primary/5' : 'border-transparent bg-surface-container-high hover:bg-surface-variant/50'}`}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: opt.bg }}>
                        <span className="material-symbols-outlined text-2xl" style={{ color: opt.color }}>{opt.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-on-surface text-sm">{opt.label}</p>
                        <p className="text-xs text-on-surface-variant">{opt.sub}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                        ${form.availability === opt.val ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                        {form.availability === opt.val && <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>}
                      </div>
                    </button>
                  ))}
                </div>
                {error && <div className="p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{error}</div>}
              </>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3 rounded-xl border border-outline-variant font-bold text-on-surface hover:bg-surface-variant/50 transition-all">
                  Back
                </button>
              )}
              {step < 2 ? (
                <button type="button" disabled={!canNext[step]}
                  onClick={() => setStep(s => s + 1)}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:brightness-105 transition-all disabled:opacity-40">
                  Continue
                </button>
              ) : (
                <button type="submit" disabled={!form.availability || loading}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:brightness-105 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>Saving...</>
                    : 'Complete Setup →'
                  }
                </button>
              )}
            </div>
          </div>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-5">
          Already have an account? <Link href="/auth" className="text-primary font-semibold">Sign in</Link>
        </p>
      </div>
    </main>
  )
}
