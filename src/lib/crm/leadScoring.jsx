
import { supabase } from '@/lib/supabase';
import { getLeadSegmentsConfig } from '@/lib/crm';


export const calculateLeadScore = (lead) => {
  let score = 0;

  if (!lead) return 0;

  if (lead.is_subscribed_to_newsletter) score += 5;
  if (lead.has_purchased) score += 20;
  if (lead.social_shares && lead.social_shares > 0) score += lead.social_shares * 2;
  if (lead.referrals_made && lead.referrals_made > 0) score += lead.referrals_made * 5;
  if (lead.page_views && lead.page_views > 10) score += 5;
  
  if (lead.email_verified) score += 10;
  if (lead.phone) score += 5;
  if (lead.referral_code) score += 8;
  
  const activities = lead.activities || [];
  const now = new Date();
  const recentActivities = activities.filter(a => {
    if (!a || !a.timestamp) return false;
    const activityDate = new Date(a.timestamp);
    const daysDiff = (now - activityDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });
  
  score += recentActivities.length * 2;

  if (lead.social_shares_details && Array.isArray(lead.social_shares_details)) {
    const uniquePlatforms = new Set(lead.social_shares_details.map(s => s.platform));
    score += lead.social_shares_details.length * 2;
    score += uniquePlatforms.size * 3; 
  }


  if (lead.referrals_made_count) { 
    score += lead.referrals_made_count * 5;
    const successfulReferrals = lead.successful_referrals_count || 0;
    score += successfulReferrals * 8; 
  }

  if (lead.created_at) {
    const createdAt = new Date(lead.created_at);
    const daysSinceCreation = (now - createdAt) / (1000 * 60 * 60 * 24);
    const decayFactor = Math.max(0.5, 1 - (daysSinceCreation / 30)); 
    score *= decayFactor;
  }

  return Math.round(score);
};

export const assignLeadSegment = (leadScore) => {
  const segments = getLeadSegmentsConfig();
  if (!segments || !segments.hot || !segments.warm) {
    console.warn("Lead segments configuration is missing or incomplete.");
    return 'cold'; 
  }
  if (leadScore >= segments.hot.minScore) return 'hot';
  if (leadScore >= segments.warm.minScore) return 'warm';
  return 'cold';
};

export const logInteraction = async (leadId, interactionType, details = {}) => {
  try {
    const { data, error } = await supabase
      .from('lead_interactions')
      .insert([{ lead_id: leadId, interaction_type: interactionType, details }])
      .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error logging interaction:', error.message);
    throw error;
  }
};

export const getLeadInteractions = async (leadId) => {
  try {
    const { data, error } = await supabase
      .from('lead_interactions')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lead interactions:', error.message);
    throw error;
  }
};
