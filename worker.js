export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({
        status: "HEALTHY",
        service: "SEOSiri Atlassian Rovo Forge MCP Bridge",
        subdomain: "rovomcp.seosiri.com",
        dual_transport: ["stdio", "sse", "forge"],
        circuit_breaker: "ACTIVE"
      }), { headers: { "Content-Type": "application/json" } });
    }
    return new Response("SEOSiri Rovo MCP Link Active", { status: 200 });
  }
};
