import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Modal from '../common/Modal';
import NoteEditor from '../notes/NoteEditor';
import { Note, useNotes } from '../../context/NoteContext';
import { NoteProvider } from '../../context/NoteContext';

const ProtectedLayout: React.FC = () => {
    return (
        <NoteProvider>
            <LayoutController />
        </NoteProvider>
    );
};

// We create a sub-component to access the NoteContext
const LayoutController: React.FC = () => {
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
        setNoteToEdit(null);
    };

    const handleSaveNote = async (noteData: { title: string; content: string; tags: string[], attachments: string[] }) => {
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
        }
    };

    const outletContext = {
        handleOpenEditorForNew,
        handleOpenEditorForEdit,
        handleDeleteNote,
    };

    return (
        <>
            <div className="bg-background text-text-primary min-h-screen flex flex-col">
                <Header onNewNote={handleOpenEditorForNew} />
                <div className="flex flex-1 overflow-y-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto">
                        <Outlet context={outletContext} />
                    </main>
                </div>
            </div>
            <Modal isOpen={isEditorOpen} onClose={handleCloseEditor} title={noteToEdit ? "Modifica Nota" : "Crea una Nuova Nota"}>
                <NoteEditor
                    noteToEdit={noteToEdit}
                    onSave={handleSaveNote}
                    onClose={handleCloseEditor}
                    isSaving={isSaving}
                />
            </Modal>
        </>
    );
}

export default ProtectedLayout;
