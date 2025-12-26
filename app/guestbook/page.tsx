'use client';

import { useState } from 'react';
import { useGuestbook } from '@/hooks/useGuestbook';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function GuestbookPage() {
    const { entries, addEntry } = useGuestbook();
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !message) return;
        
        setIsSubmitting(true);
        try {
            await addEntry(name, message);
            setMessage('');
            // Optional: Keep name for convenience
        } catch (error) {
            console.error("Failed to post", error);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#fdfbf7]">
            {/* Header */}
            <div className="p-8 pb-4 border-b-4 border-[#e8e5d0]">
                <h1 className="text-4xl font-display font-bold text-wall-dark">Traveler's Wall</h1>
                <p className="font-mono text-sm text-wall-dark/60 mt-2">Leave a note for those who come after.</p>
            </div>

            {/* Wall (Messages) */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                {/* Corkboard texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cork-board.png')] opacity-50 pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {entries.map((entry, idx) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, scale: 0.9, rotate: Math.random() * 4 - 2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-[#fff9c4] p-6 shadow-[2px_4px_8px_rgba(0,0,0,0.1)] rotate-1 hover:rotate-0 transition-transform duration-300 relative"
                        >
                            {/* Pin */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 shadow-sm border border-black/20" />
                            
                            <p className="font-sans text-wall-dark text-lg mb-4 leading-relaxed font-medium">"{entry.message}"</p>
                            <div className="border-t border-black/5 pt-2 flex justify-between items-center">
                                <span className="font-display text-brass-accent font-bold text-sm tracking-wide">
                                    - {entry.name}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                    
                    {entries.length === 0 && (
                        <div className="col-span-full flex justify-center py-20 opacity-50">
                            <p className="font-mono text-xl">The wall is empty.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t-4 border-[#e8e5d0] sticky bottom-0 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                    <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-[#f4f1ea] border-2 border-[#e8e5d0] rounded px-4 py-3 font-display focus:border-brass-accent focus:outline-none w-full md:w-48"
                        maxLength={20}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Write a message (140 chars)..." 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-[#f4f1ea] border-2 border-[#e8e5d0] rounded px-4 py-3 font-sans focus:border-brass-accent focus:outline-none flex-1"
                        maxLength={140}
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-wall-dark text-brass-accent font-bold px-8 py-3 rounded hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Send size={18} />
                        POST
                    </button>
                </form>
            </div>
        </div>
    )
}
