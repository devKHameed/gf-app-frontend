import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // query options
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});
