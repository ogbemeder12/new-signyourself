
import React from "react";
import { Button } from "@/components/ui/button";
import LevelProgress from "@/components/gamification/LevelProgress";

function PointsDisplay({ points, currentTier, nextTier, loading, onEarnPoints }) {
  return (
    <div className="mb-8">
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-blue-900">Your Status</h3>
            <p className="text-3xl font-bold text-blue-600">{currentTier.level}</p>
            <p className="text-lg text-blue-800 mt-2">{points} Points</p>
          </div>
          <Button 
            onClick={() => onEarnPoints(10, "daily activity")}
            disabled={loading}
            className="mt-4 md:mt-0"
          >
            {loading ? "Loading..." : "Earn Points"}
          </Button>
        </div>

        {nextTier && (
          <LevelProgress
            level={currentTier.level}
            experience={points}
            nextLevelExp={nextTier.points}
          />
        )}
      </div>
    </div>
  );
}

export default PointsDisplay;
