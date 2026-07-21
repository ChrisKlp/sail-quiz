import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Quiz } from '@/components/Quiz';
import { StartScreen } from '@/components/StartScreen';
import { Summary } from '@/components/Summary';
import { QuizProvider, useQuiz } from '@/context/QuizContext';
import { Loader2 } from 'lucide-react';

function QuizLayout() {
  const { status, mode } = useQuiz();

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

      {status === 'finished' && mode === 'exam' && <Summary />}

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
