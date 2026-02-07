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

    // COLORS - Matching Petra reference exactly
    const COLORS = {
      masterBorder: '#D6336C',    // Pink border
      masterFill: '#F4E1E8',      // Light pink fill
      ouBorder: '#D6336C',        // Pink border for OUs
      ouFill: '#FFFFFF',          // White fill for OUs
      accountBorder: '#D6336C',   // Pink border for accounts
      accountFill: '#F4E1E8',     // Light pink for accounts
      iconRed: '#DD344C',         // AWS red for icons
      iconBlue: '#5294CF',        // AWS blue for cloud icon
      text: '#232F3E',            // Dark text
      arrow: '#000000',           // Black arrows
      cloudBorder: '#232F3E',     // Dark border for cloud
    };

    // Layout configuration
    const LAYOUT = {
      cloudX: 230,
      cloudY: 40,
      cloudWidth: 1110,
      cloudHeight: 670,
      
      masterX: 250,
      masterY: 90,
      masterWidth: 360,
      masterHeight: 180,
      
      usersX: 90,
      usersY: 200,
      userWidth: 100,
      userHeight: 60,
      
      identityCenterX: 250,
      identityCenterY: 320,
      identityCenterWidth: 140,
      identityCenterHeight: 60,
      
      onPremX: 250,
      onPremY: 420,
      onPremWidth: 140,
      onPremHeight: 80,
      
      ouStartX: 660,
      ouY: 140,
      ouWidth: 320,
      ouHeight: 500,
      ouSpacing: 30,
      
      accountWidth: 280,
      accountHeight: 100,
      accountSpacing: 20,
    };

    // Start building XML
    let cellId = 100;
    const getNextId = () => `cell-${cellId++}`;

    let cells = '';

    // AWS Cloud container
    cells += `
      <mxCell id="${getNextId()}" value="AWS Cloud" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${COLORS.cloudBorder};strokeWidth=2;fontSize=14;fontStyle=1;verticalAlign=top;align=left;spacingLeft=10;spacingTop=5;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.cloudX}" y="${LAYOUT.cloudY}" width="${LAYOUT.cloudWidth}" height="${LAYOUT.cloudHeight}" as="geometry"/>
      </mxCell>`;

    // AWS Cloud logo (top left)
    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=${COLORS.text};fillColor=${COLORS.iconBlue};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.cloud;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.cloudX + 10}" y="${LAYOUT.cloudY + 5}" width="40" height="25" as="geometry"/>
      </mxCell>`;

    // Master/Payer Account
    const masterName = master_account?.name || 'Master/Payer Account';
    const masterEmail = master_account?.email || 'master@client.com';
    
    cells += `
      <mxCell id="${getNextId()}" value="${masterName}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${COLORS.masterFill};strokeColor=${COLORS.masterBorder};strokeWidth=3;fontSize=14;fontStyle=1;verticalAlign=top;align=center;spacingTop=10;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.masterX}" y="${LAYOUT.masterY}" width="${LAYOUT.masterWidth}" height="${LAYOUT.masterHeight}" as="geometry"/>
      </mxCell>`;

    // Master account email (inside master box)
    cells += `
      <mxCell id="${getNextId()}" value="${masterEmail}" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=10;fontColor=${COLORS.text};" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.masterX + 10}" y="${LAYOUT.masterY + 35}" width="${LAYOUT.masterWidth - 20}" height="20" as="geometry"/>
      </mxCell>`;

    // Control Tower icon (inside master)
    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=${COLORS.text};fillColor=${COLORS.iconRed};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.control_tower;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.masterX + 40}" y="${LAYOUT.masterY + 70}" width="50" height="50" as="geometry"/>
      </mxCell>`;

    // Control Tower label
    cells += `
      <mxCell id="${getNextId()}" value="Control Tower" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=10;fontColor=${COLORS.text};" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.masterX + 20}" y="${LAYOUT.masterY + 130}" width="90" height="20" as="geometry"/>
      </mxCell>`;

    // Administrator icon (inside master, right side)
    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=${COLORS.text};fillColor=${COLORS.iconRed};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.user;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.masterX + 240}" y="${LAYOUT.masterY + 70}" width="40" height="40" as="geometry"/>
      </mxCell>`;

    // Administrator label
    cells += `
      <mxCell id="${getNextId()}" value="Administrator" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=10;fontColor=${COLORS.text};" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.masterX + 215}" y="${LAYOUT.masterY + 120}" width="90" height="20" as="geometry"/>
      </mxCell>`;

    // Administrator/Root user (left side, outside cloud)
    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=${COLORS.text};fillColor=#666666;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.user;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.usersX + 30}" y="${LAYOUT.usersY}" width="40" height="40" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="Administrator/Root" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=11;fontColor=${COLORS.text};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.usersX}" y="${LAYOUT.usersY + 45}" width="${LAYOUT.userWidth}" height="20" as="geometry"/>
      </mxCell>`;

    // Developers/Testers user (left side, outside cloud)
    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=${COLORS.text};fillColor=#666666;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.users;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.usersX + 25}" y="${LAYOUT.usersY + 110}" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="Developers/Testers" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=11;fontColor=${COLORS.text};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.usersX}" y="${LAYOUT.usersY + 165}" width="${LAYOUT.userWidth}" height="20" as="geometry"/>
      </mxCell>`;

    // Identity Center (below users)
    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=${COLORS.text};fillColor=${COLORS.iconRed};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.identity_and_access_management;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.identityCenterX + 40}" y="${LAYOUT.identityCenterY}" width="60" height="60" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="Identity Center" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=11;fontColor=${COLORS.text};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.identityCenterX}" y="${LAYOUT.identityCenterY + 65}" width="${LAYOUT.identityCenterWidth}" height="20" as="geometry"/>
      </mxCell>`;

    // On-Premises / Cloud AD (below Identity Center)
    cells += `
      <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=${COLORS.text};fillColor=#666666;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.traditional_server;" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.onPremX + 40}" y="${LAYOUT.onPremY}" width="60" height="60" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="On-Premises / AWS Cloud AD" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=10;fontColor=${COLORS.text};" vertex="1" parent="1">
        <mxGeometry x="${LAYOUT.onPremX}" y="${LAYOUT.onPremY + 65}" width="${LAYOUT.onPremWidth}" height="30" as="geometry"/>
      </mxCell>`;

    // Arrows from users to Identity Center
    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${COLORS.arrow};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${LAYOUT.usersX + LAYOUT.userWidth}" y="${LAYOUT.usersY + 20}" as="sourcePoint"/>
          <mxPoint x="${LAYOUT.identityCenterX + 70}" y="${LAYOUT.identityCenterY + 20}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${COLORS.arrow};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${LAYOUT.usersX + LAYOUT.userWidth}" y="${LAYOUT.usersY + 130}" as="sourcePoint"/>
          <mxPoint x="${LAYOUT.identityCenterX + 70}" y="${LAYOUT.identityCenterY + 40}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Arrow from Identity Center to On-Prem
    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${COLORS.arrow};strokeWidth=2;endArrow=classic;endFill=1;startArrow=classic;startFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${LAYOUT.identityCenterX + 70}" y="${LAYOUT.identityCenterY + 60}" as="sourcePoint"/>
          <mxPoint x="${LAYOUT.onPremX + 70}" y="${LAYOUT.onPremY}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Permission sets (between Identity Center and Master Account)
    const permSetsX = (LAYOUT.identityCenterX + LAYOUT.masterX) / 2;
    const permSetsY = LAYOUT.masterY + 50;

    cells += `
      <mxCell id="${getNextId()}" value="Admin Permission\\nSet" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${COLORS.iconRed};strokeColor=${COLORS.iconRed};strokeWidth=2;fontSize=10;fontColor=#FFFFFF;fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${permSetsX}" y="${permSetsY}" width="100" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="Dev/Tester\\nPermission Set" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${COLORS.iconRed};strokeColor=${COLORS.iconRed};strokeWidth=2;fontSize=10;fontColor=#FFFFFF;fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${permSetsX}" y="${permSetsY + 80}" width="100" height="50" as="geometry"/>
      </mxCell>`;

    // Arrows from Identity Center to Permission Sets
    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${COLORS.arrow};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${LAYOUT.identityCenterX + LAYOUT.identityCenterWidth}" y="${LAYOUT.identityCenterY + 30}" as="sourcePoint"/>
          <mxPoint x="${permSetsX}" y="${permSetsY + 25}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${COLORS.arrow};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${LAYOUT.identityCenterX + LAYOUT.identityCenterWidth}" y="${LAYOUT.identityCenterY + 40}" as="sourcePoint"/>
          <mxPoint x="${permSetsX}" y="${permSetsY + 105}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Arrows from Permission Sets to Master Account
    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${COLORS.arrow};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${permSetsX + 100}" y="${permSetsY + 25}" as="sourcePoint"/>
          <mxPoint x="${LAYOUT.masterX}" y="${LAYOUT.masterY + 80}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    cells += `
      <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${COLORS.arrow};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${permSetsX + 100}" y="${permSetsY + 105}" as="sourcePoint"/>
          <mxPoint x="${LAYOUT.masterX}" y="${LAYOUT.masterY + 120}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Organizational Units
    const ous = [
      { name: 'Security/Core OU', accounts: security_ou },
      { name: 'Workload OU', accounts: workload_ou },
      { name: 'Networking OU', accounts: networking_ou },
    ];

    let currentOuX = LAYOUT.ouStartX;

    ous.forEach((ou, ouIndex) => {
      // OU container
      cells += `
        <mxCell id="${getNextId()}" value="${ou.name}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${COLORS.ouFill};strokeColor=${COLORS.ouBorder};strokeWidth=2;fontSize=12;fontStyle=1;verticalAlign=top;align=center;spacingTop=10;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="${currentOuX}" y="${LAYOUT.ouY}" width="${LAYOUT.ouWidth}" height="${LAYOUT.ouHeight}" as="geometry"/>
        </mxCell>`;

      // OU icon (at top)
      cells += `
        <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=${COLORS.text};fillColor=${COLORS.iconRed};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.group;" vertex="1" parent="1">
          <mxGeometry x="${currentOuX + (LAYOUT.ouWidth / 2) - 20}" y="${LAYOUT.ouY + 35}" width="40" height="40" as="geometry"/>
        </mxCell>`;

      // Accounts inside OU
      let currentAccountY = LAYOUT.ouY + 90;
      
      ou.accounts.slice(0, 3).forEach((account, accIndex) => {
        const accountName = account.name || `Account ${accIndex + 1}`;
        const accountEmail = account.email || '';

        cells += `
          <mxCell id="${getNextId()}" value="${accountName}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${COLORS.accountFill};strokeColor=${COLORS.accountBorder};strokeWidth=2;fontSize=11;fontStyle=1;verticalAlign=top;align=center;spacingTop=10;" vertex="1" parent="1">
            <mxGeometry x="${currentOuX + 20}" y="${currentAccountY}" width="${LAYOUT.accountWidth}" height="${LAYOUT.accountHeight}" as="geometry"/>
          </mxCell>`;

        // Account email inside account box
        if (accountEmail) {
          cells += `
            <mxCell id="${getNextId()}" value="${accountEmail}" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=9;fontColor=${COLORS.text};" vertex="1" parent="1">
              <mxGeometry x="${currentOuX + 30}" y="${currentAccountY + 30}" width="${LAYOUT.accountWidth - 20}" height="15" as="geometry"/>
            </mxCell>`;
        }

        // Account icon (user + resource)
        cells += `
          <mxCell id="${getNextId()}" value="" style="sketch=0;outlineConnect=0;fontColor=${COLORS.text};fillColor=${COLORS.iconRed};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.user;" vertex="1" parent="1">
            <mxGeometry x="${currentOuX + (LAYOUT.ouWidth / 2) - 20}" y="${currentAccountY + 55}" width="30" height="30" as="geometry"/>
          </mxCell>`;

        currentAccountY += LAYOUT.accountHeight + LAYOUT.accountSpacing;
      });

      // Arrow from Master to OU
      cells += `
        <mxCell id="${getNextId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${COLORS.arrow};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${LAYOUT.masterX + LAYOUT.masterWidth / 2}" y="${LAYOUT.masterY}" as="sourcePoint"/>
            <mxPoint x="${currentOuX + LAYOUT.ouWidth / 2}" y="${LAYOUT.ouY}" as="targetPoint"/>
            <Array as="points">
              <mxPoint x="${LAYOUT.masterX + LAYOUT.masterWidth / 2}" y="${LAYOUT.masterY - 20}"/>
              <mxPoint x="${currentOuX + LAYOUT.ouWidth / 2}" y="${LAYOUT.masterY - 20}"/>
            </Array>
          </mxGeometry>
        </mxCell>`;

      currentOuX += LAYOUT.ouWidth + LAYOUT.ouSpacing;
    });

    // Generate final XML
    const drawioXml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" version="24.0.0">
  <diagram name="AWS Landing Zone Architecture" id="aws-lz">
    <mxGraphModel dx="2000" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="850" background="#FFFFFF">
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
