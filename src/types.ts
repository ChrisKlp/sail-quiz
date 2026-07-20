export interface Question {
  id: number;
  question: string;
  answers: string[];
  correct_answer: string;
  image_url: string | null;
}

export type AnswerState = 'idle' | 'correct' | 'incorrect';
