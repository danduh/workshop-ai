import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { useApiQuery, useApiMutation } from './useApi';
import { api } from '../services/api';

// Mock the api service
jest.mock('../services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useApiQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: '1', name: 'test' };
    mockedApi.get.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(
      () => useApiQuery<typeof mockData>(['test'], '/test'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(mockedApi.get).toHaveBeenCalledWith('/test');
  });

  it('should handle query errors', async () => {
    const mockError = new Error('Network error');
    mockedApi.get.mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () => useApiQuery(['test'], '/test'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
  });
});

describe('useApiMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should perform POST mutation successfully', async () => {
    const mockData = { id: '1', name: 'test' };
    const mockInput = { name: 'test' };
    mockedApi.post.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(
      () => useApiMutation<typeof mockData, typeof mockInput>('/test', 'POST'),
      { wrapper: createWrapper() }
    );

    result.current.mutate(mockInput);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(mockedApi.post).toHaveBeenCalledWith('/test', mockInput);
  });

  it('should perform PUT mutation successfully', async () => {
    const mockData = { id: '1', name: 'updated' };
    const mockInput = { name: 'updated' };
    mockedApi.put.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(
      () => useApiMutation<typeof mockData, typeof mockInput>('/test', 'PUT'),
      { wrapper: createWrapper() }
    );

    result.current.mutate(mockInput);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(mockedApi.put).toHaveBeenCalledWith('/test', mockInput);
  });

  it('should perform PATCH mutation successfully', async () => {
    const mockData = { id: '1', name: 'patched' };
    const mockInput = { name: 'patched' };
    mockedApi.patch.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(
      () => useApiMutation<typeof mockData, typeof mockInput>('/test', 'PATCH'),
      { wrapper: createWrapper() }
    );

    result.current.mutate(mockInput);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(mockedApi.patch).toHaveBeenCalledWith('/test', mockInput);
  });

  it('should perform DELETE mutation successfully', async () => {
    const mockData = { success: true };
    mockedApi.delete.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(
      () => useApiMutation<typeof mockData, void>('/test', 'DELETE'),
      { wrapper: createWrapper() }
    );

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(mockedApi.delete).toHaveBeenCalledWith('/test');
  });

  it('should invalidate queries on successful mutation', async () => {
    const mockData = { id: '1', name: 'test' };
    const mockInput = { name: 'test' };
    mockedApi.post.mockResolvedValueOnce({ data: mockData });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => useApiMutation<typeof mockData, typeof mockInput>(
        '/test', 
        'POST', 
        ['test-queries']
      ),
      { wrapper }
    );

    result.current.mutate(mockInput);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['test-queries'] });
  });

  it('should handle mutation errors', async () => {
    const mockError = new Error('Mutation failed');
    const mockInput = { name: 'test' };
    mockedApi.post.mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () => useApiMutation<any, typeof mockInput>('/test', 'POST'),
      { wrapper: createWrapper() }
    );

    result.current.mutate(mockInput);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
  });
});
