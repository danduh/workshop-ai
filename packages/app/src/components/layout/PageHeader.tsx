/**
 * PageHeader Component
 * Reusable page header with title, subtitle, actions, and back navigation
 */

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional action buttons (slot) */
  actions?: ReactNode;
  /** Optional back navigation link */
  backLink?: string;
}

/**
 * PageHeader Component
 * Provides consistent page header across all pages
 */
export function PageHeader({ title, subtitle, actions, backLink }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Back Link */}
          {backLink && (
            <Link
              to={backLink}
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </Link>
          )}
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Actions Slot */}
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
