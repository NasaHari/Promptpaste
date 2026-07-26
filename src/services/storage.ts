import { Prompt, JSONImportPayload, ImportMode } from '../types';
import { INITIAL_PROMPTS } from './sampleData';

const STORAGE_KEY = 'promptpaste_prompts_v1';
const THEME_KEY = 'promptpaste_theme_v1';

export class PromptStorageService {
  /**
   * Fetch all prompts from local storage.
   * If empty, seeds initial sample prompts on first boot.
   */
  static getPrompts(): Prompt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.savePrompts(INITIAL_PROMPTS);
        return INITIAL_PROMPTS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return INITIAL_PROMPTS;
    } catch (e) {
      console.error('Failed to load prompts from storage', e);
      return INITIAL_PROMPTS;
    }
  }

  static savePrompts(prompts: Prompt[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    } catch (e) {
      console.error('Failed to save prompts to storage', e);
    }
  }

  static addPrompt(newPromptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Prompt {
    const prompts = this.getPrompts();
    const now = Date.now();
    const newPrompt: Prompt = {
      ...newPromptData,
      id: 'prompt-' + now + '-' + Math.random().toString(36).substr(2, 6),
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newPrompt, ...prompts];
    this.savePrompts(updated);
    return newPrompt;
  }

  static updatePrompt(id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>): Prompt | null {
    const prompts = this.getPrompts();
    const index = prompts.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedPrompt: Prompt = {
      ...prompts[index],
      ...updates,
      updatedAt: Date.now(),
    };
    prompts[index] = updatedPrompt;
    this.savePrompts(prompts);
    return updatedPrompt;
  }

  static deletePrompt(id: string): boolean {
    const prompts = this.getPrompts();
    const filtered = prompts.filter(p => p.id !== id);
    this.savePrompts(filtered);
    return filtered.length !== prompts.length;
  }

  static toggleFavorite(id: string): Prompt | null {
    const prompts = this.getPrompts();
    const target = prompts.find(p => p.id === id);
    if (!target) return null;
    return this.updatePrompt(id, { isFavorite: !target.isFavorite });
  }

  static resetToSamples(): Prompt[] {
    this.savePrompts(INITIAL_PROMPTS);
    return INITIAL_PROMPTS;
  }

  static clearAll(): void {
    this.savePrompts([]);
  }

  /**
   * Export prompts in the user-requested folder JSON format:
   * {
   *   "folders": [
   *     {
   *       "name": "Category Name",
   *       "prompts": [
   *         { "title": "...", "text": "..." }
   *       ]
   *     }
   *   ]
   * }
   */
  static exportToJSON(): string {
    const prompts = this.getPrompts();
    const categoriesMap = new Map<string, { title: string; text: string }[]>();

    prompts.forEach(p => {
      const cat = p.category || 'Uncategorized';
      if (!categoriesMap.has(cat)) {
        categoriesMap.set(cat, []);
      }
      categoriesMap.get(cat)!.push({
        title: p.title,
        text: p.text
      });
    });

    const folders = Array.from(categoriesMap.entries()).map(([name, folderPrompts]) => ({
      name,
      prompts: folderPrompts
    }));

    return JSON.stringify({ folders }, null, 2);
  }

  /**
   * Import JSON file content.
   * Supports:
   * 1. Official schema: { "folders": [ { "name": "...", "prompts": [ { "title": "...", "text": "..." } ] } ] }
   * 2. Flat prompt list: [ { "title": "...", "text": "..." } ]
   * 3. Object with "prompts" array: { "prompts": [...] }
   */
  static importFromJSON(jsonString: string, mode: ImportMode = 'merge'): {
    success: boolean;
    count: number;
    categoriesCreated: string[];
    error?: string;
  } {
    try {
      if (!jsonString || !jsonString.trim()) {
        return { success: false, count: 0, categoriesCreated: [], error: 'JSON string is empty' };
      }

      let parsedData: any;
      try {
        parsedData = JSON.parse(jsonString);
      } catch (err: any) {
        return { success: false, count: 0, categoriesCreated: [], error: `Invalid JSON format: ${err.message}` };
      }

      const newPromptsToInsert: Prompt[] = [];
      const categoriesSet = new Set<string>();
      const now = Date.now();

      // Case 1: Standard Folders structure
      if (parsedData && Array.isArray(parsedData.folders)) {
        parsedData.folders.forEach((folder: any, folderIdx: number) => {
          const categoryName = (folder.name && typeof folder.name === 'string') 
            ? folder.name.trim() 
            : `Folder ${folderIdx + 1}`;
          
          if (categoryName) categoriesSet.add(categoryName);

          if (Array.isArray(folder.prompts)) {
            folder.prompts.forEach((p: any, idx: number) => {
              const title = p.title || p.name || `Prompt ${idx + 1}`;
              const text = p.text || p.prompt || p.content || '';
              if (text.trim() || title.trim()) {
                newPromptsToInsert.push({
                  id: 'imp-' + now + '-' + Math.random().toString(36).substr(2, 6),
                  title: title.trim(),
                  text: text,
                  category: categoryName,
                  tags: Array.isArray(p.tags) ? p.tags : [categoryName.toLowerCase().replace(/\s+/g, '-')],
                  isFavorite: Boolean(p.isFavorite),
                  createdAt: now,
                  updatedAt: now,
                });
              }
            });
          }
        });
      } 
      // Case 2: Array of prompt objects
      else if (Array.isArray(parsedData)) {
        parsedData.forEach((p: any, idx: number) => {
          const title = p.title || p.name || `Prompt ${idx + 1}`;
          const text = p.text || p.prompt || p.content || '';
          const category = p.category || 'Imported';
          categoriesSet.add(category);
          if (text.trim() || title.trim()) {
            newPromptsToInsert.push({
              id: 'imp-' + now + '-' + Math.random().toString(36).substr(2, 6),
              title: title.trim(),
              text: text,
              category: category,
              tags: Array.isArray(p.tags) ? p.tags : [],
              isFavorite: Boolean(p.isFavorite),
              createdAt: now,
              updatedAt: now,
            });
          }
        });
      }
      // Case 3: Object with top-level "prompts" array
      else if (parsedData && Array.isArray(parsedData.prompts)) {
        parsedData.prompts.forEach((p: any, idx: number) => {
          const title = p.title || p.name || `Prompt ${idx + 1}`;
          const text = p.text || p.prompt || p.content || '';
          const category = p.category || 'Imported';
          categoriesSet.add(category);
          if (text.trim() || title.trim()) {
            newPromptsToInsert.push({
              id: 'imp-' + now + '-' + Math.random().toString(36).substr(2, 6),
              title: title.trim(),
              text: text,
              category: category,
              tags: Array.isArray(p.tags) ? p.tags : [],
              isFavorite: Boolean(p.isFavorite),
              createdAt: now,
              updatedAt: now,
            });
          }
        });
      } else {
        return {
          success: false,
          count: 0,
          categoriesCreated: [],
          error: 'Unrecognized JSON structure. Expected "folders" array or array of prompts.'
        };
      }

      if (newPromptsToInsert.length === 0) {
        return {
          success: false,
          count: 0,
          categoriesCreated: [],
          error: 'No valid prompt entries found in the imported JSON file.'
        };
      }

      let finalPrompts: Prompt[];
      if (mode === 'replace') {
        finalPrompts = newPromptsToInsert;
      } else {
        const existing = this.getPrompts();
        finalPrompts = [...newPromptsToInsert, ...existing];
      }

      this.savePrompts(finalPrompts);

      return {
        success: true,
        count: newPromptsToInsert.length,
        categoriesCreated: Array.from(categoriesSet)
      };
    } catch (err: any) {
      return {
        success: false,
        count: 0,
        categoriesCreated: [],
        error: `Import failed: ${err.message || 'Unknown error'}`
      };
    }
  }

  static getTheme(): 'light' | 'dark' | 'system' {
    return (localStorage.getItem(THEME_KEY) as any) || 'system';
  }

  static setTheme(theme: 'light' | 'dark' | 'system'): void {
    localStorage.setItem(THEME_KEY, theme);
  }
}
