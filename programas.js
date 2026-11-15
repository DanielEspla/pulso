/* ===== Valoración de nivel, cargas de partida y programas por disciplina ===== */
const LVL_NAMES=["Principiante","Novato","Intermedio","Avanzado","Élite"];
/* Referencias orientativas (peso levantado / peso corporal) de la comunidad de fuerza, no un estándar científico */
const STD_M={sq:[0.75,1.25,1.7,2.15,2.6],bn:[0.6,0.95,1.3,1.65,2.0],dl:[1.0,1.5,2.05,2.6,3.1]};
const STD_SEXF={sq:0.8,bn:0.6,dl:0.8};
const LIFTS=[["sq","Sentadilla con barra"],["bn","Press banca"],["dl","Peso muerto"]];

/* ---- Cálculo de nivel ---- */
function epley(w,r){return w>0&&r>0?w*(1+Math.min(r,12)/30):0;}
function liftLevel(k,e1,bw,sex){
  if(!e1||!bw)return null;const f=sex==="M"?STD_SEXF[k]:1;const ratio=e1/bw;
  const th=STD_M[k].map(x=>x*f);let lv=0;th.forEach((t,i)=>{if(ratio>=t)lv=i;});
  if(ratio<th[0])lv=0;
  /* posición fraccionaria dentro del tramo para la nota media */
  const nxt=th[Math.min(4,lv+1)];const frac=lv>=4?0:clamp((ratio-th[lv])/(nxt-th[lv]),0,0.99);
  return {lv,ratio,pos:lv+frac};
}
function nivelFromPos(pos){return pos<1?"principiante":pos<2.5?"intermedio":"avanzado";}
function valCompute(p,inp){
  const bw=+inp.bw||currentWeight(p)||p.peso0||0;const sex=p.sexo;
  const out={bw,e1:{},lv:{},date:today()};const poss=[];
  LIFTS.forEach(([k])=>{const w=+inp[k+"_w"],r=+inp[k+"_r"];if(w>0&&r>0){out.e1[k]=Math.round(epley(w,r)*10)/10;const l=liftLevel(k,out.e1[k],bw,sex);if(l){out.lv[k]=l;poss.push(l.pos);}}});
  out.pull=+inp.pull>=0&&inp.pull!==""?+inp.pull:null;out.push=+inp.push>=0&&inp.push!==""?+inp.push:null;
  out.yrs=inp.yrs||"";
  if(poss.length){out.pos=poss.reduce((a,b)=>a+b,0)/poss.length;out.nivel=nivelFromPos(out.pos);}
  else{out.nivel=({"0":"principiante","1":"intermedio","2":"intermedio","3":"avanzado"})[inp.yrs]||"intermedio";out.pos=null;}
  /* calistenia */
  const pl=out.pull==null?0:out.pull,ph=out.push==null?0:out.push;
  out.cali=(pl<3||ph<10)?1:(pl>=10&&ph>=30)?3:2;
  return out;
}

