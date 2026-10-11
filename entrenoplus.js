/* ===== Entreno: aproximaciones, estancamiento por ejercicio y cardio ===== */

/* ---- Series de aproximación ----
   Antes de las series de trabajo de los ejercicios compuestos: subir peso en pocas repeticiones
   para preparar articulaciones, técnica y sistema nervioso sin cansar. */
function warmupPlan(p,it,sg){
  const ex=EXM[it.ex];if(!ex||!ex.C||ex.rep==="s"||!incFor(ex))return null;
  const d=G(p).draft;const firstOfPattern=d?d.exs.findIndex(x=>EXM[x.ex]&&EXM[x.ex].pat===ex.pat)===d.exs.indexOf(it):true;
  if(!it.main&&!firstOfPattern)return null;
  const w=sg&&sg.w;
  if(!w)return {txt:`Antes de buscar tu peso: ${it.main?"dos series ligeras de 8 y 4 repeticiones":"una serie ligera de 6 repeticiones"}, subiendo de peso.`,sets:[]};
  const bar=ex.req.includes("barra")?20:0;const st=incFor(ex)>=2?2.5:1;
  const sch=it.main?(w>=40?[[0.5,8],[0.7,4],[0.85,2]]:[[0.55,8],[0.8,3]]):[[0.6,6]];
  const sets=[];sch.forEach(([f,r])=>{const x=Math.max(bar,Math.round(w*f/st)*st);if(x<w&&!sets.some(s=>s.w===x))sets.push({w:x,r});});
  if(!sets.length)return null;
  return {txt:sets.map(s=>`${nf(s.w,s.w%1?1:0)} kg × ${s.r}`).join(" · "),sets};
}
function warmupBox(p,it,sg){
  const nWork=it.sets_.filter(s=>!s.warm).length;const nWarm=it.sets_.filter(s=>s.warm).length;
  if(nWork||nWarm)return "";
  const wp=warmupPlan(p,it,sg);if(!wp)return "";
  return `<div class="warmup"><div><b>Aproximaciones</b> ${infoBtn("aprox","aproximaciones")}<br><span class="small">${esc(wp.txt)}</span><span class="small muted"> · descanso corto, sin acercarte al fallo</span></div>${wp.sets.length?`<button class="btn sm" data-a="warmLog">Apuntarlas</button>`:""}</div>`;
}

/* ---- Estancamiento por ejercicio ----
   Tres sesiones seguidas sin superar tu mejor fuerza estimada previa, en al menos dos semanas.
   En déficit, mantener fuerza ya es buena señal: solo avisa si la fuerza cae. */
function plateauFor(p,exId){
  const h=exHistory(p,exId).filter(x=>x.sets.some(s=>s.w>0));if(h.length<5)return null;
  const v=h.map(x=>bestE1(x.sets));const last3=v.slice(-3),before=v.slice(0,-3);const b0=Math.max(...before);
  if(daysBetween(h[h.length-3].date,h[h.length-1].date)<7)return null;
  const ack=(G(p).plateauAck||{})[exId];if(ack&&ack>=h[h.length-3].date)return null;
  const deficit=p.objetivo==="perder";
  const maxL=Math.max(...last3);
  if(deficit){if(maxL<b0*0.97)return {tipo:"cae",b0,maxL,n:3};return null;}
  if(maxL<=b0*1.005)return {tipo:"para",b0,maxL,n:3};
  return null;
}
function plateauBox(p,it){
  if(isDeload(p))return "";const pl=plateauFor(p,it.ex);if(!pl)return "";
  const head=pl.tipo==="cae"?"Tu fuerza baja en este ejercicio":"Tres sesiones sin mejorar aquí";
  const why=pl.tipo==="cae"?"Comiendo menos es normal estancarse, pero que baje tres sesiones seguidas suele ser fatiga.":"Es normal: el cuerpo se adapta y hay que darle un estímulo distinto.";
  return `<div class="alert warn"><span class="dot"></span><div><b>${head}</b>${why} Mejor marca: ${nf(pl.b0,1)} kg estimados; últimas tres sesiones: ${nf(pl.maxL,1)} kg como mucho. Opciones:
  <div class="row wrap" style="margin-top:8px;gap:6px"><button class="btn sm pri" data-a="plReset" data-id="${it.ex}">Bajar un 10 % y volver a subir</button><button class="btn sm" data-a="plRange" data-id="${it.ex}">Cambiar el rango de repeticiones</button><button class="btn sm" data-a="swapOpen" data-i="${G(p).draft.cur}">Cambiar a una variante</button><button class="btn sm ghost" data-a="plAck" data-id="${it.ex}">Seguir igual</button></div></div></div>`;
}
function stalledList(p){return [...new Set(G(p).log.flatMap(l=>l.exs.map(e=>e.ex)))].filter(id=>EXM[id]).map(id=>({id,pl:plateauFor(p,id)})).filter(x=>x.pl);}

