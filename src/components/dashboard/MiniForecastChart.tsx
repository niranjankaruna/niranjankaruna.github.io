import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { DailyForecast } from '../../types/transaction';

interface MiniForecastChartProps {
    data: DailyForecast[];
    safeMode: boolean;
}

export const MiniForecastChart: React.FC<MiniForecastChartProps> = ({ data }) => {
    // Transform data for chart
    const chartData = data.map(d => ({
        date: new Date(d.date).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' }),
        balance: d.balance
    }));

    if (chartData.length === 0) return null;

    const startBalance = chartData[0].balance;
    const endBalance = chartData[chartData.length - 1].balance;
    const isPositiveTrend = endBalance >= startBalance;

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">30 Day Forecast</h3>
                <span className={`text-sm font-medium ${isPositiveTrend ? 'text-green-600' : 'text-red-500'}`}>
                    {isPositiveTrend ? 'Trending Up' : 'Trending Down'}
                </span>
            </div>
            <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            hide
                        />
                        <YAxis
                            hide
                            domain={['auto', 'auto']}
                        />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="#2563EB"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
