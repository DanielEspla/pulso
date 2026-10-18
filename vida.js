/* ===== Día a día: familia, hora de entreno por día, tarjeta de la mañana, salidas fijas y suplementos ===== */

/* ---- Hora de entreno de cada día ---- */
function gymHourOf(p,di){const s=(p.gym&&p.gym.setup)||{};return (s.horas&&s.horas[di])||s.hora||"tarde";}
const HORA_TXT={manana:"por la mañana",mediodia:"a mediodía",tarde:"por la tarde",noche:"por la noche"};

/* ---- Familia: cocinas para más gente ----
   Tu ración va pesada; el resto se calcula como raciones normales (adulto = tu ración, niño = 60 %). */
function famFactor(p){const f=p.familia||{};return (+f.adultos||0)+(+f.ninos||0)*0.6;}
function famMeal(p,m){const f=p.familia||{};if(!famFactor(p)||m.fuera||m.type!=="p")return false;const w=f.comidas||"ambas";return w==="ambas"||(w==="comida"&&m.name==="Comida")||(w==="cena"&&m.name==="Cena");}
function famPeople(p){const f=p.familia||{};const a=+f.adultos||0,n=+f.ninos||0;return [a?`${a} adulto${a>1?"s":""}`:"",n?`${n} niño${n>1?"s":""}`:""].filter(Boolean).join(" y ");}
function familiaCard(p){
  const f=p.familia||{};const step=(k,v)=>`<div class="row" style="gap:6px"><button class="btn sm" data-a="famStep" data-k="${k}" data-v="-1" aria-label="Menos">−</button><b class="num" style="min-width:18px;text-align:center">${+f[k]||0}</b><button class="btn sm" data-a="famStep" data-k="${k}" data-v="1" aria-label="Más">+</button></div>`;
  return `<details class="card" ${famFactor(p)?"open":""}><summary><b>Cocinas para más gente</b><span class="small muted"> · ${famFactor(p)?"además de ti, "+famPeople(p):"solo tú"}</span></summary>
  <div class="stack" style="margin-top:10px"><div class="row between"><span>Otros adultos</span>${step("adultos")}</div><div class="row between"><span>Niños</span>${step("ninos")}</div>
  ${famFactor(p)?`<div class="field"><span>Comidas que compartís</span><div class="seg">${[["ambas","Comida y cena"],["comida","Solo comida"],["cena","Solo cena"]].map(([k,t])=>`<button class="${(f.comidas||"ambas")===k?"on":""}" data-a="famCom" data-k="${k}">${t}</button>`).join("")}</div></div>`:""}
  <p class="small muted">La lista de la compra y las recetas suman sus raciones. Tú pesas la tuya; ellos comen lo mismo en ración normal (un niño, más o menos el 60 %). Desayunos y meriendas son solo tuyos.</p></div></details>`;
}
/* Suma las raciones de la familia a la lista de la compra */
const _shopBuildBase=shopBuild;
shopBuild=function(p,menu,opt={}){
  const k=famFactor(p);if(!k)return _shopBuildBase(p,menu,opt);
  const m2=JSON.parse(JSON.stringify(menu));
  m2.days.forEach(d=>d.meals.forEach(m=>{if(!famMeal(p,m))return;
    m.items.forEach(it=>{const f=FOOD[it.id];if(!f||["F","N","D","B"].includes(f.r))return;it.q=f.u?Math.ceil(it.q*(1+k)):it.q*(1+k);});}));
  const rows=_shopBuildBase(p,m2,opt);
  rows.forEach(r=>{r.uses=r.uses.map(u=>u);});
  return rows;
};
function famRecipeNote(p,m){
  const k=famFactor(p);if(!k||!famMeal(p,m))return "";
  const L=m.items.map(it=>({f:FOOD[it.id],q:it.q})).filter(x=>x.q&&!["F","N","D","B"].includes(x.f.r)&&!(x.f.id==="aove"));
  if(!L.length)return "";
  return `<div class="card flat"><span class="lbl">Para todos (tú y ${esc(famPeople(p))})</span><ul class="small" style="margin:6px 0 0;padding-left:18px">${L.map(x=>`<li>${esc(x.f.name)}: <b>${x.f.u?Math.ceil(x.q*(1+k))+" "+x.f.un:gtxt(x.q*(1+k))}</b> en total · tu parte, ${x.f.u?x.q+" "+x.f.un:Math.round(x.q)+" g"}</li>`).join("")}</ul><p class="small muted" style="margin-top:6px">Cocina todo junto y separa tu ración pesada antes de servir. El aceite de los demás, a su gusto.</p></div>`;
}

