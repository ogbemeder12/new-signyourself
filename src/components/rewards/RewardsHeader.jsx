
import React from "react";
import { motion } from "framer-motion";
import PointsDisplay from "./PointsDisplay";

function RewardsHeader({ points, currentTier, nextTier, loading, onEarnPoints }) {
  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Rewards Program</h2>
        
        <PointsDisplay 
          points={points}
          currentTier={currentTier}
          nextTier={nextTier}
          loading={loading}
          onEarnPoints={onEarnPoints}
        />
      </motion.div>
    </div>
  );
}

export default RewardsHeader;
