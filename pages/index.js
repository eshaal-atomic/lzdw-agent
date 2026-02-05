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

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2025-02-03T00:00:00.000Z" version="24.0.0">
  <diagram name="AWS Landing Zone Architecture" id="aws-lz">
    <mxGraphModel dx="2000" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="1200">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- AWS Cloud Container -->
        <mxCell id="aws-cloud" value="AWS Cloud" style="sketch=0;outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=16;fontStyle=1;strokeColor=#FF9900;fillColor=#FFFFFF;verticalAlign=top;align=left;spacingLeft=20;fontColor=#232F3E;dashed=0;strokeWidth=3;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="1520" height="1120" as="geometry"/>
        </mxCell>
        
        <!-- Region Container -->
        <mxCell id="region" value="${architecture.network_architecture?.primary_region || 'Primary Region'}" style="sketch=0;outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=14;fontStyle=1;strokeColor=#5A6C86;fillColor=#EDF2F7;verticalAlign=top;align=left;spacingLeft=20;fontColor=#232F3E;dashed=1;dashPattern=3 3;strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="80" y="100" width="1440" height="1020" as="geometry"/>
        </mxCell>
        
        <!-- Master/Management Account Section -->
        <mxCell id="master-section" value="MASTER / MANAGEMENT ACCOUNT" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF9900;strokeColor=#CC7700;fontColor=#FFFFFF;fontSize=13;fontStyle=1;verticalAlign=top;align=center;spacingTop=10;" vertex="1" parent="1">
          <mxGeometry x="120" y="160" width="340" height="280" as="geometry"/>
        </mxCell>
        
        <mxCell id="master-account" value="${architecture.account_structure.master_account.name}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFE6F0;strokeColor=#FF1493;strokeWidth=2;fontSize=12;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="140" y="210" width="300" height="50" as="geometry"/>
        </mxCell>
        
        <mxCell id="master-email" value="${architecture.account_structure.master_account.email}" style="text;html=1;align=center;verticalAlign=middle;fontSize=9;fontColor=#666666;" vertex="1" parent="1">
          <mxGeometry x="140" y="265" width="300" height="20" as="geometry"/>
        </mxCell>
        
        <!-- AWS Organizations -->
        <mxCell id="aws-org" value="AWS Organizations" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=#FF9900;fontColor=#FFFFFF;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="160" y="300" width="130" height="35" as="geometry"/>
        </mxCell>
        
        <!-- Control Tower -->
        <mxCell id="control-tower" value="AWS Control Tower" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF9900;strokeColor=#CC7700;fontColor=#FFFFFF;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="310" y="300" width="130" height="35" as="geometry"/>
        </mxCell>
        
        <!-- IAM Identity Center -->
        <mxCell id="iam-center" value="IAM Identity Center" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DD344C;strokeColor=#A31327;fontColor=#FFFFFF;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="160" y="350" width="130" height="35" as="geometry"/>
        </mxCell>
        
        <!-- CloudTrail -->
        <mxCell id="cloudtrail" value="CloudTrail" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#3F8624;strokeColor=#2E6319;fontColor=#FFFFFF;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="310" y="350" width="130" height="35" as="geometry"/>
        </mxCell>
        
        <!-- Arrow from Master to OUs -->
        <mxCell id="arrow-master-ou" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#FF9900;strokeWidth=2;endArrow=block;endFill=1;" edge="1" parent="1" source="master-section" target="security-ou-container">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;

    // Security OU Section
    const securityAccounts = architecture.account_structure.security_ou || [];
    if (securityAccounts.length > 0) {
      xml += `
        
        <!-- Security OU -->
        <mxCell id="security-ou-container" value="SECURITY OU" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#E6F3FF;strokeColor=#0066CC;strokeWidth=2;fontSize=13;fontStyle=1;verticalAlign=top;align=center;spacingTop=10;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="520" y="160" width="340" height="280" as="geometry"/>
        </mxCell>`;
      
      securityAccounts.forEach((acc, idx) => {
        const yPos = 210 + (idx * 80);
        xml += `
        
        <mxCell id="sec-acc-${idx}" value="${acc.name}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#CCE5FF;strokeColor=#0066CC;strokeWidth=2;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="540" y="${yPos}" width="300" height="45" as="geometry"/>
        </mxCell>
        
        <mxCell id="sec-email-${idx}" value="${acc.email}" style="text;html=1;align=center;verticalAlign=middle;fontSize=9;fontColor=#666666;" vertex="1" parent="1">
          <mxGeometry x="540" y="${yPos + 50}" width="300" height="15" as="geometry"/>
        </mxCell>`;
      });
      
      // Add AWS Security Services
      xml += `
        
        <!-- AWS Security Services -->
        <mxCell id="guardduty" value="GuardDuty" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DD344C;strokeColor=#A31327;fontColor=#FFFFFF;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="560" y="380" width="80" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="securityhub" value="Security Hub" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DD344C;strokeColor=#A31327;fontColor=#FFFFFF;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="650" y="380" width="80" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="config" value="AWS Config" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DD344C;strokeColor=#A31327;fontColor=#FFFFFF;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="740" y="380" width="80" height="25" as="geometry"/>
        </mxCell>`;
    }

    // Workload OU Section
    const workloadAccounts = architecture.account_structure.workload_ou || [];
    if (workloadAccounts.length > 0) {
      xml += `
        
        <!-- Workload OU -->
        <mxCell id="workload-ou-container" value="WORKLOAD OU" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#E6FFE6;strokeColor=#22C55E;strokeWidth=2;fontSize=13;fontStyle=1;verticalAlign=top;align=center;spacingTop=10;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="920" y="160" width="580" height="280" as="geometry"/>
        </mxCell>`;
      
      workloadAccounts.forEach((acc, idx) => {
        const xPos = 940 + (idx * 180);
        xml += `
        
        <mxCell id="work-acc-${idx}" value="${acc.name}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#D1FAE5;strokeColor=#22C55E;strokeWidth=2;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="${xPos}" y="210" width="160" height="45" as="geometry"/>
        </mxCell>
        
        <mxCell id="work-email-${idx}" value="${acc.email}" style="text;html=1;align=center;verticalAlign=middle;fontSize=9;fontColor=#666666;" vertex="1" parent="1">
          <mxGeometry x="${xPos}" y="260" width="160" height="15" as="geometry"/>
        </mxCell>
        
        <!-- VPC for each workload -->
        <mxCell id="vpc-${idx}" value="VPC" style="sketch=0;outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=10;fontStyle=1;strokeColor=#22C55E;fillColor=#FFFFFF;verticalAlign=top;align=left;spacingLeft=10;fontColor=#22C55E;dashed=1;" vertex="1" parent="1">
          <mxGeometry x="${xPos + 10}" y="290" width="140" height="130" as="geometry"/>
        </mxCell>
        
        <!-- Public Subnet -->
        <mxCell id="pub-sub-${idx}" value="Public Subnet" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#F59E0B;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="${xPos + 20}" y="315" width="120" height="30" as="geometry"/>
        </mxCell>
        
        <!-- Private Subnet -->
        <mxCell id="priv-sub-${idx}" value="Private Subnet" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#3B82F6;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="${xPos + 20}" y="355" width="120" height="30" as="geometry"/>
        </mxCell>
        
        <!-- Database Subnet -->
        <mxCell id="db-sub-${idx}" value="DB Subnet" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#E9D5FF;strokeColor=#9333EA;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="${xPos + 20}" y="395" width="120" height="30" as="geometry"/>
        </mxCell>`;
      });
    }

    // Networking OU Section
    const networkAccounts = architecture.account_structure.networking_ou || [];
    if (networkAccounts.length > 0) {
      xml += `
        
        <!-- Networking OU -->
        <mxCell id="network-ou-container" value="NETWORKING OU" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFF9E6;strokeColor=#F59E0B;strokeWidth=2;fontSize=13;fontStyle=1;verticalAlign=top;align=center;spacingTop=10;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="120" y="500" width="1380" height="280" as="geometry"/>
        </mxCell>`;
      
      networkAccounts.forEach((acc, idx) => {
        xml += `
        
        <mxCell id="net-acc-${idx}" value="${acc.name}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#F59E0B;strokeWidth=2;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="160" y="550" width="250" height="45" as="geometry"/>
        </mxCell>
        
        <mxCell id="net-email-${idx}" value="${acc.email}" style="text;html=1;align=center;verticalAlign=middle;fontSize=9;fontColor=#666666;" vertex="1" parent="1">
          <mxGeometry x="160" y="600" width="250" height="15" as="geometry"/>
        </mxCell>`;
      });
      
      // Add Transit Gateway
      xml += `
        
        <!-- Transit Gateway -->
        <mxCell id="tgw" value="AWS Transit Gateway" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF9900;strokeColor=#CC7700;fontColor=#FFFFFF;fontSize=12;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="650" y="560" width="300" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="tgw-desc" value="Central connectivity hub for all VPCs and on-premises" style="text;html=1;align=center;verticalAlign=middle;fontSize=9;fontColor=#666666;" vertex="1" parent="1">
          <mxGeometry x="650" y="625" width="300" height="30" as="geometry"/>
        </mxCell>
        
        <!-- VPN Connection -->
        <mxCell id="vpn" value="VPN / Direct Connect" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=#FF9900;fontColor=#FFFFFF;fontSize=11;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="160" y="680" width="250" height="40" as="geometry"/>
        </mxCell>
        
        <!-- On-Premises Connection -->
        <mxCell id="onprem" value="On-Premises Network" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#9CA3AF;strokeColor=#4B5563;fontColor=#FFFFFF;fontSize=11;fontStyle=1;dashed=1;dashPattern=3 3;" vertex="1" parent="1">
          <mxGeometry x="160" y="735" width="250" height="35" as="geometry"/>
        </mxCell>
        
        <!-- Connection Lines -->
        <mxCell id="line-tgw-vpn" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#F59E0B;strokeWidth=2;endArrow=block;endFill=1;startArrow=block;startFill=1;" edge="1" parent="1" source="tgw" target="vpn">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        
        <mxCell id="line-vpn-onprem" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#9CA3AF;strokeWidth=2;endArrow=block;endFill=1;dashed=1;dashPattern=3 3;" edge="1" parent="1" source="vpn" target="onprem">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;
    }

    // Add Network Flow Arrows
    if (workloadAccounts.length > 0) {
      workloadAccounts.forEach((acc, idx) => {
        xml += `
        
        <mxCell id="flow-work-${idx}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#22C55E;strokeWidth=2;endArrow=block;endFill=1;dashed=1;" edge="1" parent="1" source="vpc-${idx}" target="tgw">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;
      });
    }

    // Add Legend
    xml += `
        
        <!-- Legend -->
        <mxCell id="legend-box" value="LEGEND" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F3F4F6;strokeColor=#9CA3AF;fontSize=11;fontStyle=1;verticalAlign=top;align=center;spacingTop=5;" vertex="1" parent="1">
          <mxGeometry x="120" y="840" width="320" height="220" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-master" value="Master/Payer Account" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFE6F0;strokeColor=#FF1493;strokeWidth=2;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="140" y="870" width="130" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-security" value="Security OU" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#CCE5FF;strokeColor=#0066CC;strokeWidth=2;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="290" y="870" width="130" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-workload" value="Workload OU" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#D1FAE5;strokeColor=#22C55E;strokeWidth=2;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="140" y="905" width="130" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-network" value="Networking OU" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#F59E0B;strokeWidth=2;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="290" y="905" width="130" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-pub" value="Public Subnet" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#F59E0B;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="140" y="940" width="80" height="20" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-priv" value="Private Subnet" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#3B82F6;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="230" y="940" width="80" height="20" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-db" value="DB Subnet" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#E9D5FF;strokeColor=#9333EA;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="320" y="940" width="80" height="20" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-aws" value="AWS Service" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=#FF9900;fontColor=#FFFFFF;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="140" y="970" width="80" height="20" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-sec-svc" value="Security Service" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DD344C;strokeColor=#A31327;fontColor=#FFFFFF;fontSize=9" vertex="1" parent="1">
          <mxGeometry x="230" y="970" width="90" height="20" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-tgw-line" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#F59E0B;strokeWidth=2;endArrow=block;endFill=1;startArrow=block;startFill=1;" edge="1" parent="1">
          <mxGeometry x="140" y="1005" width="80" height="20" as="geometry">
            <mxPoint x="140" y="1015" as="sourcePoint"/>
            <mxPoint x="220" y="1015" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        
        <mxCell id="leg-tgw-label" value="TGW Connection" style="text;html=1;align=left;verticalAlign=middle;fontSize=9;fontColor=#666666;" vertex="1" parent="1">
          <mxGeometry x="230" y="1005" width="100" height="20" as="geometry"/>
        </mxCell>
        
        <mxCell id="leg-vpc-line" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#22C55E;strokeWidth=2;endArrow=block;endFill=1;dashed=1;" edge="1" parent="1">
          <mxGeometry x="140" y="1030" width="80" height="20" as="geometry">
            <mxPoint x="140" y="1040" as="sourcePoint"/>
            <mxPoint x="220" y="1040" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        
        <mxCell id="leg-vpc-label" value="VPC to TGW" style="text;html=1;align=left;verticalAlign=middle;fontSize=9;fontColor=#666666;" vertex="1" parent="1">
          <mxGeometry x="230" y="1030" width="100" height="20" as="geometry"/>
        </mxCell>
        
        <!-- Architecture Info Box -->
        <mxCell id="info-box" value="ARCHITECTURE DETAILS" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F3F4F6;strokeColor=#9CA3AF;fontSize=11;fontStyle=1;verticalAlign=top;align=center;spacingTop=5;" vertex="1" parent="1">
          <mxGeometry x="500" y="840" width="1000" height="220" as="geometry"/>
        </mxCell>
        
        <mxCell id="info-pattern" value="Pattern: ${architecture.account_structure.pattern}" style="text;html=1;align=left;verticalAlign=middle;fontSize=10;fontColor=#232F3E;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="520" y="870" width="460" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="info-topology" value="Network Topology: ${architecture.network_architecture?.topology || 'hub-spoke'}" style="text;html=1;align=left;verticalAlign=middle;fontSize=10;fontColor=#232F3E;" vertex="1" parent="1">
          <mxGeometry x="520" y="900" width="460" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="info-region" value="Primary Region: ${architecture.network_architecture?.primary_region || 'N/A'}" style="text;html=1;align=left;verticalAlign=middle;fontSize=10;fontColor=#232F3E;" vertex="1" parent="1">
          <mxGeometry x="520" y="930" width="460" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="info-dr" value="DR Region: ${architecture.network_architecture?.secondary_region || 'Not configured'}" style="text;html=1;align=left;verticalAlign=middle;fontSize=10;fontColor=#232F3E;" vertex="1" parent="1">
          <mxGeometry x="520" y="960" width="460" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="info-compliance" value="Compliance: ${architecture.security_baseline?.compliance_requirements?.join(', ') || 'None specified'}" style="text;html=1;align=left;verticalAlign=middle;fontSize=10;fontColor=#232F3E;" vertex="1" parent="1">
          <mxGeometry x="520" y="990" width="460" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="info-mfa" value="MFA Enforcement: ${architecture.security_baseline?.mfa_enforcement ? 'Enabled' : 'Disabled'}" style="text;html=1;align=left;verticalAlign=middle;fontSize=10;fontColor=#232F3E;" vertex="1" parent="1">
          <mxGeometry x="1000" y="870" width="460" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="info-idcenter" value="IAM Identity Center: ${architecture.security_baseline?.identity_center ? 'Enabled' : 'Disabled'}" style="text;html=1;align=left;verticalAlign=middle;fontSize=10;fontColor=#232F3E;" vertex="1" parent="1">
          <mxGeometry x="1000" y="900" width="460" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="info-services" value="Security Services: ${architecture.security_baseline?.services?.slice(0, 3).join(', ') || 'None'}${architecture.security_baseline?.services?.length > 3 ? '...' : ''}" style="text;html=1;align=left;verticalAlign=middle;fontSize=10;fontColor=#232F3E;" vertex="1" parent="1">
          <mxGeometry x="1000" y="930" width="460" height="25" as="geometry"/>
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
