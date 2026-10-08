/* ===== Lista de la compra explicada =====
   Merma: parte que se tira (piel, hueso, cáscara, corazón). Las cantidades del menú son de parte comestible.
   Formatos: tamaño habitual de venta en supermercados españoles. Son orientativos. */
const MERMA={
  aguacate:.3,pina:.45,melon:.45,sandia:.45,mango:.3,papaya:.35,granada:.45,uva:.05,cerezas:.1,fresas:.05,
  pimiento_rojo:.15,pimiento_verde:.15,calabacin:.05,berenjena:.05,brocoli:.35,coliflor:.4,alcachofa:.6,puerro:.4,cebolla:.1,zanahoria:.1,
  calabaza:.25,judias_verdes:.08,esparragos:.3,setas:.05,repollo:.15,coles_bruselas:.15,acelgas:.25,espinacas:.1,lechuga:.25,pepino:.05,tomate:.03,
  patata:.12,boniato:.12,mejillones:.6,gambas:.45,langostinos:.45,almejas:.75,calamar:.2,sepia:.25,dorada:.45,lubina:.45,sardinas:.4,caballa:.4,
  pollo_muslo:.3,cerdo_costillas:.3,cerdo_chuleta:.15,conejo:.25,cordero_pierna:.25
};
const UNIT_W={aguacate:200,pimiento_rojo:180,pimiento_verde:150,calabacin:300,berenjena:300,cebolla:150,zanahoria:80,tomate:150,pepino:300,puerro:200,alcachofa:150,
  patata:200,boniato:300,pina:1500,melon:2000,mango:400,papaya:800,lechuga:400,brocoli:400,coliflor:1000,repollo:1000,granada:300};
const UNIT_N={aguacate:["aguacate","aguacates"],pimiento_rojo:["pimiento","pimientos"],pimiento_verde:["pimiento","pimientos"],calabacin:["calabacín","calabacines"],berenjena:["berenjena","berenjenas"],
  cebolla:["cebolla","cebollas"],zanahoria:["zanahoria","zanahorias"],tomate:["tomate","tomates"],pepino:["pepino","pepinos"],puerro:["puerro","puerros"],alcachofa:["alcachofa","alcachofas"],
  patata:["patata","patatas"],boniato:["boniato","boniatos"],pina:["piña","piñas"],melon:["melón","melones"],mango:["mango","mangos"],papaya:["papaya","papayas"],lechuga:["lechuga","lechugas"],
  brocoli:["brócoli","brócolis"],coliflor:["coliflor","coliflores"],repollo:["repollo","repollos"],granada:["granada","granadas"]};
