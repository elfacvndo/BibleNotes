import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
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
  const ws = useRef<WebSocket | null>(null);

  // --- WebSocket Connection ---
  useEffect(() => {
    if (!isAuthenticated) {
        return;
    }

    const connect = () => {
        const wsUrl = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host;
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('WebSocket message received:', message);

            switch (message.type) {
                case 'NOTE_CREATED':
                    setNotes(prev => [message.payload, ...prev]);
                    break;
                case 'NOTE_UPDATED':
                    setNotes(prev => prev.map(n => n.id === message.payload.id ? message.payload : n));
                    break;
                case 'NOTE_DELETED':
                    setNotes(prev => prev.filter(n => n.id !== message.payload.id));
                    break;
                default:
                    break;
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected. Attempting to reconnect...');
            setTimeout(connect, 3000); // Reconnect after 3 seconds
        };

        ws.current.onerror = (err) => {
            console.error('WebSocket error:', err);
            ws.current?.close();
        };
    };

    connect();

    return () => {
        ws.current?.close();
    };
  }, [isAuthenticated]);


  // --- REST API Functions ---
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

  // The REST-based functions are now optimistic and primarily for the current user's actions.
  // The WebSocket will handle updates from other sources.
  const addNote = async (noteData: { title: string; content?: string; tags?: string[] }) => {
    // The backend will broadcast the change, so we don't need to add it to the state here.
    // The UI will update when the WebSocket message is received.
    await createNote(noteData);
  };

  const editNote = async (noteId: string, noteData: { title: string; content?: string; tags?: string[] }) => {
    await updateNote(noteId, noteData);
  };

  const removeNote = async (noteId: string) => {
    await deleteNote(noteId);
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
