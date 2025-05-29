
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";

function ContentCalendar({ selectedPlatforms }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateMonth = (direction) => {
    setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  // Simulated scheduled posts data
  const scheduledPosts = {
    "2025-04-15": [
      { platform: "facebook", content: "Product launch announcement" },
      { platform: "twitter", content: "Quick update about new features" }
    ],
    "2025-04-20": [
      { platform: "instagram", content: "Behind the scenes look" }
    ]
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold">Content Calendar</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-2 text-center text-sm font-medium"
            >
              {day}
            </div>
          ))}
          {days.map((day, dayIdx) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const posts = scheduledPosts[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={day.toString()}
                className={`min-h-[120px] bg-white p-2 ${
                  !isCurrentMonth ? "text-gray-400" : ""
                } ${isToday(day) ? "bg-blue-50" : ""}`}
              >
                <span className={`text-sm ${
                  isToday(day) ? "font-bold text-blue-600" : ""
                }`}>
                  {format(day, "d")}
                </span>
                
                <div className="mt-2 space-y-1">
                  {posts.filter(post => selectedPlatforms.includes(post.platform))
                    .map((post, postIdx) => (
                    <div
                      key={postIdx}
                      className={`text-xs p-1 rounded ${
                        post.platform === "facebook" ? "bg-blue-100 text-blue-700" :
                        post.platform === "twitter" ? "bg-sky-100 text-sky-700" :
                        "bg-pink-100 text-pink-700"
                      }`}
                    >
                      {post.content}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Upcoming Posts</h3>
        <div className="space-y-4">
          {Object.entries(scheduledPosts).map(([date, posts]) => (
            <div key={date} className="border-b pb-4">
              <p className="font-medium mb-2">{format(new Date(date), "MMMM d, yyyy")}</p>
              <div className="space-y-2">
                {posts.filter(post => selectedPlatforms.includes(post.platform))
                  .map((post, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      post.platform === "facebook" ? "bg-blue-500" :
                      post.platform === "twitter" ? "bg-sky-500" :
                      "bg-pink-500"
                    }`} />
                    <span className="capitalize">{post.platform}</span>
                    <span className="text-gray-600">-</span>
                    <span>{post.content}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default ContentCalendar;
