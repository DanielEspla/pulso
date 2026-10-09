/* ===== Motor de entrenamiento de gimnasio ===== */
const NIVELES={principiante:"Principiante (menos de 1 año)",intermedio:"Intermedio (1-3 años)",avanzado:"Avanzado (más de 3 años)"};
const ENFOQUES={musculo:["Ganar o conservar músculo","Hipertrofia: la prioridad es el músculo."],fuerza:["Fuerza y músculo","Más peso en los ejercicios básicos, con trabajo de músculo detrás."],salud:["Salud y forma","Lo mínimo eficaz: menos series, menos fatiga, mismos beneficios de salud."]};
const HORAS={manana:"Por la mañana",mediodia:"A mediodía",tarde:"Por la tarde",noche:"Por la noche"};
const DURACIONES=[45,60,75,90];
const WEEK_SET_MULT=[1,1,1.15,1.25,0.5];
const WEEK_NAMES=["Semana 1 · Adaptación","Semana 2 · Acumulación","Semana 3 · Acumulación","Semana 4 · Intensificación","Semana 5 · Descarga"];

function gymDefaults(p){
  const items={};GYM_ITEMS.forEach(([id])=>items[id]=!GYM_DEFAULT_OFF.includes(id));
  const dias=(p.plan||[]).map((s,i)=>s==="gimnasio"?i:-1).filter(i=>i>=0);
  return {nivel:"intermedio",enfoque:"musculo",dias:dias.length?dias:[0,2,4],duracion:60,hora:"tarde",items,dolor:{},prio:[]};
}
function G(p){if(!p.gym)p.gym={setup:null,plan:null,meso:null,next:0,log:[],draft:null,noHay:[],pains:[],likes:{}};return p.gym;}

/* ---- Disponibilidad y molestias ---- */
function exAvailable(p,ex){const s=G(p).setup;if(!s)return true;return ex.req.every(r=>!r||s.items[r]);}
function exPain(p,ex){const d=(G(p).setup||{}).dolor||{};let m=0;for(const j in d)if(d[j])m=Math.max(m,ex.st[j]||0);return m;}
function exBlocked(p,ex){return !exAvailable(p,ex)||exPain(p,ex)>=2||(G(p).noHay||[]).includes(ex.id);}

