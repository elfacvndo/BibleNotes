import React from 'react';

const DailyVerse: React.FC = () => {
  return (
    <div className="bg-primary-light p-6 rounded-lg shadow-md text-white">
        <h3 className="text-lg font-semibold mb-2">Versetto del Giorno</h3>
        <blockquote className="border-l-4 border-accent pl-4">
            <p className="italic">"Poiché Dio ha tanto amato il mondo che ha dato il suo Figlio unigenito, affinché chiunque esercita fede in lui non sia distrutto ma abbia vita eterna."</p>
            <cite className="block text-right mt-2 not-italic">- Giovanni 3:16</cite>
        </blockquote>
    </div>
  );
};

export default DailyVerse;
