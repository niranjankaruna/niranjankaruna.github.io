import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeftIcon, BellAlertIcon, BanknotesIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { reminderService } from '../services/api/reminderService';
import type { ReminderResponse } from '../types/reminder';

const Reminders = () => {
    const [reminders, setReminders] = useState<ReminderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                setLoading(true);
                const data = await reminderService.getUpcoming(30); // Get next 30 days
                setReminders(data);
            } catch (err) {
                console.error('Failed to fetch reminders:', err);
                setError('Failed to load reminders');
            } finally {
                setLoading(false);
            }
        };

        fetchReminders();
    }, []);

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center">
                <NavLink to="/" className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
                    <ChevronLeftIcon className="w-6 h-6" />
                </NavLink>
                <h1 className="text-lg font-bold text-gray-900 ml-2">Payment Reminders</h1>
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
                ) : reminders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm p-8">
                        <BellAlertIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900">No Upcoming Payments</h3>
                        <p className="text-sm mt-2">You don't have any bills due in the next 30 days.</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <BellAlertIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        You have {reminders.length} payments due in the next 30 days totaling{' '}
                                        <span className="font-bold">
                                            {formatAmount(
                                                reminders.reduce((sum, r) => sum + r.amount, 0),
                                                'EUR' // Assuming EUR totals for simplicity or mix
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {reminders.map((reminder) => (
                                <div key={reminder.ruleId + reminder.dueDate} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-400">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{reminder.description}</h3>
                                            <p className="text-sm text-gray-500 flex items-center mt-1">
                                                <CalendarIcon className="w-4 h-4 mr-1" />
                                                Due: {formatDate(reminder.dueDate)}
                                                {reminder.daysUntilDue <= 3 && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                        Due Soon
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <span className="font-bold text-gray-900 text-lg">
                                            {formatAmount(reminder.amount, reminder.currencyCode)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <BanknotesIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                                            {reminder.bankAccountName ? (
                                                <span>Pay from: <span className="font-medium text-gray-900">{reminder.bankAccountName}</span></span>
                                            ) : (
                                                <span className="italic text-gray-400">No bank account linked</span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                        {reminder.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Reminders;
