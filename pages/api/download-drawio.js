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

    // EXACT COLORS from your reference images
    const PINK = '#D6336C';
    const LIGHT_PINK = '#F4E1E8';
    const WHITE = '#FFFFFF';
    const DARK = '#232F3E';
    const RED = '#DD344C';

    let cellId = 100;
    const getId = () => `cell-${cellId++}`;

    let cells = '';

    // AWS Cloud badge (top left)
    cells += `
      <mxCell id="${getId()}" value="AWS Cloud" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=none;fontSize=12;fontColor=#FFFFFF;fontStyle=1;align=left;spacingLeft=10;" vertex="1" parent="1">
        <mxGeometry x="230" y="50" width="100" height="30" as="geometry"/>
      </mxCell>`;

    // Main dashed container
    cells += `
      <mxCell id="${getId()}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#232F3E;strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
        <mxGeometry x="230" y="90" width="1110" height="570" as="geometry"/>
      </mxCell>`;

    // Master/Payer Account container (BIG PINK BOX)
    const masterName = master_account?.name || `${client_name} Master/Payer Account`;
    const masterEmail = master_account?.email || 'Client Master/Root Email';

    cells += `
      <mxCell id="${getId()}" value="${masterName}&#xa;${masterEmail}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};strokeWidth=3;fontSize=13;fontStyle=1;fontColor=${PINK};verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;" vertex="1" parent="1">
        <mxGeometry x="250" y="110" width="1070" height="160" as="geometry"/>
      </mxCell>`;

    // Control Tower ICON (pink square with white symbol)
    cells += `
      <mxCell id="${getId()}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${RED};strokeColor=none;" vertex="1" parent="1">
        <mxGeometry x="270" y="160" width="50" height="50" as="geometry"/>
      </mxCell>`;
    
    cells += `
      <mxCell id="${getId()}" value="✦" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=28;fontColor=#FFFFFF;fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="270" y="160" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Control Tower" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${DARK};fontStyle=0;" vertex="1" parent="1">
        <mxGeometry x="245" y="215" width="100" height="20" as="geometry"/>
      </mxCell>`;

    // Administrator icon (user + gear)
    cells += `
      <mxCell id="${getId()}" value="👤" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=28;fontColor=${RED};" vertex="1" parent="1">
        <mxGeometry x="600" y="130" width="30" height="30" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="⚙" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=20;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="625" y="125" width="20" height="20" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="📦" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=20;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="625" y="145" width="20" height="20" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Administrator" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="575" y="165" width="80" height="20" as="geometry"/>
      </mxCell>`;

    // Administrator/Root user (left side, outside)
    cells += `
      <mxCell id="${getId()}" value="👤" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=32;fontColor=#666666;" vertex="1" parent="1">
        <mxGeometry x="80" y="200" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Administrator/Root" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="55" y="250" width="100" height="20" as="geometry"/>
      </mxCell>`;

    // Developers/Testers user
    cells += `
      <mxCell id="${getId()}" value="👥" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=32;fontColor=#666666;" vertex="1" parent="1">
        <mxGeometry x="80" y="320" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Developers/Testers" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="55" y="370" width="100" height="20" as="geometry"/>
      </mxCell>`;

    // Identity Center ICON (red square with white magnifying glass)
    cells += `
      <mxCell id="${getId()}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${RED};strokeColor=none;" vertex="1" parent="1">
        <mxGeometry x="330" y="330" width="60" height="60" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="🔍" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=32;fontColor=#FFFFFF;" vertex="1" parent="1">
        <mxGeometry x="330" y="330" width="60" height="60" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Identity Center" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=11;fontColor=${DARK};fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="310" y="395" width="100" height="20" as="geometry"/>
      </mxCell>`;

    // On-Premises icon (building)
    cells += `
      <mxCell id="${getId()}" value="🏢" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=40;fontColor=#666666;" vertex="1" parent="1">
        <mxGeometry x="335" y="480" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="⚠" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=20;fontColor=#666666;" vertex="1" parent="1">
        <mxGeometry x="365" y="510" width="20" height="20" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="On-Premises&#xa;/ AWS Cloud AD" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="310" y="535" width="100" height="30" as="geometry"/>
      </mxCell>`;

    // Permission Sets (red squares with checkmarks)
    const permX = 490;
    const permY1 = 280;
    const permY2 = 360;

    // Admin Permission Set
    cells += `
      <mxCell id="${getId()}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${RED};strokeColor=none;" vertex="1" parent="1">
        <mxGeometry x="${permX}" y="${permY1}" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="✓" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=32;fontColor=#FFFFFF;fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${permX}" y="${permY1}" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="⚙" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=16;fontColor=#FFFFFF;" vertex="1" parent="1">
        <mxGeometry x="${permX + 30}" y="${permY1 + 25}" width="20" height="20" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Admin Permission&#xa;Set" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="${permX - 10}" y="${permY1 + 55}" width="70" height="30" as="geometry"/>
      </mxCell>`;

    // Dev/Tester Permission Set
    cells += `
      <mxCell id="${getId()}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${RED};strokeColor=none;" vertex="1" parent="1">
        <mxGeometry x="${permX}" y="${permY2}" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="✓" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=32;fontColor=#FFFFFF;fontStyle=1;" vertex="1" parent="1">
        <mxGeometry x="${permX}" y="${permY2}" width="50" height="50" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="⚙" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=16;fontColor=#FFFFFF;" vertex="1" parent="1">
        <mxGeometry x="${permX + 30}" y="${permY2 + 25}" width="20" height="20" as="geometry"/>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="Dev/Tester&#xa;Permission Set" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=10;fontColor=${DARK};" vertex="1" parent="1">
        <mxGeometry x="${permX - 10}" y="${permY2 + 55}" width="70" height="30" as="geometry"/>
      </mxCell>`;

    // Arrows: Users → Identity Center (CLEAN, NO OVERLAP)
    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;exitX=1;exitY=0.5;entryX=0;entryY=0.3;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="155" y="225" as="sourcePoint"/>
          <mxPoint x="330" y="348" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;exitX=1;exitY=0.5;entryX=0;entryY=0.7;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="155" y="345" as="sourcePoint"/>
          <mxPoint x="330" y="372" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Arrow: Identity Center ↔ On-Prem
    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;startArrow=classic;startFill=1;endArrow=classic;endFill=1;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="360" y="390" as="sourcePoint"/>
          <mxPoint x="360" y="480" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Arrows: Identity Center → Permission Sets
    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;exitX=1;exitY=0.3;entryX=0;entryY=0.5;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="390" y="348" as="sourcePoint"/>
          <mxPoint x="${permX}" y="${permY1 + 25}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;exitX=1;exitY=0.7;entryX=0;entryY=0.5;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="390" y="372" as="sourcePoint"/>
          <mxPoint x="${permX}" y="${permY2 + 25}" as="targetPoint"/>
        </mxGeometry>
      </mxCell>`;

    // Arrows: Permission Sets → Master Account (routing AROUND, not through)
    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;exitX=1;exitY=0.5;entryX=0;entryY=0.3;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${permX + 50}" y="${permY1 + 25}" as="sourcePoint"/>
          <mxPoint x="660" y="150" as="targetPoint"/>
          <Array as="points">
            <mxPoint x="660" y="${permY1 + 25}"/>
            <mxPoint x="660" y="150"/>
          </Array>
        </mxGeometry>
      </mxCell>`;

    cells += `
      <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;exitX=1;exitY=0.5;entryX=0;entryY=0.6;" edge="1" parent="1">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${permX + 50}" y="${permY2 + 25}" as="sourcePoint"/>
          <mxPoint x="700" y="180" as="targetPoint"/>
          <Array as="points">
            <mxPoint x="700" y="${permY2 + 25}"/>
            <mxPoint x="700" y="180"/>
          </Array>
        </mxGeometry>
      </mxCell>`;

    // Organizational Units (3 side-by-side, BELOW master account)
    const ous = [
      { name: 'Security/Core OU', accounts: security_ou },
      { name: 'Workload OU', accounts: workload_ou },
      { name: 'Networking OU', accounts: networking_ou },
    ];

    const ouStartX = 660;
    const ouY = 300;
    const ouWidth = 220;
    const ouHeight = 340;
    const ouGap = 20;

    let currentX = ouStartX;

    ous.forEach((ou) => {
      // OU container (pink dashed box)
      cells += `
        <mxCell id="${getId()}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${PINK};strokeWidth=2;dashed=1;dashPattern=5 5;" vertex="1" parent="1">
          <mxGeometry x="${currentX}" y="${ouY}" width="${ouWidth}" height="${ouHeight}" as="geometry"/>
        </mxCell>`;

      // OU icon (pink square)
      cells += `
        <mxCell id="${getId()}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${PINK};strokeColor=none;" vertex="1" parent="1">
          <mxGeometry x="${currentX + ouWidth/2 - 20}" y="${ouY + 15}" width="40" height="40" as="geometry"/>
        </mxCell>`;

      cells += `
        <mxCell id="${getId()}" value="📁" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=24;fontColor=#FFFFFF;" vertex="1" parent="1">
        <mxGeometry x="${currentX + ouWidth/2 - 20}" y="${ouY + 15}" width="40" height="40" as="geometry"/>
      </mxCell>`;

      // OU label
      cells += `
        <mxCell id="${getId()}" value="${ou.name}" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;whiteSpace=wrap;fontSize=12;fontColor=${PINK};fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="${currentX + 10}" y="${ouY + 60}" width="${ouWidth - 20}" height="20" as="geometry"/>
        </mxCell>`;

      // Accounts inside OU
      let accountY = ouY + 90;

      ou.accounts.slice(0, 3).forEach((account) => {
        const accountName = account.name || 'Account';

        // Account box (pink)
        cells += `
          <mxCell id="${getId()}" value="${accountName}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=11;fontStyle=1;fontColor=${PINK};verticalAlign=top;spacingTop=8;" vertex="1" parent="1">
            <mxGeometry x="${currentX + 15}" y="${accountY}" width="${ouWidth - 30}" height="60" as="geometry"/>
          </mxCell>`;

        // Account icon (user + box)
        cells += `
          <mxCell id="${getId()}" value="👤" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=20;fontColor=${PINK};" vertex="1" parent="1">
            <mxGeometry x="${currentX + ouWidth/2 - 20}" y="${accountY + 30}" width="20" height="20" as="geometry"/>
          </mxCell>`;

        cells += `
          <mxCell id="${getId()}" value="📦" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=16;fontColor=${PINK};" vertex="1" parent="1">
            <mxGeometry x="${currentX + ouWidth/2 + 5}" y="${accountY + 30}" width="20" height="20" as="geometry"/>
          </mxCell>`;

        accountY += 75;
      });

      // Arrow from Master to OU (downward, CLEAN routing)
      cells += `
        <mxCell id="${getId()}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${DARK};strokeWidth=2;endArrow=classic;endFill=1;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${currentX + ouWidth/2}" y="240" as="sourcePoint"/>
            <mxPoint x="${currentX + ouWidth/2}" y="${ouY}" as="targetPoint"/>
            <Array as="points">
              <mxPoint x="${currentX + ouWidth/2}" y="280"/>
              <mxPoint x="${currentX + ouWidth/2}" y="280"/>
            </Array>
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
