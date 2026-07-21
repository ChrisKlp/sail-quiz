import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Quiz } from '@/components/quiz';
import { StartScreen } from '@/components/startScreen';
import { QuizProvider, useQuiz } from '@/context/QuizContext';
import { Loader2 } from 'lucide-react';

function QuizLayout() {
  const { status } = useQuiz();

  return (
    <div className='flex h-dvh flex-col overflow-hidden bg-background'>
      <Header />

      {status === 'idle' && <StartScreen />}

      {status === 'loading' && (
        <main className='flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='animate-pulse text-sm font-medium'>
            Przygotowuję pytania...
          </p>
        </main>
      )}

      {status === 'active' && <Quiz />}

      {status === 'finished' && (
        <main className='flex flex-1 flex-col items-center justify-center p-6 text-center'>
          <h2 className='font-display text-2xl font-bold'>Koniec quizu!</h2>
          <p className='mt-2 text-muted-foreground'>
            Tutaj zbudujemy ekran z wynikami.
          </p>
        </main>
      )}

      {status === 'active' && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <QuizLayout />
    </QuizProvider>
  );
}
