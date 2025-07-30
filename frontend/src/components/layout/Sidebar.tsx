import React from 'react';
import { NavLink } from 'react-router-dom';
import BookmarkList from '../bible/BookmarkList';

const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Bibbia', href: '/bible' },
  { name: 'Tutte le Note', href: '/notes' },
  // The category links can be implemented later with filtering
  // { name: 'Studio', href: '/notes?category=Study' },
  // { name: 'Adunanze', href: '/notes?category=Meetings' },
  // { name: 'Predicazione', href: '/notes?category=Preaching' },
];

const Sidebar: React.FC = () => {
  const baseClasses = "block p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-primary-light hover:text-white";
  const activeClasses = "bg-primary text-white";

  return (
    <aside className="w-64 bg-surface p-4 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.href}
                end // Use 'end' for the Dashboard link to prevent it from matching all routes
                className={({ isActive }) =>
                    `${baseClasses} ${isActive ? activeClasses : ''}`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <BookmarkList />
    </aside>
  );
};

export default Sidebar;
