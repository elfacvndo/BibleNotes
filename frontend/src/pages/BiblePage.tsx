import React, { useState } from 'react';
import BookChapterSelector from '../components/bible/BookChapterSelector';
import BibleText from '../components/bible/BibleText';

const BiblePage: React.FC = () => {
    const [selection, setSelection] = useState({ book: 'Giovanni', chapter: 3 });

    const handleSelect = (book: string, chapter: number) => {
        setSelection({ book, chapter });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
            <div className="lg:col-span-1">
                <BookChapterSelector onSelect={handleSelect} />
            </div>
            <div className="lg:col-span-3">
                <BibleText book={selection.book} chapter={selection.chapter} />
            </div>
        </div>
    );
};

export default BiblePage;
