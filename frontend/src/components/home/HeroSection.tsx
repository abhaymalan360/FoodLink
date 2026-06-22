'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const StatItem = ({ value, label, showDot = false, icon }: { value: string; label: string; showDot?: boolean; icon?: string }) => (
  <div className="flex items-center gap-3">
    {showDot ? (
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
      </span>
    ) : icon ? (
      <span className="material-symbols-outlined text-[16px] text-white/50">{icon}</span>
    ) : null}
    <div className="flex items-baseline gap-1.5">
      <span className="text-white font-bold text-base tracking-tight">{value}</span>
      <span className="text-white/55 text-sm font-medium">{label}</span>
    </div>
  </div>
)

const AnimatedStat = ({ end, suffix = '', label, showDot = false, icon }: { end: number; suffix?: string; label: string; showDot?: boolean; icon?: string }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = Math.ceil(end / 50)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 40)
    return () => clearInterval(timer)
  }, [end])

  return <StatItem value={`${count.toLocaleString()}${suffix}`} label={label} showDot={showDot} icon={icon} />
}

export default function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], [0, 200])
  const arrowOpacity = useTransform(scrollY, [0, 120], [1, 0])

  return (
    <div className="relative w-full h-[100vh] min-h-[700px] flex items-center overflow-hidden bg-slate-950">

      {/* Video background with parallax effect */}
      <motion.div
        className="absolute inset-[-6%] w-[112%] h-[112%]"
        style={{ y }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Layered gradient overlay — clean dark top, subtle teal warmth at base */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(160deg, rgba(10,15,30,0.82) 0%, rgba(10,15,30,0.55) 45%, rgba(10,15,30,0.72) 100%)'
      }} />
      {/* Bottom teal bleed — subtle, not aggressive */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[1]" style={{
        background: 'linear-gradient(to top, rgba(13,148,136,0.22) 0%, transparent 100%)'
      }} />

      {/* Content — left-aligned like Airbnb / Swiggy hero */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-20">
        <div className="max-w-3xl">

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-surface-container-lowest/8 backdrop-blur-md mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-white/80 text-sm font-semibold tracking-wide">1,240 meals rescued today across India</span>
          </motion.div>

          {/* Headline — untouched as requested */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[clamp(2.8rem,7vw,5.5rem)] font-black text-white tracking-tighter leading-[1.02] mb-7"
          >
            Good food shouldn't<br />go to waste.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="text-lg md:text-xl text-white/65 font-medium leading-relaxed mb-12 max-w-xl"
          >
            Connect surplus food to the people who need it — right now. Free for restaurants. Free for NGOs.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start gap-4 mb-16"
          >
            <Link
              href="/auth?role=restaurant"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-base tracking-tight transition-all duration-200 hover:-translate-y-0.5 shadow-[0_8px_30px_rgba(13,148,136,0.45)] active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              I Have Surplus Food
              <span className="material-symbols-outlined text-[18px] opacity-70 group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </Link>
            <Link
              href="/auth?role=ngo"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-surface-container-lowest/10 hover:bg-surface-container-lowest/18 backdrop-blur-md border border-white/20 text-white font-bold text-base tracking-tight transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
              We Need Food
              <span className="material-symbols-outlined text-[18px] opacity-70 group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </Link>
          </motion.div>

          {/* Stat bar — minimal, inline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-3"
          >
            <AnimatedStat end={1240} label="meals saved today" showDot />
            <div className="w-px h-4 bg-surface-container-lowest/20 hidden sm:block" />
            <AnimatedStat end={12} label="cities active" icon="location_city" />
            <div className="w-px h-4 bg-surface-container-lowest/20 hidden sm:block" />
            <AnimatedStat end={340} label="restaurants onboarded" icon="storefront" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: arrowOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/25 flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-surface-container-lowest/60" />
        </motion.div>
      </motion.div>
    </div>
  )
}
