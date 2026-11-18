// Cenas de tela: navegador, instaladores (Windows/Mac/Linux), terminais e Claude Code.
// `d` = dados do roteiro.json com `em` (frame local) nas âncoras.
import { AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import {
  CIANO, LARANJA, FONT, MONO, W, H, clamp, pasta, FundoMarca, Fundo, Faiscas169, Pop, Desliza, Cartao, Pant, Texto, Term, Sfx, Cursor, Digita,
  Navegador, ClaudeTela, LogoOllama,
} from "./base";

const Linha = ({ children, y, style = {} }) => <div style={{ position: "absolute", left: 0, top: y, width: W, display: "flex", justifyContent: "center", ...style }}>{children}</div>;
const Pilula = ({ children, cor = colors.gold, texto = "#140B2E", size = 50, style = {} }) => (
  <div style={{ ...FONT, textTransform: "none", fontSize: size, color: texto, background: cor, padding: "10px 36px", borderRadius: 56, boxShadow: "0 12px 40px rgba(0,0,0,0.45)", ...style }}>{children}</div>
);
const Selo = ({ em, children, cor = colors.green, x = 1290, y = 760 }) => (
  <Pop em={em} sfx="ding" style={{ position: "absolute", left: x, top: y }}><Pilula cor={cor} texto="#06281c" size={46}>{children}</Pilula></Pop>
);

// Mapeia coordenadas do print (1600x900) para a tela dentro do Navegador.
const NAV = { x: 150, y: 50, w: 1620, h: 820 };
const k = NAV.w / 1600;
// Zoom do print nas cenas do site do Ollama: recorta a região (vx, vy) do print e amplia z vezes.
const Z = { z: 1.4, vx: 120, vy: 230 };
const naTela = (sx, sy, zoom = null) => zoom
  ? { x: NAV.x + (sx - zoom.vx) * zoom.z * k, y: NAV.y + 76 + (sy - zoom.vy) * zoom.z * k }
  : { x: NAV.x + sx * k, y: NAV.y + 76 + sy * k };

const Print = ({ slug, arq, style = {}, zoom = null }) => (
  <Img src={pasta(slug, `prints/${arq}`)} style={zoom ? { position: "absolute", left: -zoom.vx * zoom.z * k, top: -zoom.vy * zoom.z * k, width: 1600 * zoom.z * k, ...style } : { position: "absolute", left: 0, top: 0, width: "100%", ...style }} />
);

// Digita a URL na barra do navegador.
const UrlDigitada = ({ texto, em, cpf = 0.55 }) => <Digita text={texto} em={em} cpf={cpf} cor="#202124" />;

// ---------- 11. navegador: digitar o endereço ----------
export const NavegadorUrl = ({ slug, d }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], [1, 1.04], clamp);
  const carregou = frame > d.t.em + 40;
  return (
    <>
      <FundoMarca />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "50% 40%" }}>
        <Navegador x={NAV.x} y={NAV.y} w={NAV.w} h={NAV.h} url={<UrlDigitada texto="ollama.com/download" em={d.t.em} />} em={0}>
          {carregou ? <Print slug={slug} arq="ollama-download.png" zoom={Z} style={{ opacity: interpolate(frame - d.t.em - 40, [0, 12], [0, 1], clamp) }} /> : null}
        </Navegador>
      </div>
      <Sfx name="whoosh" atFrame={d.t.em + 40} />
      <Cursor pontos={[{ f: 10, x: 1500, y: 500 }, { f: d.t.em + 30, x: 760, y: 120 }]} />
    </>
  );
};

// ---------- 12. navegador: abas + baixar manualmente ----------
const ChipDownload = ({ em, nome, dur = 60 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - em, [0, dur], [0, 1], clamp);
  return (
    <Pop em={em} sfx="pop" style={{ position: "absolute", left: 1230, top: 700, width: 480, borderRadius: 22, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", border: "2px solid #dadce0", padding: "20px 26px" }}>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 30, color: "#202124", fontWeight: 700 }}>{nome}</div>
      <div style={{ height: 14, borderRadius: 7, background: "#e8eaed", marginTop: 14, overflow: "hidden" }}><div style={{ width: `${p * 100}%`, height: "100%", background: p >= 1 ? colors.green : "#1a73e8" }} /></div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 24, color: p >= 1 ? "#188038" : "#5f6368", marginTop: 8 }}>{p >= 1 ? "Download concluído" : `${Math.round(p * 100)}%`}</div>
      {p >= 1 ? <Sfx name="ding" atFrame={em + dur} /> : null}
    </Pop>
  );
};

