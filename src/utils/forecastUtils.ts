import { addDays, format, getDate, parseISO, startOfDay } from 'date-fns';
import type { Transaction } from '../types/transaction';

interface DailyBalance {
    date: string;
    balance: number;
    income: number;
    expense: number;
}

export const calculateForecast = (
    currentBalance: number,
    transactions: Transaction[],
    days: number = 30
): DailyBalance[] => {
    const forecast: DailyBalance[] = [];
    let runningBalance = currentBalance;
    const today = startOfDay(new Date());

    // Simple recurring logic (Mock enhancement)
    // In real app, this parses recurrence rules strictly

    for (let i = 0; i < days; i++) {
        const currentDate = addDays(today, i);
        const dayOfMonth = getDate(currentDate);
        let dailyIncome = 0;
        let dailyExpense = 0;

        // Mock Recurring Rules applied here for demo
        // Salary on 25th
        if (dayOfMonth === 25) {
            dailyIncome += 4500;
        }

        // Rent on 1st
        if (dayOfMonth === 1) {
            dailyExpense += 1200;
        }

        // Apply known future transactions from list
        transactions.forEach(t => {
            const tDate = parseISO(t.transactionDate);
            if (format(tDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')) {
                if (t.type === 'INCOME') dailyIncome += t.amount;
                else dailyExpense += t.amount;
            }
        });

        runningBalance = runningBalance + dailyIncome - dailyExpense;

        forecast.push({
            date: format(currentDate, 'MMM dd'),
            balance: runningBalance,
            income: dailyIncome,
            expense: dailyExpense
        });
    }

    return forecast;
};
