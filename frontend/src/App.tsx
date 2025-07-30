import { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import NotesGrid from './components/notes/NotesGrid';
import Modal from './components/common/Modal';
import NoteEditor from './components/notes/NoteEditor';

function App() {
  const [isEditorOpen, setEditorOpen] = useState(false);

  const handleSaveNote = (note: any) => {
    console.log('Saving note:', note); // Placeholder
    setEditorOpen(false);
  };

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col">
        {/* Pass the setEditorOpen function to the Header */}
        <Header onNewNote={() => setEditorOpen(true)} />
        <div className="flex flex-1 overflow-y-hidden">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Dashboard</h2>
            <NotesGrid />
          </main>
        </div>
      </div>

      <Modal isOpen={isEditorOpen} onClose={() => setEditorOpen(false)} title="Crea / Modifica Nota">
        <NoteEditor onSave={handleSaveNote} onClose={() => setEditorOpen(false)} />
      </Modal>
    </>
  )
}

export default App
