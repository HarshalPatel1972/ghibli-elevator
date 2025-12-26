import { useState, useEffect } from "react";
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useElevatorStore } from "@/store/useElevatorStore";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const syncLocalToCloud = useElevatorStore(state => state.syncLocalToCloud);
  const setStoreUser = useElevatorStore(state => state.setUser);

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setStoreUser(currentUser);
      
      if (currentUser) {
          // Handover Protocol: If user logs in, we sync their local favorites BEFORE anything else
          await syncLocalToCloud(currentUser);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setStoreUser, syncLocalToCloud]);

  const login = async () => {
    if (!auth) {
        console.error("Authentication not initialized (missing API keys)");
        return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return { user, loading, login, logout };
}
