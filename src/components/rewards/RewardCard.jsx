
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gift, Star, Clock, Check, Trophy, Calendar, Target, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function RewardCard({ reward, type, onClaim, className }) {
  const { toast } = useToast();
  const [claiming, setClaiming] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClaim = async () => {
    try {
      setClaiming(true);
      await onClaim(reward.id, type);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive",
      });
    } finally {
      setClaiming(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'seasonal':
        return <Calendar className="w-6 h-6 text-orange-600" />;
      case 'achievement':
        return <Trophy className="w-6 h-6 text-purple-600" />;
      case 'milestone':
        return <Target className="w-6 h-6 text-blue-600" />;
      default:
        return <Gift className="w-6 h-6 text-indigo-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'seasonal':
        return 'bg-orange-100';
      case 'achievement':
        return 'bg-purple-100';
      case 'milestone':
        return 'bg-blue-100';
      default:
        return 'bg-indigo-100';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg p-6 shadow-lg relative overflow-hidden ${className}`}
    >
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-yellow-400 animate-spin" />
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-full ${getBackgroundColor()}`}>
          {getIcon()}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{reward.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-500">
              {reward.points_required} points required
            </span>
          </div>
        </div>
      </div>

      <motion.p 
        className="text-gray-600 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {reward.description}
      </motion.p>

      <div className="space-y-4">
        <AnimatePresence>
          {reward.quantity_available && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-500">Available</span>
              <span className="font-medium">
                {reward.quantity_available} remaining
              </span>
            </motion.div>
          )}

          {type === 'seasonal' && reward.season_end && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-500">Season ends</span>
              <span className="font-medium">
                {new Date(reward.season_end).toLocaleDateString()}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={handleClaim}
          className="w-full flex items-center justify-center gap-2 relative overflow-hidden"
          variant={reward.status === 'claimed' ? 'outline' : 'default'}
          disabled={reward.status === 'claimed' || claiming}
        >
          <AnimatePresence mode="wait">
            {claiming ? (
              <motion.div
                key="claiming"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20"
              >
                <div className="animate-spin">
                  <Clock className="w-4 h-4" />
                </div>
              </motion.div>
            ) : reward.status === 'claimed' ? (
              <motion.div
                key="claimed"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Claimed
              </motion.div>
            ) : (
              <motion.div
                key="claim"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                Claim Reward
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.div>
  );
}

export default RewardCard;
