
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { calculateMetrics, trackAnalytics } from "@/lib/analyticsUtils";
import AnalyticsHeader from "./AnalyticsHeader";
import MetricsGrid from "./MetricsGrid";
import ChartSection from "./ChartSection";
import ABTestingSection from "./ABTestingSection";
import DistributionSection from "./DistributionSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";

function EnhancedAnalytics({ data, period = 30 }) {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showABTesting, setShowABTesting] = useState(false);
  const [dateRange, setDateRange] = useState("30");
  const [filterSource, setFilterSource] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    calculateMetricsData();
  }, [data, period, dateRange, filterSource, refreshKey]);

  const calculateMetricsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filteredData = filterSource === "all" 
        ? data 
        : data.filter(item => item.source === filterSource);

      const calculatedMetrics = calculateMetrics(filteredData, parseInt(dateRange));
      setMetrics(calculatedMetrics);

      await trackAnalytics('view_analytics', {
        period: dateRange,
        filter: filterSource,
        metrics: Object.keys(calculatedMetrics)
      });
    } catch (error) {
      console.error('Error calculating metrics:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to calculate metrics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Refreshing Data",
      description: "Fetching latest analytics data...",
    });
  };

  const sources = Object.keys(metrics?.bySource || {});

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-red-50 rounded-lg text-center"
      >
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Analytics</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        <AnalyticsHeader
          dateRange={dateRange}
          filterSource={filterSource}
          sources={sources}
          showABTesting={showABTesting}
          onDateRangeChange={setDateRange}
          onFilterSourceChange={setFilterSource}
          onToggleABTesting={() => setShowABTesting(!showABTesting)}
          onRefresh={handleRefresh}
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <LoadingSpinner />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <MetricsGrid metrics={metrics} />
              <ChartSection metrics={metrics} />
              {showABTesting && <ABTestingSection />}
              <DistributionSection metrics={metrics} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default EnhancedAnalytics;
