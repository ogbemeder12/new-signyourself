
import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Image as ImageIcon } from "lucide-react";

function PostPreview({ content, scheduledDate, scheduledTime, media, platform }) {
  const platformStyles = {
    facebook: {
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    twitter: {
      bgColor: "bg-sky-50",
      textColor: "text-sky-600",
      borderColor: "border-sky-200"
    },
    instagram: {
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
      borderColor: "border-pink-200"
    }
  };

  const style = platformStyles[platform];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`border rounded-lg p-4 ${style.borderColor} ${style.bgColor}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-full ${style.bgColor} flex items-center justify-center`}>
          <span className={`text-lg font-bold ${style.textColor}`}>
            {platform.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-medium capitalize">{platform}</span>
      </div>

      <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: content }} />

      {media.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {media.map((file, index) => (
            <div
              key={index}
              className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center"
            >
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        {scheduledDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{scheduledDate}</span>
          </div>
        )}
        {scheduledTime && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{scheduledTime}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default PostPreview;
