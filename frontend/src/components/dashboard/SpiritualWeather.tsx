import React from 'react';

const SpiritualWeather: React.FC = () => {
    // This is a placeholder. Logic can be added to change the icon and message.
    const weather = {
        icon: '☀️',
        message: 'Cielo sereno! Un giorno perfetto per meditare sulla Parola di Dio.',
    };

    return (
        <div className="bg-surface p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="text-4xl">{weather.icon}</div>
            <div>
                <h3 className="text-lg font-semibold text-text-primary">Meteo Spirituale</h3>
                <p className="text-sm text-text-secondary">{weather.message}</p>
            </div>
        </div>
    );
};

export default SpiritualWeather;
