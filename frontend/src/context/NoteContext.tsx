import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { getNotes, syncChanges } from '../services/api';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  attachments: string[];
  version: number;
  created_at: string;
  updated_at: string;
}

interface NoteContextType {
  notes: Note[];
  isLoading: boolean;
  isSyncing: boolean;
  isOnline: boolean;
  error: string | null;
  addNote: (noteData: { title: string; content?: string; tags?: string[]; attachments?: string[] }) => Promise<void>;
  editNote: (noteId: string, noteData: { title: string; content?: string; tags?: string[]; attachments?: string[] }) => Promise<void>;
  removeNote: (noteId: string) => Promise<void>;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const offlineQueue = useRef<any[]>(JSON.parse(localStorage.getItem('offlineQueue') || '[]'));

  // --- Online/Offline Status ---
  useEffect(() => {
    const handleOnline = () => {
        setIsOnline(true);
        processQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // --- Queue Processing ---
  const processQueue = async () => {
    if (offlineQueue.current.length === 0 || !isOnline) return;

    setIsSyncing(true);
    const payload = {
        creations: offlineQueue.current.filter(op => op.type === 'create').map(op => op.payload),
        updates: offlineQueue.current.filter(op => op.type === 'update').map(op => op.payload),
        deletions: offlineQueue.current.filter(op => op.type === 'delete').map(op => op.payload.id),
    };

    try {
        const results = await syncChanges(payload);
        // TODO: Handle conflicts and update state properly
        console.log("Sync results:", results);
        offlineQueue.current = [];
        localStorage.setItem('offlineQueue', '[]');
        await fetchNotes(); // Re-fetch all notes to ensure consistency
    } catch (err) {
        console.error("Sync failed", err);
        setError("Sync failed. Some changes may not be saved.");
    } finally {
        setIsSyncing(false);
    }
  };

  const addToQueue = (action: any) => {
      offlineQueue.current.push(action);
      localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue.current));
  };


  // --- Data Functions ---
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

  const addNote = async (noteData: any) => {
    if (isOnline) {
        await syncChanges({ creations: [noteData] });
        await fetchNotes(); // simple refetch for now
    } else {
        const newNote = { ...noteData, id: `local-${uuidv4()}`, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        setNotes(prev => [newNote, ...prev]);
        addToQueue({ type: 'create', payload: noteData });
    }
  };

  const editNote = async (noteId: string, noteData: any) => {
     if (isOnline) {
        await syncChanges({ updates: [{ id: noteId, ...noteData }] });
        await fetchNotes();
    } else {
        setNotes(prev => prev.map(n => n.id === noteId ? { ...n, ...noteData, version: n.version + 1 } : n));
        addToQueue({ type: 'update', payload: { id: noteId, ...noteData } });
    }
  };

  const removeNote = async (noteId: string) => {
    if (isOnline) {
        await syncChanges({ deletions: [noteId] });
        await fetchNotes();
    } else {
        setNotes(prev => prev.filter(n => n.id !== noteId));
        addToQueue({ type: 'delete', payload: { id: noteId } });
    }
  };

  const value = {
    notes,
    isLoading,
    isSyncing,
    isOnline,
    error,
    addNote,
    editNote,
    removeNote,
  };

  // This is a simplified context that doesn't expose fetchNotes
  return <NoteContext.Provider value={value as any}>{children}</NoteContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};
