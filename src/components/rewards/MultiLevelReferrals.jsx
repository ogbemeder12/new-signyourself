
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Share2, Users, Award, ChevronRight } from "lucide-react";
import { getReferralTiers } from "@/lib/rewardsUtils";

function MultiLevelReferrals() {
  const { toast } = useToast();
  const [referralTiers, setReferralTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralTiers();
  }, []);

  const loadReferralTiers = async () => {
    try {
      const tiers = await getReferralTiers();
      setReferralTiers(tiers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load referral tiers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Join our platform",
        text: "Join me on this amazing platform and get exclusive rewards!",
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Multi-Level Referrals</h2>
            <p className="text-gray-600">Invite friends and earn more rewards</p>
          </div>
          <Button
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Now
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {referralTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-purple-100">
                  {index === 0 ? (
                    <Users className="w-6 h-6 text-purple-600" />
                  ) : index === 1 ? (
                    <Award className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-indigo-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{tier.name}</h3>
                  <p className="text-sm text-gray-500">Level {tier.level}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Points Multiplier</span>
                  <span className="font-semibold text-purple-600">
                    {tier.points_multiplier}x
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tier.points_multiplier * 20}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default MultiLevelReferrals;
