export const formatDate = (dateString: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    if (!dateString) return '';
    const date = new Date(dateString);

    // Check for invalid date
    if (isNaN(date.getTime())) return '';

    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric', // Enforce Year
        ...options
    };

    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

export const formatCurrency = (amount: number, currency = 'EUR'): string => {
    return new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

export const toLocalISOString = (date: Date): string => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};
