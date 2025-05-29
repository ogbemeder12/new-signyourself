
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { siteConfig } from "@/lib/config";

function SocialShare({ onPointsEarned }) {
  const { toast } = useToast();

  const handleShare = async (platform) => {
    const points = siteConfig.pointsSystem.socialShare[platform];
    const message = encodeURIComponent("Join our amazing rewards program!");
    let url;

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${message}&url=${window.location.href}`;
        break;
      case 'instagram':
        // Instagram sharing is typically done through their app
        toast({
          title: "Instagram Sharing",
          description: "Please screenshot and share on Instagram to earn points!",
        });
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }

    // Award points for sharing
    onPointsEarned(points, `Shared on ${platform}`);
    
    toast({
      title: "Points Earned!",
      description: `You earned ${points} points for sharing on ${platform}!`,
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Share and Earn Points</h3>
      <div className="flex gap-4">
        <Button
          onClick={() => handleShare('facebook')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Facebook className="w-4 h-4" />
          Share
        </Button>
        <Button
          onClick={() => handleShare('twitter')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Twitter className="w-4 h-4" />
          Tweet
        </Button>
        <Button
          onClick={() => handleShare('instagram')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Instagram className="w-4 h-4" />
          Share
        </Button>
      </div>
    </div>
  );
}

export default SocialShare;
