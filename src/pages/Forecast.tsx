import { useState, useEffect } from 'react';
import { AdjustmentsHorizontalIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { forecastService } from '../services/api/transactionService';
import { ForecastChart } from '../components/forecast/ForecastChart';
import { SafeModeToggle } from '../components/dashboard/SafeModeToggle';
import { useSettings } from '../contexts/SettingsContext';
import type { ForecastData } from '../types/transaction';

const Forecast = () => {
    const { settings, loading: settingsLoading } = useSettings();
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Local state for controls
    const [isSafeMode, setSafeMode] = useState(false);
    const [forecastDays, setForecastDays] = useState(30);
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        if (!settingsLoading && settings) {
            setSafeMode(settings.defaultSafeMode);
            setForecastDays(settings.forecastPeriod);
        }
    }, [settings, settingsLoading]);

    useEffect(() => {
        // Wait for settings to load
        if (settingsLoading) return;

        const fetchForecast = async () => {
            try {
                setLoading(true);
                setError(null);

                // TODO: Backend currently only accepts days, implies start from today. 
                // If we want custom start date, we might need backend update or filter locally.
                // For now, we implemented period and safe mode.
                const data = await forecastService.getForecast(forecastDays, isSafeMode, 0);
                setForecastData(data);

                // Transform for chart
                const chartPoints = data?.dailyBreakdown?.map(day => ({
                    date: day.date,
                    balance: day.closingBalance
                })) || [];
                setChartData(chartPoints);
            } catch (err) {
                console.error('Failed to fetch forecast:', err);
                setError('Failed to load forecast');
                setChartData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, [forecastDays, isSafeMode, settingsLoading]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount ?? 0);
    };

    // Find lowest balance day
    const lowestDay = chartData.length > 0
        ? chartData.reduce((lowest, day) => day.balance < lowest.balance ? day : lowest, chartData[0])
        : { balance: 0, date: '' };

    // Show loading while settings are loading
    if (settingsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Forecast</h1>
                        <p className="text-xs text-gray-500">Predicted cash flow</p>
                    </div>
                    <button
                        onClick={() => setShowControls(!showControls)}
                        className={`p-2 rounded-full ${showControls ? 'bg-blue-50 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <AdjustmentsHorizontalIcon className="w-6 h-6" />
                    </button>
                </div>

                {showControls && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100 animate-in slide-in-from-top-2">
                        <SafeModeToggle enabled={isSafeMode} onChange={setSafeMode} />

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                Forecast Period
                            </label>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-gray-400" />
                                <select
                                    value={forecastDays}
                                    onChange={(e) => setForecastDays(Number(e.target.value))}
                                    className="block w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                >
                                    {[7, 14, 30, 60, 90, 180, 365].map(days => (
                                        <option key={days} value={days}>{days} Days</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 col-span-2">
                                <h3 className="font-semibold text-blue-900 mb-1">Safe to Spend</h3>
                                <p className="text-3xl font-bold text-blue-700">
                                    {forecastData ? formatCurrency(forecastData.safeToSpend ?? 0) : '€0.00'}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Available after covering all upcoming expenses
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Lowest Balance</p>
                                <p className={`text-lg font-bold ${lowestDay.balance < (settings?.lowBalanceWarning ?? 500) ? 'text-red-500' : 'text-gray-900'}`}>
                                    {formatCurrency(lowestDay.balance)}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    on {lowestDay.date ? new Date(lowestDay.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' }) : 'N/A'}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Period End</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {chartData.length > 0
                                        ? formatCurrency(chartData[chartData.length - 1].balance)
                                        : '€0.00'}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    in {forecastDays} days
                                </p>
                            </div>
                        </div>

                        {forecastData?.warnings?.some(w => w.type === 'LOW_BALANCE') && (
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <h3 className="font-semibold text-amber-900">Low Balance Warning</h3>
                                    <p className="text-sm text-amber-700 mt-1">
                                        Your balance is projected to drop below {formatCurrency(settings?.lowBalanceWarning ?? 500)} within the next {forecastDays} days.
                                    </p>
                                </div>
                            </div>
                        )}

                        {!forecastData?.dailyBreakdown?.length && (
                            <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                                <p>No forecast data available.</p>
                                <p className="text-sm">Try adding some recurring transactions.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};


export default Forecast;
