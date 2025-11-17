/**
 * LoadingState Component
 * Provides loading indicators (spinner and skeleton screens)
 */

interface LoadingStateProps {
  /** Type of loading indicator to display */
  variant: 'spinner' | 'skeleton-card' | 'skeleton-text';
  /** Number of skeleton items to display (for skeleton variants) */
  count?: number;
}

/**
 * LoadingState Component
 * Shows loading indicators with smooth animations
 */
export function LoadingState({ variant, count = 1 }: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div className="flex justify-center items-center py-12" role="status" aria-label="Loading">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === 'skeleton-card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse"
            role="status"
            aria-label={`Loading card ${index + 1}`}
          >
            {/* Header with badge and chip */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            
            {/* Title */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            
            {/* Description lines */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
            
            {/* Tags */}
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
              <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'skeleton-text') {
    return (
      <div className="space-y-2 animate-pulse" role="status" aria-label="Loading text">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
          ></div>
        ))}
      </div>
    );
  }

  return null;
}
