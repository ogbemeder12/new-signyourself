
import React from "react";
import { motion } from "framer-motion";

function CampaignHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Exclusive Rewards & Sweepstakes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our exclusive rewards program and enter exciting sweepstakes for a chance to win amazing prizes!
          </p>
        </motion.div>
      </div>
    </header>
  );
}

export default CampaignHeader;
