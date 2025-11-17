/**
 * useConfirmation Hook
 * Manages confirmation dialog state and provides confirm function
 * Returns both the confirm function and ConfirmDialog component to render
 */

import { useState, useCallback } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * Confirmation options
 */
interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

/**
 * useConfirmation Hook
 * @returns confirm function and ConfirmDialog component
 */
export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    danger: false,
  });
  const [resolver, setResolver] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  /**
   * Show confirmation dialog and return a promise
   */
  const confirm = useCallback(
    (opts: ConfirmationOptions): Promise<boolean> => {
      setOptions({
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        danger: false,
        ...opts,
      });
      setIsOpen(true);

      return new Promise<boolean>((resolve) => {
        setResolver({ resolve });
      });
    },
    []
  );

  /**
   * Handle confirmation
   */
  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolver) {
      resolver.resolve(true);
      setResolver(null);
    }
  }, [resolver]);

  /**
   * Handle cancellation
   */
  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolver) {
      resolver.resolve(false);
      setResolver(null);
    }
  }, [resolver]);

  /**
   * ConfirmDialog Component
   */
  const ConfirmDialog = () => (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`flex-shrink-0 rounded-full p-2 ${
                options.danger ? 'bg-red-100' : 'bg-yellow-100'
              }`}
            >
              <ExclamationTriangleIcon
                className={`h-6 w-6 ${
                  options.danger ? 'text-red-600' : 'text-yellow-600'
                }`}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold text-gray-900 mb-2">
                {options.title}
              </DialogTitle>
              <p className="text-sm text-gray-600">{options.message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {options.cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                options.danger
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {options.confirmText}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );

  return {
    confirm,
    ConfirmDialog,
  };
}