export const NavegadorDownload = ({ slug, d }) => {
  const frame = useCurrentFrame();
  const aba = (arq) => <Print slug={slug} arq={arq} zoom={Z} />;
  const tela = frame >= d.mac.em ? "ollama-download-macos.png" : frame >= d.tab.em + 14 ? "ollama-download-windows.png" : "ollama-download.png";
  const tabWin = naTela(751, 326, Z), tabMac = naTela(620, 326, Z), link = naTela(735, 445, Z);
  return (
    <>
      <FundoMarca />
      <Navegador x={NAV.x} y={NAV.y} w={NAV.w} h={NAV.h} url="ollama.com/download" em={0}>{aba(tela)}</Navegador>
      {frame >= d.link.em ? <div style={{ position: "absolute", left: link.x - 100, top: link.y - 24, width: 330, height: 56, borderRadius: 10, border: `4px solid ${colors.gold}`, boxShadow: `0 0 30px ${colors.gold}`, opacity: Math.abs(Math.sin(frame / 5)) * 0.5 + 0.5 }} /> : null}
      <Sequence from={d.link.em + 8} durationInFrames={Math.max(10, d.mac.em - d.link.em - 8)} layout="none"><ChipDownload em={0} nome="OllamaSetup.exe" /></Sequence>
      <Sequence from={d.mac.em + 28} layout="none"><ChipDownload em={0} nome="Ollama.dmg" /></Sequence>
      <Cursor
        pontos={[
          { f: 8, x: 1300, y: 300 },
          { f: d.tab.em, x: tabWin.x + 20, y: tabWin.y + 10 },
          { f: d.link.em - 6, x: link.x + 40, y: link.y + 4 },
          { f: d.mac.em - 10, x: link.x + 40, y: link.y + 4 },
          { f: d.mac.em, x: tabMac.x + 20, y: tabMac.y + 10 },
          { f: d.mac.em + 24, x: link.x + 40, y: link.y + 4 },
        ]}
        cliques={[d.tab.em + 6, d.link.em, d.mac.em + 4, d.mac.em + 26]}
      />
    </>
  );
};

// ---------- 13. instalador do Windows ----------
export const InstaladorWindows = ({ slug, d, pose }) => {
  const frame = useCurrentFrame();
  const ini = d.b.em + 12;
  const p = interpolate(frame, [ini, ini + 70], [0, 1], clamp);
  const pronto = p >= 1;
  const botao = { x: 1220, y: 690 };
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(135deg, #0a3d91 0%, #1c7ed6 55%, #74c0fc 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: "rgba(20,24,38,0.92)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 30px", gap: 22 }}>
        {pronto ? <Pop em={ini + 70} sfx="ding" style={{ display: "flex", alignItems: "center" }}><LogoOllama slug={slug} h={52} fundo="#fff" /></Pop> : null}
        <div style={{ fontFamily: "Arial, sans-serif", color: "#fff", fontSize: 26 }}>14:32</div>
      </div>
      <Pop em={4} sfx="whoosh" style={{ position: "absolute", left: 460, top: 150, width: 1000, height: 600, borderRadius: 14, background: "#f3f3f3", boxShadow: "0 40px 100px rgba(0,0,0,0.55)", overflow: "hidden" }}>
        <div style={{ height: 52, background: "#fff", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: "Arial, sans-serif", fontSize: 24, color: "#222", borderBottom: "1px solid #ddd" }}>Ollama Setup</div>
        <div style={{ padding: "50px 60px", display: "flex", gap: 40, alignItems: "center" }}>
          <LogoOllama slug={slug} h={200} />
          <div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 44, fontWeight: 700, color: "#111" }}>{pronto ? "Instalação concluída" : frame >= ini ? "Instalando…" : "Instalar o Ollama"}</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 28, color: "#555", marginTop: 14 }}>{pronto ? "O Ollama está rodando em segundo plano." : "Rode modelos de IA no seu computador."}</div>
          </div>
        </div>
        <div style={{ margin: "0 60px", height: 22, borderRadius: 11, background: "#d9d9d9", overflow: "hidden", opacity: frame >= ini ? 1 : 0 }}><div style={{ width: `${p * 100}%`, height: "100%", background: "#0067c0" }} /></div>
        <div style={{ position: "absolute", right: 50, bottom: 40, padding: "16px 54px", borderRadius: 8, background: frame >= ini && !pronto ? "#b8b8b8" : "#0067c0", color: "#fff", fontFamily: "Arial, sans-serif", fontSize: 32, fontWeight: 700 }}>{pronto ? "Finish" : "Install"}</div>
      </Pop>
      <Cursor pontos={[{ f: 10, x: 1500, y: 300 }, { f: d.b.em - 10, x: botao.x + 40, y: botao.y + 10 }, { f: d.b.em, x: botao.x + 50, y: botao.y + 16 }, { f: ini + 90, x: botao.x + 60, y: botao.y + 16 }]} cliques={[d.b.em]} />
      {pronto ? (
        <Pop em={d.c.em} sfx={null} style={{ position: "absolute", left: 1330, top: 880 }}>
          <Pilula cor={colors.green} texto="#06281c" size={40}>Ollama rodando em segundo plano</Pilula>
        </Pop>
      ) : null}
      <Pant pose={pose ?? "comemorando"} x={250} y={820} w={300} em={d.c.em} />
    </>
  );
};

