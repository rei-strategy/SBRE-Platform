import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface WeatherProps {
    lat?: number;
    lng?: number;
    date: string; // ISO date string
    time?: string; // HH:MM
}

interface WeatherData {
    temperature: number;
    weatherCode: number;
    description: string;
}

export const WeatherIndicator: React.FC<WeatherProps> = ({ lat, lng, date }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!lat || !lng) return;

        const fetchWeather = async () => {
            setLoading(true);
            try {
                // Always use Fahrenheit
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max&timezone=auto&start_date=${date.split('T')[0]}&end_date=${date.split('T')[0]}&temperature_unit=fahrenheit`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.daily && data.daily.weathercode && data.daily.weathercode.length > 0) {
                    setWeather({
                        temperature: data.daily.temperature_2m_max[0],
                        weatherCode: data.daily.weathercode[0],
                        description: getWeatherDescription(data.daily.weathercode[0])
                    });
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Weather fetch failed", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [lat, lng, date]);

    const getWeatherIcon = (code: number) => {
        // WMO Weather interpretation codes (WW)
        if (code === 0 || code === 1) return <Sun className="w-4 h-4 text-amber-500" />;
        if (code === 2 || code === 3) return <Cloud className="w-4 h-4 text-slate-400" />;
        if (code >= 45 && code <= 48) return <Cloud className="w-4 h-4 text-slate-500" />; // Fog
        if (code >= 51 && code <= 67) return <CloudRain className="w-4 h-4 text-blue-400" />; // Drizzle/Rain
        if (code >= 71 && code <= 77) return <CloudSnow className="w-4 h-4 text-sky-200" />; // Snow
        if (code >= 80 && code <= 82) return <CloudRain className="w-4 h-4 text-blue-600" />; // Showers
        if (code >= 95) return <CloudLightning className="w-4 h-4 text-purple-500" />; // Thunderstorm
        return <Sun className="w-4 h-4 text-slate-300" />;
    };

    const getWeatherDescription = (code: number) => {
        const codes: Record<number, string> = {
            0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
            45: 'Fog', 48: 'Depositing rime fog',
            51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
            61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
            80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
            71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
            95: 'Thunderstorm'
        };
        return codes[code] || 'Unknown';
    };

    if (!lat || !lng) return null;
    if (loading) return <div title="Loading weather..."><Loader2 className="w-3 h-3 animate-spin text-slate-300" /></div>;
    if (error || !weather) return null;

    return (
        <div
            className="flex items-center gap-1.5 px-2 py-1 bg-white/50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm"
            title={`Forecast: ${weather.description}, High: ${weather.temperature}°F`}
        >
            {getWeatherIcon(weather.weatherCode)}
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {Math.round(weather.temperature)}°F
            </span>
        </div>
    );
};
