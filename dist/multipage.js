(()=>{
 const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');
 const toggle=document.querySelector('#lines-toggle'),dropdown=document.querySelector('#lines-menu');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const main=document.querySelector('main');
 const motionToggle=document.querySelector('#motion-toggle');
 motionToggle?.addEventListener('click',()=>{const paused=document.body.classList.toggle('motion-paused');motionToggle.setAttribute('aria-pressed',String(paused));motionToggle.textContent=paused?'Riprendi animazione':'Pausa animazione';});

 let transition=null,version=0;
 const animations=[];
 function closeLines(){if(toggle){toggle.setAttribute('aria-expanded','false');dropdown.hidden=true;}}
 function closeMenu(){menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Apri navigazione');nav?.classList.remove('open');}
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Chiudi navigazione':'Apri navigazione');nav.classList.toggle('open',open);if(!open)closeLines();});
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));dropdown.hidden=!open;});
 document.addEventListener('click',event=>{if(!event.target.closest('.nav-lines'))closeLines();if(event.target.closest('#nav a')){closeLines();closeMenu();}});
 document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(toggle?.getAttribute('aria-expanded')==='true'){closeLines();toggle.focus();}else if(menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
 const canAnimate=main&&typeof main.animate==='function';
 if(canAnimate&&!reduced.matches){
  const intro=document.querySelectorAll('.hero-top,.hero-title-line,.hero-copy>p,.hero-bottom,.page-hero h1,.page-lead,.offers-hero h1,.offers-intro,.contact-page-title');
  [...intro].forEach((element,index)=>animations.push(element.animate([{opacity:0,transform:'translateY(44px)'},{opacity:1,transform:'translateY(0)'}],{duration:1500,delay:index*180,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})));
 }
 document.addEventListener('click',async event=>{
  if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||reduced.matches||!canAnimate)return;
  const a=event.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
  const url=new URL(a.href,location.href);
  if(url.origin!==location.origin||!url.pathname.match(/(?:\.html|\/)$/))return;
  const same=url.pathname===location.pathname||(url.pathname.endsWith('/index.html')&&location.pathname.endsWith('/'));
  const target=same&&url.hash?document.getElementById(decodeURIComponent(url.hash.slice(1))):null;
  if(same&&!target)return;
  event.preventDefault();const current=++version;
  animations.forEach(animation=>animation.cancel());transition?.cancel();
  transition=main.animate([{opacity:1},{opacity:.08}],{duration:260,easing:'ease-out',fill:'forwards'});
  await transition.finished.catch(()=>{});if(current!==version)return;
  if(!same){location.assign(url.href);return;}
  history.pushState(null,'',url.hash);target.scrollIntoView({behavior:'instant',block:'start'});target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
  transition.cancel();transition=main.animate([{opacity:.12},{opacity:1}],{duration:1000,easing:'ease-out'});
 });
 window.addEventListener('pageshow',()=>{transition?.cancel();});
 window.addEventListener('popstate',()=>{++version;transition?.cancel();});
 reduced.addEventListener('change',event=>{if(event.matches){++version;transition?.cancel();animations.forEach(animation=>animation.cancel());}});
 if(canAnimate&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);if(reduced.matches||transition?.playState==='running')continue;animations.push(entry.target.animate([{opacity:.12,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:1000,easing:'ease-out'}));}},{threshold:.06});
  document.querySelectorAll('.home-about,.line-grid,.home-offer-grid,.section-label,.identity-grid,.history-grid,.service-grid,.catalog-layout,.contact-grid,.offer-grid').forEach(element=>observer.observe(element));
 }
})();
