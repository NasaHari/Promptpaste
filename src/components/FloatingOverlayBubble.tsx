import React, { useState, useRef } from 'react';
import { 
  Layers, 
  X, 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronRight, 
  Sliders,
  Maximize2,
  Minimize2,
  ListFilter
} from 'lucide-react';
import { Prompt } from '../types';

interface FloatingOverlayBubbleProps {
  isActive: boolean;
  onClose: () => void;
  prompts: Prompt[];
  onCopyPrompt: (text: string, title: string) => void;
  onOpenQuickFill: (p: Prompt) => void;
}

export const FloatingOverlayBubble: React.FC<FloatingOverlayBubbleProps> = ({
  isActive,
  onClose,
  prompts,
  onCopyPrompt,
  onOpenQuickFill,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isActive) return null;

  const categories = Array.from(new Set(prompts.map(p => p.category || 'General'))).sort();

  const filteredPrompts = prompts.filter(p => {
    if (selectedCategory !== 'All' && (p.category || 'General') !== selectedCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.text.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = (p: Prompt, e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyPrompt(p.text, p.title);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 pointer-events-auto flex flex-col items-end">
      {/* Expanded Floating Drawer */}
      {isExpanded ? (
        <div className="w-80 sm:w-88 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-500/20 overflow-hidden flex flex-col max-h-[500px] animate-in zoom-in-95 duration-200">
          {/* Top Bar */}
          <div className="p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-white/20 backdrop-blur-sm">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-none">PromptPaste Widget</h4>
                <p className="text-[10px] opacity-80 mt-0.5">Quick Copy Overlay</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
                title="Minimize Bubble"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
                title="Disable Overlay"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="p-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompt..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>

            {/* Category horizontal scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto mt-2 pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt List */}
          <div className="p-2 space-y-1.5 overflow-y-auto flex-1 max-h-72">
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map((p) => {
                const hasPlaceholders = p.text.includes('[');
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (hasPlaceholders) {
                        onOpenQuickFill(p);
                      } else {
                        onCopyPrompt(p.text, p.title);
                        setCopiedId(p.id);
                        setTimeout(() => setCopiedId(null), 1800);
                      }
                    }}
                    className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200/70 dark:border-zinc-700/60 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer group flex items-center justify-between gap-2"
                  >
                    <div className="truncate space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {p.title}
                        </span>
                        {hasPlaceholders && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                            Fill
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                        {p.text}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleCopy(p, e)}
                      className={`p-1.5 rounded-xl transition-all shrink-0 ${
                        copiedId === p.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white'
                      }`}
                      title="1-Tap Copy"
                    >
                      {copiedId === p.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-xs text-zinc-400 py-6">No matching prompts found.</p>
            )}
          </div>
        </div>
      ) : (
        /* Floating Bubble Trigger Button */
        <button
          onClick={() => setIsExpanded(true)}
          className="group flex items-center gap-2 pl-3.5 pr-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all ring-2 ring-white/20"
          title="Open Floating Quick Copy Widget"
        >
          <div className="p-1 rounded-full bg-white/20 backdrop-blur-sm animate-pulse">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">Floating Widget</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}
    </div>
  );
};
