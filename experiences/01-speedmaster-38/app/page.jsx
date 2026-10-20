'use client';

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const WATCH_FRONT='https://content.thewosgroup.com/productimage/17331381/17331381_1.jpg';
const WATCH_BLACK=WATCH_FRONT;
const WATCH_MACRO=WATCH_FRONT;
const views=[
  {id:'front',label:'Steel',src:WATCH_FRONT,note:'Balanced proportions. 38 mm case. Moonwatch-inspired five-link bracelet.'},
  {id:'night',label:'Night',src:WATCH_BLACK,note:'A low-light treatment of the same verified product photograph, keeping the case and dial fully authentic.'},
  {id:'macro',label:'Macro',src:WATCH_MACRO,note:'A closer digital crop of the verified product photograph, focused on the rounded counters and tachymeter architecture.'},
];
const pad=(v,n=2)=>String(v).padStart(n,'0');
const formatTime=(ms)=>`${pad(Math.floor(Math.max(0,ms)/60000))}:${pad(Math.floor((Math.max(0,ms)%60000)/1000))}.${pad(Math.floor((Math.max(0,ms)%1000)/10))}`;

function useChronograph(){
  const [running,setRunning]=useState(false),[elapsed,setElapsed]=useState(0);
  const started=useRef(0),base=useRef(0),raf=useRef(null);
  useEffect(()=>{if(!running)return;started.current=performance.now();const loop=now=>{setElapsed(base.current+(now-started.current));raf.current=requestAnimationFrame(loop)};raf.current=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf.current)},[running]);
  const toggle=useCallback(()=>setRunning(v=>{if(v)base.current=elapsed;return !v}),[elapsed]);
  const reset=useCallback(()=>{setRunning(false);base.current=0;setElapsed(0)},[]);
  return{running,elapsed,toggle,reset};
}

function Tachymeter({rotation,setRotation}){
  const ref=useRef(null);const [dragging,setDragging]=useState(false);
  const update=useCallback((x,y)=>{const b=ref.current?.getBoundingClientRect();if(!b)return;setRotation(Math.atan2(y-(b.top+b.height/2),x-(b.left+b.width/2))*180/Math.PI+90)},[setRotation]);
  return <div className={`tachy ${dragging?'dragging':''}`} ref={ref} role="slider" tabIndex={0} aria-label="Interactive tachymeter ring" aria-valuemin={-180} aria-valuemax={180} aria-valuenow={Math.round(rotation)}
    onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setDragging(true);update(e.clientX,e.clientY)}} onPointerMove={e=>dragging&&update(e.clientX,e.clientY)} onPointerUp={()=>setDragging(false)} onPointerCancel={()=>setDragging(false)}
    onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowUp')setRotation(v=>v+5);if(e.key==='ArrowLeft'||e.key==='ArrowDown')setRotation(v=>v-5)}}>
    <motion.svg viewBox="0 0 420 420" animate={{rotate:rotation}} transition={{type:'spring',stiffness:170,damping:24}}>
      <defs><path id="ringPath" d="M210,210 m-170,0 a170,170 0 1,1 340,0 a170,170 0 1,1 -340,0"/></defs><circle cx="210" cy="210" r="179" className="tachyTrack"/><circle cx="210" cy="210" r="164" className="tachyInner"/><text className="tachyText"><textPath href="#ringPath" startOffset="3%">60 · 65 · 70 · 75 · 80 · 85 · 90 · TACHYMÈTRE · 100 · 120 · 140 · 160 · 180 · 200 · 240 · 300 · 400 · 500 ·</textPath></text>
    </motion.svg><div className="tachyHint">drag the scale</div>
  </div>;
}

