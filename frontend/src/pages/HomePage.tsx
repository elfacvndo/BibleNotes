import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import NotesGrid from '../components/notes/NotesGrid';
import NoteEditor from '../components/notes/NoteEditor';
import Modal from '../components/common/Modal';
import { useNotes } from '../context/NoteContext';
import { Note } from '../context/NoteContext';

const HomePage: React.FC = () => {
    const [isEditorOpen, setEditorOpen] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
    const { addNote, editNote, removeNote, isLoading: isSaving } = useNotes();

    const handleOpenEditorForNew = () => {
        setNoteToEdit(null);
        setEditorOpen(true);
    };

    const handleOpenEditorForEdit = (note: Note) => {
        setNoteToEdit(note);
        setEditorOpen(true);
    };

    const handleCloseEditor = () => {
        setEditorOpen(false);
        setNoteToEdit(null); // Clear the note being edited when closing
    };

    const handleSaveNote = async (noteData: { title: string; content: string; tags: string[] }) => {
        try {
            if (noteToEdit) {
                await editNote(noteToEdit.id, noteData);
            } else {
                await addNote(noteData);
            }
            handleCloseEditor();
        } catch (error) {
            console.error("Failed to save note:", error);
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
            await removeNote(noteId);
        } catch (error) {
            console.error("Failed to delete note:", error);
            // Optionally show an error to the user
        }
    };

    return (
        <>
            <div className="bg-background text-text-primary min-h-screen flex flex-col">
                <Header onNewNote={handleOpenEditorForNew} />
                <div className="flex flex-1 overflow-y-hidden">
                    <Sidebar />
                    <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-text-primary">Dashboard</h2>
                        <NotesGrid onEditNote={handleOpenEditorForEdit} onDeleteNote={handleDeleteNote} />
                    </main>
                </div>
            </div>

            <Modal isOpen={isEditorOpen} onClose={handleCloseEditor} title={noteToEdit ? "Edit Note" : "Create a New Note"}>
                <NoteEditor
                    noteToEdit={noteToEdit}
                    onSave={handleSaveNote}
                    onClose={handleCloseEditor}
                    isSaving={isSaving}
                />
            </Modal>
        </>
    );
};

export default HomePage;
