import React, { useState, useEffect } from "react";
import { Wifi, Battery, Signal, Zap, Sliders, Smartphone } from "lucide-react";

interface AndroidShellProps {
  children: React.ReactNode;
  title?: string;
}

export default function AndroidShell({ children }: AndroidShellProps) {
  const [time, setTime] = useState("");
  const [battery, setBattery] = useState(88);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    // Synchronize clock accurately
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  // Soft battery fluctuating simulation
  useEffect(() => {
    const batInterval = setInterval(() => {
      setBattery((prev) => {
        if (prev <= 5) return 99; // Reset at critically low
        return prev - 1;
      });
    }, 120000); // 2 minutes
    return () => clearInterval(batInterval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex items-center justify-center p-0 md:p-6 selection:bg-brand-magenta selection:text-white">
      {/* Visual background enhancements on desktop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,240,255,0.06),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,127,0.06),transparent_40%)] pointer-events-none" />
      
      {/* Smartphone Hardware Frame Mockup (Desktop Only) */}
      <div className="relative w-full max-w-[440px] md:h-[840px] h-screen bg-black md:rounded-[50px] md:border-[12px] md:border-neutral-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden transition-all duration-300 md:ring-4 md:ring-neutral-900">
        
        {/* Top Punch Hole Camera (Centered Notch) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-neutral-900 border border-neutral-800 z-50 flex items-center justify-center shadow-inner pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-950 opacity-60" />
        </div>

        {/* Floating Side Hardware Buttons (Desktop Only decoration) */}
        <div className="hidden md:block absolute right-[-15px] top-[140px] w-[3px] h-[50px] bg-neutral-700 rounded-s-md z-10" />
        <div className="hidden md:block absolute right-[-15px] top-[210px] w-[3px] h-[80px] bg-neutral-700 rounded-s-md z-10" />

        {/* Pixel/Android Status Bar Overlay */}
        <div className="h-10 bg-slate-950 px-6 flex items-center justify-between text-[11px] font-medium text-slate-350 select-none z-40 border-b border-slate-900 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tight text-neutral-100">{time || "10:00 AM"}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
          </div>
          
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-neutral-200" strokeWidth={2.5} />
            <Wifi className="w-3.5 h-3.5 text-neutral-200" strokeWidth={2.5} />
            <div className="flex items-center gap-0.5" onClick={() => setIsCharging(!isCharging)}>
              <span className="text-[10px] mr-0.5 text-neutral-300">{battery}%</span>
              <div className="relative">
                <Battery className={`w-4 h-4 text-neutral-200 rotate-90 ${battery < 20 ? 'text-rose-500' : ''}`} strokeWidth={2} />
                {isCharging && (
                  <Zap className="w-2.5 h-2.5 text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Screen/App Content Area */}
        <div className="flex-1 w-full bg-neutral-950 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Android bottom gesture pill bar */}
        <div className="h-6 bg-slate-950 flex items-center justify-center select-none shrink-0 border-t border-slate-900">
          <div className="w-36 h-1 rounded-full bg-neutral-700 hover:bg-neutral-500 transition-colors cursor-pointer" />
        </div>
        
      </div>
    </div>
  );
}
