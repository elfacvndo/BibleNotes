import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

// Basic Sun and Moon icons as components
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
  const context = useContext(ThemeContext);

  if (!context) {
    return null; // Or some fallback
  }

  const { theme, toggleTheme } = context;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-xl font-bold text-jw-blue dark:text-jw-gold">
        Appunti Spirituali
      </h1>
      <div className="flex items-center gap-4">
        <button
          onClick={onNewNote}
          className="px-4 py-2 text-sm font-medium rounded-md bg-jw-blue text-white hover:bg-opacity-90"
        >
          Crea Nota
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