/* ---- Pesos de partida a partir de las marcas ---- */
function e1Anchor(g,k){
  const m=g.marks&&g.marks.e1;if(!m)return null;
  if(k==="sq")return m.sq||(m.dl?m.dl*0.8:null);
  if(k==="bn")return m.bn||null;
  if(k==="dl")return m.dl||(m.sq?m.sq*1.2:null);
  return null;
}
function startFactor(ex){
  const r=new Set(ex.req||[]);const id=ex.id;
  if(ex.inc===0||ex.rep==="s"||ex.rep==="m")return null;
  switch(ex.pat){
    case "sentadilla":
      if(id==="sentadilla")return ["sq",1];if(id==="sentadilla_frontal")return ["sq",0.8];if(id==="sentadilla_smith")return ["sq",0.9];
      if(/prensa/.test(id))return ["sq",1.2];if(id==="hack"||id==="pendulo")return ["sq",0.8];if(/goblet|kettlebell/.test(id))return ["sq",0.3];return null;
    case "zancada":return r.has("mancuernas")?["sq",0.2]:r.has("barra")?["sq",0.5]:null;
    case "bisagra":
      if(id==="peso_muerto")return ["dl",1];if(id==="peso_muerto_hex")return ["dl",0.9];if(id==="peso_muerto_rumano")return ["dl",0.65];
      if(id==="peso_muerto_rumano_mancuernas")return ["dl",0.3];if(id==="rumano_unilateral")return ["dl",0.2];return null;
    case "empuje_h":
      if(id==="press_banca")return ["bn",1];if(id==="press_banca_inclinado")return ["bn",0.8];if(id==="press_smith_plano")return ["bn",0.9];if(id==="press_smith_inclinado")return ["bn",0.8];
      if(id==="press_cerrado")return ["bn",0.8];
      if(r.has("mancuernas"))return ["bn",/inclinado/.test(id)?0.33:0.38];if(r.has("press_pecho")||r.has("press_pecho_inc"))return ["bn",0.7];return null;
    case "empuje_v":
      if(id==="press_militar")return ["bn",0.6];if(r.has("mancuernas"))return ["bn",0.22];if(r.has("press_hombro"))return ["bn",0.5];if(id==="press_landmine")return ["bn",0.35];return null;
    case "tiron_h":
      if(id==="remo_barra")return ["bn",0.75];if(id==="remo_mancuerna")return ["bn",0.35];if(id==="remo_t")return ["bn",0.6];
      if(r.has("poleas")||r.has("remo_maq"))return ["bn",0.65];return null;
    case "tiron_v":if(id==="jalon"||id==="jalon_neutro")return ["bn",0.65];return null;
  }
  return null;
}
function startEstimate(p,ex,range,rir){
  const g=G(p);if(!g.marks||!g.marks.e1)return null;
  const f=startFactor(ex);if(!f)return null;const a=e1Anchor(g,f[0]);if(!a)return null;
  const e1=a*f[1];const reps=range[1]+(rir||2);
  const w=e1/(1+reps/30)*0.92;const inc=incFor(ex)||2.5;
  const step=inc>=2?inc:0.5;const v=Math.max(step,roundTo(w,step));
  return v;
}
const _suggestProg=suggest;
suggest=function(p,ex,range,rir){
  const h=exHistory(p,ex.id);
  if(!h.length){
    const w=startEstimate(p,ex,range,rir);
    if(w){const nm=LIFTS.map(([k,t])=>[k,t]).find(x=>x[0]===(startFactor(ex)||[])[0]);
      return {w,txt:`Según tus marcas, empieza hacia ${nf(w,w%1?1:0)} kg. Es una estimación para ${range[0]}-${range[1]} repeticiones con ${rir} en reserva: la primera serie te dice si sube o baja.`};}
  }
  return _suggestProg(p,ex,range,rir);
};
/* El nivel de las marcas pasa a ser el nivel de partida del plan */
const _gymDefaultsProg=gymDefaults;
gymDefaults=function(p){const d=_gymDefaultsProg(p);const m=G(p).marks;if(m&&m.nivel){d.nivel=m.nivel;d.tecnicas=m.nivel!=="principiante";}return d;};

