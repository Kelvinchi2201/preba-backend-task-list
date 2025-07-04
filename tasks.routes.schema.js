import { z } from 'zod/v4';
import { tasksSchema } from './tasks.schemas.js';

const tasksIdSchema = z
  .string()
  .transform((val) => Number(val))
  .refine((val) => !isNaN(val), 'El id debe ser un numero');

export const createTaskRouteSchema = {
  params: z.object({}),
  body: tasksSchema.omit({ id: true, complete: true }),
  queries: z.object({}),
};

export const deleteTaskRouteSchema = {
  params: z.object({ id: tasksIdSchema }),
  body: z.object({}),
  queries: z.object({}),
};

export const updateTaskRouteSchema = {
  params: z.object({ id: tasksIdSchema }),
  body: tasksSchema.omit({ id: true, name: true }),
  queries: z.object({}),
};
