import { z } from 'zod';
import { insertReportSchema, reports } from './schema';

export const api = {
  reports: {
    list: {
      method: 'GET' as const,
      path: '/api/reports',
      responses: {
        200: z.array(z.custom<typeof reports.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/reports/:id',
      responses: {
        200: z.custom<typeof reports.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/reports',
      input: insertReportSchema,
      responses: {
        201: z.custom<typeof reports.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