/* ---- Marcas de referencia (CrossFit y Hyrox) ---- */
const BENCH=[
 {id:"fran",prog:"crossfit",n:"Fran",d:"21-15-9: thrusters y dominadas, a tiempo. Rx: 43 kg ellos, 29 kg ellas. Escalado: 25-34 kg y remo invertido.",u:"t",th:[3,6,7]},
 {id:"cindy",prog:"crossfit",n:"Cindy",d:"20 minutos de 5 dominadas, 10 flexiones y 15 sentadillas. Escalado: remo en anillas y flexiones con las manos elevadas.",u:"r",th:[24,19,13]},
 {id:"grace",prog:"crossfit",n:"Grace",d:"30 envíos de barra por encima de la cabeza a tiempo. Rx: 61 kg ellos, 43 kg ellas. Escala el peso hasta poder hacer tandas largas.",u:"t",th:[2,4,5]},
 {id:"helen",prog:"crossfit",n:"Helen",d:"3 rondas: 400 m de carrera, 21 swings y 12 dominadas. Escalado: swings más ligeros y remo invertido.",u:"t",th:[8,10,14]},
 {id:"karen",prog:"crossfit",n:"Karen",d:"150 wall balls a tiempo. Reduce el peso del balón para no parar.",u:"t",th:[5,7,11]},
 {id:"annie",prog:"crossfit",n:"Annie",d:"Descendente 50-40-30-20-10 de comba doble y abdominales. Escala la comba con saltos simples.",u:"t",th:[6,8,10]},
 {id:"hx_ski",prog:"hyrox",n:"SkiErg 1000 m",d:"1000 m a ritmo constante.",u:"s",th:[210,240]},
 {id:"hx_sledpush",prog:"hyrox",n:"Empuje de trineo 50 m",d:"50 m con el peso de tu categoría.",u:"s",th:[40,60]},
 {id:"hx_sledpull",prog:"hyrox",n:"Arrastre de trineo 50 m",d:"50 m con el peso de tu categoría.",u:"s",th:[45,70]},
 {id:"hx_bbj",prog:"hyrox",n:"Burpees con salto largo 80 m",d:"80 m seguidos.",u:"s",th:[240,330]},
 {id:"hx_row",prog:"hyrox",n:"Remo 1000 m",d:"1000 m a ritmo constante.",u:"s",th:[200,230]},
 {id:"hx_farm",prog:"hyrox",n:"Paseo del granjero 200 m",d:"200 m con el peso de tu categoría.",u:"s",th:[90,120]},
 {id:"hx_lunge",prog:"hyrox",n:"Zancadas con saco 100 m",d:"100 m con el peso de tu categoría.",u:"s",th:[270,360]},
 {id:"hx_wb",prog:"hyrox",n:"Wall balls 100 repeticiones",d:"100 repeticiones con el balón de tu categoría.",u:"s",th:[240,330]}
];
function benchLevel(b,v){
  if(b.u==="r"){const t=b.th;return v>=t[0]?"Élite":v>=t[1]?"Avanzado":v>=t[2]?"Intermedio":"Principiante";}
  if(b.u==="t"){const t=b.th;return v<t[0]?"Élite":v<=t[1]?"Avanzado":v<=t[2]?"Intermedio":"Principiante";}
  const t=b.th;return v<t[0]?"Avanzado":v<=t[1]?"Intermedio":"Principiante";
}
function parseTime(s){s=String(s||"").trim().replace(",",".");if(/^\d+:\d{1,2}$/.test(s)){const [m,x]=s.split(":");return +m*60+ +x;}const n=parseFloat(s);return isFinite(n)?n:NaN;}
function fmtT(sec){const m=Math.floor(sec/60),s=Math.round(sec%60);return m+":"+String(s).padStart(2,"0");}
function benchBest(g,id){const l=(g.bench||[]).filter(x=>x.id===id);if(!l.length)return null;const b=BENCH.find(x=>x.id===id);return b.u==="r"?l.reduce((a,x)=>x.v>a.v?x:a):l.reduce((a,x)=>x.v<a.v?x:a);}

/* ---- Datos de programa ---- */
function progParse(str){const [ex,s,rg,rest]=str.split(":");const [lo,hi]=rg.split("-").map(Number);return {ex,sets:+s,lo,hi,rest:+rest||(EXM[ex]&&REST[EXM[ex].rep])||60};}
function progSessions(id,lvl){return (PROG_SES[id][lvl]||[]).map(([n,l],i)=>({i,n,exs:l.map(progParse)}));}
function progLevel(p,id){
  const g=G(p);const saved=g.prog&&g.prog[id]&&g.prog[id].level;if(saved!=null)return saved;
  return progSuggest(p,id);
}
function progSuggest(p,id){
  const m=G(p).marks;if(!m)return 0;
  if(id==="calistenia")return m.cali-1;
  if(id==="fascias")return 0;
  return m.nivel==="avanzado"?2:m.nivel==="intermedio"?1:0;
}
function progDone(p,id,lvl,i){const ws=weekStart(today());const key=`prog:${id}:${lvl}:${i}`;return (G(p).log||[]).some(l=>l.mine===key&&l.date>=ws);}
function progStart(p,id,lvl,i){
  const s=progSessions(id,lvl)[i];if(!s)return;
  mineEnsureSetup(p);
  mineStartDraft(p,`${PROGS[id].n} · ${s.n}`,`prog:${id}:${lvl}:${i}`,s.exs);
}
function exUnitTxt(ex,lo,hi){const u=ex.rep==="m"?"m":ex.rep==="s"?"s":"";return `${lo===hi?lo:lo+"-"+hi}${u?" "+u:""}`;}

