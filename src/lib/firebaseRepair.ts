import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { RepairOrder } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const ORDERS_COLLECTION = 'repair_orders';

export const repairService = {
  async getAllOrders(): Promise<RepairOrder[]> {
    try {
      const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RepairOrder));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
      return [];
    }
  },

  subscribeToOrders(callback: (orders: RepairOrder[]) => void) {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RepairOrder));
      callback(orders);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
    });
  },

  async createOrder(orderData: Omit<RepairOrder, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
        ...orderData,
        technicianId: auth.currentUser?.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, ORDERS_COLLECTION);
      return '';
    }
  },

  async updateOrder(orderId: string, updates: Partial<RepairOrder>): Promise<void> {
    const path = `${ORDERS_COLLECTION}/${orderId}`;
    try {
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteOrder(orderId: string): Promise<void> {
    const path = `${ORDERS_COLLECTION}/${orderId}`;
    try {
      await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
