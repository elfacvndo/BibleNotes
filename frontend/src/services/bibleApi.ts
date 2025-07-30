const BIBLE_API_URL = 'https://bible-api.com/';

export const getBibleVerse = async (reference: string) => {
    try {
        const response = await fetch(`${BIBLE_API_URL}${encodeURIComponent(reference)}?translation=it-diodati`);
        if (!response.ok) {
            throw new Error('Failed to fetch Bible verse.');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching Bible verse:", error);
        throw error;
    }
};

// In a real app, we would fetch the list of books from an endpoint
// or have it as a static JSON file.
export const getBibleBooks = () => {
    return [
        "Genesi", "Esodo", "Levitico", "Numeri", "Deuteronomio",
        "Giosuè", "Giudici", "Rut", "1 Samuele", "2 Samuele",
        "1 Re", "2 Re", "1 Cronache", "2 Cronache", "Esdra",
        "Neemia", "Ester", "Giobbe", "Salmi", "Proverbi",
        "Ecclesiaste", "Cantico dei Cantici", "Isaia", "Geremia",
        "Lamentazioni", "Ezechiele", "Daniele", "Osea", "Gioele",
        "Amos", "Abdia", "Giona", "Michea", "Naum", "Abacuc",
        "Sofonia", "Aggeo", "Zaccaria", "Malachia",
        "Matteo", "Marco", "Luca", "Giovanni", "Atti", "Romani",
        "1 Corinzi", "2 Corinzi", "Galati", "Efesini", "Filippesi",
        "Colossesi", "1 Tessalonicesi", "2 Tessalonicesi", "1 Timoteo",
        "2 Timoteo", "Tito", "Filemone", "Ebrei", "Giacomo",
        "1 Pietro", "2 Pietro", "1 Giovanni", "2 Giovanni", "3 Giovanni", "Giuda", "Apocalisse"
    ];
};
