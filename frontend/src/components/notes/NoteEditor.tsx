import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../../context/NoteContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface NoteEditorProps {
  noteToEdit?: Note | null;
  onSave: (note: { title: string; content: string; tags: string[] }) => void;
  onClose: () => void;
  isSaving: boolean;
}

const NoteEditor = ({ noteToEdit, onSave, onClose, isSaving }: NoteEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const initialContent = useRef(noteToEdit?.content || '');

  // Auto-save logic
  useEffect(() => {
    if (!noteToEdit) return; // Only auto-save existing notes

    const handler = setTimeout(() => {
        // Auto-save only if content has changed
        if (content !== initialContent.current) {
            console.log("Auto-saving note...");
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            onSave({ title, content, tags: tagsArray });
            initialContent.current = content; // Update initial content after save
        }
    }, 30000); // 30 seconds

    return () => {
      clearTimeout(handler);
    };
  }, [content, title, tags, noteToEdit, onSave]);

  // Word count logic
  useEffect(() => {
    const text = content.replace(/<[^>]*>?/gm, ''); // Strip HTML tags
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [content]);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setTags(noteToEdit.tags.join(', '));
      initialContent.current = noteToEdit.content;
    } else {
      setTitle('');
      setContent('');
      setTags('');
      initialContent.current = '';
    }
  }, [noteToEdit]);

  const handleSave = () => {
    if (!title) {
      alert('Il titolo è obbligatorio.');
      return;
    }
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    onSave({ title, content, tags: tagsArray });
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  };

  return (
    <div className="flex flex-col gap-4 h-[60vh]">
      <input
        type="text"
        placeholder="Titolo della Nota"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 bg-background dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
      />
      <div className="flex-grow h-full">
         <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="h-full bg-surface"
         />
      </div>
       <input
        type="text"
        placeholder="Etichette (separate da virgola)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-2 mt-10 bg-background dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
      />
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-text-secondary">{wordCount} parole</span>
        <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">
              Annulla
            </button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark disabled:opacity-50">
              {isSaving ? 'Salvataggio...' : 'Salva'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
