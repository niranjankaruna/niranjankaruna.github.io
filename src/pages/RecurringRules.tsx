import { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { recurringRuleService } from '../services/api/recurringRuleService';
import { RecurringRuleForm } from '../components/recurring/RecurringRuleForm';
import type { RecurringRule } from '../types/recurringRule';

const RecurringRules = () => {
    const [rules, setRules] = useState<RecurringRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<RecurringRule | null>(null);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const data = await recurringRuleService.getAll();
            setRules(data);
        } catch (error) {
            console.error('Failed to fetch rules', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleProcess = async () => {
        try {
            await recurringRuleService.processDue();
            alert('Due rules processed successfully');
            fetchRules();
        } catch (error) {
            console.error('Failed to process rules', error);
        }
    };

    const handleCreate = () => {
        setSelectedRule(null);
        setIsFormOpen(true);
    };

    const handleEdit = (rule: RecurringRule) => {
        setSelectedRule(rule);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this rule?')) {
            try {
                await recurringRuleService.delete(id);
                fetchRules();
            } catch (error) {
                console.error('Failed to delete rule', error);
            }
        }
    };

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <header className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Recurring Rules</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleProcess}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                        title="Process Due Rules"
                    >
                        <ArrowPathIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleCreate}
                        className="p-2 bg-primary text-white rounded-full shadow-md hover:bg-blue-600"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : rules.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No recurring rules found.</p>
                        <p className="text-sm">Create one to automate your transactions.</p>
                    </div>
                ) : (
                    rules.map(rule => (
                        <div key={rule.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{rule.description}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Intl.NumberFormat('en-IE', { style: 'currency', currency: rule.currencyCode }).format(rule.amount)} • {rule.frequency}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Next run: {rule.nextRunDate || 'Finished'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {rule.active ? 'Active' : 'Inactive'}
                                    </span>
                                    <button onClick={() => handleEdit(rule)} className="text-gray-400 hover:text-primary">
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(rule.id)} className="text-gray-400 hover:text-red-500">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <RecurringRuleForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={fetchRules}
                initialData={selectedRule}
            />
        </div>
    );
};

export default RecurringRules;
