export type TransactionType = 'INCOME' | 'EXPENSE';
export type IncomeConfidence = 'GUARANTEED' | 'LIKELY';
export type IncomeStatus = 'PENDING' | 'RECEIVED' | 'CANCELLED';
export type ExpenseStatus = 'UPCOMING' | 'PAID' | 'SKIPPED';
export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    currencyCode: string;
    amountInBaseCurrency: number;
    description?: string;
    transactionDate: string;
    actualDate?: string;

    // Income fields
    confidence?: IncomeConfidence;
    incomeStatus?: IncomeStatus;

    // Expense fields
    expenseStatus?: ExpenseStatus;
    isRecurring?: boolean;
    frequency?: RecurrenceFrequency;
    reminderDays?: number;
    bankAccountId?: string;

    // Tags
    tagIds?: string[];

    createdAt?: string;
    updatedAt?: string;
}

export interface CreateTransactionRequest {
    type: TransactionType;
    amount: number;
    currencyCode?: string;
    description?: string;
    transactionDate: string;

    // Income
    confidence?: IncomeConfidence;
    incomeStatus?: IncomeStatus;

    // Expense
    expenseStatus?: ExpenseStatus;
    isRecurring?: boolean;
    frequency?: RecurrenceFrequency;
    endDate?: string;
    reminderDays?: number;
    bankAccountId?: string;
    tagIds?: string[];
}

export interface ForecastData {
    startDate: string;
    endDate: string;
    projectedBalance: number;
    safeToSpend: number;
    lowBalanceWarning: boolean;
    dailyForecasts: DailyForecast[];
}

export interface DailyForecast {
    date: string;
    balance: number;
    income: number;
    expenses: number;
    transactions: Transaction[];
}
