'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ProfileDropdownProps {
  name: string
  role: 'restaurant' | 'ngo'
  initial: string
}

export default function ProfileDropdown({ name, role, initial }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const profileBase = `/${role}`

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low hover:border-outline transition-all group"
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center font-bold text-[12px] text-emerald-700 border border-emerald-200/60">
          {initial}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[12px] font-semibold text-on-surface leading-none">{name}</span>
          <span className="text-[10px] font-medium text-on-surface-variant leading-none mt-0.5 capitalize">{role}</span>
        </div>
        <span className={`material-symbols-outlined text-[16px] text-on-surface-variant transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="px-4 py-2 mb-1 border-b border-outline-variant/50">
            <p className="text-[11px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Signed in as</p>
            <p className="text-[14px] font-semibold text-on-surface truncate">{name}</p>
          </div>

          {/* Links */}
          <div className="px-2 py-1">
            <Link
              href={`${profileBase}/dashboard`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all group"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>dashboard</span>
              <span className="text-[13px] font-medium">Dashboard</span>
            </Link>
            <Link
              href={`${profileBase}/settings`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all group"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
              <span className="text-[13px] font-medium">Settings</span>
            </Link>
          </div>

          {/* Divider + Logout */}
          <div className="p-1.5 pt-0 border-t border-outline-variant mt-0.5">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all group mt-1.5"
            >
              <span className="material-symbols-outlined text-[18px] text-red-400" style={{ fontVariationSettings: "'FILL' 0" }}>logout</span>
              <span className="text-[13px] font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
