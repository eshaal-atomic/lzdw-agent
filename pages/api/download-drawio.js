export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { architecture } = req.body;

    if (!architecture || !architecture.account_structure) {
      return res.status(400).json({ error: 'Architecture data is required' });
    }

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

    // EXACT COLORS from AWS official diagrams
    const PINK = '#D6336C';
    const LIGHT_PINK = '#F4E1E8';
    const ICON_PINK = '#DD344C';
    const WHITE = '#FFFFFF';
    const DARK = '#232F3E';
    const GRAY = '#879196';

    let cellId = 100;
    const getId = () => `cell-${cellId++}`;

    let cells = '';

    // AWS Cloud badge (top left, dark)
    cells += `
      <mxCell id="${getId()}" value="AWS Cloud" style="sketch=0;outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_aws_cloud;strokeColor=#232F3E;fillColor=#232F3E;verticalAlign=top;align=left;spacingLeft=30;fontColor=#FFFFFF;dashed=0;" vertex="1" parent="1">
        <mxGeometry x="230" y="40" width="120" height="40" as="geometry"/>
      </mxCell>`;

    // Main outer dashed container
    cells += `
      <mxCell id="${getId()}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${DARK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
        <mxGeometry x="220" y="90" width="1120" height="620" as="geometry"/>
      </mxCell>`;

    // Master/Payer Account BIG PINK CONTAINER
    const masterName = master_account?.name || `${client_name} Master/Payer Account`;
    const masterEmail = master_account?.email || 'Client Master/Root Email';

    cells += `
      <mxCell id="${getId()}" value="${masterName}&lt;br&gt;${masterEmail}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};strokeWidth=3;fontSize=13;fontStyle=1;fontColor=${PINK};verticalAlign=top;align=left;spacingLeft=70;spacingTop=10;" vertex="1" parent="1">
        <mxGeometry x="240" y="110" width="1080" height="160" as="geometry"/>
      </mxCell>`;

    // REAL AWS ICON: Management Account (pink square icon on left)
    cells += `
      <mxCell id="${getId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.organizations;" vertex="1" parent="1">
        <mxGeometry x="255" y="120" width="48" height="48" as="geometry"/>
      </mxCell>`;

    // REAL AWS ICON: Control Tower
    cells += `
      <mxCell id="${getId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.control_tower;" vertex="1" parent="1">
        <mxGeometry x="270" y="180" width="48" height="48" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Control Tower" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${DARK};fontStyle=0;" vertex="1" parent="1">
        <mxGeometry x="244" y="235" width="100" height="20" as="geometry"/>
      </mxCell>`;

    // Administrator icon (top right of master account)
    cells += `
      <mxCell id="${getId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.user;" vertex="1" parent="1">
        <mxGeometry x="590" y="125" width="35" height="35" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="⚙" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=20;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="620" y="120" width="20" height="20" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="📦" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=18;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="620" y="140" width="20" height="20" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Administrator" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="565" y="165" width="85" height="20" as="geometry"/>
      </mxCell>`;

    // External users (left side)
    cells += `
      <mxCell id="${getId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${GRAY};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.user;" vertex="1" parent="1">
        <mxGeometry x="90" y="220" width="40" height="40" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Administrator/Root" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="60" y="265" width="100" height="20" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${GRAY};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.users;" vertex="1" parent="1">
        <mxGeometry x="90" y="330" width="40" height="40" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Developers/Testers" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="60" y="375" width="100" height="20" as="geometry"/>
      </mxCell>`;

    // REAL AWS ICON: IAM Identity Center
    cells += `
      <mxCell id="${getId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.identity_and_access_management;" vertex="1" parent="1">
        <mxGeometry x="335" y="350" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Identity Center" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="310" y="405" width="100" height="20" as="geometry"/>
      </mxCell>`;

    // Cloud icon for Identity sync
    cells += `
      <mxCell id="${getId()}" value="☁" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=32;fontColor=#5DADE2;" vertex="1" parent="1">
        <mxGeometry x="342" y="460" width="36" height="36" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="↑" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=24;fontColor=#5DADE2;fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="348" y="485" width="24" height="24" as="geometry"/>
      </mxCell>`;

    // On-Premises icon
    cells += `
      <mxCell id="${getId()}" value="🏢" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=36;fontColor=${GRAY};" vertex="1" parent="1">
        <mxGeometry x="340" y="520" width="40" height="40" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="⚠" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=18;fontColor=${GRAY};" vertex="1" parent="1">
        <mxGeometry x="368" y="548" width="18" height="18" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="On-Premises&lt;br&gt;/ AWS Cloud AD" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="310" y="570" width="100" height="30" as="geometry"/>
      </mxCell>`;

    // Permission Sets (pink icons with checkmark + gear)
    const permX = 500;
    const permY1 = 290;
    const permY2 = 380;

    // Admin Permission Set
    cells += `
      <mxCell id="${getId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.permissions;" vertex="1" parent="1">
        <mxGeometry x="${permX}" y="${permY1}" width="48" height="48" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Admin Permission&lt;br&gt;Set" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="${permX - 6}" y="${permY1 + 53}" width="60" height="30" as="geometry"/>
      </mxCell>`;

    // Dev/Tester Permission Set
    cells += `
      <mxCell id="${getId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.permissions;" vertex="1" parent="1">
        <mxGeometry x="${permX}" y="${permY2}" width="48" height="48" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Dev/Tester&lt;br&gt;Permission Set" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="${permX - 11}" y="${permY2 + 53}" width="70" height="30" as="geometry"/>
      </mxCell>`;

    // CLEAN ARROWS with proper routing points
    // Users → Identity Center
    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1" source="cell-105" target="cell-112">
        <mxGeometry relative="1" as="geometry">
          <Array as="points">
            <mxPoint x="200" y="240"/>
            <mxPoint x="200" y="365"/>
          </Array>
        </mxGeometry>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1" source="cell-107" target="cell-112">
        <mxGeometry relative="1" as="geometry">
          <Array as="points">
            <mxPoint x="200" y="350"/>
            <mxPoint x="200" y="380"/>
          </Array>
        </mxGeometry>
      </mxCell>`;

    // Identity Center ↔ On-Prem (bidirectional)
    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;startArrow=classic;startFill=1;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="360" y="400" as="sourcePoint"/>
          <mxPoint x="360" y="520" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Identity Center → Permission Sets
    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="385" y="365" as="sourcePoint"/>
          <mxPoint x="${permX}" y="${permY1 + 24}" as="targetPoint"/>
          <Array as="points">
            <mxPoint x="440" y="365"/>
            <mxPoint x="440" y="${permY1 + 24}"/>
          </Array>
        </mxGeometry>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="385" y="385" as="sourcePoint"/>
          <mxPoint x="${permX}" y="${permY2 + 24}" as="targetPoint"/>
          <Array as="points">
            <mxPoint x="460" y="385"/>
            <mxPoint x="460" y="${permY2 + 24}"/>
          </Array>
        </mxGeometry>
      </mxCell>`;

    // Permission Sets → OUs (will connect after OUs are created)
    const arrowTargetY1 = 200;
    const arrowTargetY2 = 220;

    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${permX + 48}" y="${permY1 + 24}" as="sourcePoint"/>
          <mxPoint x="630" y="${arrowTargetY1}" as="targetPoint"/>
          <Array as="points">
            <mxPoint x="630" y="${permY1 + 24}"/>
          </Array>
        </mxGeometry>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${permX + 48}" y="${permY2 + 24}" as="sourcePoint"/>
          <mxPoint x="670" y="${arrowTargetY2}" as="targetPoint"/>
          <Array as="points">
            <mxPoint x="670" y="${permY2 + 24}"/>
          </Array>
        </mxGeometry>
      </mxCell>`;

    // Organizational Units (3 columns below master account)
    const ous = [
      { name: 'Security/Core OU', accounts: security_ou },
      { name: 'Workload OU', accounts: workload_ou },
      { name: 'Networking OU', accounts: networking_ou },
    ];

    const ouStartX = 660;
    const ouY = 310;
    const ouWidth = 220;
    const ouHeight = 380;
    const ouGap = 20;

    let currentX = ouStartX;

    ous.forEach((ou) => {
      // OU container (pink dashed rectangle)
      cells += `
        <mxCell id="${getId()}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${PINK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="${currentX}" y="${ouY}" width="${ouWidth}" height="${ouHeight}" as="geometry"/>
        </mxCell>`;

      // REAL AWS ICON: OU Icon
      cells += `
        <mxCell id="${getId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.organizational_unit;" vertex="1" parent="1">
          <mxGeometry x="${currentX + ouWidth/2 - 24}" y="${ouY + 15}" width="48" height="48" as="geometry"/>
        </mxCell>`;

      // OU label
      cells += `
        <mxCell id="${getId()}" value="${ou.name}" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=12;fontColor=${PINK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="${currentX + 10}" y="${ouY + 68}" width="${ouWidth - 20}" height="20" as="geometry"/>
        </mxCell>`;

      // Accounts inside OU
      let accountY = ouY + 100;

      ou.accounts.slice(0, 3).forEach((account) => {
        const accountName = account.name || 'Account';

        // Account box
        cells += `
          <mxCell id="${getId()}" value="${accountName}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=11;fontStyle=1;fontColor=${PINK};verticalAlign=top;spacingTop=8;" vertex="1" parent="1">
            <mxGeometry x="${currentX + 15}" y="${accountY}" width="${ouWidth - 30}" height="70" as="geometry"/>
          </mxCell>`;

        // REAL AWS ICON: Account icon inside box
        cells += `
          <mxCell id="${getId()}" value="" style="sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${ICON_PINK};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.account;" vertex="1" parent="1">
            <mxGeometry x="${currentX + ouWidth/2 - 18}" y="${accountY + 25}" width="36" height="36" as="geometry"/>
          </mxCell>`;

        accountY += 85;
      });

      // Arrow from Master Account down to OU
      cells += `
        <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${currentX + ouWidth/2}" y="270" as="sourcePoint"/>
            <mxPoint x="${currentX + ouWidth/2}" y="${ouY}" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;

      currentX += ouWidth + ouGap;
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