// ---------- 14. instalador do Mac ----------
export const InstaladorMac = ({ slug, d, pose }) => {
  const frame = useCurrentFrame();
  const arrasta = interpolate(frame, [d.b.em, d.b.em + 36], [0, 1], clamp);
  const e = arrasta * arrasta * (3 - 2 * arrasta);
  const iconeX = 620 + e * 560, iconeY = 380;
  const copiou = frame > d.b.em + 36;
  const abriu = frame >= d.c.em;
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(160deg, #2b1055 0%, #7597de 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 56, background: "rgba(255,255,255,0.28)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 40px", gap: 30, fontFamily: "Arial, sans-serif", fontSize: 26, color: "#fff" }}>
        {abriu ? <Pop em={d.c.em} sfx="ding" style={{ display: "flex" }}><LogoOllama slug={slug} h={40} /></Pop> : null}
        <span>Ter 14:32</span>
      </div>
      <Pop em={4} sfx="whoosh" style={{ position: "absolute", left: 360, top: 150, width: 1200, height: 560, borderRadius: 22, background: "rgba(246,246,246,0.97)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)", overflow: "hidden" }}>
        <div style={{ height: 56, background: "#e8e8e8", display: "flex", alignItems: "center", gap: 12, padding: "0 22px" }}>
          {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: "50%", background: c }} />)}
          <div style={{ flex: 1, textAlign: "center", fontFamily: "Arial, sans-serif", fontSize: 24, color: "#444", marginRight: 70 }}>Ollama</div>
        </div>
        <div style={{ position: "absolute", left: 640, top: 250, fontFamily: MONO, fontSize: 90, color: "#999" }}>→</div>
        <div style={{ position: "absolute", left: 830, top: 170, width: 230, textAlign: "center" }}>
          <div style={{ width: 190, height: 150, margin: "0 auto", borderRadius: 18, background: "linear-gradient(180deg, #5fb4ff, #2f86e0)", boxShadow: "0 10px 20px rgba(0,0,0,0.25)" }} />
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 30, color: "#222", marginTop: 14 }}>Aplicativos</div>
        </div>
      </Pop>
      {frame >= 4 && !copiou ? <div style={{ position: "absolute", left: iconeX, top: iconeY, textAlign: "center" }}><div style={{ width: 160, height: 160, borderRadius: 36, background: "#fff", boxShadow: "0 14px 30px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}><LogoOllama slug={slug} h={110} /></div><div style={{ fontFamily: "Arial, sans-serif", fontSize: 30, color: "#222", marginTop: 8 }}>Ollama</div></div> : null}
      {copiou ? <Pop em={d.b.em + 36} sfx="ding" style={{ position: "absolute", left: 1090, top: 560 }}><Pilula cor={colors.green} texto="#06281c" size={40}>Copiado para Aplicativos</Pilula></Pop> : null}
      <Cursor pontos={[{ f: 10, x: 1500, y: 260 }, { f: d.b.em - 4, x: 700, y: 440 }, { f: d.b.em + 36, x: 1260, y: 440 }, { f: d.c.em - 6, x: 1260, y: 440 }, { f: d.c.em, x: 1700, y: 30 }]} cliques={[d.b.em - 2, d.c.em]} />
      <Pant pose={pose ?? "apontando"} x={1740} y={800} w={300} em={d.b.em} />
    </>
  );
};

// ---------- 15 e 16. terminais simples ----------
const Palco = ({ children, pose, panta = true, bg = false, slug, fundo }) => (
  <>
    {bg ? <Fundo slug={slug} src={fundo} escurecer={0.72} /> : <FundoMarca />}
    <Faiscas169 n={8} />
    {children}
    {panta ? <Pant pose={pose ?? "feliz"} x={1740} y={800} w={300} em={10} /> : null}
  </>
);

export const InstaladorLinux = ({ d, pose }) => (
  <Palco pose={pose ?? "apontando"}>
    <div style={{ position: "absolute", left: 120, top: 110 }}>
      <Term titulo="Terminal — Ubuntu" w={1560} h={640} size={38} prompt="usuario@pc:~$ " linhas={[
        { t: "cmd", text: "curl -fsSL https://ollama.com/install.sh | sh", em: d.t.em, cpf: 1.0 },
        { t: "dim", text: ">>> Installing ollama to /usr/local" },
        { t: "dim", text: ">>> Downloading Linux amd64 bundle" },
        { t: "dim", text: "######################################## 100.0%" },
        { t: "dim", text: ">>> Creating ollama user..." },
        { t: "dim", text: ">>> Adding ollama user to render group..." },
        { t: "ok", text: ">>> The Ollama API is now available at 127.0.0.1:11434." },
        { t: "ok", text: ">>> Install complete. Run \"ollama\" from the command line." },
      ]} />
    </div>
    <Pop em={d.t.em + 140} sfx="ding" style={{ position: "absolute", left: 120, top: 790 }}><Pilula cor={colors.green} texto="#06281c" size={46}>Instalou sozinho</Pilula></Pop>
  </Palco>
);

export const TerminalVersaoOllama = ({ d, pose }) => (
  <Palco pose={pose ?? "feliz"}>
    <Linha y={50}><Texto em={2} y={0} size={80} rot={-1} fundo={colors.violet}>Passo 1: Ollama</Texto></Linha>
    <div style={{ position: "absolute", left: 200, top: 250 }}>
      <Term titulo="Terminal" w={1450} h={400} size={46} linhas={[
        { t: "cmd", text: "ollama --version", em: d.t.em },
        { t: "ok", text: "ollama version is 0.40.16", em: d.ok.em },
      ]} />
    </div>
    <Selo em={d.pronto.em} x={640} y={700}>Passo 1 pronto</Selo>
  </Palco>
);

// ---------- 17. instalar o Claude Code (Windows x Mac/Linux) ----------
export const TerminaisClaude = ({ d, pose }) => (
  <Palco pose={pose ?? "apontando"} panta={false}>
    <Linha y={40}><Texto em={2} y={0} size={80} rot={-1} fundo={colors.violet}>Passo 2: Claude Code</Texto></Linha>
    <Desliza em={d.win.em - 10} de="cima" style={{ position: "absolute", left: 90, top: 190, ...FONT, fontSize: 48, color: CIANO, width: 880 }}>WINDOWS (PowerShell)</Desliza>
    <div style={{ position: "absolute", left: 90, top: 270 }}>
      <Term titulo="PowerShell" w={880} h={470} size={30} fundo="#012456" barra="#0b3a82" prompt="PS C:\Users\voce> " promptCor="#FFD43B" linhas={[
        { t: "cmd", text: "irm https://claude.ai/install.ps1 | iex", em: d.win.em, cpf: 0.8 },
        { t: "dim", text: "Installing Claude Code…" },
        { t: "ok", text: "✔ Claude Code instalado" },
      ]} />
    </div>
    <Desliza em={d.mac.em - 10} de="cima" style={{ position: "absolute", left: 990, top: 190, ...FONT, fontSize: 48, color: colors.green, width: 880 }}>MAC E LINUX</Desliza>
    <div style={{ position: "absolute", left: 990, top: 270 }}>
      <Term titulo="Terminal" w={840} h={470} size={30} linhas={[
        { t: "cmd", text: "curl -fsSL https://claude.ai/install.sh | bash", em: d.mac.em, cpf: 0.8 },
        { t: "dim", text: "Installing Claude Code…" },
        { t: "ok", text: "✔ Claude Code instalado" },
      ]} />
    </div>
    <Pant pose={pose ?? "apontando"} x={960} y={850} w={250} em={d.mac.em + 20} />
  </Palco>
);

export const TerminalVersaoClaude = ({ d, pose }) => (
  <Palco pose={pose ?? "pensando"}>
    <div style={{ position: "absolute", left: 120, top: 60 }}>
      <Term titulo="Terminal" w={1450} h={300} size={40} linhas={[
        { t: "cmd", text: "claude --version", em: d.t.em },
        { t: "ok", text: "2.1.323 (Claude Code)", em: d.ok.em },
      ]} />
    </div>
    <div style={{ position: "absolute", left: 120, top: 400 }}>
      <Term titulo="Terminal — se der erro" w={1450} h={300} size={40} linhas={[
        { t: "cmd", text: "claude", em: d.err.em - 20 },
        { t: "err", text: "command not found: claude", em: d.err.em + 10 },
      ]} />
    </div>
    <Pop em={d.fix.em} sfx="ding" style={{ position: "absolute", left: 120, top: 750 }}><Pilula cor={colors.gold} size={46}>Feche e abra o terminal de novo</Pilula></Pop>
  </Palco>
);

// ---------- 19. baixar o modelo ----------
export const TerminalPull = ({ d, pose }) => (
  <Palco pose={pose ?? "feliz"} panta={false}>
    <Linha y={30}><Texto em={2} y={0} size={76} rot={-1} fundo={colors.violet}>Passo 3: o modelo grátis</Texto></Linha>
    <div style={{ position: "absolute", left: 70, top: 160 }}>
      <Term titulo="Terminal" w={1260} h={560} size={32} linhas={[
        { t: "cmd", text: "ollama pull qwen3.5:9b", em: d.t.em },
        { t: "out", text: "pulling manifest" },
        { t: "pull", nome: "fdf5fd4cd409", total: 6.6, em: d.t.em + 70, dur: 400 },
        { t: "dim", text: "verifying sha256 digest", em: d.t.em + 480 },
        { t: "ok", text: "success", em: d.t.em + 500 },
      ]} />
    </div>
    <Desliza em={d.m.em} de="dir" style={{ position: "absolute", left: 1370, top: 170 }}><Cartao em={d.m.em} titulo="qwen3.5:9b" sub="9 bilhões de parâmetros" cor={colors.violetLight} w={490} h={150} size={42} /></Desliza>
    <Desliza em={d.gb.em} de="dir" style={{ position: "absolute", left: 1370, top: 340 }}><Cartao em={d.gb.em} titulo="~7 GB" sub="no disco" cor={colors.gold} w={490} h={150} size={46} /></Desliza>
    <Desliza em={d.tools.em} de="dir" style={{ position: "absolute", left: 1370, top: 510 }}><Cartao em={d.tools.em} titulo="Usa ferramentas" sub="lê e edita arquivos" cor={colors.green} w={490} h={150} size={40} /></Desliza>
    <Pop em={d.disco.em} sfx="error" style={{ position: "absolute", left: 1370, top: 690 }}><Cartao em={d.disco.em} sfx={null} titulo="Confira o espaço" sub="pode levar minutos" cor={colors.red} w={490} h={150} size={38} /></Pop>
  </Palco>
);

// ---------- 20. sua máquina, seu modelo ----------
export const ModeloMenor = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} escurecer={0.72} />
    <Linha y={60}><Texto em={2} y={0} size={84} rot={-1}>Sua máquina, seu modelo</Texto></Linha>
    <Desliza em={4} de="esq" style={{ position: "absolute", left: 150, top: 260 }}>
      <Cartao em={4} sfx={null} titulo="qwen3.5:9b" sub="~7 GB · recomendado" cor={colors.violetLight} w={760} h={190} size={60} />
    </Desliza>
    <Desliza em={d.a.em} de="dir" style={{ position: "absolute", left: 1010, top: 260 }}>
      <Cartao em={d.a.em} titulo="qwen3.5:4b" sub="~4 GB · máquina mais simples" cor={colors.green} w={760} h={190} size={60} />
    </Desliza>
    <Pop em={d.b.em} sfx="coin" style={{ position: "absolute", left: 150, top: 540 }}><Pilula cor={colors.gold} size={52}>Máquina forte: escolha um modelo maior</Pilula></Pop>
    <Pop em={d.c.em} style={{ position: "absolute", left: 150, top: 680 }}><Pilula cor="#0D1117" texto="#fff" size={50} style={{ border: `3px solid ${CIANO}` }}>O Ollama tem todos os tamanhos</Pilula></Pop>
    <Pant pose={pose ?? "pensando"} x={1560} y={760} w={400} em={10} />
  </>
);

