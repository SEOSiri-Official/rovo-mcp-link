// src/pipeline-actions/audit.js - SEOSiri Bitbucket Pipeline Security & PII Audit Action
import fs from 'fs';
import path from 'path';

function auditDirectory(dirPath) {
  let issuesFound = 0;
  const piiPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
    /sk_live_[0-9a-zA-Z]{24}/g, // Stripe Secret Key
    /ghp_[0-9a-zA-Z]{36}/g // GitHub Personal Access Token
  ];

  function scan(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', '.output'].includes(entry.name)) {
          scan(fullPath);
        }
      } else if (entry.isFile() && /\.(js|ts|tsx|jsx|json|yml|yaml|md)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const pattern of piiPatterns) {
          if (pattern.test(content)) {
            console.error(`[SEOSiri Security Audit FAIL] Potential secret/PII leak matched in: ${fullPath}`);
            issuesFound++;
          }
        }
      }
    }
  }

  scan(dirPath);
  return issuesFound;
}

const targetDir = process.argv[2] || '.';
console.log(`[SEOSiri Pipeline Security Audit] Scanning directory: ${targetDir}`);
const totalIssues = auditDirectory(targetDir);

if (totalIssues > 0) {
  console.error(`\n❌ Pipeline Audit Failed: Found ${totalIssues} security/secret exposure risks!`);
  process.exit(1);
} else {
  console.log('\n✨ Pipeline Audit Passed: Zero secrets, PII, or security violations detected.');
  process.exit(0);
}