/* ---- Pantallas ---- */
function viewProg(p){
  const st=UI.pg;const g=G(p);
  const back=(label,act)=>`<div class="row between"><h1>${label}</h1><button class="btn ghost sm" data-a="${act}">${act==="pgClose"?"Cerrar":"Volver"}</button></div>`;
  if(st.screen==="val"){
    const v=st.v||{};const m=g.marks;
    const lift=([k,t])=>`<div class="mgrid"><label class="field" style="grid-column:span 1"><span>${t}</span><input class="inp num" type="number" inputmode="decimal" data-pv="${k}_w" placeholder="kg" value="${v[k+"_w"]||""}"></label>
      <label class="field"><span>Repeticiones</span><input class="inp num" type="number" inputmode="numeric" data-pv="${k}_r" placeholder="reps" value="${v[k+"_r"]||""}"></label><span></span></div>`;
    return `<div class="stack">${back("Tu nivel","pgList")}
    <p class="muted">Cuéntame lo que levantas. No hace falta que sea tu máximo: pon una serie reciente y dura que hayas hecho bien. Con eso calculo tu nivel y el peso con el que empezar cada ejercicio. Lo que no sepas o no hagas, déjalo vacío.</p>
    <label class="field"><span>Tu peso corporal (kg)</span><input class="inp num" type="number" inputmode="decimal" data-pv="bw" value="${v.bw!=null?v.bw:(currentWeight(p)||p.peso0||"")}"></label>
    <div class="field"><span>¿Cuánto llevas entrenando con pesas en serio?</span><div class="seg">${[["0","Menos de 1 año"],["1","1 a 3"],["2","3 a 5"],["3","Más de 5"]].map(([k,t])=>`<button class="${v.yrs===k?"on":""}" data-a="pgYrs" data-v="${k}">${t}</button>`).join("")}</div></div>
    ${LIFTS.map(lift).join("")}
    <div class="mgrid"><label class="field"><span>Dominadas seguidas</span><input class="inp num" type="number" inputmode="numeric" data-pv="pull" placeholder="reps" value="${v.pull||""}"></label>
    <label class="field"><span>Flexiones seguidas</span><input class="inp num" type="number" inputmode="numeric" data-pv="push" placeholder="reps" value="${v.push||""}"></label><span></span></div>
    ${UI.err?`<p class="err">${esc(UI.err)}</p>`:""}
    <button class="btn pri wide" data-a="pgValDo">Calcular mi nivel</button>
    <p class="small muted">Las referencias son orientativas, de la comunidad de fuerza, y no un estándar científico. Las series de más de 12 repeticiones dan una estimación menos fiable. Si algo te parece raro, ajusta sobre la marcha: la app aprende de tus series reales.</p>
    ${m?`<p class="small muted">Valoración anterior: ${fdate(m.date)}.</p>`:""}</div>`;
  }
  if(st.screen==="res"&&!g.marks)st.screen="list";
  if(st.screen==="res"){const m=g.marks;
    const rows=LIFTS.filter(([k])=>m.e1[k]).map(([k,t])=>`<div class="row between"><span>${t}</span><span><b>${LVL_NAMES[m.lv[k].lv]}</b> <span class="small muted">${nf(m.e1[k],0)} kg estimados · ${nf(m.lv[k].ratio,2)}× tu peso</span></span></div>`).join("");
    return `<div class="stack">${back("Tu nivel","pgList")}
    <div class="card stack"><span class="lbl acc">Resultado</span><h2 style="margin:0">${NIVELES[m.nivel].split(" (")[0]}</h2>
    ${rows||`<p class="muted">Sin marcas en los tres levantamientos: he usado tu experiencia como referencia.</p>`}
    <div class="row between"><span>Calistenia</span><b>${["","Base","Medio","Avanzado"][m.cali]}</b></div></div>
    <div class="card stack"><b>Qué cambia ahora</b><p class="muted">Tu nivel de plan pasa a ser <b>${m.nivel}</b> y los ejercicios sin historial te sugieren un peso de partida según tus marcas, con un margen del 8 % para no pasarte el primer día. Los ejercicios de máquina y de aislamiento los ajustas tú en la primera serie.</p>
    ${g.setup?`<button class="btn pri wide" data-a="pgApplyLevel">Aplicar a mi plan y rehacer la tabla</button>`:`<p class="small muted">Cuando crees tu plan, se usará este nivel.</p>`}
    <button class="btn wide" data-a="pgList">Ver programas por disciplina</button></div></div>`;
  }
  if(st.screen==="prog"){
    const id=st.id;const P0=PROGS[id];const lvl=st.lvl!=null?st.lvl:progLevel(p,id);const rec=progSuggest(p,id);const ses=progSessions(id,lvl);
    const levels=P0.lv.map((t,i)=>`<button class="${lvl===i?"on":""}" data-a="pgLvl" data-v="${i}">${t.split(":")[0]}${g.marks&&i===rec?" ★":""}</button>`).join("");
    const bm=BENCH.filter(b=>b.prog===id);
    return `<div class="stack">${back(P0.n,"pgList")}
    <p class="muted">${P0.lema}.</p>
    <div class="field"><span>Nivel</span><div class="seg">${levels}</div><span class="hint">${P0.lv[lvl]}${g.marks?" · ★ es el que te sugiere tu valoración":""}</span></div>
    <div class="card stack"><span class="lbl">Semana tipo</span>
    ${ses.map(s=>`<div class="card flat stack"><div class="row between"><b>${s.i+1}. ${esc(s.n)}</b>${progDone(p,id,lvl,s.i)?`<span class="pill SUBIR">Hecha</span>`:""}</div>
      <div class="small muted">${s.exs.map(x=>{const e=EXM[x.ex];return esc(e.name)+" "+x.sets+"×"+exUnitTxt(e,x.lo,x.hi);}).join(" · ")}</div>
      <button class="btn ${progDone(p,id,lvl,s.i)?"":"pri"} wide" data-a="pgStart" data-i="${s.i}">Empezar</button></div>`).join("")}</div>
    ${bm.length?`<div class="card stack"><span class="lbl">Tus marcas de referencia</span><p class="small muted">Anota tus resultados y te digo en qué nivel estás. Repítelas cada pocas semanas para ver el progreso.</p>
      ${bm.map(b=>{const best=benchBest(g,b.id);const val=st.bv&&st.bv[b.id]||"";return `<div class="card flat stack"><b>${b.n}</b><div class="small muted">${esc(b.d)}</div>
        ${best?`<div class="small">Mejor: <b>${b.u==="r"?best.v+" rondas":fmtT(best.v)}</b> · ${benchLevel(b,best.v)}</div>`:""}
        <div class="row"><input class="inp num" data-pb="${b.id}" placeholder="${b.u==="r"?"rondas":"mm:ss"}" value="${esc(val)}" style="max-width:120px"><button class="btn sm" data-a="pgBench" data-id="${b.id}">Guardar</button></div></div>`;}).join("")}</div>`:""}
    <div class="card stack"><span class="lbl">Qué necesitas</span><p class="muted">${P0.need}</p></div>
    <div class="card stack"><span class="lbl">Qué respalda este programa</span><p class="muted">${P0.ev}</p></div>
    ${id==="fascias"?`<div class="alert warn"><span class="dot"></span><div><b>Ve despacio</b>El tejido conectivo se adapta lento. No busques dolor: si algo duele de forma aguda o tienes una lesión, consulta antes con un fisioterapeuta.</div></div>`:""}
    </div>`;
  }
  /* lista */
  const m=g.marks;
  return `<div class="stack">${back("Programas","pgClose")}
    <p class="muted">Entrenamientos por disciplina, cada uno con tres niveles. Se hacen con el mismo contador de series, descansos y registro que el resto.</p>
    <div class="card stack"><span class="lbl acc">Tu nivel</span>
      ${m?`<p><b>${NIVELES[m.nivel].split(" (")[0]}</b> · ${LIFTS.filter(([k])=>m.e1[k]).map(([k,t])=>t.split(" ")[0]+" "+LVL_NAMES[m.lv[k].lv].toLowerCase()).join(", ")||"según tu experiencia"}</p>`:`<p class="muted">Dime lo que levantas y la app te reconoce: nivel del plan, y peso de partida en cada ejercicio, sin que empieces desde cero.</p>`}
      <button class="btn ${m?"":"pri"}" data-a="pgVal">${m?"Repetir valoración":"Valorar mi nivel"}</button></div>
    ${Object.entries(PROGS).map(([id,P0])=>`<div class="card stack"><div class="row between"><div><b>${P0.n}</b><div class="small muted">${P0.lema}</div></div><button class="btn" data-a="pgOpen" data-id="${id}">Abrir</button></div></div>`).join("")}
  </div>`;
}
function pgStrip(p){
  return `<div class="card row between"><div><span class="lbl">Programas</span><p>Hyrox, CrossFit, calistenia, paddle surf y fascias, con niveles.</p></div><button class="btn" data-a="pgOpen0">Ver</button></div>`;
}
const _viewEntrenoProg=viewEntreno;
viewEntreno=function(p){
  const g=G(p);
  if(UI.pg&&!g.draft&&!UI.gsum)return `<div class="ob">${viewProg(p)}</div>`;
  let h=_viewEntrenoProg(p);
  if(!UI.gs&&!UI.gsum&&!g.draft&&!UI.mn){
    if(g.setup){const marker=mineStrip(p);if(h.includes(marker))h=h.replace(marker,marker+pgStrip(p));else if(h.includes('<div class="stack">'))h=h.replace('<div class="stack">','<div class="stack">'+pgStrip(p));}
  }
  return h;
};
/* Desde la configuración inicial también se puede valorar el nivel */
const _viewGymSetupProg=viewGymSetup;
viewGymSetup=function(p){
  const h=_viewGymSetupProg(p);
  if(UI.gs&&UI.gs.step===0)return h.replace('<div class="steps">',`<div class="card flat row between"><div><b>¿Ya levantas peso?</b><div class="small muted">Dime tus marcas y empiezas en tu nivel, no desde cero.</div></div><button class="btn" data-a="pgVal0">Valorar mi nivel</button></div><div class="steps">`);
  return h;
};