/* ---- Salidas fijas (picoteo, tapas...) ----
   Se reservan al generar el menú: esa comida queda como «fuera» y el resto del día se reajusta. */
function salidas(p){return p.salidas||[];}
function applySalidas(p,menu){
  salidas(p).forEach(s=>{const day=menu.days[s.dia];if(!day)return;const mi=day.meals.findIndex(m=>m.name===s.comida);if(mi<0)return;
    const date=addDays(menu.week,s.dia);if(p.done&&p.done[`${date}:${mi}`])return;
    day.meals[mi].fuera={label:s.label,kcal:s.kcal,fija:true};rebalanceDay(menu,s.dia);});
}
const _buildWeekBase=buildWeek;
buildWeek=function(p,ws){const m=_buildWeekBase(p,ws);try{applySalidas(p,m);}catch(e){}return m;};
function salidasCard(p){
  const L=salidas(p);
  return `<details class="card" ${L.length?"":""}><summary><b>Salidas fijas</b><span class="small muted"> · ${L.length?L.map(s=>`${DIAS3[s.dia]} ${s.comida.toLowerCase()}`).join(", "):"ninguna"}</span></summary>
  <div class="stack" style="margin-top:10px"><p class="small muted">Si sales a picar o a cenar fuera siempre el mismo día, déjalo reservado: al generar el menú esa comida queda libre y el resto del día se ajusta para que la semana cuadre.</p>
  ${L.map((s,i)=>`<div class="row between"><span>${DIAS[s.dia]} · ${esc(s.comida)} · ${esc(s.label)} <span class="muted small">≈ ${s.kcal} kcal</span></span><button class="btn ghost sm" data-a="salDel" data-i="${i}" aria-label="Quitar">${ic("x",'width="15"')}</button></div>`).join("")}
  <button class="btn sm" data-a="salOpen">Añadir salida fija</button></div></details>`;
}
function sheetSalida(){
  const p=P();const st=UI.sal||{dia:4,comida:"Cena",k:3};const set=MEAL_SETS[p.comidas]||MEAL_SETS["4"];
  return `<div class="sheet-h"><h2>Salida fija</h2><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <div class="stack"><div class="field"><span>Día</span><div class="seg">${DIAS3.map((d,i)=>`<button class="${st.dia===i?"on":""}" data-a="salSet" data-k="dia" data-v="${i}">${d}</button>`).join("")}</div></div>
  <div class="field"><span>Comida</span><div class="seg">${set.map(x=>x[0]).map(n=>`<button class="${st.comida===n?"on":""}" data-a="salSet" data-k="comida" data-v="${n}">${n}</button>`).join("")}</div></div>
  <div class="field"><span>Qué sueles tomar</span><div class="items">${FUERA_PRESETS.map(([l,k],i)=>`<button class="item ${st.k===i?"on":""}" data-a="salSet" data-k="k" data-v="${i}"><span class="nm">${esc(l)}</span><span class="q small">≈ ${k} kcal</span></button>`).join("")}</div></div>
  <button class="btn pri wide" data-a="salSave">Guardar</button><p class="small muted">Se aplica también al menú de esta semana si esa comida no está hecha.</p></div>`;
}

