import {
  Anchor,
  Check,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { questions } from './data/questions';
import { useState, useMemo, useEffect } from 'react';
import { cn } from './lib/utils';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

/** Fisher–Yates */
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
  // unika bezpośredniego powtórzenia tego samego pytania na styku cykli
  if (cycle.length > 1 && cycle[0] === excludeFirstIndex) {
    [cycle[0], cycle[1]] = [cycle[1], cycle[0]];
  }
  return cycle;
}

type AnswerState = 'idle' | 'correct' | 'incorrect';

export default function App() {
  // `order` to historia sesji: kolejność indeksów pytań (bez powtórzeń w obrębie cyklu).
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(questions.map((_, i) => i)),
  );
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [brokenImage, setBrokenImage] = useState(false);

  const question = questions[order[pos]];
  const letters = useMemo(
    () => question.answers.map((_, i) => LETTERS[i] ?? '?'),
    [question],
  );

  useEffect(() => {
    setSelected(null);
    setBrokenImage(false);
  }, [pos, order]);

  function handleSelect(answer: string) {
    if (selected) return; // odpowiedź już udzielona — blokujemy zmianę
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

  const isCorrect = (answer: string) => answer === question.correct_answer;
  const hasAnswered = selected !== null;

  return (
    <div className='flex h-dvh flex-col overflow-hidden bg-background'>
      {/* HEADER */}
      <header className='safe-top shrink-0 border-b border-border bg-card/60 px-4 py-3 backdrop-blur'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary'>
              <Anchor className='h-4 w-4' strokeWidth={2.25} />
            </span>
            <div className='leading-tight'>
              <p className='font-display text-sm font-semibold tracking-wide text-foreground'>
                Patent Żeglarza
              </p>
              <p className='text-[11px] text-muted-foreground'>
                Quiz teoretyczny
              </p>
            </div>
          </div>
          <span className='rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono text-xs text-muted-foreground'>
            #{String(question.id).padStart(3, '0')}
          </span>
        </div>
      </header>

      {/* TREŚĆ — przewijalna, aby przyciski zawsze były widoczne */}
      <main className='no-scrollbar flex-1 overflow-y-auto px-4 py-5'>
        <h1 className='font-display text-[1.375rem] font-semibold leading-snug text-foreground'>
          {question.question}
        </h1>

        {question.image_url && !brokenImage && (
          <Card className='mt-4 overflow-hidden'>
            <img
              src={question.image_url}
              alt=''
              onError={() => setBrokenImage(true)}
              className='block max-h-64 w-full object-contain bg-secondary/30'
            />
          </Card>
        )}
        {question.image_url && brokenImage && (
          <Card className='mt-4 flex items-center gap-2 px-4 py-6 text-muted-foreground'>
            <ImageOff className='h-4 w-4 shrink-0' />
            <span className='text-sm'>
              Nie udało się wczytać grafiki do tego pytania.
            </span>
          </Card>
        )}

        <div className='mt-5 flex flex-col gap-2.5'>
          {question.answers.map((answer, i) => {
            const letter = letters[i];
            const showState =
              hasAnswered && (answer === selected || isCorrect(answer));
            const state: AnswerState = !hasAnswered
              ? 'idle'
              : isCorrect(answer)
                ? 'correct'
                : answer === selected
                  ? 'incorrect'
                  : 'idle';

            return (
              <div
                key={letter}
                className={cn(
                  'flex items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors duration-200',
                  state === 'idle' && 'border-border bg-card',
                  state === 'correct' && 'border-success/60 bg-success/15',
                  state === 'incorrect' &&
                    'border-destructive/60 bg-destructive/15',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold',
                    state === 'idle' && 'bg-secondary text-muted-foreground',
                    state === 'correct' && 'bg-success text-success-foreground',
                    state === 'incorrect' &&
                      'bg-destructive text-destructive-foreground',
                  )}
                >
                  {letter}
                </span>
                <span className='pt-0.5 text-sm leading-snug text-foreground/90'>
                  {answer}
                </span>
                {showState && state === 'correct' && (
                  <Check className='ml-auto mt-0.5 h-4 w-4 shrink-0 text-success' />
                )}
                {showState && state === 'incorrect' && (
                  <X className='ml-auto mt-0.5 h-4 w-4 shrink-0 text-destructive' />
                )}
              </div>
            );
          })}
        </div>

        {hasAnswered && selected && (
          <p
            className={cn(
              'mt-4 rounded-lg px-3.5 py-2.5 text-sm font-medium',
              isCorrect(selected)
                ? 'bg-success/15 text-success'
                : 'bg-destructive/15 text-destructive',
            )}
          >
            {isCorrect(selected)
              ? 'Poprawna odpowiedź!'
              : `Niepoprawnie. Poprawna odpowiedź: ${question.correct_answer}`}
          </p>
        )}
      </main>

      {/* STOPKA — wybór odpowiedzi + nawigacja, zawsze widoczna */}
      <footer className='safe-bottom shrink-0 border-t border-border bg-card/80 px-4 pt-3 backdrop-blur'>
        <div className='rope-divider mb-3 -mt-3' />

        <div className='flex gap-2.5'>
          {letters.map((letter, i) => {
            const answer = question.answers[i];
            const isSelected = selected === answer;
            const isTheCorrectOne = isCorrect(answer);
            const variant = !hasAnswered
              ? 'outline'
              : isTheCorrectOne
                ? 'success'
                : isSelected
                  ? 'destructive'
                  : 'outline';

            return (
              <Button
                key={letter}
                variant={variant}
                size='lg'
                disabled={hasAnswered && !isSelected && !isTheCorrectOne}
                onClick={() => handleSelect(answer)}
                className={cn(
                  'flex-1 font-mono text-base',
                  hasAnswered &&
                    !isSelected &&
                    !isTheCorrectOne &&
                    'opacity-30',
                )}
              >
                {letter}
              </Button>
            );
          })}
        </div>

        <div className='mt-2.5 flex gap-2.5 pb-3'>
          <Button
            variant='ghost'
            size='default'
            onClick={handlePrev}
            disabled={pos === 0}
            className='flex-1'
          >
            <ChevronLeft className='h-4 w-4' />
            Poprzednie
          </Button>
          <Button
            variant='default'
            size='default'
            onClick={handleNext}
            className='flex-1'
          >
            Następne
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </footer>
    </div>
  );
}
