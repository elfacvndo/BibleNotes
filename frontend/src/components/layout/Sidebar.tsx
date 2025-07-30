import React from 'react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', category: 'all' },
    { name: 'Studio', category: 'Study' },
    { name: 'Adunanze', category: 'Meetings' },
    { name: 'Predicazione', category: 'Preaching' },
  ];

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.category} className="mb-2">
              <a
                href="#"
                className="block p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-jw-blue hover:text-white dark:hover:bg-jw-gold dark:hover:text-gray-900"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
