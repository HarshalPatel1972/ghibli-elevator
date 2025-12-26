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
        if (!db) return;

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
            setEntries(newEntries);
        });

        return () => unsubscribe();
    }, []);

    const addEntry = async (name: string, message: string) => {
        if (!db) return;
        if (!message.trim()) return;

        await addDoc(collection(db, 'guestbook'), {
            name: name.trim() || 'Anonymous Traveler',
            message: message.trim(),
            createdAt: serverTimestamp()
        });
    };

    return { entries, loading, addEntry };
}
