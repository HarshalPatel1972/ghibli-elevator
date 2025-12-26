'use client';

import { useState } from 'react';
import { animeClient, Anime } from '@/api/animeClient';
import AnimeGrid from '@/components/ui/AnimeGrid';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    
    const data = await animeClient.search(query);
    setResults(data);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-full">
        {/* Search Header / Intercom */}
        <div className="bg-[#e6e2d3] p-8 border-b-4 border-wall-dark shadow-md sticky top-0 z-30">
            <div className="max-w-4xl mx-auto w-full">
                <form onSubmit={handleSearch} className="relative flex items-center gap-4">
                     {/* "Intercom" Label */}
                     <span className="hidden md:block font-mono text-xs uppercase tracking-widest text-wall-dark/60 absolute -top-4">
                        Search Intercom // TYPE-01
                     </span>

                     <SearchIcon className="text-wall-dark w-6 h-6 absolute left-4" />
                     
                     <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="ENTER DESIGNATION..."
                        className="w-full bg-[#f4f1ea] border-b-2 border-wall-dark text-wall-dark font-mono text-2xl py-3 pl-14 pr-4 focus:outline-none focus:border-brass-accent transition-colors placeholder:text-wall-dark/30 uppercase"
                        autoFocus
                     />
                     
                     <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-wall-dark text-brass-accent font-display px-6 py-2 rounded shadow hover:bg-black transition-all disabled:opacity-50"
                     >
                        {isLoading ? <Loader2 className="animate-spin" /> : "TRANSMIT"}
                     </button>
                </form>
            </div>
        </div>

        {/* Results Area */}
        <div className="flex-1">
             {hasSearched && !isLoading && results.length === 0 && (
                 <div className="flex flex-col items-center justify-center p-20 text-wall-dark/50">
                     <p className="font-mono text-xl">NO RECORDS FOUND.</p>
                 </div>
             )}

             {results.length > 0 && (
                 <AnimeGrid items={results} title={`Archives: "${query}"`} />
             )}

             {!hasSearched && (
                 <div className="flex flex-col items-center justify-center p-20 opacity-30">
                    <SearchIcon size={64} className="mb-4 text-wall-dark" />
                    <p className="font-mono text-sm tracking-widest text-wall-dark uppercase">Waiting for Input...</p>
                 </div>
             )}
        </div>
    </div>
  );
}
