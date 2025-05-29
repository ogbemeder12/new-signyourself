
import React from "react";
import { motion } from "framer-motion";
import { Clock, Gift, Star } from "lucide-react";

function SuccessMessage({ position, discountCode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="bg-green-50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-green-800 mb-4">
          Welcome to the VIP List! 🎉
        </h3>
        <p className="text-green-700 mb-4">
          Your position: #{position}
        </p>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Your Exclusive Discount Code</p>
          <p className="text-3xl font-mono font-bold text-purple-600">{discountCode}</p>
          <p className="text-sm text-gray-500 mt-2">Save this code for special early access discount!</p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">What's Next?</h4>
        <ul className="text-left space-y-3">
          <li className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>We'll notify you when it's your turn</span>
          </li>
          <li className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-500" />
            <span>Keep your discount code safe</span>
          </li>
          <li className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            <span>Get ready for exclusive early access!</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}

export default SuccessMessage;
