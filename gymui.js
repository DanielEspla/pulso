/* ===== Pantallas de entrenamiento ===== */
I.dumb='<path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11"/>';
I.swap='<path d="M7 4 3 8l4 4"/><path d="M3 8h14"/><path d="m17 20 4-4-4-4"/><path d="M21 16H7"/>';
I.info='<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>';
const PRIO_OPTS=["pecho","dorsal","hombro_lat","biceps","triceps","cuadriceps","isquios","gluteo","gemelo","abdomen"];
const repTxt=x=>x.lo===30?`${x.lo}-${x.hi} s`:`${x.lo}-${x.hi} reps`;
const kg=w=>w==null||w===""?"—":nf(w,w%1?1:0)+" kg";
const restTxt=s=>s>=120?`${nf(s/60,s%60?1:0)} min`:`${s} s`;

function viewEntreno(p){
  const g=G(p);
  if(!g.setup||UI.gs)return viewGymSetup(p);
  if(UI.gsum)return viewGymSummary(p);
  if(g.draft)return viewRunner(p);
  if(!g.setup.hasOwnProperty("tecnicas"))g.setup.tecnicas=g.setup.nivel==="avanzado";
  const tabs=[["hoy","Hoy"],["plan","Plan"],["progreso","Progreso"],["ejercicios","Ejercicios"]];
  const t=UI.gtab||"hoy";
  const body={hoy:gymHoy,plan:gymPlan,progreso:gymProgreso,ejercicios:gymEjercicios}[t](p);
  return `<div class="head"><div><h1>Entreno</h1><p class="sub">${WEEK_NAMES[mesoWeek(p)]} · ${g.plan.sessions.length} sesiones por semana</p></div></div>
  <div class="seg" style="margin-bottom:16px">${tabs.map(([k,l])=>`<button class="${t===k?"on":""}" data-a="gtab" data-k="${k}">${l}</button>`).join("")}</div>${body}`;
}

/* ---- Configuración ---- */
function viewGymSetup(p){
  const g=G(p);
  if(!UI.gs)UI.gs={step:0,d:JSON.parse(JSON.stringify(g.setup||gymDefaults(p)))};
  const {step,d}=UI.gs;const N=4;
  const seg=(k,opts)=>`<div class="seg">${opts.map(([v,t])=>`<button type="button" class="${String(d[k])===String(v)?"on":""}" data-a="gsSet" data-k="${k}" data-v="${v}">${t}</button>`).join("")}</div>`;
  let h="";
  if(step===0){const gc=goalCfg(p);h=`<h2>Tu punto de partida</h2><p class="muted" style="margin:6px 0 18px">Con esto se decide el volumen, los rangos de repeticiones y cuánto te acercas al fallo.</p>
    <div class="stack"><div class="field"><span>Experiencia en el gimnasio ${infoBtn("nivel","nivel")}</span>${seg("nivel",Object.entries(NIVELES).map(([k,v])=>[k,v.split(" (")[0]]))}<span class="hint">${NIVELES[d.nivel]}. ${d.nivel==="avanzado"?"Empiezas directamente a RIR 1-2: la primera sesión de cada ejercicio sirve para calibrar el peso.":"Si dudas, elige el nivel inferior: la app te propondrá subir cuando lo notes fácil."}</span></div>
    <div class="card flat"><span class="lbl">Tu objetivo</span><p style="margin-top:4px"><b>${gc.t}</b> ${infoBtn("g_"+gc.id,gc.t)}${gc.fase?` <span class="muted small">· ${gc.fase}</span>`:""}</p><p class="small muted">El entreno se adapta a él. Puedes cambiarlo cuando quieras en Objetivos.</p></div>
    ${d.nivel!=="principiante"?`<label class="chk"><input type="checkbox" data-c="gsTec" id="gs_tec" ${d.tecnicas?"checked":""}><span>Técnicas de intensidad ${infoBtn("tecnicas","técnicas de intensidad")}<br><span class="hint">Rest-pause, descendentes, parciales y series top en la última serie. Más estímulo sin alargar la sesión.</span></span></label>`:""}</div>`;}
  if(step===1)h=`<h2>Cuándo entrenas</h2><p class="muted" style="margin:6px 0 18px">Los días que marques serán días de gimnasio en tu semana tipo y en tu dieta.</p>
    <div class="stack"><div class="field"><span>Días de gimnasio</span><div class="dchips">${DIAS.map((x,i)=>`<button type="button" class="dch ${d.dias.includes(i)?"on":""}" data-a="gsDay" data-i="${i}">${i===2?"X":x[0]}</button>`).join("")}</div><span class="hint">${d.dias.length} día${d.dias.length===1?"":"s"}: ${d.dias.length?SPLIT_TXT[Math.min(6,d.dias.length)]:"elige al menos uno"}. Deja al menos un día entre sesiones cuando puedas.</span></div>
    <div class="field"><span>Tiempo por sesión</span>${seg("duracion",DURACIONES.map(m=>[m,m+" min"]))}</div>
    <div class="field"><span>Hora a la que sueles entrenar</span>${seg("hora",Object.entries(HORAS).map(([k,v])=>[k,v.replace("Por la ","").replace("A ","")]))}<span class="hint">Sirve para colocar la comida de antes y de después del entreno.</span></div></div>`;
  if(step===2){
    const grp=(k,t)=>`<div class="field"><span>${t}</span><div class="grid2">${GYM_ITEMS.filter(x=>x[2]===k).map(([id,n])=>`<label class="chk"><input type="checkbox" data-c="gsItem" data-id="${id}" id="gi_${id}" ${d.items[id]?"checked":""}> ${n}</label>`).join("")}</div></div>`;
    h=`<h2>Tu gimnasio</h2><p class="muted" style="margin:6px 0 18px">Desmarca lo que no haya. El plan solo usará lo que tengas y, si algo falla un día, lo cambias en un toque.</p>
    <div class="row" style="margin-bottom:12px"><button class="btn sm" data-a="gsAll" data-v="1">Marcar todo</button><button class="btn sm" data-a="gsAll" data-v="0">Desmarcar todo</button></div>
    <div class="stack">${grp("base","Material general")}${grp("maquina","Máquinas")}</div>`;
  }
  if(step===3)h=`<h2>Molestias y prioridades</h2><p class="muted" style="margin:6px 0 18px">Si algo te molesta, el plan evita los ejercicios que más cargan esa zona y elige alternativas.</p>
    <div class="stack"><div class="field"><span>Zonas con molestias</span><div class="chips wrap">${Object.entries(JOINTS).map(([k,t])=>`<button type="button" class="${d.dolor[k]?"on":""}" data-a="gsJoint" data-k="${k}">${t}</button>`).join("")}</div><span class="hint">Si tienes una lesión diagnosticada o dolor que no se va, consulta antes con un fisioterapeuta o médico.</span></div>
    <div class="field"><span>Músculos que quieres priorizar (máximo 2)</span><div class="chips wrap">${PRIO_OPTS.map(m=>`<button type="button" class="${d.prio.includes(m)?"on":""}" data-a="gsPrio" data-k="${m}">${MUSCLES[m]}</button>`).join("")}</div><span class="hint">Reciben una serie más en cada sesión donde aparecen.</span></div></div>`;
  return `<div class="ob"><div class="row between"><h1>${g.setup?"Ajustes de entreno":"Tu entreno"}</h1>${g.setup?`<button class="btn ghost sm" data-a="gsCancel">Cancelar</button>`:""}</div>
  <div class="steps">${Array.from({length:N},(_,i)=>`<i class="${i<=step?"on":""}"></i>`).join("")}</div>${h}
  ${UI.err?`<p class="err" style="margin-top:14px">${esc(UI.err)}</p>`:""}
  <div class="row between" style="margin-top:22px">${step>0?`<button class="btn" data-a="gsBack">Atrás</button>`:"<span></span>"}<button class="btn pri" data-a="gsNext">${step===N-1?"Crear mi plan":"Siguiente"}</button></div></div>`;
}
function applyGymSetup(p,d){
  const g=G(p);g.setup=d;
  p.plan=p.plan||Array(7).fill("");
  for(let i=0;i<7;i++){if(d.dias.includes(i))p.plan[i]="gimnasio";else if(p.plan[i]==="gimnasio")p.plan[i]="";}
  if(!p.deporte)p.deporte="gimnasio";else if(p.deporte!=="gimnasio"&&!(p.secundarios||[]).includes("gimnasio"))(p.secundarios=p.secundarios||[]).push("gimnasio");
  p.entrenos=p.plan.filter(Boolean).length;p.recalcPending=true;
  buildGymPlan(p);
}

