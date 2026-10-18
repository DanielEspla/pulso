/* ===== Logros: racha semanal, medallas y récords =====
   Todo se calcula con los datos que ya guarda la app (incluidos los entrenos importados de PULSO).
   Premia constancia y hábitos, nunca bajar peso rápido ni comer menos de lo que marca el objetivo. */
const TIERS=[["bronce","Bronce"],["plata","Plata"],["oro","Oro"],["platino","Platino"]];
const TONS_EQ=[[6,"un elefante africano"],[40,"un camión de 40 toneladas cargado"],[150,"una ballena azul"],[575,"un Airbus A380 al despegar"]];

/* ---- Datos base ---- */
function lgSessions(p){return ((p.gym&&p.gym.log)||[]).filter(s=>s.exs&&s.exs.length).slice().sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0);}
function lgTons(p){return lgSessions(p).reduce((a,s)=>a+s.exs.reduce((b,x)=>b+x.sets.filter(t=>!t.warm).reduce((c,t)=>c+(t.w||0)*(t.r||0),0),0),0)/1000;}
/* Récords: cada vez que la fuerza estimada de un ejercicio supera la mejor anterior */
function lgRecords(p){
  const best={},list=[];
  lgSessions(p).forEach(s=>s.exs.forEach(x=>{
    const ws=x.sets.filter(t=>!t.warm&&t.r>0&&t.w>0);if(!ws.length)return;
    const b=Math.max(...ws.map(t=>e1rm(t.w,t.r,t.rir)));
    if(best[x.ex]!=null&&b>best[x.ex]*1.005)list.push({ex:x.ex,date:s.date,b,pb:best[x.ex]});
    if(best[x.ex]==null||b>best[x.ex])best[x.ex]=b;
  }));
  return {list,best};
}
function lgBestOf(best,ids){return Math.max(0,...ids.map(id=>best[id]||0));}
function lgMenuMeals(p,date){const m=p.menus&&p.menus[weekStart(date)];if(!m)return 0;const d=m.days[daysBetween(weekStart(date),date)];return d?d.meals.length:0;}
function lgDoneByDate(p){const o={};Object.entries(p.done||{}).forEach(([k,v])=>{if(!v)return;const d=k.split(":")[0];o[d]=(o[d]||0)+1;});return o;}
function lgFullDays(p){const o=lgDoneByDate(p);return Object.keys(o).filter(d=>{const n=lgMenuMeals(p,d);return n&&o[d]>=n;}).length;}
function lgWeighStreak(p){const ds=Object.keys(p.weights||{}).filter(d=>p.weights[d]).sort();let best=0,cur=0,prev=null;ds.forEach(d=>{cur=prev&&daysBetween(prev,d)===1?cur+1:1;best=Math.max(best,cur);prev=d;});return best;}
/* Solo cuentan semanas ya cerradas y seguidas de verdad (80 % de comidas hechas): generar un menú no da medallas */
function lgMedWeeks(p){let hi=0,leg=0;const cur=weekStart(today());Object.entries(p.menus||{}).forEach(([ws,m])=>{if(!m||!m.days||ws>=cur)return;const st=lgWeekStatus(p,ws);if(!st.totalMeals||st.done<st.totalMeals*0.8)return;const r=medas(p,m);if(r.ok>=r.n-3)hi++;if(r.q.some(q=>q[0].startsWith("Legumbres")&&q[1]))leg++;});return {hi,leg};}
function lgWaistLoss(p){const v=Object.values(p.checkins||{}).map(c=>c&&c.cintura).filter(Boolean);if(!v.length||!p.cintura0)return 0;return Math.max(0,p.cintura0-Math.min(...v));}

