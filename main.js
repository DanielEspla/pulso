Object.values(S.profiles).forEach(p=>{if(p.gym)registerImported(p.gym.customEx);});
render();
setInterval(tickRest,500);
try{matchMedia("(prefers-color-scheme: light)").addEventListener("change",()=>{if((S.ui||{}).theme==="auto")render();});}catch(e){}
