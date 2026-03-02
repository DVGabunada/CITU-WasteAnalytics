const SURVEY_KEY = 'wasteAnalyticsSurveys';

export const getSurveyResponses = () => {
    const stored = localStorage.getItem(SURVEY_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const addSurveyResponse = (response) => {
    const responses = getSurveyResponses();
    const newResponse = {
        ...response,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
    };
    const updated = [...responses, newResponse];
    localStorage.setItem(SURVEY_KEY, JSON.stringify(updated));
    return updated;
};

export const clearSurveyResponses = () => {
    localStorage.removeItem(SURVEY_KEY);
};
