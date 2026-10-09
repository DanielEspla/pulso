/* ===== Estado y almacenamiento local ===== */
const KEY="definicion20:v2";
let S=load();
let UI={view:"inicio",ob:null,sheet:null,confirm:null,diaIdx:(new Date().getDay()+6)%7,menuWeek:weekStart(today()),regWeek:weekStart(today()),cat:"aves",q:"",toast:null,err:null};
let memoryOnly=false;
function load(){
  try{const r=localStorage.getItem(KEY);if(r){const s=JSON.parse(r);if(s&&s.profiles){Object.values(s.profiles).forEach(x=>{migrateSport(x);syncGoal(x);});return s;}}}catch(e){memoryOnly=true;}
  return {profiles:{},active:null,lastBackup:null};
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));memoryOnly=false;}catch(e){memoryOnly=true;}}
const P=()=>S.profiles[S.active];
function commit(){save();render();}
function toast(t){
  let el=document.getElementById("toast");
  if(!el){el=document.createElement("div");el.id="toast";el.className="toast";el.setAttribute("role","status");document.body.appendChild(el);}
  el.textContent=t;el.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>{el.hidden=true;},2400);
}

const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const nf=(n,d=1)=>n==null||isNaN(n)?"—":Number(n).toLocaleString("es-ES",{minimumFractionDigits:d,maximumFractionDigits:d});
const sgn=(n,d=1)=>n==null||isNaN(n)?"—":(n>0?"+":"")+nf(n,d);
const fdate=s=>parseD(s).toLocaleDateString("es-ES",{day:"numeric",month:"short"});
const fdateL=s=>parseD(s).toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"});