Object.assign(A,{
  pgOpen0:()=>{const p=P();UI.pg={screen:"list"};UI.gs=null;UI.err=null;UI.view="entreno";commit();window.scrollTo(0,0);},
  pgVal0:()=>{const p=P();UI.gs=null;UI.pg={screen:"val",v:{}};UI.err=null;UI.view="entreno";commit();window.scrollTo(0,0);},
  pgClose:()=>{UI.pg=null;UI.err=null;render();window.scrollTo(0,0);},
  pgList:()=>{UI.pg={screen:"list"};UI.err=null;render();window.scrollTo(0,0);},
  pgVal:()=>{UI.pg={screen:"val",v:{}};UI.err=null;render();window.scrollTo(0,0);},
  pgYrs:el=>{UI.pg.v.yrs=el.dataset.v;render();},
  pgValDo:()=>{const p=P();const v=UI.pg.v||{};
    const anyLift=LIFTS.some(([k])=>+v[k+"_w"]>0&&+v[k+"_r"]>0);
    if(!anyLift&&!v.yrs){UI.err="Pon al menos un levantamiento o dime cuánto llevas entrenando.";render();return;}
    if(!(+v.bw>0)&&!(currentWeight(p)||p.peso0)){UI.err="Necesito tu peso corporal.";render();return;}
    for(const [k] of LIFTS){const w=+v[k+"_w"],r=+v[k+"_r"];if((w>0)!==(r>0)&&(v[k+"_w"]||v[k+"_r"])){UI.err="En cada levantamiento pon el peso y las repeticiones.";render();return;}if(w>600||r>100){UI.err="Revisa los números: hay un valor demasiado alto.";render();return;}}
    const m=valCompute(p,{...v,bw:v.bw!=null&&v.bw!==""?v.bw:(currentWeight(p)||p.peso0)});
    G(p).marks=m;UI.pg={screen:"res"};UI.err=null;commit();window.scrollTo(0,0);},
  pgApplyLevel:()=>{const p=P();const g=G(p);if(!g.setup||!g.marks)return;
    const d=JSON.parse(JSON.stringify(g.setup));d.nivel=g.marks.nivel;d.tecnicas=g.marks.nivel!=="principiante";
    (g.lvlUps=g.lvlUps||[]).push({date:today(),nivel:g.marks.nivel});applyGymSetup(p,d);UI.pg=null;UI.gtab="plan";commit();window.scrollTo(0,0);toast("Nivel aplicado. Tabla rehecha.");},
  pgOpen:el=>{const p=P();const id=el.dataset.id;UI.pg={screen:"prog",id,lvl:null,bv:{}};render();window.scrollTo(0,0);},
  pgLvl:el=>{const p=P();const g=G(p);const id=UI.pg.id;g.prog=g.prog||{};g.prog[id]={level:+el.dataset.v};UI.pg.lvl=+el.dataset.v;commit();},
  pgStart:el=>{const p=P();const id=UI.pg.id;const lvl=UI.pg.lvl!=null?UI.pg.lvl:progLevel(p,id);progStart(p,id,lvl,+el.dataset.i);commit();window.scrollTo(0,0);},
  pgBench:el=>{const p=P();const g=G(p);const id=el.dataset.id;const b=BENCH.find(x=>x.id===id);if(!b)return;
    const inp=document.querySelector(`[data-pb="${id}"]`);const v=b.u==="r"?parseFloat(String(inp&&inp.value).replace(",",".")):parseTime(inp&&inp.value);
    if(!(v>0)){toast(b.u==="r"?"Pon el número de rondas":"Pon el tiempo, por ejemplo 7:30");return;}
    (g.bench=g.bench||[]).push({id,v,date:today()});UI.pg.bv={};commit();toast(`${b.n}: ${benchLevel(b,v)}`);}
});
function pgField(e){
  const el=e.target.closest("[data-pv],[data-pb]");if(!el||!UI.pg)return;
  if(el.dataset.pv&&UI.pg.v)UI.pg.v[el.dataset.pv]=el.value;
  if(el.dataset.pb){UI.pg.bv=UI.pg.bv||{};UI.pg.bv[el.dataset.pb]=el.value;}
}
document.addEventListener("input",pgField);
const _goProg=A.go;A.go=function(el,e){UI.pg=null;return _goProg(el,e);};
function repUnit(ex){return ex.rep==="m"?["Metros","metros",20000,"los metros"]:ex.rep==="s"?["Segundos","segundos",7200,"los segundos"]:["Repeticiones","repeticiones",300,"las repeticiones"];}

