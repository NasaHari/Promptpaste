import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutGrid, ListFilter } from 'lucide-react';
import { Prompt, ThemeMode, ImportMode } from './types';
import { PromptStorageService } from './services/storage';
import { TopAppBar } from './components/TopAppBar';
import { CategoryChipBar } from './components/CategoryChipBar';
import { PromptCard } from './components/PromptCard';
import { PromptDetailModal } from './components/PromptDetailModal';
import { PromptEditorModal } from './components/PromptEditorModal';
import { QuickFillModal } from './components/QuickFillModal';
import { ImportExportModal } from './components/ImportExportModal';
import { FloatingWidgetModal } from './components/FloatingWidgetModal';
import { FloatingOverlayBubble } from './components/FloatingOverlayBubble';
import { EmptyState } from './components/EmptyState';
import { SnackbarContainer, SnackbarMessage } from './components/Snackbar';
import { DeviceFrameWrapper } from './components/DeviceFrameToggle';

export default function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [isDeviceFrame, setIsDeviceFrame] = useState(false);

  // Modals state
  const [activeDetailPrompt, setActiveDetailPrompt] = useState<Prompt | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);
  const [quickFillPrompt, setQuickFillPrompt] = useState<Prompt | null>(null);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);
  const [isFloatingOverlayActive, setIsFloatingOverlayActive] = useState(false);

  // Snackbars state
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  // Load initial data & theme
  useEffect(() => {
    const loadedPrompts = PromptStorageService.getPrompts();
    setPrompts(loadedPrompts);

    const savedTheme = PromptStorageService.getTheme();
    setTheme(savedTheme);
  }, []);

  // Sync theme with HTML root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System default
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    PromptStorageService.setTheme(theme);
  }, [theme]);

  const addSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'success', actionLabel?: string, onAction?: () => void) => {
    const id = 'snack-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setSnackbars(prev => [...prev, { id, message, type, actionLabel, onAction }]);
  };

  const removeSnackbar = (id: string) => {
    setSnackbars(prev => prev.filter(s => s.id !== id));
  };

  // Categories list derived from prompts
  const categories = useMemo(() => {
    const catsSet = new Set<string>();
    prompts.forEach(p => {
      if (p.category) catsSet.add(p.category);
    });
    return Array.from(catsSet).sort();
  }, [prompts]);

  // Counts for categories and favorites
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    prompts.forEach(p => {
      const cat = p.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [prompts]);

  const favoritesCount = useMemo(() => {
    return prompts.filter(p => p.isFavorite).length;
  }, [prompts]);

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      // Favorites filter
      if (showFavoritesOnly && !p.isFavorite) return false;

      // Category filter
      if (!showFavoritesOnly && selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag && (!p.tags || !p.tags.includes(selectedTag))) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesText = p.text.toLowerCase().includes(q);
        const matchesCategory = p.category?.toLowerCase().includes(q);
        const matchesTag = p.tags?.some(t => t.toLowerCase().includes(q));
        return matchesTitle || matchesText || matchesCategory || matchesTag;
      }

      return true;
    });
  }, [prompts, searchQuery, selectedCategory, showFavoritesOnly, selectedTag]);

  // Actions
  const handleCopyPrompt = async (text: string, title: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addSnackbar(`Copied "${title}" to clipboard!`, 'success');
    } catch (e) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      addSnackbar(`Copied "${title}" to clipboard!`, 'success');
    }
  };

  const handleToggleFavorite = (id: string) => {
    const updated = PromptStorageService.toggleFavorite(id);
    if (updated) {
      setPrompts(PromptStorageService.getPrompts());
      addSnackbar(
        updated.isFavorite ? `Starred "${updated.title}"` : `Unstarred "${updated.title}"`,
        'info'
      );
    }
  };

  const handleDeletePrompt = (id: string, title: string) => {
    const deletedPrompt = prompts.find(p => p.id === id);
    const success = PromptStorageService.deletePrompt(id);
    if (success) {
      setPrompts(PromptStorageService.getPrompts());
      addSnackbar(`Deleted "${title}"`, 'info', 'Undo', () => {
        if (deletedPrompt) {
          PromptStorageService.addPrompt({
            title: deletedPrompt.title,
            text: deletedPrompt.text,
            category: deletedPrompt.category,
            tags: deletedPrompt.tags,
            isFavorite: deletedPrompt.isFavorite,
          });
          setPrompts(PromptStorageService.getPrompts());
          addSnackbar(`Restored "${title}"`, 'success');
        }
      });
    }
  };

  const handleSavePrompt = (data: {
    title: string;
    text: string;
    category: string;
    tags: string[];
    isFavorite: boolean;
  }) => {
    if (promptToEdit) {
      PromptStorageService.updatePrompt(promptToEdit.id, data);
      addSnackbar(`Updated "${data.title}"`, 'success');
    } else {
      PromptStorageService.addPrompt(data);
      addSnackbar(`Created "${data.title}"`, 'success');
    }
    setPrompts(PromptStorageService.getPrompts());
  };

  const handleResetToSamples = () => {
    const samples = PromptStorageService.resetToSamples();
    setPrompts(samples);
    setSelectedCategory('All');
    setShowFavoritesOnly(false);
    setSelectedTag(null);
    setSearchQuery('');
    addSnackbar('Reset to starter AI prompts', 'success');
  };

  const handleImportComplete = (count: number, mode: ImportMode, categoriesCreated: string[]) => {
    setPrompts(PromptStorageService.getPrompts());
    addSnackbar(
      `Successfully imported ${count} prompt${count > 1 ? 's' : ''}!`,
      'success'
    );
  };

  return (
    <DeviceFrameWrapper isDeviceFrame={isDeviceFrame}>
      <div className="flex flex-col min-h-full pb-24">
        {/* Material 3 Top App Bar */}
        <TopAppBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenImportExport={() => setImportExportOpen(true)}
          onOpenFloatingWidgetModal={() => setWidgetModalOpen(true)}
          theme={theme}
          onThemeChange={setTheme}
          onResetSamples={handleResetToSamples}
          isDeviceFrame={isDeviceFrame}
          onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
          totalPromptsCount={prompts.length}
        />

        {/* Category Filter Chips Bar */}
        <CategoryChipBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
          favoritesCount={favoritesCount}
          categoryCounts={categoryCounts}
          selectedTag={selectedTag}
          onClearTag={() => setSelectedTag(null)}
        />

        {/* Prompts Cards Grid / List */}
        <main className="max-w-4xl mx-auto w-full px-4 pt-4 flex-1">
          {filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onCopy={handleCopyPrompt}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={(p) => {
                    setPromptToEdit(p);
                    setEditorOpen(true);
                  }}
                  onDelete={handleDeletePrompt}
                  onClickDetail={(p) => setActiveDetailPrompt(p)}
                  onSelectTag={(t) => setSelectedTag(t)}
                  onQuickFill={(p) => setQuickFillPrompt(p)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type={
                searchQuery
                  ? 'no-search'
                  : showFavoritesOnly
                  ? 'no-favorites'
                  : 'no-prompts'
              }
              searchQuery={searchQuery}
              onAddPrompt={() => {
                setPromptToEdit(null);
                setEditorOpen(true);
              }}
              onResetSamples={handleResetToSamples}
              onClearSearch={() => setSearchQuery('')}
            />
          )}
        </main>

        {/* Material Design 3 Floating Action Button (FAB) */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => {
              setPromptToEdit(null);
              setEditorOpen(true);
            }}
            className="flex items-center gap-2.5 px-5 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-sm shadow-xl shadow-purple-500/30 transition-all group"
            aria-label="Add new prompt"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">New Prompt</span>
          </button>
        </div>

        {/* Toast / Snackbar Notifications */}
        <SnackbarContainer snackbars={snackbars} onDismiss={removeSnackbar} />

        {/* Modals & Dialogs */}
        <PromptDetailModal
          prompt={activeDetailPrompt}
          onClose={() => setActiveDetailPrompt(null)}
          onCopy={handleCopyPrompt}
          onToggleFavorite={handleToggleFavorite}
          onEdit={(p) => {
            setPromptToEdit(p);
            setEditorOpen(true);
          }}
          onDelete={handleDeletePrompt}
          onQuickFill={(p) => setQuickFillPrompt(p)}
        />

        <PromptEditorModal
          promptToEdit={promptToEdit}
          isOpen={editorOpen}
          onClose={() => {
            setEditorOpen(false);
            setPromptToEdit(null);
          }}
          onSave={handleSavePrompt}
          existingCategories={categories.length > 0 ? categories : ['General']}
        />

        <QuickFillModal
          prompt={quickFillPrompt}
          onClose={() => setQuickFillPrompt(null)}
          onCopyFilled={handleCopyPrompt}
        />

        <ImportExportModal
          isOpen={importExportOpen}
          onClose={() => setImportExportOpen(false)}
          onImportComplete={handleImportComplete}
          onShowErrorSnackbar={(msg) => addSnackbar(msg, 'error')}
        />

        <FloatingWidgetModal
          isOpen={widgetModalOpen}
          onClose={() => setWidgetModalOpen(false)}
          prompts={prompts}
          onCopyPrompt={handleCopyPrompt}
          isFloatingOverlayActive={isFloatingOverlayActive}
          onToggleFloatingOverlay={setIsFloatingOverlayActive}
        />

        <FloatingOverlayBubble
          isActive={isFloatingOverlayActive}
          onClose={() => setIsFloatingOverlayActive(false)}
          prompts={prompts}
          onCopyPrompt={handleCopyPrompt}
          onOpenQuickFill={(p) => setQuickFillPrompt(p)}
        />
      </div>
    </DeviceFrameWrapper>
  );
}
