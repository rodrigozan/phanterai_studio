#!/usr/bin/env node
// Zanathos Cap. 1: sound design sintetizado com ffmpeg (drone, batidas, cliques, tons, marimba). Sem API, sem custo.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const DIR = "public/rodzandonadi/episodes/zanathos-cap1/audio/som";
fs.mkdirSync(DIR, { recursive: true });
const gen = (nome, expr, d, af = "") => {
  const args = ["-y", "-loglevel", "error", "-f", "lavfi", "-i", `aevalsrc=${expr}:d=${d}:s=44100:c=mono`];
  if (af) args.push("-af", af);
  args.push("-c:a", "libmp3lame", "-b:a", "160k", `${DIR}/${nome}.mp3`);
  execFileSync("ffmpeg", args);
};
const drone = "0.34*sin(2*PI*55*t)+0.22*sin(2*PI*55.45*t)+0.14*sin(2*PI*82.4*t)+0.07*sin(2*PI*110.3*t)*(0.6+0.4*sin(2*PI*0.07*t))+0.04*sin(2*PI*164.8*t+sin(2*PI*0.05*t))";
gen("drone", `'${drone}'`, 115, "lowpass=f=420,afade=t=in:d=2.5,afade=t=out:st=111:d=4,volume=0.9");
gen("batida", "'0.95*sin(2*PI*(42*t+85*(1-exp(-14*t))/14))*exp(-t*6.5)+0.12*(random(0)-0.5)*exp(-t*120)'", 1.0, "lowpass=f=900");
gen("batida-longa", "'0.95*sin(2*PI*(42*t+85*(1-exp(-12*t))/12))*exp(-t*1.6)+0.1*(random(0)-0.5)*exp(-t*100)'", 3.2, "lowpass=f=700,afade=t=out:st=2.4:d=0.8");
gen("clique", "'0.55*(sin(2*PI*3100*t)+0.6*sin(2*PI*5370*t)+0.4*sin(2*PI*7210*t))*exp(-t*55)'", 0.3);
gen("clique-seco", "'0.6*(sin(2*PI*3300*t)+0.5*sin(2*PI*5900*t))*exp(-t*95)+0.1*(random(0)-0.5)*exp(-t*300)'", 0.2);
gen("oco", "'0.9*sin(2*PI*150*t*exp(-t*2.5))*exp(-t*13)'", 0.6, "lowpass=f=500");
gen("pulso", "'0.9*sin(2*PI*68*t)*exp(-t*4.5)*(1-exp(-t*60))'", 1.0, "lowpass=f=300");
const tom = (nome, hz, dec = 3.2, d = 1.4) => gen(nome, `'0.5*sin(2*PI*${hz}*t)*exp(-t*${dec})*(1-exp(-t*90))+0.12*sin(2*PI*${hz * 2}*t)*exp(-t*${dec * 1.6})*(1-exp(-t*90))'`, d);
[196, 233, 262, 294, 330, 392, 440].forEach((hz, i) => tom(`tom${i + 1}`, hz));
const mar = (nome, hz) => gen(nome, `'0.6*sin(2*PI*${hz}*t)*exp(-t*5)*(1-exp(-t*300))+0.25*sin(2*PI*${hz * 4}*t)*exp(-t*22)'`, 1.8);
[[ "mar1", 261.63 ], [ "mar2", 293.66 ], [ "mar3", 329.63 ], [ "mar4", 392.0 ], [ "mar5", 440.0 ], [ "mar6", 523.25 ]].forEach(([n, h]) => mar(n, h));
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "anoisesrc=d=1.6:c=pink:r=44100", "-af", "bandpass=f=700:w=500,afade=t=in:d=0.8,afade=t=out:st=0.9:d=0.7,volume=0.5", `${DIR}/vento.mp3`]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "anoisesrc=d=0.9:c=white:r=44100", "-af", "highpass=f=1500,afade=t=in:d=0.05,afade=t=out:st=0.1:d=0.8,volume=0.45", `${DIR}/clarao.mp3`]);
console.log(fs.readdirSync(DIR).join(" "));