/* ---- Racha semanal ---- */
function lgWeekStatus(p,ws){
  const end=addDays(ws,6);const inW=d=>d>=ws&&d<=end;
  const g=p.gym;const plannedGym=g&&g.setup?(g.setup.dias||[]).length:0;
  const ses=lgSessions(p).filter(s=>inW(s.date)).length;
  const weigh=Object.keys(p.weights||{}).filter(d=>p.weights[d]&&inW(d)).length;
  const menu=p.menus&&p.menus[ws];const totalMeals=menu?menu.days.reduce((a,d)=>a+d.meals.length,0):0;
  const done=Object.entries(p.done||{}).filter(([k,v])=>v&&inW(k.split(":")[0])).length;
  const descarga=!!(g&&g.meso&&Math.floor(daysBetween(g.meso.start,ws)/7)%5===4);
  const pausa=!!(p.pausa&&p.pausa.desde<=end);
  const checks=[];
  if(plannedGym&&!descarga)checks.push(["Entrenos",ses>=plannedGym,`${Math.min(ses,plannedGym)} de ${plannedGym}`]);
  checks.push(["Pesajes",weigh>=(pausa?3:5),`${weigh} de ${pausa?3:5}`]);
  if(NUTRI&&totalMeals&&!pausa)checks.push(["Comidas hechas",done>=Math.ceil(totalMeals*0.8),`${done} de ${Math.ceil(totalMeals*0.8)}`]);
  return {ok:checks.every(c=>c[1]),checks,ses,weigh,done,totalMeals,descarga,pausa};
}
function lgStreak(p){
  const start=weekStart(p.creado||today());const cur=weekStart(today());
  const firstLog=lgSessions(p)[0];const st=firstLog&&weekStart(firstLog.date)<start?weekStart(firstLog.date):start;
  let streak=0,best=0,lastJoker=-99,i=0;
  for(let w=st;w<cur;w=addDays(w,7),i++){
    if(lgWeekStatus(p,w).ok){streak++;}
    else if(streak>0&&i-lastJoker>=8){lastJoker=i;streak++;}
    else streak=0;
    best=Math.max(best,streak);
  }
  const jokerReady=i-lastJoker>=8;
  return {streak,best,jokerReady,week:lgWeekStatus(p,cur)};
}