/* [tamaño en gramos o unidades, nombre singular, plural] */
const PACK={
  _carne:[500,"bandeja de unos 500 g","bandejas de unos 500 g"],_fiambre:[120,"sobre de unos 120 g","sobres de unos 120 g"],
  carne_picada:[400,"bandeja de 400 g","bandejas de 400 g"],
  atun_lata:[52,"lata pequeña (52 g escurrido)","latas pequeñas"],atun_aceite:[52,"lata pequeña (52 g escurrido)","latas pequeñas"],salmon_ahumado:[100,"sobre de 100 g","sobres de 100 g"],surimi:[250,"paquete de 250 g","paquetes de 250 g"],
  huevo:[12,"docena","docenas",true],claras:[500,"brick de 500 g","bricks de 500 g"],
  _yogur:[4,"pack de 4","packs de 4",true],queso_batido:[500,"tarrina de 500 g","tarrinas de 500 g"],kefir:[500,"botella de 500 g","botellas de 500 g"],requeson:[250,"tarrina de 250 g","tarrinas de 250 g"],
  _leche:[1000,"brick de 1 L","bricks de 1 L"],whey:[1000,"bote de 1 kg","botes de 1 kg"],
  _queso:[200,"paquete de unos 200 g","paquetes de unos 200 g"],mozzarella:[125,"bola de 125 g","bolas de 125 g"],queso_fresco0:[250,"tarrina de 250 g","tarrinas de 250 g"],queso_light:[10,"paquete de 10 lonchas","paquetes de 10 lonchas",true],
  tofu:[250,"bloque de 250 g","bloques de 250 g"],tempeh:[200,"paquete de 200 g","paquetes de 200 g"],seitan:[250,"paquete de 250 g","paquetes de 250 g"],vegprot_heura:[160,"paquete de 160 g","paquetes de 160 g"],soja_texturizada:[250,"bolsa de 250 g","bolsas de 250 g"],edamame:[400,"bolsa de 400 g","bolsas de 400 g"],
  _legumbre:[240,"bote de 400 g (240 g escurrido)","botes de 400 g"],hummus:[240,"tarrina de 240 g","tarrinas de 240 g"],
  arroz_blanco:[1000,"paquete de 1 kg","paquetes de 1 kg"],arroz_integral:[1000,"paquete de 1 kg","paquetes de 1 kg"],arroz_basmati:[1000,"paquete de 1 kg","paquetes de 1 kg"],arroz_vasito:[2,"pack de 2","packs de 2",true],
  _pasta:[500,"paquete de 500 g","paquetes de 500 g"],quinoa:[500,"paquete de 500 g","paquetes de 500 g"],cuscus:[500,"paquete de 500 g","paquetes de 500 g"],noquis:[500,"paquete de 500 g","paquetes de 500 g"],
  tortilla_trigo:[8,"paquete de 8","paquetes de 8",true],maiz_dulce:[140,"lata (140 g escurrido)","latas"],
  pan_barra:[250,"barra de 250 g","barras de 250 g"],pan_integral:[400,"pan de 400 g","panes de 400 g"],pan_centeno:[500,"pan de 500 g","panes de 500 g"],pan_molde:[15,"paquete de unas 15 rebanadas","paquetes de unas 15 rebanadas",true],
  pan_pita:[6,"paquete de 6","paquetes de 6",true],biscotes:[30,"paquete de unas 30 tostadas","paquetes",true],pan_sin_gluten:[300,"pan de 300 g","panes de 300 g"],tortitas_arroz:[15,"paquete de unas 15","paquetes",true],tortitas_maiz:[15,"paquete de unas 15","paquetes",true],
  avena:[500,"bolsa de 500 g","bolsas de 500 g"],muesli:[500,"paquete de 500 g","paquetes de 500 g"],copos_maiz:[500,"caja de 500 g","cajas de 500 g"],granola:[375,"paquete de 375 g","paquetes de 375 g"],galletas_maria:[40,"paquete de unas 40","paquetes",true],
  ensalada_mezcla:[200,"bolsa de 200 g","bolsas de 200 g"],rucula:[125,"bolsa de 125 g","bolsas de 125 g"],canonigos:[125,"bolsa de 125 g","bolsas de 125 g"],champinones:[250,"bandeja de 250 g","bandejas de 250 g"],setas:[250,"bandeja de 250 g","bandejas de 250 g"],
  guisantes:[1000,"bolsa de 1 kg","bolsas de 1 kg"],salteado_cong:[1000,"bolsa de 1 kg","bolsas de 1 kg"],menestra:[1000,"bolsa de 1 kg","bolsas de 1 kg"],espinacas_cong:[750,"bolsa de 750 g","bolsas de 750 g"],gazpacho:[1000,"brick de 1 L","bricks de 1 L"],
  frutos_rojos_cong:[500,"bolsa de 500 g","bolsas de 500 g"],datiles:[200,"paquete de 200 g","paquetes de 200 g"],pasas:[250,"paquete de 250 g","paquetes de 250 g"],fresas:[500,"tarrina de 500 g","tarrinas de 500 g"],arandanos:[125,"tarrina de 125 g","tarrinas de 125 g"],frambuesas:[125,"tarrina de 125 g","tarrinas de 125 g"],
  _seco:[200,"bolsa de 200 g","bolsas de 200 g"],crema_cacahuete:[350,"tarro de 350 g","tarros de 350 g"],crema_almendra:[250,"tarro de 250 g","tarros de 250 g"],
  patata_horno_cong:[750,"bolsa de 750 g","bolsas de 750 g"],
  aove:[920,"botella de 1 L","botellas de 1 L"],aceitunas:[150,"bote (150 g escurrido)","botes"],mantequilla:[250,"pastilla de 250 g","pastillas de 250 g"],choco85:[100,"tableta de 100 g","tabletas de 100 g"],choco70:[100,"tableta de 100 g","tabletas de 100 g"]
};
function packOf(f){
  if(PACK[f.id])return PACK[f.id];
  if(/picada/.test(f.id))return PACK.carne_picada;
  if(["aves","vacuno","cerdo"].includes(f.cat)&&!["cerdo_bacon"].includes(f.id))return PACK._carne;
  if(f.id==="cerdo_bacon")return [150,"paquete de 150 g","paquetes de 150 g"];
  if(f.cat==="fiambres")return PACK._fiambre;
  if(f.cat==="lacteos"&&f.u)return PACK._yogur;
  if(/leche|bebida_/.test(f.id))return PACK._leche;
  if(f.cat==="quesos")return PACK._queso;
  if(f.cat==="legumbres")return PACK._legumbre;
  if(/pasta/.test(f.id))return PACK._pasta;
  if(f.cat==="secos")return PACK._seco;
  return null;
}
const FRESH_SECS=["Fruta y verdura","Carnicería","Pescadería","Charcutería","Panadería"];
const PANTRY_SECS=["Despensa","Frutos secos"];
const DIAS3=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