// ---------- 21. launch ----------
export const TerminalLaunch = ({ d, pose }) => (
  <Palco pose={pose ?? "apontando"}>
    <div style={{ position: "absolute", left: 90, top: 100 }}>
      <Term titulo="Terminal — meu-projeto" w={1560} h={540} size={38} linhas={[
        { t: "cmd", text: "cd ~/meu-projeto", em: d.a.em },
        { t: "cmd", text: "ollama launch claude --model qwen3.5:9b", em: d.b.em, cpf: 1.0 },
        { t: "out", text: "Launching Claude Code with qwen3.5:9b…" },
      ]} />
    </div>
    <Pop em={d.model.em} style={{ position: "absolute", left: 130, top: 700 }}><Pilula cor="#0D1117" texto="#fff" size={46} style={{ border: `3px solid ${colors.gold}` }}><span style={{ color: colors.gold, fontFamily: MONO }}>--model</span> escolhe o modelo</Pilula></Pop>
  </Palco>
);

// ---------- 22. Claude Code aberto ----------
export const ClaudeAberto = ({ d, pose }) => (
  <>
    <FundoMarca />
    <Faiscas169 n={26} />
    <div style={{ position: "absolute", left: 90, top: 120 }}>
      <ClaudeTela w={1100} h={560} size={32}>
        <div style={{ border: "2px solid #ffffff33", borderRadius: 12, padding: "14px 20px", color: "#6B7280" }}>&gt; pergunte qualquer coisa…</div>
        <div style={{ color: "#6B7280", fontSize: 24, marginTop: 20 }}>? para atalhos</div>
      </ClaudeTela>
    </div>
    <Pop em={d.a.em} sfx="coin" style={{ position: "absolute", left: 1260, top: 150 }}><Cartao em={d.a.em} sfx={null} titulo="Sem assinatura" cor={colors.green} icone="✓" w={600} h={120} size={46} /></Pop>
    <Pop em={d.b.em} style={{ position: "absolute", left: 1260, top: 310 }}><Cartao em={d.b.em} sfx={null} titulo="Sem chave de API" cor={colors.gold} icone="✓" w={600} h={120} size={46} /></Pop>
    <Pop em={d.c.em} style={{ position: "absolute", left: 1260, top: 470 }}><Cartao em={d.c.em} sfx={null} titulo="Roda na sua máquina" cor={CIANO} icone="✓" w={600} h={120} size={46} /></Pop>
    <Pant pose={pose ?? "comemorando"} x={1640} y={810} w={400} em={6} />
  </>
);