/* ---- Suplementos ---- */
const SUPLS={
  creatina:["Creatina","3-5 g al día, cualquier hora. Es el suplemento con más pruebas para fuerza y músculo, y no hace falta cargarla."],
  vitd:["Vitamina D","La dosis de tu envase o la que te haya pautado tu médico. Mejor con una comida que lleve grasa."],
  omega3:["Omega 3","La dosis del envase, con una comida. Más importante si no comes pescado."],
  proteina:["Proteína en polvo","Solo si no llegas a tu proteína con la comida. Para que cuente en tus macros, márcala como «Me gusta» en Alimentos y la app la mete en el menú."],
  magnesio:["Magnesio","La dosis del envase, mejor por la noche."],
  cafeina:["Cafeína antes de entrenar","3 mg por kilo como mucho, 30-60 min antes. No por la tarde-noche si te quita el sueño."]
};
function suplOn(p){return p.supl||[];}
function suplToday(p){return ((p.suplDone||{})[today()])||[];}
function suplLine(p){
  const L=suplOn(p);if(!L.length)return `<button class="btn ghost sm" data-a="suplOpen">Añadir suplementos</button>`;
  const d=suplToday(p);
  return `<div class="chips wrap">${L.map(id=>`<button class="${d.includes(id)?"on":""}" data-a="suplTick" data-k="${id}">${d.includes(id)?"✓ ":""}${esc(SUPLS[id][0])}</button>`).join("")}<button class="ghost" data-a="suplOpen">Editar</button></div>`;
}
function sheetSupl(){
  const p=P();const L=suplOn(p);
  return `<div class="sheet-h"><h2>Tus suplementos</h2><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <div class="stack">${Object.entries(SUPLS).map(([id,[t,d]])=>`<label class="chk"><input type="checkbox" data-c="suplSel" data-k="${id}" id="sp_${id}" ${L.includes(id)?"checked":""}><span><b>${t}</b><br><span class="small muted">${esc(d)}</span></span></label>`).join("")}
  <p class="small muted">Los suplementos complementan, no sustituyen a la comida. Si tomas medicación, consulta con tu médico antes de añadir alguno.</p>
  <button class="btn pri wide" data-a="closeSheet">Listo</button></div>`;
}

/* ---- Tarjeta de la mañana ---- */
function morningCard(p){
  const ws=weekStart(today());const di=(new Date().getDay()+6)%7;const menu=NUTRI&&p.menus&&p.menus[ws];
  const g=p.gym;const gymToday=g&&g.setup&&(g.setup.dias||[]).includes(di);const doneGym=g&&g.log&&g.log.some(l=>l.date===today());
  let meals="";let prep=[];
  if(menu){const day=menu.days[di];
    meals=day.meals.map((m,mi)=>{const k=`${today()}:${mi}`;const main=m.fuera?m.fuera.label:m.items.filter(it=>["P","C"].includes(FOOD[it.id].r)).map(it=>FOOD[it.id].name).slice(0,2).join(" con ").toLowerCase();
      return `<div class="mrow ${p.done[k]?"ok":""}"><button class="mk" data-a="done" data-k="${k}" aria-label="Marcar ${esc(m.name)}">${p.done[k]?"✓":""}</button><div><b>${esc(m.name)}</b><span class="small muted">${esc(main||"")}</span></div></div>`;}).join("");
    /* Qué sacar o preparar: carne o pescado de la cena de hoy y de la comida de mañana */
    const tm=di<6?menu.days[di+1]:(p.menus[addDays(ws,7)]||{days:[]}).days[0];
    const cena=day.meals.find(m=>m.name==="Cena"&&!m.fuera);const com=tm&&tm.meals.find(m=>m.name==="Comida"&&!m.fuera);
    const fresh=m=>m?m.items.map(it=>FOOD[it.id]).filter(f=>f.r==="P"&&["Carnicería","Pescadería"].includes(f.sec)):[];
    fresh(com).forEach(f=>prep.push(`${f.name.toLowerCase()} para la comida de mañana`));
    const C=cena?cena.items.map(it=>FOOD[it.id]).filter(f=>["hervir","horno","guiso"].includes(f.m)&&["C","P"].includes(f.r)):[];
    if(C.length)prep.push(`la cena lleva ${C.map(f=>f.name.toLowerCase()).join(" y ")}: si llegas justo, déjalo hecho a mediodía`);
  }
  const fam=famFactor(p)?` · cocinas para ${1+(+(p.familia||{}).adultos||0)+(+(p.familia||{}).ninos||0)}`:"";
  return `<div class="card stack morning"><div class="row between"><div><span class="lbl acc">Hoy</span><h2 style="margin:2px 0 0">${fdateL(today())}</h2></div>${NUTRI?`<div class="row" style="gap:6px"><button class="btn sm" data-a="dietaOpen">Cambiar dieta</button><button class="btn sm" data-a="go" data-v="dieta">Menú</button></div>`:""}</div>
  ${!NUTRI?"":menu?`<div class="mlist">${meals}</div>`:`<p class="small muted">Sin menú esta semana. <button class="btn sm pri" data-a="go" data-v="dieta">Generarlo</button></p>`}
  ${prep.length?`<p class="small"><b>Saca o prepara:</b> ${esc(prep.join("; "))}${fam}.</p>`:""}
  ${g&&g.setup?`<p class="small">${gymToday?(doneGym?"Entreno de hoy hecho.":`Hoy entrenas ${HORA_TXT[gymHourOf(p,di)]}.`):"Hoy no hay gimnasio."}${NUTRI&&!doneGym&&gymToday&&p.reparto==="peri"?" Los hidratos van en la comida de antes y la de después.":""}</p>`:""}
  ${suplLine(p)}</div>`;
}

