
import React from "react";
import ChartContainer from "./ChartContainer";

function ChartSection({ metrics, loading }) {
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
    <ChartContainer
      title="Lead Growth & Conversions"
      data={chartData}
      lines={chartLines}
      height={400}
      loading={loading}
    />
  );
}

export default ChartSection;