export default function Page(){
  const reduceMotion=useReducedMotion();const {scrollYProgress}=useScroll();
  const heroScale=useTransform(scrollYProgress,[0,.28],[1,reduceMotion?1:1.12]),heroFade=useTransform(scrollYProgress,[0,.2],[1,.22]);
  const px=useMotionValue(0),py=useMotionValue(0),sx=useSpring(px,{stiffness:80,damping:18}),sy=useSpring(py,{stiffness:80,damping:18});
  const ix=useTransform(sx,v=>-v*.7),iy=useTransform(sy,v=>-v*.7);const {running,elapsed,toggle,reset}=useChronograph();
  const [view,setView]=useState(views[0]),[rotation,setRotation]=useState(0);
  useEffect(()=>{const key=e=>{if(['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName))return;if(e.code==='Space'){e.preventDefault();toggle()}if(e.key.toLowerCase()==='r')reset()};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[toggle,reset]);
  const onMove=e=>{if(reduceMotion)return;const r=e.currentTarget.getBoundingClientRect();px.set(((e.clientX-r.left)/r.width-.5)*18);py.set(((e.clientY-r.top)/r.height-.5)*18)};
  const chooseView=(next)=>setView(next);
  const tabKey=(e,index)=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();let i=index;if(e.key==='ArrowRight')i=(index+1)%views.length;if(e.key==='ArrowLeft')i=(index-1+views.length)%views.length;if(e.key==='Home')i=0;if(e.key==='End')i=views.length-1;chooseView(views[i]);requestAnimationFrame(()=>document.getElementById(`tab-${views[i].id}`)?.focus())};

  return <main>
    <header className="nav"><a href="#top" className="brand"><span>Ω</span> SPEEDMASTER 38</a><nav aria-label="Primary navigation"><a href="#chronograph">Chronograph</a><a href="#calibre">Calibre</a><a href="#details">Details</a></nav><a className="navCta" href="https://press.omegawatches.com/omega-extends-the-speedmaster-38-mm-collection/" target="_blank" rel="noreferrer">Official release ↗</a></header>

    <section id="top" className="hero" onPointerMove={onMove} onPointerLeave={()=>{px.set(0);py.set(0)}}><div className="noise" aria-hidden="true"/><motion.div className="orb orbA" style={{x:sx,y:sy}}/><motion.div className="orb orbB" style={{x:ix,y:iy}}/><div className="heroGrid"><div className="heroCopy"><p className="kicker">2026 · 38 mm · independent digital concept</p><h1>Precision<br/><em>in motion.</em></h1><p className="intro">A digital study of the updated black-dial Speedmaster 38: compact proportions, rounded counters and a cleaner Moonwatch-inspired visual language.</p><div className="heroActions"><a className="primary" href="#chronograph">Run the chronograph</a><a className="ghost" href="#details">Inspect the watch</a></div></div><motion.div className="watchStage" style={{scale:heroScale,opacity:heroFade,x:sx,y:sy}}><div className="halo"/><img src={WATCH_BLACK} alt="OMEGA Speedmaster 38 black dial campaign view" className="heroWatch"/><div className="measure m1"><span>38</span> mm</div><div className="measure m2"><span>52</span> h</div><div className="measure m3"><span>3332</span> calibre</div></motion.div></div><div className="scrollCue">Scroll to measure <span>↓</span></div></section>

    <section id="chronograph" className="chronoSection sectionPad"><div className="sectionHead"><p className="kicker darkKicker">01 / chronograph</p><h2>Time becomes<br/><em>an interface.</em></h2><p>Start, stop and reset the digital chronograph. Keyboard: <kbd>Space</kbd> to start/stop, <kbd>R</kbd> to reset.</p></div><div className="chronoGrid"><div className="chronoPanel"><div className="chronoTop"><span>CO‑AXIAL CHRONOMETER</span><span>{running?'RUNNING':'READY'}</span></div><div className="chronoTime" aria-live="polite">{formatTime(elapsed)}</div><div className="chronoTrack"><motion.div className="chronoFill" animate={{width:`${(elapsed/60000*100)%100}%`}} transition={{ease:'linear',duration:.08}}/></div><div className="chronoButtons"><button onClick={toggle} className="primaryBtn">{running?'Stop':'Start'}</button><button onClick={reset} className="secondaryBtn">Reset</button></div><div className="microStats"><span><b>{pad(Math.floor(elapsed/60000))}</b> minutes</span><span><b>{pad(Math.floor((elapsed%60000)/1000))}</b> seconds</span><span><b>{pad(Math.floor((elapsed%1000)/10))}</b> centiseconds</span></div></div><div className="tachyPanel"><Tachymeter rotation={rotation} setRotation={setRotation}/><p>Rotate the tachymeter ring by dragging, swiping, or using the arrow keys while focused.</p></div></div></section>

    <section id="details" className="gallery sectionPad"><div className="sectionHead splitHead"><div><p className="kicker">02 / visual study</p><h2>Steel.<br/><em>Black.</em><br/>Light.</h2></div><p>Three photographic views reveal different qualities of the same watch. The product remains real; the surrounding interface provides the motion and atmosphere.</p></div><div className="galleryShell"><div className="viewTabs" role="tablist" aria-label="Product views">{views.map((v,i)=><button id={`tab-${v.id}`} key={v.id} className={view.id===v.id?'active':''} onClick={()=>chooseView(v)} onKeyDown={e=>tabKey(e,i)} role="tab" aria-selected={view.id===v.id} aria-controls="product-view-panel" tabIndex={view.id===v.id?0:-1}>{v.label}</button>)}</div><div id="product-view-panel" role="tabpanel" aria-labelledby={`tab-${view.id}`} tabIndex={0} className={`galleryVisual ${view.id}`}><AnimatePresence mode="wait"><motion.img key={view.id} src={view.src} alt={`OMEGA Speedmaster 38 ${view.label} view`} initial={{opacity:0,scale:.96,filter:'blur(12px)'}} animate={{opacity:1,scale:1,filter:'blur(0px)'}} exit={{opacity:0,scale:1.02,filter:'blur(8px)'}} transition={{duration:.55,ease:[.22,1,.36,1]}}/></AnimatePresence></div><div className="galleryCaption" aria-live="polite"><span>{view.label}</span><p>{view.note}</p></div></div></section>

    <section id="calibre" className="calibre sectionPad"><div className="calibreCore" aria-hidden="true"><motion.div className="gear gear1" animate={reduceMotion?{}:{rotate:360}} transition={{duration:22,ease:'linear',repeat:Infinity}}/><motion.div className="gear gear2" animate={reduceMotion?{}:{rotate:-360}} transition={{duration:15,ease:'linear',repeat:Infinity}}/><motion.div className="gear gear3" animate={reduceMotion?{}:{rotate:360}} transition={{duration:10,ease:'linear',repeat:Infinity}}/><div className="coreLabel">3332</div></div><div className="calibreCopy"><p className="kicker">03 / calibre</p><h2>A smaller case.<br/><em>No smaller idea.</em></h2><p>The black-dial 2026 reference is the only one in the updated Speedmaster 38 family powered by OMEGA’s self-winding Co‑Axial Calibre 3332.</p><div className="specList"><div><span>01</span><b>38 mm</b><p>Compact steel case proportion.</p></div><div><span>02</span><b>52 h</b><p>Power reserve stated by OMEGA.</p></div><div><span>03</span><b>5 links</b><p>Moonwatch-inspired steel bracelet architecture.</p></div><div><span>04</span><b>DON</b><p>Dot-Over-Ninety bezel detail returns.</p></div></div></div></section>

    <section className="manifesto"><motion.p initial={{opacity:.2}} whileInView={{opacity:1}} viewport={{once:true,amount:.5}}>A chronograph should make time feel physical.</motion.p></section>
    <footer><div><span>EXPERIENCE 01 / 10</span><b>Speedmaster 38 · Precision in Motion</b></div><p>Independent digital design concept. OMEGA and Speedmaster are trademarks of their respective owner. Product imagery remains property of its source owners.</p><a href="#top">Back to top ↑</a></footer>
  </main>;
}