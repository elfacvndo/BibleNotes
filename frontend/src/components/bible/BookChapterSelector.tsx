import React from 'react';
import { getBibleBooks } from '../../services/bibleApi';

interface BookChapterSelectorProps {
    onSelect: (book: string, chapter: number) => void;
}

const BookChapterSelector: React.FC<BookChapterSelectorProps> = ({ onSelect }) => {
    const books = getBibleBooks();
    // In a real app, chapters would be dynamic based on the selected book
    const chapters = Array.from({ length: 50 }, (_, i) => i + 1);

    const handleSelect = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const book = formData.get('book') as string;
        const chapter = parseInt(formData.get('chapter') as string, 10);
        if (book && chapter) {
            onSelect(book, chapter);
        }
    };

    return (
        <div className="p-4 bg-surface rounded-lg shadow-md">
            <form onSubmit={handleSelect} className="space-y-4">
                <div>
                    <label htmlFor="book" className="block text-sm font-medium text-text-secondary">Libro</label>
                    <select id="book" name="book" className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                        {books.map(book => <option key={book} value={book}>{book}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="chapter" className="block text-sm font-medium text-text-secondary">Capitolo</label>
                    <select id="chapter" name="chapter" className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                        {chapters.map(chap => <option key={chap} value={chap}>{chap}</option>)}
                    </select>
                </div>
                <button type="submit" className="w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary-dark">
                    Vai
                </button>
            </form>
        </div>
    );
};

export default BookChapterSelector;
