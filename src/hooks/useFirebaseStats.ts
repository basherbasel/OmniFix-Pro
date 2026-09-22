import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AppStats {
  repairOrders: number;
  activeRepairs: number;
  completedRepairs: number;
  knowledgeBaseArticles: number;
  totalUsers: number;
}

export function useFirebaseStats() {
  const [stats, setStats] = useState<AppStats>({
    repairOrders: 0,
    activeRepairs: 0,
    completedRepairs: 0,
    knowledgeBaseArticles: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to repair orders
    const qOrders = query(collection(db, 'repair_orders'));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const orders = snapshot.docs.map(doc => doc.data());
      setStats(prev => ({
        ...prev,
        repairOrders: snapshot.size,
        activeRepairs: orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length,
        completedRepairs: orders.filter(o => o.status === 'completed').length
      }));
      setLoading(false);
    });

    // Listen to knowledge base
    const qKB = query(collection(db, 'knowledge_base'));
    const unsubscribeKB = onSnapshot(qKB, (snapshot) => {
      setStats(prev => ({
        ...prev,
        knowledgeBaseArticles: snapshot.size
      }));
    });

    return () => {
      unsubscribeOrders();
      unsubscribeKB();
    };
  }, []);

  return { stats, loading };
}
