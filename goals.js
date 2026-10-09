/* ===== Objetivos, estilos de dieta y explicaciones ===== */
/* band: % del peso por semana [mínimo, máximo, objetivo]. obj: dirección de calorías. prot: g por kg de masa magra. */
const GOALS={
  recomp:{t:"Recomposición",d:"Perder grasa conservando o ganando músculo.",obj:"perder",band:[0.3,0.6,0.45],prot:2.5,pasos:9000,
    train:{enfoque:"musculo",vol:0.95},
    info:"Bajar grasa sin perder músculo, e incluso ganar algo a la vez. Es el objetivo más sano y el que mejor se mantiene en el tiempo.\n\nCómo lo hace Afina: déficit suave (pierdes entre el 0,3 y el 0,6 % de tu peso por semana), proteína muy alta y entreno con intensidad alta. La cintura baja más que el peso, y la fuerza se mantiene o sube.\n\nFunciona especialmente bien si tienes algo de grasa que perder, si vuelves a entrenar después de un parón o si pasas de los 40."},
  estetica:{t:"Estética",d:"Músculo con buenas proporciones: la silueta.",obj:"auto",band:[0.3,0.6,0.45],prot:2.3,pasos:8000,
    train:{enfoque:"musculo",vol:1.05,estetica:true},
    info:"Construir un físico proporcionado. En hombres, la «V»: hombros y espalda anchos, cintura estrecha y brazos. En mujeres, normalmente glúteo, piernas, hombros y cintura marcada.\n\nCómo lo hace Afina: si tienes grasa de sobra, empieza en recomposición; si ya estás definido, pasa a volumen limpio. En el entreno añade series extra a los músculos que dibujan la silueta y usa superseries y técnicas de intensidad."},
  definicion:{t:"Definición",d:"Bajar grasa más rápido durante un tiempo.",obj:"perder",band:[0.7,1.0,0.85],prot:2.7,pasos:10000,
    train:{enfoque:"musculo",vol:0.85},
    info:"Perder grasa a buen ritmo durante unas semanas, para una fecha concreta o para arrancar.\n\nCómo lo hace Afina: déficit más marcado (del 0,7 al 1 % del peso por semana), la proteína más alta de todos los objetivos, entreno pesado con algo menos de volumen para recuperar mejor, y recargas para sostenerlo.\n\nNo conviene alargarlo más de 8-12 semanas seguidas. Después, una pausa en mantenimiento o pasar a recomposición."},
  volumen:{t:"Volumen limpio",d:"Ganar músculo sin acumular grasa.",obj:"ganar",band:[0.06,0.15,0.1],prot:2.0,pasos:7000,
    train:{enfoque:"musculo",vol:1.15},
    info:"Ganar músculo comiendo un poco por encima de lo que gastas, sin la barriga de los volúmenes de antes.\n\nCómo lo hace Afina: superávit pequeño (subes entre un 0,25 y un 0,5 % del peso al mes), el mayor volumen de entreno de todos los objetivos y vigilancia de la cintura: si sube más de la cuenta, la app recorta.\n\nTiene sentido cuando ya estás razonablemente definido (por debajo de un 15 % de grasa en hombres o un 23 % en mujeres)."},
  fuerza:{t:"Fuerza",d:"Subir kilos en los básicos sin dejar el músculo.",obj:"mantener",band:[-0.25,0.25,0],prot:2.1,kcalAdj:1.05,pasos:7000,
    train:{enfoque:"fuerza",vol:1},
    info:"Mover más peso en sentadilla, press y peso muerto, con trabajo de músculo detrás (lo que se llama powerbuilding).\n\nCómo lo hace Afina: calorías de mantenimiento o un poco por encima para rendir, básicos en rangos de 3 a 6 repeticiones con descansos largos y accesorios para el músculo."},
  longevidad:{t:"Longevidad",d:"Entrenar y comer para vivir más y mejor.",obj:"auto2",band:[0.25,0.5,0.35],prot:2.0,pasos:9000,
    train:{enfoque:"salud",vol:0.9},
    info:"Lo que más años de vida con calidad predice: masa muscular, fuerza, buena forma cardiovascular y poca grasa abdominal.\n\nCómo lo hace Afina: mantenimiento o un déficit suave si te sobra grasa, fuerza en todos los grandes grupos musculares con poca fatiga, articulaciones cuidadas, pasos diarios altos y proteína suficiente para no perder músculo con la edad.\n\nEs el mínimo eficaz para quien quiere salud sin vivir en el gimnasio."}
};
const GOAL_ORDER=["recomp","estetica","definicion","volumen","fuerza","longevidad"];
const DIET_STYLES={
  equilibrada:["Equilibrada","Hidratos, grasas y proteína repartidos de forma clásica.","Reparto clásico: proteína alta, grasas moderadas y el resto en hidratos. Es la opción más flexible para comer fuera, con familia o entrenando mucho."],
  bajahc:["Baja en hidratos","Menos pan, arroz y pasta; más grasa buena.","Unos 1-1,5 g de hidratos por kilo, más grasa saludable y la misma proteína. Mucha gente pasa menos hambre así.\n\nCon las mismas calorías y proteína se pierde la misma grasa que con una dieta equilibrada: elige la que te resulte más fácil de mantener. Los hidratos que hay conviene colocarlos alrededor del entreno."],
  keto:["Keto flexible","Casi sin hidratos, con días de recarga.","Menos de 50 g de hidratos al día, grasa como fuente principal de energía y uno o dos días de recarga a la semana con hidratos altos.\n\nSacia mucho y simplifica las comidas. La recarga rellena el glucógeno del músculo para entrenar fuerte y da un respiro mental. Las primeras dos semanas puedes notar menos fuerza mientras el cuerpo se adapta: bebe agua y toma sal suficiente."],
  altahc:["Alta en hidratos","Para rendir al máximo en entrenos largos o duros.","Grasas al mínimo saludable y el resto en hidratos. Pensada para quien entrena mucho volumen, hace deportes de resistencia o rinde peor con pocos hidratos."]
};
const REPARTOS={
  igual:["Igual todos los días","Los mismos macros cada día. Lo más sencillo de seguir."],
  entreno:["Más los días de entreno","Más hidratos los días que entrenas y menos los de descanso. Las calorías de la semana no cambian."],
  peri:["Alrededor del entreno","El mismo total diario, pero los hidratos se concentran en la comida de antes y la de después de entrenar, que es cuando el músculo los aprovecha."]
};
const INFO={
  objetivo:["Tu objetivo","Decide a la vez tus calorías, tu proteína y cómo entrenas. Puedes cambiarlo cuando quieras: la dieta y el plan de gimnasio se recalculan al momento.\n\nPara poder juzgar si funciona, lo ideal es darle al menos 4 semanas antes de cambiar."],
  estilo:["Estilo de dieta","Cómo se reparten las calorías entre hidratos y grasas. La proteína la marca tu objetivo y no cambia.\n\nCon las mismas calorías y proteína, cualquier estilo sirve para perder grasa: elige el que te resulte más fácil de mantener."],
  reparto:["Reparto de hidratos","En qué días y en qué comidas van los hidratos. No cambia las calorías de la semana, solo dónde las colocas."],
  recarga:["Días de recarga","Uno o dos días a la semana comes en mantenimiento, con la subida en hidratos. El resto de días se ajustan un poco para que la semana cuadre.\n\nRellenan el glucógeno para entrenar fuerte, mejoran el ánimo y ayudan a sostener la dieta. Muy recomendables en definición y en keto."],
  ayuno:["Ayuno intermitente","Comes dentro de una ventana de horas (por ejemplo, de 13:00 a 21:00) y el resto del día solo agua, café o infusiones.\n\nNo quema más grasa por sí mismo: funciona porque a mucha gente le resulta más fácil comer menos en menos horas. Si te ayuda, úsalo; si te da ansiedad o te hace comer peor, no."],
  nivel:["Nivel de experiencia","Principiante: menos de un año entrenando con constancia. Intermedio: de uno a tres años. Avanzado: más de tres años y técnica dominada.\n\nCuanto más avanzado, antes empiezas cerca del fallo, más series haces y más técnicas de intensidad se usan."],
  tecnicas:["Técnicas de intensidad","Formas de sacar más estímulo a la última serie sin alargar la sesión:\n\nRest-pause: al llegar al límite, descansas 15 segundos y sacas 2-3 repeticiones más, dos veces.\nSerie descendente: al terminar, bajas el peso un 25 % y sigues sin descanso.\nParciales en estiramiento: al terminar, haces 4-6 repeticiones de medio recorrido en la parte donde el músculo está estirado.\nSerie top y series de bajada: una serie pesada y el resto con un 10 % menos.\n\nSe usan solo en máquinas, poleas y aislamientos (o en el principal, la serie top), nunca en semana de descarga."],
  rir:["RIR","Repeticiones en reserva: cuántas más podrías haber hecho al terminar la serie. RIR 0 es el fallo; RIR 2, que te quedaban dos.\n\nEl músculo crece con series que acaban cerca del fallo. Ir siempre al fallo genera mucha fatiga; quedarte muy lejos casi no estimula."],
  superserie:["Superserie","Dos ejercicios que no compiten entre sí, alternados: una serie de cada uno y descansas al terminar la pareja. Ahorra hasta un tercio del tiempo sin perder rendimiento."],
  pasos:["Pasos diarios","El movimiento diario quema más que el propio entreno y es lo primero que baja cuando comes menos. Mantener los pasos protege tu ritmo de pérdida de grasa y tu salud cardiovascular."]
};
function goalCfg(p){
  const g=GOALS[p.meta]||GOALS.recomp;const c={...g,id:p.meta||"recomp"};
  if(g.obj==="auto"||g.obj==="auto2"){
    let bf=null;try{bf=bodyFat(p,currentWeight(p),currentWaist(p));}catch(e){}
    const high=bf!=null&&bf>(p.sexo==="H"?(g.obj==="auto"?16:20):(g.obj==="auto"?24:28));
    if(high){c.obj="perder";}
    else if(g.obj==="auto"){c.obj="ganar";c.band=GOALS.volumen.band;}
    else {c.obj="mantener";c.band=[-0.25,0.25,0];}
    c.fase=c.obj==="perder"?"en fase de pérdida de grasa":c.obj==="ganar"?"en fase de volumen limpio":"en mantenimiento";
  }
  return c;
}
function syncGoal(p){if(!p.meta)p.meta={perder:"recomp",mantener:"longevidad",ganar:"volumen"}[p.objetivo]||"recomp";p.objetivo=p.embarazo?"mantener":goalCfg(p).obj;if(!p.dietaEstilo)p.dietaEstilo="equilibrada";if(!p.reparto)p.reparto=p.ciclado?"entreno":"igual";p.ciclado=p.reparto==="entreno";if(p.recarga==null)p.recarga=0;if(!p.pasosObj)p.pasosObj=(GOALS[p.meta]||GOALS.recomp).pasos;return p;}
function infoBtn(k,lbl){return `<button type="button" class="ib" data-a="info" data-k="${k}" aria-label="Qué es ${esc(lbl||k)}">i</button>`;}
function sheetInfo(k){
  let t,body;
  if(INFO[k])[t,body]=INFO[k];
  else if(k.startsWith("g_")){const g=GOALS[k.slice(2)];t=g.t;body=g.info;}
  else if(k.startsWith("e_")){const s=DIET_STYLES[k.slice(2)];t=s[0];body=s[2];}
  else if(k.startsWith("r_")){const s=REPARTOS[k.slice(2)];t=s[0];body=s[1];}
  else {t="Información";body="";}
  return `<div class="sheet-h"><h2>${esc(t)}</h2><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <div class="stack learn">${body.split("\n\n").map(x=>`<p>${esc(x).replace(/\n/g,"<br>")}</p>`).join("")}</div>`;
}
/* Ventana de ayuno: hora de cada comida */
function mealHours(p,n){
  if(!p.ayuno||!p.ayuno.on)return null;
  const [h,m]=(p.ayuno.ini||"13:00").split(":").map(Number);const start=h*60+m;const len=(p.ayuno.h||8)*60;
  return Array.from({length:n},(_,i)=>{const t=start+(n===1?0:Math.round(i*(len-30)/(n-1)));return pad(Math.floor(t/60)%24)+":"+pad(t%60);});
}
function ayunoTxt(p){if(!p.ayuno||!p.ayuno.on)return "";const [h,m]=(p.ayuno.ini||"13:00").split(":").map(Number);const e=h*60+m+(p.ayuno.h||8)*60;return `Ventana ${p.ayuno.ini||"13:00"}–${pad(Math.floor(e/60)%24)}:${pad(e%60)}`;}
function menuCfg(p){return [p.dietaEstilo,p.reparto,p.recarga,p.comidas,(p.plan||[]).join(",")].join("|");}
