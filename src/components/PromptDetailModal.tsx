import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Star, 
  Pencil, 
  Trash2, 
  Sliders, 
  Folder, 
  Tag as TagIcon,
  Clock
} from 'lucide-react';
import { Prompt } from '../types';

interface PromptDetailModalProps {
  prompt: Prompt | null;
  onClose: () => void;
  onCopy: (text: string, title: string) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string, title: string) => void;
  onQuickFill: (prompt: Prompt) => void;
}

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  prompt,
  onClose,
  onCopy,
  onToggleFavorite,
  onEdit,
  onDelete,
  onQuickFill,
}) => {
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  const hasPlaceholders = /\[(.*?)\]|\{\{(.*?)\}\}/.test(prompt.text);
  const wordCount = prompt.text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = prompt.text.length;

  const handleCopy = () => {
    onCopy(prompt.text, prompt.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-700/80 flex items-start justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                <Folder className="w-3.5 h-3.5" />
                {prompt.category || 'General'}
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {new Date(prompt.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
              {prompt.title}
            </h2>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleFavorite(prompt.id)}
              className="p-2 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-700 text-zinc-400 transition-colors"
              aria-label="Favorite"
            >
              <Star
                className={`w-5 h-5 ${
                  prompt.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="relative">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">
              <span>Full Prompt Text</span>
              <span>{wordCount} words • {charCount} chars</span>
            </div>
            <pre className="p-4 rounded-2xl bg-zinc-900 text-zinc-100 dark:bg-zinc-950 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto border border-zinc-800 selection:bg-purple-500 selection:text-white">
              {prompt.text}
            </pre>
          </div>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                Tags & Keywords
              </div>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  >
                    <TagIcon className="w-3 h-3 text-purple-500" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onClose();
                onEdit(prompt);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/80 dark:hover:bg-zinc-700 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onDelete(prompt.id, prompt.title);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {hasPlaceholders && (
              <button
                onClick={() => {
                  onClose();
                  onQuickFill(prompt);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors"
              >
                <Sliders className="w-4 h-4" />
                <span>Fill Variables</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
