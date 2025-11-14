import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Modal from '../common/Modal';
import NoteEditor from '../notes/NoteEditor';
import { Note, useNotes, NoteProvider } from '../../context/NoteContext';
import { BibleProvider } from '../../context/BibleContext';
import { BookmarkProvider } from '../../context/BookmarkContext';

const ProtectedLayout: React.FC = () => {
    return (
        <NoteProvider>
            <BibleProvider>
                <BookmarkProvider>
                    <LayoutController />
                </BookmarkProvider>
            </BibleProvider>
        </NoteProvider>
    );
};

const LayoutController: React.FC = () => {
    const [isEditorOpen, setEditorOpen] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
    const [initialContent, setInitialContent] = useState('');
    const { addNote, editNote, removeNote, isLoading: isSaving } = useNotes();

    const handleOpenEditorForNew = (content = '') => {
        setNoteToEdit(null);
        setInitialContent(content);
        setEditorOpen(true);
    };

    const handleOpenEditorForEdit = (note: Note) => {
        setNoteToEdit(note);
        setInitialContent(''); // Not needed for editing
        setEditorOpen(true);
    };

    const handleCloseEditor = () => {
        setEditorOpen(false);
        setNoteToEdit(null);
        setInitialContent('');
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
                <Header onNewNote={() => handleOpenEditorForNew()} />
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
                    initialContent={initialContent}
                    onSave={handleSaveNote}
                    onClose={handleCloseEditor}
                    isSaving={isSaving}
                />
            </Modal>
        </>
    );
}

export default ProtectedLayout;