/* ---- Plantillas de sesión ---- */
const S_=(p,sets,o={})=>({p,sets,...o});
const TEMPLATES={
  FB_A:["Cuerpo completo A",[S_("sentadilla",3,{main:1}),S_("empuje_h",3),S_("tiron_v",3),S_("bisagra",2),S_("elev_lateral",3),S_("triceps",2),S_("gemelo",2),S_("core",2)]],
  FB_B:["Cuerpo completo B",[S_("bisagra",3,{main:1}),S_("empuje_v",3),S_("tiron_h",3),S_("zancada",2),S_("aperturas",2),S_("biceps",2),S_("flex_rodilla",2),S_("core",2)]],
  FB_C:["Cuerpo completo C",[S_("sentadilla",3,{alt:1,main:1}),S_("tiron_v",3,{alt:1}),S_("empuje_h",3,{pref:"inclin",alt:1}),S_("gluteo",2),S_("deltoide_post",2),S_("biceps",2,{alt:1}),S_("triceps",2,{alt:1}),S_("gemelo",2,{alt:1})]],
  TA:["Torso A",[S_("empuje_h",3,{main:1}),S_("tiron_v",3),S_("empuje_v",2),S_("tiron_h",3),S_("elev_lateral",3),S_("biceps",2),S_("triceps",2)]],
  PA:["Pierna A",[S_("sentadilla",3,{main:1}),S_("bisagra",3),S_("ext_rodilla",3),S_("flex_rodilla",3),S_("gemelo",3),S_("core",2)]],
  TB:["Torso B",[S_("tiron_h",3,{alt:1,main:1}),S_("empuje_h",3,{pref:"inclin",alt:1}),S_("tiron_v",3,{alt:1}),S_("aperturas",2),S_("deltoide_post",2),S_("triceps",2,{alt:1}),S_("biceps",2,{alt:1})]],
  PB:["Pierna B",[S_("bisagra",3,{alt:1,main:1}),S_("zancada",3),S_("gluteo",3),S_("flex_rodilla",2,{alt:1}),S_("ext_rodilla",2,{alt:1}),S_("gemelo",3,{alt:1}),S_("core",2,{alt:1})]],
  BH:["Hombros y brazos",[S_("empuje_v",3,{alt:1,main:1}),S_("elev_lateral",3,{alt:1}),S_("deltoide_post",3,{alt:1}),S_("biceps",3,{alt:2}),S_("triceps",3,{alt:2}),S_("trapecio",2)]],
  EM:["Empuje",[S_("empuje_h",3,{main:1}),S_("empuje_v",3),S_("empuje_h",3,{pref:"inclin",alt:1}),S_("elev_lateral",3),S_("triceps",3),S_("aperturas",2)]],
  TI:["Tirón",[S_("tiron_v",3,{main:1}),S_("tiron_h",3),S_("pullover",2),S_("deltoide_post",3),S_("biceps",3),S_("trapecio",2)]],
  PI:["Pierna",[S_("sentadilla",3,{main:1}),S_("bisagra",3),S_("ext_rodilla",3),S_("flex_rodilla",3),S_("gluteo",2),S_("gemelo",3)]],
  EM2:["Empuje B",[S_("empuje_h",3,{pref:"inclin",alt:1,main:1}),S_("empuje_v",3,{alt:1}),S_("empuje_h",3,{alt:2}),S_("elev_lateral",3,{alt:1}),S_("triceps",3,{alt:1}),S_("aperturas",2,{alt:1})]],
  TI2:["Tirón B",[S_("tiron_h",3,{alt:1,main:1}),S_("tiron_v",3,{alt:1}),S_("tiron_h",2,{alt:2}),S_("deltoide_post",3,{alt:1}),S_("biceps",3,{alt:1}),S_("trapecio",2,{alt:1})]],
  PI2:["Pierna B",[S_("bisagra",3,{alt:1,main:1}),S_("zancada",3),S_("ext_rodilla",3,{alt:1}),S_("flex_rodilla",3,{alt:1}),S_("gluteo",3,{alt:1}),S_("gemelo",3,{alt:1})]]
};
const SPLITS={1:["FB_A"],2:["FB_A","FB_B"],3:["FB_A","FB_B","FB_C"],4:["TA","PA","TB","PB"],5:["TA","PA","TB","PB","BH"],6:["EM","TI","PI","EM2","TI2","PI2"]};
const SPLIT_TXT={1:"cuerpo completo",2:"cuerpo completo en dos sesiones",3:"cuerpo completo en tres sesiones",4:"torso y pierna",5:"torso, pierna y un día de hombros y brazos",6:"empuje, tirón y pierna dos veces"};
const SPLIT_WHY={
  1:"Con un solo día, cada sesión tiene que tocar todo el cuerpo. Es lo mínimo para mantener; para progresar conviene llegar a dos.",
  2:"Con dos días, cada sesión trabaja todo el cuerpo. Así cada músculo recibe estímulo dos veces por semana, que es la frecuencia que mejor funciona.",
  3:"Con tres días, cuerpo completo en rotación A, B y C. Cada músculo se entrena dos o tres veces por semana y la fatiga se reparte.",
  4:"Con cuatro días, torso y pierna dos veces cada uno. Cada músculo se entrena dos veces por semana con más series por sesión y buena recuperación.",
  5:"Con cinco días, torso y pierna dos veces más un día de hombros y brazos, que son los grupos que más agradecen volumen extra.",
  6:"Con seis días, empuje, tirón y pierna dos veces. Es lo que más volumen permite, pero exige dormir y comer bien para recuperar."
};

/* ---- Factores de volumen ---- */
function volFactor(p){
  const s=G(p).setup;const ed=edadDe(p);
  const lv={principiante:0.8,intermedio:1,avanzado:1.2}[s.nivel]||1;
  const ob={perder:0.9,mantener:1,ganar:1.1}[p.objetivo]||1;
  const en={musculo:1,fuerza:0.95,salud:0.7}[s.enfoque]||1;
  const ag=ed>=65?0.85:ed>=50?0.95:1;
  return lv*ob*en*ag;
}

