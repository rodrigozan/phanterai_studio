import { interpolate, random, Easing } from "remotion";
import { AFUNDADOS, C, CIDADES, CONTINENTE, ESTRADA, ILHAS, T, blob, organic, smooth } from "./world";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const ease = Easing.inOut(Easing.cubic);
export const prog = (t, a, d = 0.8) => interpolate(t, [a, a + d], [0, 1], { ...cl, easing: ease });
const rr = (s) => random(`mapa-${s}`);

export const Sym = ({ tipo, x, y, s = 14, cor = C.tinta, fill }) => {
  const k = fill ?? cor;
  if (tipo === "star") {
    const p = Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rad = i % 2 ? s * 0.45 : s;
      return `${x + Math.cos(a) * rad},${y + Math.sin(a) * rad}`;
    }).join(" ");
    return <polygon points={p} fill={k} stroke={cor} strokeWidth={1.5} />;
  }
  if (tipo === "spark") {
    const p = Array.from({ length: 12 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 6;
      const rad = i % 2 ? s * 0.32 : s;
      return `${x + Math.cos(a) * rad},${y + Math.sin(a) * rad}`;
    }).join(" ");
    return <polygon points={p} fill={k} />;
  }
  if (tipo === "diamond") return <polygon points={`${x},${y - s} ${x + s * 0.7},${y} ${x},${y + s} ${x - s * 0.7},${y}`} fill={k} />;
  if (tipo === "dot") return <circle cx={x} cy={y} r={s * 0.55} fill={k} />;
  if (tipo === "tri") return <polygon points={`${x},${y - s} ${x + s * 0.9},${y + s * 0.7} ${x - s * 0.9},${y + s * 0.7}`} fill={k} />;
  if (tipo === "cross")
    return (
      <g stroke={cor} strokeWidth={s * 0.32} strokeLinecap="round">
        <line x1={x - s * 0.6} y1={y - s * 0.6} x2={x + s * 0.6} y2={y + s * 0.6} />
        <line x1={x + s * 0.6} y1={y - s * 0.6} x2={x - s * 0.6} y2={y + s * 0.6} />
      </g>
    );
  return null;
};

const Draw = ({ d, p, cor = C.tinta, w = 3, fill = "none", fillOp = 0, dash, ...rest }) => (
  <>
    {fillOp > 0 ? <path d={d} fill={fill} opacity={fillOp} stroke="none" /> : null}
    <path d={d} pathLength={1} fill="none" stroke={cor} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ?? "1 1"} strokeDashoffset={dash ? undefined : 1 - p} opacity={p > 0 ? 1 : 0} {...rest} />
  </>
);

const Rotulo = ({ x, y, txt, op, size = 24, cor = C.tinta, peso = 700, esp = 2, up = 0 }) => (
  <text x={x} y={y + (1 - op) * 10 - up} textAnchor="middle" fontFamily="Cinzel" fontWeight={peso} fontSize={size} letterSpacing={esp} fill={cor} opacity={op} stroke={C.papel} strokeWidth={size * 0.22} paintOrder="stroke">
    {txt}
  </text>
);

const Montanha = ({ x, y, w, h, p, cor = C.tinta, fill = C.papel }) => (
  <g opacity={p} transform={`translate(0 ${(1 - p) * 8})`}>
    <path d={`M${x - w},${y} L${x},${y - h} L${x + w},${y}`} fill={fill} stroke={cor} strokeWidth={2.6} strokeLinejoin="round" />
    <path d={`M${x},${y - h} L${x + w * 0.35},${y - h * 0.35} L${x + w * 0.15},${y}`} fill="none" stroke={cor} strokeWidth={1.4} opacity={0.6} />
  </g>
);

const ARVORES = Array.from({ length: 52 }, (_, i) => {
  const a = rr(`ta${i}`) * Math.PI * 2;
  const d = Math.sqrt(rr(`td${i}`));
  return { x: 330 + Math.cos(a) * 175 * d, y: 768 + Math.sin(a) * 105 * d, s: 9 + rr(`ts${i}`) * 9, o: rr(`to${i}`) };
}).sort((a, b) => a.y - b.y);

