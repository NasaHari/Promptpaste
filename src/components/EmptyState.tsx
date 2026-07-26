import React from 'react';
import { Sparkles, FolderPlus, Search, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-prompts' | 'no-search' | 'no-favorites';
  searchQuery?: string;
  onAddPrompt: () => void;
  onResetSamples: () => void;
  onClearSearch?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchQuery,
  onAddPrompt,
  onResetSamples,
  onClearSearch,
}) => {
  if (type === 'no-search') {
    return (
      <div className="py-16 px-4 text-center max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          No prompts found
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
          No results matching &ldquo;{searchQuery}&rdquo;. Try checking for typos or clear your search filter.
        </p>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="px-4 py-2 rounded-2xl bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-favorites') {
    return (
      <div className="py-16 px-4 text-center max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          No starred favorites yet
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
          Tap the star icon on any prompt card to pin it to your favorites for instant access.
        </p>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 text-center max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-lg shadow-purple-500/10">
        <Sparkles className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        Your Prompt Library is Empty
      </h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
        PromptPaste helps you save, organize, and copy AI prompts to clipboard instantly.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <button
          onClick={onAddPrompt}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create New Prompt</span>
        </button>

        <button
          onClick={onResetSamples}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Load Starter Prompts</span>
        </button>
      </div>
    </div>
  );
};
