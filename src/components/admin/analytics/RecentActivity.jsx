
import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

function RecentActivity({ leads = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {leads.map((lead, index) => (
          <div key={lead.id} className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${
              lead.status === 'converted' ? 'bg-green-500' :
              lead.status === 'contacted' ? 'bg-blue-500' : 'bg-gray-500'
            }`} />
            <div>
              <p className="text-sm font-medium">{lead.email}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(lead.created_at), 'MMM d, h:mm a')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default RecentActivity;
