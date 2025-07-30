const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Base request function for authenticated endpoints
const authenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    // If unauthorized, maybe broadcast a logout event
    if (response.status === 401) {
        // This could be improved with an event emitter or a state management solution
        window.dispatchEvent(new Event('auth-error'));
    }
    const error = await response.json();
    throw new Error(error.message || 'An API error occurred');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// --- AUTH API ---
export const loginUser = async (credentials: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }
    return response.json();
};

export const signupUser = async (userInfo: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
    }
    return response.json();
};



// --- NOTES API ---
export const getNotes = () => authenticatedRequest('/notes');
export const createNote = (noteData: { title: string; content?: string; tags?: string[] }) => {
    return authenticatedRequest('/notes', {
        method: 'POST',
        body: JSON.stringify(noteData),
    });
};
export const updateNote = (noteId: string, noteData: { title: string; content?: string; tags?: string[] }) => {
    return authenticatedRequest(`/notes/${noteId}`, {
        method: 'PUT',
        body: JSON.stringify(noteData),
    });
};
export const deleteNote = (noteId: string) => {
    return authenticatedRequest(`/notes/${noteId}`, {
        method: 'DELETE',
    });
};

// --- BOOKMARKS API ---
export const getBookmarks = () => authenticatedRequest('/bookmarks');
export const createBookmark = (bookmarkData: { book: string; chapter: number; verse: number }) => {
    return authenticatedRequest('/bookmarks', {
        method: 'POST',
        body: JSON.stringify(bookmarkData),
    });
};
export const deleteBookmark = (bookmarkId: string) => {
    return authenticatedRequest(`/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
    });
};

// --- UPLOAD API ---
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers,
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Image upload failed');
    }

    return response.json();
};
