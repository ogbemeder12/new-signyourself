
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const scheduleEmailNotification = async (userId, type, scheduledFor = null) => {
  try {
    const notificationData = {
      id: uuidv4(),
      user_id: userId,
      type,
      status: 'pending',
      scheduled_for: scheduledFor || new Date().toISOString(),
      metadata: {
        template: type,
        priority: type === 'welcome' ? 'high' : 'normal',
        retry_count: 0,
        platform: 'email',
        created_at: new Date().toISOString(),
        tracking: {
          campaign_id: uuidv4(),
          source: 'automated',
          template_version: '1.0'
        }
      }
    };

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert([notificationData])
      .select()
      .single();

    if (error) throw error;
    return notification;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
};
