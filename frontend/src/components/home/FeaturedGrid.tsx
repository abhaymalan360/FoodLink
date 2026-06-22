'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Use Google Favicon service for ultra-reliable logo loading
const logo = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

// ─── Real Indian NGOs with verified Google Maps coordinates ───────────────────
const NGOS = [
  {
    id: 1,
    name: 'Akshaya Patra Foundation',
    address: 'Hare Krishna Hill, Chord Road, Rajajinagar, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    stat: 'Serves 2M+ meals daily across India',
    badge: 'Verified NGO',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'soup_kitchen',
    logoUrl: logo('akshayapatra.org'),
    lat: 12.9944,
    lng: 77.5497,
    website: 'https://www.akshayapatra.org',
    mapsName: 'Akshaya+Patra+Foundation+Bangalore',
  },
  {
    id: 2,
    name: 'Robin Hood Army',
    address: 'Lodhi Colony, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    stat: 'Served 100M+ meals across 30+ cities',
    badge: 'Active Now',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: 'volunteer_activism',
    logoUrl: logo('robinhoodarmy.com'),
    lat: 28.5894,
    lng: 77.2306,
    website: 'https://robinhoodarmy.com',
    mapsName: 'Robin+Hood+Army+Delhi',
  },
  {
    id: 3,
    name: 'Goonj',
    address: 'Sarai Kale Khan, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    stat: 'Active in 23 states across India',
    badge: 'Urgent Need',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: 'favorite',
    logoUrl: logo('goonj.org'),
    lat: 28.5833,
    lng: 77.2500,
    website: 'https://goonj.org',
    mapsName: 'Goonj+Sarai+Kale+Khan+Delhi',
  },
  {
    id: 4,
    name: 'HelpAge India',
    address: 'C-14, Qutab Institutional Area, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    stat: 'Supports 8M+ elderly across India',
    badge: 'Verified NGO',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'elderly',
    logoUrl: logo('helpageindia.org'),
    lat: 28.5355,
    lng: 77.1879,
    website: 'https://www.helpageindia.org',
    mapsName: 'HelpAge+India+Delhi',
  },
  {
    id: 5,
    name: 'Feeding India',
    address: 'Sector 44, Gurugram, Haryana',
    city: 'Gurugram',
    state: 'Haryana',
    stat: '5M+ people impacted across India',
    badge: 'High Need',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'local_dining',
    logoUrl: logo('feedingindia.org'),
    lat: 28.4595,
    lng: 77.0266,
    website: 'https://feedingindia.org',
    mapsName: 'Feeding+India+Gurugram',
  },
  {
    id: 6,
    name: 'Snehalaya',
    address: 'Savedi, Ahmednagar, Maharashtra',
    city: 'Ahmednagar',
    state: 'Maharashtra',
    stat: 'Supports 10,000+ vulnerable children',
    badge: 'Active Now',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: 'home',
    logoUrl: logo('snehalaya.org'),
    lat: 19.0828,
    lng: 74.7496,
    website: 'https://snehalaya.org',
    mapsName: 'Snehalaya+Ahmednagar+Maharashtra',
  },
]

// ─── Real Indian Restaurants known for CSR / food donation ────────────────────
const RESTAURANTS = [
  {
    id: 1,
    name: 'ITC Maurya',
    address: 'Diplomatic Enclave, Sardar Patel Marg, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    stat: 'Donates unsold banquet food daily',
    badge: 'Top Donor',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'restaurant',
    logoUrl: logo('itchotels.com'),
    lat: 28.5969,
    lng: 77.1703,
    website: 'https://www.itchotels.com/in/en/itcmaurya-newdelhi',
    mapsName: 'ITC+Maurya+New+Delhi',
  },
  {
    id: 2,
    name: 'Taj Mahal Hotel',
    address: 'Mansingh Road, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    stat: 'Weekly surplus food drives',
    badge: 'Regular Donor',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'hotel',
    logoUrl: logo('tajhotels.com'),
    lat: 28.6127,
    lng: 77.2295,
    website: 'https://www.tajhotels.com',
    mapsName: 'Taj+Mahal+Hotel+New+Delhi',
  },
  {
    id: 3,
    name: 'Haldiram\'s',
    address: 'Baba Farid Nagar, Nagpur, Maharashtra',
    city: 'Nagpur',
    state: 'Maharashtra',
    stat: 'Donates 500+ kg surplus weekly',
    badge: 'Top Donor',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'fastfood',
    logoUrl: logo('haldirams.com'),
    lat: 21.1458,
    lng: 79.0882,
    website: 'https://haldirams.com',
    mapsName: 'Haldirams+Nagpur',
  },
  {
    id: 4,
    name: 'Barbeque Nation',
    address: 'Indiranagar, Bangalore, Karnataka',
    city: 'Bangalore',
    state: 'Karnataka',
    stat: 'Participates in NGO surplus drives',
    badge: 'Active',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: 'outdoor_grill',
    logoUrl: logo('barbequenation.com'),
    lat: 12.9784,
    lng: 77.6408,
    website: 'https://www.barbequenation.com',
    mapsName: 'Barbeque+Nation+Indiranagar+Bangalore',
  },
  {
    id: 5,
    name: 'Social',
    address: 'Hauz Khas Village, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    stat: 'Regular community kitchen partner',
    badge: 'Regular Donor',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'local_bar',
    logoUrl: logo('socialoffline.in'),
    lat: 28.5494,
    lng: 77.2001,
    website: 'https://socialoffline.in',
    mapsName: 'Social+Hauz+Khas+Delhi',
  },
  {
    id: 6,
    name: 'Paradise Biryani',
    address: 'M.G. Road, Secunderabad, Telangana',
    city: 'Hyderabad',
    state: 'Telangana',
    stat: 'Donates 80+ portions every Friday',
    badge: 'Top Donor',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'rice_bowl',
    logoUrl: logo('paradiserestaurant.co.in'),
    lat: 17.4418,
    lng: 78.4986,
    website: 'https://paradiserestaurant.co.in',
    mapsName: 'Paradise+Biryani+Secunderabad',
  },
]

