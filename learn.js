/* ===== Grupos de alimentos y contenido divulgativo ===== */
const SLOGAN=NUTRI?"Aprende a comer. Vive más y mejor.":"Entrena con cabeza. Vive más y mejor.";
const GROUPS=[
  {k:"prot",t:"Proteínas",col:"var(--prot)",cats:["aves","vacuno","cerdo","otras","fiambres","pescado","marisco","huevos","vegprot"],
   d:"Construyen y reparan músculo, órganos, hormonas y defensas. Son lo que más sacia. En cada comida principal hay una, y la app fija su cantidad para proteger tu músculo mientras pierdes grasa."},
  {k:"lact",t:"Lácteos",col:"var(--prot)",cats:["lacteos","quesos"],
   d:"Proteína de calidad y calcio para huesos y músculos. Los yogures proteicos y el queso batido funcionan casi como una proteína; los quesos curados aportan sobre todo grasa, por eso van en raciones pequeñas."},
  {k:"hc",t:"Hidratos",col:"var(--carb)",cats:["legumbres","cereales","tuberculos","pan"],
   d:"Son el combustible del músculo y del cerebro. Se guardan en el músculo como glucógeno y dan energía para entrenar. Es el grupo que la app sube o baja cuando hay que ajustar calorías."},
  {k:"veg",t:"Verdura y fruta",col:"var(--ok)",cats:["verduras","frutas"],
   d:"Fibra, agua, vitaminas, minerales y antioxidantes con muy pocas calorías. Llenan el plato, alimentan la flora intestinal y ayudan a controlar el hambre. Van fijas en cada comida y no se recortan."},
  {k:"gras",t:"Grasas",col:"var(--fat)",cats:["secos","grasas"],
   d:"Imprescindibles para fabricar hormonas, absorber las vitaminas A, D, E y K y cuidar el corazón. Son muy calóricas (9 kcal por gramo), así que se pesan siempre. La base es el aceite de oliva virgen extra."},
  {k:"dul",t:"Caprichos",col:"var(--muted)",cats:["dulce"],
   d:"No hay alimentos prohibidos. Un poco de chocolate negro cabe en tu día si está contado. Para comidas libres de verdad usa el botón «Como fuera» en la dieta."}
];
const CAT_INFO={
  aves:"Pollo y pavo: la proteína más magra y versátil. La pechuga casi no tiene grasa; el contramuslo es más jugoso y algo más graso.",
  vacuno:"Hierro de fácil absorción, zinc y vitamina B12. Elige piezas magras para el día a día; las piezas con más grasa, de vez en cuando.",
  cerdo:"El lomo y el solomillo son tan magros como el pollo. El secreto, la panceta o las costillas aportan mucha grasa: la app reduce el aceite ese día para compensar.",
  otras:"Conejo, cordero e hígado. El hígado es de lo más rico en hierro y vitamina A, pero basta con tomarlo de vez en cuando.",
  fiambres:"Prácticos para desayunos y meriendas. Mejor los que tienen un porcentaje alto de carne y poca sal.",
  pescado:"El pescado azul (salmón, sardina, caballa) aporta omega 3, que ayuda al corazón y a reducir la inflamación. El blanco es casi pura proteína.",
  marisco:"Mucha proteína, casi nada de grasa, y yodo, zinc y hierro. Muy útil cuando tienes pocas calorías disponibles.",
  huevos:"Proteína completa, colina y vitaminas. Comer huevo a diario es compatible con un colesterol sano en la mayoría de personas.",
  lacteos:"Calcio, proteína y probióticos (yogur, kéfir). Los proteicos sacian mucho con pocas calorías.",
  quesos:"Calcio y proteína, pero con bastante grasa y sal. El queso fresco 0 % sirve como proteína; el curado, como grasa.",
  vegprot:"Alternativas sin carne. El tofu y el tempeh salen de la soja y tienen proteína completa; el seitán es gluten de trigo.",
  legumbres:"Hidrato y proteína a la vez, con mucha fibra. Bajan el colesterol y dan saciedad larga. De bote están listas en un minuto.",
  cereales:"Arroz, pasta y cereales: energía para entrenar. Se pesan en crudo porque cocidos pesan entre dos y tres veces más.",
  tuberculos:"Patata y boniato llenan mucho por pocas calorías. Cocidas y enfriadas generan almidón resistente, que alimenta la flora intestinal.",
  pan:"Pan y cereales de desayuno. El integral y la avena tienen más fibra y dan energía más estable.",
  verduras:"La base del plato: volumen, fibra y micronutrientes casi sin calorías. Cuanta más variedad de colores, mejor.",
  frutas:"Vitaminas, fibra y azúcar natural acompañado de agua y fibra, que no se comporta como el azúcar añadido.",
  secos:"Grasas buenas, fibra y minerales. Un puñado (20-30 g) protege el corazón, pero sin pesar es muy fácil pasarse.",
  grasas:"El aceite de oliva virgen extra es la grasa con más respaldo científico. Pésalo: una cucharada son unos 10 g y 90 kcal.",
  dulce:"El chocolate negro de 85 % tiene poco azúcar y aporta polifenoles. Raciones pequeñas."
};
function groupOfCat(c){return GROUPS.find(g=>g.cats.includes(c));}

