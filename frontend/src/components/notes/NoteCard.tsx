import React from 'react';
import { Note } from '../../context/NoteContext';

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    if (window.confirm('Are you sure you want to delete this note?')) {
        onDelete(note.id);
    }
  };

  return (
    <div
        className="bg-surface p-4 rounded-lg shadow-md border-l-4 border-primary hover:shadow-lg hover:border-accent transition-all duration-200 flex flex-col justify-between cursor-pointer relative group break-inside-avoid"
        onClick={() => onEdit(note)}
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 rounded-full bg-white/50 dark:bg-black/50 text-error opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete note"
      >
        <TrashIcon />
      </button>

      <div>
        <h3 className="text-lg font-bold mb-2 text-text-primary">{note.title}</h3>
        {/* Using dangerouslySetInnerHTML to render the rich text content */}
        <div
            className="text-text-secondary text-sm mb-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
      <div className="flex justify-between items-end mt-4">
        <div className="text-xs text-text-secondary">
            {new Date(note.updated_at).toLocaleDateString()}
        </div>
        {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-secondary text-white px-2 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
