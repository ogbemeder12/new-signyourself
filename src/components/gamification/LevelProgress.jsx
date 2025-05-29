
import React from "react";
import { motion } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";

function LevelProgress({ level, experience, nextLevelExp }) {
  const progress = (experience / nextLevelExp) * 100;
  
  const props = useSpring({
    width: `${progress}%`,
    from: { width: "0%" },
    config: { tension: 120, friction: 14 },
  });

  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">Level {level}</span>
        <span className="text-gray-600">{experience}/{nextLevelExp} XP</span>
      </div>
      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
        <animated.div
          style={props}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>
    </div>
  );
}

export default LevelProgress;
