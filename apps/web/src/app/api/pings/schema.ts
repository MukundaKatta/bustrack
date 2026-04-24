import { z } from "zod";

export const pingBodySchema = z.object({
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  speed: z.number().nonnegative().optional(),
  recordedAt: z.string().datetime({ offset: true }).optional(),
});
