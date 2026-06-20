'use client'

import { motion } from 'framer-motion'

const ACTIVITY_DATA = [
  { id: 1, rest: 'The Taj Kitchen', food: '50 Meals (Buffet Surplus)', ngo: 'Hope Foundation', city: 'Delhi', time: '4 mins ago' },
  { id: 2, rest: 'Bakehouse Cafe', food: '15 kg Assorted Breads', ngo: 'Robin Hood Army', city: 'Mumbai', time: '12 mins ago' },
  { id: 3, rest: 'Biryani Blues', food: '30 Portions Biryani', ngo: 'Feeding India', city: 'Bangalore', time: '18 mins ago' },
  { id: 4, rest: 'Pizza Express', food: '8 Large Pizzas', ngo: 'Snehalaya', city: 'Pune', time: '25 mins ago' },
  { id: 5, rest: 'Paradise Foods', food: '40 Meals (Curry & Rice)', ngo: 'Akshaya Patra', city: 'Hyderabad', time: '32 mins ago' },
]

export default function LiveActivityFeed() {
  // Duplicate array for seamless infinite scrolling loop
  const duplicatedData = [...ACTIVITY_DATA, ...ACTIVITY_DATA]

  return (
    <section className="py-16 bg-slate-50 border-y border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </span>
          <h2 className="text-2xl font-bold text-slate-800">Happening right now</h2>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative flex w-full">
        <motion.div 
          className="flex gap-6 px-3"
          animate={{ x: [0, -1920] }} // Adjust depending on item widths to seamlessly loop
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25 // Scroll speed
          }}
        >
          {duplicatedData.map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`}
              className="shrink-0 w-[350px] bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 border-l-4 border-l-teal-600 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.rest}</h4>
                  <p className="text-xs text-slate-500 font-medium">{item.food}</p>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span>
                  {item.time}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-500">volunteer_activism</span>
                  {item.ngo}
                </h4>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {item.city}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
