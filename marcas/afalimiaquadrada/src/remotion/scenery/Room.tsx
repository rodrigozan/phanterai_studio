import React from "react";
import { FLOOR_Y } from "../layout";

export type Setting = "sala" | "cozinha" | "quarto" | "quarto-leo" | "escola" | "quintal" | "estudio-mae" | "estadio";
export type RoomProp = "ringlight" | "camera" | "plantas" | "caixas" | "airfryer";

const X0 = -700;
const Y0 = -700;
const W = 2480;
const H = 3320;
const HORIZON = FLOOR_Y - 190;

const PALETTE: Record<Setting, { wall: string; wall2: string; floor: string; floor2: string; base: string }> = {
  sala: { wall: "#F2D59B", wall2: "#E8C788", floor: "#B5703F", floor2: "#A4633A", base: "#7b4a2a" },
  "estudio-mae": { wall: "#F2D59B", wall2: "#E8C788", floor: "#B5703F", floor2: "#A4633A", base: "#7b4a2a" },
  cozinha: { wall: "#D9EFEA", wall2: "#C3E3DA", floor: "#F2F2F2", floor2: "#26272E", base: "#8fa5a0" },
  quarto: { wall: "#c7d6f3", wall2: "#b4c6ec", floor: "#8b6bb0", floor2: "#7c5ea0", base: "#4f4277" },
  "quarto-leo": { wall: "#C9D4F2", wall2: "#B7C4EC", floor: "#5E4A8A", floor2: "#55427E", base: "#3f3266" },
  escola: { wall: "#f4e8c8", wall2: "#7fb38a", floor: "#c99a62", floor2: "#b88a55", base: "#6c5233" },
  quintal: { wall: "#E8C788", wall2: "#D9B574", floor: "#7BC86C", floor2: "#6DB85F", base: "#b8955a" },
  estadio: { wall: "#8ED1F5", wall2: "#8ED1F5", floor: "#4CAF50", floor2: "#43A047", base: "#ffffff" },
};

const Wall: React.FC<{ s: Setting }> = ({ s }) => {
  const p = PALETTE[s];
  const stripes = [];
  if (s === "cozinha") {
    for (let y = 700; y < HORIZON; y += 60) for (let x = X0; x < X0 + W; x += 60) stripes.push(<rect key={`${x}-${y}`} x={x + 2} y={y + 2} width={56} height={56} fill={(x / 60 + y / 60) % 2 ? p.wall : p.wall2} />);
  } else if (s === "quintal") {
    stripes.push(<rect key="sky" x={X0} y={Y0} width={W} height={900 - Y0} fill="#8ED1F5" />);
    stripes.push(<rect key="cloud1" x={-60} y={300} width={220} height={60} fill="#ffffff" />);
    stripes.push(<rect key="cloud2" x={760} y={200} width={260} height={70} fill="#ffffff" />);
    for (let y = 920; y < HORIZON - 30; y += 50) stripes.push(<rect key={`b${y}`} x={X0} y={y} width={W} height={5} fill={p.wall2} />);
    stripes.push(<rect key="top" x={X0} y={880} width={W} height={36} fill="#cfae72" />);
  } else if (s === "estadio") {
    for (let row = 0; row < 9; row++) {
      const y = 520 + row * 90;
      stripes.push(<rect key={`r${row}`} x={X0} y={y} width={W} height={90} fill={row % 2 ? "#9aa3ad" : "#b6bec7"} />);
      for (let x = X0 + 20; x < X0 + W; x += 70) {
        const k = (x * 7 + row * 13) % 5;
        stripes.push(<rect key={`c${row}-${x}`} x={x} y={y + 14} width={40} height={52} fill={["#e85a5a", "#ffd23f", "#2f7fe0", "#f5f5f5", "#2b2b33"][k]} />);
      }
    }
    stripes.push(<rect key="ad" x={X0} y={HORIZON - 110} width={W} height={80} fill="#1d3557" />);
  } else if (s === "escola") {
    stripes.push(<rect key="lower" x={X0} y={HORIZON - 420} width={W} height={420} fill={p.wall2} />);
  } else {
    for (let x = X0; x < X0 + W; x += 120) stripes.push(<rect key={x} x={x} y={Y0} width={60} height={HORIZON - Y0} fill={p.wall2} opacity={0.45} />);
  }
  return (
    <g>
      <rect x={X0} y={Y0} width={W} height={HORIZON - Y0} fill={p.wall} />
      {stripes}
      <rect x={X0} y={HORIZON - 30} width={W} height={30} fill={p.base} />
    </g>
  );
};

