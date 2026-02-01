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

    // Get formatted month name and year (Short)
    const getMonthYear = (date: Date): string => {
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    };

    // Generate options for Current Month + Next 12 Months
    for (let i = 0; i <= 12; i++) {
        // Calculate target month
        // i=0 is current month, i=1 is next month, etc.
        const targetDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
        const targetMonthEnd = getLastDayOfMonth(targetDate.getFullYear(), targetDate.getMonth());
        const days = getDaysBetween(today, targetMonthEnd);
        const monthYear = getMonthYear(targetDate);

        let label = monthYear;
        if (i === 0) {
            label = `Current Month (${monthYear})`;
        } else if (i === 1) {
            label = `Next Month (${monthYear})`;
        }

        options.push({
            value: days,
            label: label,
            isDefault: i === 0
        });
    }

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
