import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { getBookmarks, createBookmark, deleteBookmark } from '../services/api';
import { useAuth } from './AuthContext';

interface Bookmark {
    id: string;
    user_id: string;
    book: string;
    chapter: number;
    verse: number;
    created_at: string;
}

interface BookmarkContextType {
    bookmarks: Bookmark[];
    addBookmark: (book: string, chapter: number, verse: number) => Promise<void>;
    removeBookmark: (bookmarkId: string) => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const { isAuthenticated } = useAuth();

    const fetchBookmarks = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const fetchedBookmarks = await getBookmarks();
            setBookmarks(fetchedBookmarks);
        } catch (error) {
            console.error("Failed to fetch bookmarks", error);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    const addBookmark = async (book: string, chapter: number, verse: number) => {
        try {
            const newBookmark = await createBookmark({ book, chapter, verse });
            if (newBookmark) {
                setBookmarks(prev => [newBookmark, ...prev]);
            }
        } catch (error) {
            console.error("Failed to create bookmark", error);
        }
    };

    const removeBookmark = async (bookmarkId: string) => {
        try {
            await deleteBookmark(bookmarkId);
            setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
        } catch (error) {
            console.error("Failed to delete bookmark", error);
        }
    };

    const value = { bookmarks, addBookmark, removeBookmark };

    return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};

export const useBookmarks = () => {
    const context = useContext(BookmarkContext);
    if (context === undefined) {
        throw new Error('useBookmarks must be used within a BookmarkProvider');
    }
    return context;
};
