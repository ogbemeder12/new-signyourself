
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { updateUserStats, trackUserEngagement } from '@/lib/crm/userEngagement';

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
