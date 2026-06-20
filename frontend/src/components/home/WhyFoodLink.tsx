'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    icon: 'bolt',
    label: 'Real-time',
    title: 'Instant matching, zero delay',
    desc: 'Our engine connects surplus food to the nearest verified NGO within seconds — so meals arrive warm, not wasted.',
    stat: '< 1s',
    statLabel: 'match latency',
  },
  {
    icon: 'route',
    label: 'Smart Logistics',
    title: 'Location-aware routing',
    desc: 'Intelligent dispatch assigns the closest volunteer or delivery partner, cutting pickup time by up to 60%.',
    stat: '60%',
    statLabel: 'faster pickups',
  },
  {
    icon: 'monitoring',
    label: 'Transparency',
    title: 'Every meal, fully verified',
    desc: 'End-to-end tracking with digital receipts for both donors and recipients — ready for CSR and audit reporting.',
    stat: '100%',
    statLabel: 'tracked donations',
  },
  {
    icon: 'notifications_active',
    label: 'Always On',
    title: 'Never miss an urgent need',
    desc: 'Push, SMS and in-app alerts ensure every request and pickup window is caught — even at 11 PM.',
    stat: '24/7',
    statLabel: 'alert coverage',
  },
]

export default function WhyFoodLink() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-28 bg-slate-50 relative overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-teal-600 mb-4 block">Platform Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Built for speed.<br />Designed for trust.
            </h2>
          </div>
          <p className="text-slate-500 text-lg font-medium max-w-sm leading-relaxed lg:text-right">
            The infrastructure that makes zero-waste food distribution possible at scale.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 flex flex-col justify-between gap-8 cursor-default"
            >
              <div>
                {/* Icon + label */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 group-hover:bg-teal-600 flex items-center justify-center transition-colors duration-300">
                    <span
                      className="material-symbols-outlined text-[22px] text-teal-600 group-hover:text-white transition-colors duration-300"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {f.icon}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-200 px-2.5 py-1 rounded-full">
                    {f.label}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{f.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
              </div>

              {/* Bottom stat */}
              <div className="pt-5 border-t border-slate-100">
                <p className="text-3xl font-black text-slate-900 tracking-tight">{f.stat}</p>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-0.5">{f.statLabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
