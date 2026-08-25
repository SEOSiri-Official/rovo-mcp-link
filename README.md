# SEOSiri Rovo-MCP Link Gateway (`rovomcp.seosiri.com`)

> 📖 **Official Architecture & Documentation:** [SEOSiri Developer Portal](https://developers.seosiri.com/) | [Central MCP Directory](https://www.seosiri.com/2026/07/seosiri-mcp-servers.html) | [Corporate Gateway](https://seosiri.com/)

A Zero-Trust Enterprise Gateway bridging **Atlassian Rovo Agents**, **Jira**, **Confluence**, and **External IDE Clients** (Cursor, Claude Desktop, VS Code) to SEOSiri's 16-Server Model Context Protocol (MCP) suite.

## 🛡️ Core Security & Governance
- **Real-Time Data Masking:** Edge-level regex redaction for SSN, credit cards, emails, and phone numbers.
- **Industry-Agnostic Compliance:** Dynamically adapts rules across Software (VLAN/IP), Finance (PCI-DSS), and Healthcare (HIPAA PHI).
- **Contextual Data Scoping:** Filters sensitive internal source code and structural markers before external transmission.
- **Token-Based Handshake Validation:** Verifies incoming `X-SEOSiri-Token` headers to eliminate unauthorized cross-tenant spoofing.
- **Prompt-Level Access Intervention:** AI Firewall intercepts prompt injections and override exploits.

## 🌐 Connectivity & Protocol Orchestration
- **Bidirectional MCP Bridge:** Connects Cursor, Claude, and VS Code with Jira issue contexts and Confluence macros.
- **JSON-RPC Protocol Standardization:** Translates incoming tool calls into strict JSON-RPC 2.0 schemas.
- **Subdomain Infrastructure Isolation:** Dedicated high-throughput edge routing via `rovomcp.seosiri.com`.
- **Regional Data Compliance Routing:** Honors geographic data residency constraints.

## 📊 Platform Management & Economics
- **Zero-Cost Database Storage:** Persists tenant profiles inside Atlassian's native `@forge/bridge` storage vault.
- **Stateless Backend Processing:** Configuration-free cloud workers eliminating cold starts and database fees.
- **Adaptive Admin Controls:** Real-time compliance adjustment sliders embedded in Jira dashboards.
- **Edge-Cached Prompt Optimization:** Caches redundant queries at Cloudflare edge to reduce external LLM API costs.

## Quickstart
```bash
npm install
npm run build:worker
npx wrangler deploy  License
Distributed under the MIT License.
