import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { api } from '../services/api';

export const useApiQuery = <T>(key: string[], url: string) => {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => api.get(url).then((response: AxiosResponse<T>) => response.data),
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
          return api.post(url, data).then((response: AxiosResponse<TData>) => response.data);
        case 'PUT':
          return api.put(url, data).then((response: AxiosResponse<TData>) => response.data);
        case 'PATCH':
          return api.patch(url, data).then((response: AxiosResponse<TData>) => response.data);
        case 'DELETE':
          return api.delete(url).then((response: AxiosResponse<TData>) => response.data);
        default:
          return api.post(url, data).then((response: AxiosResponse<TData>) => response.data);
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
