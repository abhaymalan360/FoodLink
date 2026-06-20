import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { haversineDistance } from './utils';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Matching Engine API Route
app.post('/api/match', async (req, res) => {
  try {
    const { triggerType, recordId } = req.body;

    if (triggerType === 'demand') {
      const { data: demand } = await supabase.from('demand_requests').select('*').eq('id', recordId).single();
      if (!demand || demand.status !== 'active') return res.status(400).json({ success: false, reason: 'Demand not active' });

      const { data: listings } = await supabase.from('surplus_listings').select('*').eq('status', 'available');
      if (!listings || listings.length === 0) return res.json({ success: false, reason: 'No listings' });

      let bestMatch = null;
      let highestScore = -1;

      for (const listing of listings) {
        const distance = haversineDistance(demand.lat, demand.lng, listing.lat, listing.lng);
        if (distance <= 10) {
          const distanceScore = Math.max(0, 10 - distance);
          let urgencyScore = 1;
          if (demand.urgency === 'critical') urgencyScore = 3;
          else if (demand.urgency === 'urgent') urgencyScore = 2;

          const headcountScore = demand.headcount / 10;
          const totalScore = (distanceScore * 2) + (urgencyScore * 5) + headcountScore;

          if (totalScore > highestScore) {
            highestScore = totalScore;
            bestMatch = listing;
          }
        }
      }

      if (bestMatch) {
        const { data: match, error: matchError } = await supabase.from('matches').insert({
          listing_id: bestMatch.id,
          demand_id: demand.id,
          restaurant_id: bestMatch.restaurant_id,
          ngo_id: demand.ngo_id,
          status: 'pending'
        }).select().single();

        if (!matchError && match) {
          await supabase.from('demand_requests').update({ status: 'matched' }).eq('id', demand.id);
          await supabase.from('surplus_listings').update({ status: 'matched' }).eq('id', bestMatch.id);
          
          await supabase.from('impact_logs').insert({
            match_id: match.id,
            meals_saved: demand.headcount,
            waste_kg_prevented: bestMatch.quantity,
            city: demand.area || 'Unknown'
          });

          return res.json({ success: true, match });
        }
      }
    } else if (triggerType === 'surplus') {
      const { data: listing } = await supabase.from('surplus_listings').select('*').eq('id', recordId).single();
      if (!listing || listing.status !== 'available') return res.status(400).json({ success: false, reason: 'Listing not available' });

      const { data: demands } = await supabase.from('demand_requests').select('*').eq('status', 'active');
      if (!demands || demands.length === 0) return res.json({ success: false, reason: 'No demands' });

      let bestMatch = null;
      let highestScore = -1;

      for (const demand of demands) {
        const distance = haversineDistance(listing.lat, listing.lng, demand.lat, demand.lng);
        if (distance <= 10) {
          const distanceScore = Math.max(0, 10 - distance);
          let urgencyScore = 1;
          if (demand.urgency === 'critical') urgencyScore = 3;
          else if (demand.urgency === 'urgent') urgencyScore = 2;

          const headcountScore = demand.headcount / 10;
          const totalScore = (distanceScore * 2) + (urgencyScore * 5) + headcountScore;

          if (totalScore > highestScore) {
            highestScore = totalScore;
            bestMatch = demand;
          }
        }
      }

      if (bestMatch) {
        const { data: match, error: matchError } = await supabase.from('matches').insert({
          listing_id: listing.id,
          demand_id: bestMatch.id,
          restaurant_id: listing.restaurant_id,
          ngo_id: bestMatch.ngo_id,
          status: 'pending'
        }).select().single();

        if (!matchError && match) {
          await supabase.from('demand_requests').update({ status: 'matched' }).eq('id', bestMatch.id);
          await supabase.from('surplus_listings').update({ status: 'matched' }).eq('id', listing.id);
          
          await supabase.from('impact_logs').insert({
            match_id: match.id,
            meals_saved: bestMatch.headcount,
            waste_kg_prevented: listing.quantity,
            city: bestMatch.area || 'Unknown' 
          });

          return res.json({ success: true, match });
        }
      }
    }

    return res.json({ success: false, reason: 'No suitable match found' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Expiry Cron Route
app.get('/api/cron/expire', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = new Date().toISOString();

  await supabase
    .from('demand_requests')
    .update({ status: 'fulfilled' })
    .lt('expires_at', now)
    .eq('status', 'active');

  await supabase
    .from('surplus_listings')
    .delete()
    .lt('available_until', now)
    .eq('status', 'available');

  return res.json({ success: true, message: 'Expired listings cleaned up' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
