import { Pool } from 'pg';

// In a real application, you would use environment variables for this configuration
const pool = new Pool({
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

export const createNote = async (userId: string, title: string, content: string, tags: string[]) => {
    const { rows } = await db.query(
        'INSERT INTO notes (user_id, title, content, tags) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, title, content, tags]
    );
    return rows[0];
};

export const updateNoteById = async (noteId: string, userId: string, title: string, content: string, tags: string[]) => {
    const { rows } = await db.query(
        'UPDATE notes SET title = $1, content = $2, tags = $3, updated_at = NOW() WHERE id = $4 AND user_id = $5 RETURNING *',
        [title, content, tags, noteId, userId]
    );
    return rows[0];
};

export const deleteNoteById = async (noteId: string, userId: string) => {
    const { rows } = await db.query('DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *', [noteId, userId]);
    return rows[0];
};
