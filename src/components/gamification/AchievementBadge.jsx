
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function AchievementBadge({ title, description, icon: Icon, unlocked }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className={`p-4 rounded-lg border ${
        unlocked
          ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-full ${
            unlocked ? "bg-yellow-100 text-yellow-700" : "bg-gray-200 text-gray-500"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default AchievementBadge;
