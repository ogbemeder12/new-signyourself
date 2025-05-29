
import React from "react";
import { Button } from "@/components/ui/button";

function AnalyticsHeader({
  dateRange,
  filterSource,
  sources,
  showABTesting,
  onDateRangeChange,
  onFilterSourceChange,
  onToggleABTesting
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      <div className="flex gap-4">
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <select
          value={filterSource}
          onChange={(e) => onFilterSourceChange(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Sources</option>
          {sources.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
        <Button
          onClick={onToggleABTesting}
          variant="outline"
          className="flex items-center gap-2"
        >
          {showABTesting ? "Hide A/B Testing" : "Show A/B Testing"}
        </Button>
      </div>
    </div>
  );
}

export default AnalyticsHeader;
