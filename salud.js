/* ===== Movilidad y equilibrio · Ciclo menstrual ===== */

/* ---- Movilidad y equilibrio: 5 minutos, 2-3 veces por semana ----
   Por defecto activo a partir de 50 años o con el objetivo Longevidad. */
const MOB=[
  ["Equilibrio a una pierna",["30 s por pierna, con una mano cerca de la pared","30 s por pierna sin apoyo, mirando a un punto fijo","30 s por pierna con los ojos cerrados, junto a la pared"],"Es lo que más reduce las caídas con la edad."],
  ["Caminar punta-talón",["2 × 10 pasos en línea recta, junto a una pared","2 × 10 pasos sin apoyo","2 × 10 pasos girando la cabeza a los lados"],"Coordinación y estabilidad al andar."],
  ["Tobillo a la pared",["10 por pierna: rodilla hacia la pared sin levantar el talón","12 por pierna, alejando un poco el pie","15 por pierna con pausa de 2 s delante"],"Un tobillo que se dobla bien protege rodillas y mejora la sentadilla."],
  ["Cadera 90/90",["30 s por lado sentado en el suelo, con apoyo de manos","45 s por lado, espalda recta","45 s por lado y 5 cambios de lado sin manos"],"Cadera móvil: menos carga en la zona lumbar."],
  ["Libro abierto (columna)",["8 por lado tumbado de lado","10 por lado con pausa al abrir","10 por lado en cuadrupedia"],"Rotación de la parte alta de la espalda: hombros y cuello lo agradecen."],
  ["Sentarse y levantarse del suelo",["3 veces, con las manos que necesites","3 veces apoyando una sola mano","3 veces sin manos si puedes"],"Poder hacerlo sin ayuda se asocia a vivir más años."]
];
function mobOn(p){const g=G(p);if(g.mobOn!=null)return g.mobOn;return edadDe(p)>=50||p.meta==="longevidad";}
function mobLevel(p){const n=(G(p).mobLog||[]).length;return n>=25?2:n>=10?1:0;}
function mobWeek(p){const ws=weekStart(today());return (G(p).mobLog||[]).filter(d=>d>=ws).length;}
function mobCard(p){
  if(!mobOn(p))return `<div class="card row between"><div><span class="lbl">Movilidad y equilibrio</span><p class="small muted">5 minutos que previenen caídas y rigidez. Opcional.</p></div><button class="btn sm" data-a="mobSet" data-v="1">Activar</button></div>`;
  const n=mobWeek(p);const done=(G(p).mobLog||[]).includes(today());
  return `<div class="card stack"><div class="row between"><span class="lbl">Movilidad y equilibrio ${infoBtn("movilidad","movilidad y equilibrio")}</span><span class="num small ${n>=2?"good":"muted"}">${Math.min(n,3)} de 2-3 esta semana</span></div>
  <p class="small">${done?"Hecha hoy.":"Cinco minutos, mejor al terminar las pesas o cualquier día."} Nivel ${mobLevel(p)+1} de 3.</p>
  <div class="row"><button class="btn sm pri" data-a="mobOpen">Ver rutina</button><button class="btn ghost sm" data-a="mobSet" data-v="0">Quitar</button></div></div>`;
}
function sheetMob(){
  const p=P();const lv=mobLevel(p);const done=(G(p).mobLog||[]).includes(today());
  return `<div class="sheet-h"><div><span class="lbl">5 minutos · nivel ${lv+1} de 3</span><h2>Movilidad y equilibrio</h2></div><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <div class="stack"><ol class="mob">${MOB.map(([t,lvls,why])=>`<li><b>${t}</b><span>${lvls[lv]}</span><span class="small muted">${why}</span></li>`).join("")}</ol>
  <p class="small muted">Sin dolor: si algo molesta, haz menos recorrido. El nivel sube solo cuando acumulas sesiones.</p>
  <button class="btn pri wide" data-a="mobDone" ${done?"disabled":""}>${done?"Hecha hoy":"Hecha"}</button></div>`;
}

/* ---- Ciclo menstrual (opcional, solo para registrar) ----
   No cambia el entreno: la ciencia actual no ve beneficio en ajustarlo por fases.
   Sirve para que la retención de líquidos de antes y durante la regla no se lea como estancamiento. */
