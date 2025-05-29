
import React from "react";
import { motion } from "framer-motion";

function RewardTier({ tier, points, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`p-6 rounded-lg border ${
        points >= tier.points
          ? "bg-green-50 border-green-200"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">{tier.level} Tier</h4>
        <span className="text-sm font-medium">
          {tier.points} points required
        </span>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {tier.rewards.map((reward, rewardIndex) => (
          <div 
            key={rewardIndex}
            className="p-3 bg-white rounded shadow-sm"
          >
            <h5 className="font-medium text-gray-900">{reward.name}</h5>
            <p className="text-sm text-gray-600">{reward.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default RewardTier;
