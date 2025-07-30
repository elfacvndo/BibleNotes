import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import useDebounce from '../../hooks/useDebounce';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

interface HeaderProps {
  onNewNote: () => void;
}

const Header = ({ onNewNote }: HeaderProps) => {
  const { logout, user } = useAuth();
  const themeContext = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
        navigate(`/search?q=${encodeURIComponent(debouncedSearchTerm.trim())}`);
    }
  }, [debouncedSearchTerm, navigate]);

  if (!themeContext) {
    return null;
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <header className="bg-surface shadow-sm p-4 flex justify-between items-center text-text-primary border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary">
            BibleNotes
        </h1>
        <input
            type="search"
            placeholder="Cerca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-64"
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm hidden sm:block">Benvenuto, {user?.username}!</span>
        <button
          onClick={onNewNote}
          className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary-dark"
        >
          Nuova Nota
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-medium rounded-md bg-secondary text-white hover:bg-opacity-90"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