function cicloOn(p){return p.sexo==="M"&&!p.embarazo&&p.ciclo&&p.ciclo.on;}
function cicloLen(p){const s=((p.ciclo||{}).starts||[]).slice().sort();if(s.length<2)return 28;const d=[];for(let i=1;i<s.length;i++){const x=daysBetween(s[i-1],s[i]);if(x>=20&&x<=45)d.push(x);}return d.length?Math.round(d.reduce((a,b)=>a+b,0)/d.length):28;}
function cicloNext(p){const s=((p.ciclo||{}).starts||[]).slice().sort();if(!s.length)return null;let n=addDays(s[s.length-1],cicloLen(p));while(n<addDays(today(),-3))n=addDays(n,cicloLen(p));return n;}
function cicloStarts(p){const s=((p.ciclo||{}).starts||[]).slice();const n=cicloNext(p);if(n)s.push(n);return s;}
/* Ventana de retención: 5 días antes hasta 3 días después del inicio de la regla */
function cicloWindowOverlaps(p,ws){if(!cicloOn(p))return false;const end=addDays(ws,6);return cicloStarts(p).some(st=>addDays(st,-5)<=end&&addDays(st,3)>=ws);}
function cicloHoy(p){if(!cicloOn(p))return null;const t=today();const st=cicloStarts(p).find(s=>addDays(s,-5)<=t&&addDays(s,3)>=t);return st?(t<st?"pre":"regla"):null;}
function cicloCard(p){
  if(p.sexo!=="M"||p.embarazo)return "";
  if(!cicloOn(p))return `<div class="card row between"><div><span class="lbl">Ciclo menstrual</span><p class="small muted">Opcional. Ayuda a no confundir la retención de líquidos con un estancamiento.</p></div><button class="btn sm" data-a="cicloSet" data-v="1">Anotar mi ciclo</button></div>`;
  const s=(p.ciclo.starts||[]).slice().sort();const n=cicloNext(p);const h=cicloHoy(p);
  return `<div class="card stack"><div class="row between"><span class="lbl">Ciclo menstrual ${infoBtn("ciclo","ciclo menstrual")}</span><button class="btn sm pri" data-a="cicloHoy">Me ha venido hoy</button></div>
  ${h?`<p class="small acc-t">${h==="pre"?"Días previos a la regla":"Días de regla"}: es normal ver entre 0,5 y 2 kg más de agua. La app no recorta tu dieta por esto.</p>`:""}
  <p class="small muted">${s.length?`Último inicio: ${fdate(s[s.length-1])}${n?` · próximo estimado: ${fdate(n)}`:""} · ciclo de ${cicloLen(p)} días`:"Pulsa el botón el primer día de tu próxima regla."}</p>
  <div class="row"><button class="btn ghost sm" data-a="cicloSet" data-v="0">Dejar de anotar</button>${s.length?`<button class="btn ghost sm" data-a="cicloUndo">Borrar el último</button>`:""}</div></div>`;
}
/* La revisión semanal no recorta (ni frena el volumen) por una subida que puede ser agua del ciclo */
const _evaluateBase=evaluate;
evaluate=function(p,weekKey){
  const r=_evaluateBase(p,weekKey);
  if(r&&cicloWindowOverlaps(p,weekKey)){
    const masks=(p.objetivo==="perder"&&r.d==="BAJAR")||(p.objetivo!=="perder"&&r.d==="BAJAR");
    if(masks)return {...r,d:"MANTENER",why:"Semana con retención de líquidos por el ciclo: el peso no refleja la grasa. Se mantiene y se revisa la semana que viene."};
  }
  return r;
};

Object.assign(A,{
  mobSet:el=>{G(P()).mobOn=el.dataset.v==="1";commit();},
  mobOpen:()=>{UI.sheet=sheetMob;render();},
  mobDone:()=>{const g=G(P());g.mobLog=g.mobLog||[];if(!g.mobLog.includes(today()))g.mobLog.push(today());UI.sheet=null;commit();toast("Movilidad hecha.");},
  cicloSet:el=>{const p=P();p.ciclo=p.ciclo||{starts:[]};p.ciclo.on=el.dataset.v==="1";commit();},
  cicloHoy:()=>{const p=P();const s=p.ciclo.starts;if(!s.includes(today()))s.push(today());s.sort();commit();toast("Anotado.");},
  cicloUndo:()=>{const p=P();p.ciclo.starts.sort().pop();commit();}
});