/* Distancias (carrera, ergómetros, trineo): sin pregunta de repeticiones en reserva y con textos propios */
const _runDist=viewRunner;
viewRunner=function(p){
  let h=_runDist(p);const d=G(p).draft;if(!d)return h;
  const it=d.exs[d.cur];const ex=it&&EXM[it.ex];
  if(ex&&(ex.rep==="m"||(ex.rep==="s"&&!incFor(ex)))){
    h=h.replace(new RegExp(`${it.lo}-${it.hi} reps · RIR \\d`),`${it.lo===it.hi?it.lo:it.lo+"-"+it.hi} ${ex.rep==="m"?"m":"s"}`);
    h=h.replace('<div class="field"><span>¿Cuántas repeticiones más','<div class="field" style="display:none"><span>¿Cuántas repeticiones más');
    h=h.replace('<label class="chk sm-chk">','<label class="chk sm-chk" style="visibility:hidden">');
    if(!ex.inc)h=h.replace('<label class="field"><span>Peso (kg)</span>','<label class="field" style="display:none"><span>Peso (kg)</span>');
  }
  return h;
};
const _suggestDist=suggest;
suggest=function(p,ex,range,rir){
  const r=_suggestDist(p,ex,range,rir);
  if(ex.rep==="m"&&!incFor(ex)){
    const first=!exHistory(p,ex.id).length;
    return {w:0,last:r.last,act:"same",txt:first?"Primera vez. Hazlo a ritmo controlado y anota los metros. La próxima vez intenta mantener el ritmo con menos descanso.":"Mismo reparto que la última vez. Intenta bajar el tiempo o recortar el descanso entre series."};
  }
  if(ex.rep==="s"&&!incFor(ex)){
    const hs=exHistory(p,ex.id);const best=hs.length?Math.max(...hs[hs.length-1].sets.map(x=>x.r)):0;
    return {w:0,last:r.last,act:"same",txt:best?`La última vez llegaste a ${best} s. Intenta sumar unos segundos sin perder la técnica.`:`Primera vez. Aguanta entre ${range[0]} y ${range[1]} segundos con buena técnica y anota lo que hagas.`};
  }
  return r;
};
