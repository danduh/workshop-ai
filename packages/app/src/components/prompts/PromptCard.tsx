/**
 * PromptCard Component
 * Reusable card for displaying prompt summary
 */

import { Prompt } from '../../types';
import { StatusBadge } from '../common';

interface PromptCardProps {
  /** Prompt data to display */
  prompt: Prompt;
  /** Callback when View Details is clicked */
  onView: (promptKey: string) => void;
  /** Callback when Create Version is clicked */
  onCreateVersion?: (promptKey: string) => void;
  /** Whether to show action buttons */
  showActions?: boolean;
}

/**
 * PromptCard Component
 * Displays prompt summary with metadata and actions
 */
export function PromptCard({
  prompt,
  onView,
  onCreateVersion,
  showActions = true,
}: PromptCardProps) {
  const { prompt_key, version, is_active, date_creation, model_name, description, tags, created_by } = prompt;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getModelColor = (model: string) => {
    const modelLower = model.toLowerCase();
    if (modelLower.includes('gpt-4')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    if (modelLower.includes('gpt-3')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (modelLower.includes('claude')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const displayTags = tags?.slice(0, 3) || [];
  const remainingTagsCount = (tags?.length || 0) - 3;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header with badges */}
      <div className="flex items-center gap-2 mb-3">
        <StatusBadge isActive={is_active} size="small" />
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getModelColor(model_name)}`}>
          {model_name}
        </span>
      </div>

      {/* Prompt Key as Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {prompt_key}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {description || 'No description provided'}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {displayTags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {remainingTagsCount > 0 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
              +{remainingTagsCount} more
            </span>
          )}
        </div>
      )}

      {/* Footer with metadata and actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Metadata */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
          <div>Version: {version}</div>
          <div>{formatDate(date_creation)}</div>
          <div>By: {created_by}</div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(prompt_key)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
            >
              View Details
            </button>
            
            {onCreateVersion && (
              <div className="relative group">
                <button
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  aria-label="Quick actions"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="invisible group-hover:visible absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => onCreateVersion(prompt_key)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Create New Version
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
