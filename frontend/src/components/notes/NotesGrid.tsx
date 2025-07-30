import React from 'react';
import NoteCard from './NoteCard';
import { useNotes, Note } from '../../context/NoteContext';
import Spinner from '../common/Spinner';

interface NotesGridProps {
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  notes?: Note[]; // Make notes optional
}

const NotesGrid = ({ onEditNote, onDeleteNote, notes: notesFromProps }: NotesGridProps) => {
  const { notes: notesFromContext, isLoading, error } = useNotes();

  const notes = notesFromProps || notesFromContext;

  if (isLoading && !notesFromProps) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-error">
        <p>Errore nel caricamento delle note: {error}</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center text-text-secondary py-10">
        <p className="font-semibold">Non hai ancora nessuna nota.</p>
        <p className="text-sm">Clicca "Nuova Nota" per iniziare!</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      {notes.map((note) => (
        <div key={note.id} className="mb-6">
            <NoteCard note={note} onEdit={onEditNote} onDelete={onDeleteNote} />
        </div>
      ))}
    </div>
  );
};

export default NotesGrid;
