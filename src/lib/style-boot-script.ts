/**
 * Inline head script: hide UI until Tailwind CSS is active, recover stale dev assets fast.
 * Runs before paint to prevent unstyled link soup on refresh.
 */
export const STYLE_BOOT_SCRIPT = `(function(){
  var KEY="ito-style-boot";
  var MAX_RELOAD=3;
  var root=document.documentElement;
  root.classList.add("ito-boot-pending");

  function reload(reason){
    var n=+(sessionStorage.getItem(KEY)||0);
    if(n>=MAX_RELOAD){
      root.classList.remove("ito-boot-pending");
      root.classList.add("ito-styles-ready");
      console.warn("[ITO] Style recovery gave up after "+MAX_RELOAD+" reloads:",reason);
      return;
    }
    sessionStorage.setItem(KEY,String(n+1));
    console.warn("[ITO] Reloading ("+(n+1)+"/"+MAX_RELOAD+"): "+reason);
    location.reload();
  }

  function tailwindReady(){
    try{
      if(!document.body)return false;
      var probe=document.createElement("div");
      probe.className="hidden";
      probe.setAttribute("aria-hidden","true");
      document.body.appendChild(probe);
      var ok=getComputedStyle(probe).display==="none";
      document.body.removeChild(probe);
      return ok;
    }catch(e){return false}
  }

  function hasNextCssLink(){
    var links=document.querySelectorAll('link[rel="stylesheet"]');
    for(var i=0;i<links.length;i++){
      var h=links[i].href||"";
      if(h.indexOf("/_next/static/css")!==-1)return true;
    }
    return false;
  }

  function markReady(){
    if(!tailwindReady())return false;
    root.classList.remove("ito-boot-pending");
    root.classList.add("ito-styles-ready");
    sessionStorage.removeItem(KEY);
    return true;
  }

  function scheduleChecks(){
    var delays=[0,80,200,400,800,1500,2500];
    for(var i=0;i<delays.length;i++){
      (function(ms){
        setTimeout(function(){
          if(root.classList.contains("ito-styles-ready"))return;
          if(markReady())return;
          if(ms>=2500){
            if(document.querySelector("[data-ito-shell]")&&!hasNextCssLink()){
              reload("missing /_next CSS");
            }else if(document.querySelector("[data-ito-shell]")&&!tailwindReady()){
              reload("tailwind not active");
            }else if(document.querySelector("[data-ito-shell]")){
              root.classList.remove("ito-boot-pending");
              root.classList.add("ito-styles-ready");
            }
          }
        },ms);
      })(delays[i]);
    }
  }

  document.addEventListener("error",function(e){
    var t=e.target;
    if(!t)return;
    var tag=t.tagName;
    if(tag!=="LINK"&&tag!=="SCRIPT")return;
    var url=t.href||t.src||"";
    if(url.indexOf("/_next/")===-1)return;
    e.preventDefault();
    reload("asset failed: "+url);
  },true);

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",scheduleChecks);
  }else{
    scheduleChecks();
  }
  window.addEventListener("load",function(){
    markReady();
  });
})();`;
