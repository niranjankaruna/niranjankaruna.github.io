/**
 * Generates forecast period options with dynamic month-based calculations.
 * Current date is: 2026-02-01 (example)
 * - Current Month (February): from today to Feb 28 = X days
 * - Next Month (March): from today to Mar 31 = Y days
 * - Next to Next Month (April): from today to Apr 30 = Z days
 */

interface ForecastOption {
    value: number;
    label: string;
    isDefault?: boolean;
}

export function generateForecastOptions(): ForecastOption[] {
    const today = new Date();
    const options: ForecastOption[] = [];

    // Helper to get last day of a month
    const getLastDayOfMonth = (year: number, month: number): Date => {
        return new Date(year, month + 1, 0); // Day 0 of next month = last day of current month
    };

    // Helper to get days between two dates (inclusive of end date)
    const getDaysBetween = (start: Date, end: Date): number => {
        const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        const diffTime = endDate.getTime() - startDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include end date
    };

    // Get month name
    const getMonthName = (date: Date): string => {
        return date.toLocaleString('en-US', { month: 'long' });
    };

    // Current month
    const currentMonthEnd = getLastDayOfMonth(today.getFullYear(), today.getMonth());
    const currentMonthDays = getDaysBetween(today, currentMonthEnd);
    const currentMonthName = getMonthName(today);

    // Next month
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthEnd = getLastDayOfMonth(nextMonth.getFullYear(), nextMonth.getMonth());
    const nextMonthDays = getDaysBetween(today, nextMonthEnd);
    const nextMonthName = getMonthName(nextMonth);

    // Next to next month
    const nextNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    const nextNextMonthEnd = getLastDayOfMonth(nextNextMonth.getFullYear(), nextNextMonth.getMonth());
    const nextNextMonthDays = getDaysBetween(today, nextNextMonthEnd);
    const nextNextMonthName = getMonthName(nextNextMonth);

    // Add month-based options first
    options.push({
        value: currentMonthDays,
        label: `Current Month (${currentMonthName})`,
        isDefault: true
    });

    options.push({
        value: nextMonthDays,
        label: `Next Month (${nextMonthName})`
    });

    options.push({
        value: nextNextMonthDays,
        label: `Next to Next Month (${nextNextMonthName})`
    });

    // Add fixed day options
    const fixedOptions = [7, 14, 30, 60, 90, 120, 180, 365];
    fixedOptions.forEach(days => {
        options.push({
            value: days,
            label: `${days} days`
        });
    });

    return options;
}

// Get the default forecast days (current month)
export function getDefaultForecastDays(): number {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = lastDayOfMonth.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}
