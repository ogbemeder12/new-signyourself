
import React from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const WaitingListSocialShare = ({ onSocialShare, referralBonusPoints }) => {
  return (
    <motion.div 
      initial={{opacity:0, y:20}}
      animate={{opacity:1, y:0}}
      transition={{delay: 0.6, duration: 0.5}}
      className="mt-12"
    >
      <h3 className="text-xl font-semibold mb-3">Share & Boost Your Spot!</h3>
      <p className="text-sm mb-4 opacity-90">
        Refer friends using your unique code (available after joining) and earn {referralBonusPoints} points per referral!
      </p>
      <div className="flex justify-center space-x-4">
          <Button onClick={() => onSocialShare('twitter')} variant="outline" className="text-sky-300 border-sky-300 hover:bg-sky-400/30 hover:text-white backdrop-blur-sm bg-white/5">
              <Share2 className="mr-2 h-4 w-4" /> Share on X
          </Button>
          <Button onClick={() => onSocialShare('facebook')} variant="outline" className="text-blue-300 border-blue-300 hover:bg-blue-400/30 hover:text-white backdrop-blur-sm bg-white/5">
              <Share2 className="mr-2 h-4 w-4" /> Share on Facebook
          </Button>
      </div>
    </motion.div>
  );
};

export default WaitingListSocialShare;