function viewAprende(){
  const card=(t,body)=>`<div class="card stack"><h2>${t}</h2>${body}</div>`;
  const P_=s=>`<p>${s}</p>`;
  return `<div class="head"><div><h1>Por qué Afina</h1><p class="sub">${SLOGAN}</p></div>${!P()?`<button class="btn" data-a="closeLearn">Volver</button>`:""}</div>
  <div class="stack learn">
  <div class="card stack" style="background:var(--accent-soft);border-color:transparent">
    <span class="lbl" style="color:var(--accent)">El objetivo</span>
    <p class="lead">El objetivo de Afina es la recomposición corporal: menos grasa y el mismo o más músculo. Afina no es una dieta de castigo. Sirve para aprender a comer bien, entender qué pasa dentro de tu cuerpo y conseguir un cuerpo más sano que te dure muchos años. Sin pasar hambre y sin prohibiciones.</p>
    <p>Perder grasa es solo la primera parte. Lo que de verdad alarga la vida es mantener el músculo, tener poca grasa abdominal y saber comer sin depender de nadie. Cuando termines, deberías poder hacerlo sin la app.</p>
  </div>

  <h2 style="margin-top:8px">Cómo funciona tu cuerpo</h2>
  ${card("1. La energía: lo que entra y lo que gastas",
    P_("Tu cuerpo gasta energía todo el día, aunque estés quieto. Ese gasto se reparte, más o menos, así:")+
    `<div class="split">${[["60-70 %","Metabolismo basal","Mantenerte vivo: corazón, cerebro, respiración, temperatura."],["15-30 %","Movimiento diario","Andar, subir escaleras, estar de pie. Los pasos cuentan más de lo que parece."],["5-10 %","Entrenamiento","El deporte en sí. Importa, pero menos que el movimiento diario."],["~10 %","Digestión","Digerir también gasta. La proteína es la que más."]].map(([n,t,d])=>`<div><b class="num">${n}</b><h3>${t}</h3><p class="small muted">${d}</p></div>`).join("")}</div>`+
    P_("Si comes un poco menos de lo que gastas, el cuerpo saca la diferencia de sus reservas, que son sobre todo grasa. Afina calcula tu gasto con la fórmula de Mifflin-St Jeor según tu sexo, edad, altura, peso y actividad. A las tres semanas lo corrige con tus datos reales, que son más fiables que cualquier fórmula."))}
  ${card("2. Por qué la báscula engaña",
    P_("El peso de un día puede variar 1 o 2 kg sin que hayas ganado ni perdido grasa. Influyen el agua, la sal, lo que has comido la víspera, el tránsito intestinal y, en las mujeres, el ciclo menstrual.")+
    P_("Además, cada gramo de glucógeno (el hidrato que guardas en el músculo) retiene unos 3 g de agua. Por eso una cena con más hidratos te «sube» peso al día siguiente sin que sea grasa.")+
    P_("La solución es pesarse cada mañana y fijarse en la <b>media de la semana</b>. Afina solo cambia tu dieta cuando la tendencia se repite dos semanas seguidas, nunca por un mal día."))}
  ${card("3. La proteína protege tu músculo",
    P_("Tu músculo se destruye y se reconstruye a diario. Si comes menos sin suficiente proteína ni entrenamiento de fuerza, una parte del peso que pierdes es músculo. Eso baja tu gasto diario, te deja más flácido y facilita el efecto rebote.")+
    P_("Por eso Afina calcula la proteína según tu masa magra y no la recorta nunca. Además, es lo que más sacia y lo que más energía cuesta digerir."))}
  ${card("4. Los hidratos son combustible, no el enemigo",
    P_("La glucosa es la gasolina del cerebro y del músculo cuando entrenas. Lo que sobra se guarda como glucógeno. Los hidratos con fibra (legumbres, integrales, patata, fruta) se absorben despacio y dan energía estable.")+
    P_("Como son el macronutriente del que más margen hay, Afina los usa para hacer los ajustes. Si pierdes demasiado rápido o rindes peor, sube hidratos. Si te estancas, los baja un escalón."))}
  ${card("5. Las grasas fabrican tus hormonas",
    P_("Sin grasa suficiente bajan las hormonas sexuales, empeora el ánimo y no absorbes bien las vitaminas A, D, E y K. Afina fija un mínimo que nunca recorta. Prioriza aceite de oliva, frutos secos, aguacate y pescado azul, porque son las grasas que protegen el corazón."))}
  ${card("6. Fibra y flora intestinal",
    P_("En tu intestino viven billones de bacterias que se alimentan de la fibra de verduras, fruta, legumbres e integrales. A cambio producen sustancias que reducen la inflamación, regulan el apetito y cuidan las defensas. Por eso cada comida principal lleva verdura y la fruta no se recorta. La referencia es comer entre 25 y 30 g de fibra al día."))}
  ${card("7. El cuerpo se adapta",
    P_("Tras semanas comiendo menos, el cuerpo ahorra energía: te mueves algo menos sin darte cuenta, tienes más hambre y el rendimiento puede bajar. No es un fallo, es supervivencia.")+
    P_("Afina lo tiene en cuenta de tres formas: hace recortes pequeños y solo cuando hacen falta, fija un mínimo de calorías que nunca rebasa y te propone una pausa en mantenimiento tras 8-12 semanas. Así se puede seguir sin quemarse."))}

  ${card("8. Cada deporte pide algo distinto",
    `<div class="split">${[["Fuerza","Gimnasio, calistenia. Más proteína (hasta 2,4 g por kg de masa magra perdiendo grasa) para construir y conservar músculo."],["Resistencia","Correr, bici, natación, paddle surf. Más hidratos, con un mínimo de 2,5 g por kg, para llenar el glucógeno. Algo menos de grasa."],["Híbridos","Triatlón, Hyrox, CrossFit. Lo más exigente de los dos mundos: proteína alta e hidratos de 3 g por kg o más."],["Mixtos y de equipo","Pádel, fútbol, artes marciales. Proteína alta e hidratos suficientes para sprints, saltos y partidos."]].map(([t,d])=>`<div><h3>${t}</h3><p class="small muted">${d}</p></div>`).join("")}</div>`+
    P_("Eliges un deporte principal, que marca tu base, y los que hagas además. Con tu semana tipo, cada día suma el gasto de lo que haces. Si activas el reparto, los días duros llevan más hidratos y los de descanso menos. Las calorías de la semana no cambian: solo se mueve la energía hacia cuando la necesitas."))}

  <h2 style="margin-top:8px">La base: comer mediterráneo</h2>
  ${card("Por qué la mediterránea es la base de todo",
    P_("De todas las formas de comer estudiadas, la mediterránea es la que más pruebas tiene a favor de vivir más y mejor. En el estudio PREDIMED, hecho en España con más de 7.000 personas, la mediterránea con aceite de oliva virgen extra o frutos secos redujo cerca de un 30 % los infartos, ictus y muertes cardiovasculares frente a una dieta baja en grasa.")+
    P_("No es un menú cerrado, es un patrón: aceite de oliva como grasa principal, verdura en comida y cena, fruta a diario, legumbre varias veces por semana, frutos secos, pescado, cereales integrales, más carne blanca que roja y poco procesado.")+
    P_("Por eso los cuatro estilos de Afina comparten esa base. Lo que cambia entre ellos es cuántos hidratos y cuánta grasa comes, no la calidad."))}
  ${card("Los cuatro estilos, sin marketing",
    P_("Con las mismas calorías y la misma proteína, los cuatro hacen perder la misma grasa. La diferencia está en lo fácil que te resulte cumplirlo y en cómo rindes entrenando.")+
    `<div class="split">${[["Mediterránea","Para casi todo","Salud, longevidad y recomposición. La más fácil de mantener años."],["Baja en hidratos","Para definir","Menos pan, arroz y pasta. Útil si las harinas te abren el apetito."],["Deportiva","Para rendir","Más hidratos para volumen, fuerza y deportes de resistencia."],["Cetogénica","Avanzada","Quita el hambre a algunas personas. Peor para ganar músculo y puede subir el colesterol LDL."]].map(([a,b,c])=>`<div><b>${a}</b><span class="small muted">${b}</span><p class="small">${c}</p></div>`).join("")}</div>`+
    P_("Afina te marca la recomendada para tu objetivo, pero eliges tú. Y tus gustos mandan: lo que marcas «No» nunca aparece en el menú."))}
  ${card("Tu nota mediterránea",
    P_("Cada semana, la pantalla de Dieta puntúa tu menú con las preguntas del cuestionario MEDAS del PREDIMED: aceite, verdura, fruta, legumbre, pescado, frutos secos, carne roja, dulces y sofrito. Te dice qué te falta para subir.")+
    P_("Si no comes pescado, esa pregunta no cuenta. Sin pescado pierdes la principal fuente de omega 3, así que la app mete nueces y semillas de lino o chía más a menudo."))}

  <h2 style="margin-top:8px">Cómo crece el músculo</h2>
  ${card("El estímulo: tensión cerca del fallo",
    P_("El músculo crece cuando sus fibras trabajan contra una carga alta durante varias repeticiones. Las últimas repeticiones de una serie dura son las que más estímulo dan, porque ahí trabajan todas las fibras a la vez.")+
    P_("Por eso Afina te pregunta cuántas repeticiones más podrías haber hecho (el RIR). Una serie a RIR 0-3 cuenta; una serie cómoda a RIR 6 casi no suma. No hace falta ir al fallo siempre: entre 1 y 3 en reserva se crece casi igual con mucha menos fatiga."))}
  ${card("Volumen: cuántas series",
    P_("Más series semanales por músculo dan más crecimiento, hasta un punto. La mayoría de personas crece bien entre 10 y 20 series por músculo a la semana, repartidas en dos o más días. Más allá, la fatiga empieza a comerse el beneficio.")+
    P_("Afina reparte ese volumen según los días que entrenas, tu experiencia, tu edad y si estás en déficit, y te enseña cuántas series hace cada músculo."))}
  ${card("Progresión: el cuerpo se adapta a lo que le pides",
    P_("Si siempre levantas lo mismo, el cuerpo deja de tener motivo para cambiar. La progresión doble es sencilla: sumas repeticiones hasta el tope del rango y entonces subes peso. Afina lo calcula con tu última sesión y te dice qué hacer hoy.")+
    P_("La fuerza estimada que ves en Progreso combina peso, repeticiones y RIR. Sirve para saber si mejoras aunque cambies de peso o de ejercicio."))}
  ${card("Recuperación y descargas",
    P_("El músculo no crece en el gimnasio: crece después, mientras descansas, comes proteína y duermes. Entrenar acumula fatiga, y si no la sueltas, rindes menos y te lesionas más.")+
    P_("Cada cinco semanas hay una semana de descarga con la mitad de series. Si estás muy cansado varias sesiones o tu fuerza cae, Afina te propone adelantarla."))}
  ${card("Ejercicios: no hay uno obligatorio",
    P_("Al músculo le da igual si mueves una barra, una mancuerna o una máquina: responde a la tensión. Por eso cualquier ejercicio tiene alternativas que trabajan lo mismo. Si una máquina está ocupada o algo te molesta, cambiarlo no te hace perder nada.")+
    P_("Los ejercicios que cargan el músculo cuando está estirado (al fondo del press, abajo en la sentadilla, el curl inclinado) parecen dar algo más de crecimiento, y Afina los prioriza. Una molestia es una señal para cambiar el ejercicio o la carga; un dolor fuerte o punzante es una señal para parar y consultarlo."))}
  ${card("Entreno y comida, juntos",
    P_("En déficit el entreno de fuerza es lo que le dice al cuerpo que conserve el músculo: el peso que pierdes sale de la grasa. Por eso Afina mantiene la intensidad y recorta algo de volumen cuando comes menos.")+
    P_("Tu rendimiento real pasa a la revisión semanal de la dieta. Si pierdes peso y además tu fuerza cae dos semanas, la app sube hidratos. Los días de gimnasio, la comida de antes y la de después quedan marcadas en tu dieta."))}

  <h2 style="margin-top:8px">En qué se basa tu entrenamiento</h2>
  ${card("Lo que está bien demostrado",
    P_("Estos son los pilares del plan. Tienen detrás metaanálisis y estudios controlados de los últimos años.")+
    `<ul class="sci"><li><b>Volumen.</b> Más series semanales por músculo dan más músculo, con rendimientos decrecientes (metaanálisis de Schoenfeld, 2017, y Pelland, 2024). Afina reparte unas 10-20 series efectivas por músculo y semana según tu nivel y objetivo.</li><li><b>Frecuencia.</b> Entrenar cada músculo al menos dos veces por semana da algo más que una sola con el mismo volumen (Schoenfeld, 2016). Por eso no hay rutinas de un músculo al día.</li><li><b>Cerca del fallo.</b> Acabar las series a 0-3 repeticiones del fallo estimula casi lo mismo que llegar al fallo, con menos fatiga (Refalo, 2023; Robinson, 2024). Cada serie se controla con el RIR, una escala validada por Helms y Zourdos.</li><li><b>Repeticiones.</b> Con series cerca del fallo, el músculo crece igual entre unas 6 y 30 repeticiones (Schoenfeld, 2017). La fuerza máxima pide cargas altas: básicos a 4-8, accesorios a 8-15 y aislamientos a 12-20.</li><li><b>Descansos.</b> Descansar 2-3 minutos en los ejercicios grandes da más músculo y fuerza que 1 minuto (Schoenfeld, 2016). El temporizador va de 2,5 minutos en los pesados a 1 minuto en los aislamientos.</li><li><b>Progresión.</b> Doble progresión: primero subes repeticiones dentro del rango y, cuando llegas arriba con margen, subes peso. Es la sobrecarga progresiva de toda la vida.</li><li><b>Superseries.</b> Alternar ejercicios que no compiten ahorra tiempo sin perder rendimiento (revisión de Iversen, 2021). No se usan en el ejercicio principal ni en principiantes.</li><li><b>Aproximaciones.</b> Subir el peso en dos o tres series cortas antes del ejercicio principal prepara articulaciones y técnica sin cansar. Es práctica estándar en fuerza; Afina te las calcula con tu peso de trabajo.</li><li><b>Cardio.</b> La forma cardiovascular (VO2máx) es de los mejores predictores de longevidad. Afina pide zona 2 (ritmo en el que puedes hablar) y una sesión de intervalos por semana, con bici o andar en cuesta para no restar a las pesas: la interferencia es pequeña si el cardio es moderado y separado de la pierna (Wilson, 2012; Schumann, 2022).</li><li><b>Técnicas de intensidad.</b> Las series descendentes y el rest-pause consiguen resultados parecidos en menos tiempo (Coleman, 2023). Entrenar el músculo estirado parece dar algo más de crecimiento (Maeo, 2021; Pedrosa, 2022): de ahí las parciales en estiramiento.</li><li><b>Equilibrio y movilidad.</b> Entrenar el equilibrio reduce las caídas en mayores en torno a una cuarta parte (Sherrington, revisión Cochrane 2019). Por eso, a partir de los 50, Afina añade 5 minutos de equilibrio y movilidad dos o tres veces por semana.</li><li><b>Ciclo menstrual.</b> Los estudios actuales no encuentran ventajas en cambiar el entreno según la fase del ciclo (McNulty, 2020). Afina solo lo usa para no confundir retención de líquidos con estancamiento.</li><li><b>Fuerza para vivir más.</b> Más fuerza y más músculo se asocian a menos mortalidad y a mejor envejecimiento. Las guías de salud recomiendan fuerza de todos los grandes grupos al menos dos días por semana.</li></ul>`)}
  ${card("Decisiones prácticas de Afina",
    P_("Lo siguiente no está demostrado al detalle: es criterio de entrenador puesto en la app. Te lo contamos para que sepas dónde pisamos firme y dónde no.")+
    `<ul class="sci"><li><b>Mesociclo de 5 semanas.</b> El esfuerzo sube semana a semana (de 3 a 1 repeticiones en reserva) y la quinta es de descarga. Es la estructura habitual de los entrenadores. Que la descarga ayuda tiene acuerdo de expertos (Bell, 2023), pero pocos estudios directos.</li><li><b>Avanzado arranca más fuerte.</b> Empieza como si estuviera en la semana 3-4, porque a más experiencia hace falta más estímulo para progresar. Es lógico, pero ningún estudio fija ese punto exacto.</li><li><b>Ajuste por sensaciones.</b> Sumar o quitar una serie según respondas «Puedo más», «Justa» o «Demasiado» es autorregulación sensata, no un protocolo validado tal cual.</li><li><b>Series por nivel y medallas de fuerza.</b> Los multiplicadores de series por nivel y las cifras de fuerza relativa (tu peso en banca, por ejemplo) son referencias de entrenadores.</li><li><b>Estancamientos.</b> Cuando un ejercicio lleva tres sesiones sin mejorar, cambiar el estímulo (bajar el peso y volver a subir, otro rango de repeticiones u otra variante) es lo que hacen los entrenadores. En déficit, mantener la fuerza ya es buena señal: la app solo avisa si cae.</li><li><b>Fuerza estimada.</b> Se calcula con la fórmula de Epley ajustada con las repeticiones en reserva. Es una estimación: sirve para ver tendencias y récords, no para presumir de una cifra exacta.</li></ul>`)}
  ${card("Lo que la app no hace",
    `<ul class="sci"><li><b>No ve tu técnica.</b> La ficha de cada ejercicio trae los puntos clave y los errores típicos, pero un entrenador que te vea moverte no tiene sustituto. Graba alguna serie y compárala.</li><li><b>Dolor.</b> Si un ejercicio molesta, la app te ofrece alternativas que cargan menos esa articulación. Si el dolor es fuerte o punzante, para y consulta a un médico o fisioterapeuta.</li><li><b>Sustituir a tu médico.</b> Si tienes problemas de corazón, tensión alta sin controlar o una lesión, consulta antes de empezar, sobre todo con los intervalos.</li></ul>`)}

  <h2 style="margin-top:8px">Qué vas a notar</h2>
  <div class="grid3 plazos">
    <div class="card stack"><span class="lbl">Corto plazo · 2 a 4 semanas</span><ul>
      <li>Menos hinchazón y mejores digestiones.</li><li>Energía más estable, sin bajones después de comer.</li><li>Los primeros centímetros de cintura.</li><li>Dejar de improvisar: la compra y las comidas resueltas.</li></ul></div>
    <div class="card stack"><span class="lbl">Medio plazo · 2 a 6 meses</span><ul>
      <li>Pérdida de grasa visible, sobre todo la abdominal, que es la más dañina.</li><li>Más fuerza en el gimnasio con el mismo o menos peso corporal.</li><li>En muchas personas mejoran la tensión, la glucosa, los triglicéridos y el colesterol.</li><li>Mejor sueño y mejor ánimo.</li></ul></div>
    <div class="card stack"><span class="lbl">Largo plazo · 1 año o más</span><ul>
      <li>Menor riesgo de diabetes tipo 2, hígado graso y enfermedad cardiovascular.</li><li>Conservar el músculo al envejecer, que es lo que da autonomía a los 70 y a los 80.</li><li>Articulaciones con menos carga.</li><li>Saber comer bien sin contar nada, para siempre.</li></ul></div>
  </div>

  ${card("Sin sufrir: las reglas de Afina",
    `<ul class="rules">
      <li><b>Comes lo que te gusta.</b> El menú se monta con los alimentos que tú eliges.</li>
      <li><b>Déficit moderado.</b> Perder entre el 0,5 y el 1 % del peso a la semana. Más rápido suele acabar en rebote.</li>
      <li><b>Nada prohibido.</b> Una cena fuera o una pizza se reservan en el día y el resto se ajusta.</li>
      <li><b>Decisiones con datos.</b> Nada cambia por un mal día ni por una sensación.</li>
      <li><b>Pausas.</b> Comer en mantenimiento de vez en cuando forma parte del plan.</li>
      <li><b>80/20.</b> Si cumples cinco o seis días de siete, vas bien. La perfección no es el objetivo.</li></ul>`)}
  <div class="alert"><span class="dot"></span><div><b>Importante</b>Afina es una herramienta de educación y planificación para adultos sanos. No diagnostica ni trata enfermedades. Si tienes una patología, tomas medicación, estás embarazada o tienes antecedentes de trastornos de la conducta alimentaria, consulta antes con tu médico o con un dietista-nutricionista.</div></div>
  </div>`;
}
