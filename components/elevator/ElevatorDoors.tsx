'use client';

import { motion } from 'framer-motion';
import { useElevatorStore } from '@/store/useElevatorStore';

export default function ElevatorDoors() {
  const { isDoorOpen } = useElevatorStore();

  // Doors: Closed = width 50% each. Open = width 0% each.
  // Delay: When opening (isDoorOpen: false -> true), we want a delay? 
  // User: "Add a 0.5s delay when closed to simulate travel time before opening again."
  // So when we go to "open" state, we delay.

  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex">
      {/* Left Door */}
      <motion.div
        initial={{ width: "50%" }} // Start closed? Or Open? Typically start Open or Closed depending on initial state.
        animate={{ width: isDoorOpen ? "0%" : "50%" }}
        transition={{ 
          duration: 1.0, 
          ease: [0.4, 0, 0.2, 1], // Custom bezier for heavy feel
          delay: isDoorOpen ? 0.5 : 0 // Delay opening
        }}
        className="h-full bg-door-color border-r-2 border-black/30 shadow-[10px_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        {/* Texture/Detail */}
        <div className="absolute right-0 h-full w-1 bg-black/10" />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-48 bg-wall-dark/60 rounded-full shadow-inner border border-white/5" />
      </motion.div>

      {/* Right Door */}
      <motion.div
        initial={{ width: "50%" }}
        animate={{ width: isDoorOpen ? "0%" : "50%" }}
        transition={{ 
          duration: 1.0, 
          ease: [0.4, 0, 0.2, 1],
          delay: isDoorOpen ? 0.5 : 0 
        }}
        className="h-full bg-door-color border-l-2 border-black/30 shadow-[-10px_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
         <div className="absolute left-0 h-full w-1 bg-black/10" />
         <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-48 bg-wall-dark/60 rounded-full shadow-inner border border-white/5" />
      </motion.div>
    </div>
  );
}
