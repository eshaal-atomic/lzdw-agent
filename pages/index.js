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

    // PINK THEME - Official Company Colors
    const PINK = '#D6336C';
    const LIGHT_PINK = '#F4E1E8';
    const ICON_PINK = '#DD344C';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net">
  <diagram name="AWS Landing Zone" id="lz">
    <mxGraphModel dx="2000" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="1200" background="#FFFFFF">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- AWS Cloud -->
        <mxCell id="cloud" value="AWS Cloud" style="sketch=0;outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=16;fontStyle=1;strokeColor=#232F3E;fillColor=#FFFFFF;verticalAlign=top;align=left;spacingLeft=20;fontColor=#232F3E;dashed=0;strokeWidth=3;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="1520" height="1120" as="geometry"/>
        </mxCell>
        
        <!-- Master Account PINK -->
        <mxCell id="master" value="MASTER / MANAGEMENT ACCOUNT" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};fontColor=${PINK};fontSize=13;fontStyle=1;verticalAlign=top;spacingTop=10;" vertex="1" parent="1">
          <mxGeometry x="120" y="160" width="340" height="280" as="geometry"/>
        </mxCell>
        
        <!-- AWS Organizations Icon -->
        <mxCell id="org-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.organizations;" vertex="1" parent="1">
          <mxGeometry x="140" y="200" width="48" height="48" as="geometry"/>
        </mxCell>
        
        <mxCell id="master-name" value="${architecture.account_structure.master_account.name}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=${PINK};strokeWidth=2;fontSize=12;fontStyle=1;fontColor=${PINK}" vertex="1" parent="1">
          <mxGeometry x="200" y="210" width="240" height="50" as="geometry"/>
        </mxCell>
        
        <!-- Control Tower Icon -->
        <mxCell id="ct-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.control_tower;" vertex="1" parent="1">
          <mxGeometry x="296" y="293" width="48" height="48" as="geometry"/>
        </mxCell>
        
        <mxCell id="ct-label" value="Control Tower" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=#232F3E;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="280" y="345" width="80" height="15" as="geometry"/>
        </mxCell>
        
        <!-- IAM Identity Center Icon -->
        <mxCell id="iam-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.identity_and_access_management;" vertex="1" parent="1">
          <mxGeometry x="146" y="343" width="48" height="48" as="geometry"/>
        </mxCell>
        
        <mxCell id="iam-label" value="IAM Identity&#xa;Center" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=#232F3E;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="130" y="395" width="80" height="25" as="geometry"/>
        </mxCell>
        
        <!-- AWS Services -->
        <mxCell id="org-svc" value="AWS Organizations" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=${ICON_PINK};fontColor=#FFFFFF;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="160" y="300" width="130" height="35" as="geometry"/>
        </mxCell>
        
        <mxCell id="trail" value="CloudTrail" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#3F8624;strokeColor=#2E6319;fontColor=#FFFFFF;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="310" y="370" width="130" height="35" as="geometry"/>
        </mxCell>
        
        <!-- Global Services Bar -->
        <mxCell id="global" value="GLOBAL SERVICES" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};strokeWidth=2;fontSize=11;fontStyle=1;verticalAlign=top;spacingTop=5;dashed=1;dashPattern=3 3;fontColor=${PINK}" vertex="1" parent="1">
          <mxGeometry x="520" y="40" width="980" height="80" as="geometry"/>
        </mxCell>
        
        <mxCell id="r53" value="Route 53" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#8B5CF6;strokeColor=#6D28D9;fontColor=#FFFFFF;fontSize=10;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="560" y="70" width="120" height="35" as="geometry"/>
        </mxCell>
        
        <mxCell id="cf" value="CloudFront CDN" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#8B5CF6;strokeColor=#6D28D9;fontColor=#FFFFFF;fontSize=10;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="700" y="70" width="120" height="35" as="geometry"/>
        </mxCell>
        
        <mxCell id="waf" value="AWS WAF" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${ICON_PINK};strokeColor=#A31327;fontColor=#FFFFFF;fontSize=10;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="840" y="70" width="120" height="35" as="geometry"/>
        </mxCell>
        
        <mxCell id="shield" value="AWS Shield" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${ICON_PINK};strokeColor=#A31327;fontColor=#FFFFFF;fontSize=10;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="980" y="70" width="120" height="35" as="geometry"/>
        </mxCell>`;

    // Security OU
    const secAccounts = architecture.account_structure.security_ou || [];
    if (secAccounts.length > 0) {
      xml += `
        
        <!-- Security OU PINK -->
        <mxCell id="sec-ou" value="SECURITY OU" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};strokeWidth=2;fontSize=13;fontStyle=1;verticalAlign=top;spacingTop=10;dashed=1;dashPattern=5 5;fontColor=${PINK}" vertex="1" parent="1">
          <mxGeometry x="520" y="160" width="340" height="280" as="geometry"/>
        </mxCell>
        
        <!-- OU Icon -->
        <mxCell id="sec-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.organizational_unit;" vertex="1" parent="1">
          <mxGeometry x="662" y="180" width="48" height="48" as="geometry"/>
        </mxCell>`;
      
      secAccounts.forEach((acc, i) => {
        xml += `
        
        <mxCell id="sec-${i}" value="${acc.name}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=${PINK};strokeWidth=2;fontSize=11;fontStyle=1;fontColor=${PINK}" vertex="1" parent="1">
          <mxGeometry x="540" y="${240 + i*80}" width="300" height="45" as="geometry"/>
        </mxCell>`;
      });
      
      xml += `
        
        <mxCell id="gd" value="GuardDuty" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${ICON_PINK};strokeColor=#A31327;fontColor=#FFFFFF;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="560" y="400" width="80" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="sh" value="Security Hub" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${ICON_PINK};strokeColor=#A31327;fontColor=#FFFFFF;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="650" y="400" width="80" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="cfg" value="AWS Config" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${ICON_PINK};strokeColor=#A31327;fontColor=#FFFFFF;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="740" y="400" width="80" height="25" as="geometry"/>
        </mxCell>`;
    }

    // Workload OU
    const workAccounts = architecture.account_structure.workload_ou || [];
    if (workAccounts.length > 0) {
      xml += `
        
        <!-- Workload OU -->
        <mxCell id="work-ou" value="WORKLOAD OU" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#E6FFE6;strokeColor=#22C55E;strokeWidth=2;fontSize=13;fontStyle=1;verticalAlign=top;spacingTop=10;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="920" y="160" width="580" height="280" as="geometry"/>
        </mxCell>
        
        <mxCell id="work-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#22C55E;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.organizational_unit;" vertex="1" parent="1">
          <mxGeometry x="1186" y="180" width="48" height="48" as="geometry"/>
        </mxCell>`;
      
      workAccounts.forEach((acc, i) => {
        const x = 940 + i*180;
        xml += `
        
        <mxCell id="work-${i}" value="${acc.name}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#D1FAE5;strokeColor=#22C55E;strokeWidth=2;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="${x}" y="240" width="160" height="45" as="geometry"/>
        </mxCell>
        
        <mxCell id="vpc-${i}" value="VPC" style="sketch=0;outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=10;fontStyle=1;strokeColor=#22C55E;fillColor=#FFFFFF;verticalAlign=top;align=left;spacingLeft=10;fontColor=#22C55E;dashed=1;" vertex="1" parent="1">
          <mxGeometry x="${x+10}" y="320" width="140" height="110" as="geometry"/>
        </mxCell>
        
        <mxCell id="pub-${i}" value="Public" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#F59E0B;fontSize=8" vertex="1" parent="1">
          <mxGeometry x="${x+20}" y="340" width="120" height="20" as="geometry"/>
        </mxCell>
        
        <mxCell id="priv-${i}" value="Private" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#3B82F6;fontSize=8" vertex="1" parent="1">
          <mxGeometry x="${x+20}" y="370" width="120" height="20" as="geometry"/>
        </mxCell>
        
        <mxCell id="db-${i}" value="Database" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#E9D5FF;strokeColor=#9333EA;fontSize=8" vertex="1" parent="1">
          <mxGeometry x="${x+20}" y="400" width="120" height="20" as="geometry"/>
        </mxCell>`;
      });
    }

    // Networking OU
    const netAccounts = architecture.account_structure.networking_ou || [];
    if (netAccounts.length > 0) {
      xml += `
        
        <!-- Networking OU -->
        <mxCell id="net-ou" value="NETWORKING OU" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFF9E6;strokeColor=#F59E0B;strokeWidth=2;fontSize=13;fontStyle=1;verticalAlign=top;spacingTop=10;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="120" y="500" width="1380" height="280" as="geometry"/>
        </mxCell>
        
        <mxCell id="net-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#F59E0B;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.organizational_unit;" vertex="1" parent="1">
          <mxGeometry x="786" y="520" width="48" height="48" as="geometry"/>
        </mxCell>
        
        <!-- Transit Gateway Icon -->
        <mxCell id="tgw-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#FF9900;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.transit_gateway;" vertex="1" parent="1">
          <mxGeometry x="676" y="580" width="48" height="48" as="geometry"/>
        </mxCell>
        
        <mxCell id="tgw" value="AWS Transit Gateway" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF9900;strokeColor=#CC7700;fontColor=#FFFFFF;fontSize=12;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="740" y="590" width="300" height="40" as="geometry"/>
        </mxCell>
        
        <mxCell id="vpn" value="VPN / Direct Connect" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=#FF9900;fontColor=#FFFFFF;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="160" y="700" width="250" height="40" as="geometry"/>
        </mxCell>
        
        <mxCell id="onprem" value="On-Premises Network" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#9CA3AF;strokeColor=#4B5563;fontColor=#FFFFFF;fontSize=11;fontStyle=1;dashed=1;dashPattern=3 3;" vertex="1" parent="1">
          <mxGeometry x="160" y="750" width="250" height="35" as="geometry"/>
        </mxCell>`;
    }

    xml += `
        
        <!-- Legend -->
        <mxCell id="legend" value="LEGEND" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F3F4F6;strokeColor=#9CA3AF;fontSize=11;fontStyle=1;verticalAlign=top;spacingTop=5;" vertex="1" parent="1">
          <mxGeometry x="120" y="840" width="320" height="150" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-1" value="Master Account" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};strokeWidth=2;fontSize=9;fontColor=${PINK};fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="140" y="870" width="130" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-2" value="Security OU" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};strokeWidth=2;fontSize=9;fontColor=${PINK};fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="290" y="870" width="130" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-3" value="Workload OU" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#D1FAE5;strokeColor=#22C55E;strokeWidth=2;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="140" y="905" width="130" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-4" value="AWS Service" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=#FF9900;fontColor=#FFFFFF;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="290" y="905" width="130" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-5" value="Security Service" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${ICON_PINK};strokeColor=#A31327;fontColor=#FFFFFF;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="140" y="940" width="130" height="25" as="geometry"/>
        </mxCell>
        
        <!-- Architecture Details -->
        <mxCell id="info" value="ARCHITECTURE DETAILS" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F3F4F6;strokeColor=#9CA3AF;fontSize=11;fontStyle=1;verticalAlign=top;spacingTop=5;" vertex="1" parent="1">
          <mxGeometry x="500" y="840" width="1000" height="150" as="geometry"/>
        </mxCell>
        
        <mxCell id="i1" value="Pattern: ${architecture.account_structure.pattern}" style="text;html=1;align=left;verticalAlign=middle;fontSize=10;fontColor=#232F3E;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="520" y="870" width="460" height="20" as="geometry"/>
        </mxCell>
        
        <mxCell id="i2" value="Region: ${architecture.network_architecture?.primary_region || 'N/A'}" style="text;html=1;align=left;verticalAlign=middle;fontSize=10;fontColor=#232F3E;" vertex="1" parent="1">
          <mxGeometry x="520" y="900" width="460" height="20" as="geometry"/>
        </mxCell>
        
        <mxCell id="i3" value="IAM Identity Center: ${architecture.security_baseline?.identity_center ? 'Enabled' : 'Disabled'}" style="text;html=1;align=left;verticalAlign=middle;fontSize=10;fontColor=#232F3E;" vertex="1" parent="1">
          <mxGeometry x="520" y="930" width="460" height="20" as="geometry"/>
        </mxCell>
        
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

      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #232F3E 0%, #1a2332 100%)' }}>
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
                    background: (fileContent.trim() && !isProcessing) ? 'linear-gradient(135deg, #FF9900 0%, #CC7700 100%)' : '#cbd5e0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: (fileContent.trim() && !isProcessing) ? 'pointer' : 'not-allowed',
                    boxShadow: (fileContent.trim() && !isProcessing) ? '0 4px 14px rgba(255, 153, 0, 0.4)' : 'none'
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
                      background: 'linear-gradient(135deg, #D6336C 0%, #A31327 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(214, 51, 108, 0.4)'
                    }}
                  >
                    📊 Download Draw.io Diagram (Pink Theme + AWS Icons)
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

              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
                  ✅ Architecture Generated 
                </h2>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '12px' }}>
                  The downloaded Draw.io file includes:
                </p>
                <ul style={{ fontSize: '14px', color: '#718096', lineHeight: '1.8', paddingLeft: '20px' }}>
                  <li><strong style={{color: '#D6336C'}}>Pink theme</strong> (#D6336C borders, #F4E1E8 fills)</li>
                  <li><strong style={{color: '#D6336C'}}>Official AWS icons</strong> using mxgraph.aws4 shapes</li>
                  <li>Organizations, Control Tower, IAM Identity Center icons</li>
                  <li>Complete architecture with network topology</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
