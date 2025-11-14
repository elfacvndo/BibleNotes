import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../../context/NoteContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadImage } from '../../services/api';

interface NoteEditorProps {
  noteToEdit?: Note | null;
  initialContent?: string;
  onSave: (note: { title: string; content: string; tags: string[]; attachments: string[] }) => void;
  onClose: () => void;
  isSaving: boolean;
}

const templates = {
    "Studio Personale": "<h2>Argomento: </h2><p>Scrittura chiave: </p><h3>Punti Principali:</h3><ul><li></li><li></li></ul><p>Applicazione personale: </p>",
    "Preparazione Discorso": "<h2>Titolo del Discorso: </h2><h3>Introduzione:</h3><p></p><h3>Corpo:</h3><ol><li><h4>Punto 1:</h4><p></p></li><li><h4>Punto 2:</h4><p></p></li></ol><h3>Conclusione:</h3><p></p>",
    "Predicazione": "<h3>Visita a: </h3><p>Data: </p><p>Argomento trattato: </p><p>Pubblicazione lasciata: </p><p>Domanda per la prossima volta: </p>"
};

const NoteEditor = ({ noteToEdit, initialContent: initialContentProp, onSave, onClose, isSaving }: NoteEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const quillRef = useRef<ReactQuill>(null);

  const handleTemplateSelect = (templateName: keyof typeof templates) => {
      if (window.confirm("Selezionando un modello, il contenuto attuale verrà sovrascritto. Continuare?")) {
        setContent(templates[templateName]);
      }
  };

  // --- Image Upload Handler ---
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
        if (input.files) {
            const file = input.files[0];
            try {
                const res = await uploadImage(file);
                const imageUrl = res.imageUrl;

                const quill = quillRef.current?.getEditor();
                if (quill) {
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', imageUrl);
                    quill.setSelection(range.index + 1, 0);
                }
                setAttachments(prev => [...prev, imageUrl]);
            } catch (error) {
                console.error(error);
                alert("Caricamento immagine fallito!");
            }
        }
    };
  };

  const modules = {
    toolbar: {
        container: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'image', 'clean']
        ],
        handlers: {
            'image': imageHandler
        }
    }
  };

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setTags(noteToEdit.tags.join(', '));
      setAttachments(noteToEdit.attachments || []);
    } else {
      setTitle('');
      setContent(initialContentProp || '');
      setTags('');
      setAttachments([]);
    }
  }, [noteToEdit, initialContentProp]);

  const handleSave = () => {
    if (!title) {
      alert('Il titolo è obbligatorio.');
      return;
    }
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    onSave({ title, content, tags: tagsArray, attachments });
  };

  useEffect(() => {
    const text = content.replace(/<[^>]*>?/gm, '');
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [content]);

  return (
    <div className="flex flex-col gap-4 h-[60vh]">
        <div className="flex justify-between items-center">
            <input
                type="text"
                placeholder="Titolo della Nota"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-background dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            {!noteToEdit && (
                 <select
                    onChange={(e) => handleTemplateSelect(e.target.value as keyof typeof templates)}
                    className="p-2 ml-4 border border-gray-300 rounded-md"
                    defaultValue=""
                >
                    <option value="" disabled>Scegli un modello...</option>
                    {Object.keys(templates).map(name => <option key={name} value={name}>{name}</option>)}
                </select>
            )}
        </div>
      <div className="flex-grow h-full">
         <ReactQuill
            ref={quillRef}
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
