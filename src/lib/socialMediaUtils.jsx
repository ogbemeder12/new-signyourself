
import { supabase } from '@/lib/supabase';

export const schedulePost = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert([{
        ...postData,
        status: 'scheduled',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error scheduling post:', error);
    throw error;
  }
};

export const getScheduledPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .order('scheduled_for', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    throw error;
  }
};

export const deleteScheduledPost = async (postId) => {
  try {
    const { error } = await supabase
      .from('scheduled_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting scheduled post:', error);
    throw error;
  }
};

export const updateScheduledPost = async (postId, updates) => {
  try {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating scheduled post:', error);
    throw error;
  }
};

export const getSocialMediaMetrics = async (platform, dateRange) => {
  try {
    const { data, error } = await supabase
      .from('social_metrics')
      .select('*')
      .eq('platform', platform)
      .gte('date', dateRange.start)
      .lte('date', dateRange.end);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching social media metrics:', error);
    throw error;
  }
};

export const trackEngagement = async (engagementData) => {
  try {
    const { data, error } = await supabase
      .from('social_engagement')
      .insert([{
        ...engagementData,
        tracked_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking engagement:', error);
    throw error;
  }
};

export const getEngagementMetrics = async (platform, dateRange) => {
  try {
    const { data, error } = await supabase
      .from('social_engagement')
      .select('*')
      .eq('platform', platform)
      .gte('tracked_at', dateRange.start)
      .lte('tracked_at', dateRange.end);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching engagement metrics:', error);
    throw error;
  }
};

export const calculateEngagementRate = (metrics) => {
  const totalEngagements = metrics.reduce((sum, metric) => 
    sum + metric.likes + metric.comments + metric.shares, 0
  );
  const totalFollowers = metrics[0]?.followers || 1;
  return (totalEngagements / totalFollowers) * 100;
};

export const getTopPerformingPosts = async (platform, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('platform', platform)
      .order('engagement_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching top performing posts:', error);
    throw error;
  }
};

export const getAudienceDemographics = async (platform) => {
  try {
    const { data, error } = await supabase
      .from('audience_demographics')
      .select('*')
      .eq('platform', platform)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching audience demographics:', error);
    throw error;
  }
};