// ---------- 23. teste: pedir e permitir ----------
export const ClaudeTeste = ({ d, pose }) => {
  const frame = useCurrentFrame();
  const pedido = "crie uma página HTML com um botão que muda de cor quando eu clico";
  const sel = frame >= d.ok.em;
  return (
    <>
      <FundoMarca />
      <div style={{ position: "absolute", left: 110, top: 70 }}>
        <ClaudeTela w={1700} h={820} size={34}>
          <div style={{ border: "2px solid #ffffff33", borderRadius: 12, padding: "14px 20px" }}><span style={{ color: LARANJA }}>&gt; </span><Digita text={pedido} em={d.a.em} cpf={0.75} /></div>
          {frame >= d.a.em + 100 ? <div style={{ marginTop: 22, color: "#E6EDF3" }}>● Vou criar o arquivo <span style={{ color: CIANO }}>index.html</span>.</div> : null}
          {frame >= d.perm.em ? (
            <Pop em={d.perm.em} sfx="pop" style={{ marginTop: 24, border: `2px solid ${colors.gold}`, borderRadius: 14, padding: "18px 26px" }}>
              <div style={{ color: colors.gold, fontWeight: 700 }}>Create file index.html?</div>
              <div style={{ marginTop: 10, color: sel ? colors.green : "#fff", fontWeight: sel ? 700 : 500 }}>{sel ? "❯ 1. Yes" : "  1. Yes"}</div>
              <div style={{ color: "#9AA4B2" }}>{"  "}2. Yes, allow all edits this session</div>
              <div style={{ color: "#9AA4B2" }}>{"  "}3. No</div>
            </Pop>
          ) : null}
          {sel ? <Sfx name="ding" atFrame={d.ok.em} /> : null}
          {sel ? <Pop em={d.ok.em + 10} sfx={null} style={{ marginTop: 18, color: colors.green }}>✔ index.html criado</Pop> : null}
        </ClaudeTela>
      </div>
      <Pop em={d.perm.em + 10} sfx={null} style={{ position: "absolute", left: 1230, top: 910 }}><div style={{ ...FONT, textTransform: "none", fontSize: 30, color: "#9AA4B2" }}>tela ilustrativa</div></Pop>
      <Pant pose={pose ?? "apontando"} x={1760} y={800} w={280} em={d.perm.em} />
    </>
  );
};

