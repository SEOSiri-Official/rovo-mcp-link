import { ClientPolicy, IndustryCategory } from './types.js';

export class SEOSiriSecurityGateway {
  private static PII_PATTERNS = {
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    creditCard: /\b(?:\d{4}[ -]?){3}\d{4}\b/g,
    ipAddress: /\b(?:192\.168|10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b/g,
    dob: /\b(0[1-9]|1[0-2])[\/.-](0[1-9]|[12]\d|3[01])[\/.-](19|20)\d{2}\b/g,
    jwtToken: /eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g,
    apiKey: /(?:api[_-]?key|secret|token|password)\s*[:=]\s*["']?([A-Za-z0-9_-]{16,})["']?/gi
  };

  private static PROMPT_INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /override\s+system\s+(prompt|interlocks?)/i,
    /reveal\s+(api[_-]?key|secret|master_secret)/i,
    /drop\s+database|delete\s+all/i
  ];

  private static SOURCE_CODE_MARKERS = [
    /BEGIN\s+RSA\s+PRIVATE\s+KEY[\s\S]*?END\s+RSA\s+PRIVATE\s+KEY/gi,
    /process\.env\.[A-Z0-9_]+/g,
    /AWS_SECRET_ACCESS_KEY|DATABASE_URL/gi
  ];

  // 1. Real-Time Data Masking & Industry-Agnostic Filtering
  public static sanitizePayload(rawText: string, policy: ClientPolicy): string {
    let sanitized = rawText;

    // Redact API Keys & JWT Tokens globally
    sanitized = sanitized.replace(this.PII_PATTERNS.apiKey, 'api_key: "[REDACTED_SECRET]"');
    sanitized = sanitized.replace(this.PII_PATTERNS.jwtToken, '[REDACTED_JWT_TOKEN]');

    // Contextual Data Scoping: Scrub internal source code markers
    if (policy.scopeSourceCodeFilter !== false) {
      for (const pattern of this.SOURCE_CODE_MARKERS) {
        sanitized = sanitized.replace(pattern, '[REDACTED_SOURCE_MARKER]');
      }
    }

    // Strict PII / PHI Masking
    if (policy.maskPII) {
      sanitized = sanitized.replace(this.PII_PATTERNS.ssn, '[REDACTED_SSN]');
      sanitized = sanitized.replace(this.PII_PATTERNS.email, '[REDACTED_EMAIL]');
      sanitized = sanitized.replace(this.PII_PATTERNS.creditCard, '[REDACTED_PCI_CARD]');
      sanitized = sanitized.replace(this.PII_PATTERNS.dob, '[REDACTED_DOB]');
    }

    // Adaptive Industry Verticals
    switch (policy.industryCategory) {
      case 'FINANCE':
        sanitized = sanitized.replace(/\b\d{9,18}\b/g, '[REDACTED_BANK_ACCOUNT]');
        break;
      case 'HEALTHCARE':
        sanitized = sanitized.replace(/\b(?:MRN|NPI|DEA)[:\s]*\d{7,10}\b/gi, '[REDACTED_HIPAA_IDENTIFIER]');
        break;
      case 'SOFTWARE':
        sanitized = sanitized.replace(this.PII_PATTERNS.ipAddress, '[INTERNAL_VLAN_IP]');
        break;
      case 'GENERAL':
      default:
        break;
    }

    return sanitized;
  }

  // 2. Prompt-Level Access Intervention (AI Firewall)
  public static inspectPromptSafety(prompt: string): { safe: boolean; reason?: string } {
    for (const pattern of this.PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(prompt)) {
        return {
          safe: false,
          reason: `AI Firewall Interception: Prompt matched prohibited override pattern [${pattern.source}]`
        };
      }
    }
    return { safe: true };
  }
}
