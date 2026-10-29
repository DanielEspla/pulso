/* ===== Imagen de resumen para compartir (opcional) =====
   Se crea solo si el usuario la pide desde la pantalla de sesión terminada.
   Nada se publica ni se envía: la imagen se genera en el dispositivo. */
const SHARE_QUOTES=[
  "Hoy no fue perfecto. Fue hecho.",
  "La constancia le gana al talento cuando el talento no aparece.",
  "Una sesión más en el banco. Ese es el trabajo.",
  "Nadie ve las series que haces solo. Tu cuerpo sí.",
  "No necesitas ganas. Necesitas empezar.",
  "El peso no sabe cómo te sientes. Tú sí sabes lo que vas a hacer.",
  "Pequeñas mejoras, repetidas durante meses, cambian un cuerpo.",
  "Entrenar cuando no apetece es lo que marca la diferencia.",
  "Hoy sumaste. Eso es todo lo que hay que hacer.",
  "Cada repetición es un voto por la persona que quieres ser.",
  "La disciplina es hacerlo igual cuando nadie mira.",
  "Fuerte no es un día. Es un hábito.",
  "Un día de entreno no cambia nada. Cien días lo cambian todo.",
  "Termina lo que empezaste. Después descansa.",
  "El progreso se mide en semanas, no en sesiones.",
  "No compitas con nadie. Supera la sesión de la semana pasada.",
  "Hoy tu yo de dentro de un año te da las gracias.",
  "Lo difícil no es la última serie. Es ponerse la ropa.",
  "Más fuerte que ayer, aunque sea por una repetición.",
  "El músculo se construye cuando descansas. La decisión, cuando entrenas.",
  "Sin atajos y sin prisa. Pero sin faltar.",
  "Cumplir contigo mismo también se entrena.",
  "Hoy elegiste esfuerzo en vez de excusa.",
  "El cuerpo que quieres se construye con días como este.",
  "No tienes que ser extremo. Tienes que ser constante.",
  "Una serie más limpia vale más que diez descuidadas.",
  "Entrena con cabeza. Descansa con cabeza. Repite.",
  "Lo que haces con regularidad pesa más que lo que haces con rabia.",
  "Otro día en el que no te rendiste.",
  "La técnica de hoy es el peso de mañana.",
  "Duele menos que arrepentirse de no haber ido.",
  "Hoy pesaste más que ayer en algo: en compromiso.",
  "Hazlo bien, hazlo seguido y deja que el tiempo trabaje.",
  "No es motivación. Es costumbre.",
  "Quien entrena hoy no negocia con el sofá.",
  "Cada sesión es un ladrillo. Mira cuántos llevas.",
  "El esfuerzo de hoy es lo que notarás cuando subas las escaleras con ganas.",
  "Nadie regala la fuerza. Se gana serie a serie.",
  "Hoy trabajaste para tu salud, no para una foto.",
  "La mejor sesión es la que se hace.",
  "Si pesa, estás en el sitio correcto.",
  "Respira, aprieta y suma una más.",
  "El plan funciona si tú apareces.",
  "No fue casualidad: lo has repetido hasta que salió.",
  "Entrenar es el rato del día que es solo tuyo.",
  "Menos excusas, más series.",
  "Un cuerpo capaz empieza por una agenda cumplida.",
  "Avanzas aunque no lo notes todavía.",
  "Hoy fuiste el que cumple.",
  "Con paciencia y barra, todo sube.",
  "Mide el avance en kilos, en energía y en cómo te sientes.",
  "Ni un día más esperando el momento perfecto.",
  "Lo que hoy cuesta, mañana es tu base.",
  "Hecho está. Ahora a recuperar bien.",
  "Cada vez más cerca de la versión que decidiste ser.",
  "Cuando entrenas, cuidas a tu yo del futuro.",
  "Fuerza hoy, salud mañana.",
  "El mejor gimnasio es el hábito.",
  "Pocas cosas dan tanto como cumplir una promesa a uno mismo.",
  "Sigue apareciendo. El resto llega solo.",
  "Entrena duro, come bien, duerme mejor.",
  "Sesión cerrada. Vida mejorada."
];
function shareHash(s){let h=0;String(s).split("").forEach(c=>{h=(h*31+c.charCodeAt(0))|0;});return Math.abs(h);}
/* Una frase por sesión, sin repetir hasta agotar todas; se guarda en la sesión para que no cambie al reabrir */
function shareQuote(p,e){
  const g=G(p);const real=(g.log||[]).find(l=>l.id===e.id)||e;
  if(real.q!=null&&SHARE_QUOTES[real.q])return SHARE_QUOTES[real.q];
  g.quotesUsed=g.quotesUsed||[];
  let free=SHARE_QUOTES.map((_,i)=>i).filter(i=>!g.quotesUsed.includes(i));
  if(!free.length){g.quotesUsed=[];free=SHARE_QUOTES.map((_,i)=>i);}
  const i=free[shareHash(e.id||e.date)%free.length];
  g.quotesUsed.push(i);real.q=i;e.q=i;
  return SHARE_QUOTES[i];
}
function shareWrap(ctx,text,maxW){
  const words=String(text).split(/\s+/);const lines=[];let cur="";
  words.forEach(w=>{const t=cur?cur+" "+w:w;if(ctx.measureText(t).width>maxW&&cur){lines.push(cur);cur=w;}else cur=t;});
  if(cur)lines.push(cur);return lines;
}
function shareFit(ctx,text,maxW){let t=String(text);if(ctx.measureText(t).width<=maxW)return t;while(t.length>1&&ctx.measureText(t+"…").width>maxW)t=t.slice(0,-1);return t+"…";}
function drawShareCard(p,e,quote){
  const W=1080,H=1920;const c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  const css=getComputedStyle(document.documentElement);const v=(n,d)=>(css.getPropertyValue(n)||d).trim()||d;
  const bg=v("--bg","#121019"),hero=v("--hero","#261F34"),ink=v("--ink","#FAF6F1"),muted=v("--muted","#C2BBCB"),acc=v("--accent","#C17352"),accT=v("--accent-t","#E8956F"),line=v("--line","#3A3446");
  const serif='"Playfair Display",Georgia,"Times New Roman",serif',sans='"Instrument Sans",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif';
  const gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,hero);gr.addColorStop(0.55,bg);gr.addColorStop(1,bg);x.fillStyle=gr;x.fillRect(0,0,W,H);
  x.fillStyle=acc;x.globalAlpha=0.9;x.fillRect(80,150,90,6);x.globalAlpha=1;
  x.textBaseline="alphabetic";x.textAlign="left";
  x.fillStyle=ink;x.font="700 84px "+serif;x.fillText("Afina",80,260);
  x.fillStyle=muted;x.font="400 32px "+sans;x.fillText("Aprende a comer. Vive más y mejor.",80,312);
  /* Sesión */
  const st=sessionStats(p,e);
  const d=parseD(e.date).toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"});
  x.fillStyle=accT;x.font="600 30px "+sans;x.fillText(d.toUpperCase(),80,430);
  x.fillStyle=ink;x.font="700 72px "+serif;
  shareWrap(x,e.name,W-160).slice(0,2).forEach((l,i)=>x.fillText(l,80,520+i*84));
  /* Cifras */
  const y0=700;const stats=[["SERIES",String(st.sets)],["MINUTOS",String(e.min)],["KILOS MOVIDOS",nf(st.vol,0)]];
  const cw=(W-160-40)/3;
  stats.forEach((s,i)=>{const px=80+i*(cw+20);x.fillStyle="rgba(255,255,255,0.06)";x.beginPath();x.roundRect?x.roundRect(px,y0,cw,200,24):x.rect(px,y0,cw,200);x.fill();
    x.fillStyle=muted;x.font="600 24px "+sans;x.fillText(s[0],px+24,y0+56);
    x.fillStyle=ink;let fs=68;x.font="700 "+fs+"px "+serif;while(x.measureText(s[1]).width>cw-40&&fs>36){fs-=4;x.font="700 "+fs+"px "+serif;}x.fillText(s[1],px+24,y0+148);});
  /* Récords */
  let y=y0+270;
  if(st.prs.length){x.fillStyle=acc;x.font="700 30px "+sans;x.fillText((st.prs.length>1?st.prs.length+" RÉCORDS NUEVOS":"RÉCORD NUEVO"),80,y);y+=20;}
  /* Ejercicios */
  y+=30;x.fillStyle=line;x.fillRect(80,y,W-160,2);y+=64;
  const rows=e.exs.map(ex=>{const ws=ex.sets.filter(s=>!s.warm);if(!ws.length)return null;const best=ws.reduce((a,s)=>((s.w||0)*s.r>(a.w||0)*a.r?s:a),ws[0]);
    return {n:EXM[ex.ex]?EXM[ex.ex].name:"Ejercicio",s:ws.length,b:(best.w?kg(best.w)+" × ":"")+best.r+((EXM[ex.ex]||{}).rep==="s"?" s":"")};}).filter(Boolean);
  const MAXR=7;rows.slice(0,MAXR).forEach(r=>{
    x.fillStyle=ink;x.font="600 36px "+sans;x.textAlign="left";x.fillText(shareFit(x,r.n,W-160-290),80,y);
    x.fillStyle=muted;x.font="400 28px "+sans;x.textAlign="right";x.fillText(r.s+(r.s===1?" serie":" series")+" · "+r.b,W-80,y);y+=74;});
  x.textAlign="left";
  if(rows.length>MAXR){x.fillStyle=muted;x.font="400 30px "+sans;x.fillText("y "+(rows.length-MAXR)+" más",80,y);y+=60;}
  /* Frase */
  const qy=Math.max(y+60,1380);
  x.fillStyle=acc;x.fillRect(80,qy-70,90,6);
  x.fillStyle=ink;x.font="italic 600 58px "+serif;
  shareWrap(x,"“"+quote+"”",W-160).slice(0,5).forEach((l,i)=>x.fillText(l,80,qy+i*76));
  x.fillStyle=muted;x.font="400 28px "+sans;x.fillText("Entreno hecho con Afina",80,H-110);
  return c;
}
function sheetShare(){
  return `<div class="sheet-h"><div><span class="lbl">Compartir</span><h2>Resumen de la sesión</h2></div><button class="btn ghost sm" data-a="closeSheet">${ic("x",'width="18"')}</button></div>
  <div class="stack">
    ${UI.shareUrl?`<img src="${UI.shareUrl}" alt="Resumen de la sesión" style="width:100%;max-height:56vh;object-fit:contain;border-radius:14px">`:`<p class="muted">Preparando la imagen…</p>`}
    <p class="small muted">Es una imagen vertical que se queda en tu móvil. No se publica nada: tú decides si la subes a tus historias.</p>
    <div class="row" style="gap:8px;flex-wrap:nowrap"><button class="btn pri" style="flex:1" data-a="shareDo" ${UI.shareUrl?"":"disabled"}>Compartir</button><button class="btn" style="flex:1" data-a="shareSave" ${UI.shareUrl?"":"disabled"}>Guardar imagen</button></div>
  </div>`;
}
Object.assign(A,{
  shareOpen:()=>{
    const p=P();const e=UI.gsum;if(!e)return;
    const q=shareQuote(p,e);save();
    UI.shareUrl=null;UI.shareBlob=null;UI.sheet=sheetShare;render();
    const go=()=>{try{const c=drawShareCard(p,e,q);c.toBlob(b=>{if(!b){toast("No se pudo crear la imagen");return;}UI.shareBlob=b;UI.shareUrl=URL.createObjectURL(b);if(UI.sheet===sheetShare)render();},"image/png");}catch(err){toast("No se pudo crear la imagen");}};
    const f=document.fonts&&document.fonts.load?Promise.all([document.fonts.load('700 40px "Playfair Display"'),document.fonts.load('600 30px "Instrument Sans"')]).catch(()=>{}):Promise.resolve();
    Promise.race([f,new Promise(r=>setTimeout(r,1500))]).then(go);
  },
  shareDo:async()=>{
    const b=UI.shareBlob;if(!b)return;const file=new File([b],"afina-sesion.png",{type:"image/png"});
    try{
      if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"Afina"});return;}
    }catch(err){if(err&&err.name==="AbortError")return;}
    A.shareSave();
  },
  shareSave:()=>{
    if(!UI.shareUrl)return;const a=document.createElement("a");a.href=UI.shareUrl;a.download="afina-sesion.png";document.body.appendChild(a);a.click();a.remove();toast("Imagen guardada");
  }
});
