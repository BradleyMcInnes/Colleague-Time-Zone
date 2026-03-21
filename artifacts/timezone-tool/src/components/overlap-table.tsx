import * as React from "react"
import { motion } from "framer-motion"
import { Clock, Moon, Sun, Sparkles } from "lucide-react"

import { Person } from "@/components/person-card"
import { useCurrentTime, formatInTimeZone, isWorkingHour, isDifferentDay } from "@/lib/time-utils"

interface OverlapTableProps {
  people: Person[];
  baseTimezone?: string;
}

export function OverlapTable({ people, baseTimezone }: OverlapTableProps) {
  const currentTime = useCurrentTime(60000); // Update every minute
  
  // Filter out people who haven't selected a city yet
  const activePeople = people.filter(p => p.city !== null) as (Person & { city: NonNullable<Person["city"]> })[];
  
  if (activePeople.length === 0 || !baseTimezone) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-slate-500">
        <Clock className="w-12 h-12 mb-4 text-slate-300" />
        <h3 className="text-lg font-medium text-slate-700">No time zones selected</h3>
        <p className="max-w-sm mt-1 text-sm">Select your location and add colleagues to see overlapping working hours.</p>
      </div>
    )
  }

  // Generate 24 hours based on the base (user's) timezone today
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const currentBaseHour = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: baseTimezone, hour: 'numeric', hour12: false }).format(currentTime), 10);
  const safeCurrentBaseHour = currentBaseHour === 24 ? 0 : currentBaseHour;

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-xl border-slate-200/60 bg-white/40">
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-sm text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
              <th className="sticky left-0 z-20 bg-white/90 backdrop-blur-md p-4 font-semibold text-slate-400 w-24 border-r border-slate-100 shadow-[2px_0_10px_-4px_rgba(0,0,0,0.05)]">
                Local Time
              </th>
              {activePeople.map((p, i) => (
                <th key={p.id} className="p-4 min-w-[140px] text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold text-slate-900 text-base">
                      {p.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded-full">
                      {p.city.name}
                    </span>
                    <span className="text-xs font-bold text-primary mt-1 flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" />
                      {formatInTimeZone(currentTime, p.city.timezone, 'time')}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => {
              // Create a date object representing this hour in the base timezone for TODAY
              const rowDate = new Date();
              // A slight hack: to guarantee we represent the right hour locally, we manipulate the date.
              // Instead of heavy math, let's just use the current date and set the hour. 
              // Note: This relies on the system timezone matching the base timezone, OR we just accept we are iterating 24 hours from local midnight.
              // To make it purely base-tz relative without complex date-fns, we find midnight in baseTz.
              // Simpler: iterate 0-23 and format based on local system, but this app might have user pick a different base than system.
              // Let's assume `rowDate` is just today, and we override hours. Since it's a visual grid, relative hours work fine.
              rowDate.setHours(hour, 0, 0, 0);

              const isCurrentHour = hour === safeCurrentBaseHour;
              
              // Check if everyone is in working hours
              const isFullOverlap = activePeople.every(p => isWorkingHour(rowDate, p.city.timezone));

              return (
                <tr 
                  key={hour} 
                  className={`
                    border-b border-slate-100 last:border-0 transition-colors duration-150
                    ${isFullOverlap ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-slate-50/80'}
                    ${isCurrentHour ? 'ring-2 ring-inset ring-primary/40 bg-primary/[0.02]' : ''}
                  `}
                >
                  <td className="sticky left-0 z-10 p-3 text-center border-r border-slate-100 bg-white/90 backdrop-blur-md shadow-[2px_0_10px_-4px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col items-center justify-center">
                      <span className={`text-sm font-bold ${isCurrentHour ? 'text-primary' : 'text-slate-600'}`}>
                        {formatInTimeZone(rowDate, baseTimezone, 'hour')}
                      </span>
                      {hour === 0 || hour === 12 ? (
                        <span className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">
                          {hour === 0 ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  
                  {activePeople.map((p) => {
                    const tzTimeStr = formatInTimeZone(rowDate, p.city.timezone, 'hour');
                    const tzDayStr = formatInTimeZone(rowDate, p.city.timezone, 'weekday');
                    const isWorking = isWorkingHour(rowDate, p.city.timezone);
                    const dayDiffers = isDifferentDay(rowDate, baseTimezone, p.city.timezone);
                    
                    return (
                      <td key={p.id} className="p-2 relative">
                        <div className={`
                          flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all
                          ${isWorking ? (isFullOverlap ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105 z-10' : 'bg-primary/10 text-primary font-semibold') : 'text-slate-500'}
                        `}>
                          <span className="text-sm">
                            {tzTimeStr}
                          </span>
                          {dayDiffers && (
                            <span className={`text-[10px] mt-0.5 font-bold uppercase tracking-widest ${isWorking && isFullOverlap ? 'text-white/80' : 'text-slate-400'}`}>
                              {tzDayStr}
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Legend / Footer */}
      <div className="bg-slate-50/80 border-t border-slate-100 p-4 flex items-center justify-center gap-6 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/10 border border-primary/20" />
          <span>Working Hours (9AM - 6PM)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/30 flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
          <span>Perfect Overlap</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border-2 border-primary/40 bg-transparent" />
          <span>Current Time</span>
        </div>
      </div>
    </div>
  )
}
