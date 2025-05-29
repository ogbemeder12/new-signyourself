
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const updateUserStats = async (userId, activityType) => {
  try {
    const { data: user, error: fetchUserError } = await supabase
      .from('users')
      .select('statistics')
      .eq('id', userId)
      .single();

    if (fetchUserError && fetchUserError.code !== 'PGRST116') { 
      console.error('Error fetching user for stats update:', fetchUserError);
      return; 
    }

    const statistics = user?.statistics || {};
    statistics[activityType] = (statistics[activityType] || 0) + 1;
    statistics.last_activity = new Date().toISOString();

    if (!statistics.trends) {
      statistics.trends = {};
    }
    const today = new Date().toISOString().split('T')[0];
    if (!statistics.trends[today]) {
      statistics.trends[today] = {};
    }
    statistics.trends[today][activityType] = (statistics.trends[today][activityType] || 0) + 1;

    const { error: updateError } = await supabase
      .from('users')
      .update({ statistics })
      .eq('id', userId);
      
    if (updateError) {
        console.error('Error updating user stats:', updateError);
    }

  } catch (error) {
    console.error('Generic error updating user stats:', error);
  }
};

export const trackUserEngagement = async (userId, type, metadata = {}) => {
  try {
    const engagementData = {
      user_id: userId,
      type,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        session_id: sessionStorage.getItem('session_id') || uuidv4(), 
        page_context: {
          url: window.location.href,
          referrer: document.referrer,
          title: document.title
        }
      }
    };

    const { error } = await supabase
      .from('user_engagement')
      .insert([engagementData]);

    if (error) {
        console.error('Error tracking engagement:', error);
    }
  } catch (error) {
    console.error('Generic error tracking engagement:', error);
  }
};


export const updateEngagementScore = async (userId, points) => {
  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('user_profiles') 
      .select('engagement_score')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { 
      throw fetchError;
    }
    
    const currentScore = currentData?.engagement_score || 0;
    const newScore = currentScore + points;

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ engagement_score: newScore, last_active_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    
    console.log(`Engagement score updated for user ${userId}: ${newScore}`);
    return data;
  } catch (error) {
    console.error('Error updating engagement score:', error.message);
  }
};
