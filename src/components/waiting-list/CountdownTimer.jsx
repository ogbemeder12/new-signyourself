
import React from "react";
import Countdown from "react-countdown";

function CountdownTimer({ date }) {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg mb-8">
      <h3 className="text-xl font-semibold mb-4">Launch Countdown</h3>
      <Countdown
        date={date}
        renderer={({ days, hours, minutes, seconds }) => (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-purple-600">{days}</div>
              <div className="text-sm text-gray-600">Days</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-purple-600">{hours}</div>
              <div className="text-sm text-gray-600">Hours</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-purple-600">{minutes}</div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-purple-600">{seconds}</div>
              <div className="text-sm text-gray-600">Seconds</div>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default CountdownTimer;
