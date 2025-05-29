
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { updateUserStats, trackUserEngagement } from './userEngagement';

export const trackSocialShare = async (userId, platform, shareUrl) => {
  try {
    const shareData = {
      id: uuidv4(),
      user_id: userId,
      platform,
      share_url: shareUrl,
      points_earned: 25, 
      metadata: {
        device: navigator.userAgent,
        screen_size: `${window.innerWidth}x${window.innerHeight}`,
        location: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        platform_details: {
          browser: navigator.userAgent.match(/chrome|firefox|safari|edge/i)?.[0] || 'other',
          os: navigator.platform,
          language: navigator.language
        }
      }
    };

    const { data: share, error } = await supabase
      .from('social_shares')
      .insert([shareData])
      .select()
      .single();

    if (error) throw error;

    await updateUserStats(userId, 'social_share');
    await trackUserEngagement(userId, 'social_share', shareData.metadata);

    return share;
  } catch (error) {
    console.error('Error tracking social share:', error);
    throw error;
  }
};

const calculateMonthlyTrends = (referrals) => {
  const trends = {};
  referrals.forEach(ref => {
    const date = new Date(ref.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!trends[monthKey]) {
      trends[monthKey] = {
        total: 0,
        converted: 0,
        points_awarded: 0
      };
    }
    trends[monthKey].total++;
    if (ref.status === 'converted') {
      trends[monthKey].converted++;
      trends[monthKey].points_awarded += ref.points_awarded || 0;
    }
  });
  return trends;
};

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
      monthly_trends: calculateMonthlyTrends(referrals)
    };

    return stats;
  } catch (error) {
    console.error('Error getting referral stats:', error);
    throw error;
  }
};