/* ---- Cardio ----
   La forma cardiovascular (VO2máx) es de los mejores predictores de longevidad.
   Zona 2 (ritmo en el que puedes hablar) y una sesión de intervalos a la semana.
   Para no restar a las pesas: mejor bici, elíptica o andar en cuesta, en días sin pierna o separado unas horas. */
const CARDIO_TYPES={z2:["Zona 2","Cardio suave y largo"],hiit:["Intervalos","Corto e intenso"],otro:["Otro","Deporte o actividad"]};
function fcMax(p){return Math.round(208-0.7*edadDe(p));}
function cardioRx(p){
  const meta=p.meta||"recomp";const age=edadDe(p);
  const base={recomp:[2,35,1],estetica:[2,30,1],definicion:[3,35,1],volumen:[1,25,1],fuerza:[1,25,1],longevidad:[3,40,1]}[meta]||[2,30,1];
  let [z2n,z2min,hiit]=base;if(age>=40&&z2n<2)z2n=2;
  const endu=planDays(p).filter(x=>["resistencia","hibrido"].includes(x.s.tipo)).length;
  const covered=Math.min(z2n,endu);
  return {z2n,z2min,hiit,covered,endu,fc:[Math.round(fcMax(p)*0.6),Math.round(fcMax(p)*0.7)]};
}
function cardioWeek(p,ws){const end=addDays(ws,6);const L=(G(p).cardioLog||[]).filter(c=>c.date>=ws&&c.date<=end);return {z2:L.filter(c=>c.type!=="hiit").length,hiit:L.filter(c=>c.type==="hiit").length,min:L.reduce((a,c)=>a+(c.min||0),0),list:L};}
function cardioCard(p){
  const g=G(p);if(g.cardioOff)return `<div class="card row between"><div><span class="lbl">Cardio</span><p class="small muted">Desactivado. La salud del corazón también cuenta.</p></div><button class="btn sm" data-a="cdOn">Activar</button></div>`;
  const rx=cardioRx(p);const wk=cardioWeek(p,weekStart(today()));
  const z2Need=Math.max(0,rx.z2n-rx.covered);
  const wd=(new Date().getDay()+6)%7;const gymToday=(g.setup.dias||[]).includes(wd);
  const sugg=wk.hiit<rx.hiit&&!gymToday&&wd>=2?"Hoy encaja la sesión de intervalos.":wk.z2<z2Need?(gymToday?"Si te apetece, 20-30 min de zona 2 al terminar las pesas, mejor en bici o andando en cuesta.":`Hoy encaja zona 2: ${rx.z2min} min.`):"Cardio de la semana cubierto.";
  return `<div class="card stack"><div class="row between"><span class="lbl">Cardio esta semana ${infoBtn("cardio","cardio")}</span><button class="btn sm" data-a="cdOpen">Apuntar</button></div>
  <div class="grid2"><div><span class="small muted">Zona 2 · ${rx.z2min} min</span><div class="v2 num">${Math.min(wk.z2,z2Need)}<small> / ${z2Need}</small></div></div><div><span class="small muted">Intervalos</span><div class="v2 num">${Math.min(wk.hiit,rx.hiit)}<small> / ${rx.hiit}</small></div></div></div>
  ${rx.covered?`<p class="small muted">Tu deporte de resistencia cubre ${rx.covered} sesión${rx.covered>1?"es":""} de zona 2.</p>`:""}
  <p class="small">${sugg} Zona 2: puedes hablar con frases completas, unas ${rx.fc[0]}-${rx.fc[1]} pulsaciones.</p>
  <button class="btn ghost sm" style="align-self:flex-start" data-a="cdOff">No quiero cardio</button></div>`;
}
function sheetCardio(){
  const c=UI.cd||{type:"z2",min:30};
  return `<div class="sheet-h"><h2>Apuntar cardio</h2><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <div class="stack"><div class="seg">${Object.entries(CARDIO_TYPES).map(([k,v])=>`<button class="${c.type===k?"on":""}" data-a="cdType" data-k="${k}">${v[0]}</button>`).join("")}</div>
  <p class="small muted">${c.type==="z2"?"Andar rápido, bici, elíptica o remo a un ritmo en el que puedes hablar. Lo ideal: 30-45 minutos.":c.type==="hiit"?"Ejemplo: 4 bloques de 4 minutos fuerte (casi sin poder hablar) con 3 minutos suaves entre medias. Versión corta: 8 × 30 s fuerte con 90 s suaves.":"Pádel, natación, una ruta... cualquier actividad que te haya subido las pulsaciones un buen rato."}</p>
  <label class="field"><span>Minutos</span><input class="inp num" type="number" inputmode="numeric" id="cd_min" value="${c.min}"></label>
  <button class="btn pri wide" data-a="cdSave">Guardar</button></div>`;
}

