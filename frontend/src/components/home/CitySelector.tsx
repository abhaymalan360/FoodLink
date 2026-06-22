'use client'

import { useState } from 'react'

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai']

export default function CitySelector() {
  const [selectedCity, setSelectedCity] = useState<string>('Delhi')

  return (
    <div className="sticky top-20 z-40 w-full bg-surface-container-lowest border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <span className="text-neutral-500 font-medium text-sm whitespace-nowrap mr-6 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          Select your city <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </span>
        
        <div className="flex items-center gap-3">
          {CITIES.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200
                ${selectedCity === city 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
