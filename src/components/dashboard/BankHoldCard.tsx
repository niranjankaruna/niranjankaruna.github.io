import { BanknotesIcon } from '@heroicons/react/24/outline';
import type { BankHoldSummary } from '../../types/transaction';

interface BankHoldCardProps {
    data: BankHoldSummary[];
    forecastDays: number;
}

const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
};

export const BankHoldCard: React.FC<BankHoldCardProps> = ({ data, forecastDays }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">Minimum Balance to Hold</h3>
                    <span className="text-sm text-gray-500">{forecastDays} days</span>
                </div>
                <p className="text-gray-500 text-sm text-center py-4">
                    No expenses with assigned bank accounts in forecast period
                </p>
            </div>
        );
    }

    const totalHold = data.reduce((sum, b) => sum + b.minimumHold, 0);

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">Minimum Balance to Hold</h3>
                <span className="text-sm text-gray-500">{forecastDays} days</span>
            </div>

            <div className="space-y-3">
                {data.map((bank) => (
                    <div
                        key={bank.bankAccountId}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: bank.color || '#6366f1' }}
                            >
                                <BanknotesIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{bank.bankAccountName}</p>
                                <p className="text-xs text-gray-500">
                                    {bank.expenseCount} upcoming expense{bank.expenseCount !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-900">
                                {formatAmount(bank.minimumHold)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {data.length > 1 && (
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total to hold</span>
                    <span className="text-lg font-bold text-gray-900">{formatAmount(totalHold)}</span>
                </div>
            )}
        </div>
    );
};
