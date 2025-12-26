import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';

export interface GuestbookEntry {
    id: string;
    name: string;
    message: string;
    createdAt: any;
}

export function useGuestbook() {
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'guestbook'), 
            orderBy('createdAt', 'desc'), 
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newEntries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as GuestbookEntry[];
            return setEntries(newEntries);
        });

        setLoading(false);
        return () => unsubscribe();
    }, []);

    const addEntry = async (name: string, message: string) => {
        if (!name.trim() || !message.trim()) return;
        
        await addDoc(collection(db, 'guestbook'), {
            name: name.slice(0, 20),
            message: message.slice(0, 140),
            createdAt: serverTimestamp()
        });
    };

    return { entries, loading, addEntry };
}
