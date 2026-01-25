import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuthStore } from '../store/authStore';
import { CurrencySettings } from '../components/settings/CurrencySettings';
import { BankAccountSettings } from '../components/settings/BankAccountSettings';
import { TagSettings } from '../components/settings/TagSettings';

const FORECAST_OPTIONS = [7, 14, 30, 60, 90];
const DATE_FORMAT_OPTIONS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
const THEME_OPTIONS = ['light', 'dark'];

export default function Settings() {
    const { settings, loading, updateSettings } = useSettings();
    const { user, signOut } = useAuthStore();

    const [forecastPeriod, setForecastPeriod] = useState(settings.forecastPeriod);
    const [defaultSafeMode, setDefaultSafeMode] = useState(settings.defaultSafeMode);
    const [lowBalanceWarning, setLowBalanceWarning] = useState(settings.lowBalanceWarning);
    const [theme, setTheme] = useState(settings.theme);
    const [dateFormat, setDateFormat] = useState(settings.dateFormat);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        setForecastPeriod(settings.forecastPeriod);
        setDefaultSafeMode(settings.defaultSafeMode);
        setLowBalanceWarning(settings.lowBalanceWarning);
        setTheme(settings.theme);
        setDateFormat(settings.dateFormat);
    }, [settings]);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            await updateSettings({
                forecastPeriod,
                defaultSafeMode,
                lowBalanceWarning,
                theme,
                dateFormat,
            });
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch {
            setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const [refreshKey, setRefreshKey] = useState(0);

    const handleCurrencyChange = () => {
        setRefreshKey(prev => prev + 1);
    };

    // ... handleSave ...

    return (
        <div className="max-w-2xl mx-auto p-6 pb-24 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

            {/* Profile Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>👤</span> Profile
                </h2>
                <div className="space-y-3">
                    <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {user?.email}
                    </p>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </section>

            {/* Financial Settings */}
            <CurrencySettings onDataChange={handleCurrencyChange} />
            <BankAccountSettings key={refreshKey} />
            <TagSettings />

            {/* Forecast Settings */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>📊</span> Forecast Settings
                </h2>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Forecast Period
                        </label>
                        <select
                            value={forecastPeriod}
                            onChange={(e) => setForecastPeriod(Number(e.target.value))}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {FORECAST_OPTIONS.map((days) => (
                                <option key={days} value={days}>
                                    {days} days
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-sm text-gray-500">Number of days to project ahead</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Default Safe Mode
                            </label>
                            <p className="text-sm text-gray-500">Start in safe mode by default</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDefaultSafeMode(!defaultSafeMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${defaultSafeMode ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${defaultSafeMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Low Balance Warning
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">€</span>
                            <input
                                type="number"
                                value={lowBalanceWarning}
                                onChange={(e) => setLowBalanceWarning(Number(e.target.value))}
                                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                min="0"
                                step="100"
                            />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Warn when balance drops below this amount</p>
                    </div>
                </div>
            </section>

            {/* Display Settings */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🎨</span> Display
                </h2>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                        </label>
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {THEME_OPTIONS.map((t) => (
                                <option key={t} value={t}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Format
                        </label>
                        <select
                            value={dateFormat}
                            onChange={(e) => setDateFormat(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {DATE_FORMAT_OPTIONS.map((format) => (
                                <option key={format} value={format}>
                                    {format}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Data Management */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>💾</span> Data Management
                </h2>
                <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                        Download a copy of your transaction history.
                    </p>
                    <button
                        onClick={async () => {
                            try {
                                const { exportService } = await import('../services/exportService');
                                await exportService.exportTransactionsToCSV();
                                setMessage({ type: 'success', text: 'Export started successfully!' });
                            } catch (e) {
                                setMessage({ type: 'error', text: 'Failed to export data.' });
                            }
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Transactions (CSV)
                    </button>
                </div>
            </section>

            {/* Message */}
            {message && (
                <div
                    className={`p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center justify-center gap-2"
            >
                {saving ? (
                    <>
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                        Saving...
                    </>
                ) : (
                    'Save Changes'
                )}
            </button>
        </div>
    );
}
