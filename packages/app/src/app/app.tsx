import { Route, Routes } from 'react-router-dom';
import { PromptsContextProvider, NotificationProvider } from '../contexts';
import { PromptLibraryPage, TestNotificationsPage, TestHooksPage } from '../pages';

export function App() {
  return (
    <NotificationProvider>
      <PromptsContextProvider>
      <Routes>
        {/* Test Routes - TEMPORARY */}
        <Route path="/test-notifications" element={<TestNotificationsPage />} />
        <Route path="/test-hooks" element={<TestHooksPage />} />

        {/* Prompt Library - Main page */}
        <Route path="/" element={<PromptLibraryPage />} />

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
      </PromptsContextProvider>
    </NotificationProvider>
  );
}

export default App;
