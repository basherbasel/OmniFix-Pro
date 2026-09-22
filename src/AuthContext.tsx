import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { handleFirestoreError, OperationType } from './lib/firebaseRepair';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'technician';
  email: string;
  isActive: boolean;
  isTrial?: boolean;
  trialExpiresAt?: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (username: string, email: string, pass: string, trial: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Subscribe to user profile changes
        const userRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser({ id: docSnap.id, ...docSnap.data() } as User);
          } else {
            // Handle case where user exists in Auth but not in Firestore (e.g. first Google Login)
            // We might want to create a profile here if needed, but for now we'll handle it in the login function
            setUser(null);
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Check if profile exists
    const userRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Create a default profile for first-time Google users
      const newUser: User = {
        id: firebaseUser.uid,
        username: firebaseUser.displayName || 'Technician',
        email: firebaseUser.email || '',
        role: firebaseUser.email === 'admin@bashar.com' ? 'admin' : 'technician',
        isActive: true, 
        isTrial: firebaseUser.email !== 'admin@bashar.com',
        trialExpiresAt: firebaseUser.email !== 'admin@bashar.com' ? Date.now() + (7 * 24 * 60 * 60 * 1000) : undefined,
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, newUser);
    }
  };

  const register = async (username: string, email: string, pass: string, trial: boolean) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;

    const newUser: User = {
      id: firebaseUser.uid,
      username,
      email,
      role: email === 'admin@bashar.com' ? 'admin' : 'technician',
      isActive: trial || email === 'admin@bashar.com', 
      isTrial: email === 'admin@bashar.com' ? false : trial,
      trialExpiresAt: (trial && email !== 'admin@bashar.com') ? Date.now() + (7 * 24 * 60 * 60 * 1000) : undefined,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
