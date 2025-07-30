import React from 'react';
import { useNotes } from '../../context/NoteContext';

const SyncStatus: React.FC = () => {
    const { isOnline, isSyncing } = useNotes();

    let statusText = 'Sincronizzato';
    let colorClass = 'text-green-500';

    if (!isOnline) {
        statusText = 'Offline';
        colorClass = 'text-yellow-500';
    } else if (isSyncing) {
        statusText = 'Sincronizzando...';
        colorClass = 'text-blue-500';
    }

    return (
        <div className="flex items-center gap-2" title={statusText}>
            <div className={`w-3 h-3 rounded-full ${colorClass.replace('text-', 'bg-')}`}></div>
            <span className={`text-sm ${colorClass}`}>{statusText}</span>
        </div>
    );
};

export default SyncStatus;
