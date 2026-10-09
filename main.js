Object.values(S.profiles).forEach(p=>{if(p.gym)registerImported(p.gym.customEx);});
render();
setInterval(tickRest,500);