/* ---- Hoy ---- */
function gymHoy(p){
  const g=G(p);const td=todayGym(p);const wk=mesoWeek(p);
  const idx=UI.gsel!=null?UI.gsel:td.idx;const ses=g.plan.sessions[idx];
  const well=UI.well||"normal";const prev=sessionPreview(p,idx,well);
  const dl=deloadSuggest(p);const pa=painAlert(p);
  const last=g.log.slice().reverse().find(l=>l.date===today());
  const lu=levelUpSuggest(p);
  return `<div class="stack">
  ${lu?`<div class="alert ok"><span class="dot"></span><div><b>Te está sabiendo a poco</b>Tres sesiones seguidas pidiendo más y tu fuerza no cae. ¿Subimos a nivel ${lu}? Más series, más cerca del fallo${lu==="avanzado"?" y técnicas de intensidad":""}.<div class="row" style="margin-top:8px"><button class="btn sm pri" data-a="lvlUp" data-k="${lu}">Subir a ${lu}</button><button class="btn sm ghost" data-a="lvlNo">Todavía no</button></div></div></div>`:""}
  ${pa?`<div class="alert bad"><span class="dot"></span><div><b>Molestias repetidas en ${JOINTS[pa.joint].toLowerCase()}</b>Las has marcado ${pa.n} veces en dos semanas. Cambiar ejercicios no basta: consulta con un fisioterapeuta antes de seguir cargando esa zona.</div></div>`:""}
  ${dl?`<div class="alert warn"><span class="dot"></span><div><b>Quizá te toque descargar</b>${esc(dl)} Una semana suave ahora te deja rendir más después.<div style="margin-top:8px"><button class="btn sm" data-a="deloadNow">Hacer la descarga esta semana</button></div></div></div>`:""}
  ${last?`<div class="alert ok"><span class="dot"></span><div><b>Sesión hecha hoy: ${esc(last.name)}</b>${sessionStats(p,last).sets} series en ${last.min} minutos. Buen trabajo.</div></div>`:""}
  <div class="hero">
    <span class="lbl acc">${td.isDay&&!last?"Entrenamiento de hoy":"Siguiente sesión"}</span>
    <h2 class="disp">${esc(ses.name)}</h2>
    <p class="muted">${sessionMinutes(p,idx)} min aprox. · ${WEEK_NAMES[wk].split(" · ")[1]} · RIR ${prev.length?Math.min(...prev.map(x=>x.rir)):"-"}-${prev.length?Math.max(...prev.map(x=>x.rir)):"-"}</p>
    ${!td.isDay&&!last?`<p class="small muted">Hoy no es día de gimnasio en tu semana tipo. Puedes entrenar igualmente.</p>`:""}
    <div class="items" style="margin:6px 0 4px">${prev.map(x=>`<button class="item" data-a="ficha" data-id="${x.ex}" data-s="${idx}" data-si="${x.si}"><span class="nm">${x.ss?`<span class="tag" style="margin:0 6px 0 0">${x.ss}</span>`:""}${esc(EXM[x.ex].name)}</span><span class="q small">${x.sets} × ${repTxt(x)} · RIR ${x.rir}</span></button>`).join("")}</div>
    <div class="field"><span>¿Cómo te encuentras hoy?</span><div class="seg">${[["energia","Con energía"],["normal","Normal"],["cansado","Cansado"],["muy","Muy cansado"]].map(([k,t])=>`<button class="${well===k?"on":""}" data-a="well" data-k="${k}">${t}</button>`).join("")}</div>
    ${well==="cansado"?`<span class="hint">Hoy dejas una repetición más en reserva. Es mejor entrenar algo más suave que no entrenar.</span>`:well==="muy"?`<span class="hint">Hoy una serie menos por ejercicio y una repetición más en reserva. Mantienes el estímulo sin cavar más fatiga.</span>`:""}</div>
    <button class="btn pri wide big-btn" data-a="startSes" data-i="${idx}">Comenzar sesión</button>
    ${g.plan.sessions.length>1?`<div class="chips wrap" style="justify-content:center">${g.plan.sessions.map((s,i)=>`<button class="${i===idx?"on":""}" data-a="gsel" data-i="${i}">${esc(s.name)}</button>`).join("")}</div>`:""}
  </div></div>`;
}

