import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function NgoDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch active demands
  const { data: activeDemands } = await supabase
    .from('demand_requests')
    .select('*')
    .eq('ngo_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch match history
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      surplus_listings ( food_name, pickup_address )
    `)
    .eq('ngo_id', user.id)
    .order('matched_at', { ascending: false })

  return (
    <DashboardClient 
      initialDemands={activeDemands || []} 
      initialMatches={matches || []} 
      userId={user.id} 
    />
  )
}
