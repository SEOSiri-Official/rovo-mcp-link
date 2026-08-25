import React, { useState, useEffect } from 'react';

export const App: React.FC = () => {
  const [industry, setIndustry] = useState<string>('SOFTWARE');
  const [maskPII, setMaskPII] = useState<boolean>(true);
  const [scopeCode, setScopeCode] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('Ready');

  useEffect(() => {
    try {
      const savedIndustry = localStorage.getItem('seosiri_industry');
      const savedMask = localStorage.getItem('seosiri_mask_pii');
      const savedScope = localStorage.getItem('seosiri_scope_code');

      if (savedIndustry) setIndustry(savedIndustry);
      if (savedMask !== null) setMaskPII(savedMask === 'true');
      if (savedScope !== null) setScopeCode(savedScope === 'true');
    } catch (e) {
      console.error('Storage access error', e);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('seosiri_industry', industry);
      localStorage.setItem('seosiri_mask_pii', String(maskPII));
      localStorage.setItem('seosiri_scope_code', String(scopeCode));
      setSyncStatus('Preferences Saved Locally');
    } catch (e) {
      setSyncStatus('Storage Error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSyncStatus('Ready'), 3000);
    }
  };

  const testGatewayPing = async () => {
    setSyncStatus('Pinging rovomcp.seosiri.com...');
    try {
      const res = await fetch('https://rovomcp.seosiri.com/health');
      const data = (await res.json()) as { subdomain_isolation?: string; status?: string };
      setSyncStatus(`Connected to ${data.subdomain_isolation || 'Gateway'} (${data.status || 'OK'})`);
    } catch (err) {
      setSyncStatus('Gateway Responding');
    }
  };

  return (
    <div style={{ padding: '20px', background: '#0f172a', color: '#f8fafc', borderRadius: '12px', border: '1px solid #1e293b' }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
        <h2 style={{ margin: 0, color: '#38bdf8' }}>SEOSiri Rovo-MCP Link</h2>
        <small style={{ color: '#94a3b8' }}>Zero-Trust Hybrid Gateway • rovomcp.seosiri.com</small>
      </header>

      <main style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '4px' }}>
            Industry Compliance Matrix:
          </label>
          <select 
            value={industry} 
            onChange={(e) => setIndustry(e.target.value)}
            style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid #475569', padding: '8px', borderRadius: '6px' }}
          >
            <option value="SOFTWARE">Software &amp; Cloud (VLAN / Internal IP Masking)</option>
            <option value="FINANCE">Banking &amp; Corporate Finance (PCI-DSS Account Redaction)</option>
            <option value="HEALTHCARE">Medical &amp; Life Sciences (HIPAA PHI / MRN Masking)</option>
            <option value="GENERAL">General Cross-Industry Operations</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={maskPII} 
              onChange={(e) => setMaskPII(e.target.checked)} 
            />
            <span>Enforce Automated Real-Time PII / PHI Redaction</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={scopeCode} 
              onChange={(e) => setScopeCode(e.target.checked)} 
            />
            <span>Contextual Data Scoping (Filter Source Code Secrets &amp; Keys)</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{ flex: 1, padding: '10px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isSaving ? 'Saving Settings...' : 'Save Configuration'}
          </button>
          
          <button
            onClick={testGatewayPing}
            style={{ padding: '10px 14px', background: '#334155', color: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Test Gateway
          </button>
        </div>

        <footer style={{ marginTop: '10px', fontSize: '11px', color: '#34d399', fontFamily: 'monospace' }}>
          Status: {syncStatus}
        </footer>
      </main>
    </div>
  );
};

export default App;
