// src/lib/history.ts
import type { Subject, Week } from "./curriculum";

const HISTORY_KEY = 'quizWhizHistory';

export interface QuizRecord {
    subject: Subject;
    week: Week<Subject>;
    topic: string;
    numQuestions: number;
    score: number;
    timestamp: number;
}

export function getQuizHistory(): QuizRecord[] {
    if (typeof window === 'undefined') return [];
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
}

export function saveQuizResult(result: Omit<QuizRecord, 'timestamp'>) {
    if (typeof window === 'undefined') return;
    const history = getQuizHistory();
    const newRecord: QuizRecord = {
        ...result,
        timestamp: Date.now()
    };
    history.unshift(newRecord); // Add to the beginning
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
