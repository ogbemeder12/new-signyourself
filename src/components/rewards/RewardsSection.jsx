
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import EnhancedSocialShare from "@/components/enhanced/EnhancedSocialShare";
import Achievements from "@/components/gamification/Achievements";
import PointHistory from "@/components/PointHistory";
import { rewardTiers } from "@/lib/config";
import RewardsHeader from "./RewardsHeader";
import RewardTierList from "./RewardTierList";
import usePointsManager from "./PointsManager";

function RewardsSection() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shareCount, setShareCount] = useState(() => {
    return parseInt(localStorage.getItem("socialShareCount") || "0");
  });

  const { earnPoints } = usePointsManager();

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('points')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setPoints(data.points || 0);
      } else {
        const savedPoints = localStorage.getItem("rewardPoints");
        setPoints(savedPoints ? parseInt(savedPoints) : 0);
      }
    } catch (error) {
      console.error('Error fetching points:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEarnPoints = async (amount, reason, platform = null) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const newPoints = await earnPoints(user?.id, points, amount, reason, platform);
      setPoints(newPoints);
    } catch (error) {
      console.error('Error earning points:', error);
    }
  };

  const getCurrentTier = () => {
    return rewardTiers.reduce((acc, tier) => {
      if (points >= tier.points) return tier;
      return acc;
    }, rewardTiers[0]);
  };

  const getNextTier = () => {
    const currentTierIndex = rewardTiers.findIndex(tier => tier.points > points);
    return currentTierIndex !== -1 ? rewardTiers[currentTierIndex] : null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  return (
    <section className="my-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <RewardsHeader
          points={points}
          currentTier={currentTier}
          nextTier={nextTier}
          loading={loading}
          onEarnPoints={handleEarnPoints}
        />

        <EnhancedSocialShare onPointsEarned={handleEarnPoints} />
        
        <Achievements points={points} shareCount={shareCount} />
        
        <PointHistory />

        <RewardTierList tiers={rewardTiers} points={points} />
      </motion.div>
    </section>
  );
}

export default RewardsSection;