/* ---- Sesión en curso ---- */
function curItem(p){const d=G(p).draft;return d.exs[d.cur];}
function viewRunner(p){
  const g=G(p);const d=g.draft;const it=d.exs[d.cur];const ex=EXM[it.ex];
  const sg=suggest(p,ex,[it.lo,it.hi],it.rir);
  const nWork=it.sets_.filter(s=>!s.warm).length;
  if(UI.rnFor!==d.cur+":"+it.ex){UI.rnFor=d.cur+":"+it.ex;const ls=it.sets_[it.sets_.length-1];UI.rnW=ls?ls.w:(sg.w??"");UI.rnR="";UI.rnRir=it.rir;UI.rnWarm=false;}
  const restLeft=UI.rest?Math.max(0,Math.ceil((UI.rest.until-Date.now())/1000)):0;
  return `<div class="runner">
  <div class="row between"><span class="lbl">${esc(d.name)} · Ejercicio ${d.cur+1} de ${d.exs.length}</span><button class="btn ghost sm" data-a="askConfirm" data-k="quitSes">Salir</button></div>
  ${UI.confirm==="quitSes"?`<div class="alert warn" style="margin-top:8px"><span class="dot"></span><div><b>¿Salir de la sesión?</b>Puedes guardar lo hecho hasta ahora o descartarlo.<div class="row" style="margin-top:8px"><button class="btn sm pri" data-a="finishSes">Guardar y terminar</button><button class="btn sm danger" data-a="discardSes">Descartar</button><button class="btn sm ghost" data-a="cancelConfirm">Seguir entrenando</button></div></div></div>`:""}
  <div class="segbar">${d.exs.map((x,i)=>`<i class="${i<d.cur||x.done?"done":""} ${i===d.cur?"cur":""}" data-a="rnGo" data-i="${i}"></i>`).join("")}</div>
  ${restLeft>0?`<div class="restbar" id="restbar"><div><span class="lbl">Descanso</span><b class="num" id="rest_n">${Math.floor(restLeft/60)}:${pad(restLeft%60)}</b></div><div class="row"><button class="btn sm" data-a="restAdd" data-v="-15">−15 s</button><button class="btn sm" data-a="restAdd" data-v="15">+15 s</button><button class="btn sm" data-a="restSkip">Saltar</button></div><i style="width:${Math.min(100,restLeft/UI.rest.total*100)}%" id="rest_i"></i></div>`:""}
  <h1 class="disp ex-title">${esc(ex.name)}</h1>
  ${it.ss?(()=>{const j=d.exs.findIndex((x,k)=>k!==d.cur&&x.ss===it.ss);return j>=0?`<p class="small acc-t"><b>Superserie ${it.ss}</b> con ${esc(EXM[d.exs[j].ex].name)}: haces una serie de cada uno y descansas al terminar la pareja.</p>`:"";})():""}
  <div class="row" style="gap:6px"><button class="btn sm" data-a="ficha" data-id="${ex.id}">${ic("info",'width="16"')} Técnica y porqué</button><button class="btn sm" data-a="swapOpen" data-i="${d.cur}">${ic("swap",'width="16"')} Cambiar</button></div>
  <div class="card stack">
    <p class="acc-t"><b>Objetivo: ${it.sets} series · ${repTxt(it)} · RIR ${it.rir}</b> ${infoBtn("rir","RIR")} <span class="muted small">· descanso ${restTxt(it.rest)}</span></p>
    ${it.tech?`<p class="tech"><b>${TECHS[it.tech][0]}</b> ${infoBtn("tecnicas","técnicas")}<br><span class="small">${TECHS[it.tech][1]}</span></p>`:""}
    ${sg.last?`<p class="small muted">${esc(sg.last)}</p>`:""}
    <p class="sug ${sg.act||""}">${esc(sg.txt)}</p>
    ${it.sets_.length?`<div class="sets">${it.sets_.map((s,i)=>`<div class="setrow ${s.warm?"warm":""}"><span>${s.warm?"Aprox.":"Serie "+(it.sets_.slice(0,i+1).filter(x=>!x.warm).length)}</span><b class="num">${s.w?kg(s.w)+" × ":""}${s.r}${ex.rep==="s"?" s":""}</b><span class="muted small">${s.warm?"":"RIR "+(s.rir>=3?"3+":s.rir)}</span><button class="btn ghost sm" data-a="delSet" data-i="${i}" aria-label="Borrar serie">${ic("x",'width="15"')}</button></div>`).join("")}</div>`:""}
    <div class="entry">
      <label class="field"><span>Peso (kg)</span><input class="inp num big-inp" type="number" step="0.5" inputmode="decimal" id="rn_w" data-i="rnW" value="${UI.rnW??""}" placeholder="${sg.w??"kg"}"></label>
      <label class="field"><span>${ex.rep==="s"?"Segundos":"Repeticiones"}</span><input class="inp num big-inp" type="number" inputmode="numeric" id="rn_r" data-i="rnR" value="${UI.rnR??""}" placeholder="${it.lo}-${it.hi}"></label>
    </div>
    ${UI.rnWarm?"":`<div class="field"><span>¿Cuántas repeticiones más podrías haber hecho?</span><div class="rir">${[0,1,2,3].map(v=>`<button class="${UI.rnRir===v?"on":""}" data-a="rnRir" data-v="${v}">${v===3?"3+":v}</button>`).join("")}</div></div>`}
    <div class="row between"><label class="chk sm-chk"><input type="checkbox" data-c="rnWarm" id="rn_warm" ${UI.rnWarm?"checked":""}> Serie de aproximación</label>
    <button class="btn pri" data-a="addSet">Guardar serie</button></div>
    ${nWork>=it.sets?`<p class="small good">Series del objetivo completadas. Pasa al siguiente ejercicio.</p>`:""}
  </div>
  <div class="row between">${d.cur>0?`<button class="btn" data-a="rnGo" data-i="${d.cur-1}">← Anterior</button>`:"<span></span>"}
  ${d.cur<d.exs.length-1?`<button class="btn pri" data-a="rnNext">Siguiente ejercicio →</button>`:`<button class="btn pri" data-a="finishSes">Terminar sesión</button>`}</div>
  <div class="card"><span class="lbl">Sesión</span><div class="items">${d.exs.map((x,i)=>`<button class="item" data-a="rnGo" data-i="${i}"><span class="nm">${i===d.cur?"▸ ":""}${esc(EXM[x.ex].name)}${x.ex!==x.orig?` <span class="small muted">(cambiado)</span>`:""}</span><span class="q small">${x.sets_.filter(s=>!s.warm).length}/${x.sets}</span></button>`).join("")}</div></div>
  </div>`;
}
function tickRest(){
  if(!UI.rest)return;const left=Math.max(0,Math.ceil((UI.rest.until-Date.now())/1000));
  const n=document.getElementById("rest_n"),i=document.getElementById("rest_i");
  if(n)n.textContent=`${Math.floor(left/60)}:${pad(left%60)}`;
  if(i)i.style.width=Math.min(100,left/UI.rest.total*100)+"%";
  if(left<=0){UI.rest=null;try{navigator.vibrate&&navigator.vibrate([200,100,200]);}catch(e){}toast("Descanso terminado. A por la siguiente serie.");}
}
function viewGymSummary(p){
  const e=UI.gsum;const st=sessionStats(p,e);
  return `<div class="stack"><div class="hero"><span class="lbl acc">Sesión terminada</span><h2 class="disp">${esc(e.name)}</h2>
  <div class="grid3"><div><span class="lbl">Series</span><div class="v2">${st.sets}</div></div><div><span class="lbl">Minutos</span><div class="v2">${e.min}</div></div><div><span class="lbl">Kilos movidos</span><div class="v2">${nf(st.vol,0)}</div></div></div>
  ${st.prs.length?`<div class="alert ok"><span class="dot"></span><div><b>Mejoras de rendimiento</b>${st.prs.map(x=>`${esc(EXM[x.ex].name)}: fuerza estimada ${nf(x.pb,0)} → ${nf(x.b,0)} kg`).join("<br>")}</div></div>`:`<p class="small muted">Sin récords hoy. No pasa nada: el progreso se mide en semanas, no en sesiones.</p>`}
  <div class="field"><span>¿Cómo te ha sabido la sesión?</span>
    <div class="fb3">${[["mas","Puedo más","Una serie más la próxima vez"],["justo","Justa","Seguimos igual"],["menos","Demasiado","Una serie menos"]].map(([k,t,d])=>`<button class="${e.fb===k?"on":""}" data-a="fbSes" data-k="${k}"><b>${t}</b><span>${d}</span></button>`).join("")}</div>
    ${e.fb?`<span class="hint">${e.fb==="mas"?"Anotado: los músculos de hoy tendrán una serie más en su próxima sesión.":e.fb==="menos"?"Anotado: una serie menos para esos músculos. Recuperar también es entrenar.":"Perfecto, seguimos con el plan."}</span>`:""}</div>
  <p class="small muted">Para recuperar: proteína en las próximas horas y dormir bien esta noche. Es cuando el músculo se reconstruye.</p>
  <button class="btn pri wide" data-a="closeSum">Hecho</button></div></div>`;
}

