/**
 * MainLayout Component
 * Main application layout wrapper with header and content area
 */

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface MainLayoutProps {
  /** Child components to render in the content area */
  children: ReactNode;
}

/**
 * MainLayout Component
 * Provides consistent layout structure across all pages
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* App Title */}
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                System Prompt Management
              </h1>
            </Link>
            
            {/* Navigation */}
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Library
              </Link>
              <Link
                to="/prompts/create"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Create Prompt
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            © 2025 System Prompt Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
