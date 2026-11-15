/* Pictogramas por tipo de movimiento. Vista lateral (o frontal con front:1), lienzo 100x100.
   h cabeza, s hombro, p cadera, a brazo [codo,mano], l pierna [rodilla,pie], a2/l2 el otro lado, x extras */
const FIGS={
 sentadilla:{h:[58,25],s:[52,39],p:[36,66],a:[[55,50],[50,40]],l:[[64,68],[52,91]],x:[["disc",47,38],["floor"]]},
 banca:{h:[21,55],s:[32,58],p:[60,58],a:[[33,44],[33,30]],l:[[78,60],[80,90]],x:[["disc",33,26],["line",14,66,66,66],["line",22,66,22,90],["line",58,66,58,90],["floor"]]},
 bisagra:{h:[75,33],s:[64,41],p:[34,54],a:[[63,56],[62,70]],l:[[50,72],[48,91]],x:[["disc",62,74],["floor"]]},
 pliegue:{h:[66,72],s:[60,60],p:[38,42],a:[[64,76],[62,90]],l:[[41,66],[42,91]],x:[["floor"]]},
 dominada:{front:1,h:[50,24],s:[50,39],p:[50,66],a:[[35,31],[37,12]],a2:[[65,31],[63,12]],l:[[45,80],[47,93]],l2:[[55,80],[53,93]],x:[["line",24,10,76,10],["dot",37,10],["dot",63,10]]},
 colgado:{h:[45,25],s:[50,36],p:[52,64],a:[[51,24],[52,12]],l:[[70,62],[88,58]],x:[["line",30,10,74,10],["dot",52,10]]},
 plancha:{h:[18,58],s:[28,66],p:[58,70],a:[[28,86],[14,86]],l:[[74,78],[90,86]],x:[["floor"]]},
 flexion:{h:[17,50],s:[27,59],p:[58,68],a:[[29,74],[27,89]],l:[[74,77],[90,87]],x:[["floor"]]},
 cuadrupedia:{h:[18,50],s:[28,56],p:[62,56],a:[[28,72],[28,89]],l:[[64,88],[88,88]],x:[["floor"]]},
 fondos:{h:[49,20],s:[50,34],p:[53,60],a:[[38,44],[46,54]],l:[[62,74],[52,88]],x:[["line",26,56,72,56],["line",30,56,30,92],["line",68,56,68,92],["dot",46,56]]},
 press_v:{h:[47,26],s:[50,40],p:[50,65],a:[[61,31],[58,14]],l:[[51,79],[50,92]],x:[["disc",58,10],["floor"]]},
 pino:{h:[53,77],s:[48,62],p:[48,36],a:[[42,76],[42,91]],l:[[49,22],[50,8]],x:[["line",62,4,62,94],["floor"]]},
 lateral:{front:1,h:[50,22],s:[50,37],p:[50,64],a:[[35,38],[21,37]],a2:[[65,38],[79,37]],l:[[45,79],[44,93]],l2:[[55,79],[56,93]],x:[["dot",19,37],["dot",81,37]]},
 aperturas:{front:1,h:[50,22],s:[50,37],p:[50,64],a:[[36,44],[28,56]],a2:[[64,44],[72,56]],l:[[45,79],[44,93]],l2:[[55,79],[56,93]],x:[["dot",27,58],["dot",73,58],["line",27,58,8,20],["line",73,58,92,20]]},
 remo:{h:[75,33],s:[64,41],p:[34,54],a:[[50,36],[58,52]],l:[[50,72],[48,91]],x:[["disc",58,56],["floor"]]},
 remo_erg:{h:[38,32],s:[40,46],p:[38,72],a:[[52,52],[64,54]],l:[[58,60],[78,74]],x:[["line",64,54,90,50],["line",24,80,92,80],["dot",64,54],["floor"]]},
 de_pie:{h:[49,22],s:[50,36],p:[50,62],a:[[52,48],[52,60]],l:[[51,77],[50,92]],x:[["disc",52,65],["floor"]]},
 curl:{h:[49,22],s:[50,36],p:[50,62],a:[[51,50],[64,42]],l:[[51,77],[50,92]],x:[["disc",66,40],["floor"]]},
 triceps:{h:[47,22],s:[48,36],p:[48,62],a:[[51,50],[62,58]],l:[[49,77],[48,92]],x:[["line",62,58,72,8],["dot",62,58],["floor"]]},
 zancada:{h:[50,18],s:[50,32],p:[50,56],a:[[51,44],[53,56]],l:[[68,62],[68,91]],l2:[[40,76],[22,84]],x:[["floor"]]},
 sentado:{h:[34,24],s:[36,38],p:[40,64],a:[[44,50],[50,60]],l:[[62,64],[84,58]],x:[["line",28,70,60,70],["line",30,34,28,70],["line",44,70,44,92],["dot",84,58],["floor"]]},
 puente:{h:[14,78],s:[26,80],p:[54,58],a:[[32,88],[44,89]],l:[[72,60],[74,91]],x:[["disc",54,54],["floor"]]},
 gemelo:{h:[49,16],s:[50,30],p:[50,56],a:[[52,42],[52,54]],l:[[51,71],[50,84]],x:[["line",38,88,62,88],["line",38,88,38,94],["line",62,88,62,94],["disc",52,59],["floor"]]},
 abdominal:{h:[30,54],s:[37,66],p:[54,87],a:[[48,62],[58,60]],l:[[70,66],[86,90]],x:[["floor"]]},
 carrera:{h:[57,20],s:[52,33],p:[47,58],a:[[42,45],[52,52]],a2:[[63,43],[70,33]],l:[[64,66],[70,86]],l2:[[38,74],[22,70]],x:[["floor"]]},
 salto:{h:[50,12],s:[50,26],p:[50,50],a:[[40,18],[34,6]],a2:[[60,18],[66,6]],front:1,l:[[44,62],[46,76]],l2:[[56,62],[54,76]],x:[["line",30,86,70,86],["floor"]]},
 trineo:{h:[60,32],s:[54,42],p:[34,58],a:[[64,46],[74,48]],l:[[46,74],[30,91]],l2:[[26,72],[12,88]],x:[["line",76,36,76,91],["line",76,91,94,91],["disc",86,82],["floor"]]},
 equilibrio:{h:[78,38],s:[67,43],p:[40,48],a:[[66,58],[66,70]],l:[[42,70],[42,91]],l2:[[24,46],[9,44]],x:[["floor"]]},
 rodillo:{h:[16,58],s:[27,64],p:[56,68],a:[[26,82],[16,89]],l:[[74,74],[90,89]],x:[["disc",54,82],["floor"]]},
 estira:{front:1,h:[50,26],s:[50,41],p:[50,66],a:[[38,30],[30,13]],a2:[[62,30],[70,13]],l:[[44,80],[40,93]],l2:[[56,80],[60,93]]}
};
const FIG_PAT={empuje_h:"banca",aperturas:"aperturas",empuje_v:"press_v",elev_lateral:"lateral",deltoide_post:"remo",tiron_v:"dominada",pullover:"dominada",tiron_h:"remo",trapecio:"de_pie",biceps:"curl",triceps:"triceps",sentadilla:"sentadilla",zancada:"zancada",ext_rodilla:"sentado",bisagra:"bisagra",flex_rodilla:"sentado",gluteo:"puente",aductor:"sentado",gemelo:"gemelo",core:"abdominal",carrera:"carrera",carga:"trineo",pot:"salto",equil:"equilibrio",fascia:"estira",cali:"flexion"};
const FIG_ID={fondos:"fondos",fondos_asistidos:"fondos",fondos_banco:"fondos",flexiones:"flexion",flexiones_deficit:"flexion",flex_inclinada:"flexion",flex_arquero:"flexion",flex_pseudoplanche:"flexion",planche_lean:"flexion",
 hspu:"pino",flex_pike:"pino",pino_pared:"pino",press_cerrado:"banca",remo_invertido:"remo",front_lever_tuck:"colgado",
 abductora:"sentado",patada_gluteo_polea:"equilibrio",gemelo_sentado:"sentado",gemelo_prensa:"sentado",
 plancha:"plancha",plancha_carga_lateral:"plancha",plancha_rotacion:"plancha",rueda_abdominal:"cuadrupedia",elev_piernas_colgado:"colgado",elev_piernas_paralelas:"colgado",toes_to_bar:"colgado",l_sit:"colgado",pallof:"de_pie",hollow:"abdominal",
 skierg:"triceps",remo_erg:"remo_erg",comba:"salto",farmers:"de_pie",wall_ball:"press_v",thruster:"press_v",power_clean:"bisagra",
 remada_banda:"remo",remo_pierna:"remo",tandem:"de_pie",dorsiflexion:"gemelo",turkish_getup:"press_v",sandbag_lunge:"zancada",
 fas_rodillo_pie:"rodillo",fas_rodillo_espalda:"rodillo",fas_rodillo_pierna:"rodillo",fas_pelota_gluteo:"rodillo",fas_cadena_posterior:"pliegue",fas_gato:"cuadrupedia",fas_rebote:"salto",fas_ninja:"salto",fas_swing:"bisagra"};
