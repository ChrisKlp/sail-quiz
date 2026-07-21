import type { Question } from '@/types';
import { categoryMap } from './questions';

export async function getQuestionsByCategory(
  categoryKey: string,
): Promise<Question[]> {
  const category = categoryMap.get(categoryKey);

  if (!category) {
    throw new Error(`Category ${categoryKey} not found`);
  }

  const module = await category.data();
  return module.default;
}

export async function getAllQuestions(): Promise<Question[]> {
  const promises = Array.from(categoryMap.values()).map((category) =>
    category.data(),
  );

  const modules = await Promise.all(promises);

  return modules.flatMap((module) => module.default);
}
