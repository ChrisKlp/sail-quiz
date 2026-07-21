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

export type AnswerState = 'idle' | 'correct' | 'incorrect';