/* ---- Selección de ejercicio para cada hueco ---- */
function scoreEx(p,ex,slot,usedInWeek){
  const s=G(p).setup;let sc=0;
  const like=(G(p).likes||{})[ex.id];if(like===1)sc+=5;if(like===-1)sc-=20;
  if(s.nivel==="principiante"){if(ex.B)sc+=3;if(ex.req.includes("barra")&&ex.C)sc-=1.5;}
  if(ex.S)sc+=1.5;if(ex.C)sc+=0.8;if(ex.C&&slot.main)sc+=1;
  if(!ex.C&&(ex.req.includes("poleas")||ex.req.some(r=>GYM_ITEM[r]&&GYM_ITEM[r].k==="maquina")))sc+=0.75;
  if(s.enfoque==="fuerza"&&slot.main&&ex.req.includes("barra"))sc+=3;
  if(s.enfoque==="salud"&&ex.B)sc+=1.5;
  sc-=exPain(p,ex)*3;
  if(slot.pref&&ex.id.includes(slot.pref))sc+=4;
  if(slot.pref&&!ex.id.includes(slot.pref)&&ex.pat==="empuje_h")sc-=1;
  sc-=(usedInWeek[ex.id]||0)*6;
  if(ex.req.length===1&&!ex.req[0])sc-=1.5; /* peso corporal: menos progresable */
  if(ex.rep==="s")sc-=1;
  return sc;
}
function pickEx(p,slot,usedInWeek){
  let c=EX.filter(e=>e.pat===slot.p&&!exBlocked(p,e));
  if(!c.length)return null;
  c=c.map(e=>({e,sc:scoreEx(p,e,slot,usedInWeek)})).sort((a,b)=>b.sc-a.sc);
  return c[0].e.id;
}
/* ---- Tiempo real de una sesión ----
   Serie de trabajo ≈ 45 s. Descanso según ejercicio. Calentamiento específico: 4 min el principal,
   2 min otros compuestos, 30 s aislamientos. En superserie, los dos ejercicios comparten el descanso. */
function slotMinutes(p,ex,sl,sets,inSS){
  const warm=sl.main?4:ex.C?2:0.5;const rest=restFor(p,ex,sl)/60;
  return warm+sets*(0.75+(inSS?rest*(ex.C?0.6:0.5)+0.4:rest));
}
function listMinutes(p,list){return 5+list.reduce((a,sl)=>a+slotMinutes(p,EXM[sl.ex],sl,sl.sets,!!sl.ss),0);}
/* Superseries: emparejar aislamientos consecutivos de músculos distintos */
const PUSH=["empuje_h","empuje_v"],PULL=["tiron_h","tiron_v"];
function pairSupersets(list,lvl){
  list.forEach(x=>delete x.ss);let tag=0;
  for(let i=0;i<list.length-1;i++){
    if(list[i].ss||list[i].main||list[i+1].main)continue;
    const a=EXM[list[i].ex],b=EXM[list[i+1].ex];
    if(a.rep==="s"||b.rep==="s")continue;
    const sameMachine=a.req[0]&&a.req.join()===b.req.join()&&GYM_ITEM[a.req[0]]&&GYM_ITEM[a.req[0]].k==="maquina";
    const iso=!a.C&&!b.C&&a.prim!==b.prim&&!sameMachine;
    const antag=lvl!=="principiante"&&a.C&&b.C&&((PUSH.includes(a.pat)&&PULL.includes(b.pat))||(PULL.includes(a.pat)&&PUSH.includes(b.pat)));
    if(iso||antag){const id="ABCD"[tag++];list[i].ss=id;list[i+1].ss=id;i++;}
  }
}
const VOL_TARGET={principiante:10,intermedio:14,avanzado:18};
function volTarget(p){
  const s=G(p).setup;const ed=edadDe(p);
  return VOL_TARGET[s.nivel]*({perder:0.9,mantener:1,ganar:1.1}[p.objetivo]||1)*(ed>=65?0.85:ed>=50?0.95:1)*({musculo:1,fuerza:0.9,salud:0.65}[s.enfoque]||1);
}
function buildGymPlan(p){
  const g=G(p);const s=g.setup;const n=Math.max(1,Math.min(6,s.dias.length));
  const keys=SPLITS[n];const vf=volFactor(p);const used={};
  const budget=(s.duracion||60)*0.92;const maxSets=s.nivel==="principiante"?3:4;
  const sessions=keys.map(k=>{
    const [name,slots]=TEMPLATES[k];
    let list=slots.map(sl=>{
      let sets=sl.sets*vf;
      const ex0=EX.find(e=>e.pat===sl.p);const mus=ex0?ex0.prim:"";
      if(s.prio.includes(mus))sets+=1;
      if(s.enfoque==="fuerza"&&sl.main)sets+=1;
      return {...sl,sets:clamp(Math.round(sets),sl.p==="core"?1:2,maxSets+1)};
    });
    list=list.map(sl=>{const id=pickEx(p,sl,used);if(id)used[id]=(used[id]||0)+1;return {...sl,ex:id};}).filter(x=>x.ex);
    pairSupersets(list,s.nivel);
    /* Recortar si no cabe: primero series de aislamientos, luego ejercicios del final */
    let guard=0;
    while(listMinutes(p,list)>budget&&guard++<60){
      const iso=list.slice().reverse().find(x=>!EXM[x.ex].C&&x.sets>2);
      if(iso){iso.sets--;continue;}
      const last=list[list.length-1];
      if(list.length>4&&!EXM[last.ex].C){const rm=list.pop();if(used[rm.ex])used[rm.ex]--;pairSupersets(list,s.nivel);continue;}
      const cmp=list.slice().reverse().find(x=>!x.main&&x.sets>2);
      if(cmp){cmp.sets--;continue;}
      if(list.length>3){const rm=list.pop();if(used[rm.ex])used[rm.ex]--;pairSupersets(list,s.nivel);continue;}
      break;
    }
    return {key:k,name,slots:list};
  });
  g.plan={created:today(),n,sessions};
  /* Rellenar: si sobra tiempo, añadir series a los músculos más lejos de su objetivo semanal */
  const tgt=volTarget(p);
  for(let pass=0;pass<40;pass++){
    const vol=plannedVolume(p);let added=false;
    sessions.forEach(ses=>{
      const cand=ses.slots.filter(sl=>sl.sets<(sl.main||EXM[sl.ex].C?maxSets:maxSets)&&EXM[sl.ex].pat!=="core")
        .map(sl=>{const m=EXM[sl.ex].prim;const t=tgt*(["gemelo","abdomen","trapecio","aductores"].includes(m)?0.6:1);return {sl,r:(vol[m]||0)/t};}).filter(x=>x.r<1.05).sort((a,b)=>a.r-b.r);
      for(const c of cand){
        c.sl.sets++;
        if(listMinutes(p,ses.slots)<=budget){added=true;break;}
        c.sl.sets--;
      }
    });
    if(!added)break;
  }
  if(!g.meso)g.meso={start:weekStart(today())};
  g.next=0;
  return g.plan;
}

