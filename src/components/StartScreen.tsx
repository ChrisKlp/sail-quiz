import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';
import {
  Shuffle,
  GraduationCap,
  List,
  ArrowLeft,
  Sailboat,
} from 'lucide-react';
import { categoryMap } from '@/lib/questions';

type MenuView = 'main' | 'categories';

export function StartScreen() {
  const { startRandomAll, startExam, startCategory } = useQuiz();
  const [view, setView] = useState<MenuView>('main');

  const categoriesList = Array.from(categoryMap.entries());

  return (
    <main className='no-scrollbar flex flex-1 flex-col items-center overflow-y-auto p-6'>
      <div className='my-auto flex w-full max-w-sm flex-col'>
        <div className='mb-10 flex flex-col items-center text-center'>
          <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
            <Sailboat className='h-8 w-8' strokeWidth={1.5} />
          </div>
          <h1 className='font-display text-2xl font-bold text-foreground'>
            Patent Żeglarski
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Sprawdź swoją wiedzę przed egzaminem lub poćwicz wybrane działy.
          </p>
        </div>

        {view === 'main' && (
          <div className='flex w-full flex-col gap-3'>
            <Button
              size='lg'
              className='h-14 justify-start gap-4 text-base'
              onClick={startExam}
            >
              <GraduationCap className='h-5 w-5' />
              Rozpocznij egzamin
            </Button>

            <Button
              variant='secondary'
              size='lg'
              className='h-14 justify-start gap-4 text-base'
              onClick={startRandomAll}
            >
              <Shuffle className='h-5 w-5 text-muted-foreground' />
              Losowe pytania
            </Button>

            <Button
              variant='outline'
              size='lg'
              className='h-14 justify-start gap-4 text-base'
              onClick={() => setView('categories')}
            >
              <List className='h-5 w-5 text-muted-foreground' />
              Wybierz kategorię
            </Button>
          </div>
        )}

        {view === 'categories' && (
          <div className='flex w-full flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 pb-8'>
            <Button
              variant='ghost'
              className='mb-4 self-start pl-0 text-muted-foreground hover:text-foreground'
              onClick={() => setView('main')}
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Wstecz
            </Button>

            <div className='flex flex-col gap-3'>
              {categoriesList.map(([key, category]) => (
                <Button
                  key={key}
                  variant='outline'
                  size='lg'
                  className='min-h-14 h-auto justify-start py-3 text-left text-base whitespace-normal'
                  onClick={() => startCategory(key)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
