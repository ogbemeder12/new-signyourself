
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

function PointHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPointHistory();
  }, []);

  const fetchPointHistory = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        toast({
          title: "Authentication Error",
          description: "Could not fetch user session. Please try logging in again.",
          variant: "destructive",
        });
        // Attempt to load from local storage as a fallback if user is not authenticated
        const savedHistory = JSON.parse(localStorage.getItem("pointsHistory") || "[]");
        setHistory(savedHistory);
        setLoading(false);
        return;
      }
      
      if (user) {
        const { data, error } = await supabase
          .from('points_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching points history from Supabase:', error);
          toast({
            title: "Error",
            description: "Failed to fetch points history from the server.",
            variant: "destructive",
          });
          // Fallback to local storage if server fetch fails
          const savedHistory = JSON.parse(localStorage.getItem("pointsHistory") || "[]");
          setHistory(savedHistory);
        } else {
          setHistory(data || []);
          localStorage.setItem("pointsHistory", JSON.stringify(data || [])); 
        }
      } else {
        const savedHistory = JSON.parse(localStorage.getItem("pointsHistory") || "[]");
        setHistory(savedHistory);
        toast({
          title: "Offline Mode",
          description: "Displaying locally saved points history. Please log in to sync.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Unexpected error in fetchPointHistory:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while fetching points history.",
        variant: "destructive",
      });
      const savedHistory = JSON.parse(localStorage.getItem("pointsHistory") || "[]");
      setHistory(savedHistory);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Points History</h3>
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-4">
          {history.length > 0 ? history.map((entry, index) => (
            <motion.div
              key={entry.id || `local-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{entry.description || "N/A"}</p>
                  <p className="text-sm text-gray-500">
                    {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "Date N/A"}
                  </p>
                </div>
                <span className={`font-bold text-lg ${entry.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.points > 0 ? '+' : ''}{entry.points}
                  <span className="text-sm ml-1">points</span>
                </span>
              </div>
            </motion.div>
          )) : (
             <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 bg-gray-50 rounded-lg"
            >
              <p className="text-gray-500">No point history available yet.</p>
              <p className="text-sm text-gray-400 mt-1">Earn points by engaging with the campaign!</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default PointHistory;
