import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [formData, setFormData] = useState({
    clientName: '',
    questionnaire: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ============================================
  // SINGLE SOURCE OF TRUTH FOR ALL ICONS
  // ============================================
  const AWS_ICONS = {
    ACCOUNT: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDhweCIgaGVpZ2h0PSI0OHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+SWNvbi1SZXNvdXJjZS9NYW5hZ2VtZW50LUdvdmVybmFuY2UvUmVzX0FXUy1Pcmdhbml6YXRpb25zX0FjY291bnRfNDg8L3RpdGxlPgogICAgPGcgaWQ9Ikljb24tUmVzb3VyY2UvTWFuYWdlbWVudC1Hb3Zlcm5hbmNlL1Jlc19BV1MtT3JnYW5pemF0aW9uc19BY2NvdW50XzQ4IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBkPSJNMzIsMjggQzM1LjMwOSwyOCAzOCwzMC42OTEgMzgsMzQgQzM4LDM3LjMwOSAzNS4zMDksNDAgMzIsNDAgQzI4LjY5MSw0MCAyNiwzNy4zMDkgMjYsMzQgQzI2LDMwLjY5MSAyOC42OTEsMjggMzIsMjggTDMyLDI4IFogTTMyLDQyIEMzNi40MTEsNDIgNDAsMzguNDExIDQwLDM0IEM0MCwyOS41ODkgMzYuNDExLDI2IDMyLDI2IEMyNy41ODksMjYgMjQsMjkuNTg5IDI0LDM0IEMyNCwzOC40MTEgMjcuNTg5LDQyIDMyLDQyIEwzMiw0MiBaIE0zNCw5LjIzNiBMMzguODgyLDE5IEwyOS4xMTgsMTkgTDM0LDkuMjM2IFogTTI3LjUsMjEgTDQwLjUsMjEgQzQwLjg0NywyMSA0MS4xNjgsMjAuODIgNDEuMzUxLDIwLjUyNiBDNDEuNTMzLDIwLjIzMSA0MS41NSwxOS44NjMgNDEuMzk1LDE5LjU1MyBMMzQuODk1LDYuNTUzIEMzNC41NTUsNS44NzUgMzMuNDQ1LDUuODc1IDMzLjEwNSw2LjU1MyBMMjYuNjA1LDE5LjU1MyBDMjYuNDUsMTkuODYzIDI2LjQ2NywyMC4yMzEgMjYuNjQ5LDIwLjUyNiBDMjYuODMyLDIwLjgyIDI3LjE1MywyMSAyNy41LDIxIEwyNy41LDIxIFogTTksMjkgTDIwLDI5IEwyMCwxOCBMOSwxOCBMOSwyOSBaIE04LDMxIEwyMSwzMSBDMjEuNTUzLDMxIDIyLDMwLjU1MiAyMiwzMCBMMjIsMTcgQzIyLDE2LjQ0OCAyMS41NTMsMTYgMjEsMTYgTDgsMTYgQzcuNDQ3LDE2IDcsMTYuNDQ4IDcsMTcgTDcsMzAgQzcsMzAuNTUyIDcuNDQ3LDMxIDgsMzEgTDgsMzEgWiBNNCw0NCBMNDQsNDQgTDQ0LDQgTDQsNCBMNCw0NCBaIE00NSwyIEwzLDIgQzIuNDQ3LDIgMiwyLjQ0OCAyLDMgTDIsNDUgQzIsNDUuNTUyIDIuNDQ3LDQ2IDMsNDYgTDQ1LDQ2IEM0NS41NTMsNDYgNDYsNDUuNTUyIDQ2LDQ1IEw0NiwzIEM0NiwyLjQ0OCA0NS41NTMsMiA0NSwyIEw0NSwyIFoiIGlkPSJGaWxsLTEiIGZpbGw9IiNFNzE1N0IiPjwvcGF0aD4KICAgIDwvZz4KPC9zdmc+',
    OU: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDhweCIgaGVpZ2h0PSI0OHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+SWNvbi1SZXNvdXJjZS9NYW5hZ2VtZW50LUdvdmVybmFuY2UvUmVzX0FXUy1Pcmdhbml6YXRpb25zX09yZ2FuaXphdGlvbmFsLVVuaXRfNDg8L3RpdGxlPgogICAgPGcgaWQ9Ikljb24tUmVzb3VyY2UvTWFuYWdlbWVudC1Hb3Zlcm5hbmNlL1Jlc19BV1MtT3JnYW5pemF0aW9uc19Pcmdhbml6YXRpb25hbC1Vbml0XzQ4IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBkPSJNMzQsMzAgQzM2Ljc1NywzMCAzOSwzMi4yNDMgMzksMzUgQzM5LDM3Ljc1NyAzNi43NTcsNDAgMzQsNDAgQzMxLjI0Myw0MCAyOSwzNy43NTcgMjksMzUgQzI5LDMyLjI0MyAzMS4yNDMsMzAgMzQsMzAgTDM0LDMwIFogTTM0LDQyIEMzNy44NTksNDIgNDEsMzguODYgNDEsMzUgQzQxLDMxLjE0IDM3Ljg1OSwyOCAzNCwyOCBDMzAuMTQxLDI4IDI3LDMxLjE0IDI3LDM1IEMyNywzOC44NiAzMC4xNDEsNDIgMzQsNDIgTDM0LDQyIFogTTM1LjgzMSwxNS41MDMgTDM5LjU3OSwyMyBMMzIuMDgzLDIzIEwzNS44MzEsMTUuNTAzIFogTTMwLjQ2NSwyNSBMNDEuMTk3LDI1IEM0MS41NDQsMjUgNDEuODY1LDI0LjgyIDQyLjA0OCwyNC41MjYgQzQyLjIzLDI0LjIzMSA0Mi4yNDcsMjMuODYzIDQyLjA5MiwyMy41NTMgTDM2LjcyNiwxMi44MiBDMzYuMzg2LDEyLjE0MyAzNS4yNzYsMTIuMTQzIDM0LjkzNywxMi44MiBMMjkuNTcsMjMuNTUzIEMyOS40MTUsMjMuODYzIDI5LjQzMiwyNC4yMzEgMjkuNjE0LDI0LjUyNiBDMjkuNzk3LDI0LjgyIDMwLjExOCwyNSAzMC40NjUsMjUgTDMwLjQ2NSwyNSBaIE0xNCwzMiBMMjMsMzIgTDIzLDIzIEwxNCwyMyBMMTQsMzIgWiBNMTMsMzQgTDI0LDM0IEMyNC41NTMsMzQgMjUsMzMuNTUyIDI1LDMzIEwyNSwyMiBDMjUsMjEuNDQ4IDI0LjU1MywyMSAyNCwyMSBMMTMsMjEgQzEyLjQ0NywyMSAxMiwyMS40NDggMTIsMjIgTDEyLDMzIEMxMiwzMy41NTIgMTIuNDQ3LDM0IDEzLDM0IEwxMywzNCBaIE00LDM4IEw2LDM4IEw2LDQwIEwzLDQwIEMyLjQ0Nyw0MCAyLDM5LjU1MiAyLDM5IEwyLDMgQzIsMi40NDggMi40NDcsMiAzLDIgTDM5LDIgQzM5LjU1MywyIDQwLDIuNDQ4IDQwLDMgTDQwLDYgTDM4LDYgTDM4LDQgTDQsNCBMNCwzOCBaIE0xMCw0NCBMNDQsNDQgTDQ0LDEwIEwxMCwxMCBMMTAsNDQgWiBNNDUsOCBMOSw4IEM4LjQ0Nyw4IDgsOC40NDggOCw5IEw4LDQ1IEM4LDQ1LjU1MiA4LjQ0Nyw0NiA5LDQ2IEw0NSw0NiBDNDUuNTUzLDQ2IDQ2LDQ1LjU1MiA0Niw0NSBMNDYsOSBDNDYsOC40NDggNDUuNTUzLDggNDUsOCBMNDUsOCBaIiBpZD0iRmlsbC0xIiBmaWxsPSIjRTcxNTdCIj48L3BhdGg+CiAgICA8L2c+Cjwvc3ZnPg=='
  };

  // SINGLE ICON RENDER FUNCTION - NO CONDITIONALS, NO BRANCHES
  const renderEmbeddedIcon = (iconType, width, height) => {
    const iconData = AWS_ICONS[iconType];
    return `shape=image;verticalLabelPosition=bottom;labelBackgroundColor=default;verticalAlign=top;aspect=fixed;imageAspect=0;image=data:image/svg+xml,${iconData};`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.questionnaire) {
      setError('Please upload a questionnaire file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const questionnaireText = await formData.questionnaire.text();
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.clientName,
          questionnaire: questionnaireText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate architecture');
      }

      const architecture = await response.json();
      const drawioXML = generateDrawioXML(architecture);
      downloadDrawio(drawioXML, `${architecture.client_name}_AWS_Landing_Zone.drawio`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateDrawioXML = (architecture) => {
    const WHITE = '#FFFFFF';
    const PINK = '#D6336C';
    const LIGHT_PINK = '#F4E1E8';
    
    const securityOU = architecture.security_ou || [];
    const workloadOU = architecture.workload_ou || [];
    const networkingOU = architecture.networking_ou || [];
    
    const maxAccounts = Math.max(securityOU.length, workloadOU.length, networkingOU.length, 3);
    const canvasHeight = 450 + (maxAccounts * 80);

    return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" type="device">
  <diagram name="AWS Landing Zone Architecture" id="aws-lz">
    <mxGraphModel dx="1600" dy="${canvasHeight}" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="${canvasHeight}" background="${WHITE}">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        
        <!-- AWS Cloud Container -->
        <mxCell id="aws-cloud" value="AWS Cloud" style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_aws_cloud_alt;strokeColor=#232F3D;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#232F3D;dashed=0;" vertex="1" parent="1">
          <mxGeometry x="20" y="20" width="1540" height="${canvasHeight - 40}" as="geometry"/>
        </mxCell>
        
        <!-- Master Account Container -->
        <mxCell id="master-account" value="${architecture.client_name || 'Client'} Master/Payer Account
${architecture.master_email || 'master@client.com'}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};strokeWidth=2;fontSize=12;fontStyle=1;fontColor=${PINK};verticalAlign=top;spacingTop=10;" vertex="1" parent="1">
          <mxGeometry x="60" y="60" width="1480" height="220" as="geometry"/>
        </mxCell>

        <!-- All top-level icons kept simple - no conditionals needed -->
        
        <!-- Security OU -->
        <mxCell id="sec-ou-container" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${PINK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="60" y="450" width="450" height="${120 + securityOU.length * 80}" as="geometry"/>
        </mxCell>
        
        <!-- OU Icon - EMBEDDED (NO CONDITIONALS) -->
        <mxCell id="sec-ou-icon" value="" style="${renderEmbeddedIcon('OU', 36, 36)}" vertex="1" parent="1">
          <mxGeometry x="267" y="470" width="36" height="36" as="geometry"/>
        </mxCell>
        
        <mxCell id="sec-ou-label" value="${architecture.client_name || 'Client'} Security OU" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=12;fontColor=${PINK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="80" y="518" width="410" height="20" as="geometry"/>
        </mxCell>
        
        <!-- Security OU Accounts - EMBEDDED ICONS ONLY -->
        ${securityOU.map((acc, i) => `
        <mxCell id="sec-acc-${i}" value="    ${acc.name || `Security Account ${i+1}`}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=11;fontStyle=1;fontColor=${PINK};verticalAlign=middle;align=left;spacingLeft=50;" vertex="1" parent="1">
          <mxGeometry x="80" y="${555 + i*80}" width="410" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="sec-acc-icon-${i}" value="" style="${renderEmbeddedIcon('ACCOUNT', 30, 30)}" vertex="1" parent="1">
          <mxGeometry x="95" y="${570 + i*80}" width="30" height="30" as="geometry"/>
        </mxCell>
        `).join('')}
        
        <!-- Workload OU -->
        <mxCell id="work-ou-container" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${PINK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="540" y="450" width="450" height="${120 + workloadOU.length * 80}" as="geometry"/>
        </mxCell>
        
        <mxCell id="work-ou-icon" value="" style="${renderEmbeddedIcon('OU', 36, 36)}" vertex="1" parent="1">
          <mxGeometry x="747" y="470" width="36" height="36" as="geometry"/>
        </mxCell>
        
        <mxCell id="work-ou-label" value="${architecture.client_name || 'Client'} Workload OU" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=12;fontColor=${PINK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="560" y="518" width="410" height="20" as="geometry"/>
        </mxCell>
        
        ${workloadOU.map((acc, i) => `
        <mxCell id="work-acc-${i}" value="    ${acc.name || `Workload Account ${i+1}`}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=11;fontStyle=1;fontColor=${PINK};verticalAlign=middle;align=left;spacingLeft=50;" vertex="1" parent="1">
          <mxGeometry x="560" y="${555 + i*80}" width="410" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="work-acc-icon-${i}" value="" style="${renderEmbeddedIcon('ACCOUNT', 30, 30)}" vertex="1" parent="1">
          <mxGeometry x="575" y="${570 + i*80}" width="30" height="30" as="geometry"/>
        </mxCell>
        `).join('')}
        
        <!-- Networking OU -->
        <mxCell id="net-ou-container" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${PINK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="1020" y="450" width="450" height="${120 + networkingOU.length * 80}" as="geometry"/>
        </mxCell>
        
        <mxCell id="net-ou-icon" value="" style="${renderEmbeddedIcon('OU', 36, 36)}" vertex="1" parent="1">
          <mxGeometry x="1227" y="470" width="36" height="36" as="geometry"/>
        </mxCell>
        
        <mxCell id="net-ou-label" value="${architecture.client_name || 'Client'} Networking OU" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=12;fontColor=${PINK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1040" y="518" width="410" height="20" as="geometry"/>
        </mxCell>
        
        ${networkingOU.map((acc, i) => `
        <mxCell id="net-acc-${i}" value="    ${acc.name || `Network Account ${i+1}`}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=11;fontStyle=1;fontColor=${PINK};verticalAlign=middle;align=left;spacingLeft=50;" vertex="1" parent="1">
          <mxGeometry x="1040" y="${555 + i*80}" width="410" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="net-acc-icon-${i}" value="" style="${renderEmbeddedIcon('ACCOUNT', 30, 30)}" vertex="1" parent="1">
          <mxGeometry x="1055" y="${570 + i*80}" width="30" height="30" as="geometry"/>
        </mxCell>
        `).join('')}
        
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
  };

  const downloadDrawio = (xmlContent, filename) => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>AWS Landing Zone Design Workshop Agent</title>
      </Head>
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>AWS Landing Zone Agent</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>Client Name:</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>Upload Questionnaire:</label>
            <input
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={(e) => setFormData({...formData, questionnaire: e.target.files[0]})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '10px 20px', background: '#D6336C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? 'Generating...' : 'Generate Diagram'}
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}
      </div>
    </>
  );
}
