
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

function WaitingListForm({ email, phone, isSubmitting, onEmailChange, onPhoneChange, onSubmit }) {
  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Enter your email for exclusive access"
            required
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="flex items-center">
            <Phone className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="tel"
              value={phone}
              onChange={onPhoneChange}
              placeholder="Enter your phone number (optional)"
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200"
      >
        {isSubmitting ? "Joining..." : "Join VIP List"}
      </Button>
    </motion.form>
  );
}

export default WaitingListForm;