const CRISTAIS = Array.from({ length: 16 }, (_, i) => {
  const cx = 215 + (i % 8) * 38 + rr(`cx${i}`) * 14;
  const cy = 885 + Math.floor(i / 8) * 34 + rr(`cy${i}`) * 10;
  const n = 5 + Math.floor(rr(`cn${i}`) * 2);
  const pts = Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2 + rr(`ca${i}`);
    const rad = 14 + rr(`cr${i}-${k}`) * 10;
    return `${(cx + Math.cos(a) * rad).toFixed(1)},${(cy + Math.sin(a) * rad * 0.8).toFixed(1)}`;
  }).join(" ");
  return { pts, cx, cy, o: rr(`co${i}`) };
});

const VULCOES = [[650, 680], [740, 650], [835, 690], [700, 765], [805, 772], [885, 742]];

const DUNAS = Array.from({ length: 9 }, (_, i) => ({ x: 610 + (i % 3) * 100 + rr(`dx${i}`) * 30, y: 835 + Math.floor(i / 3) * 40 + rr(`dy${i}`) * 10 }));

const ondas = (x0, x1, y0, y1, seed) =>
  Array.from({ length: 22 }, (_, i) => ({ x: x0 + rr(`${seed}x${i}`) * (x1 - x0), y: y0 + (i / 22) * (y1 - y0) + rr(`${seed}y${i}`) * 30, o: rr(`${seed}o${i}`) }));
const ONDAS_OKHU = ondas(18, 120, 640, 1540, "ok");
const ONDAS_CHAMA = ondas(950, 1060, 640, 1520, "ch");

const VERTEBRAS = Array.from({ length: 17 }, (_, i) => {
  const x = 200 + i * 43;
  const c = Math.abs(i - 8);
  return { x, h: 30 + (8 - c) * 3.2, w: 24 };
});

const SAVANA = blob(540, 1560, 245, 85, "sav", 0.12, 12);
const MATA = blob(330, 768, 205, 135, "mata", 0.14, 12);
const FORJAS = blob(765, 715, 160, 95, "forj", 0.12, 12);
const DESERTO = blob(750, 885, 165, 70, "des", 0.15, 12);
const LAGOS = blob(345, 905, 165, 55, "lag", 0.12, 12);

const CRACK = smooth(organic([[540, 945], [548, 980], [530, 1000], [545, 1035]], "crack", 8, 2, false), false);

const CIRCUITOS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 + 0.2;
  const r0 = 160;
  let x = 540 + Math.cos(a) * r0;
  let y = 1180 + Math.sin(a) * r0;
  const pts = [[x, y]];
  for (let k = 0; k < 4; k++) {
    const len = 40 + rr(`cl${i}${k}`) * 60;
    if (k % 2 === 0) x += Math.cos(a) * len * 1.3;
    else y += Math.sin(a) * len;
    pts.push([x, y]);
  }
  return `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" L")}`;
});