/* ===== Iconos ===== */
const I={
  home:'<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  scale:'<path d="M5 21h14a2 2 0 0 0 2-2l-1.5-11a2 2 0 0 0-2-1.7H6.5a2 2 0 0 0-2 1.7L3 19a2 2 0 0 0 2 2z"/><path d="M9 11a3 3 0 0 1 6 0"/><path d="m12 11 1.5-2"/>',
  plate:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>',
  cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6"/>',
  more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  pot:'<path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2 10h20"/><path d="M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2"/>',
  leaf:'<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19 13 11"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  save:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  chev:'<path d="m9 6 6 6-6 6"/>',book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M9 7h6"/>',chevl:'<path d="m15 6-6 6 6 6"/>'
};
const ic=(n,s="")=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${s}>${I[n]}</svg>`;
const NAV=[["inicio","Inicio","home"],["entreno","Entreno","dumb"],["registro","Registro","scale"],["dieta","Dieta","plate"],["compra","Compra","cart"],["cocina","Batch cooking","pot"],["alimentos","Alimentos","leaf"],["objetivos","Objetivos","target"],["perfil","Perfil","user"],["copias","Copia de seguridad","save"],["aprende","Por qué Afina","book"]];

/* ===== Render principal ===== */
let _rendering=false;
function render(){
  if(_rendering){setTimeout(render,0);return;}
  _rendering=true;try{_render();}finally{_rendering=false;}
}
function _render(){
  const root=document.getElementById("app");
  const p=P();
  let body;
  if(!p&&UI.learn)body=`<main class="main">${viewAprende()}</main>`;
  else if(!p||UI.ob)body=`<main class="main">${viewOnboarding()}</main>`;
  else{
    const v={inicio:viewInicio,registro:viewRegistro,dieta:viewDieta,compra:viewCompra,cocina:viewCocina,alimentos:viewAlimentos,objetivos:viewObjetivos,perfil:viewPerfil,copias:viewCopias,mas:viewMas,aprende:viewAprende,entreno:viewEntreno}[UI.view]||viewInicio;
    body=`<aside class="side"><div class="brand"><b>Afina</b><span class="muted small">${SLOGAN}</span></div>
      ${NAV.map(([k,t,i])=>`<button class="navi ${UI.view===k?"on":""}" data-a="go" data-v="${k}">${ic(i)}${t}</button>`).join("")}
      <div class="who"><span class="lbl">Perfil</span><div>${esc(p.nombre)}</div></div></aside>
      <main class="main">${v(p)}<p class="disc">Las estimaciones de gasto y grasa corporal son orientativas y no sustituyen la valoración de un profesional sanitario.</p></main>
      <nav class="bnav">${[["inicio","Inicio","home"],["entreno","Entreno","dumb"],["dieta","Dieta","plate"],["registro","Registro","scale"],["mas","Más","more"]].map(([k,t,i])=>`<button class="${UI.view===k||(k==="mas"&&["compra","cocina","alimentos","objetivos","perfil","copias","aprende"].includes(UI.view))?"on":""}" data-a="go" data-v="${k}">${ic(i)}${t}</button>`).join("")}</nav>`;
  }
  root.innerHTML=`<div class="shell">${body}</div>${UI.sheet?`<div class="overlay" data-a="closeSheet"><div class="sheet" data-stop="1">${UI.sheet()}</div></div>`:""}`;
}

/* ===== Onboarding ===== */
const OB_STEPS=6;
function obDefaults(){return {nombre:"",sexo:"H",nac:"",altura:"",peso0:"",cintura0:"",cuello:"",cadera:"",trabajo:"sentado",pasos:6000,deporte:"gimnasio",secundarios:[],plan:["gimnasio","","gimnasio","","gimnasio","",""],ciclado:false,objetivo:"perder",meta:"recomp",estilo:"equilibrada",reparto:"igual",recarga:"0",ayunoOn:false,ayunoIni:"13:00",ayunoH:8,ritmo:"normal",grasaObj:"",comidas:"4",restr:[],embarazo:false};}
function viewOnboarding(){
  if(!UI.ob)UI.ob={step:0,d:obDefaults()};
  const {step,d}=UI.ob;const first=!Object.keys(S.profiles).length;
  const seg=(name,opts)=>`<div class="seg">${opts.map(([v,t])=>`<button type="button" class="${String(d[name])===String(v)?"on":""}" data-a="obSet" data-k="${name}" data-val="${v}">${t}</button>`).join("")}</div>`;
  const num=(name,label,hint,st="1")=>`<label class="field"><span>${label}</span><input class="inp num" type="number" inputmode="decimal" step="${st}" name="${name}" id="ob_${name}" value="${esc(d[name])}">${hint?`<span class="hint">${hint}</span>`:""}</label>`;
  let html="";
  if(step===0)html=`<h2>¿Quién va a usar la app?</h2><p class="muted" style="margin:6px 0 18px">Cada persona tiene su propio perfil. Los datos se guardan solo en este dispositivo.</p>
    <div class="stack"><label class="field"><span>Nombre</span><input class="inp" name="nombre" id="ob_nombre" value="${esc(d.nombre)}" autocomplete="off"></label>
    <div class="field"><span>Sexo</span>${seg("sexo",[["H","Hombre"],["M","Mujer"]])}<span class="hint">Cambia las fórmulas de gasto y de grasa corporal.</span></div>
    <label class="field"><span>Fecha de nacimiento</span><input class="inp" type="date" name="nac" id="ob_nac" value="${esc(d.nac)}" max="${today()}"><span class="hint">La edad se recalcula sola en cada cumpleaños.</span></label></div>`;
  if(step===1)html=`<h2>Medidas de partida</h2><p class="muted" style="margin:6px 0 18px">Mide en ayunas, sin apretar la cinta.</p>
    <div class="grid2">${num("altura","Altura (cm)")}${num("peso0","Peso (kg)","","0.1")}${num("cintura0","Cintura (cm)","A la altura del ombligo","0.1")}${num("cuello","Cuello (cm)","Justo bajo la nuez","0.1")}${d.sexo==="M"?num("cadera","Cadera (cm)","En la parte más ancha","0.1"):""}</div>`;
  if(step===2)html=`<h2>Tu vida y tu deporte</h2><p class="muted" style="margin:6px 0 18px">Lo que haces en una semana normal, no en la mejor. Con esto se ajustan el gasto, la proteína y los hidratos.</p>
    <div class="stack"><div class="field"><span>Trabajo</span>${seg("trabajo",[["sentado","Sentado"],["mixto","De pie / mixto"],["fisico","Físico"]])}</div>
    ${num("pasos","Pasos al día","Media aproximada. Si no lo sabes: 4.000 poco activo, 7.000 normal, 10.000 activo.")}
    ${sportPicker(d,"ob")}</div>`;
  if(step===3){const gm=GOALS[d.meta];html=`<h2>Tu objetivo ${infoBtn("objetivo","objetivo")}</h2><p class="muted" style="margin:6px 0 18px">Decide tus calorías, tu proteína y cómo entrenas. Puedes cambiarlo cuando quieras.</p>
    <div class="stack">${goalCards(d.meta,"obSet")}
    ${["recomp","definicion","volumen","estetica"].includes(d.meta)?`<div class="field"><span>Ritmo</span>${seg("ritmo",[["suave","Suave"],["normal","Normal"],["rapido","Rápido"]])}<span class="hint">${ritmoHint(d)}</span></div>`:""}
    ${num("grasaObj","Grasa corporal objetivo (%)",`Si lo dejas vacío: ${d.sexo==="H"?15:23} %. Con ella se calcula tu peso objetivo.`)}
    <h3 style="margin-top:8px">Cómo quieres comer</h3>
    <div class="field"><span>Estilo de dieta ${infoBtn("estilo","estilo de dieta")}</span>${choiceCards(DIET_STYLES,d.estilo,"obSet","estilo","e_")}</div>
    ${d.estilo!=="keto"?`<div class="field"><span>Reparto de hidratos ${infoBtn("reparto","reparto")}</span>${seg("reparto",Object.entries(REPARTOS).map(([k,v])=>[k,v[0]]))}<span class="hint">${REPARTOS[d.reparto][1]}</span></div>`:""}
    <div class="field"><span>Días de recarga a la semana ${infoBtn("recarga","recarga")}</span>${seg("recarga",[["0","Ninguno"],["1","Uno"],["2","Dos"]])}${d.estilo==="keto"&&d.recarga==="0"?`<span class="hint">En keto se recomienda al menos un día de recarga si entrenas fuerte.</span>`:""}</div>
    <label class="chk"><input type="checkbox" name="ayunoOn" id="ob_ayunoOn" ${d.ayunoOn?"checked":""} data-c="obRe"><span>Ayuno intermitente ${infoBtn("ayuno","ayuno intermitente")}</span></label>
    ${d.ayunoOn?`<div class="grid2"><label class="field"><span>Primera comida</span><input class="inp" type="time" name="ayunoIni" id="ob_ayunoIni" value="${esc(d.ayunoIni)}"></label><label class="field"><span>Horas de ventana</span><input class="inp num" type="number" name="ayunoH" id="ob_ayunoH" value="${d.ayunoH}" min="4" max="12"></label></div>`:""}
    <div class="field"><span>Comidas al día</span>${seg("comidas",(d.ayunoOn?[["2","2"],["3a","3"]]:[["2","2"],["3","3"],["3a","3 sin desayuno"],["4","4"],["5","5"]]))}</div>
    ${d.sexo==="M"?`<label class="chk"><input type="checkbox" name="embarazo" id="ob_embarazo" ${d.embarazo?"checked":""}> Embarazo o lactancia</label>`:""}</div>`;}
  if(step===4)html=`<h2>Restricciones</h2><p class="muted" style="margin:6px 0 18px">Esto no son gustos: los alimentos afectados no aparecerán nunca. Los gustos los marcas después.</p>
    <div class="grid2">${RESTRICTIONS.map(([k,t])=>`<label class="chk"><input type="checkbox" name="restr" value="${k}" ${d.restr.includes(k)?"checked":""}> ${t}</label>`).join("")}</div>`;
  if(step===5){
    const prof=syncGoal(obToProfile(d));const t=computeTargets(prof);const tw=targetWeight(prof);
    html=`<h2>Tu punto de partida</h2><p class="muted" style="margin:6px 0 18px">Es una estimación inicial. A partir de la tercera semana la app la corrige con tu peso real.</p>
    <div class="card stack"><div class="row between"><div><span class="lbl">Calorías objetivo</span><div class="big">${t.kcal}<span class="small muted"> kcal</span></div></div><div style="text-align:right"><span class="lbl">Gasto estimado</span><div class="num" style="font-size:1.2rem;font-weight:700">${t.tdee} kcal</div></div></div>
    ${macroBars(t,t)}
    <p class="small muted">${sportSummary(prof)}</p>
    <div class="grid3"><div><span class="lbl">Grasa estimada</span><div class="num"><b>${nf(t.bf)} %</b></div></div><div><span class="lbl">Masa magra</span><div class="num"><b>${nf(t.lbm)} kg</b></div></div><div><span class="lbl">Peso objetivo</span><div class="num"><b>${nf(tw)} kg</b></div></div></div>
    ${d.embarazo?`<div class="alert warn"><span class="dot"></span><div><b>Sin déficit</b>Con embarazo o lactancia la app no recorta calorías. Consulta la pauta con tu matrona o médico.</div></div>`:""}
    ${t.kcal<=t.floor&&prof.objetivo==="perder"?`<div class="alert warn"><span class="dot"></span><div><b>Calorías en el mínimo</b>No bajamos de ${t.floor} kcal. Para ir más rápido, sube pasos.</div></div>`:""}</div>`;
  }
  return `<div class="ob"><div class="row between"><div><h1>${first?"Afina":"Nuevo perfil"}</h1>${first?`<p class="muted">${SLOGAN}</p>`:""}</div>${!first?`<button class="btn ghost sm" data-a="obCancel">Cancelar</button>`:""}</div>
    <div class="steps">${Array.from({length:OB_STEPS},(_,i)=>`<i class="${i<=step?"on":""}"></i>`).join("")}</div>
    <form data-s="obNext" id="obform">${html}
    ${UI.err?`<p class="err" style="margin-top:14px">${esc(UI.err)}</p>`:""}
    <div class="row between" style="margin-top:22px">${step>0?`<button type="button" class="btn" data-a="obBack">Atrás</button>`:"<span></span>"}
    <button class="btn pri" type="submit">${step===OB_STEPS-1?"Crear perfil":"Siguiente"}</button></div></form>
    ${first&&step===0?`<div class="card flat" style="margin-top:28px"><h3>Antes de empezar</h3><p class="muted small" style="margin:4px 0 12px">Qué busca Afina y cómo funciona tu cuerpo, explicado sin tecnicismos.</p><button class="btn" data-a="openLearn">Leer por qué Afina</button></div>`:""}</div>`;
}
function goalCards(sel,act,k="meta"){
  return `<div class="gcards">${GOAL_ORDER.map(id=>{const g=GOALS[id];return `<div class="gcard ${sel===id?"on":""}"><button type="button" class="gsel" data-a="${act}" data-k="${k}" data-val="${id}"><b>${g.t}</b><span>${g.d}</span></button>${infoBtn("g_"+id,g.t)}</div>`;}).join("")}</div>`;
}
function choiceCards(dict,sel,act,k,pre){
  return `<div class="gcards">${Object.entries(dict).map(([id,v])=>`<div class="gcard ${sel===id?"on":""}"><button type="button" class="gsel" data-a="${act}" data-k="${k}" data-val="${id}"><b>${v[0]}</b><span>${v[1]}</span></button>${infoBtn(pre+id,v[0])}</div>`).join("")}</div>`;
}
function ritmoHint(d){
  const g=GOALS[d.meta];if(g&&Array.isArray(g.band)&&g.obj!=="mantener"){const m={suave:0.75,normal:1,rapido:1.2}[d.ritmo]||1;const b=g.band.map(x=>x*m);
    return g.obj==="ganar"||d.meta==="volumen"?`Subir entre un ${nf(b[0]*4.3,2)} y un ${nf(b[1]*4.3,2)} % del peso al mes.`:`Perder entre un ${nf(b[0],2)} y un ${nf(b[1],2)} % del peso por semana.`;}
  return "";
}
function ritmoHintOld(d){
  const b=(RITMOS[d.objetivo]||RITMOS.perder)[d.ritmo]||[0,0,0];
  return d.objetivo==="ganar"?`Subir entre ${nf(b[0],2)} y ${nf(b[1],2)} % del peso por semana.`:`Perder entre ${nf(b[0],2)} y ${nf(b[1],2)} % del peso por semana.`;
}
function readOb(){
  const f=document.getElementById("obform");if(!f)return;const d=UI.ob.d;
  f.querySelectorAll("input[name]").forEach(i=>{
    if(i.name==="restr"||i.name==="dia")return;
    if(i.type==="checkbox")d[i.name]=i.checked;else d[i.name]=i.type==="number"?(i.value===""?"":Number(i.value)):i.value.trim();
  });
  const rs=[...f.querySelectorAll('input[name="restr"]')];if(rs.length)d.restr=rs.filter(x=>x.checked).map(x=>x.value);
}
function obValidate(step,d){
  if(step===0){if(!d.nombre)return "Escribe un nombre para el perfil.";if(!d.nac)return "Falta la fecha de nacimiento.";const ed=ageFrom(d.nac);if(ed<18)return "La app está pensada solo para mayores de 18 años.";if(ed>100)return "Revisa la fecha de nacimiento.";}
  if(step===1){
    if(!(d.altura>=120&&d.altura<=230))return "La altura debe estar en centímetros (entre 120 y 230).";
    if(!(d.peso0>=35&&d.peso0<=300))return "Revisa el peso.";
    if(!(d.cintura0>=50&&d.cintura0<=200))return "Revisa la cintura.";
    if(!(d.cuello>=25&&d.cuello<=70))return "Revisa el cuello.";
    if(d.sexo==="M"&&!(d.cadera>=60&&d.cadera<=200))return "Falta la cadera (se usa en la fórmula de grasa para mujeres).";
  }
  if(step===2){if(d.pasos===""||d.pasos<0||d.pasos>40000)return "Revisa los pasos.";if(d.deporte&&!d.plan.includes(d.deporte))return "Asigna al menos un día de la semana a tu deporte principal.";}
  if(step===3){
    const imc=d.peso0/((d.altura/100)**2);
    if(["recomp","definicion"].includes(d.meta)&&imc<18.5)return "Con tu IMC actual la app no plantea pérdida de peso. Elige Volumen limpio, Fuerza o Longevidad.";
    if(d.ayunoOn&&!(d.ayunoH>=4&&d.ayunoH<=12))return "La ventana de ayuno debe ser de 4 a 12 horas.";
    if(d.grasaObj!==""&&(d.grasaObj<5||d.grasaObj>45))return "La grasa objetivo debe estar entre 5 y 45 %.";
  }
  return null;
}
function obToProfile(d){
  return {id:uid(),nombre:d.nombre,sexo:d.sexo,nac:d.nac,altura:+d.altura,peso0:+d.peso0,cintura0:+d.cintura0,cuello:+d.cuello,cadera:+d.cadera||0,
    trabajo:d.trabajo,pasos:+d.pasos,deporte:d.deporte,secundarios:[...d.secundarios],plan:[...d.plan],ciclado:!!d.deporte&&!!d.ciclado,entrenos:d.plan.filter(Boolean).length,objetivo:"perder",meta:d.meta,dietaEstilo:d.estilo,reparto:d.estilo==="keto"?"igual":d.reparto,recarga:+d.recarga,ayuno:{on:!!d.ayunoOn,ini:d.ayunoIni||"13:00",h:+d.ayunoH||8},goalSince:today(),ritmo:d.ritmo,grasaObj:d.grasaObj===""?(d.sexo==="H"?15:23):+d.grasaObj,
    comidas:d.ayunoOn&&!["2","3a"].includes(d.comidas)?"3a":d.comidas,restr:d.restr,embarazo:!!d.embarazo,prefs:{},weights:{},checkins:{},history:[],applied:{},menus:{},done:{},shop:{},favs:[],pausa:null,creado:today()};
}
function createProfile(p){
  syncGoal(p);
  const t=computeTargets(p);p.tdeeRef=t.tdee;p.targets={kcal:t.kcal,p:t.p,f:t.f,c:t.c};
  p.history=[{date:today(),...p.targets,motivo:"Cálculo inicial",tipo:"inicial"}];
  p.weights[today()]=p.peso0;
  S.profiles[p.id]=p;S.active=p.id;
}

/* ===== Gráfica de línea ===== */
function lineChart(series,dots,unit){
  if(series.length<1)return `<p class="muted small" style="padding:20px 0">Aún no hay datos suficientes para la gráfica.</p>`;
  const W=340,H=160,L=34,R=8,T=10,B=24;
  const ys=[...series.map(s=>s.y),...(dots||[]).map(d=>d.y)];
  let mn=Math.min(...ys),mx=Math.max(...ys);if(mx-mn<1){mn-=0.5;mx+=0.5;}
  const pad=(mx-mn)*0.12;mn-=pad;mx+=pad;
  const n=Math.max(series.length-1,1);
  const X=i=>L+(W-L-R)*(series.length===1?0.5:i/n);
  const Y=v=>T+(H-T-B)*(1-(v-mn)/(mx-mn));
  const ticks=[mn+pad,(mn+mx)/2,mx-pad];
  const step=Math.max(1,Math.ceil(series.length/5));
  let g=ticks.map(v=>`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${L-5}" y="${Y(v)+3}" text-anchor="end">${nf(v,1)}</text>`).join("");
  g+=series.map((s,i)=>i%step===0||i===series.length-1?`<text x="${X(i)}" y="${H-6}" text-anchor="${series.length>1&&i===series.length-1?"end":i===0&&series.length>1?"start":"middle"}">${esc(s.l)}</text>`:"").join("");
  if(dots)g+=dots.map(d=>`<circle cx="${X(d.i)}" cy="${Y(d.y)}" r="2" fill="var(--muted)" opacity=".45"/>`).join("");
  const pts=series.map((s,i)=>`${X(i)},${Y(s.y)}`).join(" ");
  const area=`${X(0)},${H-B} ${pts} ${X(series.length-1)},${H-B}`;
  g+=`<polygon points="${area}" fill="var(--accent)" opacity=".08"/><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linejoin="round"/>`;
  g+=series.map((s,i)=>`<circle cx="${X(i)}" cy="${Y(s.y)}" r="${i===series.length-1?4:2.8}" fill="${i===series.length-1?"var(--accent)":"var(--surface)"}" stroke="var(--accent)" stroke-width="1.8"/>`).join("");
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución en ${unit}">${g}</svg></div>`;
}
function macroBars(t,target){
  const tt=target||t;
  return [["Proteína","p",4],["Grasas","f",9],["Hidratos","c",4]].map(([n,k,m])=>`<div><div class="macro-line"><span>${n}</span><span class="num muted">${Math.round(t[k])} g${target&&target!==t?` / ${tt[k]} g`:` · ${Math.round(t[k]*m)} kcal`}</span></div><div class="bar"><i class="${k}" style="width:${clamp((target&&target!==t?t[k]/tt[k]:t[k]*m/tt.kcal)*100,2,100)}%"></i></div></div>`).join("");
}
function pill(d){const txt={MANTENER:"Mantener",SUBIR:"Subir",BAJAR:"Bajar",SIN_DATOS:"Sin datos",NO_VALIDA:"No válida",PAUSA:"Pausa"}[d]||d;return `<span class="pill ${d}">${txt}</span>`;}

