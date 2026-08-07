import React from "react";
import { CalendarRange, Clock, CheckCircle2, CheckCircle, ClipboardCheck } from "lucide-react";

const WeeklyTracker = ({ logbooks }) => {
  if (!logbooks || logbooks.length === 0) return null;

  // Group by week
  const weeksMap = {};
  logbooks.forEach(log => {
    const wk = log.week_number;
    if (!weeksMap[wk]) {
      weeksMap[wk] = {
        week: wk,
        logs: [],
        signedCount: 0,
        graded: log.school_supervisor_grade || null
      };
    }
    weeksMap[wk].logs.push(log);
    if (log.org_supervisor_signed) {
      weeksMap[wk].signedCount++;
    }
    if (log.school_supervisor_grade && !weeksMap[wk].graded) {
        weeksMap[wk].graded = log.school_supervisor_grade;
    }
  });

  const weeks = Object.values(weeksMap).sort((a, b) => a.week - b.week);

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] space-y-6">
      <h3 className="text-xl font-serif text-primary flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
          <CalendarRange className="text-primary w-5 h-5" />
        </div>
        Weekly Progress Tracker
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {weeks.map((w) => {
          const isFullySigned = w.signedCount === w.logs.length;
          let statusClasses = "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300";
          let Icon = Clock;
          
          if (w.graded) {
            statusClasses = "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-[0_5px_15px_rgba(16,185,129,0.15)]";
            Icon = CheckCircle2;
          } else if (isFullySigned) {
            statusClasses = "bg-blue-50 border-blue-100 text-blue-600 shadow-[0_5px_15px_rgba(59,130,246,0.15)]";
            Icon = CheckCircle;
          } else if (w.signedCount > 0) {
            statusClasses = "bg-amber-50 border-amber-100 text-amber-600 shadow-[0_5px_15px_rgba(245,158,11,0.1)]";
            Icon = ClipboardCheck;
          }

          return (
            <div key={w.week} className={`p-4 border rounded-2xl flex flex-col items-center text-center space-y-2 transition-all duration-300 hover:-translate-y-1 ${statusClasses}`}>
              <Icon className="w-6 h-6 mb-1 opacity-80" />
              <span className="text-sm font-bold tracking-tight text-slate-800">Week {w.week}</span>
              <span className="text-xs font-medium opacity-80">{w.logs.length} log{w.logs.length > 1 ? 's' : ''}</span>
              {w.graded && (
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/80 rounded-lg mt-2 text-emerald-700 shadow-sm">
                  {w.graded}%
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex flex-wrap gap-6 text-xs text-slate-500 font-semibold justify-center pt-4 border-t border-slate-100 mt-6">
        <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div> Pending</span>
        <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div> Partial Sign</span>
        <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div> Fully Signed</span>
        <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div> Graded</span>
      </div>
    </div>
  );
};

export default WeeklyTracker;
