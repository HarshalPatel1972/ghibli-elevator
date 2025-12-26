import { useRouter } from 'next/navigation';
import { useElevatorStore } from '@/store/useElevatorStore';

export function useElevatorSystem() {
    const router = useRouter();
    const store = useElevatorStore();
    
    const callElevator = (targetPath: string, targetFloorName: string) => {
        // Prevent double trigger
        if (store.isMoving) return;
        
        // 1. Close Doors / Start Moving
        store.initiateTravel(targetFloorName);
        
        // 2. Wait for doors to close (e.g. 1s)
        setTimeout(() => {
            // 3. Navigate
            router.push(targetPath);
            
            // 4. Update Floor Store
            store.setFloor(targetFloorName);
            
            // 5. Arrive (Open doors)
            // Add a bit more delay for the "travel" feel
            setTimeout(() => {
                 store.arriveAtFloor();
            }, 1000); // Wait 1s inside before opening
        }, 1000); // 1s to close
    };
    
    return { ...store, callElevator };
}
