/* ===== Cambiar ejercicios sobre la marcha · Ejercicios vetados ===== */

/* Prohibidos para todos, siempre: jalón o press tras nuca. Cargan el hombro en rotación externa
   extrema y el cuello en flexión; no aportan nada que el jalón al pecho no dé. */
const BANNED_RX=/nuca|tras la cabeza|detr[aá]s de la cabeza|behind.?the.?neck/i;
function exBanned(e){return !!e&&BANNED_RX.test(e.name||"");}
for(let i=EX.length-1;i>=0;i--)if(exBanned(EX[i]))EX.splice(i,1);

function vetados(p){const g=G(p);return g.vetado||(g.vetado=[]);}
function exVetado(p,e){return !!e&&(exBanned(e)||vetados(p).includes(e.id));}

const _exBlockedBase=exBlocked;
exBlocked=function(p,ex){return exVetado(p,ex)||_exBlockedBase(p,ex);};
const _altBase=alternativesFor;
alternativesFor=function(p,exId,reason,joint){return _altBase(p,exId,reason,joint).filter(a=>!exVetado(p,a.e));};

/* Quita de un plan cualquier ejercicio vetado o prohibido y pone la mejor alternativa */
function purgePlan(p,plan){
  if(!plan||!plan.sessions)return 0;let n=0;
  plan.sessions.forEach(s=>s.slots.forEach(sl=>{
    const e=EXM[sl.ex];if(!exVetado(p,e))return;
    const alt=alternativesFor(p,sl.ex,"otro")[0]||alternativesFor(p,sl.ex,"dolor","h")[0];
    if(alt){sl.ex=alt.e.id;sl.p=alt.e.pat;n++;}
  }));
  return n;
}
function purgeAll(p){
  const g=G(p);let n=purgePlan(p,g.plan);(g.planHist||[]).forEach(h=>n+=purgePlan(p,h.plan||h));
  if(g.draft&&g.draft.exs)g.draft.exs.forEach(it=>{if(!it.sets_.length&&exVetado(p,EXM[it.ex])){const a=alternativesFor(p,it.ex,"otro")[0];if(a){it.ex=a.e.id;n++;}}});
  return n;
}
try{Object.values(S.profiles||{}).forEach(p=>{if(p.gym)purgeAll(p);});save();}catch(e){}

/* Al elegir "No me gusta, no volver a ponerlo": vetado para siempre y cambiado en todo el plan */
const _doSwapBase=doSwap;
doSwap=function(p,ctx,newId){
  const st=UI.sw||{};const oldId=ctx.ex;
  if(st.reason==="nogusta"){const v=vetados(p);if(!v.includes(oldId))v.push(oldId);st.perm=true;}
  _doSwapBase(p,ctx,newId);
  if(st.reason==="nogusta"){
    const g=G(p);
    (g.plan?g.plan.sessions:[]).forEach(s=>s.slots.forEach(sl=>{if(sl.ex===oldId){sl.ex=newId;sl.p=EXM[newId].pat;}}));
    purgeAll(p);
  }
};

/* Lista de quitados, para poder recuperarlos */
function vetoCard(p){
  const v=vetados(p).filter(id=>EXM[id]);
  if(!v.length)return "";
  return `<div class="card stack"><span class="lbl">Ejercicios que has quitado</span>
  <p class="small muted">No vuelven a aparecer en ningún plan ni como alternativa. El jalón o press tras nuca está quitado para todos: es lesivo para el hombro.</p>
  <div class="items">${v.map(id=>`<div class="item"><span class="nm">${esc(EXM[id].name)}</span><button class="btn ghost sm" data-a="vetoOff" data-id="${id}">Recuperar</button></div>`).join("")}</div></div>`;
}

Object.assign(A,{
  vetoOff:el=>{const p=P();const g=G(p);g.vetado=vetados(p).filter(x=>x!==el.dataset.id);commit();toast("Recuperado. Puede volver a salir en tus planes.");},
  swSimple:el=>{const p=P();const s=+el.dataset.s,si=+el.dataset.si;UI.sw={};const ctx={mode:"plan",s,si,ex:G(p).plan.sessions[s].slots[si].ex};UI.sheet=()=>sheetSwapEx(P(),ctx);UI.swCtx=ctx;render();}
});

/* ===== Dieta y alimentos en una sola pestaña ===== */
function dietTabs(on){
  return `<div class="seg dtabs" role="tablist"><button role="tab" class="${on==="dieta"?"on":""}" data-a="go" data-v="dieta">Menú de la semana</button><button role="tab" class="${on==="alimentos"?"on":""}" data-a="go" data-v="alimentos">Mis alimentos</button></div>`;
}
const _viewDietaBase=viewDieta;viewDieta=function(p){return dietTabs("dieta")+_viewDietaBase(p);};
const _viewAlimBase=viewAlimentos;viewAlimentos=function(p){return dietTabs("alimentos")+_viewAlimBase(p);};
