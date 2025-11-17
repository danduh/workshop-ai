/**
 * Test page to demonstrate notification system
 * This can be removed later - just for testing
 */

import { useNotification } from '../contexts';

export function TestNotificationsPage() {
  const { showSuccess, showError, showInfo, showWarning } = useNotification();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Test Notifications
      </h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Success Notification
          </h2>
          <button
            onClick={() => showSuccess('Operation completed successfully!')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Show Success
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Error Notification
          </h2>
          <button
            onClick={() =>
              showError('An error occurred. Please try again later.')
            }
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Show Error
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Info Notification
          </h2>
          <button
            onClick={() =>
              showInfo('This is some helpful information for you.')
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Show Info
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Warning Notification
          </h2>
          <button
            onClick={() =>
              showWarning('Warning: This action may have consequences.')
            }
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Show Warning
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Multiple Notifications
          </h2>
          <button
            onClick={() => {
              showInfo('First notification');
              setTimeout(() => showSuccess('Second notification'), 300);
              setTimeout(() => showWarning('Third notification'), 600);
              setTimeout(() => showError('Fourth notification'), 900);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Show Multiple (Stacked)
          </button>
        </div>
      </div>
    </div>
  );
}
