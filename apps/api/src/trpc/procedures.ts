import { publicProcedure, middleware } from './init';
import { TRPCError } from '@trpc/server';

// Middleware to enforce authentication
const enforceAuth = middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      userId: ctx.userId,
    },
  });
});

export const protectedProcedure = publicProcedure.use(enforceAuth);