function shopBuild(p,menu,opt={}){
  const acc={};
  const from=opt.from||0;
  menu.days.forEach((d,di)=>{
    if(di<from)return;
    d.meals.forEach(m=>{if(m.fuera)return;m.items.forEach(it=>{if(!it.q)return;
      const a=acc[it.id]=acc[it.id]||{q:0,q1:0,q2:0,uses:[]};a.q+=it.q;if(di<=2)a.q1+=it.q;else a.q2+=it.q;a.uses.push(`${DIAS3[di]} · ${m.name.toLowerCase()}`);});});
  });
  const out=[];
  Object.entries(acc).forEach(([id,a])=>{
    const f=FOOD[id];if(!f)return;
    const fresh=FRESH_SECS.includes(f.sec);
    const mk=q=>{
      const need=f.u?Math.ceil(q):grams(f,q);
      const merma=MERMA[id]||0;
      const buy=f.u?need:need/(1-merma);
      const pk=packOf(f);
      let main,sub=[];
      if(pk){
        const isUnits=!!pk[3];const n=Math.max(1,Math.ceil(buy/pk[0]));
        main=`${n} ${n>1?pk[2]:pk[1]}`;
        sub.push(f.u?`usas ${need} ${need>1?pluralUn(f.un):f.un}`:`usas ${gtxt(need)}`);
        const left=n*pk[0]-buy;if(left>pk[0]*0.5)sub.push(isUnits?`sobran unas ${Math.floor(left)}`:`sobran unos ${gtxt(left)} para otra semana`);
      }else if(f.u){main=`${need} ${need>1?pluralUn(f.un):f.un}`;}
      else{
        main=gtxt(buy<100?Math.ceil(buy/5)*5:Math.ceil(buy/25)*25);
        if(UNIT_W[id]){const u=Math.max(1,Math.round(buy/UNIT_W[id]));sub.push(`unos ${u} ${u>1?UNIT_N[id][1]:UNIT_N[id][0]}`);}
        if(merma)sub.push(`comes ${gtxt(need)}; el resto es ${merma>=.5?"cáscara, piel o desperdicio":"piel, hueso o recortes"}`);
        if(!UNIT_W[id]&&!merma&&fresh)sub.push("al peso");
      }
      return {main,sub,need,buy};
    };
    const row={id,f,uses:a.uses,fresh,pantry:PANTRY_SECS.includes(f.sec)||id==="aove",all:mk(a.q)};
    if(opt.split){row.p1=fresh?(a.q1?mk(a.q1):null):mk(a.q);row.p2=fresh&&a.q2?mk(a.q2):null;}
    out.push(row);
  });
  return out;
}
function pluralUn(u){return /[aeiouáéó]$/.test(u)?u+"s":u+"es";}
function gtxt(g){return g>=1000?nf(g/1000,g%1000?2:0).replace(/,?0+$/,"")+" kg":Math.round(g)+" g";}
function shopGroups(rows,key){
  const by={};rows.forEach(r=>{const v=key?r[key]:r.all;if(!v)return;(by[r.f.sec]=by[r.f.sec]||[]).push({...r,v});});
  return SECTIONS.filter(s=>by[s]).map(s=>({sec:s,items:by[s].sort((a,b)=>a.f.name.localeCompare(b.f.name))}));
}

