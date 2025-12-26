'use client';

import { useElevatorStore } from '@/store/useElevatorStore';
import AnimeGrid from '@/components/ui/AnimeGrid';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useElevatorStore();

  if (favorites.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center p-20 text-wall-dark/50 min-h-full">
              <Heart size={64} className="mb-4 text-wall-dark/30" />
              <h2 className="text-3xl font-display text-wall-dark mb-2">Logbook Empty</h2>
              <p className="font-mono text-sm tracking-widest uppercase">Start collecting your journey.</p>
          </div>
      )
  }

  return <AnimeGrid items={favorites} title="Captain's Logbook" />;
}
