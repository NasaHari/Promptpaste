import React, { useState, useRef } from 'react';
import { 
  X, 
  FileUp, 
  FileDown, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  FolderCheck,
  Code2,
  Database
} from 'lucide-react';
import { PromptStorageService } from '../services/storage';
import { SAMPLE_JSON_EXPORT_STRUCTURE } from '../services/sampleData';
import { ImportMode } from '../types';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (count: number, mode: ImportMode, categories: string[]) => void;
  onShowErrorSnackbar: (msg: string) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  onShowErrorSnackbar,
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [previewFolderCount, setPreviewFolderCount] = useState<number | null>(null);
  const [previewPromptCount, setPreviewPromptCount] = useState<number | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
      inspectJSONContent(content);
    };
    reader.onerror = () => {
      setParseError('Failed to read selected file.');
    };
    reader.readAsText(file);
  };

  const inspectJSONContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      let pCount = 0;
      let fCount = 0;

      if (parsed && Array.isArray(parsed.folders)) {
        fCount = parsed.folders.length;
        parsed.folders.forEach((f: any) => {
          if (Array.isArray(f.prompts)) {
            pCount += f.prompts.length;
          }
        });
      } else if (Array.isArray(parsed)) {
        fCount = 1;
        pCount = parsed.length;
      } else if (parsed && Array.isArray(parsed.prompts)) {
        fCount = 1;
        pCount = parsed.prompts.length;
      } else {
        setParseError('Unrecognized JSON structure. Expected "folders" array or array of prompts.');
        setPreviewFolderCount(null);
        setPreviewPromptCount(null);
        return;
      }

      setPreviewFolderCount(fCount);
      setPreviewPromptCount(pCount);
      setParseError(null);
    } catch (err: any) {
      setParseError(`Invalid JSON format: ${err.message}`);
      setPreviewFolderCount(null);
      setPreviewPromptCount(null);
    }
  };

  const handleExecuteImport = () => {
    if (!fileContent) {
      setParseError('Please select a JSON file first.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const result = PromptStorageService.importFromJSON(fileContent, importMode);
      setIsProcessing(false);

      if (result.success) {
        onImportComplete(result.count, importMode, result.categoriesCreated);
        onClose();
      } else {
        setParseError(result.error || 'Failed to import JSON file.');
      }
    }, 200);
  };

  const handleExportJSON = () => {
    const jsonStr = PromptStorageService.exportToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptpaste_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSampleJSON = () => {
    const jsonStr = JSON.stringify(SAMPLE_JSON_EXPORT_STRUCTURE, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptpaste_sample_import.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-700 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Backup & Restore (JSON)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-700/80 bg-zinc-100/60 dark:bg-zinc-900/40 p-1">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'import'
                ? 'bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <FileUp className="w-4 h-4" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'export'
                ? 'bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <FileDown className="w-4 h-4" />
            <span>Export Backup</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          {activeTab === 'import' ? (
            <>
              {/* File Upload Zone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-300 dark:border-purple-800/60 rounded-3xl p-6 text-center bg-purple-50/40 dark:bg-purple-950/20 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileUp className="w-10 h-10 mx-auto text-purple-500 group-hover:scale-110 transition-transform mb-2" />
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {fileName ? fileName : 'Click to select JSON backup file'}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Supports folder structure format: <code className="font-mono text-purple-600 dark:text-purple-400">{"{ folders: [...] }"}</code>
                </p>
              </div>

              {/* Error Box */}
              {parseError && (
                <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 text-xs font-medium flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Invalid JSON File</span>
                    <span>{parseError}</span>
                  </div>
                </div>
              )}

              {/* Preview Success Box */}
              {previewPromptCount !== null && !parseError && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <span className="font-bold block">Ready to Import</span>
                    <span>
                      Found <strong className="font-bold">{previewPromptCount} prompts</strong> across <strong className="font-bold">{previewFolderCount} categories</strong>.
                    </span>
                  </div>
                </div>
              )}

              {/* Merge vs Replace Mode Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Import Action Strategy
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all flex items-center gap-2.5 ${
                    importMode === 'merge'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-bold'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="accent-purple-600"
                    />
                    <div>
                      <span>Merge with existing</span>
                      <span className="block text-[10px] font-normal text-zinc-500 dark:text-zinc-400">Keep current prompts</span>
                    </div>
                  </label>

                  <label className={`p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all flex items-center gap-2.5 ${
                    importMode === 'replace'
                      ? 'border-red-600 bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-200 font-bold'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="accent-red-600"
                    />
                    <div>
                      <span>Replace all prompts</span>
                      <span className="block text-[10px] font-normal text-zinc-500 dark:text-zinc-400">Overwrite current database</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sample JSON Helper */}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Need a test file?</span>
                <button
                  type="button"
                  onClick={handleDownloadSampleJSON}
                  className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample JSON</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Export Panel */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <FolderCheck className="w-4 h-4 text-emerald-500" />
                  <span>Export All Local Prompts</span>
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Downloads a JSON backup file formatted with folder categories. You can keep this as a safe local backup or transfer it to another device.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 text-xs text-purple-900 dark:text-purple-200 space-y-1">
                <span className="font-bold block flex items-center gap-1">
                  <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Export File Format:
                </span>
                <pre className="font-mono text-[11px] p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-purple-200/50 dark:border-purple-800/50 overflow-x-auto text-purple-950 dark:text-purple-100">
{`{
  "folders": [
    {
      "name": "Folder Name",
      "prompts": [
        { "title": "...", "text": "..." }
      ]
    }
  ]
}`}
                </pre>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>

          {activeTab === 'import' ? (
            <button
              disabled={!fileContent || Boolean(parseError) || isProcessing}
              onClick={handleExecuteImport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white shadow-md shadow-purple-500/25 active:scale-95 transition-all"
            >
              <FileUp className="w-4 h-4" />
              <span>{isProcessing ? 'Importing...' : 'Import Prompts'}</span>
            </button>
          ) : (
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <FileDown className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
