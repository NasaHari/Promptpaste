import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Smartphone, 
  Zap, 
  Copy, 
  Check, 
  Search, 
  Shield, 
  ChevronRight, 
  Sliders, 
  Sparkles,
  ExternalLink,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Prompt } from '../types';

interface FloatingWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: Prompt[];
  onCopyPrompt: (text: string, title: string) => void;
  isFloatingOverlayActive: boolean;
  onToggleFloatingOverlay: (active: boolean) => void;
}

export const FloatingWidgetModal: React.FC<FloatingWidgetModalProps> = ({
  isOpen,
  onClose,
  prompts,
  onCopyPrompt,
  isFloatingOverlayActive,
  onToggleFloatingOverlay,
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'guide'>('demo');
  const [widgetSearch, setWidgetSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredPrompts = prompts.filter(p => {
    if (!widgetSearch.trim()) return true;
    const q = widgetSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.text.toLowerCase().includes(q);
  });

  const handleQuickCopy = (p: Prompt) => {
    onCopyPrompt(p.text, p.title);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Floating Overlay & Widget
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                1-tap prompt access while using other apps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-950/40 p-1.5 mx-6 mt-4 rounded-2xl">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'demo'
                ? 'bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Interactive Floating Bubble</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'guide'
                ? 'bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android Setup Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'demo' ? (
            <div className="space-y-5">
              {/* Overlay Toggle Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 border border-purple-200 dark:border-purple-800/50 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Web Overlay Bubble
                  </span>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Enable On-Screen Floating Assistant
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Keeps a draggable quick-copy icon on top of this screen.
                  </p>
                </div>
                <button
                  onClick={() => onToggleFloatingOverlay(!isFloatingOverlayActive)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shrink-0 shadow-md ${
                    isFloatingOverlayActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
                  }`}
                >
                  {isFloatingOverlayActive ? 'Active (Tap to Hide)' : 'Enable Bubble'}
                </button>
              </div>

              {/* Quick Copy Mini Preview inside Modal */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Quick Copy Panel Preview
                  </h3>
                  <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">
                    1-Tap Copy
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                  <input
                    type="text"
                    value={widgetSearch}
                    onChange={(e) => setWidgetSearch(e.target.value)}
                    placeholder="Search prompts to copy instantly..."
                    className="w-full pl-9 pr-3 py-2 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {filteredPrompts.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 flex items-center justify-between gap-3 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                    >
                      <div className="truncate space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {p.title}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            {p.category || 'General'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {p.text}
                        </p>
                      </div>

                      <button
                        onClick={() => handleQuickCopy(p)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                          copiedId === p.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                        }`}
                      >
                        {copiedId === p.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Android Setup Guide */
            <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  How Floating Widgets Work on Android
                </span>
                <p className="text-[11px]">
                  Web apps run in browser tabs. To float over other Android apps (like ChatGPT, Claude, or Gmail), native Android applications use 3 standard Android features:
                </p>
              </div>

              {/* Method 1 */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Android Home Screen Widget (`AppWidgetProvider`)</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                  Long-press your phone's Home Screen &gt; select <strong>Widgets</strong> &gt; choose <strong>PromptPaste</strong>.
                  Places a 4x2 or 2x2 quick-copy grid right on your home screen for 1-tap clipboard copying!
                </p>
              </div>

              {/* Method 2 */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Display Over Other Apps (`SYSTEM_ALERT_WINDOW`)</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                  On native Android, grant <em>"Display over other apps"</em> permission in Settings &gt; Apps &gt; PromptPaste.
                  This floats a floating bubble on your screen while using ChatGPT, Claude, or Twitter.
                </p>
              </div>

              {/* Method 3 */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Quick Settings Notification Tile</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                  Swipe down from the top of your Android screen &gt; edit Quick Settings Tiles &gt; add <strong>PromptPaste Quick Bar</strong>. Access your favorite AI prompts from anywhere in 2 seconds!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-between items-center">
          <p className="text-xs text-zinc-500">PromptPaste Overlay Assistant</p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
