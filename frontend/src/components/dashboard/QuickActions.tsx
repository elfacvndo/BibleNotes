import React from 'react';

interface QuickActionsProps {
    onNewNote: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNewNote }) => {
  return (
    <div className="flex gap-4">
        <button
            onClick={onNewNote}
            className="flex-1 px-4 py-3 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary-dark"
        >
            Nuova Nota
        </button>
        <button className="flex-1 px-4 py-3 text-sm font-medium rounded-md bg-secondary text-white hover:bg-opacity-90">
            Continua Lettura
        </button>
        <button className="flex-1 px-4 py-3 text-sm font-medium rounded-md bg-accent text-white hover:bg-opacity-90">
            Ricerca Rapida
        </button>
    </div>
  );
};

export default QuickActions;
