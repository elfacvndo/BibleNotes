import React from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import NotesGrid from '../components/notes/NotesGrid';
import { useNotes, Note } from '../context/NoteContext';
import { useSearch } from '../hooks/useSearch';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

interface OutletContextType {
    handleOpenEditorForEdit: (note: Note) => void;
    handleDeleteNote: (noteId: string) => void;
}

const SearchPage: React.FC = () => {
    const query = useQuery();
    const searchTerm = query.get('q') || '';
    const { notes } = useNotes();
    const { handleOpenEditorForEdit, handleDeleteNote } = useOutletContext<OutletContextType>();

    const searchResults = useSearch(notes, searchTerm);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-text-primary">
                Risultati della Ricerca per: <span className="text-primary">"{searchTerm}"</span>
            </h1>

            {searchResults.length > 0 ? (
                 <NotesGrid
                    onEditNote={handleOpenEditorForEdit}
                    onDeleteNote={handleDeleteNote}
                    notes={searchResults}
                />
            ) : (
                <p className="text-text-secondary">Nessun risultato trovato.</p>
            )}
        </div>
    );
};

export default SearchPage;
