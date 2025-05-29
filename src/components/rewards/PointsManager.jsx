
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { sendPointsEarnedEmail } from "@/lib/emailService";
import { trackUserActivity, trackSocialShare } from "@/lib/crm";

function usePointsManager() {
  const { toast } = useToast();

  const earnPoints = async (userId, currentPoints, amount, reason, platform = null) => {
    const newPoints = currentPoints + amount;

    try {
      if (userId) {
        const { error } = await supabase
          .from('users')
          .upsert({ 
            id: userId, 
            points: newPoints,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;

        if (platform) {
          await trackSocialShare(userId, platform, window.location.href);
        }

        await trackUserActivity(userId, 'earn_points', {
          points_earned: amount,
          reason,
          platform,
          new_total: newPoints
        });

        const { data: user } = await supabase.auth.getUser();
        if (user?.email) {
          await sendPointsEarnedEmail(user.email, amount, reason);
        }
      } else {
        localStorage.setItem("rewardPoints", newPoints.toString());
      }

      toast({
        title: "Points Earned! 🎉",
        description: `You've earned ${amount} points for ${reason}!`,
      });

      return newPoints;
    } catch (error) {
      console.error('Error updating points:', error);
      toast({
        title: "Error",
        description: "Failed to update points. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { earnPoints };
}

export default usePointsManager;