const Floor: React.FC<{ s: Setting }> = ({ s }) => {
  const p = PALETTE[s];
  const tiles = [];
  if (s === "cozinha") {
    for (let y = HORIZON; y < Y0 + H; y += 90) for (let x = X0; x < X0 + W; x += 90) tiles.push(<rect key={`${x}-${y}`} x={x} y={y} width={90} height={90} fill={(Math.round((x - X0) / 90) + Math.round((y - HORIZON) / 90)) % 2 ? p.floor : p.floor2} />);
  } else if (s === "estadio") {
    tiles.push(<rect key="l1" x={X0} y={HORIZON + 60} width={W} height={10} fill="#ffffff" />);
    for (let x = X0; x < X0 + W; x += 160) tiles.push(<rect key={x} x={x} y={HORIZON} width={80} height={Y0 + H - HORIZON} fill={p.floor2} />);
  } else if (s === "quintal") {
    for (let y = HORIZON; y < Y0 + H; y += 40) for (let x = X0 + ((y / 40) % 2) * 30; x < X0 + W; x += 60) tiles.push(<rect key={`${x}-${y}`} x={x} y={y} width={8} height={14} fill={p.floor2} />);
  } else {
    for (let y = HORIZON; y < Y0 + H; y += 46) tiles.push(<rect key={y} x={X0} y={y} width={W} height={22} fill={p.floor2} />);
  }
  return (
    <g>
      <rect x={X0} y={HORIZON} width={W} height={Y0 + H - HORIZON} fill={p.floor} />
      {tiles}
    </g>
  );
};

const Window: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 12} y={y - 12} width={284} height={344} fill="#ffffff" />
    <rect x={x} y={y} width={260} height={320} fill="#8fd3ff" />
    <rect x={x} y={y + 210} width={260} height={110} fill="#7cc576" />
    <rect x={x + 40} y={y + 40} width={60} height={30} fill="#ffffff" opacity={0.9} />
    <rect x={x + 124} y={y} width={12} height={320} fill="#ffffff" />
    <rect x={x} y={y + 154} width={260} height={12} fill="#ffffff" />
  </g>
);

const Sala: React.FC = () => (
  <g>
    <Window x={-40} y={520} />
    <rect x={620} y={560} width={220} height={160} fill="#6f4b9a" />
    <rect x={640} y={580} width={180} height={120} fill="#ffcf5c" />
    <rect x={680} y={620} width={60} height={60} fill="#ff7a59" />
    <rect x={-400} y={1120} width={560} height={200} fill="#c2453f" />
    <rect x={-400} y={1040} width={560} height={100} fill="#d6574f" />
    <rect x={1000} y={1050} width={380} height={230} fill="#22242e" />
    <rect x={1014} y={1064} width={352} height={202} fill="#3a7bd5" />
    <rect x={1120} y={1280} width={140} height={90} fill="#5b3c25" />
    <rect x={160} y={FLOOR_Y - 60} width={760} height={140} fill="#e9a23b" opacity={0.85} />
  </g>
);

const Cozinha: React.FC = () => (
  <g>
    <rect x={-500} y={1040} width={900} height={330} fill="#f5f5f5" />
    <rect x={-500} y={1010} width={900} height={40} fill="#8a6a4f" />
    <rect x={-460} y={1100} width={180} height={230} fill="#e2e2e2" />
    <rect x={-240} y={1100} width={180} height={230} fill="#e2e2e2" />
    <rect x={120} y={960} width={60} height={50} fill="#333844" />
    <rect x={200} y={960} width={60} height={50} fill="#333844" />
    <rect x={980} y={640} width={300} height={730} fill="#e8eef2" />
    <rect x={980} y={900} width={300} height={14} fill="#b5c0c8" />
    <rect x={1000} y={700} width={14} height={140} fill="#9aa5ad" />
    <rect x={1000} y={960} width={14} height={180} fill="#9aa5ad" />
    <rect x={420} y={560} width={240} height={180} fill="#ffffff" />
    <rect x={440} y={580} width={200} height={140} fill="#ffe27a" />
  </g>
);

