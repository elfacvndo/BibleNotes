import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import NotesGrid from '../components/notes/NotesGrid';
import { useNotes, Note } from '../context/NoteContext';
import { useSearch } from '../hooks/useSearch';

interface OutletContextType {
    handleOpenEditorForEdit: (note: Note) => void;
    handleDeleteNote: (noteId: string) => void;
}

const NotesPage: React.FC = () => {
    const { notes } = useNotes();
    const { handleOpenEditorForEdit, handleDeleteNote } = useOutletContext<OutletContextType>();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'updated_at_desc' | 'updated_at_asc' | 'title_asc' | 'title_desc'>('updated_at_desc');

    const searchResults = useSearch(notes, searchTerm);
    const notesToDisplay = searchTerm ? searchResults : notes;

    const sortedNotes = useMemo(() => {
        const notesToSort = [...notesToDisplay];
        switch (sortOrder) {
            case 'title_asc':
                return notesToSort.sort((a, b) => a.title.localeCompare(b.title));
            case 'title_desc':
                return notesToSort.sort((a, b) => b.title.localeCompare(a.title));
            case 'updated_at_asc':
                return notesToSort.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
            case 'updated_at_desc':
            default:
                return notesToSort.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        }
    }, [notesToDisplay, sortOrder]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-text-primary">Tutte le Note</h1>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Cerca... (es. \"frase esatta\" -parola)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md w-64"
                    />
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        <option value="updated_at_desc">Più Recenti</option>
                        <option value="updated_at_asc">Meno Recenti</option>
                        <option value="title_asc">Titolo (A-Z)</option>
                        <option value="title_desc">Titolo (Z-A)</option>
                    </select>
                </div>
            </div>

            <NotesGrid
                onEditNote={handleOpenEditorForEdit}
                onDeleteNote={handleDeleteNote}
                notes={sortedNotes}
            />
        </div>
    );
};

export default NotesPage;
