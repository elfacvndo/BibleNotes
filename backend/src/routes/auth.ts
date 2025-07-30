import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../services/db';

const router = Router();

// A secret for signing the token. In a real app, use an environment variable.
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-key';

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await db.findUserByEmail(email);

    // In a real app, you would use bcrypt.compare to check the password
    if (!user || password !== 'password') { // Placeholder password check
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // User is authenticated, create a token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
    // Placeholder for signup logic. A real implementation would:
    // 1. Validate input
    // 2. Check if user already exists
    // 3. Hash the password with bcrypt
    // 4. Save the new user to the database
    // 5. Return a new token
    res.status(501).json({ message: 'Signup not implemented yet' });
});

export default router;
