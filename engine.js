/* ===== Utilidades ===== */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const r1=n=>Math.round(n*10)/10;
const r5=n=>Math.round(n/5)*5;
const r25=n=>Math.round(n/25)*25;
const log10=Math.log10;
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parseD=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
const today=()=>iso(new Date());
const addDays=(s,n)=>{const d=parseD(s);d.setDate(d.getDate()+n);return iso(d);};
const weekStart=s=>{const d=parseD(s);const w=(d.getDay()+6)%7;d.setDate(d.getDate()-w);return iso(d);};
const daysBetween=(a,b)=>Math.round((parseD(b)-parseD(a))/864e5);
const uid=()=>Math.random().toString(36).slice(2,10);
const DIAS=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

/* ===== Composición corporal y gasto ===== */
/* Edad calculada cada día a partir de la fecha de nacimiento */
function ageFrom(nac,ref){if(!nac)return null;const b=parseD(nac),r=parseD(ref||today());let a=r.getFullYear()-b.getFullYear();if(r.getMonth()<b.getMonth()||(r.getMonth()===b.getMonth()&&r.getDate()<b.getDate()))a--;return a;}
function edadDe(p){return p.nac?ageFrom(p.nac):(p.edad||40);}
function bmr(p,peso){return 10*peso+6.25*p.altura-5*edadDe(p)+(p.sexo==="H"?5:-161);}
/* Tipos de esfuerzo: marcan proteína, grasa, hidrato mínimo, gasto por sesión y peso en el reparto de hidratos */
const TIPOS={
  ninguno:{t:"Sin deporte",pt:[2.0,1.7,1.8],ent:0,fat:0.9,cmin:0,cw:0},
  fuerza:{t:"Fuerza",pt:[2.4,2.1,2.2],ent:0.035,fat:0.8,cmin:0,cw:0.5},
  resistencia:{t:"Resistencia",pt:[2.0,1.8,1.9],ent:0.05,fat:0.7,cmin:2.5,cw:1},
  hibrido:{t:"Híbrido",pt:[2.3,2.0,2.1],ent:0.06,fat:0.7,cmin:3.0,cw:1},
  mixto:{t:"Mixto y equipo",pt:[2.2,1.9,2.0],ent:0.045,fat:0.75,cmin:1.5,cw:0.7},
  suave:{t:"Suave",pt:[2.0,1.7,1.8],ent:0.015,fat:0.9,cmin:0,cw:0.2}
};
/* Deportes concretos. i = intensidad de la sesión respecto a su tipo */
const SPORTS=[
  ["gimnasio","Gimnasio / pesas","fuerza",1],["calistenia","Calistenia","fuerza",1],["halterofilia","Halterofilia / powerlifting","fuerza",1],
  ["hyrox","Hyrox","hibrido",1],["crossfit","CrossFit","hibrido",1],["triatlon","Triatlón","hibrido",1.15],
  ["running","Correr","resistencia",1],["trail","Trail / montaña","resistencia",1.15],["ciclismo","Ciclismo","resistencia",1],["natacion","Natación","resistencia",1],
  ["paddle","Paddle surf","resistencia",0.8],["remo","Remo / kayak","resistencia",1],["senderismo","Senderismo","resistencia",0.7],
  ["padel","Pádel","mixto",1],["tenis","Tenis","mixto",1],["futbol","Fútbol","mixto",1.1],["baloncesto","Baloncesto","mixto",1],
  ["artes","Artes marciales / boxeo","mixto",1.1],["escalada","Escalada","mixto",0.9],["surf","Surf","mixto",0.9],
  ["yoga","Yoga / pilates","suave",1],["caminar","Caminar rápido","suave",1]
].map(([id,t,tipo,i])=>({id,t,tipo,i}));
const SPORT=Object.fromEntries(SPORTS.map(s=>[s.id,s]));
const SPORT_GROUPS=[["fuerza","Fuerza"],["hibrido","Híbridos"],["resistencia","Resistencia"],["mixto","Mixtos y de equipo"],["suave","Suaves"]];
/* Perfiles antiguos: un único tipo y días sueltos → plan semanal */
function migrateSport(p){
  if(Array.isArray(p.plan)&&p.plan.length===7)return p;
  const map={fuerza:"gimnasio",resistencia:"running",mixto:"padel",ninguno:""};
  let main=p.deporte in map?map[p.deporte]:(SPORT[p.deporte]?p.deporte:(p.entrenos?"gimnasio":""));
  p.deporte=main;p.secundarios=p.secundarios||[];
  p.plan=Array.from({length:7},(_,i)=>main&&(p.diasEntreno||[]).includes(i)?main:"");
  if(main&&!p.plan.some(Boolean)){[0,2,4].slice(0,Math.max(1,Math.min(3,p.entrenos||3))).forEach(i=>p.plan[i]=main);}
  p.entrenos=p.plan.filter(Boolean).length;delete p.diasEntreno;
  return p;
}
function sportsOf(p){return [p.deporte,...(p.secundarios||[])].filter(x=>SPORT[x]);}
function dep(p){const s=SPORT[p.deporte];return s?TIPOS[s.tipo]:TIPOS.ninguno;}
function depName(p){const s=SPORT[p.deporte];return s?s.t:"Sin deporte";}
function planDays(p){return (p.plan||[]).map((id,i)=>SPORT[id]?{i,s:SPORT[id]}:null).filter(Boolean);}
function actFactor(p){
  const base={sentado:1.2,mixto:1.35,fisico:1.5}[p.trabajo]||1.2;
  const pasos=clamp(((p.pasos||0)-4000)/1000*0.025,0,0.25);
  const pd=planDays(p);
  const ent=pd.length?pd.reduce((a,d)=>a+TIPOS[d.s.tipo].ent*d.s.i,0):clamp(p.entrenos||0,0,10)*dep(p).ent;
  return Math.min(2.0,base+pasos+ent);
}
function carbMin(p){
  const pd=planDays(p);const main=dep(p).cmin;
  if(!pd.length)return main;
  const avg=pd.reduce((a,d)=>a+TIPOS[d.s.tipo].cmin,0)/pd.length;
  return Math.max(main*0.8,avg);
}
/* US Navy por sexo (cm). Si faltan medidas, estimación por IMC (Deurenberg). */
function bodyFat(p,peso,cintura){
  const c=cintura||p.cintura0, n=p.cuello, h=p.altura, k=p.cadera;
  let bf=null;
  if(p.sexo==="H"&&c>n&&n>0) bf=495/(1.0324-0.19077*log10(c-n)+0.15456*log10(h))-450;
  if(p.sexo==="M"&&k>0&&c+k>n&&n>0) bf=495/(1.29579-0.35004*log10(c+k-n)+0.221*log10(h))-450;
  if(bf===null||!isFinite(bf)){const imc=peso/((h/100)**2);bf=1.2*imc+0.23*edadDe(p)-10.8*(p.sexo==="H"?1:0)-5.4;}
  return r1(clamp(bf,3,60));
}
const RITMOS={
  perder:{suave:[0.25,0.6,0.45],normal:[0.5,0.9,0.7],rapido:[0.7,1.1,0.9]},
  ganar:{suave:[0.1,0.25,0.15],normal:[0.2,0.4,0.3],rapido:[0.2,0.4,0.3]},
  mantener:{suave:[-0.25,0.25,0],normal:[-0.25,0.25,0],rapido:[-0.25,0.25,0]}
};
const RITMO_TXT={suave:"Suave",normal:"Normal",rapido:"Rápido"};
function banda(p){
  if(p.meta&&typeof goalCfg==="function"){
    const c=goalCfg(p);const m={suave:0.75,normal:1,rapido:1.2}[p.ritmo]||1;
    if(c.obj==="mantener")return [-0.25,0.25,0];
    return c.band.map(x=>Math.round(x*m*100)/100);
  }
  return (RITMOS[p.objetivo]||RITMOS.perder)[p.ritmo]||RITMOS.perder.normal;
}
function kcalFloor(p,peso){return Math.max(p.sexo==="H"?1500:1200,r25(bmr(p,peso)));}

