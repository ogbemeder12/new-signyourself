
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Gift, Star, Clock } from "lucide-react";
import { 
  getAvailableRewards, 
  getSeasonalRewards,
  getAchievementRewards,
  getMilestoneRewards,
  claimReward,
  claimSeasonalReward,
  claimAchievementReward,
  claimMilestoneReward
} from "@/lib/rewardsUtils";
import RewardCard from "./RewardCard";
import RewardTabs from "./RewardTabs";

function CustomRewards() {
  const { toast } = useToast();
  const [standardRewards, setStandardRewards] = useState([]);
  const [seasonalRewards, setSeasonalRewards] = useState([]);
  const [achievementRewards, setAchievementRewards] = useState([]);
  const [milestoneRewards, setMilestoneRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('standard');

  useEffect(() => {
    loadAllRewards();
  }, []);

  const loadAllRewards = async () => {
    try {
      setLoading(true);
      const [standard, seasonal, achievements, milestones] = await Promise.all([
        getAvailableRewards(),
        getSeasonalRewards(),
        getAchievementRewards(),
        getMilestoneRewards()
      ]);

      setStandardRewards(standard);
      setSeasonalRewards(seasonal);
      setAchievementRewards(achievements);
      setMilestoneRewards(milestones);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rewards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (rewardId, type) => {
    try {
      const userId = "current-user-id"; // Replace with actual user ID
      let claimed;

      switch (type) {
        case 'seasonal':
          claimed = await claimSeasonalReward(userId, rewardId);
          break;
        case 'achievement':
          claimed = await claimAchievementReward(userId, rewardId);
          break;
        case 'milestone':
          claimed = await claimMilestoneReward(userId, rewardId);
          break;
        default:
          claimed = await claimReward(userId, rewardId);
      }
      
      toast({
        title: "Success!",
        description: "Reward claimed successfully!",
      });
      
      loadAllRewards();
      return claimed;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim reward",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getActiveRewards = () => {
    switch (activeTab) {
      case 'seasonal':
        return seasonalRewards;
      case 'achievement':
        return achievementRewards;
      case 'milestone':
        return milestoneRewards;
      default:
        return standardRewards;
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Rewards Center</h2>
            <p className="text-gray-600">Discover and claim exclusive rewards</p>
          </div>
        </div>

        <RewardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <Clock className="w-8 h-8 animate-spin text-gray-400" />
            </motion.div>
          ) : (
            <motion.div
              key="rewards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {getActiveRewards().map(reward => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    type={activeTab}
                    onClaim={handleClaim}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default CustomRewards;
