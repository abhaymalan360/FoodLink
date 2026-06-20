import Link from 'next/link'

const URGENT_REQUESTS = [
  { id: 1, area: 'Dharavi Sector 4', count: 150, urgency: 'Critical', time: '10 mins ago', color: 'bg-red-500' },
  { id: 2, area: 'Andheri East Station', count: 80, urgency: 'High', time: '25 mins ago', color: 'bg-orange-500' },
  { id: 3, area: 'Malad West Comm Center', count: 45, urgency: 'Medium', time: '1 hour ago', color: 'bg-amber-500' },
]

export default function UrgencyPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Where food is needed most right now</h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl">Real-time alerts from NGOs and community centers. Help us route surplus food to these hotspots.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Map Preview (Left) */}
          <div className="flex-1 relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 min-h-[400px] flex flex-col group">
            {/* Map styling abstraction using CSS grid to look like a map */}
            <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDIwTTEwIDB2MjAiIHN0cm9rZT0iIzBmMzQyMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
            
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="relative w-64 h-64">
                 <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                 <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-orange-500/20 rounded-full blur-xl animate-pulse delay-700" />
                 
                 {/* Map markers */}
                 <div className="absolute top-[30%] left-[40%] flex flex-col items-center">
                   <span className="relative flex h-4 w-4">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                   </span>
                 </div>
                 
                 <div className="absolute bottom-[40%] right-[30%] flex flex-col items-center">
                   <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-sm" />
                 </div>
               </div>
            </div>

            <div className="mt-auto relative z-10 p-6 bg-gradient-to-t from-white via-white/90 to-transparent pt-20">
              <Link 
                href="/heatmap"
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined text-[20px]">explore</span>
                View Full Interactive Heatmap
              </Link>
            </div>
          </div>

          {/* Urgent Demands List (Right) */}
          <div className="w-full lg:w-[400px] flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Live Alerts</h3>
            
            {URGENT_REQUESTS.map((req) => (
              <div key={req.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${req.color}`} />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{req.urgency}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{req.time}</span>
                </div>
                
                <h4 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-teal-600 transition-colors">{req.area}</h4>
                
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  Food needed for ~{req.count} people
                </div>
              </div>
            ))}
            
            <Link href="/volunteer/opportunities" className="mt-2 text-teal-600 font-bold text-sm flex items-center gap-1 hover:text-teal-700 transition-colors">
              See all requests <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
