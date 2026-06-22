'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

// ─── Step 1 Visual: Live restaurant listing mockup ────────────────────────────
const RestaurantMockup = () => {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1800)
    const t2 = setTimeout(() => setPhase(2), 3200)
    const t3 = setTimeout(() => setPhase(0), 5500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [phase])

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-xl shadow-none">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-on-surface-variant text-xs ml-2 font-mono">List Surplus</span>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider mb-1">Food Type</p>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-on-surface text-sm font-medium">Dal Makhani, Naan (40 pax)</span>
              <span className="material-symbols-outlined text-teal-500 text-[16px]">check_circle</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider mb-1">Pickup By</p>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2">
              <span className="text-on-surface text-sm font-medium">10:30 PM tonight</span>
            </div>
          </div>

          <motion.button
            animate={phase === 0 ? { scale: [1, 1.03, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-500 flex items-center justify-center gap-2 ${
              phase === 0 ? 'bg-teal-600 text-white' : 'bg-emerald-500 text-white'
            }`}
          >
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.span key="post" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">upload</span> Post Listing
                </motion.span>
              )}
              {phase >= 1 && (
                <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> Listed!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {phase === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2 flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
              </span>
              <span className="text-teal-700 text-xs font-semibold">NGO match found — 0.4 km away</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Step 2 Visual: Live matching animation ───────────────────────────────────
const MatchingAnimation = () => {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => setActive(p => !p), 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full flex flex-col items-center gap-4 py-2">
      <div className="flex items-center justify-between w-full max-w-xs relative">
        {/* Restaurant node */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ boxShadow: active ? '0 0 0 8px rgba(13,148,136,0.12)' : '0 0 0 0px rgba(13,148,136,0)' }}
            transition={{ duration: 0.6 }}
            className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-amber-500 text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          </motion.div>
          <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Restaurant</span>
        </div>

        {/* Animated connection line */}
        <div className="flex-1 mx-3 relative h-1 flex items-center">
          <div className="w-full h-px bg-surface-container-high absolute" />
          <motion.div
            className="h-px bg-gradient-to-r from-teal-500 to-emerald-400 absolute"
            animate={{ width: active ? '100%' : '0%' }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(13,148,136,0.5)] z-10"
            animate={{ left: active ? 'calc(100% - 12px)' : '0%', opacity: active ? 1 : 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
        </div>

        {/* NGO node */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ boxShadow: active ? '0 0 0 8px rgba(16,185,129,0.12)' : '0 0 0 0px rgba(16,185,129,0)' }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-teal-600 text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
          </motion.div>
          <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">NGO</span>
        </div>
      </div>

      {/* Match badge */}
      <motion.div
        animate={{ opacity: active ? 1 : 0.35, scale: active ? 1 : 0.95 }}
        transition={{ duration: 0.4, delay: active ? 0.8 : 0 }}
        className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-emerald-600 text-[16px]">hub</span>
        <span className="text-emerald-700 text-xs font-bold">Match confirmed in 0.8s</span>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {[['340+', 'NGOs'], ['12', 'Cities'], ['<1s', 'Latency']].map(([val, lbl]) => (
          <div key={lbl} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-2 text-center shadow-sm">
            <p className="text-on-surface font-black text-base">{val}</p>
            <p className="text-on-surface-variant text-[10px] font-semibold uppercase tracking-wider">{lbl}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Step 3 Visual: Delivery tracker ─────────────────────────────────────────
const DeliveryTracker = () => {
  const stages = [
    { label: 'Listed',    icon: 'upload',          done: true,  active: false },
    { label: 'Matched',   icon: 'hub',             done: true,  active: false },
    { label: 'En Route',  icon: 'local_shipping',  done: true,  active: true  },
    { label: 'Delivered', icon: 'check_circle',    done: false, active: false },
  ]
  return (
    <div className="w-full max-w-xs mx-auto space-y-4">
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-xl shadow-none">
        <div className="flex items-center justify-between mb-4">
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Live Delivery</span>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"/>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"/>
            </span>
            In Transit
          </span>
        </div>

        <div className="relative flex items-center justify-between mb-6">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-surface-container-high" />
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-teal-500 to-teal-400"
            initial={{ width: '0%' }}
            animate={{ width: '66%' }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
          />
          {stages.map((s, i) => (
            <div key={i} className="relative flex flex-col items-center gap-1.5 z-10">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.3 + 0.2 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  s.active ? 'bg-teal-600 border-teal-500 shadow-[0_0_12px_rgba(13,148,136,0.35)]' :
                  s.done   ? 'bg-teal-500 border-teal-400' :
                             'bg-surface-container-lowest border-outline'
                }`}
              >
                <span className={`material-symbols-outlined text-[14px] ${s.done || s.active ? 'text-white' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </motion.div>
              <span className={`text-[9px] font-bold uppercase tracking-wide whitespace-nowrap ${s.active ? 'text-teal-600' : s.done ? 'text-on-surface-variant' : 'text-outline-variant'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-teal-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <div>
            <p className="text-on-surface text-xs font-bold">Arjun Mehta · Volunteer</p>
            <p className="text-on-surface-variant text-[10px]">2.1 km away · ETA 8 mins</p>
          </div>
          <span className="ml-auto material-symbols-outlined text-teal-600 text-[18px]">call</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-sm flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-emerald-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
        </div>
        <div>
          <p className="text-on-surface-variant text-[10px] font-semibold">Hope Foundation, Delhi</p>
          <p className="text-on-surface text-sm font-bold">40 meals · feeding tonight</p>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Steps config ─────────────────────────────────────────────────────────────
const steps = [
  {
    number: '01',
    overline: 'For Restaurants',
    overlineColor: 'text-amber-600',
    numberColor: 'text-slate-100',
    title: 'List surplus\nin 60 seconds.',
    body: 'A simple form. Food type, quantity, pickup window. No wasteful friction — just an instant listing that goes live across our NGO network.',
    visual: <RestaurantMockup />,
    dividerColor: 'from-amber-400/60',
  },
  {
    number: '02',
    overline: 'Automated Intelligence',
    overlineColor: 'text-teal-600',
    numberColor: 'text-slate-100',
    title: 'Matched to the\nright NGO instantly.',
    body: 'Our engine scores proximity, capacity, and urgency simultaneously. The closest verified NGO gets notified within seconds — no phone calls, no confusion.',
    visual: <MatchingAnimation />,
    dividerColor: 'from-teal-500/60',
  },
  {
    number: '03',
    overline: 'End-to-End Tracking',
    overlineColor: 'text-emerald-600',
    numberColor: 'text-slate-100',
    title: 'Tracked, delivered,\nand counted.',
    body: 'Volunteers pick up and deliver with full GPS tracking. Every meal is logged on both sides, giving you a real impact certificate for CSR reporting.',
    visual: <DeliveryTracker />,
    dividerColor: 'from-emerald-500/60',
  },
]

// ─── Step row component ───────────────────────────────────────────────────────
const StepRow = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20 py-16 border-b border-outline-variant last:border-0`}
    >
      {/* Content */}
      <div className="flex-1 lg:max-w-[480px]">
        <div className="flex items-baseline gap-4 mb-6">
          <span className={`text-[80px] font-black ${step.numberColor} leading-none select-none`}>{step.number}</span>
          <div className={`w-px h-10 bg-gradient-to-b ${step.dividerColor} to-transparent`} />
          <span className={`text-sm font-bold uppercase tracking-widest ${step.overlineColor}`}>{step.overline}</span>
        </div>

        <h3 className="text-3xl md:text-4xl font-black text-on-surface leading-[1.1] mb-5 whitespace-pre-line">
          {step.title}
        </h3>
        <p className="text-on-surface-variant text-lg font-medium leading-relaxed">
          {step.body}
        </p>
      </div>

      {/* Visual */}
      <div className="flex-1 w-full lg:max-w-[440px] relative">
        {step.visual}
      </div>
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section className="bg-surface-container-lowest py-24 relative overflow-hidden">
      {/* Very subtle ambient tints */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-teal-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[350px] bg-amber-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-teal-600 mb-5 block">
            How it works
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-4xl md:text-6xl font-black text-on-surface leading-[1.05] tracking-tight">
              From kitchen to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                community table.
              </span>
            </h2>
            <p className="text-on-surface-variant font-medium text-lg max-w-xs leading-relaxed lg:text-right">
              Three steps. Zero phone calls.<br />Every meal tracked and verified.
            </p>
          </div>
        </motion.div>

        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isHeaderInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
          className="h-px bg-gradient-to-r from-teal-500/60 via-slate-200 to-transparent mb-4 origin-left"
        />

        {/* Steps */}
        <div>
          {steps.map((step, i) => (
            <StepRow key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
