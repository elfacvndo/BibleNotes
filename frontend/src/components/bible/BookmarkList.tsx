import React from 'react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useBible } from '../../context/BibleContext';

const BookmarkList: React.FC = () => {
    const { bookmarks, removeBookmark } = useBookmarks();
    const { changeChapter } = useBible();

    if (bookmarks.length === 0) {
        return <p className="text-xs text-text-secondary text-center mt-4">Nessun segnalibro.</p>;
    }

    return (
        <div className="mt-6">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Segnalibri</h3>
            <ul>
                {bookmarks.map(bm => (
                    <li key={bm.id} className="text-sm flex justify-between items-center group">
                        <button
                            onClick={() => changeChapter(bm.book, bm.chapter)}
                            className="text-left text-primary hover:underline"
                        >
                            {bm.book} {bm.chapter}:{bm.verse}
                        </button>
                        <button
                            onClick={() => removeBookmark(bm.id)}
                            className="text-error opacity-0 group-hover:opacity-100"
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookmarkList;