export const MapaZanathos = ({ t, frame }) => {
  const pCoast = prog(t, T.mapa + 0.1, 1.4);
  const pVert = prog(t, T.vertebras, 1.0);
  const pMata = prog(t, T.mata, 0.8);
  const pMar = prog(t, T.mar, 0.7);
  const pForj = prog(t, T.forjas, 0.7);
  const pSav = prog(t, T.savana, 0.8);
  const pAltos = prog(t, T.altos, 0.8);
  const pCor = prog(t, T.coracao, 0.6);
  const pFundo = prog(t, T.caiu + 0.05, 1.1);
  const pChoque = prog(t, T.queda, 1.4);
  const pLagos = prog(t, T.lagos, 0.9);
  const pChama = prog(t, T.oceano, 0.9);
  const pIlhas = prog(t, T.ilhas, 1.2);
  const pAfund = prog(t, T.afundados, 1.0);
  const pDes = prog(t, T.deserto, 0.6);
  const pPart = prog(t, T.partida, 0.8);
  const pCirc = prog(t, T.queda + 0.4, 1.8);
  const pEstr = prog(t, T.capitais + 0.3, 2.4);
  const pTitulo = prog(t, T.mapaFinal - 0.2, 0.6);
  const pOlhos = prog(t, T.olhos, 0.5);
  const pulso = 0.5 + 0.5 * Math.sin(frame / 8);
  const lume = pCirc * (0.55 + 0.45 * pulso);

  return (
    <g>
      <defs>
        <radialGradient id="gFundo">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.55" stopColor={C.fundo} />
          <stop offset="0.85" stopColor="#24103a" />
          <stop offset="1" stopColor={C.borda} />
        </radialGradient>
        <radialGradient id="gLume">
          <stop offset="0" stopColor={C.ouro} stopOpacity="0.9" />
          <stop offset="0.5" stopColor={C.ouro} stopOpacity="0.25" />
          <stop offset="1" stopColor={C.ouro} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gCoracao">
          <stop offset="0" stopColor="#FFF6D6" />
          <stop offset="0.6" stopColor="#F7E7A6" stopOpacity="0.8" />
          <stop offset="1" stopColor="#F7E7A6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gViol">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.3" stopColor={C.violeta} />
          <stop offset="1" stopColor={C.violeta} stopOpacity="0" />
        </radialGradient>
        <clipPath id="clipCont">
          <path d={CONTINENTE} />
        </clipPath>
        <filter id="blur18" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g opacity={pAfund * 0.42}>
        {AFUNDADOS.map((d, i) => (
          <path key={i} d={d} fill={C.okhu} fillOpacity={0.35} stroke={C.tinta} strokeWidth={2.5} strokeDasharray="10 8" transform={`translate(0 ${(1 - pAfund) * -60})`} />
        ))}
      </g>
      {pAfund > 0
        ? Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M${120 + (i % 7) * 130},${1715 + Math.floor(i / 7) * 80 + Math.sin(frame / 14 + i) * 4} q16,-10 32,0 t32,0`} fill="none" stroke={C.okhu} strokeWidth={2.4} opacity={pAfund * 0.8} />
          ))
        : null}

      {ONDAS_OKHU.map((o, i) => (
        <path key={`o${i}`} d={`M${o.x},${o.y + Math.sin(frame / 12 + i) * 3} q10,-8 20,0 t20,0`} fill="none" stroke={C.okhu} strokeWidth={2.4} opacity={prog(t, T.mar + o.o * 0.5, 0.3)} />
      ))}

      {ONDAS_CHAMA.map((o, i) => {
        const a = prog(t, T.forjas + o.o * 0.5, 0.3);
        const ch = prog(t, T.oceano + o.o * 0.6, 0.3);
        const fl = 1 + 0.25 * Math.sin(frame / 4 + i * 1.7);
        return (
          <g key={`c${i}`}>
            <path d={`M${o.x},${o.y} q10,-8 20,0 t20,0`} fill="none" stroke={ch > 0.5 ? C.chama : C.okhu} strokeWidth={2.4} opacity={a} />
            {ch > 0 ? (
              <path d={`M${o.x + 20},${o.y - 4} q-7,-${10 * fl} 0,-${20 * fl} q7,${10 * fl} 0,${20 * fl}Z`} fill={C.chama} stroke={C.halo} strokeWidth={1.5} opacity={ch} filter="url(#glow)" />
            ) : null}
          </g>
        );
      })}
      {pChama > 0 ? <rect x={935} y={620} width={145} height={940} fill={C.halo} opacity={pChama * 0.16} filter="url(#blur18)" /> : null}

      <Draw d={CONTINENTE} p={pCoast} w={4} fill={C.papel} fillOp={0} />

      <g clipPath="url(#clipCont)">
        <path d={MATA} fill={C.mata} opacity={pMata * 0.45} filter="url(#blur18)" />
        <path d={FORJAS} fill={pDes > 0 ? C.ferro : C.forjas} opacity={pForj * 0.4} filter="url(#blur18)" />
        <path d={DESERTO} fill={C.ferro} opacity={pDes * 0.35} filter="url(#blur18)" />
        <path d={SAVANA} fill={C.savana} opacity={pSav * 0.55} filter="url(#blur18)" />
        <path d={LAGOS} fill={C.cristal} opacity={pLagos * 0.5} filter="url(#blur18)" />
        <circle cx={540} cy={1180} r={170} fill="url(#gCoracao)" opacity={pCor * (1 - pFundo)} />
        <circle cx={540} cy={1180} r={380} fill="url(#gLume)" opacity={lume * 0.7} />
      </g>

      {ARVORES.map((a, i) => {
        const p = prog(t, T.mata + a.o * 0.6, 0.25);
        const crist = a.y > 845 ? pLagos : 0;
        return (
          <g key={`a${i}`} opacity={p} transform={`translate(${a.x} ${a.y}) scale(${0.6 + p * 0.4})`}>
            <line x1={0} y1={0} x2={0} y2={a.s * 0.9} stroke={C.tinta} strokeWidth={2} />
            <circle cx={0} cy={-a.s * 0.2} r={a.s * 0.75} fill={crist > 0.5 ? C.cristal : C.mata} stroke={C.tinta} strokeWidth={1.8} />
          </g>
        );
      })}

      {CRISTAIS.map((c, i) => {
        const p = prog(t, T.lagos + c.o * 0.6, 0.35);
        return <polygon key={`k${i}`} points={c.pts} fill={C.cristal} fillOpacity={0.75} stroke="#fff" strokeWidth={1.6} opacity={p} transform={`translate(${c.cx * (1 - p)} ${c.cy * (1 - p)}) scale(${p || 0.001})`} />;
      })}

      {VULCOES.map(([x, y], i) => {
        const p = prog(t, T.forjas + i * 0.08, 0.35);
        const apag = pDes;
        return (
          <g key={`v${i}`} opacity={p}>
            <path d={`M${x - 30},${y + 14} L${x - 10},${y - 22} L${x + 10},${y - 22} L${x + 30},${y + 14}Z`} fill={apag > 0.5 ? "#9a948f" : "#7a3a22"} stroke={C.tinta} strokeWidth={2.4} strokeLinejoin="round" />
            <ellipse cx={x} cy={y - 22} rx={10} ry={4} fill={C.brasa} opacity={(1 - apag) * (0.6 + 0.4 * Math.sin(frame / 5 + i))} filter="url(#glow)" />
          </g>
        );
      })}

      {DUNAS.map((d, i) => (
        <path key={`d${i}`} d={`M${d.x - 32},${d.y} q32,-22 64,0`} fill="none" stroke={C.ferro} strokeWidth={3} strokeDasharray="2 7" strokeLinecap="round" opacity={prog(t, T.deserto + i * 0.04, 0.3)} />
      ))}

      {VERTEBRAS.map((v, i) => {
        const p = prog(t, T.vertebras + i * 0.045, 0.3);
        const quebra = Math.abs(v.x - 544) < 30 ? pPart : 0;
        return <Montanha key={`m${i}`} x={v.x} y={975 + quebra * 12} w={v.w} h={v.h * (1 - quebra * 0.5)} p={p} />;
      })}

      <Draw d={CRACK} p={pPart} w={9} cor={C.tinta} />
      <Draw d={CRACK} p={pPart} w={3} cor={C.violeta} />

      {Array.from({ length: 22 }, (_, i) => {
        const p = prog(t, T.savana + (i / 22) * 0.6, 0.3);
        const x = 330 + (i % 11) * 40 + rr(`gx${i}`) * 16;
        const y = 1515 + Math.floor(i / 11) * 70 + rr(`gy${i}`) * 20;
        return <path key={`g${i}`} d={`M${x - 6},${y} l3,-10 M${x},${y} l0,-13 M${x + 6},${y} l-3,-10`} stroke={C.tinta} strokeWidth={2} opacity={p * 0.8} />;
      })}

      {ILHAS.map((il, i) => {
        const p = prog(t, T.altos + i * 0.08, 0.35);
        const sobe = prog(t, T.ilhas + i * 0.1, 1.1);
        const flutua = Math.sin(frame / 20 + i) * 5 * sobe;
        const y = interpolate(sobe, [0, 1], [632, il.y]) + flutua;
        const x = interpolate(sobe, [0, 1], [il.base, il.x]);
        return (
          <g key={`i${i}`} opacity={p}>
            {sobe > 0.05 ? (
              <>
                <line x1={x} y1={y + il.ry} x2={il.base} y2={640} stroke={C.halo} strokeWidth={2} strokeDasharray="8 8" strokeDashoffset={-frame * 1.5} opacity={sobe * 0.8} />
                <ellipse cx={il.base} cy={640} rx={il.rx * 0.6} ry={8} fill={C.tinta} opacity={0.18 * sobe} />
              </>
            ) : null}
            <g transform={`translate(${x} ${y})`}>
              <path d={il.d} fill={C.papel} stroke={C.tinta} strokeWidth={2.6} transform={`scale(${0.3 + 0.7 * sobe} ${0.3 + 0.7 * sobe})`} opacity={sobe} />
              <path d={`M${-il.rx * 0.5},${il.ry * 0.3} L0,${-il.ry * (1.4 - sobe * 0.8)} L${il.rx * 0.5},${il.ry * 0.3}`} fill={C.papel} stroke={C.tinta} strokeWidth={2.6} strokeLinejoin="round" />
              <path d={`M${-il.rx * 0.3},${il.ry * 0.6} L0,${il.ry * 2.2} L${il.rx * 0.3},${il.ry * 0.6}`} fill={C.papelEscuro} stroke={C.tinta} strokeWidth={2} opacity={sobe} />
            </g>
          </g>
        );
      })}
      {[[300, 640], [470, 625], [640, 628], [790, 645]].map(([x, y], i) => (
        <Montanha key={`r${i}`} x={x} y={y} w={14} h={22} p={pIlhas} />
      ))}

      {CIRCUITOS.map((d, i) => (
        <g key={`ci${i}`}>
          <path d={d} fill="none" stroke={C.ouro} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pCirc} opacity={0.35 + 0.65 * lume} filter="url(#glow)" />
        </g>
      ))}

      {pFundo > 0 ? (
        <g>
          <circle cx={540} cy={1180} r={150 * pFundo} fill="url(#gFundo)" stroke={C.tinta} strokeWidth={4} />
          {Array.from({ length: 22 }, (_, i) => {
            const a = (i / 22) * Math.PI * 2;
            const r0 = 150 * pFundo;
            const h = 14 + rr(`fp${i}`) * 16;
            const x = 540 + Math.cos(a) * r0;
            const y = 1180 + Math.sin(a) * r0;
            const xa = 540 + Math.cos(a - 0.12) * (r0 + h);
            const ya = 1180 + Math.sin(a - 0.12) * (r0 + h);
            const xb = 540 + Math.cos(a + 0.12) * (r0 + h * 0.5);
            const yb = 1180 + Math.sin(a + 0.12) * (r0 + h * 0.5);
            return <polygon key={`fp${i}`} points={`${x},${y} ${xa},${ya} ${xb},${yb}`} fill="#140a1f" stroke="#c9b8ff" strokeWidth={1.2} opacity={pFundo} />;
          })}
        </g>
      ) : null}

      {pChoque > 0 && pChoque < 1 ? (
        <circle cx={540} cy={1180} r={150 + pChoque * 900} fill="none" stroke={C.violeta} strokeWidth={22 * (1 - pChoque)} opacity={1 - pChoque} />
      ) : null}

      {pOlhos > 0
        ? [515, 565].map((x) => (
            <g key={x} filter="url(#glow)">
              <ellipse cx={x} cy={1182} rx={13} ry={9 * pOlhos} fill={C.violeta} />
              <ellipse cx={x} cy={1182} rx={4} ry={7 * pOlhos} fill="#fff" />
            </g>
          ))
        : null}

      <mask id="mEstr" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
        <path d={ESTRADA} fill="none" stroke="#fff" strokeWidth={18} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pEstr} />
      </mask>
      <path d={ESTRADA} fill="none" stroke={C.ouro} strokeWidth={6} strokeDasharray="2 13" strokeLinecap="round" opacity={pEstr > 0 ? 1 : 0} mask="url(#mEstr)" />

      {CIDADES.map((c) => {
        const op = prog(t, c.t, 0.35);
        if (op <= 0) return null;
        const brilho = c.cap ? prog(t, T.capitais + ((1700 - c.y) / 1400) * 2.4, 0.4) * (1 - prog(t, T.capitais + ((1700 - c.y) / 1400) * 2.4 + 0.6, 0.6)) : 0;
        const cor = c.hoste ? C.borda : C.tinta;
        const s = 15 + op * 2 + brilho * 10;
        return (
          <g key={c.n} opacity={op}>
            {brilho > 0 || c.cap ? <circle cx={c.x} cy={c.y} r={20 + brilho * 30} fill="url(#gLume)" opacity={0.4 + brilho * 0.6} /> : null}
            {c.s.length > 1 ? (
              <>
                <Sym tipo={c.s[0]} x={c.x - 13} y={c.y} s={s * 0.75} cor={cor} />
                <Sym tipo={c.s[1]} x={c.x + 13} y={c.y} s={s} cor={cor} fill={c.cap ? C.ouro : cor} />
              </>
            ) : (
              <Sym tipo={c.s[0]} x={c.x} y={c.y} s={s} cor={cor} fill={c.cap ? C.ouro : cor} />
            )}
            <Rotulo x={c.x} y={c.below ? c.y + 40 : c.y - 22} txt={c.n} op={op} size={c.cap ? 25 : 21} cor={cor} />
          </g>
        );
      })}

      <Rotulo x={330} y={668} txt="MATA-MÃE" op={prog(t, T.mata + 0.4, 0.4) * (1 - pTitulo * 0)} size={30} cor={C.mata} esp={5} />
      <Rotulo x={765} y={628} txt="AS FORJAS" op={prog(t, T.forjas + 0.4, 0.4) * (1 - pDes)} size={30} cor={C.forjas} esp={5} />
      <Rotulo x={760} y={970} txt="CINZA-FERRO" op={pDes} size={26} cor={C.ferro} esp={5} />
      <Rotulo x={78} y={1440} txt="OKHU" op={prog(t, T.mar + 0.4, 0.4)} size={30} cor={C.okhu} esp={6} />
      <Rotulo x={1005} y={1440} txt={pChama > 0.5 ? "CHAMA" : "MAR"} op={prog(t, T.forjas + 0.4, 0.4)} size={26} cor={pChama > 0.5 ? "#5d6fb8" : C.okhu} esp={4} />
      <Rotulo x={540} y={1650} txt="SAVANA DOS ECOS" op={prog(t, T.savana + 0.4, 0.4)} size={28} cor="#7a5a1e" esp={5} />
      <Rotulo x={540} y={935} txt={pPart > 0.5 ? "A VÉRTEBRA PARTIDA" : "AS VÉRTEBRAS"} op={prog(t, T.vertebras + 0.6, 0.4)} size={26} esp={6} up={0} />
      <Rotulo x={345} y={980} txt="LAGOS DE CRISTAL" op={pLagos * (1 - prog(t, T.partida - 0.3, 0.3))} size={22} cor="#2f7d82" esp={3} />
      <Rotulo x={540} y={1395} txt={pFundo > 0.3 ? "O FUNDO" : "O CORAÇÃO CLARO"} op={Math.max(prog(t, T.coracao + 0.3, 0.4), prog(t, T.fundo, 0.4))} size={32} cor={pFundo > 0.3 ? C.borda : "#9a7a1e"} esp={7} />
      <Rotulo x={540} y={1890} txt="CONTINENTES AFUNDADOS" op={pAfund * 0.85} size={24} cor={C.okhu} esp={4} />
      <Rotulo x={540} y={385} txt="ARQUIPÉLAGO SUSPENSO" op={pIlhas * (1 - pTitulo)} size={24} cor="#4a5a8a" esp={4} />

      <g opacity={prog(t, T.mapa + 1, 0.8)} transform="translate(985 1640)">
        <circle r={52} fill="none" stroke={C.tinta} strokeWidth={2} />
        <circle r={40} fill="none" stroke={C.tinta} strokeWidth={1} strokeDasharray="3 5" />
        {[0, 90, 180, 270].map((a) => (
          <polygon key={a} points="0,-60 9,0 0,8 -9,0" fill={a === 0 ? C.ouro : C.tinta} stroke={C.tinta} strokeWidth={1.5} transform={`rotate(${a})`} />
        ))}
        {[45, 135, 225, 315].map((a) => (
          <polygon key={a} points="0,-34 6,0 -6,0" fill={C.papel} stroke={C.tinta} strokeWidth={1.5} transform={`rotate(${a})`} />
        ))}
        <text y={-70} textAnchor="middle" fontFamily="Cinzel" fontWeight={700} fontSize={20} fill={C.tinta}>N</text>
      </g>

      {pTitulo > 0 ? (
        <g opacity={pTitulo} transform={`translate(540 ${300 + (1 - pTitulo) * 20})`}>
          <rect x={-330} y={-62} width={660} height={104} rx={8} fill={C.papel} stroke={C.tinta} strokeWidth={3} />
          <rect x={-320} y={-52} width={640} height={84} rx={4} fill="none" stroke={C.ouro} strokeWidth={2} />
          <text y={16} textAnchor="middle" fontFamily="Cinzel Decorative" fontWeight={900} fontSize={68} letterSpacing={8} fill={C.tinta}>ZANATHOS</text>
        </g>
      ) : null}
    </g>
  );
};
