import { Pool } from 'pg';

// In a real application, you would use environment variables for this configuration
export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'biblenotes',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const db = {
  query: (text: string, params: any[]) => pool.query(text, params),
};

// You can also create more specific functions here, for example:
export const findUserByEmail = async (email: string) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

export const createUser = async (username: string, email: string, passwordHash: string) => {
  const { rows } = await db.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [username, email, passwordHash]
  );
  return rows[0];
};

// === NOTES DATABASE HELPERS ===

export const getNotesByUserId = async (userId: string) => {
  const { rows } = await db.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
  return rows;
};

export const getNoteById = async (noteId: string, userId: string) => {
    const { rows } = await db.query('SELECT * FROM notes WHERE id = $1 AND user_id = $2', [noteId, userId]);
    return rows[0];
};

export const createNote = async (userId: string, title: string, content: string, tags: string[], attachments: string[] = []) => {
    const { rows } = await db.query(
        'INSERT INTO notes (user_id, title, content, tags, attachments) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, title, content, tags, attachments]
    );
    return rows[0];
};

export const updateNoteById = async (noteId: string, userId: string, title: string, content: string, tags: string[], attachments: string[] = []) => {
    const { rows } = await db.query(
        'UPDATE notes SET title = $1, content = $2, tags = $3, attachments = $4, version = version + 1, updated_at = NOW() WHERE id = $5 AND user_id = $6 RETURNING *',
        [title, content, tags, attachments, noteId, userId]
    );
    return rows[0];
};

export const deleteNoteById = async (noteId: string, userId: string) => {
    const { rows } = await db.query('DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *', [noteId, userId]);
    return rows[0];
};

// === BOOKMARKS DATABASE HELPERS ===

export const getBookmarksByUserId = async (userId: string) => {
    const { rows } = await db.query('SELECT * FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return rows;
};

export const createBookmark = async (userId: string, book: string, chapter: number, verse: number) => {
    const { rows } = await db.query(
        'INSERT INTO bookmarks (user_id, book, chapter, verse) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, book, chapter, verse) DO NOTHING RETURNING *',
        [userId, book, chapter, verse]
    );
    return rows[0];
};

export const deleteBookmarkById = async (bookmarkId: string, userId: string) => {
    const { rows } = await db.query('DELETE FROM bookmarks WHERE id = $1 AND user_id = $2 RETURNING *', [bookmarkId, userId]);
    return rows[0];
};

// === SYNC DATABASE HELPERS ===

interface SyncPayload {
    updates?: { id: string; title: string; content: string; tags: string[]; attachments: string[]; version: number }[];
    creations?: { local_id: string; title: string; content: string; tags: string[]; attachments: string[] }[];
    deletions?: string[];
}

export const processSync = async (userId: string, payload: SyncPayload) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const results = {
            created: [] as any[],
            updated: [] as any[],
            deleted: [] as string[],
            conflicts: [] as any[],
        };

        // Process Deletions
        if (payload.deletions) {
            for (const noteId of payload.deletions) {
                await client.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [noteId, userId]);
                results.deleted.push(noteId);
            }
        }

        // Process Creations
        if (payload.creations) {
            for (const note of payload.creations) {
                const { rows } = await client.query(
                    'INSERT INTO notes (user_id, title, content, tags, attachments) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                    [userId, note.title, note.content, note.tags, note.attachments]
                );
                results.created.push({ local_id: note.local_id, server_note: rows[0] });
            }
        }

        // Process Updates
        if (payload.updates) {
            for (const note of payload.updates) {
                const { rows: currentNotes } = await client.query('SELECT version FROM notes WHERE id = $1 AND user_id = $2', [note.id, userId]);
                if (currentNotes.length === 0) continue; // Note might have been deleted

                const currentVersion = currentNotes[0].version;
                if (note.version === currentVersion) {
                    const { rows: updatedRows } = await client.query(
                        'UPDATE notes SET title = $1, content = $2, tags = $3, attachments = $4, version = version + 1, updated_at = NOW() WHERE id = $5 RETURNING *',
                        [note.title, note.content, note.tags, note.attachments, note.id]
                    );
                    results.updated.push(updatedRows[0]);
                } else {
                    results.conflicts.push({ id: note.id, server_version: currentVersion });
                }
            }
        }

        await client.query('COMMIT');
        return results;

    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};
