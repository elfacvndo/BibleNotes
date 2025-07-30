// This is a placeholder for actual database logic.
// In a real application, this would interact with a PostgreSQL database.

// === USER TYPE AND MOCK DATA ===
export interface User {
    id: string;
    email: string;
    name: string;
    // In a real DB, you would store a hashed password, not the password itself
    passwordHash: string;
}

const mockUsers: User[] = [
    { id: '1', email: 'test@example.com', name: 'Test User', passwordHash: 'hashed_password' }
];


// === NOTE TYPE AND MOCK DATA ===
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'Study' | 'Meetings' | 'Preaching';
  tags: string[];
  color: string;
  createdAt: string;
}

const mockNotes: Note[] = [
  {
    id: '1',
    userId: '1',
    title: 'Studio personale Torre di Guardia',
    content: 'Paragrafo 5, la pazienza è fondamentale.',
    category: 'Study',
    tags: ['pazienza', 'studio'],
    color: 'blue',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '1',
    title: 'Commento per l\'adunanza infrasettimanale',
    content: 'Citare la scrittura di 2 Timoteo 3:16, 17.',
    category: 'Meetings',
    tags: ['adunanza', 'commento'],
    color: 'gold',
    createdAt: new Date().toISOString(),
  },
];

// === MOCK DATABASE LOGIC ===
// In a real app, you would use a query builder or ORM.
export const db = {
  // A generic query function for simulation
  query: async (query: string, params?: any[]): Promise<{ rows: any[] }> => {
    console.log('Mock DB Query:', query, params);

    // Simulate basic CRUD operations on mockNotes
    if (query.startsWith('SELECT * FROM notes')) {
      return { rows: mockNotes };
    }
    if (query.startsWith('SELECT * FROM notes WHERE id')) {
        const id = params?.[0];
        const note = mockNotes.find(n => n.id === id);
        return { rows: note ? [note] : [] };
    }
    if (query.startsWith('INSERT INTO notes')) {
        const newNote = params?.[0]; // In reality this would parse the values
        const note = { ...newNote, id: String(mockNotes.length + 1), createdAt: new Date().toISOString() };
        mockNotes.push(note);
        return { rows: [note] };
    }

    return { rows: [] };
  },

  // Specific helper for finding a user
  findUserByEmail: async (email: string): Promise<User | undefined> => {
    console.log('Mock DB findUserByEmail:', email);
    return mockUsers.find(user => user.email === email);
  }
};
