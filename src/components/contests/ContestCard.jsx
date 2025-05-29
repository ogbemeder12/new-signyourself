
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Users, Clock } from "lucide-react";
import { format } from "date-fns";

function ContestCard({ contest, onEnter }) {
  const isActive = new Date(contest.end_date) > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative">
        <img 
          className="w-full h-48 object-cover"
          alt="Contest banner image"
         src="https://images.unsplash.com/photo-1569713694846-bf1dbbfe1351" />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Active' : 'Ended'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{contest.title}</h3>
        <p className="text-gray-600 mb-4">{contest.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(contest.start_date), 'MMM d')} - {format(new Date(contest.end_date), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Gift className="w-4 h-4" />
            <span>{contest.prize_description}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{contest.max_entries ? `Limited to ${contest.max_entries} entries` : 'Unlimited entries'}</span>
          </div>
        </div>

        {isActive ? (
          <Button
            onClick={() => onEnter(contest.id)}
            className="w-full flex items-center justify-center gap-2"
          >
            Enter Contest
          </Button>
        ) : (
          <div className="text-center text-gray-500">
            <Clock className="w-5 h-5 mx-auto mb-2" />
            <p>Contest has ended</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ContestCard;
