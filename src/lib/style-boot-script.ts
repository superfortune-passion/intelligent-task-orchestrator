/**
 * Blocks the app shell until Tailwind CSS file is loaded AND layout utilities work.
 */
export const STYLE_BOOT_SCRIPT = `(function(){
  var KEY="ito-style-boot";
  var MAX_RELOAD=5;
  var root=document.documentElement;
  root.classList.add("ito-boot-pending");

  function reload(reason){
    if(root.classList.contains("ito-styles-ready"))return;
    var n=+(sessionStorage.getItem(KEY)||0);
    if(n>=MAX_RELOAD){
      root.classList.remove("ito-boot-pending");
      root.classList.add("ito-boot-failed");
      console.error("[ITO] Could not load styles:",reason);
      return;
    }
    sessionStorage.setItem(KEY,String(n+1));
    location.reload();
  }

  function utilitiesReady(){
    try{
      if(!document.body)return false;
      var cssLink=document.querySelector('link[href*="/_next/static/css"]');
      if(!cssLink)return false;
      if(!cssLink.sheet)return false;

      var hiddenProbe=document.createElement("div");
      hiddenProbe.className="hidden";
      document.body.appendChild(hiddenProbe);
      var hiddenOk=getComputedStyle(hiddenProbe).display==="none";
      document.body.removeChild(hiddenProbe);
      if(!hiddenOk)return false;

      var layoutProbe=document.createElement("div");
      layoutProbe.className="flex fixed";
      document.body.appendChild(layoutProbe);
      var st=getComputedStyle(layoutProbe);
      var flexOk=st.display==="flex";
      var fixedOk=st.position==="fixed";
      document.body.removeChild(layoutProbe);
      return flexOk&&fixedOk;
    }catch(e){return false}
  }

  function markReady(){
    if(!utilitiesReady())return false;
    root.classList.remove("ito-boot-pending");
    root.classList.remove("ito-boot-failed");
    root.classList.add("ito-styles-ready");
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem("ito-chunk-recovery");
    return true;
  }

  function tick(){
    if(root.classList.contains("ito-styles-ready"))return;
    markReady();
  }

  function watchCssLinks(){
    var links=document.querySelectorAll('link[rel="stylesheet"]');
    for(var i=0;i<links.length;i++){
      var link=links[i];
      var href=link.href||"";
      if(href.indexOf("/_next/static/css")===-1)continue;
      if(link.sheet){tick();continue;}
      link.addEventListener("load",tick);
      link.addEventListener("error",function(){reload("css load error");});
    }
  }

  function finalCheck(){
    if(root.classList.contains("ito-styles-ready"))return;
    if(markReady())return;
    if(document.querySelector("[data-ito-shell]")){
      reload("styles not ready after wait");
    }
  }

  document.addEventListener("error",function(e){
    var t=e.target;
    if(!t||!t.tagName)return;
    if(t.tagName!=="LINK"&&t.tagName!=="SCRIPT")return;
    var url=t.href||t.src||"";
    if(url.indexOf("/_next/")===-1)return;
    reload("asset failed");
  },true);

  watchCssLinks();
  var delays=[0,30,80,150,300,600,1200,2500,5000];
  for(var i=0;i<delays.length;i++){setTimeout(tick,delays[i]);}
  setTimeout(finalCheck,5500);

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",function(){
      watchCssLinks();
      tick();
    });
  }
  window.addEventListener("load",function(){
    watchCssLinks();
    tick();
    setTimeout(finalCheck,400);
  });

  new MutationObserver(function(){
    watchCssLinks();
    tick();
  }).observe(document.documentElement,{childList:true,subtree:true});
})();`;
