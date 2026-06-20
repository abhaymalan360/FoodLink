'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { submitUrgencyPost } from '@/app/volunteer/actions'

export default function ReportUrgency() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [form, setForm] = useState({ caption: '', location: '', photo_url: '' })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setPhotoPreview(url)
      set('photo_url', url)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setError(null)
    const fd = new FormData()
    fd.append('caption', form.caption)
    fd.append('location', form.location)
    fd.append('photo_url', form.photo_url)
    const res = await submitUrgencyPost(fd)
    if (res?.error) { setError(res.error); setLoading(false) }
    else router.push('/volunteer/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#F4F6F9] flex flex-col pb-10">

      {/* Header */}
      <div className="bg-[#B71C1C] px-6 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-[#F4F6F9] rounded-t-[32px]"></div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <span className="material-symbols-outlined text-white text-[20px]">arrow_back</span>
          </button>
          <span className="text-white/70 font-medium text-sm">FoodLink</span>
          <Link href="/"
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all">
            <span className="material-symbols-outlined text-[15px]">home</span>
            Home
          </Link>
        </div>
        <h1 className="text-white font-bold text-2xl relative z-10">Report Food Urgency</h1>
        <p className="text-white/70 text-sm mt-1 relative z-10">Alert the network about an immediate food need.</p>
      </div>

      <div className="max-w-xl mx-auto w-full px-4 -mt-2 flex flex-col gap-4">

        {/* Info card */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
          <span className="material-symbols-outlined text-[#B71C1C] shrink-0">info</span>
          <p className="text-sm text-[#7F1D1D] leading-relaxed">
            Your alert will appear on the <strong>live map</strong> and be visible to all active NGOs and volunteers immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Photo upload */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <label htmlFor="photo-upload" className="cursor-pointer block">
              {photoPreview ? (
                <div className="relative">
                  <img src={photoPreview} alt="preview" className="w-full h-52 object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                    <span className="bg-white text-on-surface text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">edit</span> Change Photo
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center gap-2 bg-[#FFF5F5]">
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#B71C1C] text-3xl">add_a_photo</span>
                  </div>
                  <p className="font-semibold text-[#B71C1C] text-sm">Add a Photo</p>
                  <p className="text-xs text-on-surface-variant">Show what the emergency looks like</p>
                </div>
              )}
              <input id="photo-upload" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {/* Fields */}
          <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">What is happening? *</label>
              <textarea required value={form.caption} onChange={e => set('caption', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F4F6F9] border border-transparent focus:border-[#B71C1C] focus:bg-white focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50 min-h-[110px] resize-none"
                placeholder="e.g. Around 40 people are waiting near the old bus stand since early morning with no access to food..." />
              <p className="text-xs text-on-surface-variant mt-1">{form.caption.length} / 300 characters</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Exact Location *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">location_on</span>
                <input required value={form.location} onChange={e => set('location', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F4F6F9] border border-transparent focus:border-[#B71C1C] focus:bg-white focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
                  placeholder="e.g. Sector 22 Market, Chandigarh" />
              </div>
              <p className="text-xs text-on-surface-variant mt-1">Will be geocoded and plotted on the live map automatically.</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-[#B71C1C] text-sm flex gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading || !form.caption || !form.location}
            className="w-full bg-[#B71C1C] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#9B1515] transition-all disabled:opacity-40 flex justify-center items-center gap-2 shadow-lg shadow-red-900/20">
            {loading
              ? <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>Posting Alert...</>
              : <><span className="material-symbols-outlined">emergency_share</span>Post Urgency Alert</>
            }
          </button>
        </form>
      </div>
    </main>
  )
}
