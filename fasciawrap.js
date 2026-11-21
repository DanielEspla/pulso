/* Rodillo antes y después de la sesión (opcional, estilo TB12): ~5 min + ~5 min */
const FW_PRE=[["fas_rodillo_pie",45,60],["fas_rodillo_pierna",60,90],["fas_pelota_gluteo",45,60],["fas_rodillo_espalda",45,60]];
const FW_POST=[["fas_pelota_gluteo",45,60],["fas_rodillo_pierna",60,90],["fas_cadena_posterior",30,45],["fas_respiracion",45,60]];
function fwItems(list,tag){return list.filter(([id])=>EXM[id]).map(([id,lo,hi])=>({si:-1,fw:tag,ex:id,sets:1,lo,hi,rir:2,rest:10,main:false,ss:"",tech:null,orig:id,sets_:[],done:false}));}
function fwWrap(p){const g=G(p);const d=g.draft;if(!g.fasWrap||!d||d.fwDone)return;
  if(typeof d.mine==="string"&&d.mine.indexOf("prog:fascias:")===0)return;
  d.exs=[...fwItems(FW_PRE,"pre"),...d.exs,...fwItems(FW_POST,"post")];d.cur=0;d.fwDone=true;}
const _startSessionFw=startSession;
startSession=function(p,idx,wellness){const d=_startSessionFw(p,idx,wellness);fwWrap(p);return G(p).draft||d;};
const _mineStartFw=mineStartDraft;
mineStartDraft=function(p,name,mineId,exs){_mineStartFw(p,name,mineId,exs);fwWrap(p);};
const _sessionMinutesFw=sessionMinutes;
sessionMinutes=function(p,idx){return _sessionMinutesFw(p,idx)+(G(p).fasWrap?10:0);};
function fwToggle(p){const on=!!G(p).fasWrap;
  return `<label class="chk" style="margin:4px 0 10px"><input type="checkbox" data-c="fwToggle" ${on?"checked":""}><span>Rodillo antes y después <span class="small muted">· 5 + 5 min, como Tom Brady</span></span></label>${on?`<span class="hint" style="display:block;margin:-6px 0 10px">Empiezas con pies, piernas, glúteo y espalda alta, y acabas con glúteo, piernas, estiramiento y respiración. Nunca sobre la zona lumbar.</span>`:""}`;}
CHG.fwToggle=()=>{const g=G(P());g.fasWrap=!g.fasWrap;commit();toast(g.fasWrap?"Rodillo antes y después activado":"Rodillo antes y después desactivado");};
