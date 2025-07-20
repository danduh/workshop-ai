import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';

export const useApiQuery = <T>(key: string[], url: string) => {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => apiClient.get(url).then(response => response.data),
  });
};

export const useApiMutation = <TData, TVariables>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  onSuccessInvalidate?: string[]
) => {
  const queryClient = useQueryClient();
  
  return useMutation<TData, Error, TVariables>({
    mutationFn: (data: TVariables) => {
      switch (method) {
        case 'POST':
          return apiClient.post(url, data).then(response => response.data);
        case 'PUT':
          return apiClient.put(url, data).then(response => response.data);
        case 'PATCH':
          return apiClient.patch(url, data).then(response => response.data);
        case 'DELETE':
          return apiClient.delete(url).then(response => response.data);
        default:
          return apiClient.post(url, data).then(response => response.data);
      }
    },
    onSuccess: () => {
      if (onSuccessInvalidate) {
        onSuccessInvalidate.forEach(key => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    },
  });
};
