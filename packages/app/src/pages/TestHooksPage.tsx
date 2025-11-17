/**
 * Test page for custom hooks
 * Demonstrates useDebounce, useForm, and useConfirmation
 */

import { useState } from 'react';
import { useDebounce, useForm, useConfirmation } from '../hooks';
import type { ValidationSchema } from '../hooks';

interface TestFormData extends Record<string, string> {
  name: string;
  email: string;
  message: string;
}

const initialValues: TestFormData = {
  name: '',
  email: '',
  message: '',
};

const validationSchema: ValidationSchema<TestFormData> = {
  name: (value) => {
    if (!value || value.length < 2) {
      return 'Name must be at least 2 characters';
    }
    return undefined;
  },
  email: (value) => {
    if (!value) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    return undefined;
  },
  message: (value) => {
    if (!value || value.length < 10) {
      return 'Message must be at least 10 characters';
    }
    return undefined;
  },
};

export function TestHooksPage() {
  // useDebounce test
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // useForm test
  const form = useForm<TestFormData>(initialValues, validationSchema);

  // useConfirmation test
  const { confirm, ConfirmDialog } = useConfirmation();

  const handleFormSubmit = async (values: TestFormData) => {
    const confirmed = await confirm({
      title: 'Submit Form?',
      message: `Are you sure you want to submit this form with name "${values.name}"?`,
      confirmText: 'Yes, Submit',
      cancelText: 'Cancel',
      danger: false,
    });

    if (confirmed) {
      console.log('Form submitted:', values);
      alert('Form submitted successfully! Check console for values.');
      form.resetForm();
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Item?',
      message: 'This action cannot be undone. Are you sure you want to delete this item?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      danger: true,
    });

    if (confirmed) {
      alert('Item deleted!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      <h1 className="text-3xl font-bold text-gray-900">Test Custom Hooks</h1>

      {/* useDebounce Test */}
      <section className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          useDebounce Hook
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type to search (500ms debounce):
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Start typing..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">
              <strong>Immediate value:</strong> {searchTerm || '(empty)'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Debounced value:</strong> {debouncedSearch || '(empty)'}
            </p>
          </div>
        </div>
      </section>

      {/* useForm Test */}
      <section className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          useForm Hook (with validation)
        </h2>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.values.name}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.touched.name && form.errors.name && (
              <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.values.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.touched.email && form.errors.email && (
              <p className="mt-1 text-sm text-red-600">{form.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              name="message"
              value={form.values.message}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.touched.message && form.errors.message && (
              <p className="mt-1 text-sm text-red-600">{form.errors.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit (with confirmation)
            </button>
            <button
              type="button"
              onClick={form.resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded text-sm">
            <p className="text-gray-600">
              <strong>Form Status:</strong> {form.isDirty ? 'Modified' : 'Pristine'}
            </p>
          </div>
        </form>
      </section>

      {/* useConfirmation Test */}
      <section className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          useConfirmation Hook
        </h2>
        <div className="space-y-3">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Something (Danger Confirmation)
          </button>
          <p className="text-sm text-gray-600">
            Click the button above to see a danger confirmation dialog.
          </p>
        </div>
      </section>

      {/* Render confirmation dialog */}
      <ConfirmDialog />
    </div>
  );
}
