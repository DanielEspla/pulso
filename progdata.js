/* ===== Programas por disciplina: ejercicios, sesiones por nivel y marcas de referencia ===== */
Object.assign(MUSCLES,{cardio:"Cardio y resistencia",fascia:"Fascias y movilidad",cuerpo:"Cuerpo completo"});
Object.assign(PATTERNS,{carrera:"Carrera y ergómetros",carga:"Cargas y arrastres",pot:"Potencia y acondicionamiento",cali:"Calistenia",equil:"Equilibrio y rotación",fascia:"Fascias"});
Object.assign(REPS,{m:[20,100]});Object.assign(REST,{m:90});
const PROG_EX=[];
/* id,nombre,patrón,músculo,unidad(rep),incremento kg,estrés articular,pistas|separadas|por barra,error típico */
function PE(id,name,pat,prim,rep,inc,st,cues,err){
  if(EXM[id])return;
  const s={};(st||"").split(" ").filter(Boolean).forEach(x=>{s[x[0]]=+x[1];});
  const e={id,name,pat,prim,sec:[],req:[""],st:s,C:false,S:false,B:true,rep,cues:cues.split("|"),err,inc:inc,imported:true,prog:true};
  EX.push(e);EXM[id]=e;PROG_EX.push(id);
}
/* ---- Hyrox y carrera ---- */
PE("carrera_z2","Carrera suave (ritmo de charla)","carrera","cardio","m",0,"r1","Debes poder hablar frases enteras|Zancada corta y relajada, hombros sueltos|Si te falta el aire, camina un minuto y sigue","Ir demasiado rápido y convertir lo suave en un esfuerzo duro");
PE("carrera_int","Series de carrera (ritmo de 5-10 km)","carrera","cardio","m",0,"r1 k1","Calienta con 10 minutos suaves antes|Rápido pero controlado: la última serie igual que la primera|Descansa trotando o andando entre series","Salir demasiado fuerte y no poder acabar las series");
PE("carrera_tempo","Carrera a ritmo umbral","carrera","cardio","m",0,"r1 k1","Ritmo duro pero sostenible: frases de pocas palabras|Mantén el mismo ritmo de principio a fin|Termina con un trote suave de 5 minutos","Empezar demasiado rápido y desmoronarte al final");
PE("skierg","SkiErg","carrera","cardio","m",0,"h1 l1","Empieza con los brazos arriba y bisagra de cadera|Tira con dorsales y cadera, no solo con los brazos|Ritmo constante, respiración rítmica","Tirar solo de brazos y agotar los hombros");
PE("remo_erg","Remo en ergómetro","carrera","cardio","m",0,"l1 r1","Orden de la remada: piernas, tronco, brazos; y al volver, al revés|Espalda recta, sin encorvar al final del tirón|Cadencia de 24-28 paladas por minuto","Tirar con los brazos antes de empujar con las piernas");
PE("sled_push","Empuje de trineo (sled push)","carga","cuerpo","m",5,"r1 k1","Tronco inclinado y brazos estirados, manos altas|Pasos cortos y potentes, sin parar|Empieza con poco peso: es muy duro con las piernas cansadas","Subir las caderas y empujar con la espalda");
PE("sled_pull","Arrastre de trineo (sled pull)","carga","cuerpo","m",5,"h1 l1","Sentado o en cuclillas, tira de la cuerda mano sobre mano|Espalda recta, pecho alto|Mira al frente y mantén el ritmo","Tirar solo con la espalda baja");
PE("farmers","Paseo del granjero (farmer's carry)","carga","cuerpo","m",2,"m1 l1","Hombros abajo y atrás, pecho alto|Pasos cortos y rápidos, sin balancear|Agarre firme: es el límite de muchos atletas","Inclinarse hacia un lado con una carga desigual");
PE("sandbag_lunge","Zancadas con saco","zancada","cuadriceps","m",2.5,"r1 k1","Saco sobre los hombros o en brazos, tronco alto|La rodilla trasera roza el suelo sin golpear|Zancada larga y regular","Zancadas cortas que cargan la rodilla");
PE("wall_ball","Wall ball (lanzamiento a la pared)","pot","cuerpo","a",1,"r1 h1","Sentadilla profunda con el balón al pecho|Sube explosivo y lanza a la marca|Recibe el balón ya bajando a la siguiente sentadilla","Lanzar solo con los brazos sin usar las piernas");
PE("burpee_bj","Burpee con salto largo","pot","cuerpo","m",0,"h1 m1 l1","Pecho al suelo, levántate y salta hacia delante con las dos piernas|Aterriza suave y encadena|Ritmo sostenible: son 80 metros","Salir a tope y quedarte sin aire a mitad");
/* ---- CrossFit ---- */
PE("thruster","Thruster (sentadilla frontal + press)","pot","cuerpo","h",2.5,"r1 h1 m1","Barra en la clavícula, codos altos|Sube de la sentadilla y empuja la barra de un solo movimiento|Termina con la barra sobre las orejas y los brazos estirados","Parar entre la sentadilla y el press");
PE("power_clean","Cargada de potencia (power clean)","pot","cuerpo","f",2.5,"l1 m1 r1","Empieza como un peso muerto, barra pegada al cuerpo|Extiende cadera con fuerza y encoge los hombros|Recibe la barra en la clavícula con los codos adelante","Tirar con los brazos antes de extender la cadera");
PE("box_jump","Salto al cajón","pot","cuadriceps","r",0,"r1 k1","Balancea los brazos y salta con las dos piernas|Aterriza suave con las rodillas flexionadas|Baja andando para cuidar el tendón","Bajar de un salto y cargar los tobillos y el tendón de Aquiles");
PE("burpee","Burpee","pot","cuerpo","r",0,"h1 m1 l1","Pecho al suelo, salta y aplaude arriba|Ritmo regular, no a tope|Aterriza suave","Dejar caer la cadera y cargar la zona lumbar");
PE("toes_to_bar","Elevación de pies a la barra","core","abdomen","r",0,"h2 m1","Cuelga activo con los hombros hacia abajo|Balancea desde el hombro, sube los pies a la barra|Controla la bajada","Colgarte pasivo y hacer solo un balanceo sin fuerza");
PE("hspu","Flexión en pino contra la pared","empuje_v","hombro_ant","r",0,"h2 m2","Barriga hacia la pared, manos a un palmo|Baja hasta tocar con la cabeza|Empuja sin arquear la espalda","Arquear la zona lumbar para compensar");
PE("comba","Comba","carrera","cardio","s",0,"r1","Muñecas, no brazos|Salta bajo, aterriza en la parte delantera del pie|Respiración constante","Saltar demasiado alto y cansarte pronto");
/* ---- Calistenia ---- */
PE("flex_inclinada","Flexión inclinada (manos elevadas)","empuje_h","pecho","r",0,"h1 m1","Manos en un banco o barra, cuerpo en bloque|Pecho a la barra, codos a 45°|Cuanto más alto el apoyo, más fácil","Dejar caer la cadera");
PE("flex_arquero","Flexión arquero","empuje_h","pecho","r",0,"h2 c1 m1","Manos muy abiertas, baja hacia un lado|El brazo contrario queda estirado|Alterna lados y controla el recorrido","Bajar sin control y forzar el codo");
PE("flex_pike","Flexión pike","empuje_v","hombro_ant","r",0,"h1 m1","Cadera arriba formando una V invertida|Baja la cabeza entre las manos|Empuja hasta estirar los brazos","Dejar la cadera baja y convertirlo en una flexión normal");
PE("flex_pseudoplanche","Flexión pseudo-planche","empuje_h","pecho","r",0,"h2 m2 c1","Manos junto a la cadera, dedos hacia atrás|Inclínate hacia delante cargando los hombros|Baja y sube sin perder la inclinación","Muñecas sin calentar: haz antes movilidad de muñeca");
PE("dom_negativa","Dominada negativa (bajada lenta)","tiron_v","dorsal","r",0,"h1 c1","Sube con un salto o una silla hasta la barbilla|Baja en 4-5 segundos hasta los brazos estirados|Hombros activos, lejos de las orejas","Bajar de golpe sin controlar");
PE("dom_arquero","Dominada arquero","tiron_v","dorsal","r",0,"h2 c2","Agarre ancho, sube hacia una mano|El otro brazo queda casi estirado|Alterna lados","Hacerlo antes de dominar la dominada estricta");
PE("sentadilla_aire","Sentadilla al aire","sentadilla","cuadriceps","r",0,"r1","Pies al ancho de hombros, baja con el pecho alto|Talones pegados al suelo|Rodillas hacia donde apuntan los pies","Despegar los talones o meter las rodillas hacia dentro");
PE("pistol_asistida","Pistol asistida (a una pierna con apoyo)","sentadilla","cuadriceps","r",0,"r2 k1","Agárrate a una anilla o un poste|Baja controlando con la pierna libre estirada|Sube sin rebotar","Dejar caer el cuerpo al final del recorrido");
PE("pistol","Pistol (sentadilla a una pierna)","sentadilla","cuadriceps","r",0,"r2 k2","Brazos adelante para el equilibrio|Baja profundo con la espalda recta|Sube sin impulsarte","Hacerlo con las rodillas o las caderas sin movilidad suficiente");
PE("hollow","Hollow hold","core","abdomen","s",0,"l1","Zona lumbar pegada al suelo|Brazos y piernas estirados, casi sin separarse del suelo|Respira sin soltar la tensión","Despegar la zona lumbar del suelo");
PE("l_sit","L-sit","core","abdomen","s",0,"h1 m2","Manos en el suelo o paralelas, brazos estirados|Piernas estiradas al frente, empuja el suelo|Empieza con las rodillas dobladas","Hundir los hombros hacia las orejas");
PE("pino_pared","Parada de manos contra la pared","empuje_v","hombro_ant","s",0,"h2 m2","Manos a 15 cm de la pared, cuerpo en línea|Empuja el suelo, hombros hacia las orejas|Mira entre las manos","Arquear la zona lumbar");
PE("planche_lean","Planche lean","empuje_h","hombro_ant","s",0,"h2 m2 c1","Posición de flexión, inclina los hombros por delante de las manos|Brazos estirados y espalda redonda hacia arriba|Aumenta la inclinación poco a poco","Forzar la muñeca sin haberla preparado");
PE("front_lever_tuck","Front lever en tuck","tiron_v","dorsal","s",0,"h2 c1","Cuelga con los brazos estirados|Sube la cadera hasta la altura de los hombros con las rodillas pegadas al pecho|Dorsales y abdomen apretados","Doblar los codos o dejar caer la cadera");
/* ---- Paddle surf (SUP) ---- */
PE("remada_banda","Remada rotacional con banda","equil","dorsal","a",0,"h1 l1","Banda anclada a la altura del hombro, de lado|Estira los brazos y rota el tronco hacia atrás como en una palada|Cadera y hombros giran juntos","Tirar solo con los brazos sin rotar el tronco");
PE("remo_pierna","Remo a una mano sobre una pierna","equil","espalda_media","h",1,"l1 k1","Apoya una pierna, tronco paralelo al suelo|Tira del codo hacia la cadera|Cadera nivelada, sin girar","Girar el tronco y perder el equilibrio");
PE("pm_una_pierna","Peso muerto a una pierna","equil","isquios","h",2,"l1 k1","Cadera hacia atrás, pierna libre extendida|Espalda neutra, cadera nivelada|Mira un punto fijo para equilibrarte","Redondear la espalda o abrir la cadera");
PE("plancha_rotacion","Plancha con rotación","equil","abdomen","r",0,"h1 m1","Desde la plancha alta, abre un brazo al techo|Sigue la mano con la mirada|Cadera estable, sin balancearse","Mover las caderas en vez de rotar el tronco");
PE("tandem","Equilibrio en tándem (descalzo)","equil","gemelo","s",0,"","Un pie delante del otro, brazos cruzados|Mira al frente, pie y tobillo activos|Progresa con los ojos cerrados","Mirar al suelo y mover los brazos");
PE("dorsiflexion","Dorsiflexión con banda","equil","gemelo","a",0,"","Sentado, banda en el empeine anclada delante|Tira de la punta del pie hacia la espinilla|Vuelve lento","Mover la pierna entera en vez del tobillo");
PE("turkish_getup","Turkish get-up","equil","cuerpo","r",2,"h1 l1","Mira el peso en todo momento|Sube en pasos: codo, mano, cadera, rodilla, de pie|Baja repitiendo los pasos al revés","Ir deprisa y perder el control del peso");
/* ---- Fascias (Fascial Fitness: Schleip y Müller) ---- */
PE("fas_rodillo_pie","Rodillo o pelota bajo el pie","fascia","fascia","s",0,"","Pelota dura bajo la planta, peso suave|Rueda despacio de talón a dedos|Respira y relaja cuando encuentres un punto sensible","Apretar de más hasta sentir dolor");
PE("fas_rodillo_espalda","Rodillo en espalda y dorsal","fascia","fascia","s",0,"l1","Rodillo bajo la espalda alta, brazos cruzados|Rueda despacio sin pasar a la zona lumbar|Pausa donde notes tensión y respira","Rodar sobre la zona lumbar");
PE("fas_rodillo_pierna","Rodillo en muslo y banda lateral","fascia","fascia","s",0,"k1","Rodillo bajo el muslo, apoyo en antebrazos|Rueda despacio de cadera a rodilla|Cambia de cara frontal, lateral y posterior","Hacerlo deprisa y con mucho dolor");
PE("fas_pelota_gluteo","Pelota en el glúteo","fascia","fascia","s",0,"k1","Sentado sobre la pelota, tobillo sobre la rodilla contraria|Pequeños movimientos hasta encontrar un punto tenso|Respira y deja que ceda","Mantener un dolor agudo");
PE("fas_cadena_lateral","Arco lateral (cadena lateral)","fascia","fascia","s",0,"l1","De pie o sentado, brazo por encima de la cabeza|Inclínate hacia un lado alargando todo el costado, de la cadera a la mano|Respira hacia el costado estirado","Doblarte hacia delante en vez de al lado");
PE("fas_cadena_frontal","Zancada larga con brazos arriba (cadena frontal)","fascia","fascia","s",0,"r1 k1","Zancada profunda, rodilla trasera apoyada|Brazos arriba y hacia atrás, mira al frente|Alarga la parte delantera de la cadera","Arquear la zona lumbar");
PE("fas_cadena_posterior","Pliegue largo con rotación (cadena posterior)","fascia","fascia","s",0,"l1","De pie, pliégate con las rodillas algo dobladas|Rota el tronco abriendo un brazo al techo|Alarga hacia el talón, no solo hacia el suelo","Forzar con las rodillas bloqueadas");
PE("fas_espiral","Estiramiento en espiral","fascia","fascia","s",0,"l1","Sentado, cruza una pierna y rota el tronco hacia ella|Alarga la columna antes de girar|Respira sin empujar","Girar solo la cabeza o los hombros");
PE("fas_gato","Gato-camello con ondulación","fascia","fascia","s",0,"","A cuatro apoyos, mueve la columna vértebra a vértebra|Añade ondas laterales y circulares|Movimiento lento, respirando","Hacerlo rápido y por bloques");
PE("fas_ninja","Movimiento lento en todas direcciones","fascia","fascia","s",0,"","Movimientos suaves, como un ninja: sin ruido|Gira, inclina y alarga en distintos planos|El objetivo es notar el cuerpo, no llegar lejos","Forzar el rango en lugar de explorarlo");
PE("fas_respiracion","Respiración costal de 360°","fascia","fascia","s",0,"","Manos en las costillas laterales|Inspira expandiendo costillas y espalda baja|Espira lento y vacía del todo","Respirar solo con el pecho y elevar los hombros");
PE("fas_rebote","Rebotes elásticos (pogo)","fascia","fascia","s",0,"r1","Saltitos cortos sobre el antepié, rodillas casi estiradas|Suena suave: como un canguro|Empieza con 10-15 segundos y escucha el tendón","Saltar muy alto y cargar el tendón de Aquiles");
PE("fas_swing","Balanceo elástico con kettlebell ligera","fascia","fascia","r",2,"l1","Pliégate de cadera y deja que el peso suba solo por el impulso|Elástico, sin forzar los brazos|Respira rítmicamente","Convertirlo en una sentadilla o forzar con los brazos");
PE("fas_ola","Ola de columna de pie","fascia","fascia","r",0,"l1","Desciende vértebra a vértebra desde la cabeza|Sube vértebra a vértebra desde la cadera|Rodillas flojas, respiración continua","Bajar de golpe como un fardo");

