"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, Clock3, Loader2 } from "lucide-react";

const daysOfWeek = [
  "monday",
  "tuesday", 
  "wednesday",
  "thursday",
  "friday",
  "saturday", 
  "sunday",
] as const;

function toEthiopianTime(time: string): string {
  const [hour, minute] = time.split(':').map(Number)
  const ethiopianHour = (hour - 6 + 24) % 24
  const period = ethiopianHour >= 12 ? 'PM' : 'AM'
  const displayHour = ethiopianHour > 12 ? ethiopianHour - 12 : ethiopianHour
  return `${displayHour || 12}:${minute.toString().padStart(2, '0')} ${period}`
}

const WorkingHours = () => {
  const { data: hours, isLoading } = useQuery({
    queryKey: ["business-hours"],
    queryFn: async () => {
      const res = await fetch("/api/business-hours");
      if (!res.ok) throw new Error("Failed to fetch business hours");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <section className="py-24 border-b border-gray-200 px-6 bg-gradient-to-br from-white via-gray-50 to-white" id="hours">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <div className="h-10 w-32 mx-auto bg-red-50 animate-pulse rounded-full" />
            <div className="h-12 w-64 mx-auto bg-gray-100 animate-pulse rounded-lg" />
            <div className="h-20 w-full max-w-2xl mx-auto bg-gray-50 animate-pulse rounded-lg" />
          </div>
          
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-xl bg-white border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-100 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-100 animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 border-b border-gray-200 px-6 bg-gradient-to-br from-white via-gray-50 to-white" id="hours">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="inline-block px-4 py-2 bg-red-50 text-red-500 text-sm font-medium rounded-full">
            Opening Times
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            Business Hours
          </h2>
          <p className="text-gray-600 text-lg font-light tracking-wide max-w-2xl mx-auto">
            We&apos;re here to serve you during these hours. Come visit us or place your order!
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {daysOfWeek.map((day) => {
            const dayHours = hours?.[day];
            const isToday = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase() === day;
            
            return (
              <div
                key={day}
                className={`flex items-center justify-between p-6 rounded-xl transition-all duration-300
                  ${isToday 
                    ? 'bg-red-50 border-2 border-red-200 shadow-lg' 
                    : 'bg-white border border-gray-100 hover:border-red-200 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center gap-4">
                  {isToday ? (
                    <Clock3 className="w-6 h-6 text-red-500" />
                  ) : (
                    <Clock className="w-6 h-6 text-gray-400" />
                  )}
                  <div className="flex flex-col">
                    <span className={`capitalize font-medium ${isToday ? 'text-red-600' : 'text-gray-900'}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-xs text-red-500 font-medium">Today</span>
                    )}
                  </div>
                </div>
                <span className={`font-medium ${
                  dayHours?.isClosed 
                    ? 'text-gray-500' 
                    : isToday ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {dayHours?.isClosed
                    ? "Closed"
                    : `${toEthiopianTime(dayHours?.open || "00:00")} - ${toEthiopianTime(dayHours?.close || "00:00")}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkingHours;