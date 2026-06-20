import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">About FoodLink</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Column 2 */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">For Restaurants</h4>
            <ul className="space-y-3">
              <li><Link href="/restaurant/onboarding" className="hover:text-white transition-colors">Partner With Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Impact Reporting</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tax Benefits</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Guidelines</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">For NGOs</h4>
            <ul className="space-y-3">
              <li><Link href="/ngo/onboarding" className="hover:text-white transition-colors">Join Network</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">View Heatmap</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Logistics Support</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Active Cities</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">Delhi NCR</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Mumbai</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Bangalore</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Hyderabad</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[16px]">restaurant</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">FoodLink</span>
          </div>

          <p className="text-sm flex items-center gap-1.5">
            © 2026 FoodLink · Made with <span className="material-symbols-outlined text-[14px] text-rose-400 align-middle" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span> to fight hunger
          </p>

          <div className="flex items-center gap-4">
            <Link href="#" className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">language</span>
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