/* ---- Mesociclo ---- */
function mesoWeek(p){
  const g=G(p);if(!g.meso)return 0;
  let w=Math.floor(daysBetween(g.meso.start,weekStart(today()))/7);
  while(w>=5){g.meso.start=addDays(g.meso.start,35);w-=5;}
  return Math.max(0,w);
}
function isDeload(p){return mesoWeek(p)===4;}
function rirTarget(p,ex,week){
  const s=G(p).setup;
  const base=(s.nivel==="principiante"?[3,3,2,2,4]:[3,2,2,1,4])[week];
  let r=base;
  if(!ex.C&&week>=2&&week<=3)r=Math.max(0,r-1);
  if(s.enfoque==="salud")r=Math.max(2,r);
  if(edadDe(p)>=60&&ex.C)r=Math.max(2,r);
  return r;
}
function repRange(p,ex,slot){
  const s=G(p).setup;let code=ex.rep;
  if(code==="f"&&(s.nivel==="principiante"||s.enfoque==="salud"))code="h";
  if(s.enfoque==="fuerza"&&slot&&slot.main&&ex.C&&(code==="f"||code==="h"))return [4,6];
  if(code==="f"&&edadDe(p)>=60)code="h";
  return REPS[code];
}
function restFor(p,ex,slot){
  const s=G(p).setup;if(s.enfoque==="fuerza"&&slot&&slot.main&&ex.C)return 180;
  return REST[ex.rep]||90;
}