// ---------- 24. resultado ----------
export const ResultadoPagina = ({ d, pose }) => {
  const frame = useCurrentFrame();
  const cliques = [d.b.em + 10, d.b.em + 42, d.b.em + 74];
  const n = cliques.filter((c) => frame >= c + 2).length;
  const cores = [colors.violet, colors.green, colors.red, colors.gold];
  const press = cliques.some((c) => frame >= c && frame < c + 6);
  return (
    <>
      <FundoMarca />
      <Faiscas169 n={20} />
      <Navegador x={200} y={60} w={1520} h={780} url="file:///home/voce/meu-projeto/index.html" em={0}>
        <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 48, color: "#333", marginBottom: 50 }}>Minha primeira página</div>
          <div style={{ background: cores[n % 4], color: "#fff", fontFamily: "Arial, sans-serif", fontSize: 54, fontWeight: 700, padding: "30px 80px", borderRadius: 20, transform: press ? "scale(0.94)" : "scale(1)", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>Clique em mim</div>
        </AbsoluteFill>
      </Navegador>
      <Cursor pontos={[{ f: 6, x: 1500, y: 700 }, { f: d.b.em, x: 940, y: 520 }, { f: d.b.em + 100, x: 945, y: 525 }]} cliques={cliques} />
      <Pop em={d.b.em + 74} sfx="coin" style={{ position: "absolute", left: 1270, top: 760 }}><Pilula cor={colors.green} texto="#06281c" size={46}>Funcionou!</Pilula></Pop>
      <Pant pose={pose ?? "comemorando"} x={1740} y={800} w={330} em={d.b.em + 74} />
    </>
  );
};

// ---------- 25. comandos úteis ----------
export const ComandosUteis = ({ d, pose }) => (
  <>
    <FundoMarca />
    <Faiscas169 n={14} />
    <Linha y={40}><Texto em={2} y={0} size={84} rot={-1}>Comandos que você vai usar</Texto></Linha>
    {d.cmds.map((c, i) => (
      <Pop key={i} em={c.em} style={{ position: "absolute", left: 130 + (i % 2) * 760, top: 230 + Math.floor(i / 2) * 330, width: 720, height: 290, borderRadius: 36, background: "#0D1117", border: `4px solid ${[CIANO, colors.gold, colors.green, colors.violetLight][i]}`, boxShadow: `0 0 50px ${[CIANO, colors.gold, colors.green, colors.violetLight][i]}55`, padding: "34px 40px" }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 84, color: [CIANO, colors.gold, colors.green, colors.violetLight][i] }}>{c.cmd}</div>
        <div style={{ ...FONT, textAlign: "left", textTransform: "none", fontSize: 44, color: "#fff", marginTop: 14 }}>{c.txt}</div>
      </Pop>
    ))}
    <Pant pose={pose ?? "apontando"} x={1740} y={800} w={330} em={10} />
  </>
);

// ---------- 26. dica de prompt ----------
export const DicaPrompt = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.72} />
    <Linha y={40}><Texto em={2} y={0} size={84} rot={-1}>Pedido claro, resultado melhor</Texto></Linha>
    <Desliza em={d.ruim.em} de="esq" style={{ position: "absolute", left: 120, top: 220 }}><Cartao em={d.ruim.em} sfx="error" titulo="crie um sistema completo" cor={colors.red} icone="✕" w={1050} h={130} size={50} /></Desliza>
    <Desliza em={d.bom.em} de="esq" style={{ position: "absolute", left: 120, top: 390 }}><Cartao em={d.bom.em} sfx="ding" titulo="crie só a tela de login" cor={colors.green} icone="✓" w={1050} h={130} size={50} /></Desliza>
    <Desliza em={d.ex1.em} de="dir" style={{ position: "absolute", left: 120, top: 600 }}><Cartao em={d.ex1.em} titulo="explique o que esse projeto faz" cor={CIANO} w={1250} h={110} size={44} /></Desliza>
    <Desliza em={d.ex2.em} de="dir" style={{ position: "absolute", left: 120, top: 750 }}><Cartao em={d.ex2.em} titulo="crie testes para esta função" cor={colors.gold} w={1250} h={110} size={44} /></Desliza>
    <Pant pose={pose ?? "feliz"} x={1660} y={640} w={420} em={10} />
  </>
);

// ---------- 27. plano B ----------
export const PlanoBIntro = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.55} />
    <Faiscas169 n={14} />
    <Texto em={d.a.em} y={110} size={92} rot={-1} color="#fff" fundo={colors.red}>Computador fraco?</Texto>
    <Texto em={d.b.em} y={310} size={190} rot={-2} color="#140B2E" fundo={colors.gold}>Plano B</Texto>
    <Texto em={d.c.em} y={580} size={110} rot={1} fundo={colors.violet}>OpenRouter</Texto>
    <Pop em={d.d.em} style={{ position: "absolute", left: 0, right: 0, top: 780, display: "flex", justifyContent: "center" }}><Pilula cor="#0D1117" texto="#fff" size={52} style={{ border: `3px solid ${CIANO}` }}>modelos grátis na nuvem</Pilula></Pop>
    <Pant pose={pose ?? "pensando"} x={1700} y={700} w={420} em={10} />
  </>
);

