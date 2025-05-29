
import React from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

function AnalyticsCard({ title, value, icon: Icon, color, bgColor, trend, trendUp, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <div className={`flex items-center mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="text-sm">{trend}</span>
          </div>
        </div>
        <div className={`${color} p-3 rounded-full bg-white`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}

export default AnalyticsCard;
