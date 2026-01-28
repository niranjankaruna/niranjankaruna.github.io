import type { TransactionType, IncomeConfidence, RecurrenceFrequency } from './transaction';

export interface RecurringRule {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    currencyCode: string;
    description: string;
    frequency: RecurrenceFrequency;
    startDate: string;
    lastRunDate?: string;
    reminderDays: number;
    active: boolean;

    // Linked Data
    bankAccountId?: string;
    tags?: any[]; // Simplified for now, or use Tag[] if available
    tagIds?: string[]; // For forms

    confidence?: IncomeConfidence;

    createdAt: string;
    updatedAt: string;
}

export interface CreateRecurringRuleRequest {
    type: TransactionType;
    amount: number;
    currencyCode: string;
    description: string;
    frequency: RecurrenceFrequency;
    startDate: string;
    reminderDays?: number;
    active: boolean;
    bankAccountId?: string;
    tagIds?: string[]; // To update tags
    confidence?: IncomeConfidence;
}
