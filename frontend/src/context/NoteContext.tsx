import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Note } from '../components/notes/NoteCard';
// import { api } from '../services/api'; // We will create this next

// Mock data to start with
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Studio personale Torre di Guardia',
    content: 'Paragrafo 5, la pazienza è fondamentale per mantenere la gioia. La scrittura chiave è Giacomo 1:4. Meditare su come applicarla nel ministero.',
    category: 'Study',
    tags: ['pazienza', 'studio'],
    color: 'blue',
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
  },
  {
    id: '2',
    title: 'Commento per l\'adunanza infrasettimanale',
    content: 'Per la parte "Vita Cristiana", preparare un commento sulla scrittura di 2 Timoteo 3:16, 17, sottolineando l\'ispirazione divina.',
    category: 'Meetings',
    tags: ['adunanza', 'commento'],
    color: 'gold',
    createdAt: new Date('2023-10-25T15:30:00Z').toISOString(),
  },
];


interface NoteContextType {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  addNote: (note: Partial<Note>) => Promise<void>;
  // updateNote: (note: Note) => Promise<void>;
  // deleteNote: (id: string) => Promise<void>;
}

export const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider = ({ children }: NoteProviderProps) => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);

  const fetchNotes = async () => {
    // const fetchedNotes = await api.getNotes();
    // setNotes(fetchedNotes);
    console.log("Pretending to fetch notes from API");
  };

  const addNote = async (noteData: Partial<Note>) => {
    // const newNote = await api.createNote(noteData);
    // setNotes(prevNotes => [newNote, ...prevNotes]);
    const newNote = {
        ...noteData,
        id: String(notes.length + 1),
        createdAt: new Date().toISOString(),
    } as Note;
    setNotes(prevNotes => [newNote, ...prevNotes]);
    console.log("Pretending to save note to API", newNote);
  };

  return (
    <NoteContext.Provider value={{ notes, fetchNotes, addNote }}>
      {children}
    </NoteContext.Provider>
  );
};
