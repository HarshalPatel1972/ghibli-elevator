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
  "/favorites": "L",
  "/guestbook": "G",
  "/basement": "-1"
};

const LABEL_MAP: Record<string, string> = {
  "1": "Trending",
  "2": "Top Rated",
  "3": "Movies",
  "S": "Archive",
  "L": "Logbook",
  "G": "Lobby",
  "Detail": "Detail",
  "??": "Destiny",
  "-1": "ERROR"
}

export default function ElevatorFrame({ children }: { children: ReactNode }) {
  const { currentFloor, isMoving, setFloor, callElevator, initiateTravel, arriveAtFloor } = useElevatorSystem();
  const { playClick, playDoor, playDing } = useAudioElement();
  const [bgmPlaying, setBgmPlaying] = useState(false);
  
  // Easter Egg State
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        } else if (pathname === "/guestbook") {
            setFloor("G");
        } else if (pathname === "/basement") {
            setFloor("-1");
        } else {
            const floor = FLOOR_MAP[pathname] || "1";
            setFloor(floor);
        }
    }
  }, [pathname]);

  const handleFloorChange = (targetFloor: string, path: string) => {
    if (targetFloor === currentFloor || isMoving) return;
    playClick();
    playDoor(); 
    callElevator(path, targetFloor);
    setTimeout(() => {
        playDing();
        setTimeout(() => {
             playDoor(); 
        }, 200);
    }, 2000);
  };

  const handleRandom = async () => {
      if (isMoving) return;
      playClick();
      playDoor(); // Close
      initiateTravel("??");

      import('@/api/animeClient').then(async (mod) => {
          await new Promise(r => setTimeout(r, 1000));
          const anime = await mod.animeClient.getRandomAnime();
          if (anime) {
              router.push(`/anime/${anime.mal_id}`);
              setTimeout(() => {
                  setFloor("Detail");
                  playDing();
                  setTimeout(() => playDoor(), 200);
                  arriveAtFloor();
              }, 1000);
          } else {
              alert("Signal Lost. Destiny Refused.");
              playDoor();
              arriveAtFloor();
          }
      });
  };
  
  // Easter Egg Trigger
  const handleDisplayClick = () => {
      setClickCount(prev => prev + 1);
      
      // Reset count if idle for 2 seconds
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = setTimeout(() => {
          setClickCount(0);
      }, 2000);
  };
  
  useEffect(() => {
      if (clickCount >= 5) {
          setClickCount(0);
          // Trigger The Basement
          if (pathname !== "/basement" && !isMoving) {
              // Glitch Sound?
              // playGlitch();
              handleFloorChange("-1", "/basement");
          }
      }
  }, [clickCount, pathname, isMoving]);

  return (
    <div className="fixed inset-0 w-full h-full bg-wall-dark flex flex-col z-0 overflow-hidden font-sans">
      
      {/* Top Panel - Floor Indicator */}
      <div className="h-20 md:h-24 bg-wall-light border-b-4 md:border-b-8 border-wall-dark flex items-center justify-between px-4 md:px-8 shadow-lg z-50 relative shrink-0">
         
         {/* Speaker Toggle (Left) */}
         <button 
           onClick={toggleBgm}
           className={`p-2 md:p-3 rounded-full border-2 transition-all duration-300 ${bgmPlaying ? "bg-brass-accent text-wall-dark border-transparent shadow-[0_0_15px_rgba(255,191,0,0.5)]" : "border-brass-accent/30 text-brass-accent/50 hover:text-brass-accent"}`}
         >
             {bgmPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
         </button>

         {/* Bezel (Center) */}
        <div 
            onClick={handleDisplayClick}
            className="bg-black px-4 md:px-12 py-2 md:py-3 rounded-lg border-2 md:border-4 border-brass-accent shadow-[0_0_30px_rgba(255,191,0,0.3)] min-w-[200px] md:min-w-[340px] text-center relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
        >
           {/* Glass Reflection */}
           <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
           
           <span className="text-[#ffbf00] font-display text-3xl md:text-5xl tracking-widest drop-shadow-[0_0_10px_rgba(255,191,0,0.8)] relative z-10" style={{ textShadow: "0 0 15px rgba(255, 191, 0, 0.6), 0 0 30px rgba(255, 191, 0, 0.4)", color: currentFloor === "-1" ? "red" : "#ffbf00" }}>
             {LABEL_MAP[currentFloor] || currentFloor}
           </span>
        </div>

        {/* Spacer (Right) */}
        <div className="w-8 md:w-12 text-wall-light/0">.</div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row relative overflow-hidden">
        {/* Main Viewport */}
        <div className="flex-1 relative bg-bg-paper overflow-hidden z-10 flex flex-col shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] md:shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
           {/* Vignette Overlay */}
           <div className={`absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] md:shadow-[inset_0_0_150px_rgba(0,0,0,0.6)] ${currentFloor === "-1" ? "bg-red-900/10 mix-blend-overlay" : ""}`} />

           {/* The content area */}
           <div className="flex-1 overflow-y-auto relative no-scrollbar z-10 pb-24 md:pb-0">
               {children}
           </div>
           
           {/* Doors Overlay */}
           <ElevatorDoors />
        </div>

        {/* Control Panel (Responsive) */}
        <aside className="
             bg-wall-light 
             shadow-2xl z-50 relative shrink-0 
             
             /* Mobile: Bottom Bar */
             w-full h-auto border-t-4 border-wall-dark flex flex-row items-center justify-around py-4 order-last
             
             /* Desktop: Right Panel */
             md:w-32 md:h-full md:border-l-8 md:border-t-0 md:flex-col md:py-12 md:gap-8 md:order-none
        ">
           {/* Texture overlay */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-20 pointer-events-none" />
           
           {/* Floor Controls */}
           <div className="flex md:flex-col gap-2 md:gap-8">
               <ControlBtn label="1" sub="Trend" active={currentFloor === "1"} onClick={() => handleFloorChange("1", "/")} />
               <ControlBtn label="2" sub="Top" active={currentFloor === "2"} onClick={() => handleFloorChange("2", "/top-rated")} />
               <ControlBtn label="3" sub="Mov" active={currentFloor === "3"} onClick={() => handleFloorChange("3", "/movies")} />
               <ControlBtn label="G" sub="Lobby" active={currentFloor === "G"} onClick={() => handleFloorChange("G", "/guestbook")} />
           </div>

           {/* Divider */}
           <div className="h-8 w-[1px] bg-wall-dark/20 mx-2 md:h-2 md:w-16 md:bg-wall-dark/20 md:border-b-2 md:mx-0 md:my-2" />
           
           {/* Utility Controls */}
           <div className="flex md:flex-col gap-2 md:gap-6">
               <ControlBtn label="L" sub="Log" icon={<Heart size={18} />} active={currentFloor === "L"} onClick={() => handleFloorChange("L", "/favorites")} />
               <ControlBtn label="R" icon={<Shuffle size={18} />} active={currentFloor === "??"} onClick={handleRandom} />
               <ControlBtn label="S" icon={<Search size={18} />} active={currentFloor === "S"} onClick={() => handleFloorChange("S", "/search")} />
           </div>
        </aside>
      </div>

      {/* Bottom Trim (Desktop Only) */}
      <div className="hidden md:block h-16 bg-wall-dark border-t-8 border-[#3e342a] z-50 shrink-0" />
    </div>
  );
}

function ControlBtn({ label, sub, onClick, active, icon }: any) {
    return (
        <button 
           onClick={onClick}
           className={`
             rounded-full border-[3px] md:border-[6px] flex flex-col items-center justify-center transition-all duration-300 active:scale-95 relative group
             w-10 h-10 md:w-16 md:h-16
             ${active 
               ? 'bg-[#ffeebb] border-[#ffcc00] text-[#554400] shadow-[0_0_20px_rgba(255,200,0,0.6)] scale-105' 
               : 'bg-brass-accent border-[#8a7020] text-wall-dark shadow-md hover:brightness-110 hover:shadow-[0_0_10px_rgba(212,175,55,0.4)]'}
           `}
        >
            {icon ? icon : <span className="font-display font-bold text-lg md:text-2xl leading-none">{label}</span>}
            {sub && <span className="hidden md:block absolute -bottom-6 text-[10px] font-bold text-white/50 tracking-wider uppercase font-sans text-center w-20">{sub}</span>}
            
            {/* Shine effect */}
            <div className="absolute top-1 left-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white/30 blur-[1px]" />
        </button>
    )
}
