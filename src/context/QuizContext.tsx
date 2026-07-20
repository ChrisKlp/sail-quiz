import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { questions } from '@/data/questions';
import type { Question } from '@/types';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function newCycle(excludeFirstIndex: number): number[] {
  const cycle = shuffle(questions.map((_, i) => i));
  if (cycle.length > 1 && cycle[0] === excludeFirstIndex) {
    [cycle[0], cycle[1]] = [cycle[1], cycle[0]];
  }
  return cycle;
}

interface QuizContextValue {
  question: Question;
  letters: string[];
  selected: string | null;
  hasAnswered: boolean;
  isCorrect: (answer: string) => boolean;
  handleSelect: (answer: string) => void;
  handleNext: () => void;
  handlePrev: () => void;
  canGoPrev: boolean;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(questions.map((_, i) => i)),
  );
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const question = questions[order[pos]];
  const letters = useMemo(
    () => question.answers.map((_, i) => LETTERS[i] ?? '?'),
    [question],
  );

  useEffect(() => {
    setSelected(null);
  }, [pos, order]);

  function handleSelect(answer: string) {
    if (selected) return;
    setSelected(answer);
  }

  function handleNext() {
    if (pos + 1 >= order.length) {
      setOrder((prev) => [...prev, ...newCycle(prev[prev.length - 1])]);
    }
    setPos((p) => p + 1);
  }

  function handlePrev() {
    if (pos > 0) setPos((p) => p - 1);
  }

  const isCorrect = (answer: string) =>
    answer.trim() === question.correct_answer.trim();
  const hasAnswered = selected !== null;

  const value: QuizContextValue = {
    question,
    letters,
    selected,
    hasAnswered,
    isCorrect,
    handleSelect,
    handleNext,
    handlePrev,
    canGoPrev: pos > 0,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within a QuizProvider');
  return ctx;
}