/* ---- Medallas ---- */
function xPeso(k){return k===1?"Tu peso":k===2?"El doble de tu peso":nf(k,k%1?(String(k).length>3?2:1):0)+" veces tu peso";}
function lgStrengthFactors(p){return p.sexo==="M"?{banca:0.65,sentadilla:1,muerto:1.5}:{banca:1,sentadilla:1.5,muerto:2};}
function lgMedals(p){
  const ses=lgSessions(p).length;const tons=lgTons(p);const rec=lgRecords(p);const S_=lgStreak(p);
  const mw=lgMedWeeks(p);const bw=currentWeight(p);const F=lgStrengthFactors(p);
  const gymWeeks=(()=>{const g=p.gym;if(!g||!g.setup)return 0;const n=(g.setup.dias||[]).length;const by={};lgSessions(p).forEach(s=>{const k=weekStart(s.date);by[k]=(by[k]||0)+1;});return Object.values(by).filter(v=>v>=n).length;})();
  const lv=((p.gym&&p.gym.lvlUps)||[]).length;
  const bf=bodyFat(p,bw,currentWaist(p));
  const M=[
    {id:"sesiones",fam:"gym",t:"Sesiones",d:"Entrenamientos terminados.",v:ses,th:[10,50,100,250],u:"sesiones"},
    {id:"toneladas",fam:"gym",t:"Kilos movidos",d:"Toneladas levantadas en series efectivas.",v:tons,th:TONS_EQ.map(x=>x[0]),u:"t",eq:TONS_EQ},
    {id:"records",fam:"gym",t:"Récords",d:"Veces que superas tu mejor fuerza estimada en un ejercicio.",v:rec.list.length,th:[1,10,25,50],u:"récords"},
    {id:"semgym",fam:"gym",t:"Semanas completas",d:"Semanas con todos los entrenos planificados hechos.",v:gymWeeks,th:[4,12,26,52],u:"semanas"},
    {id:"nivel",fam:"gym",t:"Subir de nivel",d:"Pasar de principiante a intermedio y de intermedio a avanzado cuando la app te lo propone.",v:lv,th:[1,2],u:"niveles"},
    {id:"banca",fam:"gym",t:`${xPeso(F.banca)} en banca`,d:"Fuerza estimada en press de banca respecto a tu peso.",v:lgBestOf(rec.best,["press_banca"])/bw,th:[F.banca],u:"× peso",one:true,fmt:x=>nf(x,2)},
    {id:"sentadilla",fam:"gym",t:`${xPeso(F.sentadilla)} en sentadilla`,d:"Fuerza estimada en sentadilla con barra respecto a tu peso.",v:lgBestOf(rec.best,["sentadilla","sentadilla_frontal"])/bw,th:[F.sentadilla],u:"× peso",one:true,fmt:x=>nf(x,2)},
    {id:"muerto",fam:"gym",t:`${xPeso(F.muerto)} en peso muerto`,d:"Fuerza estimada en peso muerto respecto a tu peso.",v:lgBestOf(rec.best,["peso_muerto","peso_muerto_hex"])/bw,th:[F.muerto],u:"× peso",one:true,fmt:x=>nf(x,2)},
    {id:"comidas",fam:"dieta",t:"Comidas hechas",d:"Comidas del menú marcadas como hechas.",v:Object.values(p.done||{}).filter(Boolean).length,th:[25,100,300,1000],u:"comidas"},
    {id:"diascompletos",fam:"dieta",t:"Días redondos",d:"Días con todas las comidas del menú hechas: proteína y calorías cumplidas.",v:lgFullDays(p),th:[7,30,90,180],u:"días"},
    {id:"pesajes",fam:"dieta",t:"Pesajes seguidos",d:"Tu mejor racha de días seguidos pesándote.",v:lgWeighStreak(p),th:[14,30,60,120],u:"días"},
    {id:"checkins",fam:"dieta",t:"Revisiones semanales",d:"Semanas con medidas registradas.",v:Object.values(p.checkins||{}).filter(c=>c&&Object.keys(c).length).length,th:[4,12,26,52],u:"semanas"},
    {id:"medit",fam:"dieta",t:"Muy mediterránea",d:"Semanas con nota mediterránea alta en tu menú.",v:mw.hi,th:[1,4,12,26],u:"semanas"},
    {id:"legumbre",fam:"dieta",t:"Semanas de legumbre",d:"Semanas con legumbre tres veces o más.",v:mw.leg,th:[1,4,12,26],u:"semanas"},
    p.objetivo!=="ganar"?{id:"cintura",fam:"cuerpo",t:"Cintura",d:"Centímetros de cintura perdidos desde el inicio.",v:lgWaistLoss(p),th:[3,5,10,15],u:"cm",fmt:x=>nf(x,1)}:null,
    p.objetivo!=="ganar"?{id:"grasaobj",fam:"cuerpo",t:"Objetivo de grasa",d:`Llegar a tu objetivo de ${nf(p.grasaObj,0)} % de grasa estimada.`,v:bf<=p.grasaObj?1:0,th:[1],u:"",one:true,bin:true}:null,
    {id:"cardio",fam:"cuerpo",t:"Cardio",d:"Sesiones de cardio apuntadas.",v:((p.gym&&p.gym.cardioLog)||[]).length,th:[10,50,100,250],u:"sesiones"},
    {id:"movilidad",fam:"cuerpo",t:"Movilidad y equilibrio",d:"Rutinas de movilidad hechas.",v:((p.gym&&p.gym.mobLog)||[]).length,th:[10,50,100,250],u:"sesiones"},
    {id:"racha",fam:"cuerpo",t:"Racha semanal",d:"Tu mejor racha de semanas cumplidas.",v:S_.best,th:[4,12,26,52],u:"semanas"}
  ].filter(Boolean).filter(m=>NUTRI||!["comidas","diascompletos","medit","legumbre"].includes(m.id));
  if(!NUTRI)M.forEach(m=>{if(m.fam==="dieta")m.fam="cuerpo";});
  M.forEach(m=>{m.tier=m.th.filter(x=>m.v>=x).length;m.next=m.th[m.tier];m.pct=m.next?Math.min(1,m.v/m.next):1;});
  return M;
}
function tierName(m,t){if(m.one||m.th.length===1)return "Conseguida";if(m.id==="nivel")return t===1?"Intermedio":"Avanzado";return TIERS[t-1][1];}
function tierCls(m,t){if(m.one||m.th.length===1)return "oro";if(m.id==="nivel")return t===1?"plata":"oro";return TIERS[t-1][0];}
function fmtV(m,v){return m.fmt?m.fmt(v):m.u==="t"?nf(v,v<10?1:0):nf(Math.floor(v),0);}
function medalSvg(cls,on){return `<svg viewBox="0 0 40 48" class="medal ${on?cls:"off"}" aria-hidden="true"><path d="M12 2h6l4 12h-6zM28 2h-6l-4 12h6z" class="rib"/><circle cx="20" cy="30" r="14" class="disc"/><circle cx="20" cy="30" r="9.5" class="inner"/></svg>`;}

