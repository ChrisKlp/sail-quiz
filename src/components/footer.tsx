import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ButtonVariant = 'default' | 'success' | 'destructive' | 'outline' | 'secondary';

export function Footer() {
  const {
    question,
    selected,
    hasAnswered,
    letters,
    isCorrect,
    handleSelect,
    handleNext,
    handlePrev,
    canGoPrev,
  } = useQuiz();

  if (!question) return null;

  return (
    <footer className='safe-bottom shrink-0 border-t border-border bg-card/80 px-4 pt-3 backdrop-blur'>
      <div className='rope-divider mb-3 -mt-3' />

      <div className='flex gap-2.5'>
        {letters.map((letter, i) => {
          const answer = question.answers[i];
          const isSelected = selected === answer;
          const isTheCorrectOne = isCorrect(answer);

          let variant: ButtonVariant = 'default';

          if (hasAnswered) {
            if (isSelected && isTheCorrectOne) {
              variant = 'success';
            } else if (isSelected && !isTheCorrectOne) {
              variant = 'destructive';
            } else if (isTheCorrectOne) {
              variant = 'success';
            } else {
              variant = 'outline';
            }
          }

          return (
            <Button
              key={letter}
              variant={variant}
              size='lg'
              disabled={hasAnswered && !isSelected}
              onClick={() => handleSelect(answer)}
              className={cn('flex-1 font-mono text-base')}
            >
              {letter}
            </Button>
          );
        })}
      </div>

      <div className='mt-2.5 flex gap-2.5 pb-3'>
        <Button
          variant='secondary'
          size='lg'
          onClick={handlePrev}
          disabled={!canGoPrev}
          className='flex-1'
        >
          <ChevronLeft className='h-4 w-4' />
          Poprzednie
        </Button>
        <Button
          variant='secondary'
          size='lg'
          onClick={handleNext}
          className='flex-1'
        >
          Następne
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </footer>
  );
}