/* Peso y cintura actuales: última media semanal con datos y última cintura registrada */
function currentWeight(p){
  const w=weeklyData(p).filter(x=>x.n>0);
  return w.length?w[w.length-1].avg:p.peso0;
}
function currentWaist(p){
  const ks=Object.keys(p.checkins||{}).sort();
  for(let i=ks.length-1;i>=0;i--){const c=p.checkins[ks[i]];if(c&&c.cintura)return c.cintura;}
  return p.cintura0;
}

/* Cálculo de objetivos. tdeeOverride permite recalibrar con el gasto real estimado. */
function computeTargets(p,opts={}){
  const peso=opts.peso||currentWeight(p);
  const cint=opts.cintura||currentWaist(p);
  const B=bmr(p,peso);
  const tdee=opts.tdee||B*actFactor(p);
  const bf=bodyFat(p,peso,cint);
  const lbm=peso*(1-bf/100);
  const adj=Math.min(peso,lbm/0.75);
  const band=banda(p);
  let kcal=tdee;
  if(p.embarazo) kcal=tdee;
  else if(p.objetivo==="perder"){const def=Math.min(band[2]/100*peso*7700/7,0.22*tdee);kcal=tdee-def;}
  else if(p.objetivo==="ganar"){const sur=clamp(band[2]/100*peso*7700/7,150,0.15*tdee);kcal=tdee+sur;}
  const floor=kcalFloor(p,peso);
  const GC=p.meta&&typeof goalCfg==="function"?goalCfg(p):null;
  if(GC&&GC.kcalAdj&&!p.embarazo)kcal*=GC.kcalAdj;
  if(p.objetivo!=="ganar") kcal=Math.max(kcal,Math.min(floor,tdee));
  kcal=r25(kcal);
  const D=dep(p);let pf=D.pt[p.objetivo==="perder"?0:p.objetivo==="mantener"?1:2];
  if(GC){pf=GC.prot-(["resistencia","suave"].includes((SPORT[p.deporte]||{}).tipo)?0.2:0);}
  let P=r5(clamp(pf*lbm,1.2*adj,2.6*adj));
  const fMin=0.6*adj;
  let F=(D.fat+(p.sexo==="M"?0.1:0))*adj;
  F=clamp(F,Math.max(fMin,0.22*kcal/9),0.35*kcal/9);
  let C=(kcal-4*P-9*F)/4;
  if(C<60){F=Math.max(fMin,F-(60-C)*4/9);C=(kcal-4*P-9*F)/4;}
  const est=p.dietaEstilo||"equilibrada";
  if(est==="bajahc"){C=Math.min(C,Math.max(60,1.2*adj));F=Math.max(fMin,(kcal-4*P-4*C)/9);}
  else if(est==="keto"){C=40;F=Math.max(fMin,(kcal-4*P-4*C)/9);}
  else if(est==="altahc"){F=fMin;C=(kcal-4*P-9*F)/4;}
  if(est==="equilibrada"||est==="altahc"){
    const CM=carbMin(p);
    if(CM&&C<CM*adj){const need=(CM*adj-C)*4/9;const take=Math.min(need,Math.max(0,F-fMin));F-=take;C=(kcal-4*P-9*F)/4;}
  }
  C=Math.max(C,est==="keto"?20:40);
  F=r5(F);C=r5(C);
  return {kcal:4*P+9*F+4*C,p:P,f:F,c:C,tdee:Math.round(tdee),bmr:Math.round(B),bf,lbm:r1(lbm),floor,peso:r1(peso)};
}
function targetWeight(p){
  const peso=currentWeight(p),bf=bodyFat(p,peso,currentWaist(p));
  const lbm=peso*(1-bf/100);const t=(p.grasaObj||(p.sexo==="H"?18:25))/100;
  return r1(lbm/(1-t));
}

