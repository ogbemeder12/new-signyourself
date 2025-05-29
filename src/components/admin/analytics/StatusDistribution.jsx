
import React from "react";
import { motion } from "framer-motion";

function StatusDistribution({ statuses = {}, total = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
      <div className="space-y-4">
        {Object.entries(statuses).map(([status, count]) => {
          const percentage = (count / total) * 100;
          return (
            <div key={status}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{status}</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    status === 'converted' ? 'bg-green-500' :
                    status === 'contacted' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}
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

export default StatusDistribution;