/* ===== Inicio ===== */
function alertsFor(p){
  const out=[];const cw=weekStart(today());const W=weeklyData(p);
  const thisW=W.find(w=>w.week===cw);
  if(!p.weights[today()])out.push(["","Pésate hoy","En ayunas, después del baño. La app trabaja con la media de la semana."]);
  const prev=addDays(cw,-7);const pw=W.find(w=>w.week===prev);
  if(pw&&pw.n>0&&!pw.ci)out.push(["warn","Falta la revisión de la semana pasada","Sin cintura, pasos y adherencia la app no puede decidir.",`<button class="btn sm" data-a="goReg" data-w="${prev}">Hacer revisión</button>`]);
  if(thisW&&thisW.n<3&&(new Date().getDay()===0||new Date().getDay()>=5))out.push(["","Pocas pesadas esta semana",`Llevas ${thisW.n}. Hacen falta al menos 3 para que la semana cuente.`]);
  const wd=weeksInDeficit(p);
  if(!p.pausa&&p.objetivo==="perder"&&wd>=10)out.push(["warn",`Llevas ${wd} semanas en déficit`,"Una pausa de 1-2 semanas en mantenimiento suele ayudar a seguir después.",`<button class="btn sm" data-a="go" data-v="objetivos">Ver pausa de dieta</button>`]);
  const ad=adaptiveTDEE(p);
  if(ad&&Math.abs(ad.tdee-computeTargets(p).tdee)>200)out.push(["","Tu gasto real no coincide con la fórmula",`Con tus datos sale unas ${ad.tdee} kcal. Puedes recalibrar los objetivos.`,`<button class="btn sm" data-a="go" data-v="objetivos">Recalibrar</button>`]);
  const ci=W.filter(w=>w.ci&&w.n>0);
  if(ci.length>=2){const a=ci[ci.length-1],b=ci[ci.length-2];if(a.ci.cintura&&b.ci.cintura&&a.avg>=b.avg-0.1&&a.ci.cintura<=b.ci.cintura-0.5)out.push(["ok","Peso estable, cintura bajando","Es buena señal: estás perdiendo grasa aunque la báscula no lo refleje."]);
    if(a.ci.rendimiento==="BAJA"&&b.ci.rendimiento==="BAJA")out.push(["warn","Rendimiento bajo dos semanas","Revisa sueño y estrés. Si la pérdida es rápida, la app propondrá subir hidratos."]);}
  const bf=bodyFat(p,currentWeight(p),currentWaist(p));
  if(bf<=p.grasaObj)out.push(["ok","Has llegado a tu grasa objetivo","Puedes pasar a mantenimiento desde Perfil."]);
  if(p.recalcPending)out.push(["warn","Has cambiado tu entreno","Recalcula tus calorías y macros para que la dieta vaya acorde con lo que entrenas.",`<button class="btn sm pri" data-a="recal" data-src="formula">Recalcular objetivos</button>`]);
  const lb=S.lastBackup?daysBetween(S.lastBackup.slice(0,10),today()):999;
  if(lb>7)out.push(["warn",S.lastBackup?`Última copia hace ${lb} días`:"Aún no has hecho copia de seguridad","Tus datos solo están en este navegador. Guarda una copia cada semana.",`<button class="btn sm" data-a="go" data-v="copias">Hacer copia</button>`]);
  return out;
}
function lastDecisionWeek(p){
  const W=weeklyData(p).filter(w=>w.ci);return W.length?W[W.length-1].week:null;
}
function viewInicio(p){
  const W=weeklyData(p);const cw=weekStart(today());
  const withData=W.filter(w=>w.n>0);
  const cur=withData[withData.length-1];
  const full=withData.filter(w=>w.n>=3);const fc=full[full.length-1],fp=full[full.length-2];
  const chg=fc&&fp&&fc.week===cur.week?{d:fc.avg-fp.avg,pct:(fc.avg-fp.avg)/fp.avg*100}:null;
  const t=p.targets;const peso=currentWeight(p);const cint=currentWaist(p);
  const bf=bodyFat(p,peso,cint);const tw=targetWeight(p);
  const ad=adaptiveTDEE(p);
  const ritmo=ad?ad.slope:(chg?Math.round(chg.d*100)/100:null);
  const ritmoPct=ritmo!=null?ritmo/peso*100:null;
  let proj="";
  if(ritmo&&p.objetivo==="perder"&&ritmo<0&&peso>tw){const wk=Math.ceil((peso-tw)/-ritmo);proj=`A este ritmo, ${nf(tw)} kg en unas ${wk} semanas (${fdate(addDays(today(),wk*7))}).`;}
  const dk=lastDecisionWeek(p);const ev=dk?evaluate(p,dk):null;
  const applied=dk&&p.applied[dk];
  const startW=p.history[0]?p.peso0:peso;
  const prog=p.objetivo==="perder"&&startW>tw?clamp((startW-peso)/(startW-tw)*100,0,100):null;
  const series=withData.slice(-12).map(w=>({l:fdate(w.week),y:w.avg}));
  const dots=[];withData.slice(-12).forEach((w,i)=>{Object.entries(p.weights).forEach(([d,kg])=>{if(weekStart(d)===w.week)dots.push({i,y:kg});});});
  const wser=W.filter(w=>w.ci&&w.ci.cintura).slice(-12).map(w=>({l:fdate(w.week),y:w.ci.cintura}));
  const al=alertsFor(p);
  const gc=goalCfg(p);
  return `<div class="head"><div><h1>Hola, ${esc(p.nombre)}</h1><p class="sub">${fdateL(today())}</p><button class="goalchip" data-a="go" data-v="objetivos">${gc.t}${gc.fase?" · "+gc.fase.replace("en fase de ",""):""} <span>Cambiar</span></button></div>
    <button class="btn pri" data-a="go" data-v="registro">Registrar</button></div>
  <div class="stack">
  ${p.pausa?`<div class="alert ok"><span class="dot"></span><div><b>Pausa de dieta en curso</b>Comes en mantenimiento desde el ${fdate(p.pausa.desde)}. <button class="btn sm" data-a="go" data-v="objetivos" style="margin-top:8px">Gestionar</button></div></div>`:""}
  <form class="card row between" data-s="quickWeight"><div><span class="lbl">Peso de hoy</span><p class="small muted">${p.weights[today()]?"Registrado. Puedes corregirlo.":"Aún sin registrar"}</p></div>
    <div class="row"><input class="inp num" style="width:110px" type="number" step="0.1" inputmode="decimal" id="qw" name="qw" value="${p.weights[today()]??""}" placeholder="kg"><button class="btn pri">Guardar</button></div></form>
  ${gymHomeCard(p)}
  ${ev?`<div class="card stack"><div class="row between"><div><span class="lbl">Decisión de la semana del ${fdate(dk)}</span></div>${pill(ev.d)}</div>
    <p>${esc(ev.why)}</p>${ev.det?`<p class="small muted">${esc(ev.det)}</p>`:""}
    ${(ev.d==="SUBIR"||ev.d==="BAJAR")?(applied?`<p class="small good">Ajuste aplicado.</p>`:`<div class="row"><button class="btn pri" data-a="applyDec" data-w="${dk}" data-d="${ev.d}">${ev.d==="SUBIR"?"Subir":"Bajar"} ${stepKcal(t)} kcal desde la próxima comida</button></div>`):""}</div>`:""}
  <div class="grid4">
    <div class="stat"><span class="lbl">Media semanal</span><div class="v">${cur?nf(cur.avg):"—"}<small>kg</small></div><div class="d">${cur?`${cur.n} pesada${cur.n===1?"":"s"} · ${fdate(cur.week)}`:"Sin datos"}</div></div>
    <div class="stat"><span class="lbl">Cambio semanal</span><div class="v ${chg&&chg.d<0?"good":""}">${chg?sgn(chg.d):"—"}<small>kg</small></div><div class="d">${chg?sgn(chg.pct,2)+" % del peso":cur&&cur.n<3?"Faltan pesadas esta semana":"Necesita dos semanas"}</div></div>
    <div class="stat"><span class="lbl">Cintura</span><div class="v">${nf(cint)}<small>cm</small></div><div class="d">Inicio ${nf(p.cintura0)} cm</div></div>
    <div class="stat"><span class="lbl">Grasa estimada</span><div class="v">${nf(bf)}<small>%</small></div><div class="d">Objetivo ${nf(p.grasaObj,0)} %</div></div>
  </div>
  <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
    <div class="card stack"><div class="row between"><span class="lbl">Objetivo diario</span><span class="num"><b>${t.kcal}</b> kcal</span></div>${macroBars(t)}</div>
    <div class="card stack"><span class="lbl">Progreso</span>
      ${prog!=null?`<div><div class="macro-line"><span>Hacia ${nf(tw)} kg</span><span class="num muted">${nf(prog,0)} %</span></div><div class="bar"><i style="width:${Math.max(prog,2)}%"></i></div></div>`:""}
      <div class="macro-line" style="margin:0"><span>Ritmo real</span><span class="num">${ritmo!=null?`${sgn(ritmo,2)} kg/sem (${sgn(ritmoPct,2)} %)`:"—"}</span></div>
      <div class="macro-line" style="margin:0"><span>Ritmo buscado</span><span class="num muted">${p.objetivo==="perder"?`-${nf(banda(p)[0],2)} a -${nf(banda(p)[1],2)} %`:p.objetivo==="ganar"?`+${nf(banda(p)[0],2)} a +${nf(banda(p)[1],2)} %`:"±0,25 %"}</span></div>
      ${proj?`<p class="small muted">${proj}</p>`:""}</div>
  </div>
  ${al.length?`<div class="stack">${al.map(([k,h,tx,btn])=>`<div class="alert ${k}"><span class="dot"></span><div><b>${esc(h)}</b>${esc(tx)}${btn?`<div style="margin-top:8px">${btn}</div>`:""}</div></div>`).join("")}</div>`:""}
  <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
    <div class="card"><span class="lbl">Peso medio semanal (kg)</span>${lineChart(series,dots,"kilos")}</div>
    <div class="card"><span class="lbl">Cintura (cm)</span>${lineChart(wser,null,"centímetros")}</div>
  </div></div>`;
}