/* ---- Celebraciones ---- */
function lgSnapshot(p){const o={};lgMedals(p).forEach(m=>o[m.id]=m.tier);return o;}
function checkLogros(){
  const p=P();if(!p||!p.targets)return;
  if(p.gym&&p.gym.draft)return;
  let snap;try{snap=lgSnapshot(p);}catch(e){return;}
  if(!p.logros){p.logros={seen:snap,sumSeen:weekStart(today())};const got=lgMedals(p).filter(m=>m.tier>0);if(got.length){UI.lgNew={hist:true,list:got.map(m=>[m.id,m.tier])};}return;}
  const nw=Object.keys(snap).filter(k=>snap[k]>(p.logros.seen[k]||0));
  if(nw.length){nw.forEach(k=>p.logros.seen[k]=snap[k]);UI.lgNew={list:nw.map(k=>[k,snap[k]])};}
}
function sheetLogro(){
  const p=P();const M=Object.fromEntries(lgMedals(p).map(m=>[m.id,m]));const L=(UI.lgShow||{}).list||[];const hist=(UI.lgShow||{}).hist;
  return `<div class="sheet-h"><div><span class="lbl acc">${hist?"Tu historial ya cuenta":"Medalla nueva"}</span><h2>${hist?`${L.length} medalla${L.length>1?"s":""} desbloqueada${L.length>1?"s":""}`:L.length>1?`${L.length} medallas nuevas`:esc(M[L[0][0]].t)}</h2></div><button class="btn ghost sm" data-a="lgClose">${ic("x",'width="18"')}</button></div>
  <div class="stack">${L.map(([id,t])=>{const m=M[id];if(!m)return "";return `<div class="lgrow">${medalSvg(tierCls(m,t),true)}<div><b>${esc(m.t)} · ${tierName(m,t)}</b><span class="small muted">${esc(lgReach(m,t))}</span></div></div>`;}).join("")}
  <button class="btn pri wide" data-a="lgGo">Ver mis logros</button></div>`;
}
function lgReach(m,t){const th=m.th[t-1];if(m.eq)return `${nf(th,0)} toneladas: lo que pesa ${m.eq[t-1][1]}.`;if(m.bin)return m.d;if(m.one)return m.d;const u=th===1?({sesiones:"sesión","récords":"récord",semanas:"semana",comidas:"comida","días":"día",niveles:"nivel"}[m.u]||m.u):m.u;return `${fmtV(m,th)} ${u}. ${m.d}`;}

