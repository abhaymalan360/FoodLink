import Link from 'next/link'
import HomeNavbar from '@/components/home/HomeNavbar'
import HeroSection from '@/components/home/HeroSection'
import CitySelector from '@/components/home/CitySelector'
import HowItWorks from '@/components/home/HowItWorks'
import LiveActivityFeed from '@/components/home/LiveActivityFeed'
import ImpactBanner from '@/components/home/ImpactBanner'
import FeaturedGrid from '@/components/home/FeaturedGrid'
import UrgencyPreview from '@/components/home/UrgencyPreview'
import WhyFoodLink from '@/components/home/WhyFoodLink'
import Testimonials from '@/components/home/Testimonials'
import Footer from '@/components/home/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <HomeNavbar />

      <HeroSection />
      <CitySelector />
      
      <HowItWorks />
      <LiveActivityFeed />
      <ImpactBanner />
      
      <FeaturedGrid />
      <UrgencyPreview />
      
      <WhyFoodLink />
      <Testimonials />
      
      <Footer />
    </main>
  )
}

