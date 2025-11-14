import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useNotes, Note } from '../context/NoteContext';
import Stats from '../components/dashboard/Stats';
import QuickActions from '../components/dashboard/QuickActions';
import DailyVerse from '../components/dashboard/DailyVerse';
import StudyProgress from '../components/dashboard/StudyProgress';
import SpiritualWeather from '../components/dashboard/SpiritualWeather';
import NotesGrid from '../components/notes/NotesGrid';

interface OutletContextType {
    handleOpenEditorForNew: () => void;
    handleOpenEditorForEdit: (note: Note) => void;
    handleDeleteNote: (noteId: string) => void;
}

const HomePage: React.FC = () => {
    const { notes } = useNotes();
    const { handleOpenEditorForNew, handleOpenEditorForEdit, handleDeleteNote } = useOutletContext<OutletContextType>();

    const recentNotes = notes.slice(0, 6);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-6">
                    <Stats />
                    <QuickActions onNewNote={handleOpenEditorForNew} />
                    <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-4">Note Recenti</h3>
                        <NotesGrid
                            onEditNote={handleOpenEditorForEdit}
                            onDeleteNote={handleDeleteNote}
                            notes={recentNotes}
                        />
                    </div>
                </div>
                {/* Right sidebar */}
                <div className="space-y-6">
                    <DailyVerse />
                    <StudyProgress />
                    <SpiritualWeather />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