/* ===== Datos semanales ===== */
function weeklyData(p){
  const ws={};
  Object.entries(p.weights||{}).forEach(([d,kg])=>{
    if(!kg)return;const k=weekStart(d);(ws[k]=ws[k]||[]).push(kg);
  });
  Object.keys(p.checkins||{}).forEach(k=>{ws[k]=ws[k]||[];});
  const keys=Object.keys(ws).sort();
  if(!keys.length)return [];
  const out=[];let k=keys[0];const last=keys[keys.length-1];
  while(k<=last){
    const arr=ws[k]||[];
    out.push({week:k,n:arr.length,avg:arr.length?r1(arr.reduce((a,b)=>a+b,0)/arr.length):null,ci:(p.checkins||{})[k]||null});
    k=addDays(k,7);
  }
  return out;
}
function targetsAt(p,date){
  const h=(p.history||[]).filter(x=>x.date<=date).sort((a,b)=>a.date.localeCompare(b.date));
  return h.length?h[h.length-1]:p.targets;
}

/* ===== Regla automática de ajuste =====
   Usa dos semanas consecutivas de cambio de peso medio (en % del peso corporal). */
function weekValid(w,p){
  if(!w||w.n<3)return {ok:false,why:"menos de 3 pesadas en la semana"};
  if(!w.ci)return {ok:false,why:"falta la revisión semanal"};
  if((w.ci.adherencia??7)<5)return {ok:false,why:"adherencia por debajo de 5 días"};
  if(w.ci.ciclo)return {ok:false,why:"semana marcada con retención por ciclo"};
  if(w.ci.pasos&&p.pasos&&w.ci.pasos<0.7*p.pasos)return {ok:false,why:"actividad muy por debajo de lo habitual"};
  return {ok:true};
}
function evaluate(p,weekKey){
  const W=weeklyData(p);const i=W.findIndex(x=>x.week===weekKey);
  if(i<0)return {d:"SIN_DATOS",why:"Sin datos de esa semana."};
  if(p.pausa)return {d:"PAUSA",why:"Estás en pausa de dieta: calorías de mantenimiento, sin ajustes."};
  if(i<2||W[i-1].n===0||W[i-2].n===0)return {d:"SIN_DATOS",why:"Hacen falta tres semanas con peso registrado para decidir por tendencia."};
  const a=W[i],b=W[i-1],c=W[i-2];
  for(const [w,lbl] of [[a,"esta semana"],[b,"la semana anterior"]]){
    const v=weekValid(w,p);if(!v.ok)return {d:"NO_VALIDA",why:`Se mantiene: ${lbl} no es válida (${v.why}).`};
  }
  if(c.n<3)return {d:"NO_VALIDA",why:"Se mantiene: la semana de referencia tiene menos de 3 pesadas."};
  const r1w=(a.avg-b.avg)/b.avg*100, r0w=(b.avg-c.avg)/c.avg*100;
  const dWaist=(a.ci.cintura&&b.ci.cintura)?a.ci.cintura-b.ci.cintura:null;
  const [lo,hi]=banda(p);
  const perf=a.ci.rendimiento;
  const nn=x=>Number(x).toLocaleString("es-ES",{maximumFractionDigits:2});const fmt=x=>(x>0?"+":"")+nn(x)+" %";
  const det=`Cambio semanal: ${fmt(r1w)} y ${fmt(r0w)} del peso. Rango objetivo: ${p.objetivo==="perder"?"-"+nn(hi)+" a -"+nn(lo):p.objetivo==="ganar"?"+"+nn(lo)+" a +"+nn(hi):"±0,25"} %.`;
  let d="MANTENER",why="Ritmo dentro del rango. Seguimos igual.";
  if(p.objetivo==="perder"){
    const L1=-r1w,L0=-r0w;
    if(L1>hi&&L0>hi){d="SUBIR";why="Pierdes más rápido de lo previsto dos semanas seguidas. Subimos un poco para proteger músculo y rendimiento.";}
    else if(L1>hi&&perf==="BAJA"){d="SUBIR";why="Pérdida rápida y rendimiento en descenso. Subimos hidratos.";}
    else if(L1<lo&&L0<lo){
      if(dWaist!==null&&dWaist<=-0.5){d="MANTENER";why="El peso apenas baja, pero la cintura sí. No hace falta recortar.";}
      else {d="BAJAR";why="Dos semanas por debajo del ritmo mínimo sin bajar cintura. Recortamos un escalón.";}
    }
  } else if(p.objetivo==="ganar"){
    if(r1w<lo&&r0w<lo){d="SUBIR";why="Subes menos de lo previsto dos semanas seguidas.";}
    else if(r1w>hi&&r0w>hi){d="BAJAR";why="Subes más rápido de lo previsto: probablemente sea grasa.";}
    else if(dWaist!==null&&dWaist>=1&&r1w>lo){d="BAJAR";why="La cintura sube más de 1 cm en una semana.";}
  } else {
    if(r1w<-0.25&&r0w<-0.25){d="SUBIR";why="Estás perdiendo peso sin buscarlo.";}
    else if(r1w>0.25&&r0w>0.25){d="BAJAR";why="Estás ganando peso sin buscarlo.";}
  }
  return {d,why,det,r1w,r0w,dWaist};
}
function stepKcal(t){return clamp(r25(t.kcal*0.05),75,150);}
function applyDecision(p,d){
  const t={...p.targets};const peso=currentWeight(p);const st=stepKcal(t);
  const adj=Math.min(peso,peso*(1-bodyFat(p,peso,currentWaist(p))/100)/0.75);
  if(d==="SUBIR"){t.c+=r5(st/4);}
  if(d==="BAJAR"){
    const floor=kcalFloor(p,peso);
    if(t.kcal-st<floor)return {blocked:true,t};
    let newC=t.c-st/4;
    if(newC<60){
      const fromF=Math.min((60-newC)*4/9,Math.max(0,t.f-0.6*adj));
      t.f=r5(t.f-fromF);newC+=fromF*9/4;
    }
    t.c=r5(Math.max(40,newC));
  }
  t.kcal=4*t.p+9*t.f+4*t.c;
  return {blocked:false,t};
}

