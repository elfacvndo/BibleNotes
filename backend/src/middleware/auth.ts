import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface to include the user property
export interface AuthRequest extends Request {
  user?: { id: string; email: string; };
}

// Use the same secret as in the auth routes. In a real app, use an environment variable.
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-and-long-key-that-is-not-guessable';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string; iat: number; exp: number };
    req.user = { id: payload.id, email: payload.email }; // Attach user payload to the request object
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