/* ---- Cómo se describe cada programa ---- */
const PROGS={
  hyrox:{n:"Hyrox",lema:"Correr y trabajar con carga, una y otra vez",
    need:"Cinta o pista, SkiErg, remo, trineo, kettlebells, saco y balón medicinal. Si no tienes algo, usa Cambiar por una alternativa.",
    ev:"No hay estudios que prueben un plan Hyrox concreto. Se basa en principios de entrenamiento concurrente: correr es más de la mitad del tiempo de carrera, así que los programas reparten unos 60 % de carrera y 40 % de estaciones y fuerza.",
    lv:["Base: 4 días","Medio: 5 días","Avanzado: 6 días"]},
  crossfit:{n:"CrossFit",lema:"Fuerza, gimnásticos y trabajo intenso variado",
    need:"Barra con discos, kettlebell, anillas o barra de dominadas y cajón. Escala siempre primero la carga y luego el movimiento.",
    ev:"Los niveles de dificultad vienen de las escalas que usa el propio CrossFit (Rx, intermedio, principiante). No hay un ensayo que compare el método con otros.",
    lv:["Base: 3 días","Medio: 4 días","Avanzado: 5 días"]},
  calistenia:{n:"Calistenia",lema:"Dominar tu propio cuerpo con progresiones",
    need:"Barra de dominadas, paralelas o suelo, anillas si tienes. Se avanza con variantes más difíciles, no solo con más repeticiones.",
    ev:"Un ensayo con 28 hombres sin entrenar mostró mejoras en flexiones y dominadas tras 8 semanas de calistenia. Las progresiones son consenso de la práctica, no un protocolo validado.",
    lv:["Base: 3 días","Medio: 4 días","Avanzado: 5 días"]},
  sup:{n:"Paddle surf",lema:"Fuerza útil para remar, girar y mantener el equilibrio",
    need:"Banda elástica, una mancuerna o kettlebell y un poco de espacio. Mejor descalzo para los pies.",
    ev:"Los estudios de remada de pie muestran activación de la zona lumbar y del abdomen a un esfuerzo moderado, y de los oblicuos solo a esfuerzo alto. Los ejercicios vienen de guías de preparación de ACE y REI, no de un ensayo propio.",
    lv:["Base: 3 días","Medio: 3 días + agua","Avanzado: 4 días"]},
  fascias:{n:"Fascias de todo el cuerpo",lema:"Tejido conectivo elástico, resistente y bien coordinado",
    need:"Esterilla, rodillo, una pelota dura y, en niveles altos, una kettlebell ligera. Sesiones cortas, constantes y sin dolor.",
    ev:"Hay evidencia buena o moderada para el rebote elástico y el trabajo de propiocepción, pero no está demostrado que el conjunto de un programa fascial rinda más por sí solo. Los autores del método (Schleip y Müller) proponen 1-2 sesiones por semana y esperan resultados entre 6 y 24 meses. El rodillo no perjudica el rendimiento.",
    lv:["Nivel 1: despertar (hasta 3 meses)","Nivel 2: elástico (3 a 9 meses)","Nivel 3: resistente (desde 9 meses)"]}
};

