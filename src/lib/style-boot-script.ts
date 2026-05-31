/**
 * Inline head script: hide UI until Tailwind CSS is active, recover stale dev assets fast.
 */
export const STYLE_BOOT_SCRIPT = `(function(){
  var KEY="ito-style-boot";
  var MAX_RELOAD=4;
  var root=document.documentElement;
  root.classList.add("ito-boot-pending");

  function reload(reason){
    var n=+(sessionStorage.getItem(KEY)||0);
    if(n>=MAX_RELOAD){
      console.error("[ITO] Style recovery failed:",reason);
      return;
    }
    sessionStorage.setItem(KEY,String(n+1));
    location.reload();
  }

  function tailwindReady(){
    try{
      if(!document.body)return false;
      if(!document.querySelector('link[href*="/_next/static/css"]'))return false;
      var probe=document.createElement("div");
      probe.className="hidden";
      document.body.appendChild(probe);
      var ok=getComputedStyle(probe).display==="none";
      document.body.removeChild(probe);
      var layout=getComputedStyle(document.body).display;
      return ok&&layout!=="inline";
    }catch(e){return false}
  }

  function markReady(){
    if(!tailwindReady())return false;
    root.classList.remove("ito-boot-pending");
    root.classList.add("ito-styles-ready");
    sessionStorage.removeItem(KEY);
    return true;
  }

  function tick(){
    if(root.classList.contains("ito-styles-ready"))return;
    if(markReady())return;
  }

  function finalCheck(){
    if(root.classList.contains("ito-styles-ready"))return;
    if(markReady())return;
    if(document.querySelector("[data-ito-shell]")){
      reload(tailwindReady()?"timeout":"tailwind or css missing");
    }
  }

  document.addEventListener("error",function(e){
    var t=e.target;
    if(!t||!t.tagName)return;
    var tag=t.tagName;
    if(tag!=="LINK"&&tag!=="SCRIPT")return;
    var url=t.href||t.src||"";
    if(url.indexOf("/_next/")===-1)return;
    reload("asset: "+url);
  },true);

  var delays=[0,50,120,250,500,1000,2000,4000];
  for(var i=0;i<delays.length;i++){
    setTimeout(tick,delays[i]);
  }
  setTimeout(finalCheck,4500);

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",tick);
  }
  window.addEventListener("load",function(){
    markReady()||setTimeout(finalCheck,300);
  });
})();`;