/* Gasto real estimado: calorías objetivo medias + variación del peso (regresión lineal) */
function adaptiveTDEE(p){
  const cur=weekStart(today());
  const W=weeklyData(p).filter(w=>w.n>=3&&w.week<cur).slice(-6);
  if(W.length<3)return null;
  const xs=W.map((_,i)=>i),ys=W.map(w=>w.avg);
  const mx=xs.reduce((a,b)=>a+b)/xs.length,my=ys.reduce((a,b)=>a+b)/ys.length;
  let num=0,den=0;xs.forEach((x,i)=>{num+=(x-mx)*(ys[i]-my);den+=(x-mx)**2;});
  const slope=num/den;
  const intake=W.reduce((a,w)=>a+targetsAt(p,addDays(w.week,6)).kcal,0)/W.length;
  return {tdee:Math.round(intake-slope*7700/7),slope:r1(slope*100)/100,weeks:W.length,intake:Math.round(intake)};
}
function weeksInDeficit(p){
  if(p.objetivo!=="perder")return 0;
  const from=p.ultimaPausa||p.creado;
  return Math.floor(daysBetween(from,today())/7);
}

/* ===== Generador de dieta ===== */
const MEAL_SETS={
  "2":[["Comida","p",0.5],["Cena","p",0.5]],
  "3":[["Desayuno","d",0.3],["Comida","p",0.4],["Cena","p",0.3]],
  "3a":[["Comida","p",0.4],["Merienda","s",0.2],["Cena","p",0.4]],
  "4":[["Desayuno","d",0.25],["Comida","p",0.35],["Merienda","s",0.12],["Cena","p",0.28]],
  "5":[["Desayuno","d",0.2],["Media mañana","s",0.1],["Comida","p",0.32],["Merienda","s",0.1],["Cena","p",0.28]]
};
const MEAL_TXT={"2":"2 comidas","3":"3 comidas","3a":"3 comidas sin desayuno","4":"4 comidas","5":"5 comidas"};
const ROLE_Q={P:[60,280,10],C:[30,150,5],B:[20,140,10],D:[100,500,25],G:[0,30,5],N:[10,40,5]};

function banned(p){const s=new Set();(p.restr||[]).forEach(r=>{const x=RESTRICTIONS.find(z=>z[0]===r);if(x)x[2].forEach(t=>s.add(t));});return s;}
function allowed(p,f){const b=banned(p);return !f.t.some(t=>b.has(t))&&(p.prefs||{})[f.id]!==-1;}
function cands(p,role,slot,extra){return FOODS.filter(f=>f.r===role&&f.s.includes(slot)&&allowed(p,f)&&(!extra||extra(f)));}
/* Variedad con cabeza: proteínas e hidratos rotan; lácteos, grasas, panes, fruta y frutos secos
   se repiten para que la compra sea corta y no sobren diez productos abiertos. */
