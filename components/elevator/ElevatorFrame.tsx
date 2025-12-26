'use client';

import { ReactNode, useEffect } from 'react';
import { useElevatorStore } from '@/store/useElevatorStore';
import { useRouter, usePathname } from 'next/navigation';
import { Shuffle, Search } from 'lucide-react';
import ElevatorDoors from './ElevatorDoors';
import { useElevatorSystem } from '@/hooks/useElevatorSystem';

// Map routes to floors
const FLOOR_MAP: Record<string, string> = {
  "/": "1",
  "/top-rated": "2",
  "/movies": "3"
};

const LABEL_MAP: Record<string, string> = {
  "1": "Trending",
  "2": "Top Rated",
  "3": "Movies"
}

export default function ElevatorFrame({ children }: { children: ReactNode }) {
  const { currentFloor, isMoving, setFloor, callElevator } = useElevatorSystem();
  const pathname = usePathname();

  // Sync initial floor based on path
  useEffect(() => {
    if (!isMoving) {
        // Check for Detail pages
        if (pathname.includes("/anime/")) {
            setFloor("Detail");
        } else {
            const floor = FLOOR_MAP[pathname] || "1";
            setFloor(floor);
        }
    }
  }, [pathname]);

  const handleFloorChange = (targetFloor: string, path: string) => {
    if (targetFloor === currentFloor || isMoving) return;
    callElevator(path, targetFloor);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-wall-dark flex flex-col z-0 overflow-hidden font-sans">
      
      {/* Top Panel - Floor Indicator */}
      <div className="h-24 bg-wall-light border-b-8 border-wall-dark flex items-center justify-center shadow-lg z-50 relative shrink-0">
         {/* Bezel */}
        <div className="bg-black px-12 py-3 rounded-lg border-4 border-brass-accent shadow-[0_0_30px_rgba(255,191,0,0.3)] min-w-[340px] text-center relative overflow-hidden">
           {/* Glass Reflection */}
           <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
           
           <span className="text-[#ffbf00] font-display text-5xl tracking-widest drop-shadow-[0_0_10px_rgba(255,191,0,0.8)] relative z-10" style={{ textShadow: "0 0 15px rgba(255, 191, 0, 0.6), 0 0 30px rgba(255, 191, 0, 0.4)" }}>
             {LABEL_MAP[currentFloor] || currentFloor}
           </span>
        </div>
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Main Viewport */}
        <div className="flex-1 relative bg-bg-paper overflow-hidden z-10 flex flex-col shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
           {/* Vignette Overlay */}
           <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_150px_rgba(0,0,0,0.6)]" />

           {/* The content area */}
           <div className="flex-1 overflow-y-auto relative no-scrollbar z-10">
               {children}
           </div>
           
           {/* Doors Overlay */}
           <ElevatorDoors />
        </div>

        {/* Right Panel - Controls */}
        <aside className="w-32 bg-wall-light border-l-8 border-wall-dark flex flex-col items-center py-12 gap-8 shadow-2xl z-50 relative shrink-0">
           {/* Texture overlay */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-20 pointer-events-none" />
           
           <ControlBtn label="1" sub="Trend" active={currentFloor === "1"} onClick={() => handleFloorChange("1", "/")} />
           <ControlBtn label="2" sub="Top" active={currentFloor === "2"} onClick={() => handleFloorChange("2", "/top-rated")} />
           <ControlBtn label="3" sub="Mov" active={currentFloor === "3"} onClick={() => handleFloorChange("3", "/movies")} />
           
           <div className="h-2 border-b-2 border-wall-dark/20 w-16 my-2" />
           
           <div className="flex flex-col gap-6">
               <ControlBtn label="R" icon={<Shuffle size={20} />} onClick={() => {}} />
               <ControlBtn label="S" icon={<Search size={20} />} onClick={() => {}} />
           </div>
        </aside>
      </div>

      {/* Bottom Trim */}
      <div className="h-16 bg-wall-dark border-t-8 border-[#3e342a] z-50 shrink-0" />
    </div>
  );
}

function ControlBtn({ label, sub, onClick, active, icon }: any) {
    return (
        <button 
           onClick={onClick}
           className={`
             w-16 h-16 rounded-full border-[6px] flex flex-col items-center justify-center transition-all duration-300 active:scale-95 relative group
             ${active 
               ? 'bg-[#ffeebb] border-[#ffcc00] text-[#554400] shadow-[0_0_20px_rgba(255,200,0,0.6)] scale-105' 
               : 'bg-brass-accent border-[#8a7020] text-wall-dark shadow-md hover:brightness-110 hover:shadow-[0_0_10px_rgba(212,175,55,0.4)]'}
           `}
        >
            {icon ? icon : <span className="font-display font-bold text-2xl leading-none">{label}</span>}
            {sub && <span className="absolute -bottom-6 text-[10px] font-bold text-white/50 tracking-wider uppercase font-sans text-center w-20">{sub}</span>}
            
            {/* Shine effect */}
            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white/30 blur-[1px]" />
        </button>
    )
}
