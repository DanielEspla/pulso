/* ===== Rutina propia + contador libre, y avisos del descanso ===== */
MUSCLES.varios="Otros";PATTERNS.otro="Otros";
const MINE_PAT={pecho:"empuje_h",hombro_ant:"empuje_v",hombro_lat:"elev_lateral",hombro_post:"deltoide_post",dorsal:"tiron_v",espalda_media:"tiron_h",trapecio:"trapecio",biceps:"biceps",triceps:"triceps",cuadriceps:"sentadilla",isquios:"flex_rodilla",gluteo:"gluteo",aductores:"aductor",gemelo:"gemelo",abdomen:"core",lumbar:"bisagra",varios:"otro"};
const MINE_REST=[[45,"45 s"],[60,"1 min"],[90,"1:30"],[120,"2 min"],[180,"3 min"]];
const mineNorm=s=>normName(s);

/* ---- Datos ---- */
function mineList(p){const g=G(p);if(!g.mine)g.mine=[];return g.mine;}
function mineCount(r){return r.exs.reduce((a,x)=>a+(+x.sets||0),0);}
function mineDefaults(ex){const r=REPS[ex.rep]||REPS.h;return {ex:ex.id,sets:3,lo:r[0],hi:r[1],rest:REST[ex.rep]||90};}
function mineEnsureSetup(p){const g=G(p);if(!g.setup&&!g.plan){applyGymSetup(p,gymDefaults(p));}}