const ROLE_CAP={P:5,C:4,V:6,F:4,D:2,B:3,N:2,G:2};
const ROLE_REUSE={P:false,C:false,V:false,F:true,D:true,B:true,N:true,G:true};
function pick(p,list,ctx,avoid=[]){
  let pool=list.filter(f=>!avoid.includes(f.id));if(!pool.length)pool=list;
  if(!pool.length)return null;
  const role=pool[0].r;
  if(ctx&&ctx.use){
    const usedRole=Object.keys(ctx.use).filter(id=>FOOD[id]&&FOOD[id].r===role);
    if(usedRole.length>=(ROLE_CAP[role]||9)){const r2=pool.filter(f=>usedRole.includes(f.id));if(r2.length)pool=r2;}
  }
  const L=pool;
  const ws=L.map(f=>{
    const use=(ctx&&ctx.use[f.id])||0;
    const rep=ROLE_REUSE[f.r]?(1+use*1.5):1/(1+use*1.2);
    return ((p.prefs||{})[f.id]===1?4:1)*rep*(f.id==="aove"?3:1)*(f.r==="P"&&f.f>12?0.35:1)*(f.r==="D"?(f.p>=8?2.5:0.6):1);
  });
  let r=Math.random()*ws.reduce((a,b)=>a+b,0);
  for(let i=0;i<L.length;i++){r-=ws[i];if(r<=0)return L[i];}
  return L[L.length-1];
}
const grams=(f,q)=>f.u?q*f.u:q;
function mac(f,q){const g=grams(f,q)/100;return {kcal:f.kcal*g,p:f.p*g,f:f.f*g,c:f.c*g};}
function sumItems(items){const s={kcal:0,p:0,f:0,c:0};items.forEach(it=>{const m=mac(FOOD[it.id],it.q);for(const k in s)s[k]+=m[k];});return s;}
function qRange(f){return f.q||ROLE_Q[f.r]||[0,999,5];}
function fixedQ(f){
  if(f.r==="V")return f.d||200;
  if(f.r==="F")return f.u?(f.d||1):(f.d||150);
  return null;
}
function leverOf(f){return {P:"p",D:"p",C:"c",B:"c",G:"f",N:"f"}[f.r]||null;}

function solveMeal(items,T){
  const levers={};
  items.forEach((it,i)=>{const f=FOOD[it.id];const fx=fixedQ(f);if(fx!==null){it.q=fx;return;}const m=leverOf(f);if(m&&levers[m]===undefined)levers[m]=i;else{it.q=it.q||qRange(f)[0];}});
  Object.values(levers).forEach(i=>{const f=FOOD[items[i].id];const [a,b]=qRange(f);items[i].q=items[i].q||((a+b)/2);});
  for(let k=0;k<12;k++){
    for(const m of ["p","c","f"]){
      const i=levers[m];if(i===undefined)continue;
      const f=FOOD[items[i].id];const per=f[m]*(f.u||1)/100;if(per<=0.001)continue;
      const others=items.filter((_,j)=>j!==i);const o=sumItems(others)[m];
      let [a,b]=qRange(f);
      if(m==="p"&&f.f>0&&!f.u){const fp=f.f/100;b=Math.max(a,Math.min(b,(T.f*0.85)/fp));}
      items[i].q=clamp((T[m]-o)/per,a,b);
    }
  }
  items.forEach(it=>{const f=FOOD[it.id];const [a,b,s]=qRange(f);if(fixedQ(f)===null){it.q=clamp(Math.round(it.q/s)*s,a,b);if(it.q===0&&f.r!=="G")it.q=a;}});
  return items;
}

function mealTargets(day,set,shares){return set.map(([,,sh])=>({kcal:day.kcal*sh,p:day.p*sh,f:day.f*sh,c:day.c*sh}));}

function templateMeal(p,type,ctx,avoid=[],T={kcal:600}){
  const K=T.kcal;
  const it=[];const add=f=>{if(f)it.push({id:f.id,q:0});return f;};
  if(type==="p"){
    if(p.favs&&p.favs.length&&Math.random()<0.2){
      const fv=p.favs.filter(x=>x.type==="p"&&x.items.every(id=>FOOD[id]&&allowed(p,FOOD[id])));
      if(fv.length){const x=fv[Math.floor(Math.random()*fv.length)];return x.items.map(id=>({id,q:0}));}
    }
    const P=add(pick(p,cands(p,"P","p"),ctx,[...avoid,...(ctx?ctx.avoidP:[])]));
    add(pick(p,cands(p,"C","p"),ctx,avoid));
    const v1=add(pick(p,cands(p,"V","p"),ctx,avoid));
    if(K>450&&Math.random()<0.45&&v1)add(pick(p,cands(p,"V","p").filter(f=>f.id!==v1.id),ctx,avoid));
    if(!P||P.f<15)add(pick(p,cands(p,"G","p"),ctx));
    return it;
  }
  if(type==="d"){
    const bowlB=cands(p,"B","d",f=>f.bowl),toastB=cands(p,"B","d",f=>!f.bowl);
    const D=cands(p,"D","d"),PD=cands(p,"P","d");
    const opts=[];
    if(bowlB.length&&D.length)opts.push("bowl");
    if(toastB.length&&(PD.length||D.length))opts.push("tostada");
    const pat=opts[Math.floor(Math.random()*opts.length)];
    if(pat==="bowl"){add(pick(p,D,ctx,avoid));add(pick(p,bowlB,ctx,avoid));add(pick(p,cands(p,"F","d"),ctx,avoid));if(K>380&&Math.random()<0.6)add(pick(p,cands(p,"N","d"),ctx));}
    else if(pat==="tostada"){add(pick(p,PD.length?PD:D,ctx,avoid));add(pick(p,toastB,ctx,avoid));add(pick(p,cands(p,"G","d"),ctx));if(K>380&&Math.random()<0.5)add(pick(p,cands(p,"F","d"),ctx,avoid));}
    else {add(pick(p,cands(p,"F","d"),ctx));add(pick(p,cands(p,"N","d"),ctx));}
    return it;
  }
  /* snack */
  const D=cands(p,"D","s"),Ps=cands(p,"P","s"),B=cands(p,"B","s",f=>!f.bowl),F=cands(p,"F","s"),N=cands(p,"N","s");
  const opts=[];if(D.length)opts.push("yogur","yogur");if(Ps.length&&B.length)opts.push("bocadillo");if(F.length)opts.push("fruta");
  const pat=opts[Math.floor(Math.random()*opts.length)];
  if(pat==="yogur"){add(pick(p,D,ctx,avoid));add(pick(p,F,ctx,avoid));if(K>220&&Math.random()<0.5)add(pick(p,N,ctx));}
  else if(pat==="bocadillo"){add(pick(p,Ps,ctx,avoid));add(pick(p,B,ctx,avoid));if(K>260&&Math.random()<0.3)add(pick(p,F,ctx,avoid));}
  else {add(pick(p,F,ctx,avoid));add(pick(p,N,ctx));}
  return it;
}

