const menu=document.querySelector('#menu');
const nav=document.querySelector('#nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Chiudi navigazione':'Apri navigazione');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Apri navigazione')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus()}});

// Keep anchor navigation native, adding a short fade as the chosen section arrives.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let pendingSection=null;
let sectionAnimation=null;
function fadeSection(section){
  if(reducedMotion.matches||typeof section.animate!=='function')return;
  sectionAnimation?.cancel();
  sectionAnimation=section.animate([{opacity:.62,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,easing:'cubic-bezier(.2,.65,.3,1)'});
}
const sectionObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(entry.isIntersecting&&entry.target===pendingSection){
      pendingSection=null;
      fadeSection(entry.target);
    }
  }
},{rootMargin:'-120px 0px -12% 0px',threshold:0}):null;
document.querySelectorAll('main>section').forEach(section=>sectionObserver?.observe(section));
document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest('a[href^="#"]');
  if(!link||reducedMotion.matches)return;
  const target=document.getElementById(link.getAttribute('href').slice(1));
  if(!target?.matches('main>section'))return;
  const bounds=target.getBoundingClientRect();
  if(!sectionObserver||(bounds.top<window.innerHeight*.88&&bounds.bottom>120)){
    pendingSection=null;
    fadeSection(target);
  }else pendingSection=target;
});