/* ---- Sesiones por nivel. Formato de cada ejercicio: id:series:mín-máx:descanso(s). Unidad según el ejercicio ---- */
const PROG_SES={
hyrox:[
 [ /* Base */
  ["Carrera suave y fuerza base",["carrera_z2:1:3000-5000:0","sentadilla_goblet:3:8-12:90","peso_muerto_rumano_mancuernas:3:8-12:90","remo_mancuerna:3:8-12:75","plancha:3:30-45:45"]],
  ["Estaciones con técnica (suave)",["skierg:3:250-500:90","sled_push:4:20-30:90","farmers:3:40-60:75","wall_ball:3:10-20:75","burpee_bj:3:20-40:90"]],
  ["Series de carrera",["carrera_int:5:400-600:90","zancada_caminando:3:10-14:75","swing_kettlebell:3:12-15:60"]],
  ["Mini simulación",["carrera_z2:4:500-800:60","sled_pull:3:20-30:90","remo_erg:3:250-500:90","sandbag_lunge:3:20-30:75","wall_ball:3:15-25:75"]]],
 [ /* Medio */
  ["Piernas fuertes y trineo",["sentadilla:4:5-8:150","peso_muerto_rumano:3:6-10:120","sled_push:5:25-40:120","sled_pull:4:25-40:120","farmers:3:60-100:90"]],
  ["Carrera a umbral",["carrera_tempo:1:3000-5000:0","plancha:3:45-60:45","pallof:3:10-12:60"]],
  ["Estaciones bajo fatiga",["skierg:4:500-750:90","burpee_bj:4:40-60:90","sandbag_lunge:4:40-50:90","wall_ball:4:20-30:75","remo_erg:4:500-750:90"]],
  ["Series de carrera",["carrera_int:6:600-1000:90","swing_kettlebell:4:15-20:60","zancada_caminando:3:12-16:75"]],
  ["Simulación de carrera",["carrera_int:4:1000-1000:60","skierg:2:500-1000:60","sled_push:2:25-50:60","burpee_bj:2:40-80:60","wall_ball:2:25-50:60"]]],
 [ /* Avanzado */
  ["Fuerza y trineo pesado",["sentadilla:5:3-6:180","peso_muerto:4:3-5:180","sled_push:6:25-50:120","sled_pull:5:25-50:120","farmers:4:80-120:90"]],
  ["Carrera a umbral largo",["carrera_tempo:1:5000-8000:0","plancha:3:60-90:45","pallof:3:12-15:60"]],
  ["Estaciones en serie",["skierg:5:750-1000:90","burpee_bj:5:60-80:90","sandbag_lunge:5:50-100:90","wall_ball:5:25-40:75","remo_erg:5:750-1000:90"]],
  ["Series largas de carrera",["carrera_int:8:800-1200:75","swing_kettlebell:4:15-20:60","zancada_caminando:4:12-16:75"]],
  ["Simulación completa",["carrera_int:8:1000-1000:45","skierg:1:1000-1000:45","sled_push:1:50-50:45","sled_pull:1:50-50:45","burpee_bj:1:80-80:45","remo_erg:1:1000-1000:45","farmers:1:200-200:45","sandbag_lunge:1:100-100:45","wall_ball:1:100-100:45"]],
  ["Carrera larga fácil",["carrera_z2:1:8000-12000:0","hiperextension:3:10-15:60"]]]
],
crossfit:[
 [ /* Base */
  ["Fuerza y gimnásticos",["sentadilla:4:5-8:150","press_militar:3:6-10:120","remo_invertido:3:8-12:75","plancha:3:30-45:45"]],
  ["Acondicionamiento mixto",["swing_kettlebell:4:15-20:60","sentadilla_aire:4:15-20:45","flex_inclinada:4:8-12:45","remo_erg:4:250-500:90"]],
  ["Potencia técnica",["power_clean:5:3-5:120","thruster:4:8-10:90","box_jump:4:5-8:60","hollow:3:20-30:45"]]],
 [ /* Medio */
  ["Fuerza y empuje",["sentadilla:5:3-5:180","press_militar:4:5-6:150","dominadas:4:5-8:120","hspu:3:3-6:90"]],
  ["Acondicionamiento",["thruster:5:10-12:90","swing_kettlebell:4:15-20:60","burpee:4:10-15:60","remo_erg:4:500-750:90"]],
  ["Halterofilia y gimnásticos",["power_clean:5:3-4:120","dominadas:4:6-10:90","toes_to_bar:4:6-10:60","box_jump:4:6-8:60"]],
  ["Peso muerto y resistencia",["peso_muerto:5:3-5:180","wall_ball:4:20-25:75","comba:4:60-90:45","plancha:3:45-60:45"]]],
 [ /* Avanzado */
  ["Fuerza máxima",["sentadilla:6:2-4:210","peso_muerto:5:2-4:210","press_militar:5:3-5:150","dominadas:5:8-12:120"]],
  ["Metcon pesado",["thruster:6:10-15:75","power_clean:5:3-5:120","burpee:5:15-20:60","remo_erg:5:500-1000:90"]],
  ["Gimnásticos y habilidad",["hspu:5:5-10:90","toes_to_bar:5:10-15:60","dominadas:5:10-15:75","pino_pared:4:30-60:60"]],
  ["Resistencia mixta",["swing_kettlebell:5:20-25:60","box_jump:5:8-10:60","wall_ball:5:25-40:75","comba:5:90-120:45"]],
  ["Halterofilia",["power_clean:6:2-3:120","thruster:5:5-8:120","sentadilla_frontal:5:3-5:150","hollow:4:30-45:45"]]]
],
calistenia:[
 [ /* Base */
  ["Empuje y core",["flex_inclinada:4:8-15:75","fondos_banco:3:8-12:75","plancha:3:30-60:45","hollow:3:15-25:45"]],
  ["Tirón y piernas",["remo_invertido:4:6-12:75","dom_negativa:3:3-6:90","sentadilla_aire:4:12-20:60","zancadas_corporal:3:10-12:60"]],
  ["Cuerpo completo",["flex_inclinada:3:8-15:75","remo_invertido:3:8-12:75","sentadilla_aire:3:15-20:60","plancha:3:45-60:45"]]],
 [ /* Medio */
  ["Empuje",["flexiones:4:10-20:75","fondos:4:6-10:90","flex_pike:3:6-10:75","hollow:3:25-40:45"]],
  ["Tirón",["dominadas:4:4-8:120","remo_invertido:4:10-15:75","dom_negativa:3:4-6:90","l_sit:4:10-20:60"]],
  ["Piernas y core",["bulgara:4:8-12:90","sentadilla_aire:3:20-30:60","pistol_asistida:3:4-6:90","elev_piernas_colgado:3:8-12:60"]],
  ["Habilidad",["pino_pared:5:20-40:60","planche_lean:5:10-20:60","front_lever_tuck:5:8-15:60","flex_arquero:3:5-8:90"]]],
 [ /* Avanzado */
  ["Empuje y planche",["flex_pseudoplanche:5:6-10:90","fondos:5:8-12:90","hspu:4:4-8:120","planche_lean:5:15-30:60"]],
  ["Tirón y lever",["dominadas:5:8-12:120","dom_arquero:4:3-6:120","front_lever_tuck:5:10-20:60","toes_to_bar:4:8-12:75"]],
  ["Piernas",["pistol:4:3-6:120","bulgara:4:10-12:90","step_up:4:10-12:75","gemelo_pie:4:15-20:60"]],
  ["Cuerpo completo y habilidad",["pino_pared:5:30-60:60","l_sit:5:15-30:60","flex_arquero:4:6-10:90","dom_negativa:4:4-6:90"]],
  ["Volumen y core",["dominadas:4:8-12:90","flexiones:4:20-30:75","hollow:4:30-45:45","elev_piernas_colgado:4:10-15:60"]]]
],
sup:[
 [ /* Base */
  ["Piernas, tronco y equilibrio",["tandem:3:30-60:30","dorsiflexion:3:12-15:45","sentadilla_goblet:3:10-12:75","plancha:3:30-45:45","pm_una_pierna:3:8-10:75"]],
  ["Tirón y rotación",["remada_banda:3:12-15:60","remo_mancuerna:3:10-12:75","pallof:3:10-12:60","face_pull:3:12-15:60"]],
  ["Cardio suave",["carrera_z2:1:2500-4000:0","plancha_rotacion:3:8-12:45"]]],
 [ /* Medio */
  ["Fuerza de piernas y cadera",["sentadilla:4:6-10:120","peso_muerto_rumano:4:6-10:120","pm_una_pierna:3:8-10:75","zancada_atras:3:8-10:75"]],
  ["Tirón, rotación y hombro",["remo_pierna:4:8-10:75","remada_banda:4:12-15:60","press_hombro_mancuernas:3:8-12:90","plancha_rotacion:3:10-14:45"]],
  ["Equilibrio y acondicionamiento",["turkish_getup:3:3-5:90","tandem:3:45-60:30","remo_erg:3:500-1000:90","swing_kettlebell:3:15-20:60"]]],
 [ /* Avanzado */
  ["Fuerza máxima de piernas",["sentadilla:5:4-6:150","peso_muerto:4:4-6:150","bulgara:3:8-10:90","pm_una_pierna:3:8-12:75"]],
  ["Tirón y potencia de rotación",["remo_pierna:4:8-12:75","remada_banda:5:12-15:60","dominadas:4:6-10:90","pallof:4:10-12:60"]],
  ["Hombro y core",["press_hombro_mancuernas:4:8-12:90","plancha_rotacion:4:12-16:45","turkish_getup:4:3-5:90","face_pull:3:12-15:60"]],
  ["Resistencia de remada",["remo_erg:5:500-1000:75","skierg:4:500-750:75","carrera_z2:1:3000-5000:0"]]]
],
fascias:[
 [ /* Nivel 1: despertar */
  ["Despertar el cuerpo",["fas_respiracion:2:45-60:20","fas_rodillo_pie:2:45-60:15","fas_rodillo_pierna:2:45-60:15","fas_gato:2:45-60:20","fas_cadena_lateral:2:30-45:20"]],
  ["Cadenas largas",["fas_cadena_frontal:2:30-45:20","fas_cadena_posterior:2:30-45:20","fas_espiral:2:30-45:20","fas_ninja:2:60-90:20"]]],
 [ /* Nivel 2: elástico */
  ["Rebote y elasticidad",["fas_rodillo_pie:1:30-45:15","fas_rebote:3:10-20:45","fas_swing:3:12-15:60","fas_ola:3:6-8:30","fas_cadena_frontal:2:45-60:20"]],
  ["Cadenas largas y propiocepción",["fas_rodillo_espalda:2:45-60:15","fas_cadena_lateral:2:45-60:20","fas_cadena_posterior:2:45-60:20","fas_espiral:2:45-60:20","fas_ninja:2:90-120:20"]],
  ["Fuerza elástica",["fas_pelota_gluteo:2:45-60:15","fas_swing:3:15-20:60","fas_rebote:3:15-25:45","plancha:3:30-45:45"]]],
 [ /* Nivel 3: resistente */
  ["Elástico y potente",["fas_rebote:4:20-30:45","fas_swing:4:15-20:60","box_jump:3:5-6:60","fas_ola:3:8-10:30","fas_cadena_frontal:2:60-75:20"]],
  ["Cadenas con carga",["turkish_getup:3:3-5:90","fas_cadena_posterior:2:60-75:20","fas_cadena_lateral:2:60-75:20","fas_espiral:2:60-75:20","fas_gato:2:60-90:20"]],
  ["Integración",["fas_pelota_gluteo:1:45-60:15","fas_rodillo_espalda:1:45-60:15","fas_swing:3:15-20:60","fas_rebote:3:20-30:45","fas_ninja:2:120-180:20"]]]
]};
