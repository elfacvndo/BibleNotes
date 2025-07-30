import React, { useState } from 'react';
import { Note } from './NoteCard';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Assuming Quill's snow theme

interface NoteEditorProps {
  note?: Note | null; // Pass a note to edit, or null to create
  onSave: (note: Partial<Note>) => void;
  onClose: () => void;
}

// A basic placeholder since I cannot install the real library
const QuillEditor: any = ReactQuill;

const NoteEditor = ({ note, onSave, onClose }: NoteEditorProps) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || 'Study');

  const handleSave = () => {
    if (!title) {
      alert('Il titolo è obbligatorio.');
      return;
    }
    onSave({
      ...note,
      title,
      content,
      category: category as Note['category'],
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Titolo della nota"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
      />

      {/*
        NOTE: This is a placeholder for the rich text editor.
        Without installing the package, this will not render correctly.
        The `react-quill` library and its CSS need to be properly bundled.
      */}
      <div className="h-64">
         <QuillEditor
            theme="snow"
            value={content}
            onChange={setContent}
            className="h-full"
         />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">Categoria</label>
        <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
        >
            <option value="Study">Studio</option>
            <option value="Meetings">Adunanze</option>
            <option value="Preaching">Predicazione</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">
          Annulla
        </button>
        <button onClick={handleSave} className="px-4 py-2 rounded-md bg-jw-blue text-white hover:bg-opacity-90">
          Salva
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
