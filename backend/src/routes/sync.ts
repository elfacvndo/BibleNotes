import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { processSync } from '../services/db';
import { broadcastMessage } from '../websocket';

const router = Router();

interface SyncPayload {
    updates?: { id: string; title: string; content: string; tags: string[]; attachments: string[]; version: number }[];
    creations?: { local_id: string; title: string; content: string; tags: string[]; attachments: string[] }[];
    deletions?: string[];
}

router.post('/', async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const payload: SyncPayload = req.body;

    if (!payload.updates && !payload.creations && !payload.deletions) {
        return res.status(400).json({ error: 'Invalid sync payload' });
    }

    try {
        const results = await processSync(userId, payload);

        // Broadcast changes to other clients
        if (results.created.length > 0 || results.updated.length > 0 || results.deleted.length > 0) {
            broadcastMessage({ type: 'NOTES_CHANGED', payload: { userId } });
        }

        res.json(results);
    } catch (error) {
        console.error("Sync Error:", error);
        res.status(500).json({ error: 'Sync failed' });
    }
});

export default router;
