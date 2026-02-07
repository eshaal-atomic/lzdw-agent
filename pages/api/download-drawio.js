export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { architecture } = req.body;

    if (!architecture || !architecture.account_structure) {
      return res.status(400).json({ error: 'Architecture data is required' });
    }

    // Extract data
    const {
      client_name = 'Client',
      account_structure,
    } = architecture;

    const {
      master_account,
      security_ou = [],
      workload_ou = [],
      networking_ou = [],
    } = account_structure;

    // EXACT COLORS from your reference images
    const COLORS = {
      masterBorder: '#D6336C',
      masterFill: '#FFE6F0',
      ouBorder: '#D6336C',
      accountBorder: '#D6336C',
      accountFill: '#F4E1E8',
      permissionSetBg: '#DD344C',
      controlTowerBg: '#DD344C',
      text: '#232F3E',
    };

    let cellId = 100;
    const getNextId = () => `cell-${cellId++}`;

    let cells = '';

    // AWS Cloud badge (top left corner)
    cells += `
      <mxCell id="${getNextId()}" value="AWS Cloud" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=none;fontSize=12;fontColor=#FFFFFF;fontStyle=1;align=left;spacingLeft=10;" vertex="1" parent="1">
        <mxGeometry x="240" y="50" width="120" height="30" as="geometry"/>
      </mxCell>`;

    // Main container (dashed border)
    cells += `
      <mxCell id="${getNextId()}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#232F3E;strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
        <mxGeometry x="230" y="90" width="1110" height="570" as="geometry"/>
      </mxCell>`;

    // Master/Payer Account (top center, pink box)
    const masterName = master_account?.name || `${client_name} Master/Payer Account`;
    const masterEmail = master_account?.email || 'Client Master/Root Email';
    
    const masterX = 280;
    const masterY = 110;
    const masterW = 360;
    const masterH = 140;

    cells += `
      <mxCell id="${getNextId()}" value="${masterName}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${COLORS.masterFill};strokeColor=${COLORS.masterBorder};strokeWidth=3;fontSize=14;fontStyle=1;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;" vertex="1" parent="1">
        <mxGeometry x="${masterX}" y="${masterY}" width="${masterW}" height="${masterH}" as="geometry"/>
      </mxCell>`;

    // Email below title
    cells += `
      <mxCell id="${getNextId()}" value="${masterEmail}" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;fontSize=10;fontColor=${COLORS.text};spacingLeft=15;" vertex="1" parent="1">
        <mxGeometry x="${masterX}" y="${masterY + 30}" width="${masterW}" height="20" as="geometry"/>
      </mxCell>`;

    // Control Tower icon (inside master box, left)
    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#DD344C;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.control_tower;" vertex="1" parent="1">
        <mxGeometry x="${masterX + 70}" y="${masterY + 65}" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="Control Tower" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${COLORS.text};" vertex="1" parent="1">
        <mxGeometry x="${masterX + 45}" y="${masterY + 115}" width="100" height="20" as="geometry"/>
      </mxCell>`;

    // Administrator icon (inside master box, right side)
    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#DD344C;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.user;" vertex="1" parent="1">
        <mxGeometry x="${masterX + 260}" y="${masterY + 58}" width="35" height="35" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#DD344C;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.resourcegroups;" vertex="1" parent="1">
        <mxGeometry x="${masterX + 255}" y="${masterY + 90}" width="25" height="25" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="Administrator" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${COLORS.text};" vertex="1" parent="1">
        <mxGeometry x="${masterX + 235}" y="${masterY + 115}" width="90" height="20" as="geometry"/>
      </mxCell>`;

    // Administrator/Root user (left side, outside container)
    const adminX = 90;
    const adminY = 240;

    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#666666;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.user;" vertex="1" parent="1">
        <mxGeometry x="${adminX + 20}" y="${adminY}" width="40" height="40" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="Administrator/Root" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=11;fontColor=${COLORS.text};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${adminX - 20}" y="${adminY + 45}" width="120" height="20" as="geometry"/>
      </mxCell>`;

    // Developers/Testers user (left side, outside container)
    const devY = adminY + 120;

    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#666666;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.users;" vertex="1" parent="1">
        <mxGeometry x="${adminX + 15}" y="${devY}" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="Developers/Testers" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=11;fontColor=${COLORS.text};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${adminX - 20}" y="${devY + 55}" width="120" height="20" as="geometry"/>
      </mxCell>`;

    // Identity Center (left side, inside container)
    const identityX = 280;
    const identityY = 290;

    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#DD344C;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.single_sign_on;" vertex="1" parent="1">
        <mxGeometry x="${identityX + 15}" y="${identityY}" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="Identity Center" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${COLORS.text};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${identityX - 10}" y="${identityY + 55}" width="100" height="20" as="geometry"/>
      </mxCell>`;

    // On-Premises / Cloud AD (below Identity Center)
    const onPremY = identityY + 110;

    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=#666666;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.traditional_server;" vertex="1" parent="1">
        <mxGeometry x="${identityX + 15}" y="${onPremY}" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="On-Premises / AWS Cloud AD" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${COLORS.text};" vertex="1" parent="1">
        <mxGeometry x="${identityX - 15}" y="${onPremY + 55}" width="110" height="30" as="geometry"/>
      </mxCell>`;

    // Arrow: Admin → Identity Center
    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${adminX + 80}" y="${adminY + 20}" as="sourcePoint"/>
          <mxPoint x="${identityX + 15}" y="${identityY + 25}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Arrow: Developers → Identity Center
    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${adminX + 80}" y="${devY + 25}" as="sourcePoint"/>
          <mxPoint x="${identityX + 15}" y="${identityY + 35}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Arrow: Identity Center ↔ On-Prem (bidirectional)
    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=2;startArrow=classic;startFill=1;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${identityX + 40}" y="${identityY + 50}" as="sourcePoint"/>
          <mxPoint x="${identityX + 40}" y="${onPremY}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Permission Sets (between Identity Center and Master)
    const permX = (identityX + masterX + masterW) / 2 - 50;
    const permY1 = masterY + 30;
    const permY2 = masterY + 90;

    cells += `
      <mxCell id="${getNextId()}" value="Admin Permission Set" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${COLORS.permissionSetBg};strokeColor=${COLORS.permissionSetBg};strokeWidth=2;fontSize=10;fontColor=#FFFFFF;fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${permX}" y="${permY1}" width="100" height="45" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="Dev/Tester Permission Set" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${COLORS.permissionSetBg};strokeColor=${COLORS.permissionSetBg};strokeWidth=2;fontSize=10;fontColor=#FFFFFF;fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${permX}" y="${permY2}" width="100" height="45" as="geometry"/>
      </mxCell>`;

    // Arrows: Identity Center → Permission Sets
    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${identityX + 80}" y="${identityY + 15}" as="sourcePoint"/>
          <mxPoint x="${permX}" y="${permY1 + 22}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${identityX + 80}" y="${identityY + 35}" as="sourcePoint"/>
          <mxPoint x="${permX}" y="${permY2 + 22}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Arrows: Permission Sets → Master Account
    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${permX + 100}" y="${permY1 + 22}" as="sourcePoint"/>
          <mxPoint x="${masterX}" y="${masterY + 60}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${permX + 100}" y="${permY2 + 22}" as="sourcePoint"/>
          <mxPoint x="${masterX}" y="${masterY + 100}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Organizational Units (3 columns below master)
    const ous = [
      { name: 'Security/Core OU', accounts: security_ou },
      { name: 'Workload OU', accounts: workload_ou },
      { name: 'Networking OU', accounts: networking_ou },
    ];

    const ouStartX = 690;
    const ouY = 280;
    const ouWidth = 200;
    const ouHeight = 340;
    const ouSpacing = 20;

    let currentOuX = ouStartX;

    ous.forEach((ou, ouIdx) => {
      // OU container
      cells += `
        <mxCell id="${getNextId()}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${COLORS.ouBorder};strokeWidth=2;verticalAlign=top;align=center;spacingTop=10;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="${currentOuX}" y="${ouY}" width="${ouWidth}" height="${ouHeight}" as="geometry"/>
        </mxCell>`;

      // OU icon
      cells += `
        <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${COLORS.permissionSetBg};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.group;" vertex="1" parent="1">
          <mxGeometry x="${currentOuX + ouWidth/2 - 20}" y="${ouY + 10}" width="40" height="40" as="geometry"/>
        </mxCell>`;

      // OU label
      cells += `
        <mxCell id="${getNextId()}" value="${ou.name}" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=12;fontColor=${COLORS.text};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="${currentOuX + 10}" y="${ouY + 55}" width="${ouWidth - 20}" height="25" as="geometry"/>
        </mxCell>`;

      // Accounts inside OU
      let accountY = ouY + 90;
      const accountWidth = ouWidth - 30;
      const accountHeight = 70;
      const accountSpacing = 15;

      ou.accounts.slice(0, 3).forEach((account, accIdx) => {
        const accountName = account.name || `Account ${accIdx + 1}`;
        const accountEmail = account.email || '';

        // Account box
        cells += `
          <mxCell id="${getNextId()}" value="${accountName}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${COLORS.accountFill};strokeColor=${COLORS.accountBorder};strokeWidth=2;fontSize=10;fontStyle=1;verticalAlign=top;align=left;spacingLeft=10;spacingTop=8;" vertex="1" parent="1">
            <mxGeometry x="${currentOuX + 15}" y="${accountY}" width="${accountWidth}" height="${accountHeight}" as="geometry"/>
          </mxCell>`;

        // Account email
        if (accountEmail) {
          cells += `
            <mxCell id="${getNextId()}" value="${accountEmail}" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;fontSize=8;fontColor=${COLORS.text};spacingLeft=10;" vertex="1" parent="1">
              <mxGeometry x="${currentOuX + 20}" y="${accountY + 25}" width="${accountWidth - 10}" height="15" as="geometry"/>
            </mxCell>`;
        }

        // Account icon (user + cube)
        cells += `
          <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${COLORS.permissionSetBg};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.user;" vertex="1" parent="1">
            <mxGeometry x="${currentOuX + accountWidth/2 - 5}" y="${accountY + 43}" width="20" height="20" as="geometry"/>
          </mxCell>`;

        cells += `
          <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${COLORS.permissionSetBg};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.resourcegroups;" vertex="1" parent="1">
            <mxGeometry x="${currentOuX + accountWidth/2 + 18}" y="${accountY + 43}" width="18" height="18" as="geometry"/>
          </mxCell>`;

        accountY += accountHeight + accountSpacing;
      });

      // Arrow from Master to OU (downward from master, then to OU top)
      const arrowSourceY = masterY + masterH;
      const arrowTargetX = currentOuX + ouWidth / 2;
      const arrowTargetY = ouY;

      cells += `
        <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${masterX + masterW/2}" y="${arrowSourceY}" as="sourcePoint"/>
            <mxPoint x="${arrowTargetX}" y="${arrowTargetY}" as="targetPoint"/>
            <Array as="points">
              <mxPoint x="${masterX + masterW/2}" y="${arrowSourceY + 15}"/>
              <mxPoint x="${arrowTargetX}" y="${arrowSourceY + 15}"/>
            </Array>
          </mxGeometry>
        </mxCell>`;

      currentOuX += ouWidth + ouSpacing;
    });

    // Generate final XML
    const drawioXml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" version="24.0.0">
  <diagram name="AWS Landing Zone Architecture" id="aws-lz">
    <mxGraphModel dx="2000" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="750" background="#FFFFFF">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        ${cells}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

    return res.status(200).json({ xml: drawioXml });

  } catch (error) {
    console.error('Draw.io generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate Draw.io diagram',
      message: error.message 
    });
  }
}