Object.assign(A,{
  warmLog:()=>{const p=P();const d=G(p).draft;const it=d.exs[d.cur];const sg=suggest(p,EXM[it.ex],[it.lo,it.hi],it.rir);const wp=warmupPlan(p,it,sg);if(!wp)return;wp.sets.forEach(s=>it.sets_.push({w:s.w,r:s.r,warm:true}));UI.rnFor=null;commit();toast("Aproximaciones apuntadas. Ahora, a las series de trabajo.");},
  plAck:el=>{const g=G(P());(g.plateauAck=g.plateauAck||{})[el.dataset.id]=today();commit();},
  plReset:el=>{const p=P();const g=G(p);const id=el.dataset.id;const h=exHistory(p,id);const top=Math.max(...h[h.length-1].sets.map(s=>s.w||0));const ex=EXM[id];UI.rnW=roundTo(top*0.9,incFor(ex)>=2?2.5:0.5);(g.plateauAck=g.plateauAck||{})[id]=today();commit();toast("Peso bajado un 10 %. En unas semanas superarás tu marca.");},
  plRange:el=>{const p=P();const g=G(p);const d=g.draft;const it=d.exs[d.cur];const lo=it.lo,hi=it.hi;
    if(hi<=8){it.lo=8;it.hi=12;}else{it.lo=Math.max(4,lo-3);it.hi=Math.max(it.lo+2,hi-4);}
    (g.plateauAck=g.plateauAck||{})[el.dataset.id]=today();UI.rnFor=null;commit();toast(`Hoy, ${it.lo}-${it.hi} repeticiones. Un rango nuevo es un estímulo nuevo.`);},
  cdOpen:()=>{UI.cd={type:"z2",min:30};UI.sheet=sheetCardio;render();},
  cdType:el=>{const m=+((document.getElementById("cd_min")||{}).value||30);UI.cd={type:el.dataset.k,min:el.dataset.k==="hiit"&&m===30?20:m};render();},
  cdSave:()=>{const p=P();const g=G(p);const m=parseInt(document.getElementById("cd_min").value,10);if(!(m>0&&m<600)){toast("Pon los minutos");return;}(g.cardioLog=g.cardioLog||[]).push({date:today(),type:UI.cd.type,min:m});UI.sheet=null;commit();toast("Cardio apuntado.");},
  cdOff:()=>{G(P()).cardioOff=true;commit();},
  cdOn:()=>{G(P()).cardioOff=false;commit();}
});

