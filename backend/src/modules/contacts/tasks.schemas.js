import { z } from 'zod/v4';

const NAME_REGEX = /^\s*[\d\-.]?\s?.{1,77}$/;

export const tasksSchema = z.object({
  id: z.number(),
  name: z.string().regex(NAME_REGEX, 'El nombre no es valido'),
  complete: z.boolean(),
});
