/* Base de alimentos. Valores por 100 g en crudo (o como se compran), aproximados a partir de
   tablas españolas de composición (BEDCA) y etiquetas habituales de supermercado.
   Roles: P proteína principal · C hidrato principal · V verdura · F fruta · G grasa
          D lácteo/proteína de desayuno · B pan/cereal de desayuno · N frutos secos
   Momentos: d desayuno · p comida/cena · s media mañana/merienda */
const CATS = [
  ["aves","Aves"],["vacuno","Ternera y vacuno"],["cerdo","Cerdo"],["otras","Otras carnes"],
  ["fiambres","Fiambres"],["pescado","Pescado"],["marisco","Marisco"],["huevos","Huevos"],
  ["lacteos","Lácteos y bebidas vegetales"],["quesos","Quesos"],["vegprot","Proteína vegetal"],
  ["legumbres","Legumbres"],["cereales","Arroz, pasta y cereales"],["tuberculos","Patata y boniato"],
  ["pan","Pan y desayuno"],["verduras","Verduras y hortalizas"],["frutas","Frutas"],
  ["secos","Frutos secos y semillas"],["grasas","Aceites y grasas"],["dulce","Dulce"]
];

const FOODS = [];
function FG(cat, def, rows){
  rows.forEach(r=>{
    const [id,name,kcal,p,f,c,o={}] = r;
    FOODS.push({
      id,name,cat,kcal,p,f,c,
      r:o.r||def.r, s:o.s||def.s, m:o.m||def.m, sec:o.sec||def.sec,
      t:((def.t||"")+" "+(o.t||"")).trim().split(/\s+/).filter(Boolean),
      u:o.u||0, un:o.un||"", q:o.q||def.q||null, d:o.d||def.d||null, bowl:!!o.bowl
    });
  });
}

