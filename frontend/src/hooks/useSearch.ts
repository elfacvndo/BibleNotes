import { useMemo } from 'react';
import { Note } from '../context/NoteContext';

export const useSearch = (notes: Note[], searchTerm: string) => {
    const searchResults = useMemo(() => {
        if (!searchTerm) {
            // If the search term is empty, on the main NotesPage we want to show all notes,
            // but on the SearchPage, we want to show none. This logic is handled in the components.
            // Here, we return an empty array if there's no search term.
            return [];
        }

        const phrases = searchTerm.match(/"[^"]+"/g) || [];
        const includedTerms = searchTerm.replace(/"[^"]+"/g, '').match(/\b\w+\b/g) || [];
        const excludedTerms = searchTerm.match(/-\w+/g)?.map(t => t.substring(1)) || [];

        return notes.filter(note => {
            const noteText = `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase();

            const hasAllPhrases = phrases.every(phrase => noteText.includes(phrase.substring(1, phrase.length - 1).toLowerCase()));
            if (!hasAllPhrases) return false;

            const hasAllIncludedTerms = includedTerms.every(term => noteText.includes(term.toLowerCase()));
            if (!hasAllIncludedTerms) return false;

            const hasNoExcludedTerms = excludedTerms.every(term => !noteText.includes(term.toLowerCase()));
            if (!hasNoExcludedTerms) return false;

            return true;
        });
    }, [notes, searchTerm]);

    return searchResults;
};
