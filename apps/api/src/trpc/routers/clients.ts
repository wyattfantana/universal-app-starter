import { z } from 'zod';
import { router, publicProcedure } from '../init';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from '@repo/database/schema';

export const clientsRouter = router({
  list: publicProcedure.query(async () => {
    return await getAllClients();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getClientById(input.id);
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email().optional().nullable(),
      phone: z.string().optional().nullable(),
      address: z.string().optional().nullable(),
      company: z.string().optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      return await createClient(input);
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().optional(),
        email: z.string().email().optional().nullable(),
        phone: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        company: z.string().optional().nullable(),
      })
    }))
    .mutation(async ({ input }) => {
      return await updateClient(input.id, input.data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteClient(input.id);
      return { success: true };
    }),
});
