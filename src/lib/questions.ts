import type { CategoryData } from '@/types';

export const categoryMap = new Map<string, CategoryData>([
  [
    'yacht_construction',
    {
      name: 'Budowa jachtów',
      data: () => import('../data/budowa_jachtow_quiz.json'),
    },
  ],
  [
    'sailing_pilot',
    {
      name: 'Locja i nawigacja',
      data: () => import('../data/locja_nawigacja_quiz.json'),
    },
  ],
  [
    'regulations',
    {
      name: 'Przepisy i etykieta jachtowa',
      data: () => import('../data/przpisy_etykieta_jachtowa_quiz.json'),
    },
  ],
  [
    'sailing_theory',
    {
      name: 'Teoria żeglowania',
      data: () => import('../data/teoria_zeglowania_quiz.json'),
    },
  ],
  [
    'meteorology',
    {
      name: 'Meteorologia',
      data: () => import('../data/meteorologia_quiz.json'),
    },
  ],
  [
    'water_rescue',
    {
      name: 'Ratownictwo wodne',
      data: () => import('../data/ratownictwo_quiz.json'),
    },
  ],
  [
    'yacht_handling_principles',
    {
      name: 'Zasady manewrowania jachtem',
      data: () => import('../data/zasady_eksploatacji_quiz.json'),
    },
  ],
]);