/* ---- Historial y progresión ---- */
const e1rm=(w,r,rir)=>w>0?w*(1+((r||0)+(rir||0))/30):0;
function exHistory(p,exId){
  return (G(p).log||[]).filter(s=>s.exs.some(e=>e.ex===exId&&e.sets.some(x=>!x.warm&&x.r>0)))
    .map(s=>({date:s.date,sets:s.exs.find(e=>e.ex===exId).sets.filter(x=>!x.warm&&x.r>0)}));
}
function bestE1(sets){return Math.max(0,...sets.map(s=>e1rm(s.w,s.r,s.rir)));}
function incFor(ex){return ex.inc==null?2.5:ex.inc;}
function roundTo(v,st){return st>0?Math.round(v/st)*st:Math.round(v);}
function suggest(p,ex,range,rir){
  const h=exHistory(p,ex.id);const [lo,hi]=range;const inc=incFor(ex);
  if(!h.length){
    if(!inc)return {w:null,txt:`Primera vez. Haz ${lo}-${hi} repeticiones dejando ${rir} en reserva. Si te sobran muchas, la próxima vez añade dificultad.`};
    return {w:null,txt:`Primera vez con este ejercicio. Haz una serie de prueba ligera y busca un peso con el que llegues a ${hi} repeticiones dejando ${rir+1} en reserva. Desde ahí, la app te guía.`};
  }
  const last=h[h.length-1];const top=Math.max(...last.sets.map(s=>s.w||0));
  const at=last.sets.filter(s=>(s.w||0)===top);
  const minR=Math.min(...at.map(s=>s.r)),avgRir=at.reduce((a,s)=>a+(s.rir??2),0)/at.length;
  const fmtW=w=>nf(w,w%1?1:0)+" kg";const lastTxt=`Última vez (${fdate(last.date)}): ${last.sets.map(s=>(s.w?nf(s.w,s.w%1?1:0)+"×":"")+s.r).join(", ")}`;
  if(!inc){
    if(minR>=hi)return {w:0,last:lastTxt,act:"up",txt:`Llegaste a ${hi} repeticiones en todas las series. Toca hacerlo más difícil: más lento, con pausa o con algo de peso.`};
    return {w:0,last:lastTxt,act:"same",txt:`Intenta sumar una repetición por serie respecto a la última vez.`};
  }
  if(minR>=hi&&avgRir>=rir-1){
    const nw=roundTo(top+inc,inc>=2?inc:0.5);
    return {w:nw,last:lastTxt,act:"up",txt:`Hiciste ${hi} o más repeticiones en todas las series con ${fmtW(top)} y con margen. Sube a ${fmtW(nw)} y vuelve a la parte baja del rango (${lo} repeticiones).`};
  }
  if(minR>=hi&&avgRir<rir-1)
    return {w:top,last:lastTxt,act:"same",txt:`Llegaste al tope del rango con ${fmtW(top)}, pero sin margen (RIR ${nf(avgRir,1)}). Repite el mismo peso hasta que te sobren repeticiones.`};
  if(minR<lo&&avgRir<=1){
    const nw=roundTo(top*0.93,inc>=2?inc:0.5);
    return {w:nw,last:lastTxt,act:"down",txt:`Te quedaste por debajo de ${lo} repeticiones yendo casi al fallo. Baja a ${fmtW(nw)} para entrenar en el rango correcto; volverás a subir pronto.`};
  }
  return {w:top,last:lastTxt,act:"same",txt:`Mantén ${fmtW(top)} e intenta sumar una o dos repeticiones por serie. Cuando llegues a ${hi} en todas con margen, subirás peso.`};
}

/* ---- Alternativas ---- */
function alternativesFor(p,exId,reason,joint){
  const ex=EXM[exId];const g=G(p);
  return EX.filter(e=>e.id!==exId&&exAvailable(p,e)&&!(g.noHay||[]).includes(e.id)&&(e.pat===ex.pat||(e.prim===ex.prim&&e.pat!=="core")))
    .map(e=>{
      let sc=0;const why=[];
      if(e.pat===ex.pat)sc+=4;else sc+=1;
      if(e.prim===ex.prim)sc+=2;
      if(e.S&&ex.S){sc+=1;}
      if(e.C===ex.C)sc+=1;
      if(reason==="ocupada"){if(e.req.join()===ex.req.join()){sc-=6;}else why.push("Otro material");}
      if(reason==="nohay"){if(e.req.some(r=>ex.req.includes(r)&&GYM_ITEM[r]&&GYM_ITEM[r].k==="maquina"))sc-=8;}
      if(reason==="dolor"&&joint){
        const a=e.st[joint]||0,b=ex.st[joint]||0;
        if(a>=2)sc-=20;else if(a<b){sc+=3*(b-a);why.push(`Menos carga en ${JOINTS[joint].toLowerCase()}`);}else if(a>=b)sc-=3;
      }
      sc-=exPain(p,e)*2;
      if(e.S)why.push("Trabaja en estiramiento");
      if(e.B)why.push("Estable y fácil de aprender");
      if((g.likes||{})[e.id]===1){sc+=2;why.unshift("Te gusta");}
      if(exHistory(p,e.id).length){sc+=1;why.push("Ya lo has hecho");}
      return {e,sc,why:why.slice(0,2)};
    }).filter(x=>x.sc>-10).sort((a,b)=>b.sc-a.sc).slice(0,6);
}
function painAlert(p){
  const pains=(G(p).pains||[]).filter(x=>daysBetween(x.date,today())<=14);
  const cnt={};pains.forEach(x=>cnt[x.joint]=(cnt[x.joint]||0)+1);
  const j=Object.keys(cnt).find(k=>cnt[k]>=3);
  return j?{joint:j,n:cnt[j]}:null;
}