/* ---- Rutinas: elegir sesión anterior o siguiente, y volver a un plan anterior ---- */
const _buildGymPlanBase=buildGymPlan;
buildGymPlan=function(p){
  const g=G(p);
  if(g.plan&&g.plan.sessions&&!(g.planHist&&g.planHist[0]&&JSON.stringify(g.planHist[0].plan)===JSON.stringify(g.plan))){g.planHist=g.planHist||[];g.planHist.unshift({date:today(),plan:JSON.parse(JSON.stringify(g.plan)),nivel:(g.setup||{}).nivel,dias:((g.setup||{}).dias||[]).length,meta:p.meta});g.planHist=g.planHist.slice(0,5);}
  return _buildGymPlanBase(p);
};
function planLabel(pl){return pl.sessions.map(s=>s.name).join(" · ");}
function planHistCard(p){
  const H=G(p).planHist||[];if(!H.length)return "";
  return `<details class="card"><summary><b>Planes anteriores</b><span class="small muted"> · ${H.length}</span></summary><div class="stack" style="margin-top:10px">
  <p class="small muted">Cada vez que el plan se rehace (por cambiar días, nivel u objetivo) se guarda el anterior. Puedes volver a él; tu historial de pesos no se toca.</p>
  ${H.map((h,i)=>`<div class="row between"><div><b>${fdate(h.date)}</b><span class="small muted"> · ${h.plan.sessions.length} sesiones · ${esc(NIVELES[h.nivel]?NIVELES[h.nivel].split(" (")[0]:"")}</span><br><span class="small">${esc(planLabel(h.plan))}</span></div><button class="btn sm" data-a="planBack" data-i="${i}">Volver a este</button></div>`).join("")}</div></details>`;
}
/* Sesiones hechas esta semana, para marcarlas en la selección */
function sessionsDoneThisWeek(p){const ws=weekStart(today());const o={};G(p).log.filter(l=>l.date>=ws).forEach(l=>{o[l.sIdx]=(o[l.sIdx]||0)+1;});return o;}
function sessionPicker(p,idx){
  const g=G(p);const n=g.plan.sessions.length;if(n<2)return "";const done=sessionsDoneThisWeek(p);const nx=g.next%n;
  return `<p class="small muted" style="text-align:center;margin:0">Sesión ${idx+1} de ${n}${idx!==nx?" · no es la que toca":" · la que toca"}</p><div class="row" style="gap:8px;flex-wrap:nowrap"><button class="btn sm" style="flex:1" data-a="gsel" data-i="${(idx-1+n)%n}" aria-label="Sesión anterior">← Anterior</button><button class="btn sm" style="flex:1" data-a="gsel" data-i="${(idx+1)%n}" aria-label="Sesión siguiente">Siguiente →</button></div>
  <div class="chips wrap" style="justify-content:center">${g.plan.sessions.map((s,i)=>`<button class="${i===idx?"on":""}" data-a="gsel" data-i="${i}">${done[i]?"✓ ":""}${esc(s.name)}${i===nx?" · toca":""}</button>`).join("")}</div>
  ${idx!==nx?`<button class="btn ghost sm" style="align-self:center" data-a="gNext" data-i="${idx}">Poner esta como la que toca</button>`:""}`;
}
function allSetsDone(d){return d.exs.every(x=>x.skipped||x.sets_.filter(s=>!s.warm).length>=x.sets);}
function finishBanner(p){
  const d=G(p).draft;if(!d)return "";const done=d.exs.filter(x=>x.skipped||x.sets_.filter(s=>!s.warm).length>=x.sets).length;
  if(allSetsDone(d))return `<div class="alert ok finish"><span class="dot"></span><div><b>Has hecho todas las series</b>La sesión no queda guardada hasta que pulses terminar.<div style="margin-top:8px"><button class="btn pri" data-a="finishSes">Terminar y guardar la sesión</button></div></div></div>`;
  return `<p class="small muted" style="margin:0">${done} de ${d.exs.length} ejercicios completos. La sesión se guarda al pulsar «Terminar sesión».</p>`;
}
Object.assign(A,{
  planBack:el=>{const p=P();const g=G(p);const i=+el.dataset.i;const h=g.planHist[i];if(!h)return;
    const cur={date:today(),plan:JSON.parse(JSON.stringify(g.plan)),nivel:g.setup.nivel,dias:g.setup.dias.length,meta:p.meta};
    g.planHist.splice(i,1);g.planHist.unshift(cur);g.planHist=g.planHist.slice(0,5);g.plan=h.plan;g.next=g.next%g.plan.sessions.length;commit();toast("Has vuelto al plan del "+fdate(h.date)+".");},
  gNext:el=>{const g=G(P());g.next=+el.dataset.i;UI.gsel=null;commit();toast("Hecho: esta es ahora la sesión que toca.");}
});
