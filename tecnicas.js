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
/* aviso en la serie justa */
function techNow(p,it,nWork){
  const t=it.tech;const left=it.sets-nWork;if(left<=0)return "";
  const w=+UI.rnW||0;const ex=EXM[it.ex];const inc=incFor(ex);
  if(t==="cluster"){const b=clusterBlock(it);
    return {h:`Serie ${nWork+1}: en bloques de ${b}`,t:`Haz ${b} repeticiones, pausa de 20 s y otras ${b}, hasta completar ${it.lo}-${it.hi}. Guarda la serie con el total.`,btn:["Pausa 20 s",20,"Pausa del cluster"]};}
  if(t==="topset"){
    if(nWork===0)return {h:"Ahora: serie top",t:"Esta es la pesada. El peso más alto que puedas con 1 repetición en reserva."};
    const top=it.sets_.filter(s=>!s.warm)[0];const bw=top&&top.w?roundTo(top.w*0.9,inc):0;
    return {h:"Series de bajada",t:bw?`Baja a ${nf(bw,1)} kg (un 10 % menos que la serie top).`:"Baja el peso un 10 % respecto a la serie top."};}
  if(left!==1)return "";
  if(t==="restpause")return {h:"Última serie: rest-pause",t:"Al llegar a tu límite, pulsa la pausa y saca 2 o 3 repeticiones más. Repite una vez.",btn:["Pausa 15 s",15,"Rest-pause"]};
  if(t==="descendente")return {h:"Última serie: descendente",t:w?`Al terminar, baja a ${nf(roundTo(w*0.75,inc),1)} kg y sigue sin descanso hasta quedarte a una del fallo.`:"Al terminar, baja el peso un 25 % y sigue sin descanso hasta quedarte a una del fallo."};
  if(t==="parciales")return {h:"Última serie: parciales",t:"Al terminar, haz 4 a 6 repeticiones de medio recorrido en la parte estirada."};
  return "";
}
function techBox(p,it,nWork){
  const t=it.tech;if(!t||!TECH_INFO[t])return "";const g=G(p);const inf=TECH_INFO[t];
  const first=!(g.techSeen||{})[t];
  if(first)return `<div class="tband first"><div class="row between"><span class="ttag big">Nueva técnica</span></div>
    <h3>${esc(TECHS[t][0])}</h3><p><b>Por qué:</b> ${esc(inf.why)}</p><p><b>Cómo:</b> ${esc(inf.how)}</p>
    <div class="row" style="gap:8px;margin-top:6px"><button class="btn sm pri" data-a="techSeen" data-k="${t}">Entendido</button><a class="btn sm" href="https://www.youtube.com/results?search_query=${encodeURIComponent(TECHS[t][0]+" "+EXM[it.ex].name)}" target="_blank" rel="noopener">Ver vídeo</a></div></div>`;
  const now=techNow(p,it,nWork);
  return `<div class="tband"><span class="ttag">${inf.c}</span><span class="small">${esc(TECHS[t][1])}</span> ${infoBtn("tecnicas","técnicas")}</div>
  ${now?`<div class="tnow"><b>${esc(now.h)}</b><span>${esc(now.t)}</span>${now.btn?`<button class="btn pri wide" data-a="techPause" data-s="${now.btn[1]}" data-l="${esc(now.btn[2])}">${now.btn[0]}</button>`:""}</div>`:""}`;
}
A.techSeen=el=>{const g=G(P());g.techSeen=g.techSeen||{};g.techSeen[el.dataset.k]=1;commit();};
A.techPause=el=>{const s=+el.dataset.s;UI.rest={until:Date.now()+s*1000,total:s,label:el.dataset.l};try{audioUnlock();}catch(e){}render();window.scrollTo(0,0);};
