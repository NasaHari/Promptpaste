import React from 'react';
import { Star, Folder, Tag } from 'lucide-react';

interface CategoryChipBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoritesCount: number;
  categoryCounts: Record<string, number>;
  selectedTag: string | null;
  onClearTag: () => void;
}

export const CategoryChipBar: React.FC<CategoryChipBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
  categoryCounts,
  selectedTag,
  onClearTag,
}) => {
  return (
    <div className="py-2.5 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 border-b border-zinc-200/50 dark:border-zinc-800/50">
      {/* Active Tag Pill Indicator if Tag Filter Active */}
      {selectedTag && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-semibold shrink-0 animate-in fade-in zoom-in-90">
          <Tag className="w-3.5 h-3.5" />
          <span>#{selectedTag}</span>
          <button
            onClick={onClearTag}
            className="ml-1 hover:bg-indigo-700 rounded-full p-0.5"
            aria-label="Clear tag filter"
          >
            ×
          </button>
        </div>
      )}

      {/* All Prompts Filter Chip */}
      <button
        onClick={() => {
          if (showFavoritesOnly) onToggleFavoritesOnly();
          onSelectCategory('All');
        }}
        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
          !showFavoritesOnly && selectedCategory === 'All'
            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
            : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300/80 dark:hover:bg-zinc-700'
        }`}
      >
        <span>All</span>
      </button>

      {/* Favorites Filter Chip */}
      <button
        onClick={onToggleFavoritesOnly}
        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
          showFavoritesOnly
            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
            : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300/80 dark:hover:bg-zinc-700'
        }`}
      >
        <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-white' : 'fill-amber-500 text-amber-500'}`} />
        <span>Favorites</span>
        {favoritesCount > 0 && (
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            showFavoritesOnly ? 'bg-amber-600 text-white' : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
          }`}>
            {favoritesCount}
          </span>
        )}
      </button>

      {/* Dynamic Categories Chips */}
      {categories.map((cat) => {
        const isSelected = !showFavoritesOnly && selectedCategory === cat;
        const count = categoryCounts[cat] || 0;

        return (
          <button
            key={cat}
            onClick={() => {
              if (showFavoritesOnly) onToggleFavoritesOnly();
              onSelectCategory(cat);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              isSelected
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300/80 dark:hover:bg-zinc-700'
            }`}
          >
            <Folder className="w-3.5 h-3.5 opacity-80" />
            <span>{cat}</span>
            {count > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isSelected ? 'bg-purple-700 text-white' : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
