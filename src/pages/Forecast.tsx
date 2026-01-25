import { useState, useEffect } from 'react';
import { forecastService } from '../services/api/transactionService';
import { ForecastChart } from '../components/forecast/ForecastChart';
import { useSettings } from '../contexts/SettingsContext';
import type { ForecastData } from '../types/transaction';

const Forecast = () => {
    const { settings } = useSettings();
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await forecastService.getForecast(settings.forecastPeriod, false, 0);
                setForecastData(data);

                // Transform for chart
                const chartPoints = data.dailyForecasts?.map(day => ({
                    date: day.date,
                    balance: day.balance
                })) || [];
                setChartData(chartPoints);
            } catch (err) {
                console.error('Failed to fetch forecast:', err);
                setError('Failed to load forecast');
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, [settings.forecastPeriod]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    // Find lowest balance day
    const lowestDay = chartData.reduce((lowest, day) =>
        day.balance < lowest.balance ? day : lowest,
        chartData[0] || { balance: 0, date: '' }
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-900">Forecast</h1>
                <p className="text-xs text-gray-500">Predicted cash flow for {settings.forecastPeriod} days</p>
            </header>

            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                        {error}
                    </div>
                ) : (
                    <>
                        <ForecastChart data={chartData} />

                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-2">Insights</h3>
                            {chartData.length > 0 ? (
                                <p className="text-sm text-gray-600">
                                    Based on your transactions, your lowest balance will be{' '}
                                    <span className={`font-bold ${lowestDay.balance < settings.lowBalanceWarning ? 'text-red-500' : 'text-gray-900'}`}>
                                        {formatCurrency(lowestDay.balance)}
                                    </span>{' '}
                                    on <span className="font-medium">
                                        {new Date(lowestDay.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })}
                                    </span>.
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Add transactions to see insights about your cash flow.
                                </p>
                            )}
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <h3 className="font-semibold text-blue-900 mb-1">Safe to Spend</h3>
                            <p className="text-2xl font-bold text-blue-700">
                                {forecastData ? formatCurrency(forecastData.safeToSpend) : '€0.00'}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                Calculated as (Lowest Projected Balance - Safety Buffer)
                            </p>
                        </div>

                        {forecastData?.lowBalanceWarning && (
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                <h3 className="font-semibold text-amber-900 mb-1">⚠️ Low Balance Warning</h3>
                                <p className="text-sm text-amber-700">
                                    Your balance is projected to drop below {formatCurrency(settings.lowBalanceWarning)}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Forecast;
