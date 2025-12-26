import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Anime } from '@/api/animeClient';
import { User } from 'firebase/auth'; // Import User type
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, writeBatch } from 'firebase/firestore';

interface ElevatorState {
  currentFloor: string;
  isMoving: boolean;
  isDoorOpen: boolean;
  favorites: Anime[];
  user: User | null; // Track auth state
  
  // Actions
  setFloor: (floor: string) => void;
  setIsMoving: (isMoving: boolean) => void;
  setDoorOpen: (isOpen: boolean) => void;
  toggleFavorite: (anime: Anime) => Promise<void>; // Async now
  setUser: (user: User | null) => void;
  syncLocalToCloud: (user: User) => Promise<void>;
  setFavorites: (favorites: Anime[]) => void;
  
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
      user: null,

      setFloor: (floor) => set({ currentFloor: floor }),
      setIsMoving: (isMoving) => set({ isMoving }),
      setDoorOpen: (isOpen) => set({ isDoorOpen: isOpen }),
      setUser: (user) => set({ user }),
      setFavorites: (favorites) => set({ favorites }),

      syncLocalToCloud: async (user) => {
          if (!db || !user) return;
          const { favorites } = get();
          if (favorites.length === 0) return;

          // Batch write local favorites to cloud
          const batch = writeBatch(db);
          favorites.forEach(anime => {
             const ref = doc(db, `users/${user.uid}/favorites/${anime.mal_id}`);
             batch.set(ref, anime); // Upload
          });
          
          await batch.commit();
          // Clear local favorites after sync logic if we were purely cloud, 
          // but we might want to keep them until we fetch?
          // Actually, if we switch to cloud mode, we should populate from cloud.
          // For now, let's just upload. The listener will handle the source of truth merge.
      },
      
      toggleFavorite: async (anime) => {
          const { favorites, user } = get();
          const exists = favorites.find(f => f.mal_id === anime.mal_id);
          
          // Optimistic UI Update first
          if (exists) {
              set({ favorites: favorites.filter(f => f.mal_id !== anime.mal_id) });
          } else {
              set({ favorites: [...favorites, anime] });
          }

          // Sync to cloud if logged in
          if (user && db) {
              const docRef = doc(db, `users/${user.uid}/favorites/${anime.mal_id}`);
              if (exists) {
                  await deleteDoc(docRef);
              } else {
                  await setDoc(docRef, anime);
              }
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
      // Persist everything except user (non-serializable)
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);
