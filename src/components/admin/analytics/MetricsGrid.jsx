
import React from "react";
import { Users, TrendingUp, Clock, Award } from "lucide-react";
import MetricsCard from "./MetricsCard";

function MetricsGrid({ metrics, loading }) {
  const cards = [
    {
      title: "Total Leads",
      value: metrics?.total || 0,
      change: 12,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Conversion Rate",
      value: `${(metrics?.conversionRate || 0).toFixed(1)}%`,
      change: 5,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Avg. Engagement",
      value: (metrics?.averageEngagement || 0).toFixed(1),
      change: -2,
      icon: Award,
      color: "text-purple-600"
    },
    {
      title: "Active Today",
      value: metrics?.activeToday || 0,
      change: 8,
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <MetricsCard key={card.title} {...card} />
      ))}
    </div>
  );
}

export default MetricsGrid;
