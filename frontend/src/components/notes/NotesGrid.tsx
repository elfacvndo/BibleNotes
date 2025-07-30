import React from 'react';
import NoteCard from './NoteCard';
import { useNotes, Note } from '../../context/NoteContext';
import Spinner from '../common/Spinner';

interface NotesGridProps {
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

const NotesGrid = ({ onEditNote, onDeleteNote }: NotesGridProps) => {
  const { notes, isLoading, error } = useNotes();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-error">
        <p>Error loading notes: {error}</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center text-text-secondary">
        <p>You don't have any notes yet.</p>
        <p>Click "New Note" to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEditNote} onDelete={onDeleteNote} />
      ))}
    </div>
  );
};

export default NotesGrid;
