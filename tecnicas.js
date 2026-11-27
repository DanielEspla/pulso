/* Técnicas especiales: cluster, y avisos visibles (lista del día, franja en el ejercicio, aviso en la serie justa, explicación la primera vez) */
TECHS.cluster=["Series cluster","Cada serie se parte en bloques cortos con 20 s de pausa. Mismo peso de siempre, todas las repeticiones limpias."];
const TECH_INFO={
  cluster:{c:"Cluster",why:"Con las pausas cortas cada repetición sale casi tan rápida y limpia como la primera. Acumulas trabajo de calidad sin que la técnica se caiga por el cansancio, y la espalda sufre menos.",
    how:"Haz un bloque, pulsa «Pausa 20 s», respira sin soltar la postura y haz el siguiente. Cuando completes las repeticiones de la serie, guárdala con el total, como siempre. El peso es el mismo que usarías normalmente."},
  topset:{c:"Serie top",why:"Una serie pesada te dice cómo estás hoy y estimula la fuerza; las siguientes, algo más ligeras, suman volumen sin machacarte.",
    how:"La primera serie de trabajo, con el peso más alto que puedas mover dejando 1 repetición en reserva. En las demás, baja un 10 %. La app te dice el peso."},
  restpause:{c:"Rest-pause",why:"Sacas varias repeticiones extra cerca del fallo sin añadir series ni tiempo.",
    how:"En la última serie, al llegar a tu límite, pulsa «Pausa 15 s» y saca 2 o 3 repeticiones más. Repite una vez. Apunta el total de repeticiones."},
  descendente:{c:"Descendente",why:"Alargas la última serie con menos peso para agotar el músculo de forma segura.",
    how:"Al terminar la última serie, baja el peso un 25 % y sigue sin descanso hasta quedarte a una repetición del fallo. Apunta las repeticiones con el primer peso."},
  parciales:{c:"Parciales",why:"El trabajo en la parte estirada del recorrido es de los que más hace crecer el músculo, y ahí aún te quedan fuerzas cuando ya no completas repeticiones.",
    how:"Al terminar la última serie, haz 4 a 6 repeticiones de medio recorrido en la parte donde el músculo está más estirado."}
};
const _techForBase=techFor;
techFor=function(p,ex,sl,wk){
  const s=G(p).setup;
  if(s&&s.tecnicas&&wk!==4&&s.nivel!=="principiante"&&sl&&sl.main&&ex.C){
    const bar=ex.req.includes("barra")||ex.req.includes("smith")||["dominadas","fondos"].includes(ex.id);
    if(s.nivel==="avanzado"&&ex.req.some(r=>["barra","smith","prensa","hack","pendulo"].includes(r)))return bar&&wk%2===0?"cluster":"topset";
    if(bar)return "cluster";
  }
  return _techForBase(p,ex,sl,wk);
};
function clusterBlock(it){return it.hi<=6?2:3;}
function techTag(t){return t&&TECH_INFO[t]?`<span class="ttag">${TECH_INFO[t].c}</span>`:"";}
function techCount(list){const n=list.filter(x=>x.tech).length;
  return n?`<div class="tnote"><span class="ttag">Especial</span><span>Hoy hay ${n===1?"un ejercicio":n+" ejercicios"} con serie especial. Te avisaré en el momento.</span></div>`:"";}
