import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Anime } from '@/api/animeClient';

interface ElevatorState {
  currentFloor: string;
  isMoving: boolean;
  isDoorOpen: boolean;
  favorites: Anime[];
  
  // Actions
  setFloor: (floor: string) => void;
  setIsMoving: (isMoving: boolean) => void;
  setDoorOpen: (isOpen: boolean) => void;
  toggleFavorite: (anime: Anime) => void;
  
  // Compound action
  initiateTravel: (targetFloor: string) => void;
  arriveAtFloor: () => void;
}

export const useElevatorStore = create<ElevatorState>()(
  persist(
    (set, get) => ({
      currentFloor: "Trending", 
      isMoving: false,
      isDoorOpen: true,
      favorites: [],

      setFloor: (floor) => set({ currentFloor: floor }),
      setIsMoving: (isMoving) => set({ isMoving }),
      setDoorOpen: (isOpen) => set({ isDoorOpen: isOpen }),
      
      toggleFavorite: (anime) => {
          const { favorites } = get();
          const exists = favorites.find(f => f.mal_id === anime.mal_id);
          if (exists) {
              set({ favorites: favorites.filter(f => f.mal_id !== anime.mal_id) });
          } else {
              set({ favorites: [...favorites, anime] });
          }
      },

      initiateTravel: (targetFloor) => set({ 
        isMoving: true, 
        isDoorOpen: false,
      }),
      
      arriveAtFloor: () => set({ 
        isMoving: false, 
        isDoorOpen: true 
      }),
    }),
    {
      name: 'ghibli-elevator-storage',
      storage: createJSONStorage(() => localStorage),
      // We only want to persist favorites
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);
