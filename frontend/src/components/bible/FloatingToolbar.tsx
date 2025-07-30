import React from 'react';
import { useBible } from '../../context/BibleContext';
import { useBookmarks } from '../../context/BookmarkContext';

interface FloatingToolbarProps {
    onAddToNote: (content: string) => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ onAddToNote }) => {
    const { selectedVerses, verses, applyHighlight, clearSelection, currentBook, currentChapter } = useBible();
    const { addBookmark } = useBookmarks();

    if (selectedVerses.size === 0) {
        return null;
    }

    const handleHighlight = (color: string) => {
        applyHighlight(color);
    };

    const handleCopy = () => {
        const selectedContent = verses
            .filter(v => selectedVerses.has(v.verse))
            .map(v => `${v.book_name} ${v.chapter}:${v.verse} - ${v.text}`)
            .join('\n');
        navigator.clipboard.writeText(selectedContent);
        alert('Versetti copiati!');
        clearSelection();
    };

    const handleAddToNote = () => {
        const noteContent = verses
            .filter(v => selectedVerses.has(v.verse))
            .map(v => `<blockquote><p><strong>${v.book_name} ${v.chapter}:${v.verse}</strong></p><p>${v.text}</p></blockquote><p><br></p>`)
            .join('');
        onAddToNote(noteContent);
        clearSelection();
    };

    const handleBookmark = () => {
        selectedVerses.forEach(verseNum => {
            addBookmark(currentBook, currentChapter, verseNum);
        });
        alert(`${selectedVerses.size} segnalibri aggiunti!`);
        clearSelection();
    };

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-surface shadow-lg rounded-lg p-2 flex gap-2 items-center z-50">
            <span className="text-sm font-semibold pr-2">{selectedVerses.size} versetti selezionati</span>

            <div className="flex items-center gap-1">
                <button onClick={() => handleHighlight('yellow')} className="h-6 w-6 rounded-full bg-yellow-300 border-2 border-white hover:border-yellow-500"></button>
                <button onClick={() => handleHighlight('green')} className="h-6 w-6 rounded-full bg-green-300 border-2 border-white hover:border-green-500"></button>
                <button onClick={() => handleHighlight('blue')} className="h-6 w-6 rounded-full bg-blue-300 border-2 border-white hover:border-blue-500"></button>
            </div>

            <div className="border-l border-gray-300 h-6 mx-2"></div>

            <button onClick={handleCopy} className="text-sm px-3 py-1 rounded-md hover:bg-gray-200">Copia</button>
            <button onClick={handleAddToNote} className="text-sm px-3 py-1 rounded-md hover:bg-gray-200">Aggiungi a Nota</button>
            <button onClick={handleBookmark} className="text-sm px-3 py-1 rounded-md hover:bg-gray-200">Salva Segnalibro</button>

            <div className="border-l border-gray-300 h-6 mx-2"></div>

            <button onClick={clearSelection} className="text-sm px-3 py-1 rounded-md hover:bg-gray-200 font-bold">X</button>
        </div>
    );
};

export default FloatingToolbar;
