'use client';
import { useEffect } from 'react';

export default function LandingScripts() {
  useEffect(() => {
    /* SCROLL PROGRESS + NAV */
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  document.getElementById('prog').style.width=(window.scrollY/h*100)+'%';
  document.getElementById('nav').classList.toggle('solid',window.scrollY>40);
},{passive:true});

/* MOBILE NAV */
function toggleMob(){
  document.getElementById('ham').classList.toggle('open');
  document.getElementById('mobNav').classList.toggle('open');
}

/* REVEAL OBSERVER */
const ro=new IntersectionObserver(e=>{e.forEach(el=>{if(el.isIntersecting)el.target.classList.add('in')})},{threshold:.10,rootMargin:'0px 0px -36px 0px'});
document.querySelectorAll('.rev,.rev-r').forEach(el=>ro.observe(el));

/* PILLAR CARD STAGGERED ENTRANCE */
const pillarObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const cards=e.target.querySelectorAll('.pillar-float');
      cards.forEach((card,i)=>{
        setTimeout(()=>{
          card.style.animation=`floatUp 0.55s cubic-bezier(.22,.68,0,1.1) both`;
          card.style.opacity='1';
        },i*90);
      });
      pillarObs.disconnect();
    }
  });
},{threshold:0.08});
const pgEl=document.querySelector('.pg');
if(pgEl)pillarObs.observe(pgEl);

/* TYPEWRITER HEADLINE — bold 800 line 1, thin 300 line 2 */
(function(){
  const L1='Stop guessing with AI',L2='Work smarter in F\u0026A';
  const e1=document.getElementById('tw1'),e2=document.getElementById('tw2');
  const c1=document.getElementById('twc1'),c2=document.getElementById('twc2');
  let i=0;
  setTimeout(function t1(){
    if(i<L1.length){e1.textContent+=L1[i++];setTimeout(t1,52+Math.random()*28)}
    else{c1.style.display='none';e2.style.opacity='1';c2.style.display='inline-block';let j=0;
      setTimeout(function t2(){
        if(j<L2.length){e2.textContent+=L2[j++];setTimeout(t2,48+Math.random()*26)}
        else{setTimeout(()=>c2.style.display='none',2400)}
      },60);
    }
  },300);
})();

/* PROOF STAT COUNTERS */
let sr=false;
const so=new IntersectionObserver(e=>{
  if(e[0].isIntersecting&&!sr){sr=true;
    anim('ps1',0,98,1400,'%',200);anim('ps2',0,35,1200,'%',400);anim('ps3',0,82,1300,'%',600);
    so.disconnect();
  }
},{threshold:.2});
const pe=document.getElementById('ps1');
if(pe)so.observe(pe.closest('.nc,.nc-teal'));
function anim(id,f,t,d,s,delay){
  setTimeout(()=>{const el=document.getElementById(id);if(!el)return;const t0=performance.now();
    (function step(n){const p=Math.min((n-t0)/d,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(f+(t-f)*e)+s;if(p<1)requestAnimationFrame(step)})(t0);
  },delay);
}

/* WALKTHROUGH */
let cs=0,wo=false,wti;
function goS(n){
  document.querySelectorAll('.wt-step').forEach((s,i)=>{s.classList.remove('active','exit');if(i===n)s.classList.add('active');else if(i<n)s.classList.add('exit')});
  document.querySelectorAll('.wt-dn').forEach((d,i)=>d.classList.toggle('on',i===n));
  document.querySelectorAll('[data-s]').forEach(it=>{
    const a=parseInt(it.dataset.s)===n;
    it.style.borderLeftColor=a?'#2DD4BF':'rgba(255,255,255,.06)';
    it.querySelectorAll('div')[0].style.color=a?'#2DD4BF':'var(--t4)';
    it.querySelectorAll('div')[1].style.color=a?'var(--t1)':'var(--t2)';
  });
  cs=n;
  if(n===2&&!wo){wo=true;typeEl('wout','3 invoice variances above threshold. Classification: 2× price discrepancy, 1× GL coding error. Corrective memo generated. 1 item flagged for CFO approval.',20)}
}
function nextS(){goS(Math.min(cs+1,2))}
function prevS(){goS(Math.max(cs-1,0))}
wti=setInterval(()=>goS((cs+1)%3),5200);
document.querySelector('.wt').addEventListener('mouseenter',()=>clearInterval(wti));
document.querySelector('.wt').addEventListener('mouseleave',()=>{wti=setInterval(()=>goS((cs+1)%3),5200)});
let tsx=0;
document.querySelector('.wt-screen').addEventListener('touchstart',e=>{tsx=e.touches[0].clientX},{passive:true});
document.querySelector('.wt-screen').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tsx;if(Math.abs(dx)>44){dx<0?nextS():prevS()}},{passive:true});

function typeEl(id,txt,spd){const el=document.getElementById(id);if(!el)return;el.textContent='';let i=0;const iv=setInterval(()=>{el.textContent+=txt[i++];if(i>=txt.length)clearInterval(iv)},spd)}

/* COPY */
function doCopy(){
  const btn=document.getElementById('cb');
  navigator.clipboard&&navigator.clipboard.writeText('BANK RECONCILIATION VARIANCE ANALYSIS\n\nYou are a senior finance professional conducting month-end bank reconciliation review.\n\n1. VARIANCE IDENTIFICATION\n   — Unreconciled items above materiality threshold\n   — Classify: timing / error / missing entry / unknown\n\n2. RISK ASSESSMENT\n   — Flag items outstanding > 30 days\n   — Patterns suggesting systematic error\n\n3. CORRECTIVE ACTIONS\n   — Journal entry recommendations with account codes\n   — Items requiring controller sign-off\n\nPaste your reconciliation data below:');
  btn.textContent='Copied!';btn.classList.add('ok');setTimeout(()=>{btn.textContent='Copy for Claude';btn.classList.remove('ok')},2000);
}

/* TOUCH RIPPLE */
document.addEventListener('click',e=>{const r=document.createElement('div');r.className='ripple';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';document.body.appendChild(r);setTimeout(()=>r.remove(),660)});

/* SMOOTH ANCHORS */
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}})});

/* TOUCH CARD STATES */
document.querySelectorAll('.nc,.nc-teal').forEach(el=>{
  el.addEventListener('touchstart',()=>{el.style.transform='translateY(-1px)';el.style.transition='transform .15s'},{passive:true});
  el.addEventListener('touchend',()=>{el.style.transform='';el.style.transition='transform .25s'},{passive:true});
});
  }, []);
  return null;
}
