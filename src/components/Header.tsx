import { useQuiz } from '@/context/QuizContext';
import { Menu, Sailboat } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { question, status, mode, resetToMenu, currentIndex, totalQuestions } =
    useQuiz();

  return (
    <header className='safe-top shrink-0 border-b border-border bg-card/60 px-4 py-3 backdrop-blur'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {status !== 'idle' && (
            <Button
              variant='ghost'
              size='icon'
              className='-ml-2 h-9 w-9 text-muted-foreground hover:text-foreground'
              onClick={resetToMenu}
              title='Otwórz menu'
            >
              <Menu className='h-5 w-5' />
            </Button>
          )}

          <div className='flex items-center gap-2'>
            <span className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary'>
              <Sailboat className='h-4 w-4' strokeWidth={2.25} />
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
        </div>

        <div className='flex items-center'>
          {question && mode === 'exam' && (
            <span className='rounded-md border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs font-medium text-muted-foreground'>
              {currentIndex + 1} / {totalQuestions}
            </span>
          )}

          {question && mode !== 'exam' && (
            <span className='rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono text-xs text-muted-foreground'>
              #{String(question.id).padStart(3, '0')}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
