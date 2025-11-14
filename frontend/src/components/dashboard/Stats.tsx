import React from 'react';

// Placeholder data
const stats = [
  { name: 'Note Create', value: 12, change: '+2' },
  { name: 'Capitoli Letti', value: 150, change: '+10' },
  { name: 'Giorni di Studio Consecutivi', value: 25, change: '+1' },
];

const Stats: React.FC = () => {
  return (
    <div className="bg-surface p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Le tue Statistiche</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => (
                <div key={stat.name} className="bg-background p-4 rounded-lg">
                    <p className="text-sm text-text-secondary">{stat.name}</p>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-success">{stat.change} dall'ultima settimana</p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Stats;
