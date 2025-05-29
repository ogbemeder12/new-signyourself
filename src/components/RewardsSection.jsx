
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Share2, Star, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { trackSocialShare } from "@/lib/crm/socialReferralUtils";
import { sendPointsEarnedEmail } from "@/lib/emailService";
import { siteConfig } from "@/lib/config";
import LoadingSpinner from "@/components/LoadingSpinner";

function RewardsSection({ session }) {
  const { toast } = useToast();
  const [points, setPoints] = useState(0);
  const [user, setUser] = useState(null);
  const [loadingPoints, setLoadingPoints] = useState(true);

  useEffect(() => {
    setUser(session?.user ?? null);
  }, [session]);

  useEffect(() => {
    const initializePoints = async () => {
      setLoadingPoints(true);
      if (user && user.id) {
        await fetchPoints(user.id);
      } else {
        const localPoints = localStorage.getItem('guestPoints');
        setPoints(localPoints ? parseInt(localPoints, 10) : 0);
        setLoadingPoints(false);
      }
    };
    initializePoints();
  }, [user]);

  const fetchPoints = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("points")
        .eq("id", userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching points:", error);
        toast({ title: "Error Fetching Points", description: error.message, variant: "destructive" });
        setPoints(0);
      } else if (data) {
        setPoints(data.points || 0);
      } else {
        const { error: upsertError } = await supabase.from('users').upsert({ id: userId, points: 0, email: user?.email }, { onConflict: 'id' });
        if (upsertError) {
          console.error("Error upserting user on fetchPoints:", upsertError);
          toast({ title: "Error Initializing Points", description: upsertError.message, variant: "destructive" });
        }
        setPoints(0);
      }
    } catch (error) {
      console.error("Catch error fetching points:", error);
      toast({ title: "Error", description: "Could not load points.", variant: "destructive" });
      setPoints(0);
    } finally {
      setLoadingPoints(false);
    }
  };

  const earnPoints = async (action, amount) => {
    let userIdToUpdate = user?.id;

    if (!user) {
      let currentGuestPoints = parseInt(localStorage.getItem('guestPoints') || '0', 10);
      const newGuestPoints = currentGuestPoints + amount;
      localStorage.setItem('guestPoints', newGuestPoints.toString());
      setPoints(newGuestPoints);
      toast({
        title: "Points Earned!",
        description: `You earned ${amount} points for ${action}. Sign up to save your progress!`,
        icon: <Zap className="w-5 h-5 text-yellow-400" />,
      });
      return;
    }
    
    setLoadingPoints(true);
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("points, email")
        .eq("id", userIdToUpdate)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }
      
      const currentDatabasePoints = userData?.points || 0;
      const newTotalPoints = currentDatabasePoints + amount;

      const { error: updateError } = await supabase
        .from("users")
        .upsert({ id: userIdToUpdate, points: newTotalPoints, email: user.email }, { onConflict: 'id' });

      if (updateError) throw updateError;

      setPoints(newTotalPoints);
      toast({
        title: "Points Earned!",
        description: `You earned ${amount} points for ${action}.`,
        icon: <Zap className="w-5 h-5 text-yellow-400" />,
      });

      if (user.email) {
         await sendPointsEarnedEmail(user.email, amount, action, newTotalPoints);
      }

      if (action === "sharing content" && userIdToUpdate) {
        await trackSocialShare(userIdToUpdate, "general", window.location.href);
      }

    } catch (error) {
      console.error("Error earning points:", error);
      toast({
        title: "Error Earning Points",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
    } finally {
      setLoadingPoints(false);
    }
  };

  const rewardItems = (siteConfig && Array.isArray(siteConfig.rewards) ? siteConfig.rewards : []).map(reward => ({
    ...reward,
    icon: reward.icon === "Gift" ? Gift : reward.icon === "Star" ? Star : Zap,
  }));

  if (loadingPoints && user) { // Only show spinner if user is supposed to be logged in and points are loading
    return (
      <div className="py-12 flex justify-center items-center">
        <LoadingSpinner text="Loading rewards..." />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="py-12 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl shadow-2xl"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Unlock Exclusive Rewards!
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Earn points by engaging with our content, sharing with friends, and
          participating in special events. Redeem your points for amazing
          rewards.
        </p>

        <motion.div
          className="mb-10 text-5xl font-bold text-yellow-400"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
        >
          {(!user && loadingPoints) ? "Loading..." : `${points} Points`}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {rewardItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg hover:bg-white/20 transition-all"
            >
              <item.icon className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-sm opacity-80 mb-3">{item.description}</p>
              <Button
                onClick={() => earnPoints(item.action, item.points)}
                variant="secondary"
                className="bg-yellow-400 hover:bg-yellow-500 text-indigo-700 font-semibold"
                disabled={loadingPoints && !!user}
              >
                {item.cta} ({item.points} pts)
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Button
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl transition-transform transform hover:scale-105"
            onClick={() => earnPoints("sharing content", 50)}
            disabled={loadingPoints && !!user}
          >
            <Share2 className="mr-3 h-6 w-6" />
            Share & Earn Big!
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default RewardsSection;