function viewCompra(p){
  const ws=UI.menuWeek;const menu=p.menus[ws];
  if(!menu)return `<div class="head"><div><h1>Compra</h1></div>${weekNav(ws,"menuW")}</div><div class="card empty"><h2>Primero genera el menú</h2><p class="muted">La lista sale de lo que vas a comer esa semana.</p><button class="btn pri" data-a="go" data-v="dieta">Ir a la dieta</button></div>`;
  const isCur=ws===weekStart(today());const todayIdx=(new Date().getDay()+6)%7;
  const mode=UI.shopMode||"una";const from=isCur&&UI.shopFrom?todayIdx:0;
  const rows=shopBuild(p,menu,{split:mode==="dos",from});
  const pantry=p.pantry||{};
  const got=p.shop[ws]||{};
  const live=rows.filter(r=>!pantry[r.id]),inPantry=rows.filter(r=>pantry[r.id]);
  const parts=mode==="dos"?[["p1","Compra 1 · fin de semana o lunes","Todo lo que no caduca y los frescos de lunes a miércoles."],["p2","Compra 2 · miércoles o jueves","Frescos de jueves a domingo: carne, pescado, pan, fruta y verdura."]]:[["all",from?"Desde hoy hasta el domingo":"Toda la semana",""]];
  const total=live.length;const n=live.filter(r=>got[r.id]).length;
  const li=(r,k)=>{const gk=k==="p2"?r.id+"#2":r.id;const v=r.v;return `<li class="${got[gk]?"got":""}"><input type="checkbox" id="sh_${gk.replace("#","_")}" data-c="shop" data-id="${gk}" ${got[gk]?"checked":""} aria-label="${esc(r.f.name)}">
    <details><summary><span class="sn">${esc(r.f.name)}</span><b class="num">${esc(v.main)}</b></summary>
    <div class="sdet">${v.sub.length?`<p>${esc(v.sub.join(" · "))}</p>`:""}<p class="muted">Para: ${esc(r.uses.join(", "))}</p>
    ${r.pantry?`<button class="btn sm" data-a="pantry" data-id="${r.id}">Lo tengo en casa</button>`:""}</div></details></li>`;};
  return `<div class="head"><div><h1>Compra</h1><p class="sub">${n} de ${total} productos${inPantry.length?` · ${inPantry.length} en tu despensa`:""}</p></div>${weekNav(ws,"menuW")}</div>
  <div class="stack">
  <div class="row"><div class="seg" style="flex:1;min-width:240px"><button class="${mode==="una"?"on":""}" data-a="shopMode" data-k="una">Una compra</button><button class="${mode==="dos"?"on":""}" data-a="shopMode" data-k="dos">Dos compras</button></div>
  ${isCur?`<label class="chk sm-chk"><input type="checkbox" data-c="shopFrom" id="shop_from" ${UI.shopFrom?"checked":""}> Solo desde hoy</label>`:""}</div>
  ${mode==="dos"?`<p class="small muted">Útil si no haces batch cooking: la carne, el pescado y la verdura llegan frescos al final de la semana. Si cocinas todo el domingo, con una compra basta.</p>`:""}
  ${parts.map(([k,t,d])=>{const groups=shopGroups(live,k);return `<div class="stack"><div><h2>${t}</h2>${d?`<p class="small muted">${d}</p>`:""}</div>
    ${groups.length?groups.map(s=>`<div class="card shop"><span class="lbl">${s.sec}</span><ul style="margin-top:6px">${s.items.map(r=>li(r,k)).join("")}</ul></div>`).join(""):`<p class="muted small">Nada que comprar aquí.</p>`}</div>`;}).join("")}
  ${inPantry.length?`<details class="card"><summary><b>En tu despensa</b><span class="small muted"> · no se añade a la compra</span></summary><ul class="shop" style="margin-top:8px;padding:0">${inPantry.map(r=>`<li><span style="flex:1">${esc(r.f.name)} <span class="small muted">· esta semana usas ${gtxt(r.all.need)}</span></span><button class="btn sm" data-a="pantry" data-id="${r.id}">Ya no me queda</button></li>`).join("")}</ul></details>`:""}
  <div class="row"><button class="btn pri" data-a="copyShop">Copiar lista</button>${n?`<button class="btn ghost" data-a="clearShop">Desmarcar todo</button>`:""}</div>
  <details class="card"><summary><b>Cómo leer las cantidades</b></summary><div class="stack small" style="margin-top:10px">
    <p>Lo que pone en grande es lo que compras: el formato habitual del súper o el peso que pides en el mostrador. Debajo, lo que vas a comer y para qué día. Toca un producto para verlo.</p>
    <p>Arroz, pasta, legumbre seca, avena y carne van en crudo. Cocinados cambian de peso: 100 g de arroz crudo son unos 280 g cocido, 100 g de pasta unos 220 g, y la carne pierde un 25 % (150 g crudos son unos 110 g en el plato). Pesa siempre en crudo.</p>
    <p>En fruta, verdura, marisco y carne con hueso ya se suma lo que se tira (piel, hueso, cáscara). Por eso compras más de lo que comes.</p>
    <p>Los formatos son orientativos. Si en tu súper el paquete es distinto, la cantidad que usas es la que manda.</p>
    <p>No incluye las comidas que marcaste como «Como fuera», ni sal, especias o vinagre.</p></div></details>
  </div>`;
}
function shopText(menu){
  const p=P();const mode=UI.shopMode||"una";const isCur=UI.menuWeek===weekStart(today());const from=isCur&&UI.shopFrom?(new Date().getDay()+6)%7:0;
  const rows=shopBuild(p,menu,{split:mode==="dos",from}).filter(r=>!(p.pantry||{})[r.id]);
  const parts=mode==="dos"?[["p1","COMPRA 1"],["p2","COMPRA 2"]]:[["all",""]];
  return parts.map(([k,t])=>(t?t+"\n\n":"")+shopGroups(rows,k).map(s=>s.sec.toUpperCase()+"\n"+s.items.map(r=>"- "+r.f.name+": "+r.v.main).join("\n")).join("\n\n")).join("\n\n\n");
}
Object.assign(A,{
  shopMode:el=>{UI.shopMode=el.dataset.k;render();},
  pantry:el=>{const p=P();p.pantry=p.pantry||{};const id=el.dataset.id;if(p.pantry[id])delete p.pantry[id];else p.pantry[id]=true;commit();}
});
Object.assign(CHG,{shopFrom:el=>{UI.shopFrom=el.checked;render();}});
