/**
 * StatusBadge Component
 * Displays active/inactive status indicator for prompts
 */

interface StatusBadgeProps {
  /** Whether the prompt is active */
  isActive: boolean;
  /** Optional size variant */
  size?: 'small' | 'medium' | 'large';
}

/**
 * StatusBadge Component
 * Shows a green "ACTIVE" badge for active prompts or gray indicator for inactive
 */
export function StatusBadge({ isActive, size = 'medium' }: StatusBadgeProps) {
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base',
  };

  const baseClasses = 'inline-flex items-center font-semibold rounded-full uppercase tracking-wide';

  if (isActive) {
    return (
      <span
        className={`${baseClasses} ${sizeClasses[size]} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}
        role="status"
        aria-label="Active status"
      >
        Active
      </span>
    );
  }

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400`}
      role="status"
      aria-label="Inactive status"
    >
      Inactive
    </span>
  );
}
