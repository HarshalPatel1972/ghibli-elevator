import { create } from 'zustand';

interface ElevatorState {
  currentFloor: string; // Using string for floors like "Trending", "Movies" or numbers "1", "2"
  isMoving: boolean;
  isDoorOpen: boolean;
  
  // Actions
  setFloor: (floor: string) => void;
  setIsMoving: (isMoving: boolean) => void;
  setDoorOpen: (isOpen: boolean) => void;
  
  // Compound action for clarity
  initiateTravel: (targetFloor: string) => void;
  arriveAtFloor: () => void;
}

export const useElevatorStore = create<ElevatorState>((set) => ({
  currentFloor: "Trending", // Default floor
  isMoving: false,
  isDoorOpen: true,

  setFloor: (floor) => set({ currentFloor: floor }),
  setIsMoving: (isMoving) => set({ isMoving }),
  setDoorOpen: (isOpen) => set({ isDoorOpen: isOpen }),

  initiateTravel: (targetFloor) => set({ 
    isMoving: true, 
    isDoorOpen: false,
    // We don't update currentFloor immediately to allow "travel" time
  }),
  
  arriveAtFloor: () => set({ 
    isMoving: false, 
    isDoorOpen: true 
  }),
}));
