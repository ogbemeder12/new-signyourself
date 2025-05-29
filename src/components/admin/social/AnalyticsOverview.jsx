
import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, ThumbsUp, Share2, MessageCircle } from "lucide-react";

function AnalyticsOverview({ selectedPlatforms }) {
  // Simulated data - in a real app, this would come from your API
  const metrics = {
    facebook: {
      followers: 12500,
      engagement: 3.2,
      reach: 45000,
      posts: 128
    },
    twitter: {
      followers: 8900,
      engagement: 2.8,
      reach: 32000,
      posts: 256
    },
    instagram: {
      followers: 15600,
      engagement: 4.5,
      reach: 52000,
      posts: 164
    }
  };

  const chartData = [
    { name: "Jan", facebook: 2400, twitter: 1398, instagram: 3200 },
    { name: "Feb", facebook: 1398, twitter: 2400, instagram: 2800 },
    { name: "Mar", facebook: 9800, twitter: 2400, instagram: 4200 },
    { name: "Apr", facebook: 3908, twitter: 2000, instagram: 3800 },
    { name: "May", facebook: 4800, twitter: 2400, instagram: 4300 },
    { name: "Jun", facebook: 3800, twitter: 2600, instagram: 4100 }
  ];

  const cards = [
    { title: "Total Followers", icon: Users, color: "text-blue-600" },
    { title: "Engagement Rate", icon: ThumbsUp, color: "text-green-600" },
    { title: "Total Reach", icon: Share2, color: "text-purple-600" },
    { title: "Total Posts", icon: MessageCircle, color: "text-orange-600" }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-opacity-10 ${card.color} bg-current`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <div className="mt-2 space-y-2">
              {selectedPlatforms.map(platform => (
                <div key={platform} className="flex justify-between items-center">
                  <span className="capitalize text-gray-600">{platform}</span>
                  <span className="font-medium">
                    {card.title === "Total Followers" && metrics[platform].followers.toLocaleString()}
                    {card.title === "Engagement Rate" && `${metrics[platform].engagement}%`}
                    {card.title === "Total Reach" && metrics[platform].reach.toLocaleString()}
                    {card.title === "Total Posts" && metrics[platform].posts}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-6">Engagement Overview</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {selectedPlatforms.includes("facebook") && (
                <Line
                  type="monotone"
                  dataKey="facebook"
                  stroke="#1877F2"
                  strokeWidth={2}
                  name="Facebook"
                />
              )}
              {selectedPlatforms.includes("twitter") && (
                <Line
                  type="monotone"
                  dataKey="twitter"
                  stroke="#1DA1F2"
                  strokeWidth={2}
                  name="Twitter"
                />
              )}
              {selectedPlatforms.includes("instagram") && (
                <Line
                  type="monotone"
                  dataKey="instagram"
                  stroke="#E4405F"
                  strokeWidth={2}
                  name="Instagram"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">Top Performing Posts</h2>
          <div className="space-y-4">
            {selectedPlatforms.map(platform => (
              <div key={platform} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-2 h-2 rounded-full bg-${platform === 'facebook' ? 'blue' : platform === 'twitter' ? 'sky' : 'pink'}-500`} />
                  <span className="capitalize font-medium">{platform}</span>
                </div>
                <p className="text-gray-600 text-sm">
                  "Best performing post content example for {platform}..."
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span>Likes: 1.2k</span>
                  <span>Shares: 342</span>
                  <span>Comments: 89</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">Audience Demographics</h2>
          <div className="space-y-4">
            {selectedPlatforms.map(platform => (
              <div key={platform} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-2 h-2 rounded-full bg-${platform === 'facebook' ? 'blue' : platform === 'twitter' ? 'sky' : 'pink'}-500`} />
                  <span className="capitalize font-medium">{platform}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Age Range</p>
                    <p className="font-medium">25-34 (42%)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium">Female (58%)</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AnalyticsOverview;
