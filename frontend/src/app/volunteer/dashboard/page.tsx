import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MobileMenu from '@/components/MobileMenu'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

function computeAchievements(posts: number, deliveries: number) {
  return [
    { id: 'first_step', icon: 'directions_walk', bg: '#E8F5E9', fg: '#2E7D32', label: 'First Step', sub: 'Joined the network', unlocked: true },
    { id: 'road_warrior', icon: 'local_shipping', bg: '#FFF8E1', fg: '#F57F17', label: 'Road Warrior', sub: '5+ Deliveries', unlocked: deliveries >= 5 },
    { id: 'scout', icon: 'travel_explore', bg: '#E3F2FD', fg: '#1565C0', label: 'Field Scout', sub: 'Posted urgency', unlocked: posts >= 1 },
    { id: 'heavy_lifter', icon: 'fitness_center', bg: '#FBE9E7', fg: '#BF360C', label: 'Heavy Lifter', sub: '10+ Deliveries', unlocked: deliveries >= 10 },
    { id: 'guardian', icon: 'emergency', bg: '#FCE4EC', fg: '#880E4F', label: 'Alert Guardian', sub: '5+ Urgency Posts', unlocked: posts >= 5 },
    { id: 'hero', icon: 'emoji_events', bg: '#FFFDE7', fg: '#F9A825', label: 'Food Hero', sub: '25+ Deliveries', unlocked: deliveries >= 25 },
  ]
}

const availabilityMap: Record<string, { label: string; icon: string; color: string }> = {
  day:     { label: 'Available Daytime', icon: 'wb_sunny', color: '#F57F17' },
  night:   { label: 'Available Nights',  icon: 'dark_mode', color: '#1A237E' },
  anytime: { label: 'Available Anytime', icon: 'schedule',  color: '#1B5E20' },
}

const actions = [
  { href: '/volunteer/opportunities', icon: 'local_shipping', title: 'Deliver Food', sub: 'Pick up & deliver surplus food', accent: 'var(--md-sys-color-primary)', bg: 'var(--md-sys-color-primary-container)' },
  { href: '/volunteer/report-urgency', icon: 'emergency_share', title: 'Report Urgency', sub: 'Flag an emergency food need', accent: '#C62828', bg: '#FFEBEE' },
  { href: '/heatmap', icon: 'map', title: 'Live Map', sub: 'See real-time logistics', accent: '#00695C', bg: '#E0F2F1' },
  { href: '/impact', icon: 'bar_chart', title: 'Impact Stats', sub: 'Track community impact', accent: '#4527A0', bg: '#EDE7F6' },
]

export default async function VolunteerDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const [profileRes, postsRes] = await Promise.all([
    supabase.from('volunteer_profiles').select('*').eq('id', user.id).single(),
    supabase.from('urgency_posts').select('*').eq('volunteer_id', user.id).order('created_at', { ascending: false })
  ])

  if (!profileRes.data) redirect('/volunteer/onboarding')

  const profile = profileRes.data
  const posts = postsRes.data ?? []
  const deliveries = 0
  const achievements = computeAchievements(posts.length, deliveries)
  const avail = availabilityMap[profile.availability] ?? { label: profile.availability, icon: 'schedule', color: '#555' }
  const initials = profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <main className="min-h-screen bg-[#F4F6F9] pb-20">

      {/* ── Header ── */}
      <header className="bg-primary text-on-primary sticky top-0 z-50 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MobileMenu />
            <span className="font-bold text-xl tracking-tight">FoodLink</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" title="Back to Home"
              className="flex items-center gap-1.5 text-on-primary/80 hover:text-on-primary text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/15 transition-all">
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="w-px h-5 bg-white/20"></div>
            <Link href="/volunteer/onboarding" title="Edit Profile"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </Link>
            <LogoutButton />
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-7">

        {/* ── Profile Hero Card ── */}
        <div className="relative bg-primary rounded-2xl overflow-hidden shadow-lg">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/5"></div>

          <div className="relative p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl text-on-primary shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-on-primary/70 text-sm font-medium">Volunteer</p>
                <h2 className="font-bold text-on-primary text-2xl leading-tight">{profile.name}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 text-on-primary/80 text-sm">
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-on-primary/80 text-sm">
                <span className="material-symbols-outlined text-[16px]">home_pin</span>
                <span className="truncate">{profile.permanent_address}, {profile.state} – {profile.pincode}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-on-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">{avail.icon}</span>
                {avail.label}
              </span>
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-on-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">emergency_share</span>
                {posts.length} {posts.length === 1 ? 'Alert Posted' : 'Alerts Posted'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <section>
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {actions.map(a => (
              <Link key={a.href} href={a.href}
                className="group bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/50 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: a.bg }}>
                  <span className="material-symbols-outlined text-[22px]" style={{ color: a.accent }}>{a.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm leading-tight">{a.title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-snug">{a.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Achievements ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Achievements</h3>
            <span className="text-xs text-on-surface-variant">{achievements.filter(a => a.unlocked).length} / {achievements.length} earned</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden -mx-4 px-4">
            {achievements.map(a => (
              <div key={a.id}
                className={`shrink-0 w-28 bg-white rounded-2xl border p-3 flex flex-col items-center text-center transition-all
                  ${a.unlocked ? 'border-outline-variant/50 shadow-sm hover:shadow-md hover:-translate-y-0.5' : 'border-transparent opacity-35 grayscale'}`}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2" style={{ backgroundColor: a.unlocked ? a.bg : '#EEEEEE' }}>
                  <span className="material-symbols-outlined text-2xl" style={{ color: a.unlocked ? a.fg : '#9E9E9E' }}>{a.icon}</span>
                </div>
                <p className="font-bold text-on-surface text-xs leading-tight">{a.label}</p>
                <p className="text-on-surface-variant text-[10px] mt-0.5">{a.sub}</p>
                {a.unlocked && (
                  <span className="mt-2 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">Earned ✓</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── My Urgency Posts ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">My Urgency Posts</h3>
            <Link href="/volunteer/report-urgency"
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              <span className="material-symbols-outlined text-[14px]">add</span> New Post
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-outline-variant p-6 flex flex-col items-center text-center shadow-sm">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">emergency_share</span>
              <p className="font-medium text-on-surface text-sm">No urgency posts yet</p>
              <p className="text-xs text-on-surface-variant mt-1 mb-3">See something urgent in your area? Post an alert.</p>
              <Link href="/volunteer/report-urgency"
                className="bg-error/10 text-error border border-error/20 text-sm font-bold px-4 py-2 rounded-lg hover:bg-error/20 transition-colors">
                Post First Alert
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.map((post: any) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-outline-variant/50 overflow-hidden flex">
                  {post.photo_url && (
                    <img src={post.photo_url} alt="urgency" className="w-24 h-full object-cover shrink-0" />
                  )}
                  <div className="p-4 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-error"></span>
                      <span className="text-[10px] font-bold text-error uppercase tracking-widest">Urgency Alert</span>
                    </div>
                    <p className="font-semibold text-on-surface text-sm leading-snug">{post.caption}</p>
                    <p className="text-xs text-on-surface-variant mt-1.5 flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      {post.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  )
}
