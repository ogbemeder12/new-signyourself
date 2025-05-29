
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Clock, Award } from "lucide-react";
import { calculateMetrics, trackAnalytics } from "@/lib/analyticsUtils";
import AnalyticsCard from "./AnalyticsCard";
import ChartContainer from "./ChartContainer";
import SourceDistribution from "./SourceDistribution";
import StatusDistribution from "./StatusDistribution";
import RecentActivity from "./RecentActivity";

function AnalyticsOverview({ leads, loading }) {
  const [metrics, setMetrics] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);

  useEffect(() => {
    if (!loading && leads.length > 0) {
      calculateMetricsData();
    }
  }, [leads, loading]);

  const calculateMetricsData = async () => {
    const calculatedMetrics = calculateMetrics(leads, 30);
    setMetrics(calculatedMetrics);

    await trackAnalytics('view_analytics', {
      metrics: Object.keys(calculatedMetrics)
    });
  };

  const cards = [
    {
      title: "Total Leads",
      value: metrics?.total || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12% from last month",
      trendUp: true
    },
    {
      title: "Conversion Rate",
      value: `${(metrics?.conversionRate || 0).toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+5% from last month",
      trendUp: true
    },
    {
      title: "Avg. Engagement",
      value: (metrics?.averageEngagement || 0).toFixed(1),
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "-2% from last month",
      trendUp: false
    },
    {
      title: "Active Today",
      value: metrics?.activeToday || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "+8% from yesterday",
      trendUp: true
    }
  ];

  const chartData = Object.entries(metrics?.trends || {}).map(([date, data]) => ({
    date,
    total: data.total,
    converted: data.converted
  }));

  const chartLines = [
    { key: "total", name: "Total Leads", color: "#4F46E5" },
    { key: "converted", name: "Conversions", color: "#10B981" }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <AnalyticsCard
            key={card.title}
            {...card}
            onClick={() => setSelectedMetric(card.title)}
          />
        ))}
      </div>

      <ChartContainer
        title="Lead Growth & Conversions"
        data={chartData}
        lines={chartLines}
        height={400}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SourceDistribution sources={metrics?.bySource} total={metrics?.total} />
        <StatusDistribution statuses={metrics?.byStatus} total={metrics?.total} />
      </div>

      <RecentActivity leads={leads.slice(0, 5)} />
    </div>
  );
}

export default AnalyticsOverview;