/* ---- Sesión ---- */
function sessionPreview(p,idx,wellness){
  const g=G(p);const ses=g.plan.sessions[idx];const wk=mesoWeek(p);
  return ses.slots.map((sl,si)=>{
    const ex=EXM[sl.ex];const range=repRange(p,ex,sl);let rir=rirTarget(p,ex,wk);
    let sets=Math.max(1,Math.round(sl.sets*WEEK_SET_MULT[wk]));
    if(wellness==="cansado")rir+=1;
    if(wellness==="muy")(rir+=1,sets=Math.max(1,sets-1));
    return {si,ex:sl.ex,sets,lo:range[0],hi:range[1],rir,rest:restFor(p,ex,sl),main:!!sl.main,ss:sl.ss||""};
  });
}
function sessionMinutes(p,idx){
  const ses=G(p).plan.sessions[idx];
  return Math.round(5+sessionPreview(p,idx).reduce((a,x)=>a+slotMinutes(p,EXM[x.ex],ses.slots[x.si]||{},x.sets,!!x.ss),0));
}
function startSession(p,idx,wellness){
  const g=G(p);
  g.draft={date:today(),sIdx:idx,name:g.plan.sessions[idx].name,wellness,week:mesoWeek(p),cur:0,start:Date.now(),
    exs:sessionPreview(p,idx,wellness).map(x=>({...x,orig:x.ex,sets_:[] ,done:false}))};
  return g.draft;
}
function finishSession(p){
  const g=G(p);const d=g.draft;if(!d)return null;
  const exs=d.exs.map(x=>({ex:x.ex,orig:x.orig,sets:x.sets_.filter(s=>s.r>0)})).filter(x=>x.sets.length);
  const entry={id:uid(),date:d.date,name:d.name,sIdx:d.sIdx,week:d.week,wellness:d.wellness,min:Math.round((Date.now()-d.start)/60000),exs};
  if(exs.length){g.log.push(entry);g.next=(d.sIdx+1)%g.plan.sessions.length;}
  g.draft=null;
  return entry;
}
function sessionStats(p,entry){
  let sets=0,vol=0;const prs=[];
  entry.exs.forEach(x=>{
    const ws=x.sets.filter(s=>!s.warm);sets+=ws.length;vol+=ws.reduce((a,s)=>a+(s.w||0)*s.r,0);
    const prev=(G(p).log||[]).filter(l=>l.id!==entry.id&&l.date<=entry.date).flatMap(l=>l.exs.filter(e=>e.ex===x.ex).flatMap(e=>e.sets.filter(s=>!s.warm)));
    const b=bestE1(ws),pb=bestE1(prev);
    if(prev.length&&b>pb*1.005)prs.push({ex:x.ex,b,pb});
  });
  return {sets,vol:Math.round(vol),prs};
}
function todayGym(p){
  const g=G(p);if(!g.plan)return null;
  const wd=(new Date().getDay()+6)%7;
  const isDay=(p.plan||[])[wd]==="gimnasio";
  const doneToday=g.log.some(l=>l.date===today());
  return {isDay,doneToday,idx:g.next%g.plan.sessions.length,session:g.plan.sessions[g.next%g.plan.sessions.length]};
}

