
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Gift, Star, Calendar, Users } from "lucide-react";

function Sweepstakes() {
  const { toast } = useToast();
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem("sweepstakesEntries");
    return savedEntries ? parseInt(savedEntries) : 0;
  });

  const prizes = [
    {
      title: "Grand Prize",
      value: "$1,000",
      description: "Cash prize or equivalent gift card",
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Second Prize",
      value: "$500",
      description: "Shopping spree at selected stores",
      icon: Gift,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Third Prize",
      value: "$250",
      description: "Premium merchandise bundle",
      icon: Star,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ];

  const enterSweepstakes = () => {
    const newEntries = entries + 1;
    setEntries(newEntries);
    localStorage.setItem("sweepstakesEntries", newEntries.toString());
    
    toast({
      title: "Entry Confirmed! 🎉",
      description: "Your sweepstakes entry has been recorded. Good luck!",
    });
  };

  return (
    <section className="my-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-lg shadow-lg p-8"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Monthly Prize Draw
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter our exclusive monthly sweepstakes for a chance to win amazing prizes!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span>New winners selected every month</span>
                </li>
                <li className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>Multiple entries allowed</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>No purchase necessary</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">
                Your Entries
              </h4>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-blue-600">{entries}</p>
                <Button 
                  onClick={enterSweepstakes}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Enter Now
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {prizes.map((prize, index) => (
              <motion.div
                key={prize.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${prize.bgColor} p-6 rounded-lg border border-opacity-50`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${prize.color} p-3 rounded-full bg-white`}>
                    <prize.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{prize.title}</h4>
                    <p className="text-2xl font-bold text-gray-900 my-1">
                      {prize.value}
                    </p>
                    <p className="text-gray-600">{prize.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Next Drawing</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900">14</p>
              <p className="text-sm text-gray-600">Days</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900">06</p>
              <p className="text-sm text-gray-600">Hours</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900">32</p>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900">15</p>
              <p className="text-sm text-gray-600">Seconds</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Sweepstakes;
