/** Inline script for layout <head> — runs without React when chunks 404 */
export const DEV_ASSET_RECOVERY_SCRIPT = `(function(){
  var KEY="ito-dev-asset-reload";
  function reload(){
    var n=+(sessionStorage.getItem(KEY)||0);
    if(n>=3)return;
    sessionStorage.setItem(KEY,String(n+1));
    location.reload();
  }
  function hasAppCss(){
    try{
      for(var i=0;i<document.styleSheets.length;i++){
        var h=document.styleSheets[i].href;
        if(h&&h.indexOf("/_next/static/css")!==-1)return true;
      }
    }catch(e){}
    return false;
  }
  function isHealthy(){
    if(!hasAppCss())return false;
    return !!document.querySelector("[data-dashboard-ready],[data-project-board]");
  }
  document.addEventListener("error",function(e){
    var t=e.target;
    if(!t)return;
    var tag=t.tagName;
    if(tag!=="LINK"&&tag!=="SCRIPT")return;
    var url=t.href||t.src||"";
    if(url.indexOf("/_next/")===-1)return;
    reload();
  },true);
  setTimeout(function(){
    if(isHealthy()){sessionStorage.removeItem(KEY);return;}
    if(document.querySelector("[data-ito-shell]")&&!hasAppCss())reload();
    if(document.querySelector("[data-dashboard-skeleton]")&&!document.querySelector("[data-dashboard-ready],[data-project-board]"))reload();
  },3000);
})();`;
