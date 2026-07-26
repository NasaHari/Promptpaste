import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  MoreVertical, 
  FileUp, 
  FileDown, 
  Moon, 
  Sun, 
  RotateCcw, 
  Smartphone,
  Check,
  FolderOpen,
  Layers
} from 'lucide-react';
import { ThemeMode } from '../types';

interface TopAppBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenImportExport: () => void;
  onOpenFloatingWidgetModal: () => void;
  theme: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  onResetSamples: () => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  totalPromptsCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenImportExport,
  onOpenFloatingWidgetModal,
  theme,
  onThemeChange,
  onResetSamples,
  isDeviceFrame,
  onToggleDeviceFrame,
  totalPromptsCount,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearching) {
      searchInputRef.current?.focus();
    }
  }, [isSearching]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2 min-h-[64px]">
        {isSearching ? (
          <div className="flex items-center gap-2 w-full bg-zinc-200/70 dark:bg-zinc-800/80 rounded-2xl px-3 py-1.5 transition-all">
            <Search className="w-5 h-5 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search prompts by title, content, tag..."
              className="w-full bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 rounded-full hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 text-zinc-500"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                setIsSearching(false);
                onSearchChange('');
              }}
              className="text-xs font-semibold px-2 py-1 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/50 rounded-lg transition-colors shrink-0"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            {/* Left Brand Identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                  PromptPaste
                </h1>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                  <span>Local AI Prompts</span>
                  <span>•</span>
                  <span>{totalPromptsCount} saved</span>
                </p>
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSearching(true)}
                className="p-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
                title="Search prompts"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenFloatingWidgetModal}
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
                title="Floating Widget & Android Overlay"
              >
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Floating Widget</span>
              </button>

              <button
                onClick={onOpenImportExport}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors"
                title="Import/Export JSON"
              >
                <FileUp className="w-4 h-4" />
                <span>Import / Export</span>
              </button>

              {/* Overflow Menu Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-zinc-800 shadow-2xl border border-zinc-200 dark:border-zinc-700 py-2 z-50 text-sm font-medium text-zinc-800 dark:text-zinc-200 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onOpenFloatingWidgetModal();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 flex items-center gap-3"
                    >
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span>Floating Widget & Overlay</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onOpenImportExport();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 flex items-center gap-3"
                    >
                      <FileUp className="w-4 h-4 text-purple-500" />
                      <span>Import / Export JSON</span>
                    </button>

                    <div className="my-1 border-t border-zinc-200 dark:border-zinc-700/80" />

                    <div className="px-4 py-1.5 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Theme
                    </div>

                    <button
                      onClick={() => {
                        onThemeChange('light');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-3">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span>Light Mode</span>
                      </span>
                      {theme === 'light' && <Check className="w-4 h-4 text-purple-600" />}
                    </button>

                    <button
                      onClick={() => {
                        onThemeChange('dark');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-3">
                        <Moon className="w-4 h-4 text-indigo-400" />
                        <span>Dark Mode</span>
                      </span>
                      {theme === 'dark' && <Check className="w-4 h-4 text-purple-600" />}
                    </button>

                    <button
                      onClick={() => {
                        onThemeChange('system');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-zinc-500" />
                        <span>System Default</span>
                      </span>
                      {theme === 'system' && <Check className="w-4 h-4 text-purple-600" />}
                    </button>

                    <div className="my-1 border-t border-zinc-200 dark:border-zinc-700/80" />

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onToggleDeviceFrame();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 flex items-center gap-3"
                    >
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <span>{isDeviceFrame ? 'Full Viewport' : 'Android Phone Frame'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onResetSamples();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 flex items-center gap-3 text-red-600 dark:text-red-400"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset Sample Prompts</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