/* ---- Volumen semanal por músculo ---- */
function plannedVolume(p){
  const g=G(p);const vol={};
  (g.plan?g.plan.sessions:[]).forEach(s=>s.slots.forEach(sl=>{
    const ex=EXM[sl.ex];vol[ex.prim]=(vol[ex.prim]||0)+sl.sets;
    ex.sec.forEach(m=>{if(MUSCLES[m])vol[m]=(vol[m]||0)+sl.sets*0.5;});
  }));
  /* sesiones por semana según días elegidos */
  const n=g.plan?g.plan.sessions.length:1,d=(g.setup||{dias:[]}).dias.length||n;
  Object.keys(vol).forEach(k=>vol[k]=Math.round(vol[k]*d/n*2)/2);
  return vol;
}
function doneVolume(p,ws){
  const vol={};(G(p).log||[]).filter(l=>weekStart(l.date)===ws).forEach(l=>l.exs.forEach(x=>{
    const ex=EXM[x.ex];if(!ex)return;const n=x.sets.filter(s=>!s.warm).length;
    vol[ex.prim]=(vol[ex.prim]||0)+n;ex.sec.forEach(m=>{if(MUSCLES[m])vol[m]=(vol[m]||0)+n*0.5;});
  }));
  return vol;
}

/* ---- Rendimiento automático para la dieta ---- */
function autoPerf(p,ws){
  const log=G(p).log||[];if(!log.length)return null;
  const inW=log.filter(l=>weekStart(l.date)===ws);
  const before=log.filter(l=>l.date<ws&&daysBetween(l.date,ws)<=21);
  if(!inW.length||!before.length)return null;
  const ch=[];
  const ids=new Set(inW.flatMap(l=>l.exs.map(e=>e.ex)));
  ids.forEach(id=>{
    const a=bestE1(inW.flatMap(l=>l.exs.filter(e=>e.ex===id).flatMap(e=>e.sets.filter(s=>!s.warm))));
    const b=bestE1(before.flatMap(l=>l.exs.filter(e=>e.ex===id).flatMap(e=>e.sets.filter(s=>!s.warm))));
    if(a>0&&b>0)ch.push((a-b)/b*100);
  });
  if(ch.length<2)return null;
  ch.sort((a,b)=>a-b);const med=ch[Math.floor(ch.length/2)];
  return {v:med<=-3?"BAJA":med>=2?"MEJORA":"ESTABLE",med:r1(med),n:ch.length};
}
function deloadSuggest(p){
  const g=G(p);if(isDeload(p))return null;
  const recent=g.log.filter(l=>daysBetween(l.date,today())<=10);
  const tired=recent.filter(l=>l.wellness==="muy").length;
  if(tired>=2)return "Has marcado «Muy cansado» en dos sesiones recientes.";
  const ap=autoPerf(p,weekStart(today()))||autoPerf(p,addDays(weekStart(today()),-7));
  if(ap&&ap.v==="BAJA")return `Tu rendimiento ha caído un ${nf(Math.abs(ap.med),1)} % en los ejercicios que repites.`;
  return null;
}

/* ---- Explicaciones ---- */
function whyEx(p,ex,slot){
  const w=[];
  if(slot&&slot.main)w.push(`Es el ejercicio principal de la sesión: el que más carga mueves y el que primero haces, cuando estás más fresco.`);
  else if(ex.C)w.push(`Ejercicio compuesto: mueve varias articulaciones y trabaja ${MUSCLES[ex.prim].toLowerCase()} junto a ${ex.sec.map(m=>MUSCLES[m]?MUSCLES[m].toLowerCase():"").filter(Boolean).slice(0,2).join(" y ")||"otros músculos"}.`);
  else w.push(`Ejercicio de aislamiento para ${MUSCLES[ex.prim].toLowerCase()}: completa el volumen sin añadir mucha fatiga general.`);
  if(ex.S)w.push("Carga el músculo en su posición más estirada, que es donde los estudios recientes ven más crecimiento.");
  if(ex.req.some(r=>GYM_ITEM[r]&&GYM_ITEM[r].k==="maquina")||ex.req.includes("poleas"))w.push("La máquina o la polea dan estabilidad, así que puedes acercarte al fallo con seguridad.");
  if(ex.B&&G(p).setup.nivel==="principiante")w.push("Es fácil de aprender, ideal mientras dominas la técnica.");
  const pn=exPain(p,ex);if(pn===0&&Object.values(G(p).setup.dolor||{}).some(Boolean))w.push("Elegido porque no carga las zonas donde marcaste molestias.");
  return w;
}
