import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [stage, setStage] = useState('input');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [architecture, setArchitecture] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    setIsProcessing(true);

    try {
      if (file.name.endsWith('.txt')) {
        const text = await file.text();
        setFileContent(text);
        setIsProcessing(false);
      } else if (file.name.endsWith('.docx')) {
        // Convert to base64 and send to API
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        
        const response = await fetch('/api/parse-docx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64 })
        });

        if (!response.ok) {
          throw new Error('Failed to parse DOCX file');
        }

        const data = await response.json();
        setFileContent(data.text);
        setIsProcessing(false);
      } else {
        setError('Please upload .txt or .docx files only');
        setIsProcessing(false);
      }
    } catch (err) {
      setError(`Failed to read file: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const generateArchitecture = async () => {
    if (!fileContent.trim()) {
      setError('Please upload a LZDW questionnaire file or paste content first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setStage('processing');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionnaireContent: fileContent,
          extraNotes: extraNotes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate architecture');
      }

      const data = await response.json();
      setArchitecture(data.architecture);
      setStage('results');
    } catch (err) {
      setError(`Failed to generate architecture: ${err.message}`);
      setStage('input');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateDrawioXML = () => {
    if (!architecture) return '';

    const accounts = [
      architecture.account_structure.master_account,
      ...(architecture.account_structure.security_ou || []),
      ...(architecture.account_structure.workload_ou || []),
      ...(architecture.account_structure.networking_ou || [])
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2025-02-03T00:00:00.000Z" version="24.0.0">
  <diagram name="AWS Landing Zone" id="aws-lz">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>`;

    xml += `
        <mxCell id="master" value="${architecture.account_structure.master_account.name}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFE6F0;strokeColor=#FF1493;strokeWidth=3;fontSize=14;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="200" height="80" as="geometry"/>
        </mxCell>`;

    let yOffset = 160;
    const ouGroups = [
      { label: 'Security OU', accounts: architecture.account_structure.security_ou || [], color: '#E6F3FF' },
      { label: 'Workload OU', accounts: architecture.account_structure.workload_ou || [], color: '#E6FFE6' },
      { label: 'Networking OU', accounts: architecture.account_structure.networking_ou || [], color: '#FFF9E6' }
    ];

    ouGroups.forEach((ou, ouIndex) => {
      if (ou.accounts.length === 0) return;

      xml += `
        <mxCell id="ou-${ouIndex}" value="${ou.label}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${ou.color};strokeColor=#666666;dashed=1;dashPattern=5 5;fontSize=12;fontStyle=1;verticalAlign=top" vertex="1" parent="1">
          <mxGeometry x="280" y="${yOffset}" width="${ou.accounts.length * 180 + 40}" height="140" as="geometry"/>
        </mxCell>`;

      ou.accounts.forEach((account, accIndex) => {
        xml += `
        <mxCell id="acc-${ouIndex}-${accIndex}" value="${account.name}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#CCE5FF;strokeColor=#0066CC;fontSize=11" vertex="1" parent="1">
          <mxGeometry x="${300 + accIndex * 180}" y="${yOffset + 40}" width="140" height="60" as="geometry"/>
        </mxCell>`;
      });

      yOffset += 180;
    });

    xml += `
        <mxCell id="control-tower" value="AWS Control Tower" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF9900;strokeColor=#CC7700;fontColor=#FFFFFF;fontSize=10;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="40" y="160" width="120" height="40" as="geometry"/>
        </mxCell>`;

    xml += `
        <mxCell id="identity-center" value="IAM Identity Center" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=#FF9900;fontColor=#FFFFFF;fontSize=10" vertex="1" parent="1">
          <mxGeometry x="40" y="220" width="120" height="40" as="geometry"/>
        </mxCell>`;

    xml += `
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

    return xml;
  };

  const downloadDrawio = () => {
    const xml = generateDrawioXML();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${architecture.client_name.replace(/\s+/g, '_')}_LZ_Architecture.drawio`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(architecture, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${architecture.client_name.replace(/\s+/g, '_')}_Architecture.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>AWS Landing Zone Agent</title>
        <meta name="description" content="Automated AWS Landing Zone Design Workshop" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {stage === 'input' && (
          <div style={{ padding: '40px 20px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '48px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c', marginBottom: '8px', textAlign: 'center' }}>
                  AWS Landing Zone Design Workshop
                </h1>
                <p style={{ fontSize: '16px', color: '#718096', textAlign: 'center', marginBottom: '40px' }}>
                  Automated Architecture Generator
                </p>

                <div 
                  onClick={() => !isProcessing && fileInputRef.current?.click()}
                  style={{ 
                    border: '2px dashed #cbd5e0', 
                    borderRadius: '12px', 
                    padding: '48px', 
                    textAlign: 'center', 
                    cursor: isProcessing ? 'wait' : 'pointer',
                    transition: 'all 0.3s',
                    background: fileName ? '#f7fafc' : '#fafafa',
                    marginBottom: '24px',
                    opacity: isProcessing ? 0.6 : 1
                  }}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".docx,.txt"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                    style={{ display: 'none' }}
                  />
                  <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#667eea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>
                    {isProcessing ? 'Processing file...' : (fileName || 'Upload LZDW Questionnaire')}
                  </p>
                  <p style={{ fontSize: '14px', color: '#718096' }}>
                    Supports .docx and .txt files
                  </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>
                    Or paste questionnaire text:
                  </label>
                  <textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    placeholder="Paste your completed LZDW questionnaire here..."
                    style={{
                      width: '100%',
                      height: '200px',
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>
                    Additional context (optional):
                  </label>
                  <textarea
                    value={extraNotes}
                    onChange={(e) => setExtraNotes(e.target.value)}
                    placeholder="Any extra details not in the questionnaire?"
                    style={{
                      width: '100%',
                      height: '100px',
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {error && (
                  <div style={{ 
                    background: '#fed7d7', 
                    border: '1px solid #fc8181', 
                    borderRadius: '8px', 
                    padding: '16px', 
                    marginBottom: '24px',
                    color: '#9b2c2c'
                  }}>
                    <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
                  </div>
                )}

                <button
                  onClick={generateArchitecture}
                  disabled={!fileContent.trim() || isProcessing}
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    background: (fileContent.trim() && !isProcessing) ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#cbd5e0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: (fileContent.trim() && !isProcessing) ? 'pointer' : 'not-allowed',
                    boxShadow: (fileContent.trim() && !isProcessing) ? '0 4px 14px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                >
                  {isProcessing ? 'Processing...' : 'Generate AWS Architecture'}
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'processing' && (
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', maxWidth: '500px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                border: '4px solid #e2e8f0', 
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                margin: '0 auto 24px',
                animation: 'spin 1s linear infinite'
              }} />
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>
                Analyzing Questionnaire
              </h2>
              <p style={{ fontSize: '16px', color: '#718096' }}>
                Generating professional AWS Landing Zone architecture...
              </p>
            </div>
          </div>
        )}

        {stage === 'results' && architecture && (
          <div style={{ padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>
                      {architecture.client_name}
                    </h1>
                    <p style={{ fontSize: '14px', color: '#718096' }}>
                      Workshop Date: {architecture.workshop_date}
                    </p>
                  </div>
                  <button
                    onClick={() => { setStage('input'); setArchitecture(null); setFileContent(''); setFileName(''); setExtraNotes(''); }}
                    style={{
                      padding: '10px 20px',
                      background: '#e2e8f0',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#2d3748',
                      cursor: 'pointer'
                    }}
                  >
                    ← New Analysis
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={downloadDrawio}
                    style={{
                      flex: '1 1 250px',
                      padding: '14px 24px',
                      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(72, 187, 120, 0.4)'
                    }}
                  >
                    📊 Download Draw.io Diagram
                  </button>
                  <button
                    onClick={downloadJSON}
                    style={{
                      flex: '1 1 250px',
                      padding: '14px 24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    💾 Download JSON Export
                  </button>
                </div>
              </div>

              {/* Account Structure */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '20px', borderBottom: '3px solid #667eea', paddingBottom: '12px' }}>
                  Account Structure
                </h2>
                <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>
                    <strong style={{ color: '#2d3748' }}>Pattern:</strong> {architecture.account_structure.pattern}
                  </p>
                </div>
                
                {/* Master Account */}
                <div style={{ background: '#fff5f7', border: '2px solid #ff1493', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#c53030', marginBottom: '12px' }}>
                    Master/Payer Account
                  </h3>
                  <p style={{ fontSize: '14px', color: '#2d3748', marginBottom: '6px' }}>
                    <strong>Name:</strong> {architecture.account_structure.master_account.name}
                  </p>
                  <p style={{ fontSize: '14px', color: '#2d3748', marginBottom: '6px' }}>
                    <strong>Email:</strong> {architecture.account_structure.master_account.email}
                  </p>
                  <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>
                    {architecture.account_structure.master_account.purpose}
                  </p>
                </div>

                {/* Security OU */}
                {architecture.account_structure.security_ou?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>
                      Security OU
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                      {architecture.account_structure.security_ou.map((acc, i) => (
                        <div key={i} style={{ background: '#e6f3ff', border: '1px solid #0066cc', borderRadius: '8px', padding: '16px' }}>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#0066cc', marginBottom: '8px' }}>{acc.name}</p>
                          <p style={{ fontSize: '12px', color: '#2d3748', marginBottom: '4px' }}>{acc.email}</p>
                          <p style={{ fontSize: '12px', color: '#718096', margin: 0 }}>{acc.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Workload OU */}
                {architecture.account_structure.workload_ou?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>
                      Workload OU
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                      {architecture.account_structure.workload_ou.map((acc, i) => (
                        <div key={i} style={{ background: '#e6ffe6', border: '1px solid #22c55e', borderRadius: '8px', padding: '16px' }}>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a', marginBottom: '8px' }}>{acc.name}</p>
                          <p style={{ fontSize: '12px', color: '#2d3748', marginBottom: '4px' }}>{acc.email}</p>
                          <p style={{ fontSize: '12px', color: '#718096', margin: 0 }}>{acc.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Networking OU */}
                {architecture.account_structure.networking_ou?.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>
                      Networking OU
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                      {architecture.account_structure.networking_ou.map((acc, i) => (
                        <div key={i} style={{ background: '#fff9e6', border: '1px solid #f59e0b', borderRadius: '8px', padding: '16px' }}>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#d97706', marginBottom: '8px' }}>{acc.name}</p>
                          <p style={{ fontSize: '12px', color: '#2d3748', marginBottom: '4px' }}>{acc.email}</p>
                          <p style={{ fontSize: '12px', color: '#718096', margin: 0 }}>{acc.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Network, Security, Scope, Roadmap sections - abbreviated for length */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '20px', borderBottom: '3px solid #667eea', paddingBottom: '12px' }}>
                  Network Architecture
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '12px', color: '#718096', marginBottom: '6px' }}>Topology</p>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: 0 }}>{architecture.network_architecture.topology}</p>
                  </div>
                  <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '12px', color: '#718096', marginBottom: '6px' }}>Primary Region</p>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: 0 }}>{architecture.network_architecture.primary_region}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
