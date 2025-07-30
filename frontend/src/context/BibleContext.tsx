import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { getBibleVerse } from '../services/bibleApi';

interface Verse {
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
}

interface BibleContextType {
    currentBook: string;
    currentChapter: number;
    verses: Verse[];
    isLoading: boolean;
    error: string | null;
    selectedVerses: Set<number>;
    highlights: Map<number, string>;
    changeChapter: (book: string, chapter: number) => void;
    toggleVerseSelection: (verseNumber: number) => void;
    applyHighlight: (color: string) => void;
    clearSelection: () => void;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export const BibleProvider = ({ children }: { children: ReactNode }) => {
    const [currentBook, setCurrentBook] = useState('Giovanni');
    const [currentChapter, setCurrentChapter] = useState(3);
    const [verses, setVerses] = useState<Verse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set());
    const [highlights, setHighlights] = useState<Map<number, string>>(new Map());

    const changeChapter = useCallback(async (book: string, chapter: number) => {
        setIsLoading(true);
        setError(null);
        setSelectedVerses(new Set());
        try {
            const data = await getBibleVerse(`${book} ${chapter}`);
            setVerses(data.verses);
            setCurrentBook(book);
            setCurrentChapter(chapter);
        } catch (err) {
            setError('Impossibile caricare il capitolo.');
            setVerses([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const toggleVerseSelection = (verseNumber: number) => {
        const newSelection = new Set(selectedVerses);
        if (newSelection.has(verseNumber)) {
            newSelection.delete(verseNumber);
        } else {
            newSelection.add(verseNumber);
        }
        setSelectedVerses(newSelection);
    };

    const applyHighlight = (color: string) => {
        const newHighlights = new Map(highlights);
        selectedVerses.forEach(verseNum => {
            if (newHighlights.get(verseNum) === color) {
                newHighlights.delete(verseNum); // Toggle off if same color
            } else {
                newHighlights.set(verseNum, color);
            }
        });
        setHighlights(newHighlights);
        setSelectedVerses(new Set()); // Clear selection after applying highlight
    };

    const clearSelection = () => {
        setSelectedVerses(new Set());
    };

    const value = {
        currentBook,
        currentChapter,
        verses,
        isLoading,
        error,
        selectedVerses,
        highlights,
        changeChapter,
        toggleVerseSelection,
        applyHighlight,
        clearSelection
    };

    return <BibleContext.Provider value={value}>{children}</BibleContext.Provider>;
};

export const useBible = () => {
    const context = useContext(BibleContext);
    if (context === undefined) {
        throw new Error('useBible must be used within a BibleProvider');
    }
    return context;
};
