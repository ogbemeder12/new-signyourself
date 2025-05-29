
import React from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

const WaitingListHeader = ({ title, description }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Gift className="w-20 h-20 mx-auto mb-6 text-yellow-300" />
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
        {title}
      </h2>
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
        {description}
      </p>
    </motion.div>
  );
};

export default WaitingListHeader;
