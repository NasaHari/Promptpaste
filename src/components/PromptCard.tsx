import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Star, 
  Pencil, 
  Trash2, 
  Sliders, 
  Folder, 
  Tag as TagIcon 
} from 'lucide-react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  onCopy: (text: string, title: string) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string, title: string) => void;
  onClickDetail: (prompt: Prompt) => void;
  onSelectTag: (tag: string) => void;
  onQuickFill: (prompt: Prompt) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onCopy,
  onToggleFavorite,
  onEdit,
  onDelete,
  onClickDetail,
  onSelectTag,
  onQuickFill,
}) => {
  const [copied, setCopied] = useState(false);

  const hasPlaceholders = /\[(.*?)\]|\{\{(.*?)\}\}/.test(prompt.text);

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy(prompt.text, prompt.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(prompt.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(prompt);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(prompt.id, prompt.title);
  };

  const handleQuickFillClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickFill(prompt);
  };

  return (
    <div
      onClick={() => onClickDetail(prompt)}
      className="group relative bg-white dark:bg-zinc-800/90 rounded-2xl p-4 shadow-sm hover:shadow-md border border-zinc-200/80 dark:border-zinc-700/80 transition-all cursor-pointer flex flex-col justify-between gap-3 active:scale-[0.99]"
    >
      {/* Top Header: Title + Favorite Star */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
              <Folder className="w-3 h-3" />
              {prompt.category || 'General'}
            </span>

            {hasPlaceholders && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                <Sliders className="w-3 h-3" />
                Template Vars
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {prompt.title}
          </h3>
        </div>

        <button
          onClick={handleFavoriteClick}
          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500 transition-colors shrink-0"
          title={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={`w-5 h-5 transition-transform active:scale-125 ${
              prompt.isFavorite
                ? 'fill-amber-400 text-amber-400'
                : 'hover:text-amber-400'
            }`}
          />
        </button>
      </div>

      {/* Text Preview */}
      <p className="text-xs text-zinc-600 dark:text-zinc-300 font-mono bg-zinc-50 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/60 line-clamp-3 leading-relaxed whitespace-pre-wrap">
        {prompt.text}
      </p>

      {/* Tags List */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                onSelectTag(tag);
              }}
              className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <TagIcon className="w-2.5 h-2.5" />
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-700/50">
        <div className="flex items-center gap-1">
          <button
            onClick={handleEditClick}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            title="Edit prompt"
            aria-label="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 rounded-xl text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Delete prompt"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {hasPlaceholders && (
            <button
              onClick={handleQuickFillClick}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors"
              title="Fill template variables before copying"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Fill Vars</span>
            </button>
          )}

          <button
            onClick={handleCopyClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
