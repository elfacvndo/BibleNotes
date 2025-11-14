import React from 'react';

const StudyProgress: React.FC = () => {
  const progress = 35; // Placeholder percentage

  return (
    <div className="bg-surface p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Progresso Lettura Annuale</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div
                className="bg-secondary h-4 rounded-full"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
        <p className="text-right text-sm text-text-secondary mt-2">{progress}% completato</p>
    </div>
  );
};

export default StudyProgress;