/* ===== Registro ===== */
function viewRegistro(p){
  const ws=UI.regWeek;const ci=p.checkins[ws]||{};
  const W=weeklyData(p);const w=W.find(x=>x.week===ws);
  const ev=w&&w.ci?evaluate(p,ws):null;
  const days=Array.from({length:7},(_,i)=>addDays(ws,i));
  const sel=(n,opts,v)=>`<select class="inp" name="${n}" id="ci_${n}">${opts.map(([a,b])=>`<option value="${a}" ${String(v)===String(a)?"selected":""}>${b}</option>`).join("")}</select>`;
  const hist=W.filter(x=>x.n>0||x.ci).slice().reverse();
  return `<div class="head"><div><h1>Registro</h1><p class="sub">Peso cada mañana y revisión una vez por semana</p></div></div>
  <div class="stack">
  <div class="row between"><button class="btn sm" data-a="regW" data-n="-7">${ic("chevl",'width="16"')} Anterior</button><b class="num">Semana del ${fdate(ws)}</b><button class="btn sm" data-a="regW" data-n="7" ${ws>=weekStart(today())?"disabled":""}>Siguiente ${ic("chev",'width="16"')}</button></div>
  <div class="card stack"><div class="row between"><span class="lbl">Pesos diarios (kg)</span><span class="num small">${w&&w.n?`Media ${nf(w.avg)} kg · ${w.n}/7`:"Sin pesadas"}</span></div>
    <div class="daygrid">${days.map((d,i)=>`<label>${DIAS[i].slice(0,3)} ${parseD(d).getDate()}<input class="inp num" type="number" step="0.1" inputmode="decimal" data-c="dayW" data-d="${d}" id="w_${d}" value="${p.weights[d]??""}" ${d>today()?"disabled":""}></label>`).join("")}</div>
    <p class="hint">Se guardan al salir de cada casilla. Con 3 o más pesadas la semana cuenta para la decisión.</p></div>
  <form class="card stack" data-s="checkin"><span class="lbl">Revisión semanal</span>
    <div class="grid2">
      <label class="field"><span>Cintura (cm)</span><input class="inp num" type="number" step="0.1" inputmode="decimal" name="cintura" id="ci_cintura" value="${ci.cintura??""}"></label>
      <label class="field"><span>Pasos medios al día</span><input class="inp num" type="number" inputmode="numeric" name="pasos" id="ci_pasos" value="${ci.pasos??p.pasos}"></label>
      <label class="field"><span>Entrenos hechos</span><input class="inp num" type="number" inputmode="numeric" name="entrenos" id="ci_entrenos" value="${ci.entrenos??((G(p).log||[]).filter(l=>weekStart(l.date)===ws).length||p.entrenos)}"></label>
      <label class="field"><span>Días que cumpliste la dieta</span>${sel("adherencia",[7,6,5,4,3,2,1,0].map(x=>[x,x+" de 7"]),ci.adherencia??7)}</label>
      <label class="field"><span>Rendimiento en el entreno</span>${sel("rendimiento",[["ESTABLE","Estable"],["MEJORA","Mejora"],["BAJA","Baja"]],ci.rendimiento||(autoPerf(p,ws)||{}).v||"ESTABLE")}${autoPerf(p,ws)?`<span class="hint">Calculado con tus entrenos: fuerza ${sgn(autoPerf(p,ws).med,1)} %.</span>`:""}</label>
      ${p.sexo==="M"?`<label class="chk" style="align-self:end"><input type="checkbox" name="ciclo" id="ci_ciclo" ${ci.ciclo?"checked":""}> Retención por el ciclo</label>`:""}
    </div>
    <label class="field"><span>Notas</span><input class="inp" name="notas" id="ci_notas" value="${esc(ci.notas||"")}" placeholder="Comida fuera, viaje, mal sueño…"></label>
    <div class="row between">${ev?`<div class="row">${pill(ev.d)}<span class="small muted" style="max-width:46ch">${esc(ev.why)}</span></div>`:"<span></span>"}<button class="btn pri">Guardar revisión</button></div>
  </form>
  <div class="card"><span class="lbl">Historial</span>${hist.length?`<div class="scroll" style="margin-top:8px"><table class="t"><thead><tr><th>Semana</th><th>Media</th><th>Cambio</th><th>Cintura</th><th>Días</th><th>Decisión</th></tr></thead><tbody>
    ${hist.map(x=>{const i=W.indexOf(x);const pr=W.slice(0,i).reverse().find(z=>z.n>0);const ch=pr&&x.avg?(x.avg-pr.avg)/pr.avg*100:null;const e=x.ci?evaluate(p,x.week):null;
      return `<tr data-a="goReg" data-w="${x.week}" style="cursor:pointer"><td>${fdate(x.week)}</td><td>${x.avg?nf(x.avg):"—"} <span class="muted small">(${x.n})</span></td><td class="${ch!=null&&ch<0?"good":""}">${ch!=null?sgn(ch,2)+" %":"—"}</td><td>${x.ci&&x.ci.cintura?nf(x.ci.cintura):"—"}</td><td>${x.ci?x.ci.adherencia+"/7":"—"}</td><td>${e?pill(e.d):""}</td></tr>`;}).join("")}
    </tbody></table></div>`:`<p class="muted small" style="margin-top:8px">Aún no hay semanas registradas.</p>`}</div>
  </div>`;
}

/* ===== Dieta ===== */
function itemQty(f,q){return f.u?`${q} ${f.un}${q>1?(/[aeiouáéó]$/.test(f.un)?"s":"es"):""}`:`${Math.round(q)} g`;}
function weekNav(cur,act){const w0=weekStart(today());
  return `<div class="seg">${[[w0,"Esta semana"],[addDays(w0,7),"La próxima"]].map(([w,t])=>`<button class="${cur===w?"on":""}" data-a="${act}" data-w="${w}">${t}</button>`).join("")}</div>`;}
function viewDieta(p){
  const ws=UI.menuWeek;const menu=p.menus[ws];
  const prefsSet=Object.keys(p.prefs||{}).length;
  if(!menu)return `<div class="head"><div><h1>Dieta</h1><p class="sub">${MEAL_TXT[p.comidas]} · ${p.targets.kcal} kcal</p></div>${weekNav(ws,"menuW")}</div>
    <div class="card empty"><h2>Sin menú para la semana del ${fdate(ws)}</h2><p class="muted">La app monta 7 días con tus calorías y macros, rotando los alimentos que te gustan y respetando tus restricciones.</p>
    ${!prefsSet?`<p class="small muted">Todavía no has marcado gustos: usará todos los alimentos permitidos.</p><div class="row" style="justify-content:center"><button class="btn" data-a="go" data-v="alimentos">Elegir alimentos primero</button><button class="btn pri" data-a="genWeek">Generar menú</button></div>`:`<button class="btn pri" data-a="genWeek">Generar menú de la semana</button>`}</div>`;
  const di=UI.diaIdx;const day=menu.days[di];const date=addDays(ws,di);
  const tot=dayTotals(day);const T=day.T||menu.targets;
  const needNew=menu.comidas!==p.comidas;
  const changed=!needNew&&(["kcal","p","f","c"].some(k=>menu.targets[k]!==p.targets[k])||!!menu.ciclado!==!!p.ciclado||(menu.cfg&&menu.cfg!==menuCfg(p)));
  const hrs=mealHours(p,day.meals.length);
  const confirmRegen=UI.confirm==="regenWeek";
  return `<div class="head"><div><h1>Dieta</h1><p class="sub">${DIET_STYLES[p.dietaEstilo||"equilibrada"][0]} · ${MEAL_TXT[menu.comidas]} · ${menu.targets.kcal} kcal de media${ayunoTxt(p)?" · "+ayunoTxt(p):""}</p></div>${weekNav(ws,"menuW")}</div>
  <div class="stack">
  ${needNew?`<div class="alert warn"><span class="dot"></span><div><b>Has cambiado el número de comidas</b>Este menú es de ${MEAL_TXT[menu.comidas]}. Rehazlo para aplicar los cambios.<div style="margin-top:8px"><button class="btn sm pri" data-a="genWeek">Rehacer el menú</button></div></div></div>`:""}
  ${changed?`<div class="alert warn"><span class="dot"></span><div><b>Tu objetivo o tu forma de comer han cambiado</b>El menú está hecho con la configuración anterior. <div style="margin-top:8px"><button class="btn sm pri" data-a="retarget">Ajustar cantidades a ${p.targets.kcal} kcal</button></div></div></div>`:""}
  <div class="tabs">${menu.days.map((_,i)=>{const d=addDays(ws,i);return `<button class="${i===di?"on":""} ${d===today()?"today":""}" data-a="dia" data-i="${i}"><b>${DIAS[i][0]==="M"&&i===2?"X":DIAS[i][0]}</b><span>${parseD(d).getDate()}${menu.days[i].T&&menu.days[i].T.train?" ·E":""}</span></button>`;}).join("")}</div>
  <div class="card stack"><div class="row between"><div><h2>${DIAS[di]} ${parseD(date).getDate()}</h2>${T.refeed?`<span class="tag" style="margin:0 6px 0 0">Día de recarga</span>`:""}${T.train!==undefined&&(p.plan||[]).some(Boolean)?`<span class="small ${T.train?"good":"muted"}">${T.train&&SPORT[T.sport]?SPORT[T.sport].t:"Descanso"}${menu.ciclado&&T.c!==menu.targets.c?` · ${sgn(T.c-menu.targets.c,0)} g de hidratos`:""}</span>`:""}</div><span class="num"><b>${Math.round(tot.kcal)}</b> <span class="muted">/ ${T.kcal} kcal</span></span></div>
    <div class="grid3">${[["Proteína","p"],["Grasas","f"],["Hidratos","c"]].map(([n,k])=>`<div><div class="macro-line"><span class="small">${n}</span><span class="num small muted">${Math.round(tot[k])}/${T[k]}</span></div><div class="bar"><i class="${k}" style="width:${clamp(tot[k]/T[k]*100,2,100)}%"></i></div></div>`).join("")}</div>
    ${day.meals.some(m=>m.fuera)?`<p class="small muted">Con comida fuera el total es estimado.</p>`:""}</div>
  ${day.meals.map((m,mi)=>{
    const k=`${date}:${mi}`;const done=p.done[k];const s=sumItems(m.items);
    if(m.fuera)return `<div class="card meal"><div class="meal-h"><h3>${esc(m.name)}</h3><span class="num muted">≈ ${m.fuera.kcal} kcal</span></div>
      <div class="fuera"><b>${esc(m.fuera.label)}</b><br><span class="small">Las demás comidas del día se han ajustado para dejar sitio.</span></div>
      <div class="meal-a"><button class="btn sm" data-a="unFuera" data-m="${mi}">Quitar comida fuera</button></div></div>`;
    const pr=periTag(p,day,mi);
    return `<div class="card meal ${done?"done":""}"><div class="meal-h"><h3>${hrs?`<span class="muted small num">${hrs[mi]} · </span>`:""}${esc(m.name)}${pr?` <span class="tag">${pr}</span>`:""}</h3><span class="num muted small">${Math.round(s.kcal)} kcal · P ${Math.round(s.p)} · G ${Math.round(s.f)} · HC ${Math.round(s.c)}</span></div>
      <div class="items">${m.items.filter(it=>!(FOOD[it.id].id==="aove"&&it.q===0)).map(it=>{const f=FOOD[it.id];const ii=m.items.indexOf(it);return `<button class="item" data-a="swap" data-m="${mi}" data-i="${ii}"><span class="nm">${esc(f.name)}</span><span class="q">${itemQty(f,it.q)}</span></button>`;}).join("")}</div>
      <div class="meal-a"><button class="btn sm ${done?"pri":""}" data-a="done" data-k="${k}">${done?"Hecha":"Marcar hecha"}</button><button class="btn sm" data-a="recipe" data-m="${mi}">Receta</button><button class="btn sm" data-a="regenMeal" data-m="${mi}">Cambiar comida</button><button class="btn sm" data-a="fuera" data-m="${mi}">Como fuera</button><button class="btn sm ghost" data-a="fav" data-m="${mi}">Guardar favorita</button></div></div>`;
  }).join("")}
  <p class="hint">Toca un alimento para cambiarlo por otro equivalente. Las cantidades de cereales, arroz y pasta son en crudo.</p>
  <div class="row">${confirmRegen?`<span>Se perderán los cambios de esta semana.</span><button class="btn danger" data-a="genWeek">Sí, rehacer</button><button class="btn ghost" data-a="cancelConfirm">No</button>`:`<button class="btn" data-a="askConfirm" data-k="regenWeek">Rehacer la semana entera</button>`}</div>
  </div>`;
}
function sheetSwap(p,mi,ii){
  const menu=p.menus[UI.menuWeek];const m=menu.days[UI.diaIdx].meals[mi];const f=FOOD[m.items[ii].id];
  const alts=alternatives(p,m,ii).sort((a,b)=>((p.prefs[b.id]===1)-(p.prefs[a.id]===1))||a.name.localeCompare(b.name));
  return `<div class="sheet-h"><div><span class="lbl">Cambiar</span><h2>${esc(f.name)}</h2></div><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <p class="small muted" style="margin-bottom:10px">Se recalculan las cantidades para mantener los macros de la comida.</p>
  ${alts.length?`<div class="items">${alts.map(a=>`<button class="item" data-a="doSwap" data-m="${mi}" data-i="${ii}" data-id="${a.id}"><span class="nm">${esc(a.name)}${p.prefs[a.id]===1?' <span class="good small">· te gusta</span>':""}</span><span class="small muted num">${a.kcal} kcal/100 g</span></button>`).join("")}</div>`:`<p class="muted">No hay alternativas con tus preferencias y restricciones.</p>`}`;
}
function sheetFuera(mi){
  const menu=P().menus[UI.menuWeek];const m=menu.days[UI.diaIdx].meals[mi];
  return `<div class="sheet-h"><div><span class="lbl">${esc(m.name)}</span><h2>Como fuera</h2></div><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <p class="small muted" style="margin-bottom:12px">Elige lo más parecido. La app reserva esas calorías y reduce hidratos y grasas del resto del día, manteniendo la proteína.</p>
  <div class="items">${FUERA_PRESETS.map(([t,k])=>`<button class="item" data-a="setFuera" data-m="${mi}" data-l="${esc(t)}" data-k="${k}"><span class="nm">${esc(t)}</span><span class="q">≈ ${k} kcal</span></button>`).join("")}</div>
  <form class="row" data-s="fueraCustom" data-m="${mi}" style="margin-top:14px"><input class="inp" style="flex:2;min-width:140px" name="l" id="fu_l" placeholder="Otra cosa"><input class="inp num" style="flex:1;min-width:90px" type="number" name="k" id="fu_k" placeholder="kcal"><button class="btn pri">Usar</button></form>`;
}
function sheetRecipe(mi){
  const menu=P().menus[UI.menuWeek];const m=menu.days[UI.diaIdx].meals[mi];
  return `<div class="sheet-h"><div><span class="lbl">${esc(m.name)}</span><h2>Cómo prepararlo</h2></div><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:9px">${recipe(m).map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
  <p class="hint" style="margin-top:14px">Pesa siempre el aceite. Los cereales, la pasta y el arroz se pesan en crudo.</p>`;
}

