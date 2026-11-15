/* WOD: cronómetro por formato (AMRAP, For Time, EMOM, Tabata) con rondas y registro */
const WOD_FMT={
  amrap:{n:"AMRAP",d:"Tantas rondas como puedas en un tiempo fijo."},
  fortime:{n:"For Time",d:"Terminar el trabajo lo antes posible."},
  emom:{n:"EMOM",d:"Cada minuto, un bloque de trabajo y descansas lo que sobre."},
  tabata:{n:"Tabata / intervalos",d:"Trabajo y descanso en tandas cortas."}
};
const WOD_PRE=[
  {id:"fran",n:"Fran",fmt:"fortime",bid:"fran",mov:"21-15-9\nThrusters (43 kg / 29 kg)\nDominadas"},
  {id:"cindy",n:"Cindy",fmt:"amrap",min:20,bid:"cindy",mov:"5 dominadas\n10 flexiones\n15 sentadillas"},
  {id:"grace",n:"Grace",fmt:"fortime",bid:"grace",mov:"30 envíos de barra por encima de la cabeza (61 kg / 43 kg)"},
  {id:"helen",n:"Helen",fmt:"fortime",bid:"helen",mov:"3 rondas\n400 m de carrera\n21 swings con kettlebell\n12 dominadas"},
  {id:"karen",n:"Karen",fmt:"fortime",bid:"karen",mov:"150 wall balls"},
  {id:"annie",n:"Annie",fmt:"fortime",bid:"annie",mov:"50-40-30-20-10\nComba doble\nAbdominales"},
  {id:"emom10",n:"EMOM 10 minutos",fmt:"emom",min:10,mov:"Minuto impar: 10 swings con kettlebell\nMinuto par: 8 flexiones"},
  {id:"amrap12",n:"AMRAP 12 minutos",fmt:"amrap",min:12,mov:"10 sentadillas con salto\n8 dominadas o remo\n6 burpees"},
  {id:"tabata",n:"Tabata clásico",fmt:"tabata",workS:20,restS:10,rds:8,mov:"Elige un ejercicio: sentadilla en el aire, burpees o remo en ergómetro"}
];
function wodNew(o){return Object.assign({step:"setup",fmt:"amrap",min:10,workS:20,restS:10,rds:8,cap:0,name:"",bid:null,mov:"",rounds:0,reps:"",res:"",t0:0,cd:10,last:"",endT:0},o||{});}
function wodCalc(w,now){
  const el=(now-w.t0)/1000-w.cd;
  if(el<0)return {ph:"cd",left:Math.ceil(-el),key:"cd"+Math.ceil(-el),big:String(Math.ceil(-el)),lab:"Preparados",pct:100*(-el)/w.cd};
  if(w.fmt==="amrap"){const tot=w.min*60;const left=Math.max(0,tot-el);return {ph:left<=0?"end":"run",key:left<=0?"end":(left<=3?"t"+Math.ceil(left):"run"),big:fmtT(Math.ceil(left)),lab:"Rondas: "+w.rounds,pct:100*left/tot,el:Math.min(el,tot)};}
  if(w.fmt==="fortime"){const capS=w.cap*60;const end=capS>0&&el>=capS;return {ph:end?"end":"run",key:end?"end":"run",big:fmtT(Math.floor(Math.min(el,capS||el))),lab:capS?"Límite "+fmtT(capS)+" · rondas: "+w.rounds:"Rondas: "+w.rounds,pct:capS?100*(1-el/capS):100,el:capS?Math.min(el,capS):el};}
  if(w.fmt==="emom"){const tot=w.min*60;if(el>=tot)return {ph:"end",key:"end",big:"0:00",lab:"Terminado",pct:0,el:tot};const m=Math.floor(el/60);const s=Math.ceil(60-(el%60));return {ph:"run",key:"m"+m,big:fmtT(s===60?60:s),lab:"Minuto "+(m+1)+" de "+w.min,pct:100*(1-(el%60)/60),el};}
  const cyc=w.workS+w.restS,tot=cyc*w.rds;if(el>=tot)return {ph:"end",key:"end",big:"0:00",lab:"Terminado",pct:0,el:tot};
  const r=Math.floor(el/cyc),c=el%cyc,work=c<w.workS;const left=Math.ceil((work?w.workS:cyc)-c);
  return {ph:"run",key:"r"+r+(work?"w":"d"),big:fmtT(left),lab:(work?"TRABAJO":"DESCANSO")+" · ronda "+(r+1)+" de "+w.rds,pct:100*(1-(c-(work?0:w.workS))/(work?w.workS:w.restS)),work,el};
}
let _wodWl=null;
function wodWake(on){try{if(on&&"wakeLock" in navigator&&!_wodWl){navigator.wakeLock.request("screen").then(l=>{_wodWl=l;l.addEventListener("release",()=>{if(_wodWl===l)_wodWl=null;});}).catch(()=>{});}
  else if(!on&&_wodWl){const l=_wodWl;_wodWl=null;l.release().catch(()=>{});}}catch(e){}}
