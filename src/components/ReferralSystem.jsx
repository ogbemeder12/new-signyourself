
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Share2 } from "lucide-react";
import { siteConfig } from "@/lib/config";

function ReferralSystem({ onPointsEarned }) {
  const { toast } = useToast();
  const [referralCode] = useState(() => {
    return localStorage.getItem("referralCode") || 
      Math.random().toString(36).substring(2, 8).toUpperCase();
  });

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: "Join our rewards program",
        text: "Use my referral code to get started!",
        url: referralLink,
      });
    } else {
      navigator.clipboard.writeText(referralLink);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold mb-4">Refer Friends & Earn</h3>
      <p className="text-gray-600 mb-6">
        Share your referral code with friends and earn {siteConfig.pointsSystem.referralBonus} points
        for each friend who joins!
      </p>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Your Referral Code</p>
            <p className="text-2xl font-mono font-bold">{referralCode}</p>
          </div>
          <Button
            onClick={copyReferralCode}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
        </div>
      </div>

      <Button
        onClick={shareReferralLink}
        className="w-full flex items-center justify-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share Referral Link
      </Button>
    </div>
  );
}

export default ReferralSystem;
