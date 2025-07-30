import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getNotesByUserId, getNoteById, createNote, updateNoteById, deleteNoteById } from '../services/db';
import { broadcastMessage } from '../websocket';

const router = Router();

// GET all notes for the authenticated user
router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const notes = await getNotesByUserId(userId);
    res.json(notes);
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET a single note by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { id: noteId } = req.params;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const note = await getNoteById(noteId, userId);
        if (!note) {
            return res.status(404).json({ error: 'Note not found or you do not have permission to view it' });
        }
        res.json(note);
    } catch (error) {
        console.error(`Failed to fetch note ${noteId}:`, error);
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// POST a new note
router.post('/', async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { title, content, tags } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const newNote = await createNote(userId, title, content || '', tags || []);
        broadcastMessage({ type: 'NOTE_CREATED', payload: newNote });
        res.status(201).json(newNote);
    } catch (error) {
        console.error('Failed to create note:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// PUT (update) a note
router.put('/:id', async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { id: noteId } = req.params;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { title, content, tags } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const updatedNote = await updateNoteById(noteId, userId, title, content || '', tags || []);
        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found or you do not have permission to edit it' });
        }
        broadcastMessage({ type: 'NOTE_UPDATED', payload: updatedNote });
        res.json(updatedNote);
    } catch (error) {
        console.error(`Failed to update note ${noteId}:`, error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// DELETE a note
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { id: noteId } = req.params;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const deletedNote = await deleteNoteById(noteId, userId);
        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found or you do not have permission to delete it' });
        }
        broadcastMessage({ type: 'NOTE_DELETED', payload: { id: noteId } });
        res.status(200).json({ message: 'Note deleted successfully', note: deletedNote });
    } catch (error) {
        console.error(`Failed to delete note ${noteId}:`, error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

export default router;