const Quarto: React.FC = () => (
  <g>
    <rect x={-480} y={1160} width={620} height={200} fill="#ffffff" />
    <rect x={-480} y={1200} width={620} height={160} fill="#4fa3e0" />
    <rect x={-480} y={1040} width={60} height={320} fill="#6b4a2f" />
    <rect x={-420} y={1140} width={150} height={60} fill="#f7f7f7" />
    <rect x={620} y={520} width={200} height={280} fill="#22242e" />
    <rect x={640} y={540} width={160} height={240} fill="#ff5c8a" />
    <rect x={680} y={600} width={80} height={80} fill="#ffe14d" />
    <rect x={1060} y={1000} width={40} height={370} fill="#3b3b46" />
    <rect x={1010} y={940} width={140} height={80} fill="#ffd36b" />
    <Window x={-80} y={480} />
  </g>
);

const Quintal: React.FC = () => (
  <g>
    <rect x={880} y={980} width={420} height={390} fill="#b5523b" />
    {[1010, 1080, 1150, 1220, 1290].map((y) => (
      <rect key={y} x={880} y={y} width={420} height={6} fill="#8f3f2d" />
    ))}
    <rect x={920} y={940} width={340} height={50} fill="#2a2a33" />
    {[940, 990, 1040, 1090, 1140, 1190, 1240].map((x) => (
      <rect key={x} x={x} y={944} width={8} height={42} fill="#6b6f86" />
    ))}
    <rect x={1180} y={600} width={90} height={340} fill="#b5523b" />
    <rect x={1160} y={580} width={130} height={30} fill="#8f3f2d" />
    <rect x={-480} y={1000} width={36} height={380} fill="#6b4a2f" />
    <rect x={-160} y={1000} width={36} height={380} fill="#6b4a2f" />
    <rect x={-480} y={1060} width={356} height={6} fill="#e8e8e8" />
    <rect x={-420} y={1066} width={60} height={80} fill="#e85a5a" />
    <rect x={-330} y={1066} width={60} height={70} fill="#2f7fe0" />
  </g>
);

const Estadio: React.FC = () => (
  <g>
    <rect x={-300} y={180} width={1680} height={260} fill="#2b2b33" />
    <rect x={-280} y={200} width={1640} height={220} fill="#3a7bd5" />
    <rect x={-200} y={420} width={30} height={100} fill="#2b2b33" />
    <rect x={1220} y={420} width={30} height={100} fill="#2b2b33" />
  </g>
);

const Escola: React.FC = () => (
  <g>
    <rect x={-120} y={440} width={1320} height={560} fill="#7a5233" />
    <rect x={-100} y={460} width={1280} height={520} fill="#2f5a43" />
    <rect x={40} y={560} width={300} height={14} fill="#e8f0ea" opacity={0.8} />
    <rect x={40} y={620} width={420} height={14} fill="#e8f0ea" opacity={0.8} />
    <rect x={700} y={560} width={260} height={14} fill="#e8f0ea" opacity={0.8} />
    <rect x={-100} y={980} width={1280} height={20} fill="#8d6646" />
    <rect x={-500} y={1240} width={320} height={40} fill="#c48b4f" />
    <rect x={-480} y={1280} width={20} height={120} fill="#5b5b66" />
    <rect x={1260} y={1240} width={320} height={40} fill="#c48b4f" />
    <rect x={1540} y={1280} width={20} height={120} fill="#5b5b66" />
  </g>
);

const PROP_SLOTS = [
  { x: 60, y: FLOOR_Y + 80 },
  { x: 1020, y: FLOOR_Y + 80 },
  { x: -200, y: FLOOR_Y + 20 },
  { x: 1280, y: FLOOR_Y + 20 },
  { x: 540, y: FLOOR_Y + 160 },
];

