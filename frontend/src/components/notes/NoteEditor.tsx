import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setTags(noteToEdit.tags.join(', '));
    } else {
      setTitle('');
      setContent('');
      setTags('');
    }
  }, [noteToEdit]);

  const handleSave = () => {
    if (!title) {
      // In a real app, show a more elegant notification
      alert('Title is required.');
      return;
    }
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    onSave({ title, content, tags: tagsArray });
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 bg-background dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
      />
      <div className="h-64">
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
        placeholder="Tags (comma, separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-2 mt-10 bg-background dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
      />
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">
          Cancel
        </button>
        <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark disabled:opacity-50">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
