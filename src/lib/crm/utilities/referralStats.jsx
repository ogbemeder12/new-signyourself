
import { supabase } from '@/lib/supabase';
import { calculateMonthlyTrends } from '@/lib/crmUtils';

export const getReferralStats = async (userId) => {
  try {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select(`
        id,
        referrer_id,
        referred_id,
        status,
        created_at,
        converted_at,
        reward_claimed,
        points_awarded,
        metadata
      `)
      .eq('referrer_id', userId);

    if (error) throw error;

    const stats = {
      total_referrals: referrals.length,
      successful_referrals: referrals.filter(r => r.status === 'converted').length,
      pending_referrals: referrals.filter(r => r.status === 'pending').length,
      total_points_earned: referrals.reduce((sum, r) => sum + (r.points_awarded || 0), 0),
      conversion_rate: referrals.length > 0 ? (referrals.filter(r => r.status === 'converted').length / referrals.length) * 100 : 0,
      recent_referrals: referrals
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5),
      platform_breakdown: referrals.reduce((acc, ref) => {
        const platform = ref.metadata?.platform || 'unknown';
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
      }, {}),
      monthly_trends: calculateMonthlyTrends(referrals, 'created_at', null, 'status', 'converted', 'points_awarded')
    };

    return stats;
  } catch (error) {
    console.error('Error getting referral stats:', error);
    throw error;
  }
};
