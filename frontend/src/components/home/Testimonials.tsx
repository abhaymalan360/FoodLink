'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const TESTIMONIALS = [
  {
    id: 1,
    quote: "We used to discard nearly 10 kg of perfectly good food every night. Now it's collected within 20 minutes of closing. FoodLink has fundamentally changed how we think about waste.",
    name: 'Rajesh Kumar',
    title: 'General Manager',
    org: 'The Taj Kitchen, Delhi',
    avatar: 'R',
    type: 'Restaurant',
    typeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    meals: '1,400+ meals donated',
  },
  {
    id: 2,
    quote: 'Real-time alerts mean we can feed an extra 50 people at our shelter every single day. The platform removes all the guesswork from food collection — it just works.',
    name: 'Priya Sharma',
    title: 'Operations Coordinator',
    org: 'Hope Foundation, Mumbai',
    avatar: 'P',
    type: 'NGO',
    typeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    meals: '18,000+ meals received',
  },
  {
    id: 3,
    quote: "Our surplus baked goods now go to children's homes instead of the bin. The onboarding took under five minutes and the impact reporting helps our CSR team immensely.",
    name: 'Amit Patel',
    title: 'Owner',
    org: 'Bakehouse Cafe, Bangalore',
    avatar: 'A',
    type: 'Restaurant',
    typeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    meals: '320+ deliveries completed',
  },
  {
    id: 4,
    quote: 'During last year\'s floods, the heatmap directed relief food exactly where it was needed most. The platform performed flawlessly under pressure when it mattered most.',
    name: 'Dr. Sarah Khan',
    title: 'Executive Director',
    org: 'Robin Hood Army, Hyderabad',
    avatar: 'S',
    type: 'NGO',
    typeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    meals: '5,200+ meals coordinated',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const t = TESTIMONIALS[active]

  return (
    <section className="py-28 bg-surface-container-lowest relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-teal-600 mb-4 block">Social Proof</span>
            <h2 className="text-4xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
              Trusted by the people<br />doing the work.
            </h2>
          </div>
          <p className="text-on-surface-variant text-lg font-medium max-w-sm leading-relaxed lg:text-right">
            From premium restaurant kitchens to grassroots NGOs — real stories from across India.
          </p>
        </motion.div>

        {/* Main testimonial display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-5 gap-10 items-start"
        >
          {/* Quote panel */}
          <div className="lg:col-span-3 bg-slate-950 rounded-3xl p-10 md:p-14 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Large quote mark */}
            <div className="text-[120px] leading-none text-teal-500/20 font-serif absolute top-6 left-10 select-none">"</div>

            <div className="relative z-10">
              {/* Type badge */}
              <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-8 ${t.typeColor}`}>
                {t.type}
              </span>

              {/* Quote */}
              <motion.p
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-white text-xl md:text-2xl font-medium leading-relaxed mb-10"
              >
                "{t.quote}"
              </motion.p>

              {/* Author */}
              <motion.div
                key={`author-${t.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-300 font-black text-lg">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-bold text-base">{t.name}</p>
                  <p className="text-on-surface-variant text-sm">{t.title} · {t.org}</p>
                </div>
                <div className="ml-auto text-right hidden md:block">
                  <p className="text-teal-400 text-sm font-bold">{t.meals}</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Selector cards */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setActive(i)}
                className={`text-left w-full px-5 py-4 rounded-2xl border transition-all duration-250 ${
                  i === active
                    ? 'bg-slate-950 border-slate-800 shadow-xl'
                    : 'bg-surface-container-low border-outline-variant hover:border-outline-variant hover:bg-surface-container-lowest'
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                    i === active ? 'bg-teal-600 text-white' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {item.avatar}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${i === active ? 'text-white' : 'text-on-surface'}`}>{item.name}</p>
                    <p className={`text-xs font-medium ${i === active ? 'text-on-surface-variant' : 'text-on-surface-variant'}`}>{item.org}</p>
                  </div>
                </div>
                <p className={`text-xs leading-relaxed line-clamp-2 mt-2 ${i === active ? 'text-on-surface-variant' : 'text-on-surface-variant'}`}>
                  "{item.quote}"
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
