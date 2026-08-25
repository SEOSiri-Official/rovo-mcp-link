import { ClientPolicy } from './types.js';

export class KVPolicyClient {
  public static createDefaultPolicy(): ClientPolicy {
    return {
      maskPII: true,
      industryCategory: 'SOFTWARE'
    };
  }
}