function wodTick(){
  const w=UI.wod;if(!w||w.step!=="run")return;const c=wodCalc(w,Date.now());
  if(c.key!==w.last){const first=w.last==="";w.last=c.key;if(!first){try{navigator.vibrate&&navigator.vibrate(c.ph==="end"?[300,120,300]:[120]);}catch(e){}if(typeof beep==="function"&&(c.ph==="end"||/^(m|r|run)/.test(c.key)||/^t/.test(c.key)))beep();}}
  if(c.ph==="end"){w.step="done";w.endT=c.el||0;if(w.fmt==="fortime"&&!w.res)w.res=fmtT(Math.round(w.endT));wodWake(false);render();return;}
  const b=document.getElementById("wod_t"),l=document.getElementById("wod_l"),i=document.getElementById("wod_i");
  if(b)b.textContent=c.big;if(l)l.textContent=c.lab;if(i)i.style.width=Math.max(0,Math.min(100,c.pct))+"%";
  const box=document.getElementById("wod_box");if(box)box.style.borderColor=c.work===false?"var(--ok,#6a9)":"";
}
setInterval(wodTick,250);
function wodView(p){
  const g=G(p);const w=UI.wod||(UI.wod=wodNew());
  const back=(lab,act)=>`<div class="row between"><h1>${lab}</h1><button class="btn ghost sm" data-a="${act}">${act==="wodExit"?"Salir":"Volver"}</button></div>`;
  if(w.step==="run"){
    const c=wodCalc(w,Date.now());const rnd=(w.fmt==="amrap"||w.fmt==="fortime");
    return `<div class="stack">${back(esc(w.name||WOD_FMT[w.fmt].n),"wodExit")}
    <div class="card stack" id="wod_box" style="text-align:center"><span class="lbl">${WOD_FMT[w.fmt].n}</span>
      <div class="num" id="wod_t" style="font-size:72px;line-height:1.05;font-weight:700">${c.big}</div>
      <div class="small muted" id="wod_l">${c.lab}</div>
      <div class="bar"><i id="wod_i" style="width:${Math.max(0,Math.min(100,c.pct))}%"></i></div></div>
    ${rnd?`<button class="btn pri wide" style="min-height:64px;font-size:20px" data-a="wodRound">+1 ronda (${w.rounds})</button>
    <div class="row between"><button class="btn" data-a="wodUndo">−1</button>${w.fmt==="fortime"?`<button class="btn pri" data-a="wodStop">Terminé</button>`:`<span></span>`}</div>`:`<div class="row between"><span></span><button class="btn" data-a="wodStop">Terminar ya</button></div>`}
    ${w.mov?`<div class="card stack"><span class="lbl">Trabajo</span><div style="white-space:pre-line">${esc(w.mov)}</div></div>`:""}</div>`;
  }
  if(w.step==="done"){
    const am=w.fmt==="amrap",ft=w.fmt==="fortime";
    return `<div class="stack">${back("Resultado","wodExit")}
    <div class="card stack"><span class="lbl acc">${esc(w.name||WOD_FMT[w.fmt].n)}</span>
    ${am?`<p>Rondas completas: <b>${w.rounds}</b>. Si te quedó una ronda a medias, apunta las repeticiones extra.</p>
      <label class="field"><span>Repeticiones extra (opcional)</span><input class="inp num" type="number" inputmode="numeric" data-wf="reps" value="${esc(w.reps)}"></label>`
    :ft?`<p>Tu tiempo. Corrígelo si paraste tarde el cronómetro.</p>
      <label class="field"><span>Tiempo (mm:ss)</span><input class="inp num" data-wf="res" value="${esc(w.res)}" placeholder="7:30"></label>
      <label class="field"><span>Rondas o series hechas (opcional)</span><input class="inp num" type="number" inputmode="numeric" data-wf="rounds" value="${w.rounds||""}"></label>`
    :`<p>Bloque terminado.</p>`}
    <label class="field"><span>Notas (cargas, escalados, cómo te sentiste)</span><textarea class="inp" rows="2" data-wf="notes">${esc(w.notes||"")}</textarea></label>
    <button class="btn pri wide" data-a="wodSave">Guardar WOD</button></div></div>`;
  }
  const f=WOD_FMT[w.fmt];const last=(g.wods||[]).slice(-5).reverse();
  const num=(k,lab,mn,mx)=>`<label class="field"><span>${lab}</span><input class="inp num" type="number" inputmode="numeric" min="${mn}" max="${mx}" data-wf="${k}" value="${w[k]}"></label>`;
  return `<div class="stack">${back("WOD","pgList")}
  <p class="muted">Cronómetro con cuenta atrás, avisos sonoros y contador de rondas. Guarda el resultado y, si es una marca de referencia, actualiza tu nivel.</p>
  <div class="card stack"><span class="lbl">Entrenos clásicos</span><div class="items">${WOD_PRE.map(x=>`<button class="item" data-a="wodPre" data-id="${x.id}"><span class="nm">${esc(x.n)}</span><span class="q small">${WOD_FMT[x.fmt].n}</span></button>`).join("")}</div></div>
  <div class="card stack" id="wod_build"><span class="lbl">${w.name?"Listo: "+esc(w.name):"O prepara el tuyo"}</span>
    <div class="field"><span>Formato</span><div class="seg">${Object.entries(WOD_FMT).map(([k,v])=>`<button class="${w.fmt===k?"on":""}" data-a="wodFmt" data-v="${k}">${({amrap:"AMRAP",fortime:"Tiempo",emom:"EMOM",tabata:"Tabata"})[k]}</button>`).join("")}</div><span class="hint">${f.d}</span></div>
    ${w.fmt==="amrap"||w.fmt==="emom"?num("min","Minutos",1,90):""}
    ${w.fmt==="fortime"?num("cap","Límite de tiempo en minutos (0 = sin límite)",0,90):""}
    ${w.fmt==="tabata"?`<div class="row">${num("workS","Trabajo (s)",5,300)}${num("restS","Descanso (s)",0,300)}${num("rds","Rondas",1,50)}</div>`:""}
    <label class="field"><span>Qué vas a hacer</span><textarea class="inp" rows="4" data-wf="mov" placeholder="Una línea por ejercicio">${esc(w.mov)}</textarea></label>
    <button class="btn pri wide" data-a="wodGo">Empezar (cuenta atrás de ${w.cd} s)</button></div>
  ${last.length?`<div class="card stack"><span class="lbl">Últimos WOD</span>${last.map(x=>`<div class="row between small"><span>${fdate(x.date)} · ${esc(x.name)}</span><b>${esc(x.txt)}</b></div>`).join("")}</div>`:""}</div>`;
}
const _viewProgWod=viewProg;
viewProg=function(p){
  const st=UI.pg;
  if(st&&st.screen==="wod")return wodView(p);
  let h=_viewProgWod(p);
  if(st&&st.screen==="list"){h=h.replace(/(<div class="card stack"><div class="row between"><div><b>Hyrox<\/b>)/,`<div class="card stack"><div class="row between"><div><b>WOD con cronómetro</b><div class="small muted">AMRAP, For Time, EMOM y Tabata con rondas y registro</div></div><button class="btn pri" data-a="wodOpen">Abrir</button></div></div>$1`);}
  if(st&&st.screen==="prog"){h=h.replace(/(<button class="btn sm" data-a="pgBench" data-id="([a-z_0-9]+)">Guardar<\/button>)/g,(m,a,id)=>WOD_PRE.some(x=>x.bid===id)?a+`<button class="btn sm" data-a="wodBench" data-id="${id}">Cronómetro</button>`:a);}
  return h;
};
Object.assign(A,{
  wodOpen:()=>{UI.wod=wodNew();UI.pg={screen:"wod"};render();window.scrollTo(0,0);},
  wodFmt:el=>{UI.wod.fmt=el.dataset.v;if(UI.wod.fmt==="amrap"&&!(UI.wod.min>0))UI.wod.min=10;render();},
  wodPre:el=>{const x=WOD_PRE.find(y=>y.id===el.dataset.id);if(!x)return;UI.wod=wodNew({fmt:x.fmt,min:x.min||10,workS:x.workS||20,restS:x.restS||10,rds:x.rds||8,name:x.n,bid:x.bid||null,mov:x.mov});render();const bl=document.getElementById('wod_build');if(bl)bl.scrollIntoView({block:'start'});},
  wodBench:el=>{const x=WOD_PRE.find(y=>y.bid===el.dataset.id);if(!x)return;UI.wod=wodNew({fmt:x.fmt,min:x.min||10,name:x.n,bid:x.bid,mov:x.mov});UI.pg={screen:"wod"};render();window.scrollTo(0,0);},
  wodGo:()=>{const w=UI.wod;const ok=n=>Number.isFinite(+n);
    if(w.fmt==="tabata"&&(!(w.workS>=5)||!(w.restS>=0)||!(w.rds>=1))){toast("Revisa trabajo, descanso y rondas");return;}
    if((w.fmt==="amrap"||w.fmt==="emom")&&!(w.min>=1)){toast("Pon los minutos");return;}
    if(!ok(w.cap)||w.cap<0)w.cap=0;
    ["min","workS","restS","rds","cap"].forEach(k=>{w[k]=+w[k]||0;});w.step="run";w.t0=Date.now();w.last="";w.rounds=0;w.reps="";w.res="";audioUnlock();wodWake(true);render();window.scrollTo(0,0);},
  wodRound:()=>{const w=UI.wod;w.rounds++;try{navigator.vibrate&&navigator.vibrate(40);}catch(e){}render();},
  wodUndo:()=>{const w=UI.wod;if(w.rounds>0)w.rounds--;render();},
  wodStop:()=>{const w=UI.wod;const c=wodCalc(w,Date.now());w.endT=c.el||0;if(w.fmt==="fortime")w.res=fmtT(Math.round(w.endT));w.step="done";wodWake(false);render();},
  wodExit:()=>{UI.wod=null;wodWake(false);UI.pg={screen:"list"};render();},
  wodSave:()=>{const p=P();const g=G(p);const w=UI.wod;let txt="",rec={date:today(),name:w.name||WOD_FMT[w.fmt].n,fmt:w.fmt,notes:w.notes||"",mov:w.mov};
    if(w.fmt==="amrap"){const ex=parseInt(w.reps)||0;rec.rounds=w.rounds;rec.reps=ex;txt=w.rounds+(ex?" + "+ex:"")+" rondas";if(w.bid&&w.rounds>0)(g.bench=g.bench||[]).push({id:w.bid,v:w.rounds,date:today()});}
    else if(w.fmt==="fortime"){const t=parseTime(w.res);if(!(t>0)){toast("Pon el tiempo, por ejemplo 7:30");return;}rec.t=t;rec.rounds=+w.rounds||0;txt=fmtT(t);if(w.bid&&!(w.cap>0&&t>=w.cap*60))(g.bench=g.bench||[]).push({id:w.bid,v:t,date:today()});}
    else{rec.min=w.min;txt=w.fmt==="emom"?w.min+" min":w.rds+"×"+w.workS+"/"+w.restS+" s";}
    rec.txt=txt;(g.wods=g.wods||[]).push(rec);if(g.wods.length>300)g.wods=g.wods.slice(-300);
    let extra="";if(w.bid){const b=BENCH.find(x=>x.id===w.bid);const v=rec.t||rec.rounds;if(b&&v)extra=" · "+benchLevel(b,v);}
    UI.wod=null;UI.pg={screen:"list"};commit();toast("WOD guardado: "+txt+extra);window.scrollTo(0,0);}
});
document.addEventListener("input",e=>{const el=e.target.closest("[data-wf]");if(!el||!UI.wod)return;const k=el.dataset.wf;const num=["min","workS","restS","rds","cap"].includes(k);UI.wod[k]=num?(el.value===""?"":+el.value):el.value;});