/* ---- Pantallas ---- */
function lgNextMedal(p){return lgMedals(p).filter(m=>m.next!=null&&m.v>0).sort((a,b)=>b.pct-a.pct)[0];}
function logrosHomeCard(p){
  const s=lgStreak(p);const n=lgNextMedal(p);const wk=s.week;
  return `<button class="card lgcard" data-a="go" data-v="logros"><div class="row between"><div><span class="lbl">Racha</span><div class="v2 num">${s.streak} <small>semana${s.streak===1?"":"s"}</small></div></div>
  <div class="lgchecks">${wk.checks.map(c=>`<span class="${c[1]?"ok":""}">${c[1]?"✓":"·"} ${c[0]}</span>`).join("")}</div></div>
  ${n?`<div class="small muted" style="margin-top:8px">Próxima medalla: <b style="color:var(--ink)">${esc(n.t)}</b> · ${fmtV(n,n.v)} de ${fmtV(n,n.next)} ${n.u}</div>`:""}</button>`;
}
function weeklySummary(p){
  const lw=addDays(weekStart(today()),-7);const end=addDays(lw,6);const inW=d=>d>=lw&&d<=end;
  const ses=lgSessions(p).filter(s=>inW(s.date));
  const tons=ses.reduce((a,s)=>a+s.exs.reduce((b,x)=>b+x.sets.filter(t=>!t.warm).reduce((c,t)=>c+(t.w||0)*(t.r||0),0),0),0)/1000;
  const recs=lgRecords(p).list.filter(r=>inW(r.date));
  const menu=p.menus&&p.menus[lw];const md=menu?medas(p,menu):null;
  const ks=Object.keys(p.checkins||{}).sort().filter(k=>p.checkins[k]&&p.checkins[k].cintura);const ci=p.checkins[lw]&&p.checkins[lw].cintura;const prevK=ks.filter(k=>k<lw).pop();
  const dW=ci&&prevK?ci-p.checkins[prevK].cintura:null;
  const st=lgWeekStatus(p,lw);const n=lgNextMedal(p);
  if(!ses.length&&!st.weigh&&!st.done)return null;
  return {lw,ses:ses.length,tons,recs,md,dW,ok:st.ok,n};
}
function weeklySummaryCard(p){
  const wd=(new Date().getDay()+6)%7;if(wd>2)return "";
  const lg=p.logros||{};const lw=addDays(weekStart(today()),-7);if(lg.sumClosed===lw)return "";
  const r=weeklySummary(p);if(!r)return "";
  const cell=(l,v)=>`<div><span class="lbl">${l}</span><div class="v2 num">${v}</div></div>`;
  return `<div class="card stack"><div class="row between"><div><span class="lbl acc">Tu semana</span><h2 style="margin:2px 0 0">Del ${fdate(r.lw)} al ${fdate(addDays(r.lw,6))}</h2></div><button class="btn ghost sm" data-a="lgSumClose" aria-label="Cerrar">${ic("x",'width="16"')}</button></div>
  <div class="grid3">${cell("Entrenos",r.ses)}${cell("Toneladas",nf(r.tons,1))}${cell("Récords",r.recs.length)}</div>
  <div class="grid3">${NUTRI?cell("Nota mediterránea",r.md?`${r.md.ok}/${r.md.n}`:"—"):""}${cell("Cintura",r.dW!=null?sgn(r.dW,1)+" cm":"—")}${cell("Semana",r.ok?"Cumplida":"Pendiente")}</div>
  ${r.recs.length?`<p class="small">${r.recs.slice(0,3).map(x=>`${esc(EXM[x.ex]?EXM[x.ex].name:x.ex)}: ${nf(x.b,1)} kg`).join(" · ")}</p>`:""}
  ${r.n?`<p class="small muted">Lo más cerca: ${esc(r.n.t)}, ${fmtV(r.n,r.n.v)} de ${fmtV(r.n,r.n.next)} ${r.n.u}.</p>`:""}</div>`;
}
function viewLogros(p){
  const s=lgStreak(p);const M=lgMedals(p);const rec=lgRecords(p);
  const fams=[["gym","Gimnasio"],...(NUTRI?[["dieta","Dieta"]]:[]),["cuerpo","Cuerpo y constancia"]];
  const tops=Object.entries(rec.best).filter(([id])=>EXM[id]).sort((a,b)=>b[1]-a[1]).slice(0,12);
  const lastRec=id=>{const l=rec.list.filter(r=>r.ex===id).pop();return l?l.date:null;};
  return `<div class="head"><div><h1>Logros</h1><p class="sub">Constancia, hábitos y fuerza.</p></div></div>
  <div class="stack">
  <div class="hero"><span class="lbl acc">Racha semanal ${infoBtn("racha","racha semanal")}</span>
    <div class="row between"><div class="v2 disp">${s.streak} <small>semana${s.streak===1?"":"s"}</small></div><span class="small muted">Mejor: ${s.best} · Comodín ${s.jokerReady?"disponible":"usado"}</span></div>
    <div class="lgchecks big">${s.week.checks.map(c=>`<span class="${c[1]?"ok":""}">${c[1]?"✓":"·"} ${c[0]} <i>${c[2]}</i></span>`).join("")}</div>
    <p class="small muted">${s.week.ok?"Esta semana ya está cumplida.":"Esta semana va en curso: se cierra el domingo."}${s.week.descarga?" Semana de descarga: los entrenos no cuentan.":""}</p></div>
  ${fams.map(([f,t])=>{const L=M.filter(m=>m.fam===f);if(!L.length)return "";return `<h2 style="margin-top:6px">${t}</h2><div class="lggrid">${L.map(m=>`<div class="lgm ${m.tier?"on":""}">${medalSvg(m.tier?tierCls(m,m.tier):"",!!m.tier)}<div class="lgt"><b>${esc(m.t)}</b><span class="small ${m.tier?"acc":"muted"}">${m.tier?tierName(m,m.tier):"Sin conseguir"}</span>
    ${m.next!=null?`<div class="bar sm"><i style="width:${Math.max(2,m.pct*100)}%"></i></div><span class="small muted">${m.bin?"Pendiente":`${fmtV(m,m.v)} de ${fmtV(m,m.next)} ${m.u}`}${m.eq&&m.next?` · ${m.eq[m.tier][1]}`:""}</span>`:`<span class="small muted">${m.eq?`Has levantado más que ${m.eq[m.eq.length-1][1]}.`:m.one||m.th.length===1?esc(m.d):"Máximo nivel"}</span>`}</div></div>`).join("")}</div>`;}).join("")}
  <h2 style="margin-top:6px">Tus récords</h2>
  ${tops.length?`<div class="card"><table class="t"><thead><tr><th>Ejercicio</th><th>Fuerza estimada</th><th>Último récord</th></tr></thead><tbody>${tops.map(([id,b])=>`<tr><td>${esc(EXM[id].name)}</td><td class="num">${nf(b,1)} kg</td><td class="num muted">${lastRec(id)?fdate(lastRec(id)):"—"}</td></tr>`).join("")}</tbody></table><p class="small muted" style="margin-top:8px">Fuerza estimada: el peso que podrías levantar una vez, calculado con tus series (peso, repeticiones y las que te quedaban en reserva).</p></div>`:`<div class="card"><p class="muted">Cuando registres entrenos aparecerán aquí tus mejores marcas.</p></div>`}
  </div>`;
}
