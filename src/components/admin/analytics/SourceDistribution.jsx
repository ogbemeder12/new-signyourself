
import React from "react";
import { motion } from "framer-motion";

function SourceDistribution({ sources = {}, total = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">Source Distribution</h3>
      <div className="space-y-4">
        {Object.entries(sources).map(([source, count]) => {
          const percentage = (count / total) * 100;
          return (
            <div key={source}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{source}</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default SourceDistribution;