FG("aves",{r:"P",s:"p",m:"plancha",sec:"Carnicería",t:"carne animal"},[
 ["pollo_pechuga","Pechuga de pollo",110,23,1.6,0],
 ["pollo_solomillo","Solomillos de pollo",105,23,1.2,0],
 ["pollo_contramuslo","Contramuslo de pollo sin piel",140,18,7.5,0,{m:"horno"}],
 ["pollo_muslo","Muslo de pollo sin piel",120,19,5,0,{m:"horno"}],
 ["pollo_picada","Carne picada de pollo",145,19,7.5,0],
 ["pavo_pechuga","Pechuga de pavo fresca",105,24,1,0],
 ["pavo_solomillo","Solomillo de pavo",105,24,1,0,{m:"horno"}],
 ["burger_pollo","Hamburguesa de pollo y pavo",140,18,7,2]
]);
FG("vacuno",{r:"P",s:"p",m:"plancha",sec:"Carnicería",t:"carne animal"},[
 ["ternera_filete","Filete de ternera",120,22,3.5,0],
 ["ternera_picada5","Picada de vacuno 5 % grasa",125,21,5,0],
 ["ternera_picada15","Picada de vacuno",215,18,15,0],
 ["picada_mixta","Picada mixta cerdo y vacuno",225,17,17,0,{t:"cerdo"}],
 ["burger_vacuno","Hamburguesa de vacuno",200,17,14,1],
 ["ternera_guisar","Ternera para guisar",130,21,5,0,{m:"guiso"}],
 ["ternera_solomillo","Solomillo de ternera",130,21,5,0],
 ["vacuno_lomo_bajo","Lomo bajo de vacuno",165,21,9,0],
 ["vacuno_entrecot","Entrecot de vacuno",200,20,13,0],
 ["ternera_redondo","Redondo de ternera",120,21,4,0,{m:"horno"}]
]);
FG("cerdo",{r:"P",s:"p",m:"plancha",sec:"Carnicería",t:"carne cerdo animal"},[
 ["cerdo_lomo","Lomo de cerdo",125,22,4,0],
 ["cerdo_solomillo","Solomillo de cerdo",120,21,4,0,{m:"horno"}],
 ["cerdo_lomo_adobado","Lomo adobado",140,21,5,1],
 ["cerdo_secreto","Secreto ibérico",300,16,26,0],
 ["cerdo_presa","Presa ibérica",250,18,20,0],
 ["cerdo_costillas","Costillas de cerdo",260,16,22,0,{m:"horno"}],
 ["cerdo_chuleta","Chuleta de cerdo",200,20,13,0],
 ["cerdo_panceta","Panceta",380,14,36,0],
 ["cerdo_bacon","Bacon",300,14,27,0.5,{s:"p d",q:[20,80,10]}],
 ["cerdo_salchichas","Salchichas frescas de cerdo",250,14,21,1]
]);
FG("otras",{r:"P",s:"p",m:"horno",sec:"Carnicería",t:"carne animal"},[
 ["conejo","Conejo",130,21,5,0],
 ["cordero_pierna","Pierna de cordero",200,18,14,0],
 ["higado_ternera","Hígado de ternera",135,20,4,4,{m:"plancha"}]
]);
FG("fiambres",{r:"P",s:"d s",m:"frio",sec:"Charcutería",t:"carne animal",q:[30,150,10]},[
 ["pavo_loncheado","Pechuga de pavo loncheada",95,18,1.5,2],
 ["pollo_loncheado","Pechuga de pollo loncheada",100,19,1.5,2],
 ["jamon_cocido","Jamón cocido extra",110,19,3,1,{t:"cerdo"}],
 ["jamon_serrano","Jamón serrano",240,30,13,0,{t:"cerdo",q:[20,100,10]}],
 ["lomo_embuchado","Lomo embuchado",240,38,9,1,{t:"cerdo",q:[20,100,10]}],
 ["cecina","Cecina",210,39,5,0.5,{q:[20,100,10]}]
]);
FG("pescado",{r:"P",s:"p",m:"plancha",sec:"Pescadería",t:"pescado animal"},[
 ["merluza","Merluza",75,16,1,0],
 ["bacalao","Bacalao fresco",80,18,0.7,0],
 ["salmon","Salmón",200,20,13,0,{m:"horno"}],
 ["atun_fresco","Atún fresco",140,23,5,0],
 ["dorada","Dorada",120,20,4,0,{m:"horno"}],
 ["lubina","Lubina",100,19,2.5,0,{m:"horno"}],
 ["sardinas","Sardinas",140,19,7,0],
 ["caballa","Caballa",190,18,13,0],
 ["rape","Rape",75,16,1,0],
 ["emperador","Pez espada",120,20,4,0],
 ["lenguado","Lenguado",80,17,1.3,0],
 ["salmon_ahumado","Salmón ahumado",180,22,10,0,{m:"frio",s:"d s p",sec:"Charcutería",q:[30,150,10]}],
 ["atun_lata","Atún al natural (lata)",100,23,1,0,{m:"frio",s:"p s",sec:"Despensa"}],
 ["atun_aceite","Atún en aceite (escurrido)",190,26,9,0,{m:"frio",s:"p s",sec:"Despensa"}],
 ["surimi","Palitos de surimi",100,8,1,15,{m:"frio",s:"p s",sec:"Pescadería"}]
]);
FG("marisco",{r:"P",s:"p",m:"plancha",sec:"Pescadería",t:"marisco animal"},[
 ["gambas","Gambas",85,18,1,0],
 ["langostinos","Langostinos",90,19,1,0],
 ["mejillones","Mejillones",75,12,2,3,{m:"vapor"}],
 ["calamar","Calamar",85,16,1.5,2],
 ["sepia","Sepia",75,16,1,0.5],
 ["pulpo","Pulpo cocido",80,15,1,2,{m:"frio"}],
 ["almejas","Almejas",75,13,1,3,{m:"vapor"}]
]);
FG("huevos",{r:"P",s:"d p s",m:"huevo",sec:"Huevos",t:"huevo animal"},[
 ["huevo","Huevos",143,12.6,9.9,0.7,{u:55,un:"huevo",q:[1,5,1]}],
 ["claras","Claras de huevo (brik)",50,11,0.2,0.7,{q:[100,400,50]}]
]);
FG("lacteos",{r:"D",s:"d s",m:"listo",sec:"Lácteos",t:"lactosa animal",q:[100,500,25]},[
 ["yogur_proteico","Yogur alto en proteínas",60,10,0.2,4,{u:120,un:"yogur",q:[1,3,1]}],
 ["skyr","Skyr natural",63,11,0.2,4,{u:150,un:"tarrina",q:[1,3,1]}],
 ["queso_batido","Queso fresco batido 0 %",46,8,0.1,3.5],
 ["yogur_natural","Yogur natural",61,3.5,3.3,4.5,{u:125,un:"yogur",q:[1,3,1]}],
 ["yogur_desnatado","Yogur natural desnatado",40,4.3,0.1,5.5,{u:125,un:"yogur",q:[1,3,1]}],
 ["yogur_griego","Yogur griego",120,4,10,4,{u:125,un:"yogur",q:[1,2,1]}],
 ["kefir","Kéfir",60,3.5,3,4.5,{q:[150,300,50]}],
 ["requeson","Requesón",100,11,4,4],
 ["leche_desnatada","Leche desnatada",35,3.4,0.1,5,{q:[150,300,50]}],
 ["leche_semi","Leche semidesnatada",46,3.2,1.6,4.7,{q:[150,300,50]}],
 ["leche_entera","Leche entera",64,3.1,3.6,4.7,{q:[150,300,50]}],
 ["leche_sl","Leche semi sin lactosa",46,3.2,1.6,4.7,{t:"-lactosa",q:[150,300,50]}],
 ["yogur_proteico_sl","Yogur proteico sin lactosa",60,10,0.2,4,{u:120,un:"yogur",q:[1,3,1],t:"-lactosa"}],
 ["whey","Proteína de suero (whey)",380,75,6,8,{u:30,un:"cacito",q:[1,2,1],sec:"Despensa"}],
 ["bebida_soja","Bebida de soja",40,3.3,1.8,2.5,{t:"-lactosa -animal soja",q:[150,300,50]}],
 ["bebida_avena","Bebida de avena",45,0.5,1.5,7,{t:"-lactosa -animal gluten",q:[150,300,50]}],
 ["yogur_soja","Yogur de soja natural",50,4,2.3,2,{u:125,un:"yogur",q:[1,3,1],t:"-lactosa -animal soja"}]
]);
FG("quesos",{r:"G",s:"d s",m:"frio",sec:"Lácteos",t:"lactosa animal",q:[15,80,5]},[
 ["queso_fresco0","Queso fresco 0 %",70,12,0.5,4,{r:"D",q:[50,250,25]}],
 ["queso_burgos","Queso fresco de Burgos",180,12,14,3,{q:[30,120,10]}],
 ["mozzarella","Mozzarella fresca",250,18,19,2,{s:"d s p",q:[30,125,5]}],
 ["queso_tierno","Queso tierno",330,23,26,1],
 ["queso_curado","Queso curado",410,26,34,0.5,{q:[10,50,5]}],
 ["queso_cabra","Rulo de queso de cabra",330,20,27,1],
 ["queso_feta","Queso feta",260,14,21,4,{s:"d s p"}],
 ["queso_light","Queso en lonchas light",260,30,15,1,{u:20,un:"loncha",q:[1,4,1]}]
]);
FG("vegprot",{r:"P",s:"p",m:"plancha",sec:"Lácteos",t:""},[
 ["tofu","Tofu firme",125,13,7.5,1.5,{t:"soja"}],
 ["tempeh","Tempeh",190,19,11,9,{t:"soja"}],
 ["seitan","Seitán",120,24,2,4,{t:"gluten"}],
 ["vegprot_heura","Proteína vegetal tipo Heura",180,20,9,3,{t:"soja"}],
 ["soja_texturizada","Soja texturizada (seca)",330,50,1,30,{t:"soja",m:"hidratar",sec:"Despensa",q:[30,100,5]}],
 ["edamame","Edamame",120,11,5,7,{t:"soja",m:"vapor",s:"p s",sec:"Congelados"}]
]);
FG("legumbres",{r:"C",s:"p",m:"bote",sec:"Despensa",t:"",q:[100,450,25]},[
 ["garbanzos","Garbanzos cocidos (bote)",115,7,2.5,13],
 ["lentejas","Lentejas cocidas (bote)",90,7,0.5,13],
 ["alubias_blancas","Alubias blancas cocidas (bote)",85,6,0.5,12],
 ["alubias_rojas","Alubias rojas cocidas (bote)",95,7,0.5,14],
 ["hummus","Hummus",250,7,18,13,{r:"G",s:"s d",m:"frio",sec:"Lácteos",q:[30,100,10]}]
]);
FG("cereales",{r:"C",s:"p",m:"hervir",sec:"Despensa",t:"",q:[30,150,5]},[
 ["arroz_blanco","Arroz blanco (crudo)",354,7,0.6,78],
 ["arroz_integral","Arroz integral (crudo)",350,7.5,2.7,72],
 ["arroz_basmati","Arroz basmati (crudo)",350,8,1,78],
 ["arroz_vasito","Arroz cocido en vasito",150,3,1.5,31,{u:125,un:"vasito",q:[1,3,1],m:"micro"}],
 ["pasta","Pasta (cruda)",357,12.5,1.5,71,{t:"gluten"}],
 ["pasta_integral","Pasta integral (cruda)",340,13,2.5,63,{t:"gluten"}],
 ["pasta_legumbre","Pasta de legumbre (cruda)",340,24,2,50],
 ["quinoa","Quinoa (cruda)",368,14,6,64],
 ["cuscus","Cuscús (crudo)",360,13,1.5,73,{t:"gluten",m:"cuscus"}],
 ["noquis","Ñoquis de patata",150,4,0.5,33,{t:"gluten",q:[100,400,25],sec:"Lácteos"}],
 ["tortilla_trigo","Tortilla de trigo (wrap)",300,8,7,50,{t:"gluten",u:60,un:"tortilla",q:[1,3,1],m:"frio",s:"p s"}],
 ["maiz_dulce","Maíz dulce (lata)",86,3,1.2,16,{m:"frio",q:[50,250,25]}]
]);
FG("tuberculos",{r:"C",s:"p",m:"horno",sec:"Fruta y verdura",t:"",q:[100,500,25]},[
 ["patata","Patata",77,2,0.1,17],
 ["boniato","Boniato",86,1.6,0.1,20],
 ["patata_horno_cong","Patatas para horno congeladas",140,2.5,4.5,22,{sec:"Congelados"}]
]);
FG("pan",{r:"B",s:"d s",m:"pan",sec:"Panadería",t:"gluten",q:[20,140,10]},[
 ["pan_barra","Pan de barra",255,8.5,1.3,51],
 ["pan_integral","Pan integral",230,9,3,41],
 ["pan_centeno","Pan de centeno",250,8,2,48],
 ["pan_molde","Pan de molde integral",250,10,4,42,{u:30,un:"rebanada",q:[1,5,1]}],
 ["pan_pita","Pan de pita",270,9,1.2,55,{u:70,un:"pan",q:[1,2,1]}],
 ["biscotes","Tostadas tipo biscote",410,11,6,76,{u:8,un:"tostada",q:[2,8,1],sec:"Despensa"}],
 ["pan_sin_gluten","Pan sin gluten",250,4,5,46,{t:"-gluten"}],
 ["tortitas_arroz","Tortitas de arroz",380,8,3,80,{u:8,un:"tortita",q:[2,8,1],sec:"Despensa",t:"-gluten"}],
 ["tortitas_maiz","Tortitas de maíz",380,8,3,80,{u:8,un:"tortita",q:[2,8,1],sec:"Despensa",t:"-gluten"}],
 ["avena","Copos de avena",372,13,7,60,{m:"bowl",bowl:true,sec:"Despensa"}],
 ["muesli","Muesli sin azúcar",370,10,6,62,{m:"bowl",bowl:true,sec:"Despensa"}],
 ["copos_maiz","Copos de maíz",380,7,1,84,{m:"bowl",bowl:true,sec:"Despensa"}],
 ["granola","Granola",450,10,18,60,{m:"bowl",bowl:true,sec:"Despensa",q:[20,80,5]}],
 ["galletas_maria","Galletas tipo María",440,7,12,75,{u:6,un:"galleta",q:[2,8,1],sec:"Despensa",bowl:true}]
]);
FG("verduras",{r:"V",s:"p",m:"saltear",sec:"Fruta y verdura",t:"",d:200},[
 ["brocoli","Brócoli",34,2.8,0.4,4,{m:"vapor"}],
 ["calabacin","Calabacín",17,1.2,0.3,2],
 ["berenjena","Berenjena",25,1,0.2,3,{m:"horno"}],
 ["pimiento_rojo","Pimiento rojo",31,1,0.3,5,{m:"horno"}],
 ["pimiento_verde","Pimiento verde",20,0.9,0.2,3],
 ["tomate","Tomate",18,0.9,0.2,3,{m:"crudo",s:"p d"}],
 ["lechuga","Lechuga",15,1.4,0.2,1.5,{m:"crudo",d:150}],
 ["espinacas","Espinacas",23,2.9,0.4,1.5],
 ["judias_verdes","Judías verdes",31,1.8,0.2,4,{m:"vapor"}],
 ["esparragos","Espárragos verdes",20,2.2,0.1,2,{m:"plancha"}],
 ["champinones","Champiñones",22,3,0.3,1],
 ["setas","Setas variadas",30,3,0.3,3],
 ["cebolla","Cebolla",40,1.1,0.1,8,{d:100}],
 ["zanahoria","Zanahoria",41,0.9,0.2,8,{m:"horno",d:150}],
 ["coliflor","Coliflor",25,2,0.3,3,{m:"horno"}],
 ["repollo","Col o repollo",25,1.3,0.1,4],
 ["coles_bruselas","Coles de Bruselas",43,3.4,0.3,5,{m:"horno"}],
 ["alcachofa","Alcachofas",47,3.3,0.2,6,{m:"plancha"}],
 ["pepino","Pepino",15,0.7,0.1,2.5,{m:"crudo",d:150}],
 ["calabaza","Calabaza",26,1,0.1,5,{m:"horno"}],
 ["puerro","Puerro",31,1.5,0.3,6],
 ["acelgas","Acelgas",19,1.8,0.2,2,{m:"vapor"}],
 ["rucula","Rúcula",25,2.6,0.7,2,{m:"crudo",d:80}],
 ["canonigos","Canónigos",20,2,0.4,1,{m:"crudo",d:80}],
 ["ensalada_mezcla","Mezcla de ensalada en bolsa",18,1.5,0.2,2,{m:"crudo",d:120}],
 ["guisantes","Guisantes congelados",80,5.4,0.4,11,{m:"vapor",sec:"Congelados",d:150}],
 ["salteado_cong","Salteado de verduras congelado",40,2,0.5,6,{sec:"Congelados"}],
 ["menestra","Menestra congelada",45,2.5,0.5,6,{m:"vapor",sec:"Congelados"}],
 ["espinacas_cong","Espinacas congeladas",23,2.9,0.4,1.5,{m:"vapor",sec:"Congelados"}],
 ["gazpacho","Gazpacho",40,0.8,2,4,{m:"crudo",sec:"Lácteos",d:250}]
]);
FG("frutas",{r:"F",s:"d s",m:"crudo",sec:"Fruta y verdura",t:""},[
 ["platano","Plátano",89,1.1,0.3,21,{u:120,un:"plátano"}],
 ["manzana","Manzana",52,0.3,0.2,12,{u:180,un:"manzana"}],
 ["pera","Pera",57,0.4,0.1,13,{u:180,un:"pera"}],
 ["naranja","Naranja",47,0.9,0.1,10,{u:200,un:"naranja"}],
 ["mandarina","Mandarinas",53,0.8,0.3,12,{u:80,un:"mandarina",d:2}],
 ["kiwi","Kiwi",61,1.1,0.5,12,{u:75,un:"kiwi",d:2}],
 ["melocoton","Melocotón",39,0.9,0.3,8,{u:150,un:"melocotón"}],
 ["nectarina","Nectarina",44,1,0.3,9,{u:150,un:"nectarina"}],
 ["ciruela","Ciruelas",46,0.7,0.3,10,{u:60,un:"ciruela",d:2}],
 ["higos","Higos",74,0.8,0.3,17,{u:50,un:"higo",d:2}],
 ["caqui","Caqui",70,0.6,0.2,17,{u:200,un:"caqui"}],
 ["fresas","Fresas",32,0.7,0.3,6,{d:150}],
 ["arandanos","Arándanos",57,0.7,0.3,12,{d:100}],
 ["frambuesas","Frambuesas",52,1.2,0.6,9,{d:100}],
 ["uva","Uvas",69,0.7,0.2,16,{d:120}],
 ["sandia","Sandía",30,0.6,0.2,7,{d:250}],
 ["melon","Melón",34,0.8,0.2,8,{d:250}],
 ["pina","Piña",50,0.5,0.1,12,{d:150}],
 ["mango","Mango",60,0.8,0.4,14,{d:150}],
 ["cerezas","Cerezas",63,1,0.3,14,{d:120}],
 ["granada","Granada",83,1.7,1.2,17,{d:120}],
 ["papaya","Papaya",43,0.5,0.3,10,{d:150}],
 ["frutos_rojos_cong","Frutos rojos congelados",45,1,0.3,9,{d:100,sec:"Congelados"}],
 ["datiles","Dátiles",280,2.5,0.4,67,{u:8,un:"dátil",d:3,sec:"Despensa"}],
 ["pasas","Pasas",300,3,0.5,72,{d:20,sec:"Despensa"}]
]);
FG("secos",{r:"N",s:"d s",m:"frio",sec:"Frutos secos",t:"frutos_secos",q:[10,40,5]},[
 ["almendras","Almendras",600,21,52,6],
 ["nueces","Nueces",650,15,65,7],
 ["anacardos","Anacardos",580,18,46,27],
 ["avellanas","Avellanas",630,15,61,7],
 ["pistachos","Pistachos",570,20,46,17],
 ["cacahuetes","Cacahuetes",590,26,49,12,{t:"-frutos_secos cacahuete"}],
 ["crema_cacahuete","Crema de cacahuete 100 %",600,25,50,12,{t:"-frutos_secos cacahuete",q:[10,30,5]}],
 ["crema_almendra","Crema de almendra",620,21,55,7,{q:[10,30,5]}],
 ["chia","Semillas de chía",490,17,31,8,{t:"-frutos_secos",q:[10,25,5]}],
 ["lino","Semillas de lino",530,18,42,2,{t:"-frutos_secos",q:[10,25,5]}],
 ["pipas_calabaza","Pipas de calabaza",560,30,49,10,{t:"-frutos_secos"}],
 ["pipas_girasol","Pipas de girasol peladas",580,21,51,12,{t:"-frutos_secos"}]
]);
FG("grasas",{r:"G",s:"p d",m:"frio",sec:"Despensa",t:"",q:[0,30,5]},[
 ["aove","Aceite de oliva virgen extra",900,0,100,0],
 ["aguacate","Aguacate",160,2,15,2,{s:"p d s",q:[25,150,25],sec:"Fruta y verdura"}],
 ["aceitunas","Aceitunas",140,1,14,0.5,{s:"p s",q:[10,60,10]}],
 ["mantequilla","Mantequilla",740,0.7,82,0.6,{s:"d",q:[5,15,5],t:"lactosa animal",sec:"Lácteos"}]
]);
FG("dulce",{r:"N",s:"s",m:"frio",sec:"Despensa",t:"",q:[10,30,5]},[
 ["choco85","Chocolate negro 85 %",600,10,50,20],
 ["choco70","Chocolate negro 70 %",560,8,42,33]
]);