function dayCorrect(day){
  const rest=day.meals.filter(m=>!m.fuera);
  const tgt={p:0,c:0,f:0};rest.forEach(m=>{tgt.p+=m.t.p;tgt.c+=m.t.c;tgt.f+=m.t.f;});
  for(let pass=0;pass<3;pass++){
    for(const m of ["c","p","f"]){
      const delta=tgt[m]-sumItems(rest.flatMap(x=>x.items))[m];
      if(Math.abs(delta)<(m==="f"?3:5))continue;
      const lev=[];day.meals.filter(x=>!x.fuera).forEach(x=>x.items.forEach(it=>{const f=FOOD[it.id];if(leverOf(f)===m&&fixedQ(f)===null&&!(m==="p"&&f.f>12))lev.push(it);}));
      const main=lev.filter(it=>["P","C","G"].includes(FOOD[it.id].r));const L=main.length?main:lev;
      if(!L.length)continue;
      const share=delta/L.length;
      L.forEach(it=>{const f=FOOD[it.id];const per=f[m]*(f.u||1)/100;if(per<=0.001)return;const [a,b,st]=qRange(f);it.q=clamp(Math.round((it.q+share/per)/st)*st,a,b);});
    }
  }
  /* Ajuste final de calorías con los hidratos si la grasa se ha ido de rango */
  const tk=rest.reduce((a,m)=>a+m.t.kcal,0);
  const dk=tk-sumItems(rest.flatMap(x=>x.items)).kcal;
  if(Math.abs(dk)>tk*0.04){
    const L=[];rest.forEach(x=>x.items.forEach(it=>{const f=FOOD[it.id];if((f.r==="C"||f.r==="B")&&fixedQ(f)===null)L.push(it);}));
    L.forEach(it=>{const f=FOOD[it.id];const per=f.kcal*(f.u||1)/100;const [a,b,st]=qRange(f);it.q=clamp(Math.round((it.q+dk/L.length/per)/st)*st,a,b);});
    const dk2=tk-sumItems(rest.flatMap(x=>x.items)).kcal;
    if(dk2<-tk*0.04){
      const Gs=[];rest.forEach(x=>x.items.forEach(it=>{const f=FOOD[it.id];if((f.r==="G"||f.r==="N")&&fixedQ(f)===null)Gs.push(it);}));
      let over=-dk2;Gs.sort((a,b)=>FOOD[b.id].kcal-FOOD[a.id].kcal).forEach(it=>{if(over<=0)return;const f=FOOD[it.id];const [a,,st]=qRange(f);const per=f.kcal*(f.u||1)/100;const can=(it.q-a)*per;const cut=Math.min(can,over);it.q=Math.max(a,Math.round((it.q-cut/per)/st)*st);over-=cut;});
    }
  }
}

