
import React from "react";
import { motion } from "framer-motion";
import RewardTier from "./RewardTier";

function RewardTierList({ tiers, points }) {
  return (
    <div className="grid gap-6 mt-8">
      {tiers.map((tier, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <RewardTier
            tier={tier}
            points={points}
            index={index}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default RewardTierList;
