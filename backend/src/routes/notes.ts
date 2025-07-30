import { Router, Request, Response } from 'express';
import { db, Note } from '../services/db';

const router = Router();

// GET all notes
router.get('/', async (req: Request, res: Response) => {
  try {
    // In a real app, you'd get userId from auth token
    const { rows } = await db.query('SELECT * FROM notes WHERE userId = $1', ['1']);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET a single note by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM notes WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// POST a new note
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, content, category, tags, color } = req.body;
    const newNote: Partial<Note> = { title, content, category, tags, color, userId: '1' };

    // Basic validation
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const { rows } = await db.query('INSERT INTO notes (title, content, category, tags, color, userId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, content, category, tags, color, '1']
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT (update) a note
router.put('/:id', async (req: Request, res: Response) => {
    // Placeholder for update logic
    res.status(501).json({ message: 'Update not implemented yet' });
});

// DELETE a note
router.delete('/:id', async (req: Request, res: Response) => {
    // Placeholder for delete logic
    res.status(501).json({ message: 'Delete not implemented yet' });
});


export default router;
