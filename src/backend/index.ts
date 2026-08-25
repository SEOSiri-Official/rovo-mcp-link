import { SEOSiriSecurityGateway } from './security.js';
import { SEOSiriMCPBridge } from './mcp-bridge.js';
import { Env, MCPContextPayload, MCPResponse } from './types.js';

// In-Memory Edge Cache for Repeated Prompt Optimization
const PROMPT_EDGE_CACHE = new Map<string, string>();

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-SEOSiri-Token, x-seosiri-key, Mcp-Method',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 1. Health Probe Endpoint
    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'HEALTHY',
        service: 'SEOSiri Rovo-MCP Link Gateway',
        subdomain_isolation: 'rovomcp.seosiri.com',
        version: '1.0.0',
        supported_transports: ['SSE', 'JSON-RPC_HTTP', 'STDIO'],
        supported_clients: ['CURSOR', 'CLAUDE_DESKTOP', 'ATLASSIAN_ROVO', 'VS_CODE'],
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // 2. Server-Sent Events (SSE) Transport Endpoint (/sse)
    if (url.pathname === '/sse' && request.method === 'GET') {
      const sseBody = `event: endpoint\ndata: https://rovomcp.seosiri.com/v1/mcp\n\nevent: message\ndata: {"jsonrpc":"2.0","method":"notifications/initialized","params":{"gateway":"rovomcp.seosiri.com","status":"CONNECTED"}}\n\n`;

      return new Response(sseBody, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          ...corsHeaders
        }
      });
    }

    // 3. Bidirectional MCP Pipeline & Message Handler (/v1/mcp & /messages)
    if ((url.pathname === '/v1/mcp' || url.pathname === '/messages') && request.method === 'POST') {
      try {
        const authToken = request.headers.get('X-SEOSiri-Token');
        const configuredSecret = env.SEOSIRI_AUTH_SECRET || 'production_fallback_handshake_hash_token';

        // Token-Based Handshake Validation
        if (authToken && authToken !== configuredSecret) {
          return new Response(JSON.stringify(
            SEOSiriMCPBridge.formatJSONRPCError(1, 'Unauthorized gateway access. Invalid X-SEOSiri-Token.')
          ), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const body = (await request.json()) as MCPContextPayload;
        const rawPayload = body.contextData || '';
        const clientPolicy = body.policy || { maskPII: true, industryCategory: 'GENERAL' };

        // AI Prompt Firewall Inspection
        const safetyCheck = SEOSiriSecurityGateway.inspectPromptSafety(rawPayload);
        if (!safetyCheck.safe) {
          return new Response(JSON.stringify(
            SEOSiriMCPBridge.formatJSONRPCError(1, safetyCheck.reason || 'AI Firewall Intercept')
          ), {
            status: 403,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Prompt Optimization Cache Check
        const cacheKey = `${clientPolicy.industryCategory}_${rawPayload.substring(0, 80)}`;
        if (PROMPT_EDGE_CACHE.has(cacheKey)) {
          const cachedResult = PROMPT_EDGE_CACHE.get(cacheKey)!;
          const cachedResponse = SEOSiriMCPBridge.formatJSONRPCResponse(1, cachedResult, clientPolicy.industryCategory);
          cachedResponse.result!.cachedAtEdge = true;

          return new Response(JSON.stringify(cachedResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Real-Time Zero-Latency PII/PHI Sanitization Loop
        const sanitizedText = SEOSiriSecurityGateway.sanitizePayload(rawPayload, clientPolicy);

        if (rawPayload.length > 20) {
          PROMPT_EDGE_CACHE.set(cacheKey, sanitizedText);
        }

        const responsePayload = SEOSiriMCPBridge.formatJSONRPCResponse(
          1,
          sanitizedText,
          clientPolicy.industryCategory
        );

        return new Response(JSON.stringify(responsePayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      } catch (error: any) {
        return new Response(JSON.stringify(
          SEOSiriMCPBridge.formatJSONRPCError(1, error.message || 'Internal Gateway Exception')
        ), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // 4. Browser Navigation Fallback -> Redirect to Documentation
    const acceptHeader = request.headers.get('Accept') || '';
    if ((url.pathname === '/' || url.pathname === '') && acceptHeader.includes('text/html')) {
      return Response.redirect('https://www.seosiri.com/2026/07/seosiri-mcp-servers.html', 301);
    }

    return new Response(JSON.stringify({ error: 'Endpoint or method mismatch' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};
