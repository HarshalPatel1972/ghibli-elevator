'use client';

import { Anime } from '@/api/animeClient';
import { motion } from 'framer-motion';
import { useElevatorSystem } from '@/hooks/useElevatorSystem';
import { useElevatorStore } from '@/store/useElevatorStore';
import { Heart } from 'lucide-react';

export default function AnimeGrid({ items, title }: { items: Anime[], title: string }) {
   const { callElevator } = useElevatorSystem();
   const { favorites, toggleFavorite } = useElevatorStore();

   return (
     <div className="p-8 pb-32">
        <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-display font-bold mb-8 text-wall-dark border-b-4 border-brass-accent inline-block pr-8"
        >
            {title}
        </motion.h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-8">
           {items.map((anime, index) => {
             const isFav = favorites.some(f => f.mal_id === anime.mal_id);
             return (
             <motion.div
               key={anime.mal_id}
               onClick={() => callElevator(`/anime/${anime.mal_id}`, "Detail")}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 + (index * 0.05) }} // Staggered entry
               className="group relative aspect-[2/3] bg-wall-light rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300 ring-2 ring-transparent hover:ring-brass-accent/50"
             >
                {/* Poster Image */}
                <img 
                  src={anime.images.webp.large_image_url || anime.images.jpg.large_image_url} 
                  alt={anime.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Favorite Button (Stop Propagation) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(anime);
                    }}
                    className="absolute top-2 left-2 z-20 p-2 rounded-full bg-black/40 backdrop-blur hover:bg-black/60 transition-colors"
                >
                    <Heart 
                        size={18} 
                        className={`transition-colors duration-300 ${isFav ? "fill-red-500 text-red-500" : "text-white/70 hover:text-white"}`} 
                    />
                </button>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-wall-dark/95 via-wall-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                   <h3 className="text-[#f4f1ea] font-bold text-lg leading-tight mb-2 line-clamp-3 font-display">{anime.title}</h3>
                   <div className="flex items-center justify-between text-brass-accent text-sm font-mono border-t border-white/10 pt-2 w-full">
                      <span>{anime.year || "Unknown"}</span>
                      {anime.score && <span className="text-white">★ {anime.score}</span>}
                   </div>
                   <p className="text-white/70 text-xs mt-2 line-clamp-3 font-sans opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-500">
                       {anime.synopsis}
                   </p>
                </div>
                
                {/* Rating Badge (Always Visible) */}
                {anime.score && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[#d4af37] font-mono font-bold px-2 py-1 rounded-md border border-[#d4af37]/30 text-xs shadow-lg">
                        {anime.score}
                    </div>
                )}
             </motion.div>
             )})}
        </div>
     </div>
   )
}
