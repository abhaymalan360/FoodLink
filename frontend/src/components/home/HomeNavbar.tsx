'use client'

import { useState, useEffect } from 'react'
import HomeNav from '@/components/HomeNav'

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface-container-lowest shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-[20px]">restaurant</span>
          </div>
          <span className={`text-2xl font-extrabold tracking-tight transition-colors ${
            scrolled ? 'text-on-surface' : 'text-white'
          }`}>
            FoodLink
          </span>
        </div>
        <HomeNav scrolled={scrolled} />
      </div>
    </nav>
  )
}
