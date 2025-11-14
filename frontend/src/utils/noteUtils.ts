export const parseNoteLinks = (content: string): string => {
    const linkRegex = /\[\[(.*?)\]\]/g;
    return content.replace(linkRegex, (match, title) => {
        const url = `/search?q=${encodeURIComponent(`"${title}"`)}`;
        return `<a href="${url}" class="text-primary hover:underline bg-primary/10 px-1 rounded-md">[[${title}]]</a>`;
    });
};
