import { JSONRPCRequest, MCPResponse } from './types.js';

export class SEOSiriMCPBridge {
  public static formatJSONRPCResponse(id: string | number | undefined, contentText: string, complianceTier: string): MCPResponse {
    return {
      jsonrpc: '2.0',
      id: id ?? 1,
      success: true,
      result: {
        content: [
          {
            type: 'text',
            text: contentText
          }
        ],
        complianceTier: complianceTier as any,
        cachedAtEdge: false
      }
    };
  }

  public static formatJSONRPCError(id: string | number | undefined, errorMsg: string): MCPResponse {
    return {
      jsonrpc: '2.0',
      id: id ?? 1,
      success: false,
      error: errorMsg
    };
  }
}
