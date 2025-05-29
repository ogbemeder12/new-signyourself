
import React from "react";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

function PlatformSelector({ selectedPlatforms, onToggle }) {
  const platforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600 bg-blue-100" },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "text-sky-600 bg-sky-100" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600 bg-pink-100" }
  ];

  return (
    <div className="flex gap-2">
      {platforms.map((platform) => (
        <motion.div
          key={platform.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button
            variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
            className={`flex items-center gap-2 ${
              selectedPlatforms.includes(platform.id) ? platform.color : ""
            }`}
            onClick={() => onToggle(platform.id)}
          >
            <platform.icon className="w-4 h-4" />
            {platform.name}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export default PlatformSelector;
