'use client';

import { useEffect, useState } from 'react';
import { animeClient, Anime } from '@/api/animeClient';
import AnimeGrid from '@/components/ui/AnimeGrid';
import { motion } from 'framer-motion';

// Hardcoded Cult Classics IDs
const BASEMENT_IDS = [
    '1353', // The Big O
    '339',  // Lain
    '26',   // Texhnolyze
    '323',  // Paranoia Agent
    '43',   // Ghost in the Shell
    '47',   // Akira
    '13125', // Shinsekai Yori
    '934',  // Higurashi
    '226',  // Elfen Lied
    '777',  // Hellsing Ultimate
];

export default function BasementPage() {
    const [items, setItems] = useState<Anime[]>([]);

    useEffect(() => {
        const fetchBasement = async () => {
            const promises = BASEMENT_IDS.map(id => animeClient.getAnimeById(id));
            const results = await Promise.all(promises);
            setItems(results.filter((a): a is Anime => a !== null));
        };
        fetchBasement();
    }, []);

    return (
        <div className="min-h-full bg-black text-red-600 font-mono relative overflow-hidden">
             {/* Glitch Overlay */}
             <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ff0000_3px)] animate-pulse" />
             
             <div className="relative z-10">
                <div className="p-8 border-b border-red-900 mb-8">
                    <motion.h1 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-5xl font-display font-bold text-red-600 tracking-tighter shimmer-text"
                        style={{ textShadow: "4px 4px 0px #000" }}
                    >
                        THE BASEMENT
                    </motion.h1> 
                    <p className="text-red-800 mt-2 font-mono text-xs uppercase tracking-[0.5em]">Do not linger here.</p>
                </div>

                <div className="px-4 pb-32">
                     {/* We reuse anime grid but override styles via CSS or wrapper if needed. 
                         The AnimeGrid uses specific colors (bg-wall-light), so we might see disjointed styles.
                          ideally we pass a className prop to AnimeGrid or make it adaptive. 
                         For now, the contrast of the "clean" cards against the "dark" background is a nice eerie effect.
                     */}
                     <AnimeGrid items={items} title="" />
                </div>
             </div>
             
             <style jsx global>{`
                /* Override global variables locally for this page effect if possible, 
                   but since it's a component inside a layout, globals apply to body.
                   We simulate darkness by covering the background div. */
             `}</style>
        </div>
    )
}
