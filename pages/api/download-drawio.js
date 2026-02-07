// Generates professional AWS Landing Zone diagrams

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateDrawioXML(arch) {
  let _id = 1;
  const id = () => String(_id++);

  // Colors pink/magenta theme
  const PINK = "#D6336C";
  const LIGHT_PINK = "#F4E1E8";
  const WHITE = "#FFFFFF";
  const DARK = "#232F3E";
  
  let cells = '';
  const rootId = id();
  cells += `<mxCell id="0"/>\n<mxCell id="${rootId}" parent="0"/>\n`;

  // AWS Cloud container (outer dashed border)
  const awsId = id();
  cells += `<mxCell id="${awsId}" value="AWS Cloud" style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=14;fontStyle=1;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_aws_cloud_alt;strokeColor=${DARK};fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=${DARK};dashed=1;container=1;pointerEvents=0;collapsible=0;" vertex="1" parent="${rootId}">
    <mxGeometry x="20" y="20" width="1320" height="720" as="geometry"/>
  </mxCell>\n`;

  // Administrator/Root user (left side)
  const adminUserId = id();
  cells += `<mxCell id="${adminUserId}" value="Administrator/Root" style="sketch=0;outlineConnect=0;fontColor=${DARK};gradientColor=none;fillColor=${DARK};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=11;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.user;" vertex="1" parent="${awsId}">
    <mxGeometry x="20" y="120" width="48" height="48" as="geometry"/>
  </mxCell>\n`;

  // Developers/Testers user (left side, below Admin)
  const devUserId = id();
  cells += `<mxCell id="${devUserId}" value="Developers/Testers" style="sketch=0;outlineConnect=0;fontColor=${DARK};gradientColor=none;fillColor=${DARK};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=11;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.users;" vertex="1" parent="${awsId}">
    <mxGeometry x="20" y="360" width="48" height="48" as="geometry"/>
  </mxCell>\n`;

  // Identity Center (red icon, left-center)
  const icId = id();
  cells += `<mxCell id="${icId}" value="Identity Center" style="sketch=0;outlineConnect=0;fontColor=${DARK};gradientColor=none;fillColor=#BF0816;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=1;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.identity_and_access_management;" vertex="1" parent="${awsId}">
    <mxGeometry x="160" y="220" width="60" height="60" as="geometry"/>
  </mxCell>\n`;

  // On-Premises / Cloud AD (building icon, below Identity Center)
  const onPremId = id();
  cells += `<mxCell id="${onPremId}" value="On-Premises&#xa;/ AWS Cloud AD" style="sketch=0;outlineConnect=0;fontColor=${DARK};gradientColor=none;fillColor=${DARK};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=11;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.traditional_server;" vertex="1" parent="${awsId}">
    <mxGeometry x="166" y="420" width="48" height="48" as="geometry"/>
  </mxCell>\n`;

  // Admin Permission Set (pink box, center column)
  const adminPsId = id();
  cells += `<mxCell id="${adminPsId}" value="Admin Permission Set" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};fontSize=11;fontStyle=1;fontColor=${PINK};verticalAlign=middle;align=center;" vertex="1" parent="${awsId}">
    <mxGeometry x="350" y="180" width="140" height="70" as="geometry"/>
  </mxCell>\n`;

  // Dev/Tester Permission Set (pink box, center column, below Admin PS)
  const devPsId = id();
  cells += `<mxCell id="${devPsId}" value="Dev/Tester Permission Set" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${LIGHT_PINK};strokeColor=${PINK};fontSize=11;fontStyle=1;fontColor=${PINK};verticalAlign=middle;align=center;" vertex="1" parent="${awsId}">
    <mxGeometry x="350" y="320" width="140" height="70" as="geometry"/>
  </mxCell>\n`;

  // Master/Payer Account container (pink background box)
  const masterName = arch?.master_payer?.name || "Master/Payer Account";
  const masterEmail = arch?.master_payer?.email || "Client Master/Root Email";
  const masterId = id();
  cells += `<mxCell id="${masterId}" value="${esc(masterName)}&#xa;${esc(masterEmail)}" style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=13;fontStyle=1;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_account;strokeColor=${PINK};fillColor=${LIGHT_PINK};verticalAlign=top;align=left;spacingLeft=30;fontColor=${PINK};dashed=0;container=1;pointerEvents=0;collapsible=0;" vertex="1" parent="${awsId}">
    <mxGeometry x="540" y="40" width="740" height="640" as="geometry"/>
  </mxCell>\n`;

  // Control Tower icon (inside master, top-left)
  const ctId = id();
  cells += `<mxCell id="${ctId}" value="Control Tower" style="sketch=0;outlineConnect=0;fontColor=${DARK};gradientColor=none;fillColor=#BF0816;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=11;fontStyle=1;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.control_tower;" vertex="1" parent="${masterId}">
    <mxGeometry x="30" y="50" width="48" height="48" as="geometry"/>
  </mxCell>\n`;

  // Administrator icon (inside master, top-right)
  const masterAdminId = id();
  cells += `<mxCell id="${masterAdminId}" value="Administrator" style="sketch=0;outlineConnect=0;fontColor=${DARK};gradientColor=none;fillColor=${DARK};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=11;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.user;" vertex="1" parent="${masterId}">
    <mxGeometry x="580" y="50" width="48" height="48" as="geometry"/>
  </mxCell>\n`;

  // OUs (3 side-by-side containers inside Master)
  const ous = arch?.organizational_units || [];
  const ouIds = [];
  const OU_Y = 140;
  const OU_H = 460;
  const OU_W = 220;
  const OU_GAP = 20;

  ous.forEach((ou, ouIdx) => {
    const ouX = 30 + ouIdx * (OU_W + OU_GAP);
    const ouId = id();
    ouIds.push(ouId);

    cells += `<mxCell id="${ouId}" value="${esc(ou.name)}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${WHITE};strokeColor=${PINK};strokeWidth=2;fontSize=12;fontStyle=1;fontColor=${PINK};verticalAlign=top;align=center;spacingTop=10;container=1;pointerEvents=0;collapsible=0;" vertex="1" parent="${masterId}">
      <mxGeometry x="${ouX}" y="${OU_Y}" width="${OU_W}" height="${OU_H}" as="geometry"/>
    </mxCell>\n`;

    // Account cards inside each OU
    const accounts = ou.accounts || [];
    accounts.forEach((acc, accIdx) => {
      const accId = id();
      const accY = 50 + accIdx * 90;

      cells += `<mxCell id="${accId}" value="${esc(acc.name)}" style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=11;fontStyle=1;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_account;strokeColor=${PINK};fillColor=${WHITE};verticalAlign=top;align=center;spacingTop=8;fontColor=${PINK};dashed=0;container=1;pointerEvents=0;collapsible=0;" vertex="1" parent="${ouId}">
        <mxGeometry x="20" y="${accY}" width="180" height="70" as="geometry"/>
      </mxCell>\n`;

      // Person+Box icon inside account
      const iconId = id();
      cells += `<mxCell id="${iconId}" value="" style="sketch=0;outlineConnect=0;fontColor=${DARK};gradientColor=none;fillColor=${PINK};strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=10;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.user;" vertex="1" parent="${accId}">
        <mxGeometry x="66" y="28" width="32" height="32" as="geometry"/>
      </mxCell>\n`;
    });
  });

  // Connection arrows
  // Admin → Identity Center
  const arr1 = id();
  cells += `<mxCell id="${arr1}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeColor=${DARK};strokeWidth=2;" edge="1" parent="${awsId}" source="${adminUserId}" target="${icId}">
    <mxGeometry relative="1" as="geometry"/>
  </mxCell>\n`;

  // Dev → Identity Center
  const arr2 = id();
  cells += `<mxCell id="${arr2}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeColor=${DARK};strokeWidth=2;" edge="1" parent="${awsId}" source="${devUserId}" target="${icId}">
    <mxGeometry relative="1" as="geometry"/>
  </mxCell>\n`;

  // Identity Center ↔ On-Prem (dashed)
  const arr3 = id();
  cells += `<mxCell id="${arr3}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;dashed=1;strokeColor=${DARK};strokeWidth=2;" edge="1" parent="${awsId}" source="${icId}" target="${onPremId}">
    <mxGeometry relative="1" as="geometry"/>
  </mxCell>\n`;

  // Identity Center → Admin PS
  const arr4 = id();
  cells += `<mxCell id="${arr4}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeColor=${DARK};strokeWidth=2;" edge="1" parent="${awsId}" source="${icId}" target="${adminPsId}">
    <mxGeometry relative="1" as="geometry"/>
  </mxCell>\n`;

  // Identity Center → Dev PS
  const arr5 = id();
  cells += `<mxCell id="${arr5}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeColor=${DARK};strokeWidth=2;" edge="1" parent="${awsId}" source="${icId}" target="${devPsId}">
    <mxGeometry relative="1" as="geometry"/>
  </mxCell>\n`;

  // Admin PS → Master
  const arr6 = id();
  cells += `<mxCell id="${arr6}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeColor=${DARK};strokeWidth=2;" edge="1" parent="${awsId}" source="${adminPsId}" target="${masterId}">
    <mxGeometry relative="1" as="geometry"/>
  </mxCell>\n`;

  // Dev PS → Master
  const arr7 = id();
  cells += `<mxCell id="${arr7}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeColor=${DARK};strokeWidth=2;" edge="1" parent="${awsId}" source="${devPsId}" target="${masterId}">
    <mxGeometry relative="1" as="geometry"/>
  </mxCell>\n`;

  // Administrator (inside Master) → Each OU
  ouIds.forEach((ouId) => {
    const arrId = id();
    cells += `<mxCell id="${arrId}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeColor=${DARK};strokeWidth=2;" edge="1" parent="${masterId}" source="${masterAdminId}" target="${ouId}">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" agent="LZDW-Agent" version="24.0.0">
  <diagram name="AWS Landing Zone Architecture" id="aws-lz">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1654" pageHeight="1169" math="0" shadow="0">
      <root>
        ${cells}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { architecture } = req.body || {};
  if (!architecture) {
    return res.status(400).json({ error: "No architecture provided" });
  }

  const xml = generateDrawioXML(architecture);
  if (!xml) {
    return res.status(500).json({ error: "Diagram generation failed" });
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="aws-landing-zone.drawio"');
  res.status(200).send(xml);
}