/* ---- Cambiar ejercicio ---- */
function sheetSwapEx(p,ctx){
  const exId=ctx.ex;const ex=EXM[exId];const st=UI.sw||{};
  const reasons=[["ocupada","Está ocupada"],["nohay","No la hay en mi gimnasio"],["dolor","Me molesta"],["otro","Prefiero otro"]];
  let body="";
  if(!st.reason)body=`<p class="muted" style="margin-bottom:12px">¿Qué pasa?</p><div class="stack">${reasons.map(([k,t])=>`<button class="btn wide" style="justify-content:flex-start" data-a="swR" data-k="${k}">${t}</button>`).join("")}</div>`;
  else if(st.reason==="dolor"&&!st.joint)body=`<p class="muted" style="margin-bottom:12px">¿Dónde lo notas?</p><div class="chips wrap">${Object.entries(JOINTS).map(([k,t])=>`<button data-a="swJ" data-k="${k}">${t}</button>`).join("")}</div>
    <button class="btn danger wide" style="margin-top:14px" data-a="swJ" data-k="agudo">Es un dolor fuerte o punzante</button>`;
  else if(st.joint==="agudo")body=`<div class="alert bad"><span class="dot"></span><div><b>Para este ejercicio hoy</b>Un dolor fuerte o punzante no se arregla cambiando de máquina. No cargues esa zona y consúltalo con un fisioterapeuta o médico. Puedes seguir con los ejercicios que no la impliquen.</div></div>
    ${ctx.mode==="ses"?`<button class="btn wide" style="margin-top:12px" data-a="skipEx">Saltar este ejercicio</button>`:""}`;
  else{
    const alts=alternativesFor(p,exId,st.reason,st.joint);
    const permDefault=st.reason==="nohay"||st.reason==="dolor";
    if(st.perm==null)st.perm=permDefault;
    body=`${st.reason==="dolor"?`<p class="small muted" style="margin-bottom:8px">Ordenadas por menor carga en ${JOINTS[st.joint].toLowerCase()} y mismo músculo. Si la molestia sigue en la alternativa, para.</p>`:""}
    ${ctx.mode==="ses"?`<label class="chk" style="margin-bottom:10px"><input type="checkbox" data-c="swPerm" id="sw_perm" ${st.perm?"checked":""}><span>Cambiarlo también en mi plan<br><span class="hint">Si no, solo cambia en la sesión de hoy.</span></span></label>`:""}
    ${alts.length?`<div class="items">${alts.map(a=>`<button class="item alt" data-a="swDo" data-id="${a.e.id}"><span class="nm"><b>${esc(a.e.name)}</b><span class="small muted">${a.why.join(" · ")||MUSCLES[a.e.prim]}</span></span><span class="q">${ic("chev",'width="18"')}</span></button>`).join("")}</div>`:`<p class="muted">No hay alternativas con tu material. Revisa «Mi gimnasio» en los ajustes de entreno.</p>`}`;
  }
  return `<div class="sheet-h"><div><span class="lbl">Cambiar</span><h2>${esc(ex.name)}</h2></div><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  ${st.reason?`<button class="btn ghost sm" data-a="swBack" style="margin:-6px 0 8px -8px">${ic("chevl",'width="15"')} Atrás</button>`:""}${body}`;
}
function doSwap(p,ctx,newId){
  const g=G(p);const st=UI.sw||{};const old=EXM[ctx.ex];
  if(st.reason==="nohay"){g.noHay=g.noHay||[];if(!g.noHay.includes(old.id))g.noHay.push(old.id);old.req.forEach(r=>{if(GYM_ITEM[r]&&GYM_ITEM[r].k==="maquina")g.setup.items[r]=false;});}
  if(st.reason==="dolor"&&st.joint)(g.pains=g.pains||[]).push({date:today(),joint:st.joint,ex:old.id});
  const ne=EXM[newId];
  if(ctx.mode==="ses"){
    const d=g.draft;const it=d.exs[ctx.i];const slot=g.plan.sessions[d.sIdx].slots[it.si];
    const range=repRange(p,ne,slot);
    const nu={...it,ex:newId,lo:range[0],hi:range[1],rir:rirTarget(p,ne,d.week)+(d.wellness==="cansado"||d.wellness==="muy"?1:0),rest:restFor(p,ne,slot)};
    if(it.sets_.length){it.done=true;nu.sets_=[];nu.sets=Math.max(1,it.sets-it.sets_.filter(s=>!s.warm).length);d.exs.splice(ctx.i+1,0,nu);d.cur=ctx.i+1;}
    else{nu.sets_=[];d.exs[ctx.i]=nu;}
    if(st.perm&&slot)slot.ex=newId;
  }else{
    const slot=g.plan.sessions[ctx.s].slots[ctx.si];slot.ex=newId;
  }
  UI.sw=null;UI.sheet=null;
}

