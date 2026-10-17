/* ===== Planes fijos escritos a mano (ahora: el de Dani, 6 días, cuidando la lumbar) =====
   Un plan fijo no se rehace solo al cambiar objetivo o nivel: solo si tú lo pides.
   El RIR, las repeticiones, los descansos, la progresión y la descarga siguen funcionando igual. */
const FIXED_PLANS={
  dani6:{name:"Recomposición 6 días · lumbar",v:2,mesoLen:7,dias:6,
    sessions:[
      ["Pecho y hombro",[["press_pecho_maquina",4,1],["press_mancuernas_inclinado",4],["contractora",3],["press_hombro_maquina",3],["elev_lat_polea",4],["face_pull",3]]],
      ["Espalda y bíceps",[["jalon",4,1],["remo_maquina",4],["jalon_neutro",3],["pullover_polea",3],["curl_bayesian",3],["curl_martillo",3]]],
      ["Pierna · cuádriceps y tríceps",[["prensa_inclinada",4,1],["hack",4],["ext_cuadriceps",3],["curl_femoral_sentado",3],["gemelo_pie",4],["jalon_triceps_cuerda",3],["ext_triceps_polea_cabeza",3]]],
      ["Hombro y pecho",[["press_hombro_mancuernas",3,1],["elev_lat_maquina",4],["pajaros",3],["press_pecho_inclinado_maquina",4],["press_mancuernas",3],["cruce_poleas",3]]],
      ["Espalda y bíceps B",[["remo_maquina",4,1],["jalon_neutro",4],["remo_unilateral_polea",3],["pullover_maquina",3],["curl_inclinado",3],["curl_predicador",3]]],
      ["Pierna · isquios, glúteo y tríceps",[["hip_thrust_maquina",4,1],["curl_femoral_tumbado",4],["prensa_horizontal",3],["abductora",3],["gemelo_sentado",4],["jalon_triceps_barra",3],["triceps_maquina",3]]]
    ]},
  dani5:{name:"Alternativo 5 días · lumbar",mesoLen:7,dias:5,
    sessions:[
      ["Pecho, hombro y gemelo",[["press_pecho_maquina",3,1],["press_mancuernas_inclinado",3],["contractora",2],["elev_lat_polea",4],["gemelo_pie",4]]],
      ["Dorsal y bíceps",[["jalon",3,1],["remo_maquina",3],["pullover_polea",2],["curl_bayesian",3]]],
      ["Pierna y tríceps",[["prensa_inclinada",4,1],["ext_cuadriceps",3],["curl_femoral_tumbado",4],["hip_thrust_maquina",3],["jalon_triceps_cuerda",3]]],
      ["Hombro, pecho y gemelo",[["elev_lat_maquina",4,1],["press_pecho_inclinado_maquina",3],["press_mancuernas",3],["cruce_poleas",2],["gemelo_sentado",4],["ext_triceps_polea_cabeza",2]]],
      ["Dorsal, bíceps y pierna en máquinas",[["remo_maquina",3,1],["jalon_neutro",3],["remo_unilateral_polea",2],["curl_inclinado",3],["prensa_horizontal",2],["ext_cuadriceps",2],["curl_femoral_sentado",2],["hip_thrust_maquina",2]]]
    ]}
};
const FIXED_WHY={
  dani6:[
    ["Objetivo","Recomposición corporal: ganar o mantener músculo mientras baja la grasa. Para eso el músculo necesita un estímulo suficiente y repetido varias veces por semana. Por eso el plan se organiza por series semanales por músculo y no por rutinas sueltas."],
    ["1. Volumen","Entre 10 y 20 series semanales por grupo muscular dan la mayor parte del crecimiento. Por debajo de 10 se progresa poco; por encima de 20 el beneficio es pequeño y la fatiga sube. Para alguien con experiencia, lo razonable es 18-22 series en los músculos grandes y 10-12 en los pequeños. El plan queda así: pecho 20, espalda 28 (14 de dorsal y 14 de espalda media), cuádriceps 20, isquios y glúteo 17, hombro lateral 8, hombro posterior 6, bíceps 12, tríceps 12 y gemelo 8. Son 6-7 ejercicios y 20-24 series por sesión, unos 60-75 minutos."],
    ["2. Frecuencia","Cada músculo, dos veces por semana. Repartir las series en dos días mantiene alta la calidad de cada serie y se recupera mejor entre sesiones."],
    ["3. Reparto de 6 días","Pecho y hombro; dorsal y bíceps; pierna con prioridad cuádriceps más tríceps; hombro y pecho; dorsal y bíceps; pierna con prioridad isquios y glúteo más tríceps. Cada día de pierna prioriza una mitad, así ninguno se hace pesado de más. El tríceps va en los días de pierna y el bíceps en los de dorsal, para no solaparse con los días de empuje o tirón que ya los usan."],
    ["4. Lumbar","Se eligen ejercicios que dan estímulo con poca carga sobre la zona lumbar: remo con apoyo de pecho en lugar de remo libre, y en pierna prensa, hack, extensión de cuádriceps, curl femoral y hip thrust antes que sentadilla o peso muerto pesados. Un día de descanso a la semana es obligatorio."],
    ["5. Progresión","Cada ejercicio tiene un rango de repeticiones. Cuando llegas al tope con buena técnica y 1 o 2 repeticiones en reserva, subes peso. Si no llegas, mantienes el peso e intentas sumar una repetición. La app compara cada serie con la misma serie de la sesión anterior y te dice si subir, mantener o tener cuidado."],
    ["6. Control de fatiga","Con 6 días la recuperación es lo más delicado. Bloques de 7 semanas: 6 de trabajo y 1 de descarga con menos series y lejos del fallo. Si durante 3 o 4 semanas el rendimiento baja con el mismo peso, o la lumbar protesta, la app te propone pasar al plan alternativo de 5 días, que queda guardado."],
    ["7. Lo que acompaña","La recomposición se decide también en la cocina: proteína alta y repartida, un déficit calórico moderado y dormir bien. Sin eso, el entrenamiento no basta."]
  ]
};
function fixedAvail(p,id){const ex=EXM[id];if(ex&&exAvailable(p,ex)&&!exBlocked(p,ex))return id;const alt=alternativesFor(p,id,"dolor","l")[0];return alt&&alt.e?alt.e.id:id;}
function makeFixedPlan(p,key){
  const F=FIXED_PLANS[key];const lv=(G(p).setup||{}).nivel||"intermedio";
  const sessions=F.sessions.map(([name,rows],i)=>{const slots=rows.map(([ex,sets,main])=>{const id=fixedAvail(p,ex);return {p:EXM[id].pat,sets,main:main?1:undefined,ex:id};});pairSupersets(slots,lv);return {key:key+"_"+i,name,slots};});
  return {created:today(),n:sessions.length,sessions,custom:key,mesoLen:F.mesoLen,title:F.name,v:F.v||1};
}
function applyFixedPlan(p,key){
  const g=G(p);
  if(g.plan&&g.plan.sessions){g.planHist=g.planHist||[];g.planHist.unshift({date:today(),plan:JSON.parse(JSON.stringify(g.plan)),nivel:(g.setup||{}).nivel,dias:((g.setup||{}).dias||[]).length,meta:p.meta,label:g.plan.title||""});}
  g.plan=makeFixedPlan(p,key);g.next=0;g.meso={start:weekStart(today())};
  /* El alternativo queda guardado para cuando haga falta */
  const alt=key==="dani6"?"dani5":null;
  if(alt){g.planHist=(g.planHist||[]).filter(h=>!(h.plan&&h.plan.custom===alt));g.planHist.unshift({date:today(),plan:makeFixedPlan(p,alt),nivel:(g.setup||{}).nivel,dias:5,meta:p.meta,label:FIXED_PLANS[alt].name+" (guardado)"});}
  g.planHist=(g.planHist||[]).slice(0,6);
}
/* Un plan fijo no se pisa con reconstrucciones automáticas (cambio de objetivo, nivel...) */
let _forceBuild=false;
const _buildGymPlanFixed=buildGymPlan;
buildGymPlan=function(p){const g=G(p);if(g.plan&&g.plan.custom&&!_forceBuild)return g.plan;return _buildGymPlanFixed(p);};
const _applyGymSetupBase=applyGymSetup;
applyGymSetup=function(p,d){const g=G(p);const keep=g.plan&&g.plan.custom;_forceBuild=!keep;try{_applyGymSetupBase(p,d);}finally{_forceBuild=false;}};
/* Bloques más largos en los planes fijos: semanas de trabajo repartidas en las 4 fases y la última, descarga */
const _mesoWeekBase=mesoWeek;
mesoWeek=function(p){
  const g=G(p);const L=g.plan&&g.plan.mesoLen;if(!L||!g.meso)return _mesoWeekBase(p);
  let w=Math.floor(daysBetween(g.meso.start,weekStart(today()))/7);while(w>=L){g.meso.start=addDays(g.meso.start,L*7);w-=L;}w=Math.max(0,w);
  if(w===L-1)return 4;return Math.min(3,Math.floor(w*4/(L-1)));
};
function blockWeek(p){const g=G(p);const L=g.plan&&g.plan.mesoLen;if(!L||!g.meso)return null;const w=Math.floor(daysBetween(g.meso.start,weekStart(today()))/7)%L;return {w:w+1,L};}
/* ¿Toca pasar al plan de 5 días? Rendimiento bajando 3 de las últimas 4 semanas, o la lumbar protestando */
function fixedSwitchHint(p){
  const g=G(p);if(!g.plan||g.plan.custom!=="dani6")return null;
  const ws=weekStart(today());let low=0;for(let i=1;i<=4;i++){const a=autoPerf(p,addDays(ws,-7*i));if(a&&a.v==="BAJA")low++;}
  const lum=(g.pains||[]).filter(x=>x.joint==="l"&&daysBetween(x.date,today())<=21).length;
  if(low>=3)return "Tu rendimiento ha bajado 3 de las últimas 4 semanas con el mismo peso.";
  if(lum>=2)return `Has marcado molestias lumbares ${lum} veces en tres semanas.`;
  return null;
}
function fixedPlanCard(p){
  const g=G(p);if(!g.plan)return "";
  if(!g.plan.custom)return `<details class="card"><summary><b>Planes escritos a mano</b><span class="small muted"> · tu plan de 6 días cuidando la lumbar</span></summary><div class="stack" style="margin-top:10px"><p class="small">Plan de 6 días con pecho, espalda y pierna dos veces por semana, ejercicios de poca carga lumbar y bloques de 7 semanas. Se guarda también una versión de 5 días por si la recuperación no da.</p><p class="small muted">Tu plan actual queda en «Planes anteriores» por si quieres volver.</p><button class="btn sm pri" data-a="fixedUse" data-k="dani6">Usar este plan</button></div></details>`;
  const why=FIXED_WHY[g.plan.custom];const bw=blockWeek(p);
  return `<div class="card stack"><div class="row between"><div><span class="lbl">Plan fijo</span><h3 style="margin:2px 0 0">${esc(g.plan.title||"")}</h3></div>${bw?`<span class="small muted">Semana ${bw.w} de ${bw.L}${bw.w===bw.L?" · descarga":""}</span>`:""}</div>
  ${(FIXED_PLANS[g.plan.custom]||{}).v&&(g.plan.v||1)!==FIXED_PLANS[g.plan.custom].v?`<div class="alert ok"><span class="dot"></span><div><b>Hay una versión nueva de este plan</b>Más ejercicios por día: 6-7 ejercicios y 20-24 series por sesión.<div style="margin-top:8px"><button class="btn sm pri" data-a="fixedUse" data-k="${g.plan.custom}">Cargar la versión nueva</button></div></div></div>`:""}
  <p class="small muted">No se rehace solo al cambiar objetivo o nivel. Puedes cambiar ejercicios en cada sesión y volver al plan automático desde «Planes anteriores».</p>
  ${why?`<details><summary class="small acc-t">Por qué este entrenamiento</summary><div class="stack learn" style="margin-top:8px">${why.map(([t,d])=>`<p><b>${esc(t)}.</b> ${esc(d)}</p>`).join("")}</div></details>`:""}</div>`;
}
function fixedHoyAlert(p){
  const h=fixedSwitchHint(p);if(!h)return "";const i=(G(p).planHist||[]).findIndex(x=>x.plan&&x.plan.custom==="dani5");
  return `<div class="alert warn"><span class="dot"></span><div><b>Quizá te convenga el plan de 5 días</b>${esc(h)} Con un día más de descanso la recuperación mejora.${i>=0?`<div style="margin-top:8px"><button class="btn sm pri" data-a="planBack" data-i="${i}">Pasar al plan de 5 días</button></div>`:""}</div></div>`;
}
const _rebuildPlanA=A.rebuildPlan;
Object.assign(A,{
  rebuildPlan:el=>{_forceBuild=true;try{_rebuildPlanA(el);}finally{_forceBuild=false;}},
  fixedUse:el=>{const p=P();applyFixedPlan(p,el.dataset.k);commit();toast("Plan de 6 días activado. El de 5 días queda guardado.");}
});
