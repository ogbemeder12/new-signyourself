
import React from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Eye, TrendingUp, TrendingDown } from "lucide-react";

function EngagementMetrics({ selectedPlatforms }) {
  // Simulated data - in a real app, this would come from your API
  const metrics = {
    facebook: {
      likes: 15234,
      comments: 2341,
      shares: 892,
      views: 45123,
      trend: "+12%"
    },
    twitter: {
      likes: 8921,
      comments: 1234,
      shares: 567,
      views: 32145,
      trend: "-5%"
    },
    instagram: {
      likes: 25678,
      comments: 3456,
      shares: 1234,
      views: 67890,
      trend: "+23%"
    }
  };

  const engagementTypes = [
    { name: "Likes", icon: Heart, color: "text-red-500" },
    { name: "Comments", icon: MessageCircle, color: "text-blue-500" },
    { name: "Shares", icon: Share2, color: "text-green-500" },
    { name: "Views", icon: Eye, color: "text-purple-500" }
  ];

  return (
    <div className="space-y-8">
      {selectedPlatforms.map((platform) => (
        <motion.div
          key={platform}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold capitalize">{platform} Engagement</h2>
              <div className={`flex items-center gap-1 ${
                metrics[platform].trend.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}>
                {metrics[platform].trend.startsWith("+") ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{metrics[platform].trend}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
            {engagementTypes.map((type) => (
              <div key={type.name} className="space-y-2">
                <div className="flex items-center gap-2">
                  <type.icon className={`w-5 h-5 ${type.color}`} />
                  <span className="font-medium">{type.name}</span>
                </div>
                <p className="text-2xl font-bold">
                  {metrics[platform][type.name.toLowerCase()].toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-50">
            <h3 className="font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-medium">New engagement on post</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default EngagementMetrics;