// ---------- 28. OpenRouter: site, conta, chave ----------
const TelaChaves = ({ frame, d }) => (
  <AbsoluteFill style={{ background: "#fafafa", fontFamily: "Arial, sans-serif" }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 360, background: "#fff", borderRight: "1px solid #e5e7eb", padding: "40px 36px", fontSize: 34, color: "#444" }}>
      <div style={{ fontWeight: 700, color: "#111", fontSize: 38, marginBottom: 30 }}>Settings</div>
      {["Credits", "Activity", "Keys", "Preferences"].map((x) => <div key={x} style={{ padding: "14px 18px", borderRadius: 10, marginBottom: 6, background: x === "Keys" ? "#eef2ff" : "transparent", color: x === "Keys" ? "#4338ca" : "#444", fontWeight: x === "Keys" ? 700 : 400 }}>{x}</div>)}
    </div>
    <div style={{ position: "absolute", left: 420, top: 50, right: 50 }}>
      <div style={{ fontSize: 50, fontWeight: 700, color: "#111" }}>API Keys</div>
      <div style={{ marginTop: 26, display: "inline-block", padding: "16px 40px", borderRadius: 12, background: frame >= d.chave.em ? "#c7d2fe" : "#4f46e5", color: frame >= d.chave.em ? "#312e81" : "#fff", fontSize: 32, fontWeight: 700 }}>Create Key</div>
      {frame >= d.chave.em + 24 ? (
        <Pop em={d.chave.em + 24} sfx="ding" style={{ marginTop: 34, border: "2px solid #e5e7eb", borderRadius: 16, background: "#fff", padding: "26px 34px" }}>
          <div style={{ fontSize: 28, color: "#6b7280" }}>Sua chave</div>
          <div style={{ fontFamily: MONO, fontSize: 38, color: "#111", marginTop: 8 }}>sk-or-v1-••••••••••••••••••••</div>
          <div style={{ display: "inline-block", marginTop: 16, padding: "10px 26px", borderRadius: 10, background: frame >= d.copie.em ? colors.green : "#eef2ff", color: frame >= d.copie.em ? "#fff" : "#4338ca", fontSize: 28, fontWeight: 700 }}>{frame >= d.copie.em ? "Copiada" : "Copy"}</div>
        </Pop>
      ) : null}
    </div>
  </AbsoluteFill>
);

export const NavegadorOpenRouter = ({ slug, d, pose }) => {
  const frame = useCurrentFrame();
  const fase = frame >= d.set.em ? 2 : 1;
  const signup = naTela(1523, 28);
  const url = fase === 1 ? "openrouter.ai" : "openrouter.ai/settings/keys";
  return (
    <>
      <FundoMarca />
      <Navegador x={NAV.x} y={NAV.y} w={NAV.w} h={NAV.h} url={url} em={0}>
        {fase === 1 ? <Print slug={slug} arq="openrouter-free.png" /> : <TelaChaves frame={frame} d={d} />}
      </Navegador>
      {fase === 1 ? <div style={{ position: "absolute", left: signup.x - 60, top: signup.y - 24, width: 160, height: 52, borderRadius: 12, border: `4px solid ${colors.gold}`, boxShadow: `0 0 30px ${colors.gold}`, opacity: frame >= d.conta.em ? 1 : 0 }} /> : null}
      {fase === 2 && frame >= d.guarde.em ? <Pop em={d.guarde.em} sfx="error" style={{ position: "absolute", left: 1000, top: 770 }}><Pilula cor="#2A1020" texto="#fff" size={40} style={{ border: `3px solid ${colors.red}` }}>Trate como senha: não compartilhe</Pilula></Pop> : null}
      <Cursor pontos={[{ f: 6, x: 1500, y: 700 }, { f: d.conta.em, x: signup.x, y: signup.y }, { f: d.set.em + 10, x: 600, y: 340 }, { f: d.chave.em - 6, x: 640, y: 330 }, { f: d.copie.em - 4, x: 700, y: 560 }]} cliques={[d.conta.em + 4, d.chave.em, d.copie.em]} />
    </>
  );
};

// ---------- 29. variáveis de ambiente ----------
export const TerminalEnv = ({ d, pose }) => (
  <Palco pose={pose} panta={false}>
    <div style={{ position: "absolute", left: 90, top: 50 }}>
      <Term titulo="Terminal — Mac/Linux" w={1740} h={430} size={31} linhas={[
        { t: "cmd", text: 'export ANTHROPIC_BASE_URL="https://openrouter.ai/api"', em: d.u.em, cpf: 1.3 },
        { t: "cmd", text: 'export ANTHROPIC_AUTH_TOKEN="sua-chave-aqui"', em: d.k.em, cpf: 1.3 },
        { t: "cmd", text: 'export ANTHROPIC_API_KEY=""', em: d.v.em, cpf: 1.3 },
      ]} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 520 }}>
      <Term titulo="PowerShell" w={1740} h={290} size={28} fundo="#012456" barra="#0b3a82" prompt="PS> " promptCor="#FFD43B" em={d.ps.em - 6} linhas={[
        { t: "cmd", text: '$env:ANTHROPIC_BASE_URL = "https://openrouter.ai/api"', em: d.ps.em, cpf: 1.2 },
        { t: "dim", text: "# no PowerShell: $env: antes do nome" },
      ]} />
    </div>
    <Pant pose={pose ?? "pensando"} x={1780} y={870} w={240} em={d.ps.em} />
  </Palco>
);

