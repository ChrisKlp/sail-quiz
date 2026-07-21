import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { shuffle } from 'remeda';
import type { ExamResults, Question } from '@/types';
import { getAllQuestions, getQuestionsByCategory } from '@/lib/api';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

const EXAM_QUESTIONS_NUMBER = 75;

type QuizStatus = 'idle' | 'loading' | 'active' | 'finished';

type QuizMode = 'exam' | 'random' | 'category' | null;

interface QuizContextValue {
  status: QuizStatus;
  mode: QuizMode;
  question: Question | null;
  letters: string[];
  selected: string | null;
  hasAnswered: boolean;
  canGoPrev: boolean;

  results: ExamResults | null;

  currentIndex: number;
  totalQuestions: number;

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
  const [mode, setMode] = useState<QuizMode>(null);
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
    setMode('category');
    const data = await getQuestionsByCategory(categoryKey);
    initQuiz(data);
  };

  const startExam = async () => {
    setStatus('loading');
    setMode('exam');
    const data = await getAllQuestions();
    initQuiz(shuffle(data).slice(0, EXAM_QUESTIONS_NUMBER));
  };

  const startRandomAll = async () => {
    setStatus('loading');
    setMode('random');
    const data = await getAllQuestions();
    initQuiz(data);
  };

  const resetToMenu = () => {
    setStatus('idle');
    setMode(null);
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

  const results = useMemo(() => {
    if (status !== 'finished') return null;

    let correct = 0;
    let incorrect = 0;

    questions.forEach((q, index) => {
      const userAnswer = answersMap[index];
      if (userAnswer) {
        if (userAnswer.trim() === q.correct_answer.trim()) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const total = questions.length;
    const unanswered = total - correct - incorrect;

    const requiredToPass = total === EXAM_QUESTIONS_NUMBER ? 65 : Math.ceil(total * 0.85);
    const passed = correct >= requiredToPass;

    return { correct, incorrect, unanswered, total, passed };
  }, [status, questions, answersMap]);

  const value: QuizContextValue = {
    status,
    mode,
    question,
    letters,
    selected,
    hasAnswered: selected !== null,
    canGoPrev: pos > 0,

    results,

    currentIndex: pos,
    totalQuestions: questions.length,

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
