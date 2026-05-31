/** Runs in <head> before paint — default main area to light (dark sidebar is separate) */
export const THEME_INIT_SCRIPT = `(function(){
  var KEY="ito-theme";
  var root=document.documentElement;
  var t;
  try{t=localStorage.getItem(KEY);}catch(e){}
  root.classList.remove("light","dark");
  if(t==="dark"){
    root.classList.add("dark");
    root.style.colorScheme="dark";
  }else{
    root.classList.add("light");
    root.style.colorScheme="light";
    if(!t){try{localStorage.setItem(KEY,"light");}catch(e){}}
  }
})();`;
