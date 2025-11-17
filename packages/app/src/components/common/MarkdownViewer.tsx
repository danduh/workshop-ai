/**
 * MarkdownViewer Component
 * Renders markdown content with syntax highlighting and copy functionality
 */

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNotification } from '../../contexts';

interface MarkdownViewerProps {
  /** Markdown content to render */
  content: string;
  /** Whether to show copy button */
  showCopyButton?: boolean;
}

/**
 * MarkdownViewer Component
 * Displays markdown with syntax-highlighted code blocks
 */
export function MarkdownViewer({
  content,
  showCopyButton = true,
}: MarkdownViewerProps) {
  const { showSuccess } = useNotification();
  const [copying, setCopying] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopying(true);
      showSuccess('Content copied to clipboard');
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!content || content.trim() === '') {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic text-sm">
        No content provided
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Copy Button */}
      {showCopyButton && (
        <button
          onClick={handleCopy}
          disabled={copying}
          className="absolute top-2 right-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
          aria-label="Copy content"
        >
          {copying ? (
            <>
              <svg
                className="inline w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg
                className="inline w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      )}

      {/* Markdown Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none pr-20">
        <ReactMarkdown
          components={{
            code({ className, children }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');
              const isInline = !className;

              if (!isInline && match) {
                return (
                  <SyntaxHighlighter
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    style={oneDark as any}
                    language={match[1]}
                    PreTag="div"
                  >
                    {codeString}
                  </SyntaxHighlighter>
                );
              }

              return (
                <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
