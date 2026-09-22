# SEOSiri Rovo-MCP Link Gateway (`rovomcp.seosiri.com`)

> 📖 **Official Architecture & Documentation:** [SEOSiri Developer Portal](https://developers.seosiri.com/) | [Central Directory Hub](https://www.seosiri.com/atlassian-consulting#guide) | [Atlassian Consulting & Services](https://www.seosiri.com/atlassian-consulting) | [Corporate Gateway](https://seosiri.com/)

A dedicated, paid enterprise security gateway and Model Context Protocol (MCP) bridge connecting **Atlassian Rovo Agents**, **Jira**, **Confluence**, and **External IDE Clients** (Cursor, Claude Desktop, VS Code) to live corporate systems with zero risk of data leakage.

## 🛡️ Core Security & Governance
- **Real-Time Data Masking:** Edge-level regex scrubbing for SSN, credit cards, emails, and internal IP addresses.
- **Industry-Agnostic Filtering:** Dynamically enforces compliance tiers across Software (VLANs), Finance (PCI-DSS), and Healthcare (HIPAA PHI).
- **Contextual Data Scoping:** Filters sensitive internal source code and structural markers before external transmission.
- **Token-Based Handshake Validation:** Secures communications using custom `X-SEOSiri-Token` header verification.
- **Prompt-Level AI Firewall:** Intercepts prompt injections and system override attempts before model processing.

## 🌐 Connectivity & Protocol Orchestration
- **Bidirectional MCP Bridge:** Connects external IDEs with Jira issue contexts and Confluence macros.
- **JSON-RPC Protocol Standardization:** Parses incoming tool calls into universally structured JSON-RPC 2.0 schemas.
- **Subdomain Infrastructure Isolation:** Dedicated high-throughput edge routing via `rovomcp.seosiri.com`.
- **Regional Data Compliance Routing:** Restricts edge execution to specific geographic boundaries to satisfy data residency rules.

## 📊 Platform Management & Economics
- **Zero-Cost Database Storage:** Persists tenant profiles inside Atlassian's native `@forge/bridge` storage vault.
- **Stateless Backend Processing:** Runs configuration-free operations to maximize concurrent user limits on the edge.
- **Integrated Multi-Tenant Security:** Separates customer configuration records natively through isolated cloud storage partitions.
- **Adaptive Admin Controls:** Adjusts scrubbing intensity via standard dropdown selectors embedded in Jira dashboards.
- **Edge-Cached Prompt Optimization:** Lowers corporate LLM API bills by saving and reusing redundant technical queries.

## 📦 Installation & Deployment

### 1. Edge Worker (Cloudflare)
```bash
npm install
npm run build:worker
npx wrangler deploy -c wrangler.toml
```

### 2. Atlassian Forge Paid App
```bash
forge register
forge deploy -e production
forge install -e production
```

## 💳 Commercial Licensing, Consulting & Atlassian Billing
This application is distributed as a **Paid Commercial App** on the Atlassian Marketplace with per-user monthly billing (\$5–\$15/user/month) managed natively through Atlassian.

For custom enterprise Forge development, cloud migrations, and private tenant integrations, explore our [Atlassian Consulting Guide](https://www.seosiri.com/atlassian-consulting#guide).

## License
Distributed under the [MIT License](https://github.com/SEOSiri-Official/rovo-mcp-link/blob/main/LICENSE).