const _viewEntrenoWod=viewEntreno;
viewEntreno=function(p){if(UI.wod&&UI.wod.step!=="setup"&&!G(p).draft)UI.pg={screen:"wod"};return _viewEntrenoWod(p);};

/* ---- Sesiones de acondicionamiento como circuito con cronómetro ---- */
const WOD_SES_RX=/Acondicionamiento|Metcon|Resistencia|Estaciones|Simulaci/i;
function wodFromSession(id,lvl,i){
  const s=progSessions(id,lvl)[i];if(!s)return null;
  const rds=Math.min(...s.exs.map(x=>x.sets));
  const mov=rds+" rondas\n"+s.exs.map(x=>{const e=EXM[x.ex];const q=e.rep==="m"?x.lo:(Math.round((x.lo+x.hi)/2/5)*5||x.lo);return q+(e.rep==="m"?" m de ":e.rep==="s"?" s de ":" ")+e.name.toLowerCase();}).join("\n");
  return wodNew({fmt:"fortime",name:PROGS[id].n+" · "+s.n,mov,key:`prog:${id}:${lvl}:${i}`});
}
const _viewProgWodSes=viewProg;
viewProg=function(p){
  let h=_viewProgWodSes(p);const st=UI.pg;
  if(st&&st.screen==="prog"&&(st.id==="crossfit"||st.id==="hyrox")){
    const lvl=st.lvl!=null?st.lvl:progLevel(p,st.id);const ses=progSessions(st.id,lvl);
    h=h.replace(/(<button class="btn [^"]*wide" data-a="pgStart" data-i="(\d+)">Empezar<\/button>)/g,(m,a,i)=>ses[+i]&&WOD_SES_RX.test(ses[+i].n)?a+`<button class="btn ghost wide" data-a="wodSes" data-i="${i}">Hacerla en circuito, con cronómetro</button>`:a);
  }
  return h;
};
A.wodSes=el=>{const p=P();const st=UI.pg;const lvl=st.lvl!=null?st.lvl:progLevel(p,st.id);const w=wodFromSession(st.id,lvl,+el.dataset.i);if(!w)return;UI.wod=w;UI.pg={screen:"wod"};render();const bl=document.getElementById('wod_build');if(bl)bl.scrollIntoView({block:'start'});};

/* ---- Progreso de programas, distancias, marcas y WOD ---- */
function progLog(p,id){return (G(p).log||[]).filter(l=>typeof l.mine==="string"&&l.mine.indexOf("prog:"+id+":")===0);}
function exTrend(p,exId){
  const e=EXM[exId];const h=exHistory(p,exId);if(h.length<2)return null;
  let v,u;
  if(e.rep==="m"){v=h.map(x=>x.sets.reduce((a,s)=>a+s.r,0));u="m";}
  else if(e.rep==="s"){v=h.map(x=>Math.max(...x.sets.map(s=>s.r)));u="s";}
  else if(h.some(x=>x.sets.some(s=>s.w>0))){v=h.map(x=>bestE1(x.sets));u="kg est.";}
  else{v=h.map(x=>Math.max(...x.sets.map(s=>s.r)));u="reps";}
  return {id:exId,n:h.length,v,u,ch:v[0]>0?(v[v.length-1]-v[0])/v[0]*100:null};
}
function trendRow(r){return `<div class="item"><span class="nm">${esc(EXM[r.id].name)}<span class="small muted"> · ${r.n} sesiones</span></span><span class="q row" style="gap:10px">${spark(r.v)}<span class="num small ${r.ch>0?"good":r.ch<0?"bad":""}">${nf(r.v[r.v.length-1],r.u==="kg est."?1:0)} ${r.u}</span></span></div>`;}
function benchRows(p,filter){
  const g=G(p);return BENCH.filter(filter).map(b=>{const l=(g.bench||[]).filter(x=>x.id===b.id);if(!l.length)return "";
    const best=benchBest(g,b.id);const last=l[l.length-1];const f=v=>b.u==="r"?v+" rondas":fmtT(v);
    const vals=l.map(x=>b.u==="r"?x.v:-x.v);
    return `<div class="item"><span class="nm">${esc(b.n)}<span class="small muted"> · ${l.length} ${l.length===1?"vez":"veces"} · mejor ${f(best.v)}</span></span><span class="q row" style="gap:10px">${spark(vals)}<span class="num small">${f(last.v)}</span></span></div>`;}).join("");
}
function progProgressCard(p,id){
  const lg=progLog(p,id);const g=G(p);const br=benchRows(p,b=>b.prog===id);
  const wl=(g.wods||[]).filter(w=>w.name.indexOf(PROGS[id].n+" · ")===0);
  if(!lg.length&&!br&&!wl.length)return `<div class="card stack"><span class="lbl">Tu progreso</span><p class="muted">Aún no hay sesiones de este programa. En cuanto hagas dos, aquí verás cómo evolucionas.</p></div>`;
  const ws=weekStart(today());const wk=[];for(let i=7;i>=0;i--){const a=addDays(ws,-7*i);wk.push(lg.filter(l=>weekStart(l.date)===a).length);}
  const ids=[...new Set(lg.flatMap(l=>l.exs.map(e=>e.ex)))].filter(x=>EXM[x]);
  const tr=ids.map(x=>exTrend(p,x)).filter(Boolean).sort((a,b)=>b.n-a.n).slice(0,8);
  return `<div class="card stack"><span class="lbl">Tu progreso</span>
  <div class="grid3"><div class="stat"><span class="lbl">Sesiones</span><div class="v">${lg.length}</div><div class="d">${lg.length?"desde "+fdate(lg[0].date):"—"}</div></div>
  <div class="stat"><span class="lbl">Esta semana</span><div class="v">${wk[7]}</div><div class="d">sesiones</div></div>
  <div class="stat"><span class="lbl">8 semanas</span><div class="v" style="line-height:1">${spark(wk)||"—"}</div><div class="d">constancia</div></div></div>
  ${tr.length?`<div class="items">${tr.map(trendRow).join("")}</div><p class="hint">Metros: total de la sesión. Segundos y repeticiones: tu mejor serie. Con peso: fuerza estimada.</p>`:`<p class="small muted">Repite una sesión y aquí aparece la evolución de cada ejercicio.</p>`}
  ${br?`<span class="lbl">Marcas</span><div class="items">${br}</div>`:""}
  ${wl.length?`<span class="lbl">Circuitos con cronómetro</span>${wl.slice(-4).reverse().map(x=>`<div class="row between small"><span>${fdate(x.date)} · ${esc(x.name.split(" · ")[1]||x.name)}</span><b>${esc(x.txt)}</b></div>`).join("")}`:""}
  </div>`;
}
const _viewProgProgress=viewProg;
viewProg=function(p){
  let h=_viewProgProgress(p);const st=UI.pg;
  if(st&&st.screen==="prog"){const mk='<div class="card stack"><span class="lbl">Qué necesitas</span>';if(h.includes(mk))h=h.replace(mk,progProgressCard(p,st.id)+mk);}
  return h;
};
const _gymProgresoProg=gymProgreso;
gymProgreso=function(p){
  let h=_gymProgresoProg(p);const g=G(p);
  const ids=[...new Set((g.log||[]).flatMap(l=>l.exs.map(e=>e.ex)))].filter(isDist);
  const tr=ids.map(x=>exTrend(p,x)).filter(Boolean).sort((a,b)=>b.n-a.n);
  const br=benchRows(p,()=>true);const wl=(g.wods||[]).slice(-6).reverse();
  let add="";
  if(tr.length)add+=`<div class="card"><span class="lbl">Carrera y distancias</span><div class="items">${tr.map(trendRow).join("")}</div><p class="hint" style="margin-top:8px">Metros totales por sesión en cada ejercicio.</p></div>`;
  if(br)add+=`<div class="card"><span class="lbl">Marcas de referencia</span><div class="items">${br}</div></div>`;
  if(wl.length)add+=`<div class="card stack"><span class="lbl">Últimos WOD</span>${wl.map(x=>`<div class="row between small"><span>${fdate(x.date)} · ${esc(x.name)}</span><b>${esc(x.txt)}</b></div>`).join("")}</div>`;
  if(!add)return h;const i=h.lastIndexOf("</div>");return h.slice(0,i)+add+h.slice(i);
};
