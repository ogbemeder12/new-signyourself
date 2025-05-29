
import { supabase } from '@/lib/supabase';

// Enhanced Analytics Tracking
export const trackAnalytics = async (type, metadata = {}) => {
  try {
    const analyticsData = {
      type,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        page_url: window.location.href,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        screen_size: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    await supabase.from('analytics').insert([analyticsData]);
  } catch (error) {
    console.error('Error tracking analytics:', error);
  }
};

// Enhanced Metrics Calculation
export const calculateMetrics = (data, period = 30) => {
  const now = new Date();
  const periodStart = new Date(now.getTime() - period * 24 * 60 * 60 * 1000);

  const filteredData = data.filter(item => 
    new Date(item.created_at) >= periodStart
  );

  return {
    total: filteredData.length,
    averagePerDay: filteredData.length / period,
    bySource: calculateSourceDistribution(filteredData),
    byStatus: calculateStatusDistribution(filteredData),
    conversionRate: calculateConversionRate(filteredData),
    trends: calculateTrends(filteredData, period)
  };
};

// Calculate source distribution
const calculateSourceDistribution = (data) => {
  return data.reduce((acc, item) => {
    const source = item.source || 'direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
};

// Calculate status distribution
const calculateStatusDistribution = (data) => {
  return data.reduce((acc, item) => {
    const status = item.status || 'new';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
};

// Calculate conversion rate
const calculateConversionRate = (data) => {
  const converted = data.filter(item => item.status === 'converted').length;
  return data.length > 0 ? (converted / data.length) * 100 : 0;
};

// Calculate trends
const calculateTrends = (data, period) => {
  const trends = {};
  const now = new Date();

  // Initialize all days with 0
  for (let i = 0; i < period; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateKey = date.toISOString().split('T')[0];
    trends[dateKey] = {
      total: 0,
      converted: 0,
      sources: {}
    };
  }

  // Fill in actual data
  data.forEach(item => {
    const date = new Date(item.created_at).toISOString().split('T')[0];
    if (trends[date]) {
      trends[date].total++;
      if (item.status === 'converted') {
        trends[date].converted++;
      }
      const source = item.source || 'direct';
      trends[date].sources[source] = (trends[date].sources[source] || 0) + 1;
    }
  });

  return trends;
};

// Enhanced A/B Testing Analytics
export const trackABTest = async (testId, variant, event, metadata = {}) => {
  try {
    const testData = {
      test_id: testId,
      variant,
      event,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        session_id: sessionStorage.getItem('session_id'),
        page_context: {
          url: window.location.href,
          referrer: document.referrer
        }
      }
    };

    await supabase.from('ab_tests').insert([testData]);
  } catch (error) {
    console.error('Error tracking A/B test:', error);
  }
};

// Calculate A/B Test Results
export const calculateABTestResults = async (testId) => {
  try {
    const { data: testData } = await supabase
      .from('ab_tests')
      .select('*')
      .eq('test_id', testId);

    const variants = {};
    testData.forEach(record => {
      if (!variants[record.variant]) {
        variants[record.variant] = {
          views: 0,
          conversions: 0,
          events: {}
        };
      }

      variants[record.variant].views++;
      if (record.event === 'conversion') {
        variants[record.variant].conversions++;
      }

      if (!variants[record.variant].events[record.event]) {
        variants[record.variant].events[record.event] = 0;
      }
      variants[record.variant].events[record.event]++;
    });

    // Calculate conversion rates and confidence intervals
    Object.keys(variants).forEach(variant => {
      const { views, conversions } = variants[variant];
      variants[variant].conversionRate = views > 0 ? (conversions / views) * 100 : 0;
      variants[variant].confidenceInterval = calculateConfidenceInterval(conversions, views);
    });

    return variants;
  } catch (error) {
    console.error('Error calculating A/B test results:', error);
    return null;
  }
};

// Calculate confidence interval
const calculateConfidenceInterval = (conversions, trials, confidence = 0.95) => {
  if (trials === 0) return { lower: 0, upper: 0 };

  const p = conversions / trials;
  const z = 1.96; // 95% confidence level
  const stderr = Math.sqrt((p * (1 - p)) / trials);

  return {
    lower: Math.max(0, p - z * stderr),
    upper: Math.min(1, p + z * stderr)
  };
};
