import type { AnswerState } from '@/types';
import { Card } from '@/components/ui/card';
import { Check, ImageOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useQuiz } from '@/context/QuizContext';

export function Quiz() {
  const { question, letters, selected, hasAnswered, isCorrect } = useQuiz();
  const [brokenImage, setBrokenImage] = useState(false);

  useEffect(() => {
    setBrokenImage(false);
  }, [question]);

  if (!question) return null;

  return (
    <main className='no-scrollbar flex-1 overflow-y-auto px-4 py-5'>
      <h1 className='font-display text-[1.375rem] font-semibold leading-snug text-foreground'>
        {question.question}
      </h1>

      {question.image_url && !brokenImage && (
        <Card className='mt-4 overflow-hidden'>
          <img
            key={question.id}
            src={`/assets/${question.image_url}`}
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
              <span className='pt-0.5 text-sm text-foreground/90 flex-1'>
                {answer}
              </span>
              <div className='self-center pl-2'>
                {showState && state === 'correct' && (
                  <Check className='ml-auto mt-0.5 h-4 w-4 shrink-0 text-success' />
                )}
                {showState && state === 'incorrect' && (
                  <X className='ml-auto mt-0.5 h-4 w-4 shrink-0 text-destructive' />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
