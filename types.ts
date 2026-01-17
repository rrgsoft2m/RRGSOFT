
export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
}

export interface Slide {
  title: string;
  content: string;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface Question {
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  answer: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface CrosswordEntry {
  clue: string;
  answer: string;
}

export interface EducationalContent {
  id: string;
  timestamp: number;
  subject: string;
  topic: string;
  presentation: Slide[];
  tests: Question[];
  qa: QA[];
  crossword: CrosswordEntry[];
  logicPuzzle: {
    puzzle: string;
    answer: string;
  };
  miniGame: {
    title: string;
    description: string;
    rules: string[];
  };
}

export interface SearchParams {
  subject: string;
  topic: string;
  grade: string;
  language: string;
  lessonType: string;
}
