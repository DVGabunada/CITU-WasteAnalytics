import { offices } from './offices';
import { wasteCategories } from './wasteCategories';
import { sub, format, eachDayOfInterval } from 'date-fns';

export const generateMockData = () => {
    const data = [];
    const today = new Date();
    const last30Days = eachDayOfInterval({
        start: sub(today, { days: 365 }),
        end: today
    });

    last30Days.forEach(date => {
        // Generate 5-10 entries per day
        const entriesCount = Math.floor(Math.random() * 6) + 5;

        for (let i = 0; i < entriesCount; i++) {
            const office = offices[Math.floor(Math.random() * offices.length)];
            const category = wasteCategories[Math.floor(Math.random() * wasteCategories.length)];

            // Weight between 0.5kg and 15kg
            const weight = Number((Math.random() * 14.5 + 0.5).toFixed(2));

            data.push({
                id: `${format(date, 'yyyyMMdd')}-${i}`,
                date: format(date, 'yyyy-MM-dd'),
                officeId: office.id,
                officeName: office.name,
                category: category.name,
                weight: weight,
                unit: 'kg'
            });
        }
    });

    return data;
};

export const mockTransactions = generateMockData();
