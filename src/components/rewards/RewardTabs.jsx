
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, Trophy, Target } from "lucide-react";

function RewardTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'standard', label: 'Standard', icon: Gift },
    { id: 'seasonal', label: 'Seasonal', icon: Calendar },
    { id: 'achievement', label: 'Achievements', icon: Trophy },
    { id: 'milestone', label: 'Milestones', icon: Target }
  ];

  return (
    <div className="flex space-x-4 mb-6 relative">
      <div className="absolute bottom-0 w-full h-0.5 bg-gray-200 -z-10" />
      {tabs.map(tab => (
        <motion.div key={tab.id} className="relative">
          <Button
            onClick={() => onTabChange(tab.id)}
            variant={activeTab === tab.id ? "default" : "outline"}
            className="flex items-center gap-2 relative z-10"
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default RewardTabs;