/* Etiquetas que empiezan por "-" anulan la etiqueta heredada de su grupo */
FOODS.forEach(f=>{
  const neg = f.t.filter(x=>x[0]==="-").map(x=>x.slice(1));
  f.t = f.t.filter(x=>x[0]!=="-" && !neg.includes(x));
});
const FOOD = Object.fromEntries(FOODS.map(f=>[f.id,f]));

const RESTRICTIONS = [
  ["vegetariano","Vegetariano",["carne","pescado","marisco"]],
  ["vegano","Vegano",["animal"]],
  ["sin_cerdo","Sin cerdo",["cerdo"]],
  ["sin_pescado","Sin pescado",["pescado"]],
  ["sin_marisco","Sin marisco (alergia)",["marisco"]],
  ["sin_lactosa","Sin lactosa",["lactosa"]],
  ["sin_gluten","Sin gluten / celiaquía",["gluten"]],
  ["alergia_huevo","Alergia al huevo",["huevo"]],
  ["alergia_fs","Alergia a frutos secos",["frutos_secos"]],
  ["alergia_cacahuete","Alergia al cacahuete",["cacahuete"]],
  ["alergia_soja","Alergia a la soja",["soja"]]
];

const SECTIONS = ["Fruta y verdura","Carnicería","Pescadería","Charcutería","Huevos","Lácteos","Panadería","Despensa","Frutos secos","Congelados"];

const FUERA_PRESETS = [
  ["Menú del día",900],["Pizza individual",900],["Hamburguesa con patatas",1100],
  ["Tapas (3-4)",700],["Bocadillo y caña",650],["Sushi (12 piezas)",600],
  ["Kebab o durum",850],["Paella (ración)",650],["Ensalada completa",550],["Cena ligera fuera",500]
];
