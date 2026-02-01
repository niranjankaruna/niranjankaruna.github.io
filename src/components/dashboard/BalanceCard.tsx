import React from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

interface BalanceCardProps {
    startingBalance: number;
    projectedBalance: number;
    safeToSpend: number;
    currencySymbol?: string;
    forecastDays?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
    startingBalance,
    projectedBalance,
    safeToSpend,
    currencySymbol = '€',
    forecastDays = 30
}) => {
    return (
        <div className="bg-primary text-white p-6 rounded-2xl shadow-lg shadow-blue-900/20 mb-6">
            <div className="flex flex-col space-y-6">
                <div>
                    <p className="text-blue-100 text-xs font-medium mb-1">
                        Current Balance(after todays's expense)
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight">
                        {currencySymbol} {startingBalance.toLocaleString('en-IE', { minimumFractionDigits: 2 })}
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Safe to Spend */}
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center space-x-2 mb-1">
                            <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-300" />
                            <span className="text-xs text-blue-100">Safe to Spend</span>
                        </div>
                        <p className="text-lg font-bold text-white">
                            {currencySymbol} {safeToSpend.toLocaleString('en-IE', { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Forecasted Balance */}
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs text-blue-100">
                                {(() => {
                                    const today = new Date();
                                    const endDate = new Date(today);
                                    endDate.setDate(today.getDate() + forecastDays - 1);
                                    if (endDate.toDateString() === today.toDateString()) {
                                        return "Till Today";
                                    }
                                    return `Till ${endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
                                })()}
                            </span>
                        </div>
                        <p className="text-lg font-bold text-white">
                            {currencySymbol} {projectedBalance.toLocaleString('en-IE', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
