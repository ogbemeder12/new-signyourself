
import React from "react";
import { motion } from "framer-motion";

function DistributionSection({ metrics, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SourceDistribution metrics={metrics} />
      <StatusDistribution metrics={metrics} />
    </div>
  );
}

function SourceDistribution({ metrics }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">Source Distribution</h3>
      <div className="space-y-4">
        {Object.entries(metrics?.bySource || {}).map(([source, count]) => {
          const percentage = (count / (metrics?.total || 1)) * 100;
          return (
            <div key={source}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{source}</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function StatusDistribution({ metrics }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
      <div className="space-y-4">
        {Object.entries(metrics?.byStatus || {}).map(([status, count]) => {
          const percentage = (count / (metrics?.total || 1)) * 100;
          return (
            <div key={status}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{status}</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${
                    status === 'converted' ? 'bg-green-500' :
                    status === 'contacted' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default DistributionSection;
