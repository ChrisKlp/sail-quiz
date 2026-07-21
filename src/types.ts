export interface Question {
  id: number;
  question: string;
  answers: string[];
  correct_answer: string;
  image_url?: string;
}

export interface CategoryData {
  name: string;
  data: () => Promise<{ default: Question[] }>;
}

export interface ExamResults {
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
  passed: boolean;
}

export type AnswerState = 'idle' | 'correct' | 'incorrect';
