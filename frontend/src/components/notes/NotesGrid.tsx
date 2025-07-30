import React from 'react';
import NoteCard, { Note } from './NoteCard';

// Mock data to simulate fetching from an API
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Studio personale Torre di Guardia',
    content: 'Paragrafo 5, la pazienza è fondamentale per mantenere la gioia. La scrittura chiave è Giacomo 1:4. Meditare su come applicarla nel ministero.',
    category: 'Study',
    tags: ['pazienza', 'studio'],
    color: 'blue',
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
  },
  {
    id: '2',
    title: 'Commento per l\'adunanza infrasettimanale',
    content: 'Per la parte "Vita Cristiana", preparare un commento sulla scrittura di 2 Timoteo 3:16, 17, sottolineando l\'ispirazione divina.',
    category: 'Meetings',
    tags: ['adunanza', 'commento'],
    color: 'gold',
    createdAt: new Date('2023-10-25T15:30:00Z').toISOString(),
  },
  {
    id: '3',
    title: 'Visita ulteriore a Mario Rossi',
    content: 'Mostrare il video "Perché studiare la Bibbia?" e offrire il volantino. La domanda da considerare è: "Pensa che la scienza abbia smentito la Bibbia?"',
    category: 'Preaching',
    tags: ['visita', 'video'],
    color: 'blue',
    createdAt: new Date('2023-10-24T18:00:00Z').toISOString(),
  },
   {
    id: '4',
    title: 'Idea per discorso',
    content: 'Sviluppare un discorso sul tema "L\'amore non viene mai meno". Usare 1 Corinti 13 e esempi moderni di amore fraterno.',
    category: 'Meetings',
    tags: ['discorso', 'amore'],
    color: 'gold',
    createdAt: new Date('2023-10-22T11:00:00Z').toISOString(),
  },
];


const NotesGrid = () => {
  // In a real app, you would use a hook to fetch notes from the API
  // const { data: notes, isLoading, error } = useFetchNotes();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mockNotes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};

export default NotesGrid;
