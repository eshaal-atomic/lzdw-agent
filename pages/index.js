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

    const PINK = '#D6336C';
    const LIGHT_PINK = '#F4E1E8';
    const WHITE = '#FFFFFF';
    const DARK = '#232F3E';
    const GRAY = '#879196';

    const masterName = architecture.account_structure?.master_account?.name || 'Master Account';
    const masterEmail = architecture.account_structure?.master_account?.email || 'master@example.com';
    
    const securityOU = architecture.account_structure?.security_ou || [];
    const workloadOU = architecture.account_structure?.workload_ou || [];
    const networkingOU = architecture.account_structure?.networking_ou || [];

    // Clean professional diagram matching reference images EXACTLY
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net">
  <diagram name="AWS Organization" id="org">
    <mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1200" pageHeight="900" background="${WHITE}">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- AWS Cloud Badge -->
        <mxCell id="aws-badge" value="AWS Cloud" style="text;html=1;strokeColor=${DARK};fillColor=${DARK};align=left;verticalAlign=middle;whiteSpace=wrap;rounded=1;fontColor=${WHITE};fontSize=12;fontStyle=1;spacing=10;spacingLeft=40;" vertex="1" parent="1">
          <mxGeometry x="40" y="30" width="150" height="30" as="geometry"/>
        </mxCell>
        
        <!-- AWS Logo Icon -->
        <mxCell id="aws-logo" value="" style="shape=image;html=1;verticalAlign=top;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;imageAspect=0;aspect=fixed;image=https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/amazonaws-128.png" vertex="1" parent="1">
          <mxGeometry x="48" y="35" width="20" height="20" as="geometry"/>
        </mxCell>
        
        <!-- Main Container -->
        <mxCell id="container" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${DARK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="30" y="80" width="1140" height="790" as="geometry"/>
        </mxCell>
        
        <!-- Master/Payer Account Box -->
        <mxCell id="master" value="${masterName}&lt;br&gt;&lt;font style=&quot;font-size:10px&quot;&gt;${masterEmail}&lt;/font&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};strokeWidth=3;fontSize=13;fontStyle=1;fontColor=${PINK};verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;" vertex="1" parent="1">
          <mxGeometry x="230" y="110" width="920" height="220" as="geometry"/>
        </mxCell>
        
        <!-- Organizations Icon (Pink Square) -->
        <mxCell id="org-icon" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="250" y="130" width="40" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="org-symbol" value="⚙" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=24;fontColor=${WHITE};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="250" y="130" width="40" height="40" as="geometry"/>
        </mxCell>
        
        <!-- Control Tower Icon (Pink Square) -->
        <mxCell id="ct-icon" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="250" y="200" width="45" height="45" as="geometry"/>
        </mxCell>
        <mxCell id="ct-symbol" value="◈" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=28;fontColor=${WHITE};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="250" y="200" width="45" height="45" as="geometry"/>
        </mxCell>
        <mxCell id="ct-label" value="Control Tower" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="240" y="250" width="65" height="20" as="geometry"/>
        </mxCell>
        
        <!-- Administrator Icon & Label -->
        <mxCell id="admin-icon" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="580" y="135" width="35" height="35" as="geometry"/>
        </mxCell>
        <mxCell id="admin-symbol" value="👤" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=20;fontColor=${WHITE};" vertex="1" parent="1">
          <mxGeometry x="580" y="135" width="35" height="35" as="geometry"/>
        </mxCell>
        <mxCell id="admin-gear" value="⚙" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=16;fontColor=${DARK};" vertex="1" parent="1">
          <mxGeometry x="610" y="130" width="20" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="admin-box" value="📦" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=14;fontColor=${DARK};" vertex="1" parent="1">
          <mxGeometry x="610" y="150" width="20" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="admin-label" value="Administrator" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="560" y="175" width="75" height="20" as="geometry"/>
        </mxCell>
        
        <!-- External Users (Left Side - Outside Master Box) -->
        <mxCell id="user1-icon" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${GRAY};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="80" y="170" width="35" height="35" as="geometry"/>
        </mxCell>
        <mxCell id="user1-symbol" value="👤" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=20;fontColor=${WHITE};" vertex="1" parent="1">
          <mxGeometry x="80" y="170" width="35" height="35" as="geometry"/>
        </mxCell>
        <mxCell id="user1-label" value="Administrator/Root" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="55" y="210" width="85" height="20" as="geometry"/>
        </mxCell>
        
        <mxCell id="user2-icon" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${GRAY};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="80" y="260" width="35" height="35" as="geometry"/>
        </mxCell>
        <mxCell id="user2-symbol" value="👥" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=20;fontColor=${WHITE};" vertex="1" parent="1">
          <mxGeometry x="80" y="260" width="35" height="35" as="geometry"/>
        </mxCell>
        <mxCell id="user2-label" value="Developers/Testers" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="52" y="300" width="90" height="20" as="geometry"/>
        </mxCell>
        
        <!-- Identity Center (Pink Square) -->
        <mxCell id="iam-icon" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="360" y="180" width="45" height="45" as="geometry"/>
        </mxCell>
        <mxCell id="iam-symbol" value="🔐" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=24;fontColor=${WHITE};" vertex="1" parent="1">
          <mxGeometry x="360" y="180" width="45" height="45" as="geometry"/>
        </mxCell>
        <mxCell id="iam-label" value="Identity Center" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="342" y="230" width="80" height="20" as="geometry"/>
        </mxCell>
        
        <!-- Cloud Sync Icon -->
        <mxCell id="cloud" value="☁" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=32;fontColor=#5DADE2;" vertex="1" parent="1">
          <mxGeometry x="366" y="260" width="33" height="33" as="geometry"/>
        </mxCell>
        <mxCell id="up-arrow" value="↕" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=24;fontColor=#5DADE2;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="371" y="285" width="23" height="23" as="geometry"/>
        </mxCell>
        
        <!-- On-Premises (Below, Outside) -->
        <mxCell id="onprem" value="🏢" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=36;fontColor=${GRAY};" vertex="1" parent="1">
          <mxGeometry x="366" y="360" width="33" height="33" as="geometry"/>
        </mxCell>
        <mxCell id="onprem-warn" value="⚠" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=18;fontColor=${GRAY};" vertex="1" parent="1">
          <mxGeometry x="390" y="380" width="18" height="18" as="geometry"/>
        </mxCell>
        <mxCell id="onprem-label" value="On-Premises / AWS Cloud AD" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=9;fontColor=${DARK};" vertex="1" parent="1">
          <mxGeometry x="332" y="403" width="100" height="25" as="geometry"/>
        </mxCell>
        
        <!-- Permission Sets (Pink Squares) -->
        <mxCell id="perm1-icon" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="480" y="150" width="40" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="perm1-symbol" value="✓" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=24;fontColor=${WHITE};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="480" y="150" width="40" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="perm1-label" value="Admin Permission Set" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=9;fontColor=${DARK};" vertex="1" parent="1">
          <mxGeometry x="455" y="195" width="90" height="25" as="geometry"/>
        </mxCell>
        
        <mxCell id="perm2-icon" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="480" y="240" width="40" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="perm2-symbol" value="✓" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=24;fontColor=${WHITE};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="480" y="240" width="40" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="perm2-label" value="Dev/Tester Permission Set" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=9;fontColor=${DARK};" vertex="1" parent="1">
          <mxGeometry x="450" y="285" width="100" height="25" as="geometry"/>
        </mxCell>
        
        <!-- CLEAN ARROWS WITH PROPER ROUTING -->
        
        <!-- User 1 → Identity Center -->
        <mxCell id="arrow1" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="120" y="187" as="sourcePoint"/>
            <mxPoint x="360" y="203" as="targetPoint"/>
            <Array as="points">
              <mxPoint x="160" y="187"/>
              <mxPoint x="160" y="203"/>
            </Array>
          </mxGeometry>
        </mxCell>
        
        <!-- User 2 → Identity Center -->
        <mxCell id="arrow2" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="120" y="277" as="sourcePoint"/>
            <mxPoint x="360" y="213" as="targetPoint"/>
            <Array as="points">
              <mxPoint x="160" y="277"/>
              <mxPoint x="160" y="213"/>
            </Array>
          </mxGeometry>
        </mxCell>
        
        <!-- Identity Center ↔ On-Premises -->
        <mxCell id="arrow3" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;startArrow=classic;startFill=1;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="382" y="230" as="sourcePoint"/>
            <mxPoint x="382" y="360" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        
        <!-- Identity Center → Permission 1 (routed ABOVE) -->
        <mxCell id="arrow4" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="410" y="203" as="sourcePoint"/>
            <mxPoint x="480" y="170" as="targetPoint"/>
            <Array as="points">
              <mxPoint x="440" y="203"/>
              <mxPoint x="440" y="130"/>
              <mxPoint x="500" y="130"/>
              <mxPoint x="500" y="170"/>
            </Array>
          </mxGeometry>
        </mxCell>
        
        <!-- Identity Center → Permission 2 (routed BELOW) -->
        <mxCell id="arrow5" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="410" y="213" as="sourcePoint"/>
            <mxPoint x="480" y="260" as="targetPoint"/>
            <Array as="points">
              <mxPoint x="440" y="213"/>
              <mxPoint x="440" y="260"/>
            </Array>
          </mxGeometry>
        </mxCell>
        
        <!-- Three OUs Side by Side -->
        <mxCell id="sec-ou" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${PINK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="70" y="460" width="340" height="380" as="geometry"/>
        </mxCell>
        <mxCell id="sec-ou-icon" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="218" y="475" width="45" height="45" as="geometry"/>
        </mxCell>
        <mxCell id="sec-ou-symbol" value="📁" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=28;fontColor=${WHITE};" vertex="1" parent="1">
          <mxGeometry x="218" y="475" width="45" height="45" as="geometry"/>
        </mxCell>
        <mxCell id="sec-ou-label" value="Security/Core OU" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=12;fontColor=${PINK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="90" y="525" width="300" height="20" as="geometry"/>
        </mxCell>
        
        ${securityOU.slice(0, 3).map((acc, i) => `
        <mxCell id="sec-acc-${i}" value="${acc.name || `Security Account ${i+1}`}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=11;fontStyle=1;fontColor=${PINK};verticalAlign=top;spacingTop=30;" vertex="1" parent="1">
          <mxGeometry x="90" y="${560 + i*90}" width="300" height="70" as="geometry"/>
        </mxCell>
        <mxCell id="sec-icon-${i}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="220" y="${575 + i*90}" width="40" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="sec-symbol-${i}" value="📦" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=24;fontColor=${WHITE};" vertex="1" parent="1">
          <mxGeometry x="220" y="${575 + i*90}" width="40" height="40" as="geometry"/>
        </mxCell>
        `).join('')}
        
        <mxCell id="work-ou" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${PINK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="430" y="460" width="340" height="380" as="geometry"/>
        </mxCell>
        <mxCell id="work-ou-icon" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="578" y="475" width="45" height="45" as="geometry"/>
        </mxCell>
        <mxCell id="work-ou-symbol" value="📁" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=28;fontColor=${WHITE};" vertex="1" parent="1">
          <mxGeometry x="578" y="475" width="45" height="45" as="geometry"/>
        </mxCell>
        <mxCell id="work-ou-label" value="Workload OU" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=12;fontColor=${PINK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="450" y="525" width="300" height="20" as="geometry"/>
        </mxCell>
        
        ${workloadOU.slice(0, 3).map((acc, i) => `
        <mxCell id="work-acc-${i}" value="${acc.name || `Workload Account ${i+1}`}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=11;fontStyle=1;fontColor=${PINK};verticalAlign=top;spacingTop=30;" vertex="1" parent="1">
          <mxGeometry x="450" y="${560 + i*90}" width="300" height="70" as="geometry"/>
        </mxCell>
        <mxCell id="work-icon-${i}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="580" y="${575 + i*90}" width="40" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="work-symbol-${i}" value="📦" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=24;fontColor=${WHITE};" vertex="1" parent="1">
          <mxGeometry x="580" y="${575 + i*90}" width="40" height="40" as="geometry"/>
        </mxCell>
        `).join('')}
        
        <mxCell id="net-ou" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${PINK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="790" y="460" width="340" height="380" as="geometry"/>
        </mxCell>
        <mxCell id="net-ou-icon" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="938" y="475" width="45" height="45" as="geometry"/>
        </mxCell>
        <mxCell id="net-ou-symbol" value="📁" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=28;fontColor=${WHITE};" vertex="1" parent="1">
          <mxGeometry x="938" y="475" width="45" height="45" as="geometry"/>
        </mxCell>
        <mxCell id="net-ou-label" value="Networking OU" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=12;fontColor=${PINK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="810" y="525" width="300" height="20" as="geometry"/>
        </mxCell>
        
        ${networkingOU.slice(0, 3).map((acc, i) => `
        <mxCell id="net-acc-${i}" value="${acc.name || `Network Account ${i+1}`}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=11;fontStyle=1;fontColor=${PINK};verticalAlign=top;spacingTop=30;" vertex="1" parent="1">
          <mxGeometry x="810" y="${560 + i*90}" width="300" height="70" as="geometry"/>
        </mxCell>
        <mxCell id="net-icon-${i}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=${WHITE};strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="940" y="${575 + i*90}" width="40" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="net-symbol-${i}" value="📦" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=24;fontColor=${WHITE};" vertex="1" parent="1">
          <mxGeometry x="940" y="${575 + i*90}" width="40" height="40" as="geometry"/>
        </mxCell>
        `).join('')}
        
        <!-- Arrows from Master to OUs (clean routing) -->
        <mxCell id="arrow-sec" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="240" y="330" as="sourcePoint"/>
            <mxPoint x="240" y="460" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        
        <mxCell id="arrow-work" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="600" y="330" as="sourcePoint"/>
            <mxPoint x="600" y="460" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        
        <mxCell id="arrow-net" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="960" y="330" as="sourcePoint"/>
            <mxPoint x="960" y="460" as="targetPoint"/>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>
                {/* Left: Account Structure Details */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflowY: 'auto', maxHeight: '800px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '20px', borderBottom: `3px solid #D6336C`, paddingBottom: '12px' }}>
                    Account Structure
                  </h2>
                  
                  {/* Master Account */}
                  <div style={{ background: '#F4E1E8', border: `2px solid #D6336C`, borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#D6336C', marginBottom: '10px' }}>
                      Master/Payer Account
                    </h3>
                    <p style={{ fontSize: '13px', color: '#2d3748', marginBottom: '6px' }}>
                      <strong>Name:</strong> {architecture.account_structure.master_account.name}
                    </p>
                    <p style={{ fontSize: '13px', color: '#2d3748', marginBottom: '6px' }}>
                      <strong>Email:</strong> {architecture.account_structure.master_account.email}
                    </p>
                    <p style={{ fontSize: '12px', color: '#718096', margin: 0 }}>
                      {architecture.account_structure.master_account.purpose}
                    </p>
                  </div>

                  {/* Security OU */}
                  {architecture.account_structure.security_ou?.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '10px' }}>
                        Security OU ({architecture.account_structure.security_ou.length} accounts)
                      </h3>
                      {architecture.account_structure.security_ou.map((acc, i) => (
                        <div key={i} style={{ background: '#F4E1E8', border: `1px solid #D6336C`, borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
                          <p style={{ fontSize: '12px', fontWeight: '600', color: '#D6336C', marginBottom: '6px' }}>{acc.name}</p>
                          <p style={{ fontSize: '11px', color: '#2d3748', marginBottom: '4px' }}>{acc.email}</p>
                          <p style={{ fontSize: '11px', color: '#718096', margin: 0 }}>{acc.purpose}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Workload OU */}
                  {architecture.account_structure.workload_ou?.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '10px' }}>
                        Workload OU ({architecture.account_structure.workload_ou.length} accounts)
                      </h3>
                      {architecture.account_structure.workload_ou.map((acc, i) => (
                        <div key={i} style={{ background: '#F4E1E8', border: `1px solid #D6336C`, borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
                          <p style={{ fontSize: '12px', fontWeight: '600', color: '#D6336C', marginBottom: '6px' }}>{acc.name}</p>
                          <p style={{ fontSize: '11px', color: '#2d3748', marginBottom: '4px' }}>{acc.email}</p>
                          <p style={{ fontSize: '11px', color: '#718096', margin: 0 }}>{acc.purpose}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Networking OU */}
                  {architecture.account_structure.networking_ou?.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '10px' }}>
                        Networking OU ({architecture.account_structure.networking_ou.length} accounts)
                      </h3>
                      {architecture.account_structure.networking_ou.map((acc, i) => (
                        <div key={i} style={{ background: '#F4E1E8', border: `1px solid #D6336C`, borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
                          <p style={{ fontSize: '12px', fontWeight: '600', color: '#D6336C', marginBottom: '6px' }}>{acc.name}</p>
                          <p style={{ fontSize: '11px', color: '#2d3748', marginBottom: '4px' }}>{acc.email}</p>
                          <p style={{ fontSize: '11px', color: '#718096', margin: 0 }}>{acc.purpose}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Network Architecture */}
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
                      Network Architecture
                    </h2>
                    <div style={{ background: '#f7fafc', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                        <strong style={{ color: '#2d3748' }}>Topology:</strong> {architecture.network_architecture?.topology || 'N/A'}
                      </p>
                      <p style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                        <strong style={{ color: '#2d3748' }}>Primary Region:</strong> {architecture.network_architecture?.primary_region || 'N/A'}
                      </p>
                      <p style={{ fontSize: '12px', color: '#718096', margin: 0 }}>
                        <strong style={{ color: '#2d3748' }}>Secondary Region:</strong> {architecture.network_architecture?.secondary_region || 'None'}
                      </p>
                    </div>
                  </div>

                  {/* Security Baseline */}
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
                      Security Baseline
                    </h2>
                    <div style={{ background: '#f7fafc', padding: '12px', borderRadius: '6px' }}>
                      <p style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                        <strong style={{ color: '#2d3748' }}>IAM Identity Center:</strong> {architecture.security_baseline?.identity_center ? 'Enabled' : 'Disabled'}
                      </p>
                      <p style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                        <strong style={{ color: '#2d3748' }}>MFA:</strong> {architecture.security_baseline?.mfa_enforcement ? 'Enforced' : 'Not Enforced'}
                      </p>
                      <p style={{ fontSize: '12px', color: '#718096', margin: 0 }}>
                        <strong style={{ color: '#2d3748' }}>Services:</strong> {architecture.security_baseline?.services?.join(', ') || 'None specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Diagram Preview */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
                    Organization Diagram
                  </h2>
                  
                  <div style={{ background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '60px 40px', textAlign: 'center' }}>
                    <svg style={{ width: '80px', height: '80px', margin: '0 auto 24px', color: '#D6336C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '12px' }}>
                      Download Draw.io File to View Diagram
                    </h3>
                    <p style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>
                      The organizational diagram has been generated with:
                    </p>
                    <ul style={{ fontSize: '13px', color: '#718096', textAlign: 'left', maxWidth: '400px', margin: '0 auto 24px', lineHeight: '1.8' }}>
                      <li>✓ Pink theme (#D6336C)</li>
                      <li>✓ Clean arrow routing (no overlaps)</li>
                      <li>✓ All OUs and accounts properly organized</li>
                      <li>✓ Professional icons and layout</li>
                    </ul>
                    <p style={{ fontSize: '12px', color: '#718096' }}>
                      Click the button below to download the .drawio file and open it in <a href="https://app.diagrams.net" target="_blank" rel="noopener" style={{ color: '#D6336C', textDecoration: 'underline' }}>diagrams.net</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Buttons */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={downloadDrawio}
                    style={{
                      flex: '1 1 250px',
                      padding: '16px 24px',
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
                    📊 Download Draw.io File
                  </button>
                  <button
                    onClick={downloadJSON}
                    style={{
                      flex: '1 1 250px',
                      padding: '16px 24px',
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
            </div>
          </div>
        )}
      </main>
    </>
  );
}
