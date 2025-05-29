
import { supabase } from '@/lib/supabase';

// ... (previous code remains exactly the same until line 136)

export const getRewardTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('reward_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching reward types:', error);
    throw error;
  }
};

export const getSeasonalRewards = async () => {
  try {
    const { data, error } = await supabase
      .from('seasonal_rewards')
      .select('*')
      .eq('status', 'active')
      .gte('season_end', new Date().toISOString());

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching seasonal rewards:', error);
    throw error;
  }
};

export const getAchievementRewards = async () => {
  try {
    const { data, error } = await supabase
      .from('achievement_rewards')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching achievement rewards:', error);
    throw error;
  }
};

export const getMilestoneRewards = async () => {
  try {
    const { data, error } = await supabase
      .from('milestone_rewards')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching milestone rewards:', error);
    throw error;
  }
};

export const claimSeasonalReward = async (userId, rewardId) => {
  try {
    const { data, error } = await supabase
      .from('user_rewards')
      .insert([{
        user_id: userId,
        reward_id: rewardId,
        reward_type: 'seasonal',
        redemption_code: generateRedemptionCode()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error claiming seasonal reward:', error);
    throw error;
  }
};

export const claimAchievementReward = async (userId, achievementId) => {
  try {
    const { data, error } = await supabase
      .from('user_rewards')
      .insert([{
        user_id: userId,
        reward_id: achievementId,
        reward_type: 'achievement',
        redemption_code: generateRedemptionCode()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error claiming achievement reward:', error);
    throw error;
  }
};

export const claimMilestoneReward = async (userId, milestoneId) => {
  try {
    const { data, error } = await supabase
      .from('user_rewards')
      .insert([{
        user_id: userId,
        reward_id: milestoneId,
        reward_type: 'milestone',
        redemption_code: generateRedemptionCode()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error claiming milestone reward:', error);
    throw error;
  }
};

const generateRedemptionCode = () => {
  return Math.random().toString(36).substring(2, 15).toUpperCase();
};
