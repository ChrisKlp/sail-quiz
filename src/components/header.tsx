import { useQuiz } from '@/context/QuizContext';
import { Anchor, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { question, status, resetToMenu } = useQuiz();

  return (
    <header className='safe-top shrink-0 border-b border-border bg-card/60 px-4 py-3 backdrop-blur'>
      <div className='flex items-center justify-between'>
        {/* Lewa strona: Hamburger (warunkowo), Logo i Tytuł */}
        <div className='flex items-center gap-2'>
          {/* Przycisk Menu widoczny tylko, gdy test jest aktywny / ładuje się */}
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
        </div>

        {/* Prawa strona: Numer pytania */}
        {question && (
          <span className='rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono text-xs text-muted-foreground'>
            #{String(question.id).padStart(3, '0')}
          </span>
        )}
      </div>
    </header>
  );
}
