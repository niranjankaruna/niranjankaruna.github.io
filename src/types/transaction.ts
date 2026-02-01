export type TransactionType = 'INCOME' | 'EXPENSE';
export type IncomeConfidence = 'GUARANTEED' | 'LIKELY';
export type IncomeStatus = 'PENDING' | 'RECEIVED' | 'CANCELLED';
export type ExpenseStatus = 'UPCOMING' | 'PAID' | 'SKIPPED';
export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';

export interface RecurringRule {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    currencyCode: string;
    description?: string;
    frequency: RecurrenceFrequency;
    startDate: string;
    lastRunDate?: string;
    reminderDays?: number;
    active: boolean;
    isEndOfMonth?: boolean;
    bankAccountId?: string;
    tagIds?: string[];
}

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    currencyCode: string;
    amountInBaseCurrency: number;
    description?: string;
    transactionDate: string;
    actualDate?: string;
    exchangeRate?: number;
    originalAmount?: number;
    originalCurrencyCode?: string;

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
    isEndOfMonth?: boolean;
    frequency?: RecurrenceFrequency;
    reminderDays?: number;
    bankAccountId?: string;
    tagIds?: string[];
    exchangeRate?: number;
    originalAmount?: number;
    originalCurrencyCode?: string;
}

export interface ForecastData {
    forecastDays: number;
    safeMode: boolean;
    startingBalance: number;
    projectedBalance: number;
    totalGuaranteedIncome: number;
    totalLikelyIncome: number;
    totalExpenses: number;
    safeToSpend: number;
    dailyBreakdown: DailyBreakdown[];
    warnings: ForecastWarning[];
    bankHoldSummary?: BankHoldSummary[];
}

export interface DailyBreakdown {
    date: string;
    openingBalance: number;
    closingBalance: number;
    income: TransactionSummary[];
    expenses: TransactionSummary[];
}

export interface TransactionSummary {
    description: string;
    amount: number;
    confidence?: string;
    isRecurring: boolean;
    bankAccountId?: string;
    bankAccountName?: string;
    tagNames?: string[];
    transactionDate?: string;
}

export interface ForecastWarning {
    date: string;
    type: string;
    message: string;
    projectedBalance: number;
}

export interface BankHoldSummary {
    bankAccountId: string;
    bankAccountName: string;
    color?: string;
    minimumHold: number;
    expenseCount: number;
    transactions?: TransactionSummary[];
}
