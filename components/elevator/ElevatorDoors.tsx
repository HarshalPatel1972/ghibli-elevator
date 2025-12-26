'use client';

import { motion } from 'framer-motion';
import { useElevatorStore } from '@/store/useElevatorStore';

export default function ElevatorDoors() {
  const { isDoorOpen } = useElevatorStore();

  const springTransition = {
    type: "spring",
    stiffness: 60,
    damping: 15,
    restDelta: 0.001
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex overflow-hidden">
      {/* 
         DOOR LEFT 
         Closed: x = 0%
         Open: x = -100% (slide to left)
      */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: isDoorOpen ? "-100%" : "0%" }}
        transition={springTransition}
        className="relative w-1/2 h-full border-r border-black"
        style={{
            background: 'var(--door-gradient)'
        }}
      >
        {/* Metallic Noise Texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

        {/* Shadow seam on the right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/50 to-transparent" />
        
        {/* Handle / Detail */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-2 h-48 bg-black/20 rounded-full shadow-inner border-r border-white/10" />
      </motion.div>

      {/* 
         DOOR RIGHT
         Closed: x = 0% 
         Open: x = 100% (slide to right)
      */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: isDoorOpen ? "100%" : "0%" }}
        transition={springTransition}
        className="relative w-1/2 h-full border-l border-black"
        style={{
            background: 'var(--door-gradient)'
        }}
      >
         {/* Metallic Noise Texture */}
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
         
         {/* Shadow seam on the left edge */}
         <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/50 to-transparent" />

         {/* Handle / Detail */}
         <div className="absolute left-8 top-1/2 -translate-y-1/2 w-2 h-48 bg-black/20 rounded-full shadow-inner border-l border-white/10" />
      </motion.div>
    </div>
  );
}
