import { Request, Response, NextFunction } from 'express';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

// Initialize Firebase Admin SDK
const setupAdmin = () => {
  if (getApps().length === 0) {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      initializeApp({
        projectId: config.projectId,
      });
    } else {
      console.warn('firebase-applet-config.json not found. Admin SDK not fully initialized.');
      // Fallback for environment variables if needed
      if (process.env.FIREBASE_PROJECT_ID) {
        initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
      }
    }
  }
};

setupAdmin();

export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const idToken = req.headers['x-fb-id-token'] as string; // Optional custom header

  const token = (authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : idToken);

  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided.' });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    return res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    // In Firebase Admin, custom claims might be used, or we check Firestore
    // For now, we'll assume the role is passed or verified elsewhere if needed
    // But better to check Firestore or Custom Claims
    if (user.admin === true || user.email === 'admin@bashar.com') { // Example logic
       return next();
    }
    return res.status(403).json({ error: 'Admin privileges required.' });
  }
  next();
};
