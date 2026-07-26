import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Star, 
  FolderPlus, 
  Tag as TagIcon, 
  Plus, 
  Trash2,
  Sliders
} from 'lucide-react';
import { Prompt } from '../types';

interface PromptEditorModalProps {
  promptToEdit: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (promptData: {
    title: string;
    text: string;
    category: string;
    tags: string[];
    isFavorite: boolean;
  }) => void;
  existingCategories: string[];
}

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({
  promptToEdit,
  isOpen,
  onClose,
  onSave,
  existingCategories,
}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; text?: string }>({});

  useEffect(() => {
    if (promptToEdit) {
      setTitle(promptToEdit.title);
      setText(promptToEdit.text);
      if (existingCategories.includes(promptToEdit.category)) {
        setCategory(promptToEdit.category);
        setIsCustomCat(false);
      } else {
        setCategory('__NEW__');
        setCustomCategory(promptToEdit.category);
        setIsCustomCat(true);
      }
      setTags(promptToEdit.tags || []);
      setIsFavorite(promptToEdit.isFavorite);
    } else {
      setTitle('');
      setText('');
      setCategory(existingCategories[0] || 'General');
      setCustomCategory('');
      setIsCustomCat(false);
      setTags([]);
      setIsFavorite(false);
    }
    setErrors({});
  }, [promptToEdit, isOpen, existingCategories]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleInsertPlaceholder = () => {
    const placeholder = '[Variable]';
    setText(prev => prev + placeholder);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; text?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!text.trim()) {
      newErrors.text = 'Prompt text cannot be empty';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalCategory = isCustomCat ? customCategory.trim() || 'General' : category;

    onSave({
      title: title.trim(),
      text: text.trim(),
      category: finalCategory,
      tags,
      isFavorite,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-700 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>{promptToEdit ? 'Edit Prompt' : 'New Prompt'}</span>
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-700 transition-colors"
              title="Toggle favorite"
            >
              <Star
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Title Field */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. Code Review Assistant"
              className={`w-full px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500 ${
                errors.title ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1 font-medium">{errors.title}</p>}
          </div>

          {/* Category Field */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Category Folder
              </label>
              <select
                value={isCustomCat ? '__NEW__' : category}
                onChange={(e) => {
                  if (e.target.value === '__NEW__') {
                    setIsCustomCat(true);
                  } else {
                    setIsCustomCat(false);
                    setCategory(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500"
              >
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__NEW__">+ Create New Category...</option>
              </select>
            </div>

            {isCustomCat && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  New Category Name
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. Marketing"
                  className="w-full px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>

          {/* Full Prompt Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Prompt Text <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleInsertPlaceholder}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                <Sliders className="w-3 h-3" />
                <span>+ Insert Variable [Var]</span>
              </button>
            </div>
            <textarea
              rows={6}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (errors.text) setErrors(prev => ({ ...prev, text: undefined }));
              }}
              placeholder="Write or paste your multi-line prompt here... Use [variable_name] for fillable placeholders."
              className={`w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border font-mono text-xs leading-relaxed text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500 ${
                errors.text ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
              }`}
            />
            <div className="flex justify-between items-center mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span>{errors.text ? <span className="text-red-500 font-medium">{errors.text}</span> : 'Supports multi-line text & brackets.'}</span>
              <span>{text.length} characters</span>
            </div>
          </div>

          {/* Tags Manager */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Tags
            </label>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <TagIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type tag & press Enter"
                  className="w-full pl-9 pr-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 rounded-2xl bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700/80 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/25 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Prompt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
