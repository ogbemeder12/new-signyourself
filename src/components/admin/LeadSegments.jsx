
import React from "react";
import { motion } from "framer-motion";
import { Flame, Sun, Snowflake } from "lucide-react";

function LeadSegments({ segments, loading }) {
  const segmentCards = [
    {
      title: "Hot Leads",
      leads: segments.hot,
      icon: Flame,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Warm Leads",
      leads: segments.warm,
      icon: Sun,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Cold Leads",
      leads: segments.cold,
      icon: Snowflake,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {segmentCards.map((segment, index) => (
          <motion.div
            key={segment.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${segment.bgColor} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`${segment.color} p-2 rounded-full bg-white`}>
                <segment.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">{segment.title}</h3>
            </div>

            <p className="text-3xl font-bold mb-4">
              {loading ? "-" : segment.leads.length}
            </p>

            <div className="space-y-2">
              {!loading && segment.leads.slice(0, 3).map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded p-3 shadow-sm"
                >
                  <p className="text-sm font-medium">{lead.email}</p>
                  <p className="text-xs text-gray-500">
                    Score: {lead.engagement_score}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default LeadSegments;
