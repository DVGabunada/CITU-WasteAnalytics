import { mockTransactions } from './mockData';

const STORAGE_KEY = 'wasteAnalyticsData';

export const getTransactions = () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
        // Initialize with default mock data so the dashboard is populated
        // We use the imported mockTransactions which are generated relative to 'today'
        const initialData = mockTransactions;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        return initialData;
    }
    return JSON.parse(storedData);
};

export const addTransaction = (transaction) => {
    const transactions = getTransactions();
    // Ensure the new transaction is added
    const newTransactions = [...transactions, transaction];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTransactions));
    return newTransactions;
};

export const clearTransactions = () => {
    localStorage.removeItem(STORAGE_KEY);
};
