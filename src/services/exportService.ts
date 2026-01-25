import { transactionService } from './api/transactionService';

export const exportService = {
    exportTransactionsToCSV: async () => {
        try {
            const transactions = await transactionService.getAll();

            if (!transactions || transactions.length === 0) {
                alert('No transactions to export');
                return;
            }

            // Define headers
            const headers = ['Date', 'Type', 'Amount', 'Currency', 'Description', 'Category/Status'];

            // Map data to CSV rows
            const rows = transactions.map(t => [
                t.transactionDate,
                t.type,
                t.amount.toString(),
                t.currencyCode,
                `"${(t.description || '').replace(/"/g, '""')}"`, // Escape quotes
                t.type === 'INCOME' ? t.incomeStatus : t.expenseStatus
            ]);

            // Combine headers and rows
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `cashflow_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
            throw error;
        }
    }
};
