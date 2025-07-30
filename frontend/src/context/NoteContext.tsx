import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api';
import { useAuth } from './AuthContext';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface NoteContextType {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (noteData: { title: string; content?: string; tags?: string[] }) => Promise<void>;
  editNote: (noteId: string, noteData: { title: string; content?: string; tags?: string[] }) => Promise<void>;
  removeNote: (noteId: string) => Promise<void>;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchNotes = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (noteData: { title: string; content?: string; tags?: string[] }) => {
    setIsLoading(true);
    try {
      const newNote = await createNote(noteData);
      setNotes((prevNotes) => [newNote, ...prevNotes]);
    } catch (err: any) {
      setError(err.message || 'Failed to create note');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editNote = async (noteId: string, noteData: { title: string; content?: string; tags?: string[] }) => {
    setIsLoading(true);
    try {
      const updatedNote = await updateNote(noteId, noteData);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === noteId ? updatedNote : note))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update note');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeNote = async (noteId: string) => {
    setIsLoading(true);
    try {
      await deleteNote(noteId);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete note');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    notes,
    isLoading,
    error,
    fetchNotes,
    addNote,
    editNote,
    removeNote,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};
