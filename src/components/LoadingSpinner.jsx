
import React from "react";
import { motion } from "framer-motion";

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <p className="text-gray-600 animate-pulse">Loading data...</p>
    </div>
  );
}

export default LoadingSpinner;
