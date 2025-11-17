/**
 * MarkdownEditor Component
 * Split-view markdown editor with preview
 */

import { useState, useRef, KeyboardEvent } from 'react';
import { MarkdownViewer } from './MarkdownViewer';

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  showToolbar?: boolean;
};

/**
 * MarkdownEditor Component
 * Provides a split-view editor with markdown preview
 */
export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Enter markdown content...',
  minHeight = '300px',
  maxHeight = '600px',
  showToolbar = true,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Restore selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      insertMarkdown('  ');
    }
  };

  const toolbarButtons = [
    {
      label: 'Bold',
      icon: 'B',
      action: () => insertMarkdown('**', '**'),
    },
    {
      label: 'Italic',
      icon: 'I',
      action: () => insertMarkdown('*', '*'),
    },
    {
      label: 'Code',
      icon: '</>',
      action: () => insertMarkdown('`', '`'),
    },
    {
      label: 'Heading',
      icon: 'H1',
      action: () => insertMarkdown('## '),
    },
    {
      label: 'List',
      icon: '•',
      action: () => insertMarkdown('- '),
    },
    {
      label: 'Link',
      icon: '🔗',
      action: () => insertMarkdown('[', '](url)'),
    },
  ];

  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  const charCount = value.length;

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      {showToolbar && (
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 px-3 py-2">
          <div className="flex items-center gap-2">
            {toolbarButtons.map((button) => (
              <button
                key={button.label}
                type="button"
                onClick={button.action}
                className="px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title={button.label}
              >
                {button.icon}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor/Preview Content */}
      <div
        className="bg-white dark:bg-gray-900"
        style={{ minHeight, maxHeight }}
      >
        {activeTab === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-full p-4 resize-none focus:outline-none focus:ring-0 border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            style={{ minHeight, maxHeight }}
          />
        ) : (
          <div
            className="p-4 overflow-auto"
            style={{ minHeight, maxHeight }}
          >
            {value ? (
              <MarkdownViewer content={value} />
            ) : (
              <p className="text-gray-400 dark:text-gray-500 italic">
                Nothing to preview
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer with stats */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>
            {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount}{' '}
            {charCount === 1 ? 'character' : 'characters'}
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            Markdown supported
          </span>
        </div>
      </div>
    </div>
  );
}