/* ---- Ficha de ejercicio ---- */
function sheetFicha(p,id,slot){
  const ex=EXM[id];const h=exHistory(p,id).slice(-4).reverse();const g=G(p);
  const like=(g.likes||{})[id]||0;
  const range=repRange(p,ex,slot),rest=restFor(p,ex,slot);
  const sts=Object.entries(ex.st).filter(([,v])=>v>0).map(([k,v])=>`${JOINTS[k]}${v>=2?" (alta)":""}`);
  return `<div class="sheet-h"><div><span class="lbl">${PATTERNS[ex.pat]}</span><h2>${esc(ex.name)}</h2></div><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <div class="stack">
  <p><b>${MUSCLES[ex.prim]}</b>${ex.sec.length?` <span class="muted">· también ${ex.sec.map(m=>MUSCLES[m]?MUSCLES[m].toLowerCase():"").filter(Boolean).join(", ")}</span>`:""}</p>
  <div><span class="lbl">Por qué está en tu plan</span><ul class="tight">${whyEx(p,ex,slot).map(w=>`<li>${esc(w)}</li>`).join("")}</ul></div>
  <div><span class="lbl">Técnica</span><ol class="tight">${ex.cues.map(c=>`<li>${esc(c)}</li>`).join("")}</ol></div>
  <div class="alert"><span class="dot"></span><div><b>Error típico</b>${esc(ex.err)}</div></div>
  <div class="grid2"><div><span class="lbl">Rango</span><p class="num">${range[0]}-${range[1]} ${ex.rep==="s"?"segundos":"repeticiones"}</p></div><div><span class="lbl">Descanso</span><p>${restTxt(rest)}</p></div>
  <div><span class="lbl">Material</span><p class="small">${ex.req.filter(Boolean).map(r=>GYM_ITEM[r].t).join(", ")||"Peso corporal"}</p></div><div><span class="lbl">Exige a</span><p class="small">${sts.join(", ")||"Articulaciones sin carga especial"}</p></div></div>
  ${h.length?`<div><span class="lbl">Tus últimas veces</span>${h.map(x=>`<p class="small num">${fdate(x.date)}: ${x.sets.map(s=>(s.w?nf(s.w,s.w%1?1:0)+"×":"")+s.r).join(", ")} <span class="muted">· fuerza est. ${nf(bestE1(x.sets),0)} kg</span></p>`).join("")}</div>`:""}
  <a class="btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name+" técnica")}" target="_blank" rel="noopener">Ver vídeos de la técnica</a>
  <div class="row"><button class="btn sm ${like===1?"pri":""}" data-a="exLike" data-id="${id}" data-v="1">Me gusta</button><button class="btn sm ${like===-1?"danger":""}" data-a="exLike" data-id="${id}" data-v="-1">Prefiero evitarlo</button></div>
  </div>`;
}

/* ---- Plan ---- */
function gymPlan(p){
  const g=G(p);const wk=mesoWeek(p);const s=g.setup;const vol=plannedVolume(p);
  const order=Object.keys(MUSCLES).filter(m=>vol[m]);
  const ed=edadDe(p);
  return `<div class="stack">
  <div class="card stack"><div class="row between"><span class="lbl">Bloque actual</span><span class="small muted">5 semanas</span></div>
    <div class="weeks">${WEEK_NAMES.map((w,i)=>`<div class="${i===wk?"on":""} ${i===4?"dl":""}"><b>S${i+1}</b><span>${i===4?"Descarga":"RIR "+(s.nivel==="principiante"?[3,3,2,2][i]:[3,2,2,1][i])}</span></div>`).join("")}</div>
    <p class="small">${wk===4?"Semana de descarga: la mitad de series y lejos del fallo. La fatiga se va y el músculo consolida lo ganado.":`Cada semana te acercas un poco más al fallo y en las semanas 3 y 4 sube el número de series. Después toca una semana de descarga.`}</p>
    ${wk<4?`<button class="btn sm" data-a="deloadNow">Adelantar la descarga a esta semana</button>`:""}</div>
  ${g.plan.sessions.map((ses,si)=>`<div class="card stack"><div class="row between"><h3>${esc(ses.name)}</h3><span class="small muted">${sessionMinutes(p,si)} min</span></div>
    <div class="items">${sessionPreview(p,si).map((x,i)=>`<div class="item plan-it"><button class="nm linklike" data-a="ficha" data-id="${x.ex}" data-s="${si}" data-si="${i}"><span>${esc(EXM[x.ex].name)}</span><span class="small muted num">${x.ss?`<span class="tag" style="margin:0 4px 0 0">Superserie ${x.ss}</span>`:""}${x.tech?`<span class="tag" style="margin:0 4px 0 0">${TECHS[x.tech][0]}</span>`:""}${x.sets} × ${repTxt(x)} · RIR ${x.rir} · ${MUSCLES[EXM[x.ex].prim]}</span></button><button class="btn ghost sm" data-a="swapPlan" data-s="${si}" data-si="${i}" aria-label="Cambiar ejercicio">${ic("swap",'width="16"')}</button></div>`).join("")}</div></div>`).join("")}
  <div class="card stack"><span class="lbl">Series por músculo a la semana</span>
    <div class="vol">${order.map(m=>`<div><span>${MUSCLES[m]}</span><div class="vbar"><i style="width:${Math.min(100,vol[m]/22*100)}%"></i><em style="left:${10/22*100}%"></em><em style="left:${20/22*100}%"></em></div><b class="num">${nf(vol[m],vol[m]%1?1:0)}</b></div>`).join("")}</div>
    ${(()=>{const low=["pecho","dorsal","espalda_media","cuadriceps","isquios","gluteo"].filter(m=>(vol[m]||0)<10);return low.length?`<p class="small">Con ${s.dias.length} día${s.dias.length>1?"s":""} de ${s.duracion} minutos, descansando lo que pide la ciencia, no caben 10 series semanales en ${low.map(m=>MUSCLES[m].toLowerCase()).join(", ")}. Sigue siendo un estímulo eficaz, sobre todo en déficit, donde el objetivo es conservar. Si quieres más volumen, sube a ${s.duracion<90?s.duracion+15+" minutos":"más días"} en «Cambiar ajustes de entreno»: la app rellena el tiempo extra con series para los músculos que van más cortos.</p>`:"";})()}
    <p class="small muted">Las marcas señalan 10 y 20 series: la zona donde la mayoría de la gente crece. Los secundarios cuentan como media serie.</p></div>
  <details class="card"><summary><b>Tu plan explicado</b><span class="small muted"> · por qué está montado así</span></summary><div class="stack learn" style="margin-top:12px">
    <p><b>Reparto.</b> ${SPLIT_WHY[Math.min(6,g.plan.sessions.length)]}</p>
    <p><b>Volumen.</b> La investigación muestra que el músculo crece más con más series semanales hasta cierto punto, con el mejor equilibrio entre 10 y 20 series por músculo. Empiezas ${s.nivel==="principiante"?"en la parte baja, porque al principio con poco se gana mucho":s.nivel==="avanzado"?"en la parte alta, porque con experiencia hace falta más estímulo":"en la zona media"}${p.objetivo==="perder"?", algo recortado porque en déficit se recupera peor; lo importante ahora es mantener la intensidad para conservar el músculo":p.objetivo==="ganar"?", algo más alto porque comiendo de más recuperas mejor":""}${ed>=50?". Por tu edad se ajusta un poco a la baja y se prioriza recuperar bien entre sesiones":""}.</p>
    <p><b>Esfuerzo (RIR).</b> RIR son las repeticiones que te quedan en reserva al terminar una serie. Las series que crecen son las que acaban cerca del fallo, pero ir siempre al fallo genera mucha fatiga. Por eso empiezas a RIR 3 y bajas semana a semana. En máquinas y aislamientos puedes apurar más; en los básicos con barra, nunca al fallo${ed>=60?", y a tu edad los básicos se quedan a RIR 2 como mínimo":""}.</p>
    <p><b>Repeticiones.</b> Para ganar músculo valen rangos amplios (de 5 a 30) si llegas cerca del fallo. Los ejercicios grandes van en rangos más bajos porque se cargan mejor con peso; los pequeños, en rangos más altos porque con poco peso se trabajan sin estresar las articulaciones.</p>
    <p><b>Progresión doble.</b> Primero sumas repeticiones dentro del rango. Cuando llegas arriba en todas las series con margen, subes peso y vuelves a la parte baja. Es la forma más fiable de progresar sin estancarte.</p>
    <p><b>Tiempo y superseries.</b> Cada sesión se monta para caber en los ${s.duracion} minutos que elegiste, contando calentamiento, series y descansos reales. Para meter más trabajo sin acortar descansos, algunos ejercicios van en superserie: haces una serie de uno, pasas al otro y descansas al terminar la pareja. Solo se emparejan ejercicios que no compiten entre sí (empuje con tirón, o dos músculos pequeños distintos), así que no pierdes rendimiento. Los ejercicios principales van siempre solos.</p>
    <p><b>Descansos.</b> Entre 2 y 3 minutos en los ejercicios grandes y alrededor de 1 minuto en los pequeños. Por debajo de un minuto se levanta menos y se crece algo menos; por encima de 2-3 minutos apenas se gana más. Descansar poco no quema más grasa: solo te hace levantar menos peso.</p>
    <p><b>Descarga.</b> Cada 5 semanas, una semana suave. Se va la fatiga acumulada y aparece lo ganado. Si el rendimiento cae antes, la app te propone adelantarla.</p>
    <p><b>Selección de ejercicios.</b> Se priorizan los que cargan el músculo en estiramiento, los estables (máquinas y poleas) para poder acercarte al fallo con seguridad y, si marcaste molestias, los que menos cargan esa zona.</p>
  </div></details>
  <div class="row"><button class="btn" data-a="gsOpen">Cambiar ajustes de entreno</button>${UI.confirm==="rebuild"?`<button class="btn danger" data-a="rebuildPlan">Sí, rehacer</button><button class="btn ghost" data-a="cancelConfirm">No</button>`:`<button class="btn ghost" data-a="askConfirm" data-k="rebuild">Rehacer plan</button>`}</div>
  </div>`;
}

