export interface ReminderResponse {
    ruleId: string;
    description: string;
    amount: number;
    currencyCode: string;
    dueDate: string;
    daysUntilDue: number;
    bankAccountName?: string;
    message: string;
}
