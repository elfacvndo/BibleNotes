import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getBookmarksByUserId, createBookmark, deleteBookmarkById } from '../services/db';

const router = Router();

// GET all bookmarks for the authenticated user
router.get('/', async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const bookmarks = await getBookmarksByUserId(userId);
        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});

// POST a new bookmark
router.post('/', async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { book, chapter, verse } = req.body;
    if (!book || !chapter || !verse) {
        return res.status(400).json({ error: 'Book, chapter, and verse are required' });
    }

    try {
        const newBookmark = await createBookmark(userId, book, chapter, verse);
        res.status(201).json(newBookmark);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create bookmark' });
    }
});

// DELETE a bookmark
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { id: bookmarkId } = req.params;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const deletedBookmark = await deleteBookmarkById(bookmarkId, userId);
        if (!deletedBookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }
        res.status(200).json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete bookmark' });
    }
});

export default router;
