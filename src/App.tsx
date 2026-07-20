import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Quiz } from '@/components/quiz';
import { QuizProvider } from './context/quizContext';

export default function App() {
  return (
    <QuizProvider>
      <div className='flex h-dvh flex-col overflow-hidden bg-background'>
        <Header />
        <Quiz />
        <Footer />
      </div>
    </QuizProvider>
  );
}
