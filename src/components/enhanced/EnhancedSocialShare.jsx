
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Facebook, Twitter, Instagram, Share2, Award } from "lucide-react";
import { siteConfig } from "@/lib/config";
import Confetti from "react-confetti";

function EnhancedSocialShare({ onPointsEarned }) {
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [shareCount, setShareCount] = useState(() => {
    return parseInt(localStorage.getItem("socialShareCount") || "0");
  });

  const handleShare = async (platform) => {
    const points = siteConfig.pointsSystem.socialShare[platform];
    const message = encodeURIComponent("Join our amazing rewards program and earn exclusive rewards! 🎁");
    let url;

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${message}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${message}&url=${window.location.href}`;
        break;
      case 'instagram':
        toast({
          title: "Instagram Story",
          description: "Screenshot and share to your Instagram story to earn points!",
        });
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }

    // Show confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Update share count
    const newShareCount = shareCount + 1;
    setShareCount(newShareCount);
    localStorage.setItem("socialShareCount", newShareCount.toString());

    // Award points
    onPointsEarned(points, `Shared on ${platform}`);
    
    toast({
      title: "Points Earned! 🎉",
      description: `You earned ${points} points for sharing on ${platform}!`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 mt-6"
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={100} />}

      <div className="flex items-center gap-3 mb-4">
        <Award className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold">Share & Earn Rewards</h3>
      </div>

      <p className="text-gray-600 mb-6">
        Share your experience with friends and earn bonus points! Each share earns you points towards exclusive rewards.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => handleShare('facebook')}
          variant="outline"
          className="w-full bg-white hover:bg-blue-50 transition-colors"
        >
          <Facebook className="w-5 h-5 mr-2 text-blue-600" />
          Share on Facebook
        </Button>

        <Button
          onClick={() => handleShare('twitter')}
          variant="outline"
          className="w-full bg-white hover:bg-blue-50 transition-colors"
        >
          <Twitter className="w-5 h-5 mr-2 text-blue-400" />
          Share on Twitter
        </Button>

        <Button
          onClick={() => handleShare('instagram')}
          variant="outline"
          className="w-full bg-white hover:bg-pink-50 transition-colors"
        >
          <Instagram className="w-5 h-5 mr-2 text-pink-600" />
          Share on Instagram
        </Button>
      </div>

      <AnimatePresence>
        {shareCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-green-50 rounded-lg"
          >
            <p className="text-green-700 font-medium">
              You've shared {shareCount} times! Keep sharing to earn more points!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default EnhancedSocialShare;
