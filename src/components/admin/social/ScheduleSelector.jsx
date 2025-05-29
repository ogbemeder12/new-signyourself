
import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

function ScheduleSelector({ date, time, onDateChange, onTimeChange }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline-block mr-2" />
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4 inline-block mr-2" />
          Time
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </motion.div>
    </div>
  );
}

export default ScheduleSelector;
