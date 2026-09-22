import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// 1. Advanced Multi-tier Rate Limiting
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

export const aiGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 AI generations per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI generation limit reached for this hour.' },
  keyGenerator: (req) => {
    // If authenticated, limit by user ID, otherwise by IP
    return (req as any).user?.uid || req.ip;
  },
});

// 2. Hardened Security Headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://*.googleusercontent.com", "https://*.firebasestorage.app"],
      "connect-src": ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com", "wss://*.run.app"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for some video/image loads in iframes
});

// 3. CORS Configuration
export const corsOptions = cors({
  origin: process.env.NODE_ENV === 'production' ? [process.env.APP_URL || ''] : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-fb-id-token'],
  credentials: true,
});

// 4. Request Validation Helper
export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.issues.map(e => ({ path: e.path, message: e.message })) 
        });
      }
      return res.status(500).json({ error: 'Internal validation error' });
    }
  };
};

// 5. Secure Webhook Verification (Generic Example)
export const verifyWebhookSignature = (secret: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['x-signature'];
    if (!signature) {
      return res.status(401).json({ error: 'Webhook signature missing' });
    }
    // Logic for HMAC verification would go here
    // const computedSignature = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
    // if (computedSignature !== signature) return res.status(401).json({ error: 'Invalid signature' });
    next();
  };
};
