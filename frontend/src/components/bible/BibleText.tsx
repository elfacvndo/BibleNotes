import React from 'react';
import { useBible } from '../../context/BibleContext';
import Spinner from '../common/Spinner';

const BibleText: React.FC = () => {
    const {
        verses,
        isLoading,
        error,
        selectedVerses,
        highlights,
        toggleVerseSelection,
        currentBook,
        currentChapter
    } = useBible();

    const getHighlightClass = (verseNum: number) => {
        const color = highlights.get(verseNum);
        if (color === 'yellow') return 'bg-yellow-200/50';
        if (color === 'green') return 'bg-green-200/50';
        if (color === 'blue') return 'bg-blue-200/50';
        return '';
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><Spinner /></div>;
    }

    if (error) {
        return <div className="p-10 text-center text-error">{error}</div>;
    }

    if (verses.length === 0) {
        return <div className="p-10 text-center text-text-secondary">Seleziona un libro e un capitolo per iniziare a leggere.</div>;
    }

    return (
        <div className="p-6 bg-surface rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-primary">{currentBook} {currentChapter}</h2>
            <div>
                {verses.map(verse => (
                    <div
                        key={verse.verse}
                        className={`mb-1 p-2 rounded-md cursor-pointer
                            ${selectedVerses.has(verse.verse) ? 'bg-primary-light/20' : ''}
                            ${getHighlightClass(verse.verse)}
                        `}
                        onClick={() => toggleVerseSelection(verse.verse)}
                    >
                        <sup className="text-xs text-accent font-bold mr-2">{verse.verse}</sup>
                        <span className="font-serif text-text-primary leading-relaxed">{verse.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BibleText;
