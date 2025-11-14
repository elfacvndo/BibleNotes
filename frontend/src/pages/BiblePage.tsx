import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import BookChapterSelector from '../components/bible/BookChapterSelector';
import BibleText from '../components/bible/BibleText';
import FloatingToolbar from '../components/bible/FloatingToolbar';
import { useBible } from '../context/BibleContext';

interface OutletContextType {
    handleOpenEditorForNew: (content?: string) => void;
}

const BiblePage: React.FC = () => {
    const { changeChapter, currentBook, currentChapter } = useBible();
    const { handleOpenEditorForNew } = useOutletContext<OutletContextType>();

    useEffect(() => {
        // Initial load of the chapter
        changeChapter(currentBook, currentChapter);
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="relative h-full">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                <div className="lg:col-span-1">
                    <BookChapterSelector />
                </div>
                <div className="lg:col-span-3">
                    <BibleText />
                </div>
            </div>
            <FloatingToolbar onAddToNote={handleOpenEditorForNew} />
        </div>
    );
};

export default BiblePage;
