/* ===== Importar datos de PULSO =====
   Acepta: la copia de PULSO (Ajustes → Exportar), o un volcado en bruto del almacenamiento de PULSO.
   Los ejercicios se emparejan con la biblioteca de Afina; los que no existen se crean como ejercicios importados. */
PATTERNS.otro="Otros";MUSCLES.varios="Varios";
const PULSO_MAP={
  "pecho-maquina-unilateral-inclinado":"press_pecho_unilateral_inclinado","jalon-al-pecho":"jalon","hombro-maquina-unilateral":"press_hombro_unilateral",
  "prensa-plana-maquina":"prensa_horizontal","prensa-inclinada":"prensa_inclinada","peso-muerto-rumano-mancuerna":"peso_muerto_rumano_mancuernas",
  "kettlebell-swing":"swing_kettlebell","swing-kettlebell":"swing_kettlebell","flexiones":"flexiones","zancadas":"zancadas_corporal",
  "peso-muerto-kettlebell":"peso_muerto_kettlebell","sentadilla-kettlebell-frontal":"sentadilla_kettlebell","remo-una-mano-kettlebell":"remo_kettlebell",
  "press-cabeza-kettlebell":"press_kettlebell","plancha-carga-lateral":"plancha_carga_lateral"
};
const PAT_GUESS=[[/press.*(banca|pecho|inclin)|pecho|apertura|contractora|fondos/,"empuje_h","pecho"],[/militar|hombro|arnold/,"empuje_v","hombro_ant"],[/elevaci.*lateral|lateral/,"elev_lateral","hombro_lat"],
  [/pajaro|face pull|posterior/,"deltoide_post","hombro_post"],[/jalon|dominad|pull ?up/,"tiron_v","dorsal"],[/remo/,"tiron_h","espalda_media"],[/curl.*femoral|femoral/,"flex_rodilla","isquios"],
  [/curl|biceps/,"biceps","biceps"],[/triceps|frances|patada/,"triceps","triceps"],[/peso muerto|rumano|hip hinge|swing/,"bisagra","isquios"],[/hip thrust|gluteo|puente/,"gluteo","gluteo"],
  [/bulgara|zancada|step/,"zancada","cuadriceps"],[/extension.*cuadriceps|cuadriceps/,"ext_rodilla","cuadriceps"],[/sentadilla|prensa|hack|squat/,"sentadilla","cuadriceps"],
  [/gemelo|pantorrilla/,"gemelo","gemelo"],[/abdominal|plancha|crunch|core|burpee|mountain|climber/,"core","abdomen"],[/encogimiento/,"trapecio","trapecio"]];
