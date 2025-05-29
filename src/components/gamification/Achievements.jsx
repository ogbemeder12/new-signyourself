
import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Target, Zap, Award, Crown } from "lucide-react";
import AchievementBadge from "./AchievementBadge";

function Achievements({ points, shareCount }) {
  const achievements = [
    {
      title: "First Steps",
      description: "Earn your first points",
      icon: Star,
      unlocked: points > 0,
    },
    {
      title: "Social Butterfly",
      description: "Share 3 times on social media",
      icon: Zap,
      unlocked: shareCount >= 3,
    },
    {
      title: "Point Collector",
      description: "Reach 1000 points",
      icon: Trophy,
      unlocked: points >= 1000,
    },
    {
      title: "Elite Member",
      description: "Reach Gold tier or higher",
      icon: Crown,
      unlocked: points >= 2500,
    },
    {
      title: "Dedicated Fan",
      description: "Visit 5 days in a row",
      icon: Target,
      unlocked: false, // Implement streak tracking
    },
    {
      title: "VIP Status",
      description: "Reach Diamond tier",
      icon: Award,
      unlocked: points >= 5000,
    },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-6">Your Achievements</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <AchievementBadge {...achievement} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
