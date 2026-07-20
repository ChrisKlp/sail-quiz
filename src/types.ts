export interface Question {
  id: number;
  question: string;
  answers: string[];
  /** Musi być identyczny (1:1) z jednym z elementów `answers`. */
  correct_answer: string;
  /** Ścieżka względem folderu `public/`, np. "images/plik.jpg", lub `null`. */
  image_url: string | null;
}