/* Guía paso a paso dentro del ejercicio, con cronómetro en la propia tarjeta */
function clusterPlan(it){const b=clusterBlock(it);const n=Math.max(2,Math.round(((it.lo+it.hi)/2)/b));return {b,n,tot:b*n};}
function techSteps(p,it,nWork){
  const t=it.tech;const left=it.sets-nWork;if(left<=0)return null;
  if(t==="cluster"){const c=clusterPlan(it);const st=[];
    for(let k=0;k<c.n;k++){st.push({do:`Bloque ${k+1} de ${c.n}: haz ${c.b} repeticiones`,btn:k<c.n-1?"Hecho, descanso 20 s":"Hecho, serie terminada"});if(k<c.n-1)st.push({rest:20,lab:"Descanso corto entre bloques",next:`Prepárate para el bloque ${k+2}`});}
    return {title:`Serie ${nWork+1} de ${it.sets} en cluster`,intro:`${c.n} bloques de ${c.b} repeticiones (${c.tot} en total). Entre bloque y bloque, 20 segundos de descanso sin soltar la barra o dejándola en el soporte.`,steps:st,end:`Serie completa: ${c.tot} repeticiones. Revisa el peso y pulsa Guardar serie.`,reps:c.tot};}
  if(t==="restpause"){
    if(left!==1)return {title:"Esta serie, normal",intro:`Las primeras series, normales. En la última (la ${it.sets}.ª) te guío paso a paso con cronómetro.`,steps:[]};
    return {title:`Última serie: rest-pause`,intro:"Son tres tandas seguidas con 15 segundos de descanso entre ellas. Al final apuntas todas las repeticiones sumadas.",
      steps:[{do:"Tanda 1: repeticiones hasta quedarte a 1 del fallo",btn:"Hecho, descanso 15 s"},{rest:15,lab:"Descanso corto",next:"Prepárate para la tanda 2"},
        {do:"Tanda 2: saca 2 o 3 repeticiones más",btn:"Hecho, descanso 15 s"},{rest:15,lab:"Descanso corto",next:"Prepárate para la tanda 3"},
        {do:"Tanda 3: saca 2 o 3 repeticiones más",btn:"Hecho"}],end:"Suma las repeticiones de las tres tandas, escríbelas abajo y pulsa Guardar serie."};}
  const w=+UI.rnW||0;const ex=EXM[it.ex];const inc=incFor(ex);
  if(t==="topset"){
    if(nWork===0)return {title:"Ahora: serie top",intro:"Esta primera serie es la pesada: el peso más alto que puedas con 1 repetición en reserva. Descanso normal después.",steps:[]};
    const top=it.sets_.filter(s=>!s.warm)[0];const bw=top&&top.w?roundTo(top.w*0.9,inc):0;
    return {title:"Series de bajada",intro:bw?`Pon ${nf(bw,1)} kg (un 10 % menos que la serie top) y haz la serie normal.`:"Baja el peso un 10 % respecto a la serie top y haz la serie normal.",steps:[]};}
  if(left!==1)return {title:"Esta serie, normal",intro:`Las primeras series, normales. En la última te digo qué hacer.`,steps:[]};
  if(t==="descendente")return {title:"Última serie: descendente",intro:`1. Haz la serie normal. 2. Sin descansar, baja ${w?"a "+nf(roundTo(w*0.75,inc),1)+" kg":"el peso un 25 %"}. 3. Sigue hasta quedarte a 1 del fallo. Apunta solo la primera parte.`,steps:[]};
  if(t==="parciales")return {title:"Última serie: parciales",intro:"1. Haz la serie normal. 2. Sin soltar, añade 4 a 6 repeticiones de medio recorrido en la parte estirada. Apunta solo las completas.",steps:[]};
  return null;
}
let _tgTimer=null;
function tgKey(d,it,nWork){return d.cur+":"+it.ex+":"+nWork;}
function tgTick(){
  const s=UI.tg;if(!s||!s.until)return;const left=Math.max(0,Math.ceil((s.until-Date.now())/1000));
  const n=document.getElementById("tg_n"),i=document.getElementById("tg_i");
  if(n)n.textContent="0:"+pad(left);if(i)i.style.width=(100*left/s.total)+"%";
  if(left<=0){s.until=0;s.step++;try{beep();navigator.vibrate&&navigator.vibrate([200,80,200]);}catch(e){}render();}
}
setInterval(tgTick,250);
function techBox(p,it,nWork){
  const t=it.tech;if(!t||!TECH_INFO[t]||UI.rnWarm)return "";const g=G(p);const d=g.draft;const inf=TECH_INFO[t];
  if(!(g.techSeen||{})[t])return `<div class="tband first"><span class="ttag big">Nueva técnica</span>
    <h3>${esc(TECHS[t][0])}</h3><p><b>Por qué:</b> ${esc(inf.why)}</p><p><b>Cómo:</b> ${esc(inf.how)}</p>
    <div class="row" style="gap:8px;margin-top:6px"><button class="btn sm pri" data-a="techSeen" data-k="${t}">Entendido</button><a class="btn sm" href="https://www.youtube.com/results?search_query=${encodeURIComponent(TECHS[t][0]+" "+EXM[it.ex].name)}" target="_blank" rel="noopener">Ver vídeo</a></div></div>`;
  const G_=techSteps(p,it,nWork);if(!G_)return "";
  const key=tgKey(d,it,nWork);if(!UI.tg||UI.tg.key!==key)UI.tg={key,step:0,until:0,total:0};
  const s=UI.tg;const st=G_.steps;
  let body="";
  if(st.length){
    const list=st.filter(x=>!x.rest);const doneDo=st.slice(0,s.step).filter(x=>!x.rest).length;
    const dots=`<div class="tgdots">${list.map((x,k)=>`<i class="${k<doneDo?"ok":k===doneDo&&s.step<st.length?"cur":""}"></i>`).join("")}</div>`;
    if(s.step>=st.length)body=`${dots}<div class="tgend">${esc(G_.end)}</div><button class="btn sm ghost" data-a="tgReset">Volver a empezar la guía</button>`;
    else{const cur=st[s.step];
      if(cur.rest){if(!s.until){s.until=Date.now()+cur.rest*1000;s.total=cur.rest;}const left=Math.max(0,Math.ceil((s.until-Date.now())/1000));
        body=`${dots}<div class="tgrest"><span class="lbl">${esc(cur.lab)}</span><b class="num" id="tg_n">0:${pad(left)}</b><div class="bar"><i id="tg_i" style="width:${100*left/s.total}%"></i></div><span class="small">${esc(cur.next)}</span></div><button class="btn sm" data-a="tgSkip">Saltar descanso</button>`;}
      else body=`${dots}<div class="tgdo">${esc(cur.do)}</div><button class="btn pri wide big-btn" data-a="tgNext">${esc(cur.btn)}</button>`;}
  }
  return `<div class="tnow"><div class="row" style="gap:8px;align-items:center"><span class="ttag">${inf.c}</span><b>${esc(G_.title)}</b></div><span>${esc(G_.intro)}</span>${body}</div>`;
}
A.techSeen=el=>{const g=G(P());g.techSeen=g.techSeen||{};g.techSeen[el.dataset.k]=1;commit();};
A.tgNext=()=>{const p=P();const d=G(p).draft;const it=d.exs[d.cur];const s=UI.tg;if(!s)return;try{audioUnlock();}catch(e){}
  s.step++;s.until=0;const nWork=it.sets_.filter(x=>!x.warm).length;const gd=techSteps(p,it,nWork);
  if(gd&&s.step>=gd.steps.length&&gd.reps)UI.rnR=gd.reps;render();};
A.tgSkip=()=>{const s=UI.tg;if(!s)return;s.until=0;s.step++;render();};
A.tgReset=()=>{if(UI.tg){UI.tg.step=0;UI.tg.until=0;}render();};