const Prop: React.FC<{ kind: RoomProp; x: number; y: number; frame: number }> = ({ kind, x, y, frame }) => {
  if (kind === "ringlight") {
    const glow = 0.75 + 0.25 * Math.sin(frame * 0.2 + x);
    return (
      <g>
        <rect x={x - 6} y={y - 520} width={12} height={520} fill="#2a2a33" />
        <rect x={x - 70} y={y - 14} width={140} height={14} fill="#2a2a33" />
        <circle cx={x} cy={y - 600} r={120} fill="#fff6d8" opacity={0.25 * glow} />
        <circle cx={x} cy={y - 600} r={90} fill="none" stroke="#ffffff" strokeWidth={26} opacity={glow} />
      </g>
    );
  }
  if (kind === "camera")
    return (
      <g>
        <line x1={x} y1={y - 360} x2={x - 90} y2={y} stroke="#2a2a33" strokeWidth={12} />
        <line x1={x} y1={y - 360} x2={x + 90} y2={y} stroke="#2a2a33" strokeWidth={12} />
        <line x1={x} y1={y - 360} x2={x} y2={y} stroke="#2a2a33" strokeWidth={12} />
        <rect x={x - 90} y={y - 460} width={180} height={110} fill="#1d1f2b" />
        <rect x={x + 60} y={y - 440} width={70} height={70} fill="#3a3d52" />
        <circle cx={x - 60} cy={y - 440} r={10} fill={Math.floor(frame / 20) % 2 ? "#ff3b3b" : "#5a1515"} />
      </g>
    );
  if (kind === "airfryer")
    return (
      <g>
        <rect x={x - 70} y={y - 40} width={140} height={40} fill="#8a6a4f" />
        <rect x={x - 60} y={y - 220} width={120} height={180} rx={14} fill="#1d1f26" />
        <rect x={x - 48} y={y - 120} width={96} height={70} rx={8} fill="#2e313b" />
        <rect x={x - 20} y={y - 100} width={40} height={14} fill="#6b6f86" />
        <rect x={x - 30} y={y - 200} width={60} height={30} fill="#3fd18b" />
        <rect x={x - 22} y={y - 194} width={44} height={18} fill="#0f3d27" />
      </g>
    );
  if (kind === "plantas")
    return (
      <g>
        <rect x={x - 50} y={y - 110} width={100} height={110} fill="#c0643b" />
        <rect x={x - 70} y={y - 240} width={60} height={130} fill="#3e9b4f" />
        <rect x={x - 10} y={y - 300} width={50} height={190} fill="#4fb35e" />
        <rect x={x + 30} y={y - 210} width={50} height={100} fill="#3e9b4f" />
      </g>
    );
  return (
    <g>
      <rect x={x - 110} y={y - 150} width={220} height={150} fill="#c89a5a" />
      <rect x={x - 110} y={y - 150} width={220} height={26} fill="#b2864b" />
      <rect x={x - 70} y={y - 290} width={160} height={140} fill="#d6a865" />
      <rect x={x - 60} y={y - 240} width={140} height={40} fill="#ff4d6d" />
    </g>
  );
};

const BASE_PROPS: Partial<Record<Setting, RoomProp[]>> = { "estudio-mae": ["ringlight", "camera"] };

export const Room: React.FC<{ setting: Setting; props?: RoomProp[]; frame: number }> = ({ setting, props: extra = [], frame }) => {
  const props = [...(BASE_PROPS[setting] ?? []), ...extra];
  return (
  <svg width={W} height={H} viewBox={`${X0} ${Y0} ${W} ${H}`} style={{ position: "absolute", left: X0, top: Y0 }}>
    <Wall s={setting} />
    {(setting === "sala" || setting === "estudio-mae") && <Sala />}
    {setting === "quintal" && <Quintal />}
    {setting === "estadio" && <Estadio />}
    {setting === "quarto-leo" && <Quarto />}
    {setting === "cozinha" && <Cozinha />}
    {setting === "quarto" && <Quarto />}
    {setting === "escola" && <Escola />}
    <Floor s={setting} />
    {props.slice(0, PROP_SLOTS.length).map((k, i) => (
      <Prop key={i} kind={k} x={PROP_SLOTS[i].x} y={PROP_SLOTS[i].y} frame={frame} />
    ))}
  </svg>
  );
};
