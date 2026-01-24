import { useState, useEffect } from 'react';
import { calculateForecast } from '../utils/forecastUtils';
import { ForecastChart } from '../components/forecast/ForecastChart';

const Forecast = () => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Mock init
        const currentBalance = 5240;
        const forecastData = calculateForecast(currentBalance, []);
        setData(forecastData);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-900">Forecast</h1>
                <p className="text-xs text-gray-500">Predicted cash flow</p>
            </header>

            <div className="p-4 space-y-4">
                <ForecastChart data={data} />

                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Insights</h3>
                    <p className="text-sm text-gray-600">
                        Based on your recurring expenses, your lowest balance will be <span className="text-red-500 font-bold">€3,400</span> on <span className="font-medium">Feb 24</span>.
                    </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="font-semibold text-blue-900 mb-1">Safe to Spend</h3>
                    <p className="text-2xl font-bold text-blue-700">€1,800.00</p>
                    <p className="text-xs text-blue-600 mt-1">Calculated as (Lowest Projected Balance - Safety Buffer)</p>
                </div>
            </div>
        </div>
    );
};

export default Forecast;