/* ---- Progreso ---- */
function spark(vals){
  if(vals.length<2)return "";const W=90,H=26;const mn=Math.min(...vals),mx=Math.max(...vals);const sp=mx-mn||1;
  const pts=vals.map((v,i)=>`${(i/(vals.length-1)*W).toFixed(1)},${(H-2-(v-mn)/sp*(H-4)).toFixed(1)}`).join(" ");
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="1.8"/><circle cx="${W}" cy="${pts.split(" ").pop().split(",")[1]}" r="2.6" fill="var(--accent)"/></svg>`;
}
function gymProgreso(p){
  const g=G(p);const ws=weekStart(today());const done=doneVolume(p,ws);const plan=plannedVolume(p);
  const ses=g.log.filter(l=>weekStart(l.date)===ws).length;
  const ap=autoPerf(p,ws)||autoPerf(p,addDays(ws,-7));
  const ids=[...new Set(g.log.flatMap(l=>l.exs.map(e=>e.ex)))].filter(id=>EXM[id]);
  const rows=ids.map(id=>{const h=exHistory(p,id);const v=h.map(x=>bestE1(x.sets));return {id,h,v,ch:v.length>1?(v[v.length-1]-v[0])/v[0]*100:null};}).filter(r=>r.v.some(x=>x>0)).sort((a,b)=>b.h.length-a.h.length);
  return `<div class="stack">
  <div class="grid3"><div class="stat"><span class="lbl">Sesiones</span><div class="v">${ses}<small>/ ${g.setup.dias.length}</small></div><div class="d">esta semana</div></div>
  <div class="stat"><span class="lbl">Rendimiento</span><div class="v ${ap?(ap.v==="MEJORA"?"good":ap.v==="BAJA"?"bad":""):""}" style="font-size:1.1rem">${ap?{MEJORA:"Mejora",ESTABLE:"Estable",BAJA:"Baja"}[ap.v]:"—"}</div><div class="d">${ap?sgn(ap.med,1)+" % fuerza est.":"Faltan datos"}</div></div>
  <div class="stat"><span class="lbl">Sesiones totales</span><div class="v">${g.log.length}</div><div class="d">${g.log.length?"desde "+fdate(g.log[0].date):"empieza hoy"}</div></div></div>
  ${ap?`<p class="small muted">Este dato pasa solo a tu revisión semanal de la dieta: si en déficit tu fuerza cae, la app sube hidratos.</p>`:""}
  <div class="card stack"><span class="lbl">Series hechas esta semana</span><div class="vol">${Object.keys(MUSCLES).filter(m=>plan[m]).map(m=>`<div><span>${MUSCLES[m]}</span><div class="vbar"><i style="width:${Math.min(100,(done[m]||0)/Math.max(plan[m],1)*100)}%"></i></div><b class="num">${nf(done[m]||0,(done[m]||0)%1?1:0)}/${nf(plan[m],plan[m]%1?1:0)}</b></div>`).join("")}</div></div>
  <div class="card"><span class="lbl">Fuerza estimada por ejercicio</span>
  ${rows.length?`<div class="items">${rows.map(r=>`<button class="item" data-a="ficha" data-id="${r.id}"><span class="nm">${esc(EXM[r.id].name)}<span class="small muted"> · ${r.h.length} sesiones</span></span><span class="q row" style="gap:10px">${spark(r.v)}<span class="num small ${r.ch>0?"good":r.ch<0?"bad":""}">${nf(r.v[r.v.length-1],0)} kg${r.ch!=null?` (${sgn(r.ch,0)} %)`:""}</span></span></button>`).join("")}</div>`:`<p class="muted small" style="margin-top:8px">Aún no hay sesiones registradas.</p>`}
  <p class="hint" style="margin-top:8px">Fuerza estimada = el peso que podrías mover una vez, calculado con tus series y tu RIR. Sirve para comparar sesiones aunque cambies de peso o repeticiones.</p></div>
  ${g.log.length?`<div class="card"><span class="lbl">Últimas sesiones</span><div class="items">${g.log.slice(-8).reverse().map(l=>{const s=sessionStats(p,l);return `<div class="item"><span class="nm">${fdate(l.date)} · ${esc(l.name)}<span class="small muted"> · ${l.min} min${l.wellness==="muy"||l.wellness==="cansado"?" · cansado":""}</span></span><span class="q small">${s.sets} series${s.prs.length?` · ${s.prs.length} mejora${s.prs.length>1?"s":""}`:""}</span></div>`;}).join("")}</div></div>`:""}
  ${(g.pains||[]).length?`<div class="card"><span class="lbl">Molestias registradas</span>${g.pains.slice(-6).reverse().map(x=>`<p class="small">${fdate(x.date)} · ${JOINTS[x.joint]} · ${esc(EXM[x.ex]?EXM[x.ex].name:x.ex)}</p>`).join("")}</div>`:""}
  </div>`;
}

/* ---- Biblioteca ---- */
function gymEjercicios(p){
  const q=(UI.eq||"").toLowerCase();const pat=UI.epat||"";
  const list=EX.filter(e=>(!q||e.name.toLowerCase().includes(q)||MUSCLES[e.prim].toLowerCase().includes(q))&&(!pat||e.pat===pat));
  return `<div class="stack"><input class="inp" type="search" placeholder="Buscar ejercicio o músculo" id="esearch" data-c="esearch" value="${esc(UI.eq||"")}">
  <div class="chips">${[["","Todos"],...Object.entries(PATTERNS)].map(([k,t])=>`<button class="${pat===k?"on":""}" data-a="epat" data-k="${k}">${t}</button>`).join("")}</div>
  <div class="card"><div class="items">${list.map(e=>{const av=exAvailable(p,e)&&!(G(p).noHay||[]).includes(e.id);const pn=exPain(p,e);return `<button class="item ${av?"":"dim"}" data-a="ficha" data-id="${e.id}"><span class="nm">${esc(e.name)}<span class="small muted"> · ${MUSCLES[e.prim]}${!av?" · no disponible":""}${pn>=2?" · carga tu zona con molestias":""}</span></span><span class="q small muted">${e.S?"Estiramiento":""}</span></button>`;}).join("")||`<p class="muted">Nada coincide.</p>`}</div></div>
  <p class="hint">${EX.length} ejercicios. Toca uno para ver la técnica, por qué sirve y tus registros.</p></div>`;
}

/* ---- Tarjeta para Inicio ---- */
function gymHomeCard(p){
  const g=G(p);
  if(!g.setup)return `<div class="card row between"><div><span class="lbl">Entreno</span><p>Configura tu plan de gimnasio en dos minutos.</p></div><button class="btn pri" data-a="go" data-v="entreno">Empezar</button></div>`;
  const td=todayGym(p);if(!td)return "";
  if(g.draft)return `<div class="hero row between"><div><span class="lbl acc">Sesión en curso</span><h3 class="disp">${esc(g.draft.name)}</h3></div><button class="btn pri" data-a="go" data-v="entreno">Continuar</button></div>`;
  if(td.doneToday)return `<div class="card row between"><div><span class="lbl">Entreno</span><p>Sesión de hoy hecha. Siguiente: ${esc(td.session.name)}.</p></div><button class="btn" data-a="go" data-v="entreno">Ver</button></div>`;
  return `<div class="hero row between"><div><span class="lbl acc">${td.isDay?"Entrenamiento de hoy":"Siguiente sesión"}</span><h3 class="disp">${esc(td.session.name)}</h3><p class="small muted">${sessionMinutes(p,td.idx)} min · ${WEEK_NAMES[mesoWeek(p)].split(" · ")[1]}</p></div><button class="btn pri" data-a="go" data-v="entreno">${td.isDay?"Entrenar":"Ver"}</button></div>`;
}

/* ---- Acciones ---- */
Object.assign(A,{
  gtab:el=>{UI.gtab=el.dataset.k;UI.confirm=null;render();},
  gsOpen:()=>{UI.gs=null;UI.gs={step:0,d:JSON.parse(JSON.stringify(G(P()).setup||gymDefaults(P())))};render();window.scrollTo(0,0);},
  gsCancel:()=>{UI.gs=null;UI.err=null;render();},
  gsSet:el=>{const v=el.dataset.v;UI.gs.d[el.dataset.k]=/^\d+$/.test(v)?+v:v;render();},
  gsDay:el=>{const d=UI.gs.d;const i=+el.dataset.i;d.dias=d.dias.includes(i)?d.dias.filter(x=>x!==i):[...d.dias,i].sort();render();},
  gsAll:el=>{const v=el.dataset.v==="1";GYM_ITEMS.forEach(([id])=>UI.gs.d.items[id]=v);render();},
  gsJoint:el=>{const d=UI.gs.d;d.dolor[el.dataset.k]=d.dolor[el.dataset.k]?0:1;render();},
  gsPrio:el=>{const d=UI.gs.d;const k=el.dataset.k;if(d.prio.includes(k))d.prio=d.prio.filter(x=>x!==k);else if(d.prio.length<2)d.prio.push(k);else toast("Máximo dos músculos prioritarios");render();},
  gsBack:()=>{UI.gs.step--;UI.err=null;render();},
  gsNext:()=>{const {step,d}=UI.gs;
    if(step===1&&!d.dias.length){UI.err="Elige al menos un día de gimnasio.";render();return;}
    if(step===2&&!GYM_ITEMS.some(([id])=>d.items[id])){UI.err="Marca al menos algo de material.";render();return;}
    UI.err=null;if(step<3){UI.gs.step++;render();window.scrollTo(0,0);return;}
    const p=P();applyGymSetup(p,d);UI.gs=null;UI.gtab="plan";commit();window.scrollTo(0,0);toast("Plan creado. Revisa por qué está montado así.");},
  gsel:el=>{UI.gsel=+el.dataset.i;render();},
  well:el=>{UI.well=el.dataset.k;render();},
  startSes:el=>{const p=P();startSession(p,+el.dataset.i,UI.well||"normal");UI.gsel=null;UI.rnFor=null;commit();window.scrollTo(0,0);},
  rnRir:el=>{UI.rnRir=+el.dataset.v;render();},
  addSet:()=>{const p=P();const d=G(p).draft;const it=d.exs[d.cur];const ex=EXM[it.ex];
    const w=parseFloat(String(document.getElementById("rn_w").value).replace(",","."));const r=parseInt(document.getElementById("rn_r").value,10);
    if(!(r>0&&r<300)){toast(ex.rep==="s"?"Indica los segundos":"Indica las repeticiones");return;}
    if(incFor(ex)&&!(w>=0&&w<1000)){toast("Indica el peso");return;}
    it.sets_.push({w:isNaN(w)?0:w,r,rir:UI.rnWarm?null:UI.rnRir,warm:!!UI.rnWarm});
    UI.rnW=isNaN(w)?"":w;UI.rnR="";
    if(!UI.rnWarm){
      const nWork=it.sets_.filter(s=>!s.warm).length;if(nWork>=it.sets)it.done=true;
      const j=it.ss?d.exs.findIndex((x,k)=>k!==d.cur&&x.ss===it.ss&&!x.done&&!x.skipped):-1;
      const nj=j>=0?d.exs[j].sets_.filter(s=>!s.warm).length:0;
      if(j>=0&&nj<nWork){UI.rest={until:Date.now()+20000,total:20};d.cur=j;toast(`Superserie: ahora ${EXM[d.exs[j].ex].name}`);}
      else{UI.rest={until:Date.now()+it.rest*1000,total:it.rest};if(j>=0&&j<d.cur&&d.exs[j].sets_.filter(s=>!s.warm).length<d.exs[j].sets)d.cur=j;}
    }
    commit();},
  delSet:el=>{const d=G(P()).draft;d.exs[d.cur].sets_.splice(+el.dataset.i,1);commit();},
  rnGo:el=>{const d=G(P()).draft;d.cur=+el.dataset.i;UI.confirm=null;commit();window.scrollTo(0,0);},
  rnNext:()=>{const d=G(P()).draft;d.exs[d.cur].done=true;d.cur=Math.min(d.exs.length-1,d.cur+1);commit();window.scrollTo(0,0);},
  restAdd:el=>{if(UI.rest){UI.rest.until+=(+el.dataset.v)*1000;UI.rest.total=Math.max(UI.rest.total,Math.ceil((UI.rest.until-Date.now())/1000));}render();},
  restSkip:()=>{UI.rest=null;render();},
  finishSes:()=>{const p=P();const e=finishSession(p);UI.confirm=null;UI.rest=null;UI.gsum=e&&e.exs.length?e:null;if(!UI.gsum)toast("Sesión cerrada sin series registradas");commit();window.scrollTo(0,0);},
  discardSes:()=>{G(P()).draft=null;UI.confirm=null;UI.rest=null;commit();},
  fbSes:el=>{const p=P();const e=UI.gsum;const real=G(p).log.find(l=>l.id===e.id);applyFeedback(p,real||e,el.dataset.k);UI.gsum=real||e;commit();},
  lvlUp:el=>{const p=P();const g=G(p);g.setup.nivel=el.dataset.k;if(el.dataset.k!=="principiante")g.setup.tecnicas=true;g.adj={};buildGymPlan(p);commit();toast("Nivel subido. Plan rehecho.");},
  lvlNo:()=>{const g=G(P());const l=g.log.filter(x=>x.fb).slice(-1)[0];g.lvlAsked=l&&l.id;commit();},
  closeSum:()=>{UI.gsum=null;UI.gtab="hoy";render();},
  skipEx:()=>{const d=G(P()).draft;d.exs[d.cur].done=true;d.exs[d.cur].skipped=true;UI.sheet=null;UI.sw=null;if(d.cur<d.exs.length-1)d.cur++;commit();},
  swapOpen:el=>{const p=P();const d=G(p).draft;const i=+el.dataset.i;UI.sw={};const ctx={mode:"ses",i,ex:d.exs[i].ex};UI.sheet=()=>sheetSwapEx(P(),ctx);UI.swCtx=ctx;render();},
  swapPlan:el=>{const p=P();const s=+el.dataset.s,si=+el.dataset.si;UI.sw={};const ctx={mode:"plan",s,si,ex:G(p).plan.sessions[s].slots[si].ex};UI.sheet=()=>sheetSwapEx(P(),ctx);UI.swCtx=ctx;render();},
  swR:el=>{UI.sw.reason=el.dataset.k;render();},
  swJ:el=>{UI.sw.joint=el.dataset.k;if(el.dataset.k==="agudo")(G(P()).pains=G(P()).pains||[]).push({date:today(),joint:"agudo",ex:UI.swCtx.ex});render();},
  swBack:()=>{if(UI.sw.joint)UI.sw.joint=null;else UI.sw={};render();},
  swDo:el=>{const p=P();doSwap(p,UI.swCtx,el.dataset.id);commit();toast("Ejercicio cambiado");},
  ficha:el=>{const p=P();const id=el.dataset.id;let slot=null;if(el.dataset.s!=null&&G(p).plan){const s=G(p).plan.sessions[+el.dataset.s];slot=s&&s.slots[+el.dataset.si];}UI.sheet=()=>sheetFicha(P(),id,slot);render();},
  exLike:el=>{const g=G(P());g.likes=g.likes||{};const v=+el.dataset.v;g.likes[el.dataset.id]=g.likes[el.dataset.id]===v?0:v;commit();},
  epat:el=>{UI.epat=el.dataset.k;render();},
  deloadNow:()=>{const g=G(P());g.meso={start:addDays(weekStart(today()),-28)};commit();toast("Esta semana es de descarga");},
  rebuildPlan:()=>{const p=P();buildGymPlan(p);UI.confirm=null;commit();toast("Plan rehecho");}
});
Object.assign(CHG,{
  gsItem:el=>{UI.gs.d.items[el.dataset.id]=el.checked;},
  gsTec:el=>{UI.gs.d.tecnicas=el.checked;},
  rnWarm:el=>{UI.rnWarm=el.checked;render();},
  swPerm:el=>{UI.sw.perm=el.checked;},
  esearch:el=>{UI.eq=el.value;render();const s=document.getElementById("esearch");if(s){s.focus();s.setSelectionRange(s.value.length,s.value.length);}}
});
document.addEventListener("input",e=>{
  const el=e.target.closest("[data-i]");if(el&&el.tagName==="INPUT"&&el.dataset.i.startsWith("rn"))UI[el.dataset.i]=el.value;
  const es=e.target.closest('[data-c="esearch"]');if(es)CHG.esearch(es);
});

