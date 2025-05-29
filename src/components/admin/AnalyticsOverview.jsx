
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Clock, Award, ChevronDown, ChevronUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

function AnalyticsOverview({ leads, loading }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const stats = {
    totalLeads: leads.length,
    conversionRate: (leads.filter(l => l.status === 'converted').length / leads.length * 100).toFixed(1),
    averageEngagement: leads.reduce((acc, lead) => acc + (lead.engagement_score || 0), 0) / leads.length,
    activeToday: leads.filter(l => {
      const today = new Date();
      const lastActivity = new Date(l.last_activity);
      return lastActivity.toDateString() === today.toDateString();
    }).length
  };

  // Generate chart data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const chartData = last30Days.map(date => ({
    date,
    leads: leads.filter(l => l.created_at.split('T')[0] === date).length,
    conversions: leads.filter(l => l.status === 'converted' && l.converted_at?.split('T')[0] === date).length
  }));

  const cards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12% from last month",
      trendUp: true
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+5% from last month",
      trendUp: true
    },
    {
      title: "Avg. Engagement",
      value: stats.averageEngagement.toFixed(1),
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "-2% from last month",
      trendUp: false
    },
    {
      title: "Active Today",
      value: stats.activeToday,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "+8% from yesterday",
      trendUp: true
    }
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${card.bgColor} rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow`}
            onClick={() => toggleSection(card.title)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{loading ? "-" : card.value}</p>
                <div className={`flex items-center mt-2 ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trendUp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span className="text-sm">{card.trend}</span>
                </div>
              </div>
              <div className={`${card.color} p-3 rounded-full bg-white`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-6">Lead Growth & Conversions</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'MMM d')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#4F46E5"
                strokeWidth={2}
                name="New Leads"
              />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="#10B981"
                strokeWidth={2}
                name="Conversions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Lead Sources</h3>
          <div className="space-y-4">
            {[
              { source: "Direct", percentage: 45, color: "bg-blue-500" },
              { source: "Referral", percentage: 30, color: "bg-green-500" },
              { source: "Social", percentage: 15, color: "bg-purple-500" },
              { source: "Other", percentage: 10, color: "bg-orange-500" }
            ].map((source) => (
              <div key={source.source}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{source.source}</span>
                  <span>{source.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-full rounded-full ${source.color}`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {leads.slice(0, 5).map((lead, index) => (
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
      </div>
    </div>
  );
}

export default AnalyticsOverview;