/* ===== Compra ===== */
/* ===== Batch cooking ===== */
function viewCocina(p){
  const ws=UI.menuWeek;const menu=p.menus[ws];
  if(!menu)return `<div class="head"><div><h1>Batch cooking</h1></div>${weekNav(ws,"menuW")}</div><div class="card empty"><h2>Primero genera el menú</h2><p class="muted">El plan de cocina sale de las comidas y cenas de la semana.</p><button class="btn pri" data-a="go" data-v="dieta">Ir a la dieta</button></div>`;
  const b=batchPlan(menu);
  const cooked={hervir:{arroz_blanco:2.8,arroz_integral:2.6,arroz_basmati:2.8,pasta:2.2,pasta_integral:2.2,pasta_legumbre:2.2,quinoa:2.7},cuscus:2.2};
  const row=x=>`<tr><td>${esc(x.f.name)}</td><td class="num"><b>${Math.round(x.g)} g</b></td><td class="num">${x.por}</td><td class="muted small">${{plancha:"Plancha",horno:"Horno",guiso:"Guiso",vapor:"Vapor",hervir:"Hervir",cuscus:"Hidratar",huevo:"Cocer",saltear:"Saltear",hidratar:"Hidratar"}[x.f.m]||x.f.m}</td></tr>`;
  const steps=[];
  const hasHorno=[...b.P,...b.C,...b.V].some(x=>x.f.m==="horno");
  const hasHervir=b.C.some(x=>x.f.m==="hervir"||x.f.m==="cuscus");
  steps.push(["Preparación",[hasHorno?"Enciende el horno a 210 °C.":null,hasHervir?"Pon agua a hervir para arroz o pasta.":null,"Pesa en crudo todas las raciones y prepara los recipientes con etiqueta (día y comida)."].filter(Boolean)]);
  if(hasHorno)steps.push(["Horno",[...b.C,...b.P,...b.V].filter(x=>x.f.m==="horno").map(x=>`${x.f.name}: ${Math.round(x.g)} g`)]);
  if(hasHervir)steps.push(["Fuego",b.C.filter(x=>x.f.m==="hervir"||x.f.m==="cuscus").map(x=>{const fc=x.f.m==="cuscus"?2.2:(cooked.hervir[x.f.id]||2.5);return `${x.f.name}: ${Math.round(x.g)} g en crudo (unos ${Math.round(x.g*fc)} g cocido)`;})]);
  const pl=b.P.filter(x=>x.f.m!=="horno");if(pl.length)steps.push(["Proteínas",pl.map(x=>`${x.f.name}: ${Math.round(x.g)} g, en ${x.por} raciones`)]);
  const vv=b.V.filter(x=>x.f.m!=="horno");if(vv.length)steps.push(["Verduras",vv.map(x=>`${x.f.name}: ${Math.round(x.g)} g`)]);
  steps.push(["Montaje",[`Reparte en ${b.tuppers} recipientes de comida y cena.`,"Deja enfriar antes de tapar y meter en nevera o congelador."]]);
  return `<div class="head"><div><h1>Batch cooking</h1><p class="sub">${b.tuppers} comidas y cenas para cocinar de una vez</p></div>${weekNav(ws,"menuW")}</div>
  <div class="stack">
  <div class="card"><span class="lbl">Qué cocinar</span><div class="scroll" style="margin-top:8px"><table class="t"><thead><tr><th>Alimento</th><th>Total crudo</th><th>Raciones</th><th>Cómo</th></tr></thead><tbody>
    ${[...b.P,...b.C,...b.V].map(row).join("")||`<tr><td colspan="4" class="muted">No hay nada que cocinar con antelación.</td></tr>`}</tbody></table></div></div>
  <div class="card stack"><span class="lbl">Orden de trabajo</span>${steps.map(([h,l],i)=>`<div><h3>${i+1}. ${h}</h3><ul style="margin:6px 0 0;padding-left:20px">${l.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>
  <div class="card"><span class="lbl">Conservación</span><table class="t" style="margin-top:6px"><tbody>
    <tr><td>Lunes a miércoles</td><td>Nevera</td></tr><tr><td>Jueves a domingo</td><td>Congelador</td></tr>
    <tr><td>Cada noche</td><td>Pasa la comida del día siguiente a la nevera</td></tr>
    <tr><td>Ensaladas, fruta y aguacate</td><td>Prepáralos el mismo día</td></tr>
    <tr><td>Arroz cocido</td><td>Enfríalo rápido y no lo guardes más de 3 días en nevera</td></tr></tbody></table></div></div>`;
}

/* ===== Alimentos y preferencias ===== */
function viewAlimentos(p){
  const ban=banned(p);const q=UI.q.trim().toLowerCase();
  const list=q?FOODS.filter(f=>f.name.toLowerCase().includes(q)):FOODS.filter(f=>f.cat===UI.cat);
  const cnt=v=>Object.values(p.prefs).filter(x=>x===v).length;
  const tri=f=>{const v=p.prefs[f.id]??0;return `<div class="tri" role="group" aria-label="${esc(f.name)}"><button class="l ${v===1?"on":""}" data-a="pref" data-id="${f.id}" data-v="1">Me gusta</button><button class="n ${v===0?"on":""}" data-a="pref" data-id="${f.id}" data-v="0">Igual</button><button class="x ${v===-1?"on":""}" data-a="pref" data-id="${f.id}" data-v="-1">No</button></div>`;};
  return `<div class="head"><div><h1>Alimentos</h1><p class="sub">${FOODS.length} alimentos · ${cnt(1)} te gustan · ${cnt(-1)} descartados</p></div></div>
  <div class="stack">
  <div class="card stack"><span class="lbl">Restricciones</span><p class="small muted">Excluyen alimentos por completo, aunque los hayas marcado como que te gustan.</p>
    <div class="grid2">${RESTRICTIONS.map(([k,t])=>`<label class="chk"><input type="checkbox" data-c="restr" data-k="${k}" id="rs_${k}" ${(p.restr||[]).includes(k)?"checked":""}> ${t}</label>`).join("")}</div></div>
  <div class="card stack">
    <input class="inp" type="search" id="fsearch" placeholder="Buscar alimento" value="${esc(UI.q)}" data-c="search">
    ${q?"":`<div class="grps">${GROUPS.map(g=>`<div class="grp ${g.cats.includes(UI.cat)?"open":""}" style="--gc:${g.col}"><div class="grp-h"><b>${g.t}</b></div><div class="chips wrap">${g.cats.map(k=>`<button class="${UI.cat===k?"on":""}" data-a="cat" data-k="${k}">${CATS.find(c=>c[0]===k)[1]}</button>`).join("")}</div></div>`).join("")}</div>
    <div class="catinfo" style="--gc:${groupOfCat(UI.cat).col}"><span class="lbl">${groupOfCat(UI.cat).t} · ${CATS.find(c=>c[0]===UI.cat)[1]}</span><p>${groupOfCat(UI.cat).d}</p><p class="small muted">${CAT_INFO[UI.cat]||""}</p></div>
    <div class="row"><span class="small muted">Toda la categoría:</span><button class="btn sm" data-a="prefAll" data-v="1">Me gusta</button><button class="btn sm" data-a="prefAll" data-v="0">Igual</button><button class="btn sm" data-a="prefAll" data-v="-1">No</button></div>`}
    <div>${list.map(f=>{const b=f.t.some(t=>ban.has(t));return `<div class="food ${b?"ban":""}"><div style="min-width:0"><div>${esc(f.name)}</div><div class="small muted num">${f.kcal} kcal · P ${f.p} · G ${f.f} · HC ${f.c}${f.u?` · 1 ${f.un} ≈ ${f.u} g`:""}${b?" · excluido por restricción":""}</div></div>${b?"":tri(f)}</div>`;}).join("")||`<p class="muted">Nada coincide con la búsqueda.</p>`}</div>
  </div>
  <div class="row end"><button class="btn pri" data-a="genFromPrefs">Generar menú con estos gustos</button></div></div>`;
}

/* ===== Objetivos ===== */
function viewObjetivos(p){
  const t=p.targets;const calc=computeTargets(p);const ad=adaptiveTDEE(p);
  const wd=weeksInDeficit(p);
  const gc=goalCfg(p);const showR=["recomp","definicion","volumen","estetica"].includes(p.meta);
  return `<div class="head"><div><h1>Objetivos</h1><p class="sub">${gc.t}${gc.fase?" · "+gc.fase:""}${showR?" · ritmo "+RITMO_TXT[p.ritmo].toLowerCase():""}</p></div><button class="btn" data-a="editT">Editar a mano</button></div>
  <div class="stack">
  <div class="card stack"><div class="row between"><span class="lbl">Tu objetivo ${infoBtn("objetivo","objetivo")}</span>${p.goalSince?`<span class="small muted">desde el ${fdate(p.goalSince)}</span>`:""}</div>
    ${goalCards(p.meta,"goalAsk")}
    ${showR?`<div class="field"><span>Ritmo</span><div class="seg">${[["suave","Suave"],["normal","Normal"],["rapido","Rápido"]].map(([k,t])=>`<button class="${p.ritmo===k?"on":""}" data-a="cfgSet" data-k="ritmo" data-val="${k}">${t}</button>`).join("")}</div><span class="hint">${ritmoHint({meta:p.meta,ritmo:p.ritmo})}</span></div>`:""}</div>
  <div class="card stack"><span class="lbl">Cómo comes</span>
    <div class="field"><span>Estilo de dieta ${infoBtn("estilo","estilo de dieta")}</span>${choiceCards(DIET_STYLES,p.dietaEstilo,"cfgSet","dietaEstilo","e_")}</div>
    ${p.dietaEstilo!=="keto"?`<div class="field"><span>Reparto de hidratos ${infoBtn("reparto","reparto")}</span><div class="seg">${Object.entries(REPARTOS).map(([k,v])=>`<button class="${p.reparto===k?"on":""}" data-a="cfgSet" data-k="reparto" data-val="${k}">${v[0]}</button>`).join("")}</div><span class="hint">${REPARTOS[p.reparto][1]}</span></div>`:""}
    <div class="field"><span>Días de recarga ${infoBtn("recarga","recarga")}</span><div class="seg">${[["0","Ninguno"],["1","Uno"],["2","Dos"]].map(([k,t])=>`<button class="${String(p.recarga)===k?"on":""}" data-a="cfgSet" data-k="recarga" data-val="${k}">${t}</button>`).join("")}</div>${refeedDays(p).length?`<span class="hint">Recarga: ${refeedDays(p).map(i=>DIAS[i]).join(" y ")}.</span>`:""}</div>
    <label class="chk"><input type="checkbox" data-c="cfgAyuno" id="cf_ayuno" ${p.ayuno&&p.ayuno.on?"checked":""}><span>Ayuno intermitente ${infoBtn("ayuno","ayuno")}${p.ayuno&&p.ayuno.on?`<br><span class="hint">${ayunoTxt(p)}</span>`:""}</span></label>
    ${p.ayuno&&p.ayuno.on?`<div class="grid2"><label class="field"><span>Primera comida</span><input class="inp" type="time" id="cf_ini" data-c="cfgAyIni" value="${esc(p.ayuno.ini)}"></label><label class="field"><span>Horas de ventana</span><input class="inp num" type="number" min="4" max="12" id="cf_h" data-c="cfgAyH" value="${p.ayuno.h}"></label></div>`:""}
    <div class="field"><span>Comidas al día</span><div class="seg">${((p.ayuno&&p.ayuno.on)?[["2","2"],["3a","3"]]:Object.entries(MEAL_TXT)).map(([k,t])=>`<button class="${p.comidas===k?"on":""}" data-a="cfgSet" data-k="comidas" data-val="${k}">${String(t).replace(" comidas","").replace(" sin desayuno"," sin desayuno")}</button>`).join("")}</div></div>
    <label class="field"><span>Pasos diarios objetivo ${infoBtn("pasos","pasos")}</span><input class="inp num" type="number" step="500" id="cf_pasos" data-c="cfgPasos" value="${p.pasosObj||""}"></label>
  </div>
  <div class="card stack"><div class="row between"><span class="lbl">Objetivo diario actual</span><span class="big">${t.kcal}<span class="small muted"> kcal</span></span></div>${macroBars(t)}
    <p class="small">${sportSummary(p)}.</p>
    <p class="small muted">Las subidas y bajadas automáticas mueven sobre todo los hidratos, en escalones de ${stepKcal(t)} kcal. La proteína se mantiene.</p></div>
  <div class="card stack"><span class="lbl">Gasto energético</span>
    <div class="grid2"><div><span class="small muted">Según fórmula (Mifflin-St Jeor × actividad)</span><div class="num"><b>${calc.tdee} kcal</b></div></div>
    <div><span class="small muted">Según tus datos reales</span><div class="num"><b>${ad?ad.tdee+" kcal":"—"}</b></div>${ad?`<span class="hint">${ad.weeks} semanas, ${sgn(ad.slope,2)} kg/semana</span>`:`<span class="hint">Necesita 3 semanas completas con 3 o más pesadas.</span>`}</div></div>
    <div class="row">${ad?`<button class="btn pri" data-a="recal" data-src="real">Recalcular con mi gasto real</button>`:""}<button class="btn" data-a="recal" data-src="formula">Recalcular con la fórmula</button></div>
    <p class="small muted">Metabolismo basal ${calc.bmr} kcal · grasa estimada ${nf(calc.bf)} % · masa magra ${nf(calc.lbm)} kg · mínimo ${calc.floor} kcal.</p></div>
  <div class="card stack"><span class="lbl">Pausa de dieta</span>
    ${p.pausa?`<p>En pausa desde el ${fdate(p.pausa.desde)} a ${p.targets.kcal} kcal. Al terminar vuelves a ${p.pausa.prev.kcal} kcal.</p><button class="btn pri" data-a="endPausa">Terminar pausa y volver al déficit</button>`
      :`<p class="small muted">${p.objetivo==="perder"?`Llevas ${wd} semanas en déficit. Tras 8-12 semanas, 1-2 semanas en mantenimiento ayudan a sostener la adherencia y el rendimiento.`:"Solo aplica cuando el objetivo es perder grasa."}</p>${p.objetivo==="perder"?`<button class="btn" data-a="startPausa">Empezar pausa (${ad?ad.tdee:calc.tdee} kcal)</button>`:""}`}</div>
  <div class="card"><span class="lbl">Historial de cambios</span><div class="scroll" style="margin-top:8px"><table class="t"><thead><tr><th>Fecha</th><th>Kcal</th><th>P</th><th>G</th><th>HC</th><th>Motivo</th></tr></thead><tbody>
    ${p.history.slice().reverse().map(h=>`<tr><td>${fdate(h.date)}</td><td>${h.kcal}</td><td>${h.p}</td><td>${h.f}</td><td>${h.c}</td><td class="small">${esc(h.motivo)}</td></tr>`).join("")}</tbody></table></div></div></div>`;
}
function sheetEditT(){
  const t=P().targets;
  return `<div class="sheet-h"><h2>Editar objetivos</h2><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <form data-s="saveT" class="stack"><div class="grid3">${[["p","Proteína (g)"],["f","Grasas (g)"],["c","Hidratos (g)"]].map(([k,l])=>`<label class="field"><span>${l}</span><input class="inp num" type="number" name="${k}" id="et_${k}" value="${t[k]}"></label>`).join("")}</div>
  <p class="hint">Las calorías se calculan solas: 4 kcal por gramo de proteína e hidratos, 9 por gramo de grasa.</p>
  <button class="btn pri">Guardar</button></form>`;
}

/* ===== Perfil ===== */
function viewPerfil(p){
  const num=(n,l,st="1")=>`<label class="field"><span>${l}</span><input class="inp num" type="number" step="${st}" name="${n}" id="pf_${n}" value="${p[n]??""}"></label>`;
  const sel=(n,l,opts)=>`<label class="field"><span>${l}</span><select class="inp" name="${n}" id="pf_${n}">${opts.map(([a,b])=>`<option value="${a}" ${String(p[n])===String(a)?"selected":""}>${b}</option>`).join("")}</select></label>`;
  const others=Object.values(S.profiles).filter(x=>x.id!==p.id);
  return `<div class="head"><div><h1>Perfil</h1><p class="sub">${esc(p.nombre)} · desde el ${fdate(p.creado)}</p></div></div>
  <div class="stack">
  <form class="card stack" data-s="saveProfile"><span class="lbl">Datos</span>
    <div class="grid3"><label class="field"><span>Nombre</span><input class="inp" name="nombre" id="pf_nombre" value="${esc(p.nombre)}"></label>
    ${sel("sexo","Sexo",[["H","Hombre"],["M","Mujer"]])}<label class="field"><span>Fecha de nacimiento</span><input class="inp" type="date" name="nac" id="pf_nac" value="${esc(p.nac||"")}" max="${today()}"><span class="hint">${p.nac?edadDe(p)+" años":"Añádela para que la edad se actualice sola"}</span></label>${num("altura","Altura (cm)")}${num("cuello","Cuello (cm)","0.1")}${p.sexo==="M"?num("cadera","Cadera (cm)","0.1"):""}
    ${sel("trabajo","Trabajo",[["sentado","Sentado"],["mixto","De pie / mixto"],["fisico","Físico"]])}${num("pasos","Pasos al día")}
${num("grasaObj","Grasa objetivo (%)")}
    ${sel("comidas","Comidas al día",Object.entries(MEAL_TXT))}</div>
    <p class="hint">Al guardar se recalculan los objetivos con la fórmula. Si cambias el número de comidas, rehaz el menú de la semana.</p>
    ${UI.err?`<p class="err">${esc(UI.err)}</p>`:""}
    <div class="row end"><button class="btn pri">Guardar y recalcular</button></div></form>
  <div class="card stack"><span class="lbl">Deporte y semana tipo</span>${sportPicker(p,"pf")}
    ${UI.pfDirty?`<div class="alert warn"><span class="dot"></span><div><b>Cambios guardados</b>Recalcula para que se apliquen a tus calorías y macros.<div style="margin-top:8px"><button class="btn sm pri" data-a="recal" data-src="formula">Recalcular objetivos</button></div></div></div>`:""}</div>
  <div class="card stack"><span class="lbl">Perfiles en este dispositivo</span>
    ${others.length?others.map(o=>`<div class="row between"><span>${esc(o.nombre)}</span><button class="btn sm" data-a="switch" data-id="${o.id}">Cambiar a este</button></div>`).join(""):`<p class="small muted">Solo hay este perfil. Si otra persona usa este mismo móvil, crea el suyo y así no se mezclan los datos.</p>`}
    <div class="row"><button class="btn" data-a="newProfile">Crear otro perfil</button></div></div>
  <div class="card stack"><span class="lbl">Borrar perfil</span>
    ${UI.confirm==="delProfile"?`<p>Se borrarán todos los datos de ${esc(p.nombre)} en este dispositivo. No se puede deshacer.</p><div class="row"><button class="btn danger" data-a="delProfile">Sí, borrar</button><button class="btn ghost" data-a="cancelConfirm">Cancelar</button></div>`
    :`<p class="small muted">Haz antes una copia de seguridad si quieres conservarlo.</p><div><button class="btn danger" data-a="askConfirm" data-k="delProfile">Borrar ${esc(p.nombre)}</button></div>`}</div></div>`;
}

/* ===== Copias ===== */
function viewCopias(){
  const json=JSON.stringify({app:"afina",v:2,fecha:new Date().toISOString(),profiles:S.profiles},null,0);
  return `<div class="head"><div><h1>Copia de seguridad</h1><p class="sub">${S.lastBackup?"Última copia: "+fdate(S.lastBackup.slice(0,10)):"Sin copias todavía"}</p></div></div>
  <div class="stack">
  ${memoryOnly?`<div class="alert bad"><span class="dot"></span><div><b>Este navegador no está guardando datos</b>Puede ser una ventana privada. Haz copia antes de cerrar.</div></div>`:""}
  <div class="card stack"><h2>Guardar copia</h2><p class="muted small">Copia el texto y pégalo en una nota, un correo a ti mismo o un archivo de Drive. Contiene todos los perfiles de este dispositivo.</p>
    <textarea class="inp" id="bk_out" readonly>${esc(json)}</textarea>
    <div class="row"><button class="btn pri" data-a="copyBackup">Copiar copia de seguridad</button><span class="small muted">${Math.round(json.length/1024)} KB</span></div></div>
  <div class="card stack"><h2>Restaurar</h2><p class="muted small">Pega aquí una copia o elige el archivo donde la guardaste.</p>
    <input type="file" accept=".txt,.json,text/plain,application/json" id="bk_file" data-c="bkFile" class="inp">
    <textarea class="inp" id="bk_in" placeholder="Pega aquí la copia">${esc(UI.bkIn||"")}</textarea>
    ${UI.err?`<p class="err">${esc(UI.err)}</p>`:""}
    ${UI.confirm==="import"?`<p>¿Cómo quieres restaurar?</p><div class="row"><button class="btn pri" data-a="doImport" data-mode="merge">Añadir y actualizar perfiles</button><button class="btn danger" data-a="doImport" data-mode="replace">Sustituir todo</button><button class="btn ghost" data-a="cancelConfirm">Cancelar</button></div>`
      :`<div class="row"><button class="btn" data-a="checkImport">Restaurar copia</button></div>`}</div>
  <div class="card flat small muted">Esta app guarda los datos solo en el navegador de este dispositivo. Si pasas el enlace a otra persona, empieza con sus propios datos y no ve ni toca los tuyos. Si borras los datos del navegador o cambias de móvil, solo recuperas lo que tengas en una copia.</div></div>`;
}
function dayChips(name,sel){return `<div class="dchips">${DIAS.map((x,i)=>`<label class="dchip"><input type="checkbox" name="${name}" value="${i}" ${sel.includes(i)?"checked":""}><span>${i===2?"X":x[0]}</span></label>`).join("")}</div>`;}
function sportSummary(p){
  const pd=planDays(p);if(!pd.length)return "Sin deporte";
  const cnt={};pd.forEach(d=>cnt[d.s.id]=(cnt[d.s.id]||0)+1);
  const parts=sportsOf(p).filter(id=>cnt[id]).map(id=>`${SPORT[id].t} ${cnt[id]} día${cnt[id]>1?"s":""}`);
  return `Principal: ${depName(p)} (${TIPOS[SPORT[p.deporte].tipo].t.toLowerCase()}) · ${parts.join(", ")}${p.ciclado?" · hidratos repartidos según el entreno de cada día":""}`;
}
function sportPicker(d,ns){
  const main=d.deporte||"";const sec=d.secundarios||[];const plan=d.plan||Array(7).fill("");
  const chips=(sel,act,excl)=>SPORT_GROUPS.map(([g,gt])=>`<div class="spg"><span class="small muted">${gt}</span><div class="chips wrap">${SPORTS.filter(s=>s.tipo===g&&s.id!==excl).map(s=>`<button type="button" class="${sel.includes(s.id)?"on":""}" data-a="${act}" data-ns="${ns}" data-id="${s.id}">${s.t}</button>`).join("")}</div></div>`).join("");
  const opts=[["","Descanso"],...[main,...sec].filter(Boolean).map(id=>[id,SPORT[id].t])];
  return `<div class="field"><span>1. Deporte principal</span><span class="hint">El que más practicas o el que más te importa. Marca la proteína, las grasas y los hidratos de base.</span>
    <div class="chips wrap"><button type="button" class="${!main?"on":""}" data-a="spMain" data-ns="${ns}" data-id="">Sin deporte</button></div>${chips([main],"spMain")}</div>
  ${main?`<div class="field"><span>2. Otros deportes (opcional)</span><span class="hint">Los que haces además. Cuentan para el gasto y los hidratos del día que los practicas.</span>${chips(sec,"spSec",main)}</div>
  <div class="field"><span>3. Tu semana tipo</span><span class="hint">Qué haces cada día. Si un día haces dos cosas, elige la más dura.</span>
    <div class="week7">${DIAS.map((dn,i)=>`<label><span>${dn.slice(0,3)}</span><select class="inp" data-c="spDay" data-ns="${ns}" data-i="${i}" id="${ns}_day${i}">${opts.map(([v,t])=>`<option value="${v}" ${plan[i]===v?"selected":""}>${t}</option>`).join("")}</select></label>`).join("")}</div></div>
  <label class="chk"><input type="checkbox" data-c="spCic" data-ns="${ns}" id="${ns}_cic" ${d.ciclado?"checked":""}><span>Repartir los hidratos según el entreno de cada día<br><span class="hint">Más en los días duros (resistencia, híbridos), menos en descanso. Las calorías de la semana no cambian.</span></span></label>
  ${["hibrido"].includes(SPORT[main].tipo)||sec.some(id=>SPORT[id].tipo==="hibrido")?`<p class="hint">Triatlón, Hyrox y CrossFit van como híbridos: proteína alta como en fuerza e hidratos altos como en resistencia.</p>`:""}`:""}`;
}
function spTarget(ns){if(ns==="ob"){readOb();return UI.ob.d;}return P();}
function spDone(ns){const d=spTarget(ns);d.entrenos=(d.plan||[]).filter(Boolean).length;if(ns==="pf"){UI.pfDirty=true;commit();}else render();}
function periTag(p,day,mi){
  const g=p.gym;if(!day.T||!day.T.train||!(g&&g.setup&&day.T.sport==="gimnasio"||p.reparto==="peri"))return "";
  const {pre,post}=periIdx(p,MEAL_SETS[p.comidas]||day.meals.map(m=>[m.name]));
  return mi===pre?"Antes de entrenar":mi===post?"Después de entrenar":"";
}
function viewMas(){
  const it=[["compra","Compra","Lista de la semana","cart"],["cocina","Batch cooking","Qué cocinar y cómo conservarlo","pot"],["alimentos","Alimentos","Gustos y restricciones","leaf"],["objetivos","Objetivos","Calorías, macros y pausas","target"],["perfil","Perfil","Datos, perfiles y borrado","user"],["copias","Copia de seguridad","Guardar y restaurar","save"],["aprende","Por qué Afina","Cómo funciona tu cuerpo y qué buscamos","book"]];
  return `<div class="head"><h1>Más</h1></div><div class="mas">${it.map(([k,t,d,i])=>`<button data-a="go" data-v="${k}">${ic(i)}<b>${t}</b><span>${d}</span></button>`).join("")}</div>`;
}

/* ===== Acciones ===== */
function logTargets(p,t,motivo,tipo){if(t.tdee)p.tdeeRef=t.tdee;if(tipo==="recal")p.recalcPending=false;p.targets={kcal:t.kcal,p:t.p,f:t.f,c:t.c};p.history.push({date:today(),...p.targets,motivo,tipo});}
const A={
  go:el=>{UI.view=el.dataset.v;UI.confirm=null;UI.err=null;UI.sheet=null;render();window.scrollTo(0,0);},
  goReg:el=>{UI.regWeek=el.dataset.w;UI.view="registro";render();window.scrollTo(0,0);},
  obSet:el=>{readOb();UI.ob.d[el.dataset.k]=el.dataset.val;if(el.dataset.k==="estilo"&&el.dataset.val==="keto"){UI.ob.d.reparto="igual";if(UI.ob.d.recarga==="0")UI.ob.d.recarga="1";}if(el.dataset.k==="objetivo"&&el.dataset.val==="ganar"&&UI.ob.d.ritmo==="rapido")UI.ob.d.ritmo="normal";render();},
  obBack:()=>{readOb();UI.err=null;UI.ob.step--;render();},
  obCancel:()=>{UI.ob=null;UI.err=null;render();},
  spMain:el=>{const ns=el.dataset.ns;const d=spTarget(ns);const old=d.deporte;const id=el.dataset.id;
    d.deporte=id;d.secundarios=(d.secundarios||[]).filter(x=>x!==id);d.plan=d.plan||Array(7).fill("");
    if(!id){d.secundarios=[];d.plan=Array(7).fill("");d.ciclado=false;}
    else if(old)d.plan=d.plan.map(x=>x===old?id:x);
    if(id&&!d.plan.includes(id))[0,2,4].forEach(i=>{if(!d.plan[i])d.plan[i]=id;});
    spDone(ns);},
  spSec:el=>{const ns=el.dataset.ns;const d=spTarget(ns);const id=el.dataset.id;d.secundarios=d.secundarios||[];
    if(d.secundarios.includes(id)){d.secundarios=d.secundarios.filter(x=>x!==id);d.plan=d.plan.map(x=>x===id?"":x);}
    else{d.secundarios.push(id);const free=[5,6,1,3].find(i=>!d.plan[i]);if(free!==undefined)d.plan[free]=id;}
    spDone(ns);},
  info:el=>{const k=el.dataset.k;UI.sheet=()=>sheetInfo(k);render();},
  goalAsk:el=>{const id=el.dataset.val;const p=P();if(id===p.meta){toast("Ya es tu objetivo");return;}UI.sheet=()=>sheetGoal(P(),id);render();},
  goalDo:el=>{const p=P();const id=el.dataset.k;const old=GOALS[p.meta].t;p.meta=id;p.goalSince=today();if(id==="fuerza"||id==="longevidad")p.ritmo="normal";
    syncGoal(p);p.pasosObj=GOALS[id].pasos;const t=computeTargets(p);logTargets(p,t,`Cambio de objetivo: ${old} → ${GOALS[id].t}`,"recal");
    if(p.gym&&p.gym.setup){buildGymPlan(p);p.gym.adj={};}
    UI.sheet=null;commit();toast(`Objetivo: ${GOALS[id].t}. Dieta y entreno recalculados.`);},
  cfgSet:el=>{const p=P();const k=el.dataset.k;let v=el.dataset.val;if(k==="recarga")v=+v;p[k]=v;
    if(k==="dietaEstilo"&&v==="keto"){p.reparto="igual";if(!p.recarga)p.recarga=1;}
    applyCfg(p,{ritmo:"Cambio de ritmo",dietaEstilo:`Estilo de dieta: ${(DIET_STYLES[p.dietaEstilo]||[""])[0]}`,reparto:"Cambio de reparto",recarga:"Cambio de recargas",comidas:"Cambio de comidas"}[k]);},
  openLearn:()=>{UI.learn=true;render();window.scrollTo(0,0);},
  closeLearn:()=>{UI.learn=false;render();window.scrollTo(0,0);},
  regW:el=>{const n=+el.dataset.n;const nw=addDays(UI.regWeek,n);if(nw<=weekStart(today()))UI.regWeek=nw;render();},
  applyDec:el=>{const p=P();const r=applyDecision(p,el.dataset.d);
    if(r.blocked){toast(`No se baja: ya estás en el mínimo de ${kcalFloor(p,currentWeight(p))} kcal. Sube pasos.`);return;}
    logTargets(p,r.t,`Decisión automática (${el.dataset.d==="SUBIR"?"subir":"bajar"}) semana del ${fdate(el.dataset.w)}`,"auto");p.applied[el.dataset.w]=true;commit();toast("Objetivos actualizados");},
  menuW:el=>{UI.menuWeek=el.dataset.w;UI.diaIdx=el.dataset.w===weekStart(today())?(new Date().getDay()+6)%7:0;render();},
  dia:el=>{UI.diaIdx=+el.dataset.i;render();},
  genWeek:()=>{const p=P();p.menus[UI.menuWeek]=buildWeek(p,UI.menuWeek);UI.confirm=null;Object.keys(p.done).forEach(k=>{if(weekStart(k.split(":")[0])===UI.menuWeek)delete p.done[k];});delete p.shop[UI.menuWeek];commit();toast("Menú generado");},
  genFromPrefs:()=>{const p=P();UI.view="dieta";if(p.menus[UI.menuWeek]){UI.confirm="regenWeek";render();window.scrollTo(0,document.body.scrollHeight);}else A.genWeek();},
  retarget:()=>{const p=P();retargetMenu(p,p.menus[UI.menuWeek]);commit();toast("Cantidades ajustadas");},
  askConfirm:el=>{UI.confirm=el.dataset.k;render();},
  cancelConfirm:()=>{UI.confirm=null;UI.err=null;render();},
  done:el=>{const p=P();p.done[el.dataset.k]=!p.done[el.dataset.k];commit();},
  recipe:el=>{const mi=+el.dataset.m;UI.sheet=()=>sheetRecipe(mi);render();},
  regenMeal:el=>{const p=P();regenMeal(p,p.menus[UI.menuWeek],UI.diaIdx,+el.dataset.m);commit();},
  swap:el=>{const mi=+el.dataset.m,ii=+el.dataset.i;UI.sheet=()=>sheetSwap(P(),mi,ii);render();},
  doSwap:el=>{const p=P();swapItem(p.menus[UI.menuWeek],UI.diaIdx,+el.dataset.m,+el.dataset.i,el.dataset.id);UI.sheet=null;commit();},
  fuera:el=>{const mi=+el.dataset.m;UI.sheet=()=>sheetFuera(mi);render();},
  setFuera:el=>{setFuera(+el.dataset.m,el.dataset.l,+el.dataset.k);},
  unFuera:el=>{const p=P();const menu=p.menus[UI.menuWeek];const m=menu.days[UI.diaIdx].meals[+el.dataset.m];delete m.fuera;rebalanceDay(menu,UI.diaIdx);commit();},
  fav:el=>{const p=P();const m=p.menus[UI.menuWeek].days[UI.diaIdx].meals[+el.dataset.m];p.favs=p.favs||[];
    const ids=m.items.map(i=>i.id);if(p.favs.some(f=>f.items.join()===ids.join())){toast("Ya estaba en favoritas");return;}
    p.favs.push({type:m.type,items:ids,name:ids.map(i=>FOOD[i].name).join(", ")});commit();toast("Guardada: aparecerá en próximos menús");},
  copyShop:()=>{copy(shopText(P().menus[UI.menuWeek]),"Lista copiada");},
  clearShop:()=>{delete P().shop[UI.menuWeek];commit();},
  cat:el=>{UI.cat=el.dataset.k;render();},
  pref:el=>{const p=P();const v=+el.dataset.v;if(v===0)delete p.prefs[el.dataset.id];else p.prefs[el.dataset.id]=v;commit();},
  prefAll:el=>{const p=P();const v=+el.dataset.v;const ban=banned(p);FOODS.filter(f=>f.cat===UI.cat&&!f.t.some(t=>ban.has(t))).forEach(f=>{if(v===0)delete p.prefs[f.id];else p.prefs[f.id]=v;});commit();},
  editT:()=>{UI.sheet=sheetEditT;render();},
  recal:el=>{UI.pfDirty=false;P().recalcPending=false;const p=P();const ad=adaptiveTDEE(p);const t=computeTargets(p,el.dataset.src==="real"&&ad?{tdee:ad.tdee}:{});
    logTargets(p,t,el.dataset.src==="real"?`Recalibrado con gasto real (${ad.tdee} kcal)`:"Recalculado con la fórmula","recal");commit();toast(`Nuevo objetivo: ${p.targets.kcal} kcal`);},
  startPausa:()=>{const p=P();const ad=adaptiveTDEE(p);const tdee=ad?ad.tdee:computeTargets(p).tdee;const prev={...p.targets};
    const t={...p.targets};t.c=r5(t.c+(tdee-t.kcal)/4);t.kcal=4*t.p+9*t.f+4*t.c;p.pausa={desde:today(),prev};logTargets(p,t,"Inicio de pausa de dieta","pausa");commit();},
  endPausa:()=>{const p=P();const prev=p.pausa.prev;p.pausa=null;p.ultimaPausa=today();logTargets(p,prev,"Fin de pausa de dieta","pausa");commit();},
  switch:el=>{S.active=el.dataset.id;UI.view="inicio";UI.menuWeek=weekStart(today());commit();},
  newProfile:()=>{UI.ob={step:0,d:obDefaults()};UI.err=null;render();window.scrollTo(0,0);},
  delProfile:()=>{const id=S.active;delete S.profiles[id];S.active=Object.keys(S.profiles)[0]||null;UI.confirm=null;UI.view="inicio";commit();},
  copyBackup:()=>{const ta=document.getElementById("bk_out");copy(ta.value,"Copia copiada. Pégala en un sitio seguro.",ta);S.lastBackup=new Date().toISOString();save();},
  checkImport:()=>{const t=document.getElementById("bk_in").value.trim();UI.bkIn=t;UI.err=null;
    try{const d=JSON.parse(t);if(!d||!["afina","definicion20"].includes(d.app)||!d.profiles)throw 0;UI.pending=d;UI.confirm="import";}catch(e){UI.err="Ese texto no es una copia válida de esta app. Copia el bloque completo.";}
    render();},
  doImport:el=>{const d=UI.pending;if(!d)return;if(el.dataset.mode==="replace")S.profiles={};Object.values(d.profiles).forEach(x=>{migrateSport(x);syncGoal(x);});Object.assign(S.profiles,d.profiles);
    if(!S.profiles[S.active])S.active=Object.keys(S.profiles)[0];UI.pending=null;UI.bkIn="";UI.confirm=null;UI.view="inicio";commit();toast("Copia restaurada");},
  closeSheet:(el,e)=>{if(e&&e.target.closest("[data-stop]")&&!e.target.closest('[data-a="closeSheet"]'))return;UI.sheet=null;render();}
};
function setFuera(mi,label,kcal){
  const p=P();const menu=p.menus[UI.menuWeek];const m=menu.days[UI.diaIdx].meals[mi];
  m.fuera={label,kcal};const f=rebalanceDay(menu,UI.diaIdx);UI.sheet=null;commit();
  if(f<=0.35)toast("Esa comida ocupa casi todo el día: el resto queda muy ajustado");
}
function copy(text,msg,ta){
  const done=()=>toast(msg);
  try{navigator.clipboard.writeText(text).then(done,()=>{if(ta){ta.focus();ta.select();}toast("Selecciona el texto y cópialo a mano");});}
  catch(e){if(ta){ta.focus();ta.select();}toast("Selecciona el texto y cópialo a mano");}
}
const SUB={
  obNext:f=>{readOb();const {step,d}=UI.ob;const e=obValidate(step,d);if(e){UI.err=e;render();return;}UI.err=null;
    if(step<OB_STEPS-1){UI.ob.step++;render();window.scrollTo(0,0);return;}
    const p=obToProfile(d);createProfile(p);UI.ob=null;UI.view="alimentos";UI.cat="aves";commit();toast("Perfil creado. Marca ahora lo que te gusta.");},
  quickWeight:f=>{const v=parseFloat(String(f.qw.value).replace(",","."));const p=P();
    if(!(v>=30&&v<=350)){toast("Revisa el peso");return;}p.weights[today()]=r1(v);commit();toast("Peso guardado");},
  checkin:f=>{const p=P();const g=n=>f[n]?f[n].value:"";const cint=parseFloat(String(g("cintura")).replace(",","."));
    if(g("cintura")&&!(cint>=40&&cint<=220)){toast("Revisa la cintura");return;}
    p.checkins[UI.regWeek]={cintura:cint||null,pasos:+g("pasos")||0,entrenos:+g("entrenos")||0,adherencia:+g("adherencia"),rendimiento:g("rendimiento"),ciclo:f.ciclo?f.ciclo.checked:false,notas:g("notas")};
    commit();toast("Revisión guardada");},
  fueraCustom:f=>{const k=+f.k.value;const l=f.l.value.trim()||"Comida fuera";if(!(k>=50&&k<=3000)){toast("Indica las calorías aproximadas");return;}setFuera(+f.dataset.m,l,k);},
  saveT:f=>{const p=P();const t={p:+f.p.value,f:+f.f.value,c:+f.c.value};if(!(t.p>=40&&t.f>=20&&t.c>=0)){toast("Revisa los valores");return;}
    t.kcal=4*t.p+9*t.f+4*t.c;logTargets(p,t,"Edición manual","manual");UI.sheet=null;commit();},
  saveProfile:f=>{const p=P();const n=k=>+f[k].value;
    const d={nombre:f.nombre.value.trim(),sexo:f.sexo.value,nac:f.nac.value,altura:n("altura"),cuello:n("cuello"),cadera:f.cadera?n("cadera"):p.cadera,trabajo:f.trabajo.value,pasos:n("pasos"),grasaObj:n("grasaObj"),comidas:f.comidas.value};
    if(!d.nombre||!d.nac||ageFrom(d.nac)<18||!(d.altura>=120&&d.altura<=230)||!(d.cuello>=25)){UI.err="Revisa nombre, fecha de nacimiento (18 años o más), altura y cuello.";render();return;}
    if(d.sexo==="M"&&!(d.cadera>=60)){UI.err="Para mujer hace falta la medida de cadera.";render();return;}

    UI.pfDirty=false;
    UI.err=null;Object.assign(p,d);syncGoal(p);const t=computeTargets(p);logTargets(p,t,"Cambio de perfil","recal");commit();toast(`Guardado. Objetivo: ${p.targets.kcal} kcal`);}
};
function applyCfg(p,motivo){
  syncGoal(p);const t=computeTargets(p);
  if(["kcal","p","f","c"].some(k=>t[k]!==p.targets[k]))logTargets(p,t,motivo||"Cambio de configuración","recal");
  commit();toast("Guardado. Ajusta el menú en Dieta para aplicarlo.");
}
function sheetGoal(p,id){
  const q=JSON.parse(JSON.stringify(p));q.meta=id;if(id==="fuerza"||id==="longevidad")q.ritmo="normal";syncGoal(q);
  const a=p.targets,b=computeTargets(q);const g=GOALS[id],gc=goalCfg(q);
  const lastCh=(p.history||[]).slice().reverse().find(h=>/^Cambio de objetivo/.test(h.motivo||""));const days=lastCh?daysBetween(lastCh.date,today()):99;
  const row=(l,x,y,u)=>`<tr><td>${l}</td><td class="num">${x}${u}</td><td class="num"><b>${y}${u}</b></td></tr>`;
  const ent={musculo:"centrado en músculo",fuerza:"centrado en fuerza: básicos pesados",salud:"salud y longevidad: menos fatiga"}[g.train.enfoque];
  return `<div class="sheet-h"><div><span class="lbl">Cambiar objetivo</span><h2>${g.t}</h2></div><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <div class="stack"><p>${esc(g.d)}${gc.fase?` Con tu grasa actual empezarías ${gc.fase}.`:""}</p>
  <div class="scroll"><table class="t"><thead><tr><th></th><th>Ahora</th><th>Nuevo</th></tr></thead><tbody>
  ${row("Calorías",a.kcal,b.kcal," kcal")}${row("Proteína",a.p,b.p," g")}${row("Hidratos",a.c,b.c," g")}${row("Grasas",a.f,b.f," g")}</tbody></table></div>
  <p class="small">Entreno: ${ent}${g.train.vol>1?", con más volumen":g.train.vol<0.95?", con algo menos de volumen":""}${g.train.estetica?" y series extra en los músculos que marcan la silueta":""}. ${p.gym&&p.gym.setup?"El plan de gimnasio se rehace; tu historial se mantiene.":""}</p>
  ${id==="volumen"&&bodyFat(p,currentWeight(p),currentWaist(p))>(p.sexo==="H"?18:26)?`<div class="alert warn"><span class="dot"></span><div><b>Con tu grasa actual no es lo ideal</b>Con un ${nf(bodyFat(p,currentWeight(p),currentWaist(p)))} % de grasa, comer de más suma sobre todo grasa. Recomposición o Estética te darán mejor resultado ahora; Volumen limpio funciona mejor por debajo de un ${p.sexo==="H"?15:23} %.</div></div>`:""}
  ${days<28?`<div class="alert warn"><span class="dot"></span><div><b>Cambiaste de objetivo hace ${days} días</b>Para saber si algo funciona hacen falta unas 4 semanas. Puedes cambiar igualmente.</div></div>`:""}
  <button class="btn pri wide" data-a="goalDo" data-k="${id}">Cambiar a ${g.t}</button>
  <button class="btn ghost wide" data-a="info" data-k="g_${id}">Qué es ${g.t}</button></div>`;
}
const CHG={
  obRe:el=>{readOb();render();},
  cfgAyuno:el=>{const p=P();p.ayuno=p.ayuno||{ini:"13:00",h:8};p.ayuno.on=el.checked;if(el.checked&&!["2","3a"].includes(p.comidas))p.comidas="3a";applyCfg(p,"Ayuno intermitente");},
  cfgAyIni:el=>{const p=P();p.ayuno.ini=el.value||"13:00";commit();},
  cfgAyH:el=>{const p=P();const h=+el.value;if(h>=4&&h<=12){p.ayuno.h=h;commit();}else toast("Entre 4 y 12 horas");},
  cfgPasos:el=>{const p=P();const v=+el.value;if(v>=1000&&v<=30000){p.pasosObj=v;commit();}else toast("Revisa los pasos");},
  spDay:el=>{const ns=el.dataset.ns;const d=spTarget(ns);d.plan[+el.dataset.i]=el.value;spDone(ns);},
  spCic:el=>{const ns=el.dataset.ns;const d=spTarget(ns);d.ciclado=el.checked;spDone(ns);},
  dayW:el=>{const p=P();const v=el.value===""?null:parseFloat(el.value.replace(",","."));
    if(v===null){delete p.weights[el.dataset.d];}else if(v>=30&&v<=350){p.weights[el.dataset.d]=r1(v);}else{toast("Revisa ese peso");return;}commit();},
  shop:el=>{const p=P();const s=p.shop[UI.menuWeek]=p.shop[UI.menuWeek]||{};s[el.dataset.id]=el.checked;commit();},
  restr:el=>{const p=P();const k=el.dataset.k;p.restr=(p.restr||[]).filter(x=>x!==k);if(el.checked)p.restr.push(k);commit();},
  search:el=>{UI.q=el.value;render();const s=document.getElementById("fsearch");if(s){s.focus();s.setSelectionRange(s.value.length,s.value.length);}},
  bkFile:el=>{const f=el.files&&el.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{UI.bkIn=String(r.result);render();A.checkImport();};r.readAsText(f);}
};
document.addEventListener("click",e=>{
  const el=e.target.closest("[data-a]");if(!el)return;
  if(el.dataset.a==="closeSheet"&&el.classList.contains("overlay")&&e.target!==el)return;
  const fn=A[el.dataset.a];if(fn){e.preventDefault();fn(el,e);}
});
document.addEventListener("change",e=>{const el=e.target.closest("[data-c]");if(el&&CHG[el.dataset.c]&&el.dataset.c!=="search")CHG[el.dataset.c](el);});
document.addEventListener("input",e=>{const el=e.target.closest('[data-c="search"]');if(el)CHG.search(el);});
document.addEventListener("submit",e=>{const f=e.target.closest("[data-s]");if(!f)return;e.preventDefault();SUB[f.dataset.s](f);});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&UI.sheet){UI.sheet=null;render();}});
