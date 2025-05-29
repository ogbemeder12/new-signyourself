
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TrendingUp, Zap, AlertCircle, CheckCircle, Lightbulb, Settings2 } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

const ABTestingDashboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchABTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('ab_tests')
        .select(`
          *,
          variants:ab_test_variants(*)
        `);

      if (dbError) throw dbError;
      setTests(data || []);
    } catch (err) {
      console.error("Error fetching A/B tests:", err);
      setError(err.message || "Failed to fetch A/B tests.");
      toast({
        title: "Error",
        description: `Could not load A/B tests: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchABTests();
  }, [fetchABTests]);

  const handleCreateTest = () => {
    toast({
      title: "Feature Coming Soon",
      description: "A/B Test creation will be available in a future update.",
    });
  };

  const handleConcludeTest = async (testId, winningVariantId) => {
    try {
      const { error: updateError } = await supabase
        .from('ab_tests')
        .update({ status: 'concluded', winning_variant_id: winningVariantId })
        .eq('id', testId);

      if (updateError) throw updateError;

      toast({
        title: "Test Concluded",
        description: "A/B Test marked as concluded successfully.",
      });
      fetchABTests();
    } catch (err) {
      console.error("Error concluding test:", err);
      toast({
        title: "Error",
        description: `Failed to conclude test: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Loading Error</AlertTitle>
        <AlertDescription>{error} Please try refreshing the page.</AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 bg-gray-50 min-h-screen"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">A/B Testing Dashboard</h1>
        <Button onClick={handleCreateTest} className="bg-indigo-600 hover:bg-indigo-700">
          <Zap className="mr-2 h-5 w-5" /> Create New Test
        </Button>
      </div>

      {tests.length === 0 && !loading && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">No Active Tests</AlertTitle>
          <AlertDescription className="text-blue-600">
            There are currently no A/B tests running. Start a new test to optimize your campaigns!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <Card key={test.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-700 flex items-center">
                <TrendingUp className="mr-2 h-6 w-6" /> {test.name}
              </CardTitle>
              <CardDescription>Goal: {test.goal_metric}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className={`text-sm font-semibold mb-2 ${test.status === 'running' ? 'text-green-600' : 'text-gray-500'}`}>
                Status: {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
              </p>
              <div className="space-y-3">
                {test.variants?.map((variant) => (
                  <div key={variant.id} className="p-3 border rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-gray-700">{variant.name}</h4>
                      <span className="text-sm text-indigo-600 font-medium">
                        {variant.conversion_rate?.toFixed(2) ?? 'N/A'}% CR
                      </span>
                    </div>
                    <Progress value={variant.conversion_rate || 0} className="h-2 [&>*]:bg-indigo-500" />
                    <p className="text-xs text-gray-500 mt-1">Participants: {variant.participants ?? 0}</p>
                  </div>
                ))}
              </div>
              {test.status === 'running' && test.variants?.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => {
                    const winningVariant = test.variants.reduce((prev, current) => (prev.conversion_rate > current.conversion_rate) ? prev : current);
                    handleConcludeTest(test.id, winningVariant.id);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Conclude Test & Pick Winner
                </Button>
              )}
               {test.status === 'concluded' && test.winning_variant_id && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-center">
                  <p className="text-sm font-semibold text-green-700">
                    Winner: {test.variants?.find(v => v.id === test.winning_variant_id)?.name || 'N/A'}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-xs text-gray-500">
              <p>Started: {new Date(test.start_date).toLocaleDateString()}</p>
              {test.end_date && <p className="ml-auto">End: {new Date(test.end_date).toLocaleDateString()}</p>}
            </CardFooter>
          </Card>
        ))}
      </div>
       <Card className="mt-8 bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center text-indigo-800">
            <Settings2 className="mr-2 h-5 w-5" /> A/B Testing Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-indigo-700 space-y-2">
          <p><strong>Define a Clear Hypothesis:</strong> Know what you're testing and why.</p>
          <p><strong>Test One Variable at a Time:</strong> Isolate changes for clear results.</p>
          <p><strong>Ensure Statistical Significance:</strong> Run tests long enough for reliable data.</p>
          <p><strong>Segment Your Audience:</strong> Understand how changes affect different user groups.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ABTestingDashboard;

