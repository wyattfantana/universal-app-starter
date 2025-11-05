import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../api/src/trpc/router';

export const trpc = createTRPCReact<AppRouter>();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${API_URL}/trpc`,
      // You can add headers here for authentication
      // headers: () => ({
      //   authorization: getAuthToken(),
      // }),
    }),
  ],
});
