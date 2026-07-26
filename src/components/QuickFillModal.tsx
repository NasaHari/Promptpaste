import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sliders, RefreshCw } from 'lucide-react';
import { Prompt } from '../types';

interface QuickFillModalProps {
  prompt: Prompt | null;
  onClose: () => void;
  onCopyFilled: (filledText: string, title: string) => void;
}

export const QuickFillModal: React.FC<QuickFillModalProps> = ({
  prompt,
  onClose,
  onCopyFilled,
}) => {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prompt) {
      // Find all matches for [var] or {{var}}
      const regex = /\[(.*?)\]|\{\{(.*?)\}\}/g;
      const foundVars = new Set<string>();
      let match;
      while ((match = regex.exec(prompt.text)) !== null) {
        const varName = match[1] || match[2];
        if (varName && varName.trim()) {
          foundVars.add(varName.trim());
        }
      }

      const initialValues: Record<string, string> = {};
      foundVars.forEach(v => {
        initialValues[v] = '';
      });
      setVariables(initialValues);
    }
  }, [prompt]);

  if (!prompt) return null;

  const getFilledText = () => {
    let result = prompt.text;
    Object.entries(variables).forEach(([varName, val]) => {
      const strVal = typeof val === 'string' ? val : '';
      const replacement = strVal.trim() || `[${varName}]`;
      // Replace [varName] or {{varName}}
      const bracketRegex = new RegExp(`\\[${varName}\\]`, 'g');
      const curlyRegex = new RegExp(`\\{\\{${varName}\\}\\}`, 'g');
      result = result.replace(bracketRegex, replacement).replace(curlyRegex, replacement);
    });
    return result;
  };

  const handleCopy = () => {
    const filled = getFilledText();
    onCopyFilled(filled, prompt.title);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  const varList = Object.keys(variables);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-700 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Fill Prompt Variables</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
              Fill in placeholders to generate your customized prompt.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {varList.length > 0 ? (
            <div className="space-y-3">
              {varList.map((varName) => (
                <div key={varName}>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    {varName}
                  </label>
                  <input
                    type="text"
                    value={variables[varName] || ''}
                    onChange={(e) => setVariables({ ...variables, [varName]: e.target.value })}
                    placeholder={`Enter value for ${varName}...`}
                    className="w-full px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              No variable placeholders found. Copying standard prompt text.
            </div>
          )}

          {/* Live Preview */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5">
              <span>Preview Output</span>
              <button
                onClick={() => {
                  const reset: Record<string, string> = {};
                  varList.forEach(v => reset[v] = '');
                  setVariables(reset);
                }}
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Fields</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-zinc-900 text-zinc-100 dark:bg-zinc-950 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto border border-zinc-800">
              {getFilledText()}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/25'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied Custom Prompt!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Customized Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
