/* ===== Grupos de alimentos y contenido divulgativo ===== */
const SLOGAN="Aprende a comer. Vive más y mejor.";
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
    <p class="lead">Afina no es una dieta de castigo. Sirve para aprender a comer bien, entender qué pasa dentro de tu cuerpo y conseguir un cuerpo más sano que te dure muchos años. Sin pasar hambre y sin prohibiciones.</p>
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