// ---------- 30. rodar com o modelo free ----------
export const TerminalFree = ({ d, pose }) => (
  <Palco pose={pose} panta={false}>
    <div style={{ position: "absolute", left: 90, top: 70 }}>
      <Term titulo="Terminal" w={1200} h={520} size={34} linhas={[
        { t: "cmd", text: "claude --model openrouter/free", em: d.a.em },
        { t: "ok", text: "✻ Welcome to Claude Code!", em: d.esc.em },
        { t: "out", text: "modelo: openrouter/free" },
      ]} />
    </div>
    <Pop em={d.ok.em} sfx="coin" style={{ position: "absolute", left: 1350, top: 110 }}><Cartao em={d.ok.em} sfx={null} titulo="Testei aqui" sub="funcionou" cor={colors.green} icone="✓" w={470} h={150} size={46} /></Pop>
    <Pop em={d.aviso.em} sfx="error" style={{ position: "absolute", left: 90, top: 640 }}>
      <div style={{ borderRadius: 30, border: `4px solid ${colors.gold}`, background: "#2a2310", padding: "26px 36px", width: 1380 }}>
        <div style={{ ...FONT, textAlign: "left", textTransform: "none", fontSize: 44, color: colors.gold }}>Atenção: o OpenRouter só garante modelos da Anthropic</div>
        <div style={{ ...FONT, textAlign: "left", textTransform: "none", fontSize: 38, color: "#fff", marginTop: 8 }}>Aqui pode dar erro. É o plano B.</div>
      </div>
    </Pop>
    <Pant pose={pose ?? "pensando"} x={1700} y={820} w={330} em={d.aviso.em} />
  </Palco>
);

// ---------- 31. limites ----------
export const Limites = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.74} />
    <Linha y={30}><Texto em={2} y={0} size={86} rot={-1} color="#fff" fundo={colors.red}>Cuidados importantes</Texto></Linha>
    <Desliza em={d.a.em} de="esq" style={{ position: "absolute", left: 110, top: 190 }}><Cartao em={d.a.em} sfx="error" titulo="Teste mais de um modelo" sub="cada um tem o seu jeito" cor={colors.gold} icone="1" w={1100} h={150} size={54} /></Desliza>
    <Desliza em={d.b.em} de="esq" style={{ position: "absolute", left: 110, top: 370 }}><Cartao em={d.b.em} sfx="error" titulo="Limite diário de pedidos" sub="grátis na nuvem · modelos grandes do Ollama são cobrados por uso" cor={colors.gold} icone="2" w={1600} h={150} size={54} /></Desliza>
    <Desliza em={d.c.em} de="esq" style={{ position: "absolute", left: 110, top: 550 }}><Cartao em={d.c.em} sfx="error" titulo="O provedor pode registrar" sub="nunca mande senha, chave ou código de cliente" cor={colors.red} icone="3" w={1300} h={150} size={54} /></Desliza>
    <Desliza em={d.loc.em} de="esq" style={{ position: "absolute", left: 110, top: 750 }}><Cartao em={d.loc.em} sfx="coin" titulo="Modelo local: isso não acontece" cor={colors.green} icone="✓" w={1100} h={130} size={50} /></Desliza>
    <Sequence from={0} durationInFrames={d.loc.em} layout="none"><Pant pose="triste" x={1650} y={500} w={400} em={10} /></Sequence>
    <Sequence from={d.loc.em} layout="none"><Pant pose="feliz" x={1650} y={500} w={400} em={0} /></Sequence>
  </>
);

// ---------- 32. voltar ao Claude normal ----------
export const VoltarAoNormal = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.72} />
    <Faiscas169 n={10} />
    <div style={{ position: "absolute", left: 160, top: 220 }}>
      <Term titulo="Terminal" w={1250} h={330} size={40} linhas={[
        { t: "cmd", text: "claude", em: d.b.em },
        { t: "ok", text: "Entre com a sua conta Claude", em: d.conta.em },
      ]} />
    </div>
    <Pop em={d.a.em} style={{ position: "absolute", left: 160, top: 620 }}><Pilula cor="#0D1117" texto="#fff" size={46} style={{ border: `3px solid ${LARANJA}` }}>sem o <span style={{ fontFamily: MONO, color: colors.gold }}>ollama launch</span></Pilula></Pop>
    <Pant pose={pose ?? "feliz"} x={1660} y={640} w={420} em={10} />
  </>
);

// ---------- 33. resumo ----------
export const Resumo = ({ slug, d, pose }) => (
  <>
    <Fundo slug={slug} src={d.bg} dur={d.bgDur} escurecer={0.74} />
    <Faiscas169 n={18} />
    <Linha y={40}><Texto em={2} y={0} size={86} rot={-1}>Resumindo</Texto></Linha>
    {d.itens.map((it, i) => <Desliza key={i} em={it.em} de="esq" style={{ position: "absolute", left: 150, top: 200 + i * 135 }}><Cartao em={it.em} titulo={it.t} cor={[CIANO, LARANJA, colors.violetLight, colors.green][i]} icone="✓" w={1000} h={110} size={48} /></Desliza>)}
    <Texto em={d.zero.em} y={740} size={96} rot={-2} color="#06281c" fundo={colors.green} lado={160}>R$ 0 de assinatura</Texto>
    <Pant pose={pose ?? "comemorando"} x={1640} y={560} w={440} em={10} />
  </>
);
