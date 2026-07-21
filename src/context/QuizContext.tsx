import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { shuffle } from 'remeda';
import type { Question } from '@/types';
import { getAllQuestions, getQuestionsByCategory } from '@/lib/api';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

type QuizStatus = 'idle' | 'loading' | 'active' | 'finished';

interface QuizContextValue {
  status: QuizStatus;
  question: Question | null;
  letters: string[];
  selected: string | null;
  hasAnswered: boolean;
  canGoPrev: boolean;

  isCorrect: (answer: string) => boolean;
  handleSelect: (answer: string) => void;
  handleNext: () => void;
  handlePrev: () => void;

  startCategory: (categoryKey: string) => Promise<void>;
  startExam: () => Promise<void>;
  startRandomAll: () => Promise<void>;
  resetToMenu: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<QuizStatus>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pos, setPos] = useState(0);

  const [answersMap, setAnswersMap] = useState<Record<number, string>>({});

  const question = questions[pos] || null;
  const selected = answersMap[pos] || null;

  const letters = useMemo(() => {
    if (!question) return [];
    return question.answers.map((_, i) => LETTERS[i] ?? '?');
  }, [question]);

  const initQuiz = (loadedQuestions: Question[]) => {
    setQuestions(shuffle(loadedQuestions));
    setPos(0);
    setAnswersMap({});
    setStatus('active');
  };

  const startCategory = async (categoryKey: string) => {
    setStatus('loading');
    const data = await getQuestionsByCategory(categoryKey);
    initQuiz(data);
  };

  const startExam = async () => {
    setStatus('loading');
    const data = await getAllQuestions();
    initQuiz(shuffle(data).slice(0, 75));
  };

  const startRandomAll = async () => {
    setStatus('loading');
    const data = await getAllQuestions();
    initQuiz(data);
  };

  const resetToMenu = () => {
    setStatus('idle');
    setQuestions([]);
    setAnswersMap({});
    setPos(0);
  };

  function handleSelect(answer: string) {
    if (selected) return;
    setAnswersMap((prev) => ({ ...prev, [pos]: answer }));
  }

  function handleNext() {
    if (pos + 1 >= questions.length) {
      setStatus('finished');
    } else {
      setPos((p) => p + 1);
    }
  }

  function handlePrev() {
    if (pos > 0) setPos((p) => p - 1);
  }

  const isCorrect = (answer: string) => {
    if (!question) return false;
    return answer.trim() === question.correct_answer.trim();
  };

  const value: QuizContextValue = {
    status,
    question,
    letters,
    selected,
    hasAnswered: selected !== null,
    canGoPrev: pos > 0,
    isCorrect,
    handleSelect,
    handleNext,
    handlePrev,
    startCategory,
    startExam,
    startRandomAll,
    resetToMenu,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within a QuizProvider');
  return ctx;
}
