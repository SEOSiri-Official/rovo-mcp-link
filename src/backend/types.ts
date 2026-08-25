export type IndustryCategory = 'SOFTWARE' | 'FINANCE' | 'HEALTHCARE' | 'GENERAL';

export interface ClientPolicy {
  maskPII: boolean;
  industryCategory: IndustryCategory;
  scopeSourceCodeFilter?: boolean;
  enforcePromptFirewall?: boolean;
}

export interface MCPContextPayload {
  contextData: string;
  policy: ClientPolicy;
  callerIdentity?: string;
  clientType?: 'CURSOR' | 'CLAUDE_DESKTOP' | 'ATLASSIAN_ROVO' | 'VS_CODE';
  targetRegion?: 'US' | 'EU' | 'APAC' | 'GLOBAL';
}

export interface JSONRPCRequest {
  jsonrpc: '2.0';
  id?: string | number;
  method: string;
  params?: Record<string, any>;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id?: string | number;
  success: boolean;
  result?: {
    content: Array<{ type: string; text: string }>;
    cachedAtEdge?: boolean;
    complianceTier?: IndustryCategory;
  };
  error?: string;
}

export interface Env {
  SEOSIRI_AUTH_SECRET: string;
}