/* ---- Ejercicios propios ---- */
function mineNewEx(p,name,prim,time,bw){
  name=String(name||"").trim().replace(/\s+/g," ");if(!name)return null;
  const g=G(p);g.customEx=g.customEx||[];
  const nm=name.charAt(0).toUpperCase()+name.slice(1);
  let id="mi_"+mineNorm(name).replace(/ /g,"_").replace(/[^a-z0-9_]/g,"").slice(0,36),k=1;const base=id;
  while(EXM[id]&&EXM[id].name!==nm){k++;id=base+"_"+k;}
  if(EXM[id]){mineKeep(p,id);return id;}
  const c={id,name:nm,prim:prim||"varios",pat:MINE_PAT[prim||"varios"]||"otro",rep:time?"s":"h",inc:bw?0:2.5};
  g.customEx.push(c);registerImported([c]);return id;
}
/* Si un ejercicio propio existe solo en otro perfil, lo copia al activo para no perderlo */
function mineKeep(p,id){const e=EXM[id];if(!e||!e.imported)return;const g=G(p);g.customEx=g.customEx||[];if(!g.customEx.some(c=>c.id===id))g.customEx.push({id:e.id,name:e.name,prim:e.prim,pat:e.pat,rep:e.rep,inc:e.inc});}
/* Busca en la biblioteca: primero nombre exacto, luego el más corto que contenga todas las palabras */
function mineMatch(name){
  const t=mineNorm(name);if(!t)return null;
  const tt=t.split(" ");
  const ex=EX.find(e=>mineNorm(e.name)===t);if(ex)return ex.id;
  const cands=EX.filter(e=>{const w=mineNorm(e.name).split(" ");return tt.every(x=>w.some(y=>y===x||y.startsWith(x)&&x.length>=4));});
  if(cands.length){cands.sort((a,b)=>mineNorm(a.name).split(" ").length-mineNorm(b.name).split(" ").length||(b.C?1:0)-(a.C?1:0)||(a.imported?1:0)-(b.imported?1:0));return cands[0].id;}
  return matchExercise("",name);
}
/* Texto → rutina. Acepta «Press banca 4x8», «Remo 3 x 10-12», «Plancha 3x45s», «Sentadilla 4 series de 6» o solo el nombre */
function mineParse(p,text){
  const out=[];let made=0,known=0;
  String(text||"").split(/\n|;/).forEach(raw=>{
    let l=raw.replace(/\t+/g," ").replace(/^\s*(?:[-•*·]|\d+\s*[.)\-–]|[a-zA-Z]\))\s*/,"").trim();if(!l)return;
    if(/^(d[ií]a\s*\d|lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|rutina|descanso|calentamiento|semana|bloque)\b/i.test(l)&&!/\d\s*[x×]\s*\d/i.test(l))return;
    l=l.replace(/^(\d{1,2}\s*[x×]\s*\d{1,3}(?:\s*[-–]\s*\d{1,3})?)\s+(.+)$/i,"$2 $1").replace(/\s+\d{1,3}(?:[.,]\d+)?\s*kg\b/ig,"").replace(/\b(\d{1,2})\s*(?:sets?|series)\s*[x×de]*\s*(\d)/i,"$1x$2");
    let sets=3,lo=null,hi=null,time=false,name=l,m;
    if((m=l.match(/^(.*?)[\s:,\-–]*(\d{1,2})\s*[x×*]\s*(\d{1,3})(?:\s*[-–a]\s*(\d{1,3}))?\s*(s|seg|segundos|")?\b.*$/i))&&m[1].trim()){name=m[1];sets=+m[2];lo=+m[3];hi=m[4]?+m[4]:null;time=!!m[5];}
    else if((m=l.match(/^(.*?)[\s:,\-–]*(\d{1,2})\s*series?\s*(?:de|x)?\s*(\d{1,3})(?:\s*[-–a]\s*(\d{1,3}))?\s*(s|seg|segundos)?\b.*$/i))&&m[1].trim()){name=m[1];sets=+m[2];lo=+m[3];hi=m[4]?+m[4]:null;time=!!m[5];}
    name=name.replace(/[\s:,\-–]+$/,"").trim();if(!name)return;
    let id=mineMatch(name);
    if(id){known++;mineKeep(p,id);}else{const g=normName(name);const gs=PAT_GUESS.find(([re])=>re.test(g));id=mineNewEx(p,name,gs?gs[2]:"varios",time,false);made++;}
    const ex=EXM[id];const d=mineDefaults(ex);
    if(lo!=null){d.lo=lo;d.hi=hi!=null?Math.max(hi,lo):lo;}
    d.sets=clamp(sets,1,20);out.push(d);
  });
  return {exs:out,made,known};
}

/* ---- Pantallas ---- */
function viewMine(p){
  const st=UI.mn;const g=G(p);
  const back=`<div class="row between"><h1>${st.screen==="edit"?(st.d.id?"Editar rutina":"Nueva rutina"):st.screen==="paste"?"Pegar rutina":"Mis rutinas"}</h1><button class="btn ghost sm" data-a="${st.screen==="list"?"mineClose":"mineList"}">${st.screen==="list"?"Cerrar":"← Volver"}</button></div>`;
  if(st.screen==="paste")return `<div class="stack">${back}
    <p class="muted">Escribe o pega un ejercicio por línea. Pon las series y las repeticiones así: <b>Press banca 4x8</b>, <b>Remo 3x10-12</b>, <b>Plancha 3x45s</b>. Si solo pones el nombre, serán 3 series.</p>
    <textarea class="inp" id="mn_txt" rows="9" data-mn="txt" placeholder="Press banca 4x8&#10;Remo con barra 4x10&#10;Curl de bíceps 3x12">${esc(st.txt||"")}</textarea>
    ${UI.err?`<p class="err">${esc(UI.err)}</p>`:""}
    <button class="btn pri wide" data-a="minePasteDo">Crear rutina</button>
    <p class="small muted">Los ejercicios que existan en Afina se reconocen solos. Los demás se crean como ejercicios tuyos.</p></div>`;
  if(st.screen==="edit"){const d=st.d;
    return `<div class="stack">${back}
    <label class="field"><span>Nombre de la rutina</span><input class="inp" id="mn_name" data-mn="name" value="${esc(d.name)}" placeholder="Ej.: Pecho y tríceps"></label>
    ${d.exs.length?d.exs.map((x,j)=>{const ex=EXM[x.ex];const t=ex.rep==="s";return `<div class="card stack"><div class="row between"><div><b>${esc(ex.name)}</b><div class="small muted">${esc(MUSCLES[ex.prim]||"")}</div></div>
      <div class="row" style="gap:4px;flex-wrap:nowrap;flex-shrink:0"><button class="btn ghost sm" data-a="mineUp" data-j="${j}" aria-label="Subir">↑</button><button class="btn ghost sm" data-a="mineDown" data-j="${j}" aria-label="Bajar">↓</button><button class="btn ghost sm" data-a="mineDel" data-j="${j}" aria-label="Quitar">✕</button></div></div>
      <div class="mgrid"><label class="field"><span>Series</span><input class="inp num" type="number" inputmode="numeric" min="1" max="20" data-mn="sets" data-j="${j}" value="${x.sets}"></label>
      <label class="field"><span>${t?"Seg. mín":"Reps mín"}</span><input class="inp num" type="number" inputmode="numeric" min="1" data-mn="lo" data-j="${j}" value="${x.lo}"></label>
      <label class="field"><span>${t?"Seg. máx":"Reps máx"}</span><input class="inp num" type="number" inputmode="numeric" min="1" data-mn="hi" data-j="${j}" value="${x.hi}"></label></div>
      <label class="field"><span>Descanso</span><select class="inp" data-mn="rest" data-j="${j}">${MINE_REST.map(([v,t2])=>`<option value="${v}" ${+x.rest===v?"selected":""}>${t2}</option>`).join("")}${MINE_REST.some(([v])=>v===+x.rest)?"":`<option value="${x.rest}" selected>${x.rest} s</option>`}</select></label></div>`;}).join(""):`<div class="card flat"><p class="muted">Aún no hay ejercicios. Pulsa «Añadir ejercicio».</p></div>`}
    <button class="btn wide" data-a="mineAddEdit">+ Añadir ejercicio</button>
    ${UI.err?`<p class="err">${esc(UI.err)}</p>`:""}
    <button class="btn pri wide" data-a="mineSave">Guardar rutina</button>
    ${d.id?(UI.confirm==="mineDel"?`<div class="alert warn"><span class="dot"></span><div><b>¿Borrar esta rutina?</b>Tu historial de entrenos se conserva.<div class="row" style="margin-top:8px"><button class="btn sm danger" data-a="mineDelDo">Sí, borrar</button><button class="btn sm ghost" data-a="cancelConfirm">No</button></div></div></div>`:`<button class="btn ghost wide" data-a="askConfirm" data-k="mineDel">Borrar rutina</button>`):""}
    </div>`;}
  const L=mineList(p);
  return `<div class="stack">${back}
    <p class="muted">Crea tu propia rutina y úsala como contador: te enseña lo que hiciste la última vez, cuenta el descanso entre series y guarda tu historial y tus récords.</p>
    ${L.length?L.map(r=>`<div class="card stack"><div class="row between"><div><b>${esc(r.name)}</b><div class="small muted">${r.exs.length} ejercicio${r.exs.length===1?"":"s"} · ${mineCount(r)} series</div></div></div>
      <p class="small muted">${r.exs.map(x=>esc(EXM[x.ex]?EXM[x.ex].name:"")).filter(Boolean).slice(0,4).join(" · ")}${r.exs.length>4?" …":""}</p>
      <div class="row"><button class="btn pri" data-a="mineStart" data-id="${r.id}">Empezar</button><button class="btn" data-a="mineEdit" data-id="${r.id}">Editar</button></div></div>`).join(""):`<div class="card flat"><p class="muted">Todavía no tienes rutinas propias.</p></div>`}
    <button class="btn pri wide" data-a="mineNew">Crear rutina nueva</button>
    <button class="btn wide" data-a="minePaste">Pegar mi rutina en texto</button>
    <button class="btn ghost wide" data-a="mineFree">Entrenar sin rutina (contador libre)</button>
    <p class="small muted">En el contador libre eliges los ejercicios sobre la marcha, con el peso y las repeticiones de tu última vez.</p></div>`;
}
function sheetMineAdd(p){
  const q=UI.mnq||"";const nq=mineNorm(q);const mu=UI.mnm||"";const nw=UI.mnNew||{};
  let list=EX.filter(e=>(!mu||e.prim===mu)&&(!nq||mineNorm(e.name).includes(nq)||mineNorm(MUSCLES[e.prim]||"").includes(nq)));
  list=list.sort((a,b)=>(a.imported?1:0)-(b.imported?1:0)).slice(0,40);
  return `<div class="sheet-h"><div><span class="lbl">Añadir</span><h2>Elige un ejercicio</h2></div><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <div class="stack"><input class="inp" type="search" id="mnq" data-mnq="1" placeholder="Buscar ejercicio o músculo" value="${esc(q)}">
  <div class="chips">${[["","Todos"],...Object.entries(MUSCLES).filter(([k])=>k!=="varios")].map(([k,t])=>`<button class="${mu===k?"on":""}" data-a="mineMus" data-k="${k}">${t}</button>`).join("")}</div>
  <div class="items">${list.length?list.map(e=>`<button class="item" data-a="mineAddEx" data-id="${esc(e.id)}"><span class="nm"><b>${esc(e.name)}</b><span class="small muted">${esc(MUSCLES[e.prim]||"")}${e.imported?" · tuyo":""}</span></span><span class="q">+</span></button>`).join(""):`<p class="muted">No hay resultados. Créalo aquí abajo.</p>`}</div>
  <div class="card flat stack"><span class="lbl">Crear ejercicio propio</span>
    <input class="inp" data-mnn="name" placeholder="Nombre del ejercicio" value="${esc(nw.name!=null?nw.name:q)}">
    <label class="field"><span>Músculo principal</span><select class="inp" data-mnn="prim">${Object.entries(MUSCLES).filter(([k])=>k!=="varios").map(([k,t])=>`<option value="${k}" ${(nw.prim||"pecho")===k?"selected":""}>${t}</option>`).join("")}<option value="varios" ${nw.prim==="varios"?"selected":""}>Otro / varios</option></select></label>
    <label class="chk"><input type="checkbox" data-mnn="bw" ${nw.bw?"checked":""}> Sin peso (peso corporal)</label>
    <label class="chk"><input type="checkbox" data-mnn="time" ${nw.time?"checked":""}> Se mide en segundos (plancha, isométricos)</label>
    <button class="btn pri" data-a="mineCreateEx">Crear y añadir</button></div></div>`;
}

/* ---- Acciones ---- */
function mineStartDraft(p,name,mineId,exs){
  const g=G(p);
  g.draft={date:today(),sIdx:-1,mine:mineId||"libre",name,wellness:"normal",week:0,cur:0,start:Date.now(),
    exs:exs.map((x,i)=>({si:i,ex:x.ex,sets:x.sets,lo:x.lo,hi:x.hi,rir:2,rest:x.rest,main:false,ss:"",tech:null,orig:x.ex,sets_:[],done:false}))};
  UI.mn=null;UI.rnFor=null;UI.rest=null;UI.gsel=null;UI.err=null;
}
function mineAddTo(p,id){
  const ex=EXM[id];if(!ex)return;const ctx=UI.mnCtx;const d0=mineDefaults(ex);
  if(ctx==="edit"&&UI.mn&&UI.mn.d){UI.mn.d.exs.push(d0);}
  else if(ctx==="free"){mineStartDraft(p,"Entreno libre","libre",[d0]);}
  else if(ctx==="draft"&&G(p).draft){const d=G(p).draft;d.exs.push({si:d.exs.length,ex:id,sets:d0.sets,lo:d0.lo,hi:d0.hi,rir:2,rest:d0.rest,main:false,ss:"",tech:null,orig:id,sets_:[],done:false});d.cur=d.exs.length-1;UI.rnFor=null;}
  UI.sheet=null;UI.mnq="";UI.mnm="";UI.mnNew=null;UI.err=null;
}
Object.assign(A,{
  mineOpen:()=>{const p=P();mineEnsureSetup(p);UI.gs=null;UI.mn={screen:"list"};UI.err=null;UI.view="entreno";commit();window.scrollTo(0,0);},
  mineClose:()=>{UI.mn=null;UI.err=null;UI.confirm=null;render();window.scrollTo(0,0);},
  mineList:()=>{UI.mn={screen:"list"};UI.err=null;UI.confirm=null;render();window.scrollTo(0,0);},
  mineNew:()=>{UI.mn={screen:"edit",d:{id:null,name:"",exs:[]}};UI.err=null;render();window.scrollTo(0,0);},
  mineEdit:el=>{const r=mineList(P()).find(x=>x.id===el.dataset.id);if(!r)return;const d=JSON.parse(JSON.stringify(r));d.exs=d.exs.filter(x=>EXM[x.ex]);UI.mn={screen:"edit",d};UI.confirm=null;UI.err=null;render();window.scrollTo(0,0);},
  minePaste:()=>{UI.mn={screen:"paste",txt:""};UI.err=null;render();},
  minePasteDo:()=>{const p=P();const t=document.getElementById("mn_txt");const txt=t?t.value:UI.mn.txt;const r=mineParse(p,txt);
    if(!r.exs.length){UI.err="No he encontrado ningún ejercicio. Escribe uno por línea.";render();return;}
    UI.mn={screen:"edit",d:{id:null,name:"",exs:r.exs}};UI.err=null;commit();
    toast(`${r.known} reconocidos${r.made?` y ${r.made} creados como tuyos`:""}. Ponle nombre y revisa.`);},
  mineAddEdit:()=>{UI.mnCtx="edit";UI.mnq="";UI.mnm="";UI.sheet=()=>sheetMineAdd(P());render();},
  mineAddDraft:()=>{UI.mnCtx="draft";UI.mnq="";UI.mnm="";UI.sheet=()=>sheetMineAdd(P());render();},
  mineFree:()=>{UI.mnCtx="free";UI.mnq="";UI.mnm="";UI.sheet=()=>sheetMineAdd(P());render();},
  mineMus:el=>{UI.mnm=UI.mnm===el.dataset.k?"":el.dataset.k;render();},
  mineAddEx:el=>{const p=P();mineAddTo(p,el.dataset.id);commit();},
  mineCreateEx:()=>{const p=P();const n=UI.mnNew||{};const nm=(n.name!=null?n.name:UI.mnq)||"";if(!nm.trim()){toast("Escribe el nombre del ejercicio");return;}
    const id=mineNewEx(p,nm,n.prim||"pecho",!!n.time,!!n.bw);if(!id)return;mineAddTo(p,id);commit();toast("Ejercicio creado");},
  mineUp:el=>{const x=UI.mn.d.exs,j=+el.dataset.j;if(j>0){[x[j-1],x[j]]=[x[j],x[j-1]];}render();},
  mineDown:el=>{const x=UI.mn.d.exs,j=+el.dataset.j;if(j<x.length-1){[x[j+1],x[j]]=[x[j],x[j+1]];}render();},
  mineDel:el=>{UI.mn.d.exs.splice(+el.dataset.j,1);render();},
  mineSave:()=>{const p=P();const d=UI.mn.d;
    if(!d.exs.length){UI.err="Añade al menos un ejercicio.";render();return;}
    d.exs.forEach(x=>{x.sets=clamp(Math.round(+x.sets)||3,1,20);x.lo=Math.max(1,Math.round(+x.lo)||8);x.hi=Math.max(x.lo,Math.round(+x.hi)||x.lo);x.rest=clamp(Math.round(+x.rest)||90,15,600);});
    d.name=(d.name||"").trim()||"Mi rutina "+(mineList(p).length+1);
    if(d.id){const i=mineList(p).findIndex(x=>x.id===d.id);if(i>=0)mineList(p)[i]=d;else mineList(p).push(d);}
    else{d.id=uid();d.created=today();mineList(p).push(d);}
    UI.mn={screen:"list"};UI.err=null;UI.confirm=null;commit();window.scrollTo(0,0);toast("Rutina guardada");},
  mineDelDo:()=>{const p=P();const id=UI.mn.d.id;const g=G(p);g.mine=mineList(p).filter(x=>x.id!==id);UI.mn={screen:"list"};UI.confirm=null;commit();toast("Rutina borrada");},
  mineStart:el=>{const p=P();const r=mineList(p).find(x=>x.id===el.dataset.id);if(!r)return;const ok=r.exs.filter(x=>EXM[x.ex]);if(!ok.length){toast("Esta rutina tiene ejercicios que ya no existen. Edítala y vuelve a añadirlos.");return;}mineStartDraft(p,r.name,r.id,ok);commit();window.scrollTo(0,0);}
});
/* Escritura en los campos sin perder el foco */
function mineField(e){
  const el=e.target.closest("[data-mn]");if(!el||!UI.mn)return;const k=el.dataset.mn;
  if(k==="txt"){UI.mn.txt=el.value;return;}
  if(!UI.mn.d)return;if(k==="name"){UI.mn.d.name=el.value;return;}
  const x=UI.mn.d.exs[+el.dataset.j];if(x)x[k]=el.value===""?"":+el.value;
}
document.addEventListener("input",mineField);document.addEventListener("change",mineField);
document.addEventListener("input",e=>{
  const q=e.target.closest("[data-mnq]");
  if(q){UI.mnq=q.value;render();const s=document.getElementById("mnq");if(s){s.focus();s.setSelectionRange(s.value.length,s.value.length);}return;}
  const n=e.target.closest("[data-mnn]");if(n){UI.mnNew=UI.mnNew||{};const k=n.dataset.mnn;UI.mnNew[k]=n.type==="checkbox"?n.checked:n.value;}
});
document.addEventListener("change",e=>{const n=e.target.closest("[data-mnn]");if(n){UI.mnNew=UI.mnNew||{};const k=n.dataset.mnn;UI.mnNew[k]=n.type==="checkbox"?n.checked:n.value;}});

/* ---- Integración con Entreno ---- */
function mineStrip(p){
  const n=mineList(p).length;
  return `<div class="card row between"><div><span class="lbl">Mis rutinas</span><p>${n?`${n} guardada${n===1?"":"s"}. Úsalas de contador.`:"Crea tu rutina y úsala de contador."}</p></div><button class="btn ${n?"":"pri"}" data-a="mineOpen">${n?"Abrir":"Crear"}</button></div>`;
}
const _viewEntrenoMine=viewEntreno;
viewEntreno=function(p){
  const g=G(p);
  if(UI.mn&&!g.draft&&!UI.gsum)return `<div class="ob">${viewMine(p)}</div>`;
  let h=_viewEntrenoMine(p);
  if(g.setup&&!UI.gs&&!UI.gsum&&!g.draft){
    if(h.includes('<div class="stack">'))h=h.replace('<div class="stack">','<div class="stack">'+mineStrip(p));
    else h=h.replace('<div class="seg" style="margin-bottom:16px">',mineStrip(p)+'<div class="seg" style="margin-bottom:16px">');
  }
  return h;
};
const _viewGymSetupMine=viewGymSetup;
viewGymSetup=function(p){
  const h=_viewGymSetupMine(p);const g=G(p);
  if(!g.setup&&UI.gs&&UI.gs.step===0)return h.replace('<div class="steps">',`<div class="card flat row between"><div><b>¿Ya tienes tu rutina?</b><div class="small muted">Úsala directamente como contador, sin plan automático.</div></div><button class="btn" data-a="mineOpen">Usar la mía</button></div><div class="steps">`);
  return h;
};
const _viewRunnerMine=viewRunner;
viewRunner=function(p){
  const h=_viewRunnerMine(p);const d=G(p).draft;
  if(d&&d.mine)return h.replace('<div class="card"><span class="lbl">Sesión</span>','<button class="btn wide" data-a="mineAddDraft">+ Añadir ejercicio a esta sesión</button><div class="card"><span class="lbl">Sesión</span>');
  return h;
};
const _finishSessionMine=finishSession;
finishSession=function(p){
  const g=G(p);const d=g.draft;
  if(d&&d.mine){const nx=g.next;const e=_finishSessionMine(p);g.next=nx;if(e)e.mine=d.mine;return e;}
  return _finishSessionMine(p);
};

/* ---- Avisos del descanso: pitido y pantalla encendida (ajustes por dispositivo) ---- */
const snd=()=>!(S.ui&&S.ui.snd===false);
const wakeOn=()=>!(S.ui&&S.ui.wake===false);
let _ac=null,_wl=null;
function audioUnlock(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!_ac)_ac=new C();if(_ac.state==="suspended")_ac.resume();}catch(e){}}
document.addEventListener("click",audioUnlock,{passive:true});document.addEventListener("touchstart",audioUnlock,{passive:true});
function beep(){
  if(!snd())return;audioUnlock();if(!_ac)return;
  try{[0,0.28,0.56].forEach(t=>{const o=_ac.createOscillator(),g=_ac.createGain();o.type="sine";o.frequency.value=t>0.5?1040:880;o.connect(g);g.connect(_ac.destination);
    const s=_ac.currentTime+t;g.gain.setValueAtTime(0.0001,s);g.gain.exponentialRampToValueAtTime(0.5,s+0.02);g.gain.exponentialRampToValueAtTime(0.0001,s+0.22);o.start(s);o.stop(s+0.25);});}catch(e){}
}
function restDone(){try{navigator.vibrate&&navigator.vibrate([200,100,200]);}catch(e){}beep();}
function syncWake(){
  try{
    if(!("wakeLock" in navigator))return;
    const p=P();const dr=p&&G(p).draft;const need=!!dr&&dr.date===today()&&UI.view==="entreno"&&wakeOn()&&document.visibilityState==="visible"&&Date.now()>(window._wlBack||0);
    if(need&&!_wl){navigator.wakeLock.request("screen").then(l=>{_wl=l;l.addEventListener("release",()=>{if(_wl===l)_wl=null;});}).catch(()=>{window._wlBack=Date.now()+60000;});}
    else if(!need&&_wl){const l=_wl;_wl=null;l.release().catch(()=>{});}
  }catch(e){}
}
setInterval(syncWake,2000);document.addEventListener("visibilitychange",syncWake);
Object.assign(CHG,{
  gsSnd:el=>{S.ui=S.ui||{};S.ui.snd=el.checked;save();if(el.checked){audioUnlock();beep();}},
  gsWake:el=>{S.ui=S.ui||{};S.ui.wake=el.checked;save();syncWake();}
});

const _goMine=A.go;A.go=function(el,e){UI.mn=null;return _goMine(el,e);};

/* Tras activar o desactivar la dieta (recarga): volver a la pantalla pedida */
try{const _g=sessionStorage.getItem('afina_go');if(_g){sessionStorage.removeItem('afina_go');UI.view=_g;}}catch(e){}
