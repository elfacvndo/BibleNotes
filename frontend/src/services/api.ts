import { Note } from '../components/notes/NoteCard';

const BASE_URL = '/api';

// A placeholder for getting the auth token
const getAuthToken = () => {
  // In a real app, this would get the token from localStorage or a cookie
  return 'mock_token';
};

const request = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${getAuthToken()}`,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  // Handle responses with no content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  getNotes: (): Promise<Note[]> => {
    return request('/notes');
  },
  createNote: (noteData: Partial<Note>): Promise<Note> => {
    return request('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  },
  // Add updateNote and deleteNote functions here later
};