const normName=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[-_]/g," ").replace(/\b(con|en|de|del|la|el|al|a|y|una|un)\b/g," ").replace(/\s+/g," ").trim();
function matchExercise(id,name){
  if(PULSO_MAP[id])return PULSO_MAP[id];
  const nid=String(id||"").replace(/-/g,"_");if(EXM[nid])return nid;
  const target=normName(name||id);if(!target)return null;
  const tt=new Set(target.split(" "));let best=null,bs=0;
  EX.forEach(e=>{if(e.imported)return;const n=normName(e.name);if(n===target){best=e.id;bs=9;return;}
    const et=new Set(n.split(" "));let inter=0;tt.forEach(w=>{if(et.has(w))inter++;});const sc=inter/(tt.size+et.size-inter);if(sc>bs){bs=sc;best=e.id;}});
  return bs>=0.6?best:null;
}
function registerImported(list){
  (list||[]).forEach(c=>{if(EXM[c.id])return;const e={id:c.id,name:c.name,pat:c.pat||"otro",prim:c.prim||"varios",sec:[],req:[""],st:{},C:false,S:false,B:false,rep:"h",cues:[],err:"",inc:2.5,imported:true};EX.push(e);EXM[c.id]=e;});
}
function customFor(p,id,name){
  const g=G(p);g.customEx=g.customEx||[];
  const cid="pulso_"+String(id||name).toLowerCase().replace(/[^a-z0-9]+/g,"_").slice(0,40);
  if(!g.customEx.find(c=>c.id===cid)){
    const n=normName(name||id);const guess=PAT_GUESS.find(([re])=>re.test(n));
    const c={id:cid,name:name||String(id).replace(/-/g," "),pat:guess?guess[1]:"otro",prim:guess?guess[2]:"varios"};
    g.customEx.push(c);registerImported([c]);
  }
  return cid;
}
function parsePulso(text){
  let obj;try{obj=JSON.parse(text);}catch(e){return {error:"El texto no es una copia válida. Copia el bloque completo desde PULSO."};}
  let history=null,names={};
  const grab=o=>{if(!o||typeof o!=="object")return;
    if(Array.isArray(o.history))history=o.history;else if(Array.isArray(o.historial))history=o.historial;else if(Array.isArray(o.sessions))history=o.sessions;
    const t=o.templates||o.plantillas;if(t&&t.customExerciseNames)Object.assign(names,t.customExerciseNames);
    if(o.exerciseNames)Object.assign(names,o.exerciseNames);};
  grab(obj);
  if(!history&&obj.pulsoRaw){
    Object.entries(obj.pulsoRaw).forEach(([k,v])=>{let x;try{x=JSON.parse(v);}catch(e){return;}
      if(/histor/i.test(k)&&Array.isArray(x))history=x;
      if(/templat|plantill/i.test(k)&&x&&x.customExerciseNames)Object.assign(names,x.customExerciseNames);
      if(!history&&x&&typeof x==="object")grab(x);});
  }
  if(!history)return {error:"No encuentro el historial de entrenos en ese texto."};
  const sessions=[];let skipped=0;
  history.forEach(s=>{
    const exs=s.exercises||s.ejercicios;const date=String(s.date||s.fecha||"").slice(0,10);
    if(!Array.isArray(exs)||!/^\d{4}-\d{2}-\d{2}$/.test(date)){skipped++;return;}
    const out=exs.map(e=>{const id=e.exerciseId||e.id||e.ejercicio||e.name;const nm=e.name||e.nombre||names[id]||(typeof exerciseName==="function"?null:null);
      const sets=(e.sets||e.series||[]).map(x=>{const w=parseFloat(String(x.weight??x.peso??x.kg??"").replace(",","."));const r=parseInt(x.reps??x.repeticiones??x.r,10);
        const kind=String(x.kind||x.tipo||"").toLowerCase();const rir=x.rir??x.RIR;
        return {w:isNaN(w)?0:w,r:isNaN(r)?0:r,rir:rir==null||rir===""?null:Math.min(3,+rir),warm:/aprox|calent|warm/.test(kind)};}).filter(x=>x.r>0);
      return {id,name:nm||names[id]||String(id).replace(/-/g," "),sets};}).filter(e=>e.sets.length);
    if(!out.length){skipped++;return;}
    sessions.push({sid:s.id||date+"-"+(s.type||"s"),date,name:s.name||s.title||s.sessionName||({fullbody:"Full Body",kettlebell:"Kettlebell",hiit:"HIIT"}[s.type]||"Entreno PULSO"),min:s.durationMin||s.duracion||null,exs:out});
  });
  return {sessions,skipped};
}
function pulsoPreview(p,parsed){
  const known=new Set(),unknown=new Set();
  parsed.sessions.forEach(s=>s.exs.forEach(e=>{const m=matchExercise(e.id,e.name);(m?known:unknown).add(m?EXM[m].name:e.name);}));
  const dates=parsed.sessions.map(s=>s.date).sort();
  const g=G(p);const dup=parsed.sessions.filter(s=>(g.log||[]).some(l=>l.id==="pulso-"+s.sid)).length;
  return {n:parsed.sessions.length,dup,from:dates[0],to:dates[dates.length-1],known:[...known],unknown:[...unknown],skipped:parsed.skipped};
}
function pulsoImport(p,parsed){
  const g=G(p);g.log=g.log||[];let added=0;
  parsed.sessions.forEach(s=>{
    const id="pulso-"+s.sid;if(g.log.some(l=>l.id===id))return;
    const exs=s.exs.map(e=>({ex:matchExercise(e.id,e.name)||customFor(p,e.id,e.name),orig:null,sets:e.sets}));
    g.log.push({id,date:s.date,name:s.name,sIdx:-1,week:0,wellness:"normal",min:s.min||0,exs,from:"pulso"});added++;
  });
  g.log.sort((a,b)=>a.date.localeCompare(b.date));
  return added;
}
const PULSO_BOOKMARK=`javascript:(()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k)}const t=JSON.stringify({pulsoRaw:o});navigator.clipboard.writeText(t).then(()=>alert('Datos de PULSO copiados. Pégalos en Afina.'),()=>prompt('Copia este texto',t))})()`;
function pulsoCard(){
  const pv=UI.pulsoPv;
  return `<div class="card stack"><h2>Traer tus datos de PULSO</h2>
  <p class="muted small">Tus entrenos de PULSO pasan al historial de Afina: cuentan para la progresión, la fuerza estimada y el rendimiento que usa la dieta. Puedes repetirlo sin duplicar nada.</p>
  <ol class="tight small"><li>Abre PULSO y entra en Ajustes.</li><li>Pulsa «Copiar» en la copia de seguridad (o descarga el archivo).</li><li>Vuelve aquí y pégalo abajo, o elige el archivo.</li></ol>
  <input type="file" accept=".txt,.json,application/json,text/plain" id="pl_file" data-c="plFile" class="inp">
  <textarea class="inp" id="pl_in" placeholder="Pega aquí la copia de PULSO">${esc(UI.plIn||"")}</textarea>
  ${UI.plErr?`<p class="err">${esc(UI.plErr)}</p>`:""}
  ${pv?`<div class="alert ok"><span class="dot"></span><div><b>${pv.n} sesiones encontradas${pv.from?` (${fdate(pv.from)} – ${fdate(pv.to)})`:""}</b>${pv.dup?`${pv.dup} ya estaban importadas y no se duplicarán. `:""}${pv.known.length} ejercicios reconocidos en la biblioteca de Afina${pv.unknown.length?` y ${pv.unknown.length} nuevos que se añadirán como ejercicios importados (${esc(pv.unknown.slice(0,6).join(", "))}${pv.unknown.length>6?"…":""})`:""}.${pv.skipped?` ${pv.skipped} registros sin series (HIIT o descansos) no se importan.`:""}
    <div class="row" style="margin-top:8px"><button class="btn sm pri" data-a="plDo">Importar ${pv.n-pv.dup} sesiones</button><button class="btn sm ghost" data-a="plCancel">Cancelar</button></div></div></div>`
  :`<div class="row"><button class="btn" data-a="plCheck">Revisar datos</button></div>`}
  <details><summary class="small muted" style="cursor:pointer">¿Tu PULSO no tiene botón de copiar?</summary><div class="stack small" style="margin-top:8px">
    <p>Usa este atajo: crea un marcador en Safari, edítalo y pega este código como dirección. Luego abre PULSO, toca el marcador y tus datos quedarán copiados.</p>
    <textarea class="inp" readonly id="pl_bm">${esc(PULSO_BOOKMARK)}</textarea>
    <button class="btn sm" data-a="plCopyBm">Copiar atajo</button></div></details></div>`;
}
Object.assign(A,{
  plCheck:()=>{const t=(document.getElementById("pl_in")||{}).value||"";UI.plIn=t;UI.plErr=null;UI.pulsoPv=null;
    const r=parsePulso(t.trim());if(r.error){UI.plErr=r.error;render();return;}
    if(!r.sessions.length){UI.plErr="No hay sesiones con series en esa copia.";render();return;}
    UI.plParsed=r;UI.pulsoPv=pulsoPreview(P(),r);render();},
  plDo:()=>{const p=P();const n=pulsoImport(p,UI.plParsed);UI.pulsoPv=null;UI.plParsed=null;UI.plIn="";commit();toast(`${n} sesiones de PULSO importadas`);},
  plCancel:()=>{UI.pulsoPv=null;UI.plParsed=null;render();},
  plCopyBm:()=>{copy(PULSO_BOOKMARK,"Atajo copiado",document.getElementById("pl_bm"));}
});
Object.assign(CHG,{plFile:el=>{const f=el.files&&el.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{UI.plIn=String(r.result);render();A.plCheck();};r.readAsText(f);}});
