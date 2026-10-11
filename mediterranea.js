/* ===== Calidad mediterránea: común a los cuatro estilos de dieta =====
   No cambia calorías ni macros: decide QUÉ alimentos se eligen dentro de los que el usuario permite.
   Los gustos mandan: lo que marcas "No" nunca sale y lo que marcas "Me gusta" sale más.
   Estas reglas solo inclinan la elección entre lo permitido. */
const MED_PROCESADO=new Set(["cerdo_bacon","cerdo_panceta","cerdo_salchichas","burger_vacuno","burger_pollo","picada_mixta"]);
const MED_INTEGRAL=new Set(["arroz_integral","pasta_integral","pan_integral","pan_centeno","pan_molde","quinoa","pasta_legumbre","avena","copos_avena"]);
const MED_REFINADO=new Set(["arroz_blanco","pasta","cuscus","noquis","tortilla_trigo","biscotes","pan_barra"]);
const MED_SOFRITO=new Set(["tomate","cebolla","pimiento_rojo","pimiento_verde","pimiento","ajo","puerro"]);
function medGroup(f){
  if(!f)return "";
  if(f.cat==="pescado"||f.cat==="marisco")return "pescado";
  if(f.cat==="legumbres"&&f.r==="C"||f.id==="pasta_legumbre")return "legumbre";
  if(f.cat==="fiambres"||MED_PROCESADO.has(f.id))return "procesado";
  if(f.cat==="vacuno"||f.cat==="cerdo"||f.cat==="otras")return "roja";
  if(f.cat==="aves")return "blanca";
  if(f.cat==="huevos")return "huevo";
  if(f.cat==="vegprot")return "vegetal";
  if(f.cat==="secos")return "secos";
  return "";
}
function fishOK(p){return FOODS.some(f=>medGroup(f)==="pescado"&&f.r==="P"&&allowed(p,f));}
function medCounts(use){const c={};for(const id in use){const g=medGroup(FOOD[id]);if(g)c[g]=(c[g]||0)+use[id];}return c;}
/* Peso extra de cada alimento en la elección. Multiplica al peso de gustos y variedad. */
function medWeight(p,f,ctx,slot){
  const est=p.dietaEstilo||"equilibrada";const keto=est==="keto";
  const c=ctx&&ctx.use?medCounts(ctx.use):{};const g=medGroup(f);const n=c[g]||0;
  const noFish=ctx&&ctx.noFish;
  if(f.r==="P"){
    if(g==="pescado")return n<3?3:0.8;
    if(g==="legumbre")return 1;
    if(g==="procesado")return slot==="p"?(n<1?0.35:0.04):(n<3?0.5:0.06);
    if(g==="roja")return n<2?0.9:0.1;
    if(g==="blanca")return noFish?1.6:1.3;
    if(g==="huevo")return n<4?1.3:0.6;
    return 1;
  }
  if(f.r==="C"){
    if(g==="legumbre")return keto?0.15:(n<4?3.5:0.7);
    if(MED_INTEGRAL.has(f.id))return 1.6;
    if(MED_REFINADO.has(f.id))return 0.7;
    return 1;
  }
  if(f.r==="B"){if(MED_INTEGRAL.has(f.id))return 1.6;if(MED_REFINADO.has(f.id))return 0.6;return 1;}
  if(f.r==="G"){if(f.id==="aove")return slot==="p"?3:2;if(f.id==="mantequilla")return 0.15;return 1;}
  if(f.r==="N"){
    if(f.cat==="dulce")return 0.5;
    if(f.id==="nueces")return noFish?4:2;
    if(f.id==="lino"||f.id==="chia")return noFish?2.5:1;
    return 1;
  }
  return 1;
}
/* Mínimos diarios: fruta según el estilo y un puñado de frutos secos. */
function medFruitMin(p){return {equilibrada:3,altahc:3,bajahc:1,keto:0}[p.dietaEstilo||"equilibrada"];}
function medDaily(p,day,ctx){
  const meals=day.meals.filter(m=>!m.fuera);if(!meals.length)return;
  const count=r=>meals.reduce((a,m)=>a+m.items.filter(it=>FOOD[it.id].r===r).length,0);
  const add=(m,f,q)=>{if(!f)return;m.items.push({id:f.id,q});ctx.use[f.id]=(ctx.use[f.id]||0)+1;};
  /* Frutos secos: uno al día si están permitidos */
  if(!meals.some(m=>m.items.some(it=>FOOD[it.id].cat==="secos"))){
    const N=FOODS.filter(f=>f.cat==="secos"&&allowed(p,f));
    if(N.length){const tgt=meals.find(m=>m.type==="s")||meals.find(m=>m.type==="d")||meals[meals.length-1];
      add(tgt,pick(p,N,ctx),20);}
  }
  /* Fruta: postre de comida y cena, o en desayuno y merienda */
  let need=medFruitMin(p)-count("F");
  if(need>0){
    const F=FOODS.filter(f=>f.r==="F"&&allowed(p,f));
    if(F.length){
      const order=[...meals.filter(m=>m.type!=="p"),...meals.filter(m=>m.type==="p")];
      for(const m of order){if(need<=0)break;if(m.items.some(it=>FOOD[it.id].r==="F"))continue;
        const f=pick(p,F,ctx,m.items.map(i=>i.id));add(m,f,fixedQ(f));need--;}
    }
  }
}
/* Puntuación semanal: cuestionario MEDAS del estudio PREDIMED adaptado a un menú planificado. */
const MEDAS_INFO="El cuestionario MEDAS son 14 preguntas que se usaron en el estudio PREDIMED para medir lo mediterránea que es una dieta. Cuanto más alta la nota, menos riesgo cardiovascular se observó.\n\nAfina lo aplica a tu menú de la semana con dos cambios honestos. El vino no se puntúa, porque hoy no se recomienda beber alcohol por salud. Y el aceite de oliva se exige a partir de 2 cucharadas al día (20 g), no de 4, porque en una dieta con calorías medidas 4 cucharadas se comerían buena parte del día.\n\nSi no comes pescado, esa pregunta no cuenta y la app compensa el omega 3 con nueces y semillas de lino o chía. Si no comes carne, tampoco cuenta la de carne blanca frente a roja.\n\nUna nota de 9 o más se considera buena adherencia. No es para obsesionarse: es una brújula para comer mejor sin contar nada más.";
function medas(p,menu){
  const days=menu.days;const all=days.flatMap(d=>d.meals.filter(m=>!m.fuera).flatMap(m=>m.items.map(it=>({f:FOOD[it.id],q:it.q,m}))));
  const nd=days.length||7;
  const gW=id=>all.filter(x=>x.f.id===id).reduce((a,x)=>a+grams(x.f,x.q),0);
  const cnt=pred=>all.filter(x=>pred(x.f)).length;
  const meatOK=FOODS.some(f=>(medGroup(f)==="roja"||medGroup(f)==="blanca")&&allowed(p,f));
  const rojas=cnt(f=>medGroup(f)==="roja"||medGroup(f)==="procesado"&&f.r==="P");
  const blancas=cnt(f=>medGroup(f)==="blanca");
  const vegDays=days.filter(d=>d.meals.filter(m=>!m.fuera).reduce((a,m)=>a+m.items.filter(it=>FOOD[it.id].r==="V").length,0)>=2).length;
  const fruitAvg=cnt(f=>f.r==="F")/nd;
  const aoveDays=days.filter(d=>d.meals.some(m=>!m.fuera&&m.items.some(it=>it.id==="aove"&&it.q>0))).length;
  const sofr=days.reduce((a,d)=>a+d.meals.filter(m=>!m.fuera&&m.items.some(it=>MED_SOFRITO.has(it.id))&&m.items.some(it=>it.id==="aove"&&it.q>0)).length,0);
  const Q=[
    ["Aceite de oliva como grasa principal",aoveDays>=5&&gW("aove")>gW("mantequilla"),"Usa aceite de oliva virgen extra para cocinar y aliñar."],
    ["Al menos 2 cucharadas de aceite de oliva al día",gW("aove")/nd>=20,"Sube el aceite a 20 g al día: aliña la verdura y el pan del desayuno."],
    ["Verdura dos veces al día",vegDays>=6,"Pon verdura en la comida y en la cena."],
    ["Tres piezas de fruta al día",fruitAvg>=3,p.dietaEstilo==="keto"?"En cetogénica no cabe tanta fruta: es el precio del estilo.":p.dietaEstilo==="bajahc"?"En baja en hidratos se limita la fruta: prioriza frutos rojos y cítricos.":"Añade fruta de postre o en la merienda."],
    ["Carne roja o procesada menos de una vez al día",rojas<nd,"Cambia alguna carne roja por pollo, pavo, huevo o legumbre."],
    ["Mantequilla o nata menos de una vez al día",cnt(f=>f.id==="mantequilla")<nd,"Usa aceite de oliva en lugar de mantequilla."],
    ["Sin bebidas azucaradas",true,""],
    ["Legumbres tres veces por semana",cnt(f=>medGroup(f)==="legumbre")>=3,p.dietaEstilo==="keto"?"En cetogénica casi no caben legumbres.":"Marca como «Me gusta» garbanzos, lentejas o alubias."],
    fishOK(p)?["Pescado o marisco tres veces por semana",cnt(f=>medGroup(f)==="pescado")>=3,"Marca algún pescado como «Me gusta»: el azul aporta omega 3."]:null,
    ["Bollería y dulces menos de tres veces por semana",cnt(f=>f.cat==="dulce")<3,"Deja el chocolate para dos o tres días."],
    ["Frutos secos tres veces por semana",cnt(f=>f.cat==="secos")>=3,"Un puñado de 20-30 g de nueces o almendras."],
    meatOK?["Más carne blanca que roja",blancas>rojas,"Elige pollo o pavo más a menudo que ternera o cerdo."]:null,
    ["Sofrito o verdura con aceite dos veces por semana",sofr>=2,"Haz un sofrito de tomate, cebolla y ajo con aceite de oliva."]
  ].filter(Boolean);
  const ok=Q.filter(q=>q[1]).length;
  return {ok,n:Q.length,q:Q,nivel:ok>=Q.length-3?"Muy mediterránea":ok>=Q.length-6?"Bastante mediterránea":"Poco mediterránea"};
}
/* Estilo recomendado según objetivo y deporte (solo recomendación: decide el usuario) */
function recStyle(meta,deporte){
  const t=(SPORT[deporte]||{}).tipo;
  if(t==="resistencia"||t==="hibrido")return "altahc";
  return {recomp:"equilibrada",estetica:"equilibrada",definicion:"bajahc",volumen:"altahc",fuerza:"altahc",longevidad:"equilibrada"}[meta]||"equilibrada";
}
function medCard(p,menu){
  const r=medas(p,menu);const open=UI.medOpen;
  const pct=r.ok/r.n;const cls=pct>=0.75?"good":pct>=0.5?"":"warnc";
  return `<div class="card stack"><div class="row between"><div><span class="lbl">Calidad mediterránea ${infoBtn("medas","puntuación mediterránea")}</span><h2 class="num ${cls}" style="margin:2px 0 0">${r.ok} de ${r.n}</h2><span class="small muted">${r.nivel} · menú de esta semana</span></div><button class="btn sm ghost" data-a="medToggle">${open?"Ocultar":"Ver detalle"}</button></div>
  ${open?`<div class="medq">${r.q.map(([t,ok,tip])=>`<div class="mq ${ok?"ok":"no"}"><span class="mk">${ok?"✓":"·"}</span><div><span>${esc(t)}</span>${!ok&&tip?`<span class="small muted">${esc(tip)}</span>`:""}</div></div>`).join("")}</div>
  ${!fishOK(p)?`<p class="small muted">Sin pescado en tu lista: la app mete nueces y semillas a menudo para el omega 3. Si quieres valorar un suplemento de omega 3 de algas, coméntalo con tu médico.</p>`:""}`:""}</div>`;
}
