import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function RestaurantDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch active listings
  const { data: activeListings } = await supabase
    .from('surplus_listings')
    .select('*')
    .eq('restaurant_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch match history
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      demand_requests ( headcount, urgency, area )
    `)
    .eq('restaurant_id', user.id)
    .order('matched_at', { ascending: false })

  return (
    <DashboardClient 
      initialListings={activeListings || []} 
      initialMatches={matches || []} 
      userId={user.id} 
    />
  )
}
