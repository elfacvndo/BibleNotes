import React from 'react';

// This interface should eventually be shared with the backend
export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'Study' | 'Meetings' | 'Preaching';
  tags: string[];
  color: string;
  createdAt: string;
}

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const colorVariants = {
    blue: 'bg-blue-100 dark:bg-blue-900 border-blue-400',
    gold: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500',
    // Add other colors from your theme
    default: 'bg-gray-100 dark:bg-gray-700 border-gray-400',
  };

  const cardColor = colorVariants[note.color as keyof typeof colorVariants] || colorVariants.default;

  return (
    <div className={`p-4 rounded-lg shadow-md border-l-4 ${cardColor}`}>
      <h3 className="text-lg font-bold mb-2 truncate">{note.title}</h3>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 overflow-hidden h-20">
        {note.content}
      </p>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {new Date(note.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default NoteCard;