/* ---- Comparar con la serie de la última vez ---- */
function lastSetsOf(p,exId){const h=exHistory(p,exId);return h.length?h[h.length-1]:null;}
function prevSetHint(p,it){
  const last=lastSetsOf(p,it.ex);if(!last)return "";const n=it.sets_.filter(s=>!s.warm).length;const ps=last.sets[n];
  if(!ps)return `<p class="small muted">La última vez hiciste ${last.sets.length} series: esta sería una más.</p>`;
  const cur=it.sets_.filter(s=>!s.warm)[n-1],prevPs=last.sets[n-1];
  const cmp=cur&&prevPs?(e1rm(cur.w,cur.r,cur.rir)>e1rm(prevPs.w,prevPs.r,prevPs.rir)*1.005?` <span class="good">Serie anterior: mejor que la última vez.</span>`:e1rm(cur.w,cur.r,cur.rir)<e1rm(prevPs.w,prevPs.r,prevPs.rir)*0.97?` <span class="muted">Serie anterior: algo por debajo.</span>`:` <span class="muted">Serie anterior: igual que la última vez.</span>`):"";
  return `<p class="prevset">Serie ${n+1} la última vez (${fdate(last.date)}): <b class="num">${ps.w?nf(ps.w,ps.w%1?1:0)+" kg × ":""}${ps.r}</b>${ps.rir!=null?` <span class="muted small">RIR ${ps.rir>=3?"3+":ps.rir}</span>`:""}${cmp}</p>`;
}

Object.assign(A,{
  famStep:el=>{const p=P();p.familia=p.familia||{};const k=el.dataset.k;p.familia[k]=clamp((+p.familia[k]||0)+(+el.dataset.v),0,10);commit();},
  famCom:el=>{const p=P();p.familia=p.familia||{};p.familia.comidas=el.dataset.k;commit();},
  salOpen:()=>{UI.sal={dia:4,comida:"Cena",k:3};UI.sheet=sheetSalida;render();},
  salSet:el=>{const k=el.dataset.k,v=el.dataset.v;UI.sal[k]=k==="comida"?v:+v;render();},
  salSave:()=>{const p=P();const st=UI.sal;const [label,kcal]=FUERA_PRESETS[st.k];const s={dia:st.dia,comida:st.comida,label,kcal};
    p.salidas=(p.salidas||[]).filter(x=>!(x.dia===s.dia&&x.comida===s.comida));p.salidas.push(s);
    const menu=p.menus[weekStart(today())];if(menu){const day=menu.days[s.dia];const mi=day?day.meals.findIndex(m=>m.name===s.comida):-1;if(mi>=0&&!p.done[`${addDays(menu.week,s.dia)}:${mi}`]&&!day.meals[mi].fuera){day.meals[mi].fuera={label,kcal,fija:true};rebalanceDay(menu,s.dia);}}
    UI.sheet=null;commit();toast("Salida fija guardada.");},
  salDel:el=>{const p=P();p.salidas.splice(+el.dataset.i,1);commit();},
  suplOpen:()=>{UI.sheet=sheetSupl;render();},
  suplTick:el=>{const p=P();p.suplDone=p.suplDone||{};const d=p.suplDone[today()]=p.suplDone[today()]||[];const k=el.dataset.k;const i=d.indexOf(k);if(i>=0)d.splice(i,1);else d.push(k);
    Object.keys(p.suplDone).forEach(x=>{if(daysBetween(x,today())>60)delete p.suplDone[x];});commit();},
  gsHora:el=>{const d=UI.gs.d;d.horas=d.horas||{};d.horas[el.dataset.i]=el.dataset.k;render();}
});
Object.assign(CHG,{suplSel:el=>{const p=P();p.supl=p.supl||[];const k=el.dataset.k;if(el.checked){if(!p.supl.includes(k))p.supl.push(k);}else p.supl=p.supl.filter(x=>x!==k);save();}});