function figSvg(key,size){
  const f=FIGS[key];if(!f)return "";const P=a=>a.map(q=>q.join(",")).join(" ");
  const limb=(o,pts,far)=>pts?`<polyline points="${P([o,...pts])}"${far&&!f.front?' opacity=".45"':""}/>`:"";
  const dr=e=>e[0]==="floor"?`<line x1="6" y1="95" x2="94" y2="95" stroke-width="2" opacity=".3"/>`
    :e[0]==="line"?`<line x1="${e[1]}" y1="${e[2]}" x2="${e[3]}" y2="${e[4]}" stroke-width="3" opacity=".5"/>`
    :e[0]==="disc"?`<circle cx="${e[1]}" cy="${e[2]}" r="8" fill="var(--accent)" stroke="none"/><circle cx="${e[1]}" cy="${e[2]}" r="2.2" fill="var(--surface)" stroke="none"/>`
    :`<circle cx="${e[1]}" cy="${e[2]}" r="3.5" fill="var(--accent)" stroke="none"/>`;
  const x=f.x||[];const top=e=>e[0]==="disc"||e[0]==="dot";
  return `<svg class="fig" viewBox="0 0 100 100" width="${size||44}" height="${size||44}" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${x.filter(e=>!top(e)).map(dr).join("")}${limb(f.s,f.a2,1)}${limb(f.p,f.l2,1)}<polyline points="${P([f.s,f.p])}"/>${limb(f.p,f.l)}${limb(f.s,f.a)}<circle cx="${f.h[0]}" cy="${f.h[1]}" r="8" fill="currentColor" stroke="none"/>${x.filter(top).map(dr).join("")}</svg>`;
}
function exFig(id,size){const e=EXM[id];if(!e)return "";const k=FIG_ID[id]||FIG_PAT[e.pat];return k?figSvg(k,size):"";}
