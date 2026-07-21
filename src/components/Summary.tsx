import { useQuiz } from '@/context/QuizContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckCircle,
  XCircle,
  Home,
  Trophy,
  Frown,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Summary() {
  const { results, mode, resetToMenu } = useQuiz();

  if (!results) return null;

  const { correct, incorrect, unanswered, total, passed } = results;

  return (
    <main className='flex-1 overflow-y-auto p-6 animate-in fade-in duration-500 flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center text-center mb-8'>
        <div
          className={cn(
            'mb-4 flex h-20 w-20 items-center justify-center rounded-full',
            passed
              ? 'bg-success/20 text-success'
              : 'bg-destructive/20 text-destructive',
          )}
        >
          {passed ? (
            <Trophy className='h-10 w-10' />
          ) : (
            <Frown className='h-10 w-10' />
          )}
        </div>

        <h1 className='font-display text-3xl font-bold text-foreground'>
          {passed ? 'Gratulacje, zdałeś!' : 'Niestety, nie zdano'}
        </h1>
        <p className='mt-2 text-muted-foreground max-w-sm'>
          {mode === 'exam'
            ? 'Aby zdać egzamin na patent żeglarza jachtowego musisz uzyskać minimum 65 poprawnych odpowiedzi z 75.'
            : 'Oto podsumowanie Twojej dzisiejszej nauki.'}
        </p>
      </div>

      <Card className='w-full max-w-sm p-5 space-y-4 shadow-sm border-border/50'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <CheckCircle className='h-5 w-5 text-success' />
            <span className='text-foreground font-medium'>Poprawne</span>
          </div>
          <span className='text-lg font-bold text-success'>{correct}</span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <XCircle className='h-5 w-5 text-destructive' />
            <span className='text-foreground font-medium'>Błędne</span>
          </div>
          <span className='text-lg font-bold text-destructive'>
            {incorrect}
          </span>
        </div>

        {unanswered > 0 && (
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <HelpCircle className='h-5 w-5 text-muted-foreground' />
              <span className='text-foreground font-medium'>Pominięte</span>
            </div>
            <span className='text-lg font-bold text-muted-foreground'>
              {unanswered}
            </span>
          </div>
        )}

        <div className='pt-4 mt-2 border-t border-border flex items-center justify-between'>
          <span className='text-sm text-muted-foreground uppercase tracking-wider font-semibold'>
            Wynik
          </span>
          <span className='font-mono text-xl font-bold'>
            {correct}{' '}
            <span className='text-muted-foreground text-base font-sans font-normal'>
              / {total}
            </span>
          </span>
        </div>
      </Card>

      <div className='mt-8 w-full max-w-sm'>
        <Button
          size='lg'
          className='w-full h-14 text-base'
          onClick={resetToMenu}
        >
          <Home className='mr-2 h-5 w-5' />
          Wróć do menu głównego
        </Button>
      </div>
    </main>
  );
}
