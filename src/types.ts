export interface Prompt {
  id: string;
  title: string;
  text: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CategoryFolder {
  id: string;
  name: string;
  color?: string;
}

export type ImportMode = 'merge' | 'replace';

export interface JSONImportPrompt {
  title?: string;
  text?: string;
  prompt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
}

export interface JSONImportFolder {
  name: string;
  prompts: JSONImportPrompt[];
}

export interface JSONImportPayload {
  folders?: JSONImportFolder[];
  prompts?: JSONImportPrompt[];
  categories?: string[];
}

export type ThemeMode = 'system' | 'light' | 'dark';
