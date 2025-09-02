// src/lib/history.ts
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { Subject } from "./curriculum";

export interface QuizRecord {
    subject: Subject;
    topic: string;
    numQuestions: number;
    score: number;
    timestamp: any; // Firestore serverTimestamp
    userId: string;
}

export async function getQuizHistory(userId: string): Promise<Omit<QuizRecord, 'userId'>[]> {
    if (!userId) return [];
    
    const historyCollection = collection(db, 'quizHistory');
    const q = query(historyCollection, where("userId", "==", userId), orderBy("timestamp", "desc"));
    
    const querySnapshot = await getDocs(q);
    const history: Omit<QuizRecord, 'userId'>[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
            subject: data.subject,
            topic: data.topic,
            numQuestions: data.numQuestions,
            score: data.score,
            timestamp: data.timestamp
        });
    });
    return history;
}

export async function saveQuizResult(userId: string, result: Omit<QuizRecord, 'timestamp' | 'userId'>) {
    if (!userId) return;

    try {
        await addDoc(collection(db, 'quizHistory'), {
            ...result,
            userId: userId,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving quiz result: ", error);
    }
}