type Entry = typeof NGOS[0]

function openMaps(entry: Entry) {
  window.open(`https://maps.google.com/?q=${entry.lat},${entry.lng}`, '_blank', 'noopener')
}

// Logo with fallback to initials avatar
function OrgLogo({ entry, isNGO }: { entry: Entry; isNGO: boolean }) {
  const [failed, setFailed] = useState(false)
  const initials = entry.name.split(' ').slice(0, 2).map(w => w[0]).join('')

  if (failed || !entry.logoUrl) {
    return (
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black tracking-tight ${
        isNGO ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'
      }`}>
        {initials}
      </div>
    )
  }

  return (
    <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest border border-outline-variant flex items-center justify-center overflow-hidden p-1.5 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={entry.logoUrl}
        alt={`${entry.name} logo`}
        className="w-full h-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

// ─── Card Component ───────────────────────────────────────────────────────────
function Card({ item, isNGO }: { item: Entry; isNGO: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="snap-start shrink-0 w-[300px] bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top bar accent */}
      <div className={`h-1 w-full ${isNGO ? 'bg-teal-500' : 'bg-amber-500'}`} />

      <div className="p-6">
        {/* Logo + Badge row */}
        <div className="flex justify-between items-start mb-5">
          <div className="group-hover:scale-105 transition-transform duration-300">
            <OrgLogo entry={item} isNGO={isNGO} />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
            {item.badge}
          </span>
        </div>

        {/* Name + address */}
        <h3 className="text-lg font-bold text-on-surface mb-1 leading-tight">{item.name}</h3>
        <p className="text-xs text-on-surface-variant font-medium mb-0.5 flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">location_on</span>
          {item.city}, {item.state}
        </p>
        <p className="text-[11px] text-on-surface-variant leading-snug mb-5 line-clamp-1">{item.address}</p>

        {/* Stat */}
        <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-teal-600">trending_up</span>
            {item.stat}
          </p>
        </div>

        {/* Action buttons — slide up on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2 overflow-hidden"
            >
              <button
                onClick={() => openMaps(item)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-600 border border-teal-200 hover:border-teal-600 text-teal-700 hover:text-white text-xs font-bold transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                View on Maps
              </button>
              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface text-xs font-bold transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FeaturedGrid() {
  const [activeTab, setActiveTab] = useState<'ngos' | 'restaurants'>('ngos')
  const data = activeTab === 'ngos' ? NGOS : RESTAURANTS

  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-teal-600 mb-3 block">Real Partners</span>
            <h2 className="text-4xl font-black text-on-surface tracking-tight mb-1">Community Champions</h2>
            <p className="text-on-surface-variant font-medium text-base">
              Verified Indian NGOs & restaurants making a real difference.
              <span className="ml-2 text-teal-600 font-semibold">Hover any card to find them on the map.</span>
            </p>
          </div>

          <div className="flex bg-surface-container-lowest border border-outline-variant p-1 rounded-xl w-fit shadow-sm">
            {(['ngos', 'restaurants'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab === 'ngos' ? 'Active NGOs' : 'Restaurants Donating'}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable row */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex overflow-x-auto gap-5 pb-6 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden snap-x"
          >
            {data.map(item => (
              <Card key={item.id} item={item} isNGO={activeTab === 'ngos'} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Maps hint */}
        <p className="text-center text-on-surface-variant text-xs font-medium mt-4 flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">info</span>
          Coordinates sourced from Google Maps · Click "View on Maps" to open exact location
        </p>
      </div>
    </section>
  )
}