function mealSplit(p,T,set){
  const ts=mealTargets(T,set);
  if(p.reparto==="peri"&&T.train&&p.dietaEstilo!=="keto"){
    const {pre,post}=periIdx(p,set);const peri=[pre,post].filter(i=>i>=0&&i<ts.length);
    if(peri.length&&peri.length<ts.length){
      const others=ts.map((_,i)=>i).filter(i=>!peri.includes(i));
      const move=others.reduce((a,i)=>a+ts[i].c*0.4,0);
      others.forEach(i=>{const dc=ts[i].c*0.4;ts[i].c-=dc;ts[i].f+=dc*4/9;});
      const fBack=move*4/9;peri.forEach(i=>{ts[i].c+=move/peri.length;ts[i].f=Math.max(ts[i].f*0.4,ts[i].f-fBack/peri.length);});
    }
  }
  return ts;
}
function buildDay(p,T,ctx,prevDay){
  const set=MEAL_SETS[p.comidas]||MEAL_SETS["4"];
  const ts=mealSplit(p,T,set);
  const day={meals:[]};let lunchP=null;
  set.forEach(([name,type],i)=>{
    const avoidP=[];if(lunchP)avoidP.push(lunchP);
    if(prevDay&&prevDay.meals[i]){prevDay.meals[i].items.forEach(it=>{if(FOOD[it.id]&&["P","C","D","B"].includes(FOOD[it.id].r))avoidP.push(it.id);});}
    ctx.avoidP=avoidP;
    const items=templateMeal(p,type,ctx,avoidP,ts[i]);
    solveMeal(items,ts[i]);
    items.forEach(it=>{ctx.use[it.id]=(ctx.use[it.id]||0)+1;});
    const pr=items.find(it=>FOOD[it.id].r==="P");if(type==="p"&&pr)lunchP=pr.id;
    day.meals.push({name,type,items,t:ts[i],base:ts[i]});
  });
  dayCorrect(day);
  return day;
}
/* Reparto de hidratos según el deporte de cada día: misma cantidad semanal */
function dayWeights(p){return Array.from({length:7},(_,i)=>{const s=SPORT[(p.plan||[])[i]];return s?TIPOS[s.tipo].cw*s.i:0;});}
function refeedDays(p){
  const n=+p.recarga||0;if(!n)return [];
  const w=dayWeights(p);const order=[5,2,6,0,3,4,1].sort((a,b)=>w[b]-w[a]||0);
  const first=order[0];if(n===1)return [first];
  const second=order.find(d=>Math.abs(d-first)>=3&&Math.abs(d-first)<=4)??order[1];
  return [first,second];
}
function dayTargets(p,T,di){
  const s=SPORT[(p.plan||[])[di]]||null;
  let out={...T,train:!!s,sport:s?s.id:""};
  const w=dayWeights(p);const avg=w.reduce((a,b)=>a+b,0)/7;
  const keto=p.dietaEstilo==="keto";
  if(!keto&&p.ciclado&&!(!s&&avg===0)&&!w.every(x=>x===w[0])){
    const c=r5(clamp(T.c*(1+0.35*(w[di]-avg)),T.c*0.65,T.c*1.45));
    out={...out,c,kcal:4*T.p+9*T.f+4*c};
  }
  const rd=refeedDays(p);
  if(rd.length){
    const maint=Math.max(T.kcal,p.tdeeRef||T.kcal);const dk=Math.max(150,maint-T.kcal);
    if(rd.includes(di)){
      const fCut=keto?Math.round(out.f*0.45):0;
      const c=r5(out.c+(dk+fCut*9)/4);const f=out.f-fCut;
      out={...out,c,f,kcal:4*out.p+9*f+4*c,refeed:true};
    }else{
      const per=dk*rd.length/(7-rd.length);
      if(keto){const f=Math.max(Math.round(T.f*0.6),r5(out.f-per/9));out={...out,f,kcal:4*out.p+9*f+4*out.c};}
      else{const c=Math.max(40,r5(out.c-per/4));out={...out,c,kcal:4*out.p+9*out.f+4*c};}
    }
  }
  return out;
}
/* Comidas de antes y después de entrenar según la hora */
function periIdx(p,set){
  const h=(p.gym&&p.gym.setup&&p.gym.setup.hora)||"tarde";const names=set.map(x=>x[0]);
  let post=h==="manana"?1:h==="mediodia"?names.indexOf("Comida"):names.indexOf("Cena");
  if(post<0)post=names.length-1;return {pre:post-1,post};
}
function buildWeek(p,ws){
  const T={...p.targets};const ctx={use:{},avoidP:[]};const days=[];
  for(let d=0;d<7;d++){
    let best=null,bestErr=1e9,bestUse=null;
    for(let k=0;k<4;k++){
      const Td=dayTargets(p,T,d);
      const c2={use:{...ctx.use},avoidP:[]};const day=buildDay(p,Td,c2,days[d-1]);day.T=Td;
      const err=Math.abs(dayTotals(day).kcal-Td.kcal)/Td.kcal+Math.abs(dayTotals(day).p-Td.p)/Td.p*0.5;
      if(err<bestErr){best=day;bestErr=err;bestUse=c2.use;}
      if(err<0.03)break;
    }
    ctx.use=bestUse;days.push(best);
  }
  return {week:ws,targets:T,comidas:p.comidas,ciclado:!!p.ciclado,cfg:typeof menuCfg==="function"?menuCfg(p):"",days,created:today()};
}
function regenMeal(p,menu,di,mi){
  const day=menu.days[di];const m=day.meals[mi];
  const avoid=m.items.map(i=>i.id);
  const items=templateMeal(p,m.type,{use:{},avoidP:[]},avoid,m.t);
  solveMeal(items,m.t);m.items=items;
}
function alternatives(p,meal,itemIdx){
  const f=FOOD[meal.items[itemIdx].id];
  const used=meal.items.map(i=>i.id);
  return FOODS.filter(x=>x.r===f.r&&x.s.includes(meal.type)&&allowed(p,x)&&!used.includes(x.id)&&(f.r!=="B"||x.bowl===f.bowl));
}
function swapItem(menu,di,mi,ii,newId){
  const m=menu.days[di].meals[mi];m.items[ii]={id:newId,q:0};solveMeal(m.items,m.t);
}
function rebalanceDay(menu,di){
  const day=menu.days[di];const T=day.T||menu.targets;
  const fuera=day.meals.filter(m=>m.fuera).reduce((a,m)=>a+m.fuera.kcal,0);
  const rest=day.meals.filter(m=>!m.fuera);
  const baseK=rest.reduce((a,m)=>a+m.base.kcal,0)||1;
  const factor=clamp((T.kcal-fuera)/baseK,0.3,1.2);
  rest.forEach(m=>{
    const b=m.base;const kcal=b.kcal*factor;const pp=b.p*Math.max(0.8,Math.min(1,factor));const ff=b.f*Math.min(1,Math.max(0.5,factor));
    const cc=Math.max(0,(kcal-4*pp-9*ff)/4);
    m.t={kcal,p:pp,f:ff,c:cc};solveMeal(m.items,m.t);
  });
  dayCorrect(day);
  return factor;
}
function retargetMenu(p,menu){
  const set=MEAL_SETS[menu.comidas];menu.targets={...p.targets};menu.ciclado=!!p.ciclado;menu.cfg=typeof menuCfg==="function"?menuCfg(p):"";
  menu.days.forEach((day,di)=>{day.T=dayTargets(p,menu.targets,di);const ts=mealSplit(p,day.T,set);day.meals.forEach((m,i)=>{m.base=ts[i];m.t=ts[i];});rebalanceDay(menu,di);});
}
function dayTotals(day){
  const s=sumItems(day.meals.filter(m=>!m.fuera).flatMap(m=>m.items));
  day.meals.filter(m=>m.fuera).forEach(m=>{s.kcal+=m.fuera.kcal;});
  return s;
}

