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

  const generateDrawioXML = (arch) => {
    if (!arch) arch = architecture;
    if (!arch) return '';

    const PINK = '#D6336C';
    const LIGHT_PINK = '#F4E1E8';
    const WHITE = '#FFFFFF';
    const DARK = '#232F3E';

    const masterName = arch.account_structure?.master_account?.name || 'Master Account';
    const masterEmail = arch.account_structure?.master_account?.email || 'master@example.com';
    
    const securityOU = arch.account_structure?.security_ou || [];
    const workloadOU = arch.account_structure?.workload_ou || [];
    const networkingOU = arch.account_structure?.networking_ou || [];

    // Generate EXACT layout matching reference images
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net">
  <diagram name="AWS Organization" id="org">
    <mxGraphModel dx="1400" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="800" background="${WHITE}">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- AWS Cloud Badge -->
        <mxCell id="aws-badge" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor=none;strokeColor=#232F3E;fillColor=#232F3E;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.logo;" vertex="1" parent="1">
          <mxGeometry x="30" y="20" width="40" height="40" as="geometry"/>
        </mxCell>
        
        <mxCell id="aws-text" value="AWS Cloud" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;fontSize=14;fontColor=#232F3E;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="80" y="27" width="100" height="26" as="geometry"/>
        </mxCell>
        
        <!-- Outer Dashed Container -->
        <mxCell id="outer-container" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#232F3E;strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="20" y="80" width="1360" height="690" as="geometry"/>
        </mxCell>
        
        <!-- Master/Payer Account Container (PINK) -->
        <mxCell id="master-container" value="${masterName}&lt;br&gt;&lt;font style=&quot;font-size: 10px;&quot;&gt;${masterEmail}&lt;/font&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};strokeWidth=3;fontSize=12;fontStyle=1;fontColor=${PINK};verticalAlign=top;align=left;spacingLeft=60;spacingTop=10;" vertex="1" parent="1">
          <mxGeometry x="40" y="110" width="1320" height="210" as="geometry"/>
        </mxCell>
        
        <!-- AWS Organizations Icon (OFFICIAL) -->
        <mxCell id="org-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.organizations;" vertex="1" parent="1">
          <mxGeometry x="55" y="125" width="40" height="40" as="geometry"/>
        </mxCell>
        
        <!-- Control Tower Icon (OFFICIAL) -->
        <mxCell id="ct-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.control_tower;" vertex="1" parent="1">
          <mxGeometry x="70" y="200" width="44" height="44" as="geometry"/>
        </mxCell>
        
        <mxCell id="ct-label" value="Control&lt;br&gt;Tower" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=9;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="57" y="248" width="70" height="24" as="geometry"/>
        </mxCell>
        
        <!-- Administrator Icon (RIGHT SIDE) -->
        <mxCell id="admin-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.user;" vertex="1" parent="1">
          <mxGeometry x="580" y="135" width="28" height="28" as="geometry"/>
        </mxCell>
        
        <mxCell id="admin-gear" value="⚙" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=16;fontColor=${DARK};" vertex="1" parent="1">
          <mxGeometry x="604" y="131" width="18" height="18" as="geometry"/>
        </mxCell>
        
        <mxCell id="admin-box" value="📦" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=14;fontColor=${DARK};" vertex="1" parent="1">
          <mxGeometry x="604" y="147" width="18" height="18" as="geometry"/>
        </mxCell>
        
        <mxCell id="admin-label" value="Administrator" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};" vertex="1" parent="1">
          <mxGeometry x="558" y="168" width="80" height="18" as="geometry"/>
        </mxCell>
        
        <!-- External Users (LEFT SIDE, OUTSIDE) -->
        <mxCell id="user1-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#879196;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.user;" vertex="1" parent="1">
          <mxGeometry x="690" y="225" width="32" height="32" as="geometry"/>
        </mxCell>
        
        <mxCell id="user1-label" value="Administrator/Root" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=9;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="664" y="262" width="84" height="18" as="geometry"/>
        </mxCell>
        
        <mxCell id="user2-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#879196;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.users;" vertex="1" parent="1">
          <mxGeometry x="800" y="225" width="32" height="32" as="geometry"/>
        </mxCell>
        
        <mxCell id="user2-label" value="Developers/Testers" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=9;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="769" y="262" width="94" height="18" as="geometry"/>
        </mxCell>
        
        <!-- IAM Identity Center (OFFICIAL ICON) -->
        <mxCell id="iam-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.identity_and_access_management;" vertex="1" parent="1">
          <mxGeometry x="950" y="190" width="44" height="44" as="geometry"/>
        </mxCell>
        
        <mxCell id="iam-label" value="Identity Center" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=9;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="932" y="238" width="80" height="18" as="geometry"/>
        </mxCell>
        
        <!-- Cloud Sync to On-Prem -->
        <mxCell id="cloud-icon" value="☁" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=26;fontColor=#5DADE2;" vertex="1" parent="1">
          <mxGeometry x="957" y="266" width="30" height="30" as="geometry"/>
        </mxCell>
        
        <mxCell id="sync-arrow" value="↑" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=18;fontColor=#5DADE2;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="962" y="286" width="20" height="20" as="geometry"/>
        </mxCell>
        
        <!-- On-Premises -->
        <mxCell id="onprem-icon" value="🏢" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=28;fontColor=#666666;" vertex="1" parent="1">
          <mxGeometry x="958" y="1040" width="28" height="28" as="geometry"/>
        </mxCell>
        
        <mxCell id="onprem-label" value="On-Premises&lt;br&gt;/ AWS Cloud AD" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=8;fontColor=${DARK};" vertex="1" parent="1">
          <mxGeometry x="932" y="1072" width="80" height="26" as="geometry"/>
        </mxCell>
        
        <!-- Permission Sets (OFFICIAL ICONS) -->
        <mxCell id="perm1-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.permissions;" vertex="1" parent="1">
          <mxGeometry x="1090" y="160" width="36" height="36" as="geometry"/>
        </mxCell>
        
        <mxCell id="perm1-label" value="Admin Permission&lt;br&gt;Set" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=8;fontColor=${DARK};" vertex="1" parent="1">
          <mxGeometry x="1073" y="200" width="70" height="22" as="geometry"/>
        </mxCell>
        
        <mxCell id="perm2-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.permissions;" vertex="1" parent="1">
          <mxGeometry x="1090" y="245" width="36" height="36" as="geometry"/>
        </mxCell>
        
        <mxCell id="perm2-label" value="Dev/Tester&lt;br&gt;Permission Set" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=8;fontColor=${DARK};" vertex="1" parent="1">
          <mxGeometry x="1068" y="285" width="80" height="22" as="geometry"/>
        </mxCell>
        
        <!-- CLEAN ARROWS WITH PROPER WAYPOINTS -->
        <mxCell id="arrow-user1-iam" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1" source="user1-icon" target="iam-icon">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="706" y="212"/>
              <mxPoint x="850" y="212"/>
              <mxPoint x="850" y="212"/>
              <mxPoint x="972" y="212"/>
            </Array>
          </mxGeometry>
        </mxCell>
        
        <mxCell id="arrow-user2-iam" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1" source="user2-icon" target="iam-icon">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="816" y="212"/>
              <mxPoint x="972" y="212"/>
            </Array>
          </mxGeometry>
        </mxCell>
        
        <mxCell id="arrow-iam-onprem" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;startArrow=classic;startFill=1;endArrow=classic;endFill=1;dashed=1;dashPattern=3 3;" edge="1" parent="1" source="iam-icon" target="onprem-icon">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        
        <mxCell id="arrow-iam-perm1" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1" source="iam-icon" target="perm1-icon">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="1040" y="212"/>
              <mxPoint x="1108" y="212"/>
              <mxPoint x="1108" y="178"/>
            </Array>
          </mxGeometry>
        </mxCell>
        
        <mxCell id="arrow-iam-perm2" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1" source="iam-icon" target="perm2-icon">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="1040" y="212"/>
              <mxPoint x="1108" y="212"/>
              <mxPoint x="1108" y="263"/>
            </Array>
          </mxGeometry>
        </mxCell>
        
        <!-- THREE ORGANIZATIONAL UNITS (PINK BORDERS) -->
        
        <!-- Security/Core OU -->
        <mxCell id="sec-ou-container" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${PINK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="50" y="370" width="400" height="380" as="geometry"/>
        </mxCell>
        
        <mxCell id="sec-ou-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.organizational_unit;" vertex="1" parent="1">
          <mxGeometry x="226" y="385" width="48" height="48" as="geometry"/>
        </mxCell>
        
        <mxCell id="sec-ou-label" value="Security/Core OU" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${PINK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="70" y="438" width="360" height="18" as="geometry"/>
        </mxCell>
        
        ${securityOU.slice(0, 3).map((acc, i) => `
        <mxCell id="sec-acc-${i}" value="${acc.name || `Security Account ${i+1}`}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=10;fontStyle=1;fontColor=${PINK};verticalAlign=top;spacingTop=8;" vertex="1" parent="1">
          <mxGeometry x="70" y="${475 + i*90}" width="360" height="70" as="geometry"/>
        </mxCell>
        
        <mxCell id="sec-acc-icon-${i}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.account;" vertex="1" parent="1">
          <mxGeometry x="230" y="${495 + i*90}" width="32" height="32" as="geometry"/>
        </mxCell>
        `).join('')}
        
        <!-- Workload OU -->
        <mxCell id="work-ou-container" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${PINK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="480" y="370" width="400" height="380" as="geometry"/>
        </mxCell>
        
        <mxCell id="work-ou-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.organizational_unit;" vertex="1" parent="1">
          <mxGeometry x="656" y="385" width="48" height="48" as="geometry"/>
        </mxCell>
        
        <mxCell id="work-ou-label" value="Workload OU" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${PINK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="500" y="438" width="360" height="18" as="geometry"/>
        </mxCell>
        
        ${workloadOU.slice(0, 3).map((acc, i) => `
        <mxCell id="work-acc-${i}" value="${acc.name || `Workload Account ${i+1}`}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=10;fontStyle=1;fontColor=${PINK};verticalAlign=top;spacingTop=8;" vertex="1" parent="1">
          <mxGeometry x="500" y="${475 + i*90}" width="360" height="70" as="geometry"/>
        </mxCell>
        
        <mxCell id="work-acc-icon-${i}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.account;" vertex="1" parent="1">
          <mxGeometry x="660" y="${495 + i*90}" width="32" height="32" as="geometry"/>
        </mxCell>
        `).join('')}
        
        <!-- Networking OU -->
        <mxCell id="net-ou-container" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${PINK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="910" y="370" width="400" height="380" as="geometry"/>
        </mxCell>
        
        <mxCell id="net-ou-icon" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.organizational_unit;" vertex="1" parent="1">
          <mxGeometry x="1086" y="385" width="48" height="48" as="geometry"/>
        </mxCell>
        
        <mxCell id="net-ou-label" value="Networking OU" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${PINK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="930" y="438" width="360" height="18" as="geometry"/>
        </mxCell>
        
        ${networkingOU.slice(0, 3).map((acc, i) => `
        <mxCell id="net-acc-${i}" value="${acc.name || `Network Account ${i+1}`}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=10;fontStyle=1;fontColor=${PINK};verticalAlign=top;spacingTop=8;" vertex="1" parent="1">
          <mxGeometry x="930" y="${475 + i*90}" width="360" height="70" as="geometry"/>
        </mxCell>
        
        <mxCell id="net-acc-icon-${i}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.account;" vertex="1" parent="1">
          <mxGeometry x="1090" y="${495 + i*90}" width="32" height="32" as="geometry"/>
        </mxCell>
        `).join('')}
        
        <!-- Arrows from Master to OUs (CLEAN ROUTING) -->
        <mxCell id="arrow-master-sec" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="250" y="320" as="sourcePoint"/>
            <mxPoint x="250" y="370" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        
        <mxCell id="arrow-master-work" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="680" y="320" as="sourcePoint"/>
            <mxPoint x="680" y="370" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        
        <mxCell id="arrow-master-net" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="1110" y="320" as="sourcePoint"/>
            <mxPoint x="1110" y="370" as="targetPoint"/>
          </mxGeometry>
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
    a.download = `${architecture.client_name.replace(/\s+/g, '_')}_Organization.drawio`;
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
                  <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#D6336C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    background: (fileContent.trim() && !isProcessing) ? 'linear-gradient(135deg, #D6336C 0%, #A31327 100%)' : '#cbd5e0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: (fileContent.trim() && !isProcessing) ? 'pointer' : 'not-allowed',
                    boxShadow: (fileContent.trim() && !isProcessing) ? '0 4px 14px rgba(214, 51, 108, 0.4)' : 'none'
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
                borderTop: '4px solid #D6336C',
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
          <div style={{ padding: '20px' }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
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
              </div>

              {/* Main Content - Split Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Left: Account Structure Details */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflowY: 'auto', maxHeight: '750px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '18px', borderBottom: `3px solid #D6336C`, paddingBottom: '10px' }}>
                    Account Structure
                  </h2>
                  
                  {/* Master Account */}
                  <div style={{ background: '#F4E1E8', border: `2px solid #D6336C`, borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#D6336C', marginBottom: '8px' }}>
                      Master/Payer Account
                    </h3>
                    <p style={{ fontSize: '12px', color: '#2d3748', marginBottom: '5px' }}>
                      <strong>Name:</strong> {architecture.account_structure.master_account.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#2d3748', marginBottom: '5px' }}>
                      <strong>Email:</strong> {architecture.account_structure.master_account.email}
                    </p>
                    <p style={{ fontSize: '11px', color: '#718096', margin: 0 }}>
                      {architecture.account_structure.master_account.purpose}
                    </p>
                  </div>

                  {/* Security OU */}
                  {architecture.account_structure.security_ou?.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                        Security OU ({architecture.account_structure.security_ou.length} accounts)
                      </h3>
                      {architecture.account_structure.security_ou.map((acc, i) => (
                        <div key={i} style={{ background: '#F4E1E8', border: `1px solid #D6336C`, borderRadius: '6px', padding: '10px', marginBottom: '7px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#D6336C', marginBottom: '5px' }}>{acc.name}</p>
                          <p style={{ fontSize: '10px', color: '#2d3748', marginBottom: '3px' }}>{acc.email}</p>
                          <p style={{ fontSize: '10px', color: '#718096', margin: 0 }}>{acc.purpose}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Workload OU */}
                  {architecture.account_structure.workload_ou?.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                        Workload OU ({architecture.account_structure.workload_ou.length} accounts)
                      </h3>
                      {architecture.account_structure.workload_ou.map((acc, i) => (
                        <div key={i} style={{ background: '#F4E1E8', border: `1px solid #D6336C`, borderRadius: '6px', padding: '10px', marginBottom: '7px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#D6336C', marginBottom: '5px' }}>{acc.name}</p>
                          <p style={{ fontSize: '10px', color: '#2d3748', marginBottom: '3px' }}>{acc.email}</p>
                          <p style={{ fontSize: '10px', color: '#718096', margin: 0 }}>{acc.purpose}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Networking OU */}
                  {architecture.account_structure.networking_ou?.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                        Networking OU ({architecture.account_structure.networking_ou.length} accounts)
                      </h3>
                      {architecture.account_structure.networking_ou.map((acc, i) => (
                        <div key={i} style={{ background: '#F4E1E8', border: `1px solid #D6336C`, borderRadius: '6px', padding: '10px', marginBottom: '7px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#D6336C', marginBottom: '5px' }}>{acc.name}</p>
                          <p style={{ fontSize: '10px', color: '#2d3748', marginBottom: '3px' }}>{acc.email}</p>
                          <p style={{ fontSize: '10px', color: '#718096', margin: 0 }}>{acc.purpose}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Network Architecture */}
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#2d3748', marginBottom: '10px' }}>
                      Network Architecture
                    </h3>
                    <div style={{ background: '#f7fafc', borderRadius: '6px', padding: '10px' }}>
                      <p style={{ fontSize: '11px', color: '#2d3748', marginBottom: '5px' }}>
                        <strong>Topology:</strong> {architecture.network_architecture?.topology || 'N/A'}
                      </p>
                      <p style={{ fontSize: '11px', color: '#2d3748', marginBottom: '5px' }}>
                        <strong>Primary Region:</strong> {architecture.network_architecture?.primary_region || 'N/A'}
                      </p>
                      <p style={{ fontSize: '11px', color: '#2d3748', margin: 0 }}>
                        <strong>DR Region:</strong> {architecture.network_architecture?.secondary_region || 'Not configured'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Diagram Viewer */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
                    Organization Diagram
                  </h2>
                  
                  <div style={{ border: '2px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#fafafa', padding: '20px', textAlign: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '8px', padding: '40px', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>
                        Diagram Ready to Download
                      </h3>
                      <p style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>
                        The organizational diagram has been generated with:
                      </p>
                      <ul style={{ fontSize: '13px', color: '#718096', textAlign: 'left', lineHeight: '1.8', maxWidth: '400px', margin: '0 auto 20px' }}>
                        <li>✓ Pink theme (#D6336C)</li>
                        <li>✓ Official AWS icons</li>
                        <li>✓ Clean arrow routing (no overlaps)</li>
                        <li>✓ All OUs and accounts properly organized</li>
                        <li>✓ Professional enterprise layout</li>
                      </ul>
                      <p style={{ fontSize: '12px', color: '#718096', fontStyle: 'italic' }}>
                        Click the buttons below to download the diagram file and open it in <a href="https://app.diagrams.net" target="_blank" rel="noopener noreferrer" style={{ color: '#D6336C', fontWeight: '600' }}>diagrams.net</a>
                      </p>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '11px', color: '#718096', marginTop: '12px', textAlign: 'center' }}>
                    💡 Open the .drawio file in <a href="https://app.diagrams.net" target="_blank" rel="noopener noreferrer" style={{ color: '#D6336C', fontWeight: '600' }}>diagrams.net</a> to view, edit, and export as PNG/SVG
                  </p>
                </div>
              </div>

              {/* Download Buttons */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
                  Download Options
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <button
                    onClick={downloadDrawio}
                    style={{
                      padding: '14px 20px',
                      background: 'linear-gradient(135deg, #D6336C 0%, #A31327 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(214, 51, 108, 0.4)'
                    }}
                  >
                    📊 Draw.io File (.drawio)
                  </button>
                  <button
                    onClick={downloadJSON}
                    style={{
                      padding: '14px 20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    💾 JSON Export (.json)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
