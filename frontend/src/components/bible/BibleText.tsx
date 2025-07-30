import React, { useState, useEffect } from 'react';
import { getBibleVerse } from '../../services/bibleApi';
import Spinner from '../common/Spinner';

interface BibleTextProps {
    book: string;
    chapter: number;
}

interface Verse {
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
}

const BibleText: React.FC<BibleTextProps> = ({ book, chapter }) => {
    const [verses, setVerses] = useState<Verse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!book || !chapter) return;

        const fetchChapter = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getBibleVerse(`${book} ${chapter}`);
                setVerses(data.verses);
            } catch (err) {
                setError('Impossibile caricare il capitolo. Riprova.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchChapter();
    }, [book, chapter]);

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
            <h2 className="text-2xl font-bold mb-4 text-primary">{verses[0].book_name} {chapter}</h2>
            <div>
                {verses.map(verse => (
                    <p key={verse.verse} className="mb-2">
                        <sup className="text-xs text-accent font-bold mr-2">{verse.verse}</sup>
                        <span className="font-serif text-text-primary leading-relaxed">{verse.text}</span>
                    </p>
                ))}
            </div>
        </div>
    );
};

export default BibleText;
