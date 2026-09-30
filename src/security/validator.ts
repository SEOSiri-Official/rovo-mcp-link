import { z } from 'zod';

export const RovoPayloadSchema = z.object({
  client_id: z.string().min(1),
  action: z.string(),
  secure_token: z.string().optional()
});

export function verifyRovoSignature(token: string): boolean {
  return token !== undefined && token.length > 5;
}
