'use client';

import { useState } from 'react';
import { Anime } from '@/api/animeClient';
import { Heart, Play } from 'lucide-react';
import { useElevatorStore } from '@/store/useElevatorStore';
import { useElevatorSystem } from '@/hooks/useElevatorSystem';
import TrailerModal from '@/components/modals/TrailerModal';

export default function AnimeDetailView({ anime }: { anime: Anime }) {
    const { favorites, toggleFavorite } = useElevatorStore();
    const { callElevator } = useElevatorSystem(); // Using system to go back
    const isFav = favorites.some(f => f.mal_id === anime.mal_id);
    const [isTrailerOpen, setTrailerOpen] = useState(false);

    return (
     <>
      <div className="p-8 max-w-6xl mx-auto pb-32">
        <div className="bg-wall-light/50 p-8 rounded-lg shadow-2xl border border-brass-accent/20 flex flex-col md:flex-row gap-8 backdrop-blur-sm relative">
            
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 bg-[#f4f1ea] opacity-10 pointer-events-none rounded-lg mix-blend-overlay" />

            {/* Poster */}
            <div className="shrink-0 w-full md:w-[350px]">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-wall-dark">
                    <img 
                        src={anime.images.webp.large_image_url} 
                        alt={anime.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-brass-accent text-wall-dark font-mono font-bold px-3 py-1 rounded shadow-lg text-lg">
                        {anime.score || "N/A"}
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-6 text-wall-dark z-10">
                <div>
                   <h1 className="text-4xl md:text-5xl font-display font-bold text-wall-dark mb-2">{anime.title}</h1>
                   <div className="flex flex-wrap gap-3 font-mono text-sm text-[#5c4a3d] mb-4">
                       <span className="bg-wall-dark/10 px-3 py-1 rounded-full">{anime.year}</span>
                       {anime.genres.map(g => (
                           <span key={g.name} className="bg-brass-accent/20 px-3 py-1 rounded-full text-wall-dark border border-brass-accent/30">{g.name}</span>
                       ))}
                   </div>
                   
                   <div className="flex items-center gap-4">
                        {/* Favorite Toggle */}
                        <button 
                            onClick={() => toggleFavorite(anime)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full border-2 transition-all font-bold ${isFav ? "bg-red-500 border-red-500 text-white" : "border-wall-dark text-wall-dark hover:bg-wall-dark hover:text-brass-accent"}`}
                        >
                            <Heart className={isFav ? "fill-current" : ""} size={20} />
                            {isFav ? "Saved to Logbook" : "Add to Logbook"}
                        </button>

                        {/* Trailer Button */}
                        {anime.trailer?.youtube_id && (
                           <button 
                                onClick={() => setTrailerOpen(true)}
                                className="flex items-center gap-2 px-6 py-2 rounded-full bg-brass-accent text-wall-dark font-bold border-2 border-brass-accent hover:bg-[#ffeebb] transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,200,0,0.4)]"
                           >
                                <Play size={20} fill="currentColor" />
                                Watch Trailer
                           </button>
                        )}
                   </div>
                </div>

                <div className="prose prose-lg text-[#3e342a] font-sans leading-relaxed border-t border-wall-dark/10 pt-6">
                    <p>{anime.synopsis}</p>
                </div>
                
                <div className="mt-auto pt-8">
                     <button 
                       onClick={() => callElevator("/", "1")} 
                       className="inline-flex items-center gap-2 bg-wall-dark text-brass-accent px-8 py-3 rounded-full font-bold hover:bg-[#3e342a] transition-all duration-300 shadow-lg group hover:pr-10"
                     >
                        ← Return to Lobby
                     </button>
                </div>
            </div>
        </div>
      </div>

      {/* Modal */}
      <TrailerModal 
         isOpen={isTrailerOpen} 
         onClose={() => setTrailerOpen(false)} 
         trailerId={anime.trailer?.youtube_id || ""} 
      />
     </>
    );
}
