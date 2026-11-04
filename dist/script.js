const menu=document.querySelector('#menu');
const nav=document.querySelector('#nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Chiudi navigazione':'Apri navigazione');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Apri navigazione')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus()}});

// Fade the visible page out, move to the requested section, then reveal it.
// Navigation never depends on an observer firing halfway through a long scroll.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const main=document.querySelector('main');
let navigationVersion=0;
let navigationAnimation=null;
let openingAnimations=[];
const canAnimate=main&&typeof main.animate==='function';
if(canAnimate&&!reducedMotion.matches){
  const intro=document.querySelectorAll('.hero-top,.hero-copy h1,.hero-copy>p,.hero-bottom,.offers-hero h1,.offers-intro');
  openingAnimations=[...intro].map((element,index)=>element.animate([
    {opacity:0,transform:'translateY(32px)'},
    {opacity:1,transform:'translateY(0)'}
  ],{duration:1400,delay:index*180,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
}
document.addEventListener('click',async event=>{
  if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest('a[href^="#"]');
  if(!link||reducedMotion.matches||!canAnimate)return;
  const target=document.getElementById(link.getAttribute('href').slice(1));
  if(!target?.matches('main>section'))return;
  event.preventDefault();
  const version=++navigationVersion;
  openingAnimations.forEach(animation=>animation.cancel());
  navigationAnimation?.cancel();
  navigationAnimation=main.animate([{opacity:1},{opacity:.08}],{duration:280,fill:'forwards',easing:'ease-out'});
  await navigationAnimation.finished.catch(()=>{});
  if(version!==navigationVersion)return;
  const hash=link.getAttribute('href');
  if(location.hash!==hash)history.pushState(null,'',hash);
  target.scrollIntoView({behavior:'instant',block:'start'});
  target.setAttribute('tabindex','-1');
  target.focus({preventScroll:true});
  navigationAnimation.cancel();
  navigationAnimation=main.animate([{opacity:.38},{opacity:1}],{duration:1050,easing:'cubic-bezier(.2,.65,.3,1)'});
});
reducedMotion.addEventListener('change',event=>{
  if(event.matches){
    ++navigationVersion;
    navigationAnimation?.cancel();
    openingAnimations.forEach(animation=>animation.cancel());
  }
});
window.addEventListener('popstate',()=>{
  ++navigationVersion;
  navigationAnimation?.cancel();
});

// Reveal section content as it enters the viewport, including during manual scrolling.
if(canAnimate&&'IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      revealObserver.unobserve(entry.target);
      if(reducedMotion.matches||navigationAnimation?.playState==='running')continue;
      const animation=entry.target.animate([
        {opacity:.12,transform:'translateY(22px)'},
        {opacity:1,transform:'translateY(0)'}
      ],{duration:1100,easing:'cubic-bezier(.2,.65,.3,1)'});
      openingAnimations.push(animation);
    }
  },{threshold:.08});
  document.querySelectorAll('.section-label,.identity-grid,.facts,.services-heading,.service-grid,.history-grid,.areas-heading,.clinical-areas,.catalog-layout,.contact-grid,.offers-heading,.offer-grid').forEach(element=>revealObserver.observe(element));
}
