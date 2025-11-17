import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { PromptsContextProvider, NotificationProvider } from '../contexts';
import { TestNotificationsPage, TestHooksPage } from '../pages';

export function App() {
  return (
    <NotificationProvider>
      <PromptsContextProvider>
        <MainLayout>
      <Routes>
        {/* Test Routes - TEMPORARY */}
        <Route path="/test-notifications" element={<TestNotificationsPage />} />
        <Route path="/test-hooks" element={<TestHooksPage />} />

        {/* Prompt Library - Main page */}
        <Route
          path="/"
          element={
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Prompt Library
              </h2>
              <p className="text-gray-600">
                Welcome! This is the prompt library page placeholder.
              </p>
              <div className="space-y-2 mt-4">
                <p className="text-blue-600">
                  <a href="/test-notifications" className="underline">
                    → Test Notifications System
                  </a>
                </p>
                <p className="text-blue-600">
                  <a href="/test-hooks" className="underline">
                    → Test Custom Hooks (useDebounce, useForm, useConfirmation)
                  </a>
                </p>
              </div>
            </div>
          }
        />

        {/* Prompt Detail */}
        <Route
          path="/prompts/:promptKey"
          element={
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Prompt Detail
              </h2>
              <p className="text-gray-600">Placeholder for prompt detail page</p>
            </div>
          }
        />

        {/* Create Prompt */}
        <Route
          path="/prompts/create"
          element={
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Create New Prompt
              </h2>
              <p className="text-gray-600">Placeholder for create prompt form</p>
            </div>
          }
        />

        {/* Create Version */}
        <Route
          path="/prompts/:promptKey/edit"
          element={
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Create New Version
              </h2>
              <p className="text-gray-600">Placeholder for create version form</p>
            </div>
          }
        />

        {/* Version History */}
        <Route
          path="/prompts/:promptKey/versions"
          element={
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Version History
              </h2>
              <p className="text-gray-600">Placeholder for version history page</p>
            </div>
          }
        />

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600">Page not found</p>
            </div>
          }
        />
      </Routes>
        </MainLayout>
      </PromptsContextProvider>
    </NotificationProvider>
  );
}

export default App;
