'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const AnimatedCounter = ({ end, label, icon }: { end: number, label: string, icon: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    
    let start = 0
    const duration = 2500
    const stepTime = Math.abs(Math.floor(duration / end))
    const increment = end > 1000 ? Math.ceil(end / 60) : 1
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, stepTime > 0 ? stepTime : 16)
    
    return () => clearInterval(timer)
  }, [isInView, end])

  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center p-4">
      <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-[28px] text-teal-200">{icon}</span>
      </div>
      <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
        {count.toLocaleString()}{end > 1000 ? '+' : ''}
      </h3>
      <p className="text-teal-100/80 font-semibold uppercase tracking-wider text-sm md:text-base">
        {label}
      </p>
    </div>
  )
}

export default function ImpactBanner() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-900">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
        >
          <source src="/impact-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Deep teal gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/80 to-slate-900/90 mix-blend-multiply"></div>
      
      {/* Subtle radial glow for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-teal-500/30">
          <AnimatedCounter end={124000} label="Meals Saved" icon="rice_bowl" />
          <AnimatedCounter end={12} label="Cities Active" icon="location_city" />
          <AnimatedCounter end={340} label="Restaurants" icon="storefront" />
          <AnimatedCounter end={180} label="NGO Partners" icon="volunteer_activism" />
        </div>
      </div>
    </section>
  )
}
