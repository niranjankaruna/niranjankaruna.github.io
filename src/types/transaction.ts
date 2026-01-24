export type TransactionType = 'INCOME' | 'EXPENSE';
export type IncomeConfidence = 'GUARANTEED' | 'LIKELY';
export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    currencyCode: string;
    amountInBaseCurrency: number;
    description?: string;
    transactionDate: string; // ISO Date

    // Income
    confidence?: IncomeConfidence;

    // Expense
    isRecurring?: boolean;
    frequency?: RecurrenceFrequency;

    created_at?: string;
}

export interface CreateTransactionRequest {
    type: TransactionType;
    amount: number;
    currencyCode?: string; // default EUR
    description?: string;
    transactionDate: string;
    confidence?: IncomeConfidence;
    isRecurring?: boolean;
    frequency?: RecurrenceFrequency;
}
