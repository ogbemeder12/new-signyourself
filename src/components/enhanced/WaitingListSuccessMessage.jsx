
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const WaitingListSuccessMessage = ({ position, referralCode, onSocialShare }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-xl shadow-2xl text-white text-center max-w-md mx-auto my-10"
    >
      <CheckCircle className="w-16 h-16 mx-auto mb-6 text-white" />
      <h2 className="text-3xl font-bold mb-3">You're In!</h2>
      <p className="text-lg mb-2">
        Your spot on the waiting list is confirmed. {position ? `You are currently #${position}.` : "We're calculating your position."}
      </p>
      <p className="text-md mb-6">Your unique referral code: <strong className="text-yellow-300">{referralCode}</strong></p>
      <p className="text-sm mb-4">Share this code to climb the list and earn rewards!</p>
      <div className="flex justify-center space-x-3 mb-6">
          <Button onClick={() => onSocialShare('twitter')} variant="outline" className="text-sky-400 border-sky-400 hover:bg-sky-400 hover:text-white">
            <Share2 className="mr-2 h-4 w-4" /> Share on X
          </Button>
          <Button onClick={() => onSocialShare('facebook')} variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
            <Share2 className="mr-2 h-4 w-4" /> Share on Facebook
          </Button>
      </div>
      <p className="text-xs opacity-80">We'll notify you when it's your turn. Exclusive perks await!</p>
    </motion.div>
  );
};

export default WaitingListSuccessMessage;
