'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';
import { useElevatorStore } from '@/store/useElevatorStore';
import { useRouter, usePathname } from 'next/navigation';
import { Shuffle, Search, Volume2, VolumeX, Heart } from 'lucide-react';
import ElevatorDoors from './ElevatorDoors';
import { useElevatorSystem } from '@/hooks/useElevatorSystem';
import { useAudioElement } from '../infrastructure/AudioSystem';

// Map routes to floors
const FLOOR_MAP: Record<string, string> = {
  "/": "1",
  "/top-rated": "2",
  "/movies": "3",
  "/search": "S",
  "/favorites": "L"
};

const LABEL_MAP: Record<string, string> = {
  "1": "Trending",
  "2": "Top Rated",
  "3": "Movies",
  "S": "Archive",
  "L": "Logbook",
  "Detail": "Detail",
  "??": "Destiny"
}

export default function ElevatorFrame({ children }: { children: ReactNode }) {
  const { currentFloor, isMoving, setFloor, callElevator, initiateTravel, arriveAtFloor } = useElevatorSystem();
  // We can use our audio hook though we don't have global state for BGM yet, 
  // setting up the UI for now.
  const { playClick } = useAudioElement();
  const [bgmPlaying, setBgmPlaying] = useState(false);
  
  // Ref for BGM
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgmRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3');
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.3;
    
    return () => {
        bgmRef.current?.pause();
    }
  }, []);

  const toggleBgm = () => {
      if (!bgmRef.current) return;
      
      if (bgmPlaying) {
          bgmRef.current.pause();
      } else {
          bgmRef.current.play().catch(e => console.log("Audio autoplay block", e));
      }
      setBgmPlaying(!bgmPlaying);
  };
  
  const pathname = usePathname();
  const router = useRouter(); 

  // Sync initial floor based on path
  useEffect(() => {
    if (!isMoving) {
        // Check for Detail pages
        if (pathname.includes("/anime/")) {
            setFloor("Detail");
        } else if (pathname === "/search") {
            setFloor("S");
        } else if (pathname === "/favorites") {
            setFloor("L");
        } else {
            const floor = FLOOR_MAP[pathname] || "1";
            setFloor(floor);
        }
    }
  }, [pathname]);

  const handleFloorChange = (targetFloor: string, path: string) => {
    if (targetFloor === currentFloor || isMoving) return;
    playClick();
    callElevator(path, targetFloor);
  };

  const handleRandom = async () => {
      if (isMoving) return;
      playClick();
      
      // 1. Close Doors with "??" indicator
      initiateTravel("??");

      // 2. Fetch Random logic while doors are closed
      import('@/api/animeClient').then(async (mod) => {
          // Minimal delay to ensure doors are shut before API returns (optional, but good for UX)
          await new Promise(r => setTimeout(r, 1000));
          
          const anime = await mod.animeClient.getRandomAnime();
          
          if (anime) {
              router.push(`/anime/${anime.mal_id}`);
              // Store/System will auto-update floor to "Detail" via the useEffect on pathname change
              // But we manually arrive after a slight delay
              setTimeout(() => {
                  setFloor("Detail");
                  arriveAtFloor();
              }, 1000);
          } else {
              // Error handling: Open doors back on current floor or show error
              alert("Signal Lost. Destiny Refused.");
              arriveAtFloor();
          }
      });
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-wall-dark flex flex-col z-0 overflow-hidden font-sans">
      
      {/* Top Panel - Floor Indicator */}
      <div className="h-24 bg-wall-light border-b-8 border-wall-dark flex items-center justify-between px-8 shadow-lg z-50 relative shrink-0">
         
         {/* Speaker Toggle (Left) */}
         <button 
           onClick={toggleBgm}
           className={`p-3 rounded-full border-2 transition-all duration-300 ${bgmPlaying ? "bg-brass-accent text-wall-dark border-transparent shadow-[0_0_15px_rgba(255,191,0,0.5)]" : "border-brass-accent/30 text-brass-accent/50 hover:text-brass-accent"}`}
         >
             {bgmPlaying ? <Volume2 /> : <VolumeX />}
         </button>

         {/* Bezel (Center) */}
        <div className="bg-black px-12 py-3 rounded-lg border-4 border-brass-accent shadow-[0_0_30px_rgba(255,191,0,0.3)] min-w-[340px] text-center relative overflow-hidden">
           {/* Glass Reflection */}
           <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
           
           <span className="text-[#ffbf00] font-display text-5xl tracking-widest drop-shadow-[0_0_10px_rgba(255,191,0,0.8)] relative z-10" style={{ textShadow: "0 0 15px rgba(255, 191, 0, 0.6), 0 0 30px rgba(255, 191, 0, 0.4)" }}>
             {LABEL_MAP[currentFloor] || currentFloor}
           </span>
        </div>

        {/* Spacer (Right) */}
        <div className="w-12" />
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
           <ControlBtn label="L" sub="Log" icon={<Heart size={20} />} active={currentFloor === "L"} onClick={() => handleFloorChange("L", "/favorites")} />
           
           <div className="h-2 border-b-2 border-wall-dark/20 w-16 my-2" />
           
           <div className="flex flex-col gap-6">
               <ControlBtn label="R" icon={<Shuffle size={20} />} active={currentFloor === "??"} onClick={handleRandom} />
               <ControlBtn label="S" icon={<Search size={20} />} active={currentFloor === "S"} onClick={() => handleFloorChange("S", "/search")} />
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
