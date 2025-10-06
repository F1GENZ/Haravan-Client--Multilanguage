import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Tắt tự động refetch khi cửa sổ được focus
      retry: 3, // Thử lại truy vấn lỗi tối đa 3 lần
      retryDelay: (retryCount) => Math.min(retryCount * 1000, 10000),
      staleTime: Infinity,
    },
    mutations: {
      throwOnError: true, // Throw error nếu mutation gặp lỗi
    },
  },
});