/* ===== Compra y batch cooking ===== */
function shoppingList(menu){
  const acc={};
  menu.days.forEach(d=>d.meals.forEach(m=>{if(m.fuera)return;m.items.forEach(it=>{acc[it.id]=(acc[it.id]||0)+it.q;});}));
  const bySec={};
  Object.entries(acc).forEach(([id,q])=>{const f=FOOD[id];(bySec[f.sec]=bySec[f.sec]||[]).push({id,f,q,g:grams(f,q)});});
  return SECTIONS.filter(s=>bySec[s]).map(s=>({sec:s,items:bySec[s].sort((a,b)=>a.f.name.localeCompare(b.f.name))}));
}
const COOK_P={plancha:"a la plancha",horno:"al horno",guiso:"guisada"};
function batchPlan(menu){
  const P={},C={},V={};let tuppers=0;const eggs={n:0};
  menu.days.forEach((d,di)=>d.meals.forEach(m=>{
    if(m.fuera)return;
    if(m.type==="p")tuppers++;
    m.items.forEach(it=>{
      const f=FOOD[it.id];const g=grams(f,it.q);
      if(f.id==="huevo"&&m.type!=="p")return;
      if(m.type!=="p")return;
      const add=(o)=>{o[f.id]=o[f.id]||{f,g:0,por:0,days:new Set()};o[f.id].g+=g;o[f.id].por++;o[f.id].days.add(di);};
      if(f.r==="P"&&["plancha","horno","guiso","huevo","vapor","hidratar"].includes(f.m))add(P);
      else if(f.r==="C"&&["hervir","cuscus","horno"].includes(f.m))add(C);
      else if(f.r==="V"&&f.m!=="crudo")add(V);
      if(f.id==="huevo")eggs.n+=it.q;
    });
  }));
  const list=o=>Object.values(o).sort((a,b)=>b.g-a.g);
  return {P:list(P),C:list(C),V:list(V),tuppers,eggs:eggs.n};
}

/* ===== Recetas sencillas generadas desde los ingredientes ===== */
function qtyTxt(f,q){
  if(f.u)return q+" "+f.un+(q>1&&!/s$/.test(f.un)?(/[aeiouáéó]$/.test(f.un)?"s":"es"):"");
  return Math.round(q)+(f.id==="aove"?" g":" g");
}
function recipe(meal){
  const s=[];const it=meal.items.map(i=>({f:FOOD[i.id],q:i.q}));
  const by=r=>it.filter(x=>x.f.r===r);
  const n=x=>`${qtyTxt(x.f,x.q)} de ${x.f.name.toLowerCase()}`;
  by("C").forEach(x=>{
    const m={hervir:`Cuece ${n(x)} en agua con sal el tiempo del paquete y escurre.`,cuscus:`Hidrata ${n(x)} con el mismo volumen de agua hirviendo, tapa 5 minutos y suelta con un tenedor.`,horno:`Corta ${n(x)} en gajos y hornea a 210 °C unos 30-35 minutos (o 20 en air fryer).`,bote:`Escurre y enjuaga ${n(x)}. Calienta en sartén con las especias o tómalas templadas.`,micro:`Calienta ${n(x)} en el microondas 1 minuto.`,frio:`Prepara ${n(x)}.`}[x.f.m]||`Prepara ${n(x)}.`;
    s.push(m);
  });
  by("B").forEach(x=>s.push(x.f.bowl?`Pon en un bol ${n(x)}.`:`Tuesta ${n(x)}.`));
  by("P").forEach(x=>{
    const m={plancha:`Haz ${n(x)} a la plancha con sal, pimienta y la especia que te guste.`,horno:`Hornea ${n(x)} a 200 °C, 15-25 minutos según el grosor.`,guiso:`Guisa ${n(x)} con cebolla, ajo y especias a fuego lento.`,vapor:`Cocina ${n(x)} al vapor 5-6 minutos.`,frio:`Añade ${n(x)}.`,huevo:`Prepara ${n(x)} cocidos, a la plancha o revueltos sin aceite extra.`,hidratar:`Hidrata ${n(x)} en agua caliente 10 minutos y saltéala con tomate y especias.`}[x.f.m]||`Prepara ${n(x)}.`;
    s.push(m);
  });
  by("D").forEach(x=>s.push(`Sirve ${n(x)}.`));
  const V=by("V");
  if(V.length){
    const cr=V.filter(x=>x.f.m==="crudo"),co=V.filter(x=>x.f.m!=="crudo");
    if(co.length)s.push(`Cocina ${co.map(n).join(" y ")} ${co.some(x=>x.f.m==="horno")?"al horno o a la plancha":"salteadas o al vapor"}.`);
    if(cr.length)s.push(`Prepara en crudo ${cr.map(n).join(" y ")}.`);
  }
  by("G").forEach(x=>s.push(x.f.id==="aove"?(x.q?`Añade ${n(x)} al servir, siempre pesado.`:"Sin aceite añadido en esta comida."):`Añade ${n(x)}.`));
  by("N").forEach(x=>s.push(`Añade ${n(x)}.`));
  by("F").forEach(x=>s.push(`Fruta: ${n(x)}.`));
  return s;
}
