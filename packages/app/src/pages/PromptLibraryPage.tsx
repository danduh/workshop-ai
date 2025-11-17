/**
 * PromptLibraryPage
 * Main page for browsing and filtering prompts
 */

import { Link, useNavigate } from 'react-router-dom';
import { MainLayout, PageHeader } from '../components/layout';
import { LoadingState, ErrorBanner } from '../components/common';
import { PromptCard, FilterBar, PaginationControls } from '../components/prompts';
import { usePrompts } from '../hooks';

/**
 * PromptLibraryPage Component
 * Displays paginated list of prompts with filtering
 */
export function PromptLibraryPage() {
  const navigate = useNavigate();
  const { data, loading, error, pagination, filters, setFilters, refetch } = usePrompts();

  const hasActiveFilters = !!(
    filters.search ||
    filters.model_name ||
    (filters.tags && filters.tags.length > 0)
  );

  const handleViewPrompt = (promptKey: string) => {
    navigate(`/prompts/${promptKey}`);
  };

  const handleCreateVersion = (promptKey: string) => {
    navigate(`/prompts/${promptKey}/edit`);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ ...filters, limit, page: 1 });
  };

  return (
    <MainLayout>
      <PageHeader
        title="Prompt Library"
        subtitle="Browse and manage your system prompts"
        actions={
          <Link
            to="/prompts/create"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Prompt
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="mb-6">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onRetry={refetch} />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-6">
          <LoadingState variant="skeleton-card" count={6} />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && data.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            {hasActiveFilters ? 'No results found' : 'No prompts found'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {hasActiveFilters
              ? 'Try adjusting your filters'
              : 'Get started by creating your first prompt.'}
          </p>
          <div className="mt-6">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={() => setFilters({ page: 1, limit: filters.limit })}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-md transition-colors"
              >
                Clear filters
              </button>
            ) : (
              <Link
                to="/prompts/create"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-md transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Prompt
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Prompt Cards Grid */}
      {!loading && !error && data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {data.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onView={handleViewPrompt}
                onCreateVersion={handleCreateVersion}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            limit={pagination.limit}
            total={pagination.total}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}
    </MainLayout>
  );
}
