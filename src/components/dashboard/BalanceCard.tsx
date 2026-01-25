import React from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

interface BalanceCardProps {
    balance: number;
    safeToSpend: number;
    currencySymbol?: string;
    forecastDays?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, safeToSpend, currencySymbol = '€', forecastDays = 30 }) => {
    return (
        <div className="bg-primary text-white p-6 rounded-2xl shadow-lg shadow-blue-900/20 mb-6">
            <div className="flex flex-col space-y-6">
                <div>
                    <p className="text-blue-100 text-xs font-medium mb-1">
                        Balance after {forecastDays} days (forecasted)
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight">
                        {currencySymbol} {balance.toLocaleString('en-IE', { minimumFractionDigits: 2 })}
                    </h2>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center space-x-2 mb-1">
                            <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-300" />
                            <span className="text-xs text-blue-100">Safe to Spend</span>
                        </div>
                        <p className="text-lg font-bold text-white">
                            {currencySymbol} {safeToSpend.toLocaleString('en-IE', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
