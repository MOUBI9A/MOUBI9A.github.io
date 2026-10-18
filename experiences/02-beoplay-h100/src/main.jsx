import React,{useLayoutEffect,useRef,useState}from'react';
import{createRoot}from'react-dom/client';
import gsap from'gsap';
import{ScrollTrigger}from'gsap/ScrollTrigger';
import'./styles.css';

gsap.registerPlugin(ScrollTrigger);

const variants=[
 {name:'Infinite Black',key:'black',hex:'#151515',soft:'#929292',img:'https://images.ctfassets.net/8cd2csgvqd3m/4LVhpWsAABYquQgNu89iHo/758e886f4009dada8e999e220f4686d0/Packshot-Beoplay-H100-Infinite-Black-perspective-0006-s1200x1200px.png'},
 {name:'Century Brown',key:'brown',hex:'#74584a',soft:'#cfb7a4',img:'https://images.ctfassets.net/8cd2csgvqd3m/1oCPDpyoTmhCzduYqayGiI/249a52a22a896bf4fece81707d28bf3c/test2.webp'},
 {name:'Hourglass Sand',key:'sand',hex:'#c5bcae',soft:'#ede6da',img:'https://images.ctfassets.net/8cd2csgvqd3m/4aZbwNfeHWfhgVrjQGN6Rt/7943f72a3089c19e6037632ca30ffee2/Packshot-Beoplay-H100-Hourglass-Sand-perspective-0020-s1200x1200px.png'},
 {name:'Sunset Apricot',key:'apricot',hex:'#c97c66',soft:'#f0b19b',img:'https://images.ctfassets.net/8cd2csgvqd3m/4DcPm9xftAy3jjaf3zH0x7/1880f9ea8945f635139b0545585f9723/Packshot-Beoplay-H100-Sunses-Apricot-perspective-0036-s1200x1200px.png'}
];
const HERO='https://images.ctfassets.net/8cd2csgvqd3m/34ibLKPMEWLnnfEUedZOBJ/51afc76e38aa1ada2530ecd9b08207a9/Beuatyshot-Beoplay-H100-perspective-0010-hires-logo-s3840x2160px.jpg';
const DETAIL='https://images.ctfassets.net/8cd2csgvqd3m/YPIgtm4bY4XQlxGU3xIMJ/3babd5ac40901688cda026621a42f329/Beautyshot-Beoplay-H100-0029-s3840x2160px.jpg';

function App(){
 const root=useRef(null),spatial=useRef(null);const [variant,setVariant]=useState(variants[0]);const [world,setWorld]=useState(18);const [tracking,setTracking]=useState(true);const [quick,setQuick]=useState(false);
 useLayoutEffect(()=>{const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;if(reduce)return;const ctx=gsap.context(()=>{
   gsap.from('.heroEyebrow,.heroTitle span,.heroLead,.heroActions',{y:50,opacity:0,stagger:.08,duration:1.05,ease:'power4.out'});
   gsap.from('.heroProduct',{scale:.82,opacity:0,rotate:-8,duration:1.35,ease:'expo.out',delay:.15});
   gsap.to('.heroProduct',{yPercent:14,scale:.91,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
   gsap.to('.heroBackdrop',{scale:1.12,yPercent:5,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.2}});
   gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:38,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
   gsap.to('.worldStage',{scrollTrigger:{trigger:'.worldSection',start:'top top',end:'+=150%',pin:true,scrub:1}});
   gsap.fromTo('.worldHalo',{scale:.45,opacity:.15},{scale:1.45,opacity:.85,scrollTrigger:{trigger:'.worldSection',start:'top 70%',end:'bottom 40%',scrub:1}});
   gsap.to('.detailPhoto',{clipPath:'inset(0% 0% 0% 0% round 28px)',scrollTrigger:{trigger:'.materials',start:'top 80%',end:'center 45%',scrub:1}});
 },root);return()=>ctx.revert()},[]);
 const choose=v=>{if(v.key===variant.key)return;gsap.to('.variantProduct',{opacity:0,scale:.92,rotate:4,duration:.18,onComplete:()=>{setVariant(v);requestAnimationFrame(()=>gsap.fromTo('.variantProduct',{opacity:0,scale:.92,rotate:-4},{opacity:1,scale:1,rotate:0,duration:.48,ease:'power3.out'}))}})};
 const spatialMove=e=>{if(!spatial.current)return;const r=spatial.current.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;spatial.current.style.setProperty('--px',x);spatial.current.style.setProperty('--py',y)};
 const mode=world<35?'ANC':world>66?'TrueTransparency™':'Adaptive blend';
 return <div ref={root} className={`app tone-${variant.key}`} style={{'--accent':variant.hex,'--accentSoft':variant.soft}}>
  <header className="nav"><a className="logo" href="#top">BANG & OLUFSEN <i>×</i> H100</a><nav aria-label="Primary"><a href="#world">World Volume</a><a href="#sound">Spatial</a><a href="#finish">Finishes</a></nav><a className="official" href="https://www.bang-olufsen.com/en/us/headphones/beoplay-h100" target="_blank" rel="noreferrer">Official product ↗</a></header>
  <main>
   <section id="top" className="hero"><img className="heroBackdrop" src={HERO} alt="Beoplay H100 studio campaign"/><div className="heroShade"/><div className="heroCopy"><p className="heroEyebrow">Beoplay H100 · independent experience</p><h1 className="heroTitle"><span>Control</span><span>your world.</span></h1><p className="heroLead">A tactile study of Bang & Olufsen’s flagship headphones — titanium drivers, advanced noise cancellation and Dolby Atmos optimisation, translated into motion.</p><div className="heroActions"><a href="#world" className="lightBtn">Enter World Volume</a><button className="lineBtn" onPointerDown={()=>setQuick(true)} onPointerUp={()=>setQuick(false)} onPointerLeave={()=>setQuick(false)} onTouchStart={()=>setQuick(true)} onTouchEnd={()=>setQuick(false)}>Hold for Quick Listen</button></div></div><div className={`quickLayer ${quick?'on':''}`} aria-hidden="true"><span>QUICK LISTEN</span></div><img className="heroProduct" src={variant.img} alt={`Beoplay H100 ${variant.name}`}/><div className="heroMeta"><span>Titanium drivers</span><span>Dolby Atmos</span><span>Up to 32 h</span></div></section>

   <section id="world" className="worldSection"><div className="worldStage"><div className="worldHalo"/><div className="worldCopy reveal"><p className="eyebrow">01 · World Volume</p><h2>Turn the world<br/><em>down. Or in.</em></h2><p>The left earcup dial controls the balance between noise cancellation and your surroundings. Explore that idea here.</p></div><div className="dialWrap"><div className="dial" style={{'--angle':`${-135+(world/100)*270}deg`}}><div className="dialTicks"/><div className="dialCore"><span>{world}</span><small>{mode}</small></div></div><label className="rangeLabel">World Volume<input aria-label="World Volume simulation" type="range" min="0" max="100" value={world} onChange={e=>setWorld(+e.target.value)}/></label><div className="rangeEnds"><span>ANC</span><span>TrueTransparency™</span></div></div></div></section>

   <section id="sound" className="spatialSection section"><div className="sectionHead reveal"><p className="eyebrow">02 · Spatial Audio</p><h2>Sound with<br/><em>a position.</em></h2><p>Move across the field. The visual stage responds to your position while Head Tracking can be enabled or disabled.</p></div><div className="spatialField reveal" ref={spatial} onPointerMove={spatialMove} onPointerLeave={()=>{spatial.current?.style.setProperty('--px',0);spatial.current?.style.setProperty('--py',0)}}><div className="orbit o1"/><div className="orbit o2"/><div className="orbit o3"/><div className="soundCore">H100</div><div className="speakerDot d1"/><div className="speakerDot d2"/><div className="speakerDot d3"/><div className="speakerDot d4"/><button className={`tracking ${tracking?'active':''}`} onClick={()=>setTracking(v=>!v)} aria-pressed={tracking}><span>Head Tracking</span><b>{tracking?'ON':'OFF'}</b></button></div></section>

   <section id="finish" className="finishSection section"><div className="sectionHead reveal"><p className="eyebrow">03 · Four finishes</p><h2>Material becomes<br/><em>character.</em></h2></div><div className="finishGrid"><div className="selector reveal"><p className="selectedName">{variant.name}</p><div className="swatches">{variants.map(v=><button key={v.key} className={v.key===variant.key?'active':''} style={{'--swatch':v.hex}} onClick={()=>choose(v)} aria-label={`Select ${v.name}`} aria-pressed={v.key===variant.key}><i/></button>)}</div><p className="selectorNote">Every selection swaps the actual product image and re-tunes the scene.</p></div><div className="productStage reveal"><div className="colorAura"/><img className="variantProduct" src={variant.img} alt={`Beoplay H100 ${variant.name}`}/></div></div></section>

   <section className="materials section"><div className="materialCopy reveal"><p className="eyebrow">04 · Touch</p><h2>Glass.<br/>Aluminium.<br/><em>Gesture.</em></h2><p>The glass touch surfaces support play/pause and swipe gestures, while the earcup dials provide physical control over volume and World Volume.</p></div><img className="detailPhoto" src={DETAIL} alt="Beoplay H100 detail photography"/></section>

   <section className="specSection section"><div className="specIntro reveal"><p className="eyebrow">05 · Endurance</p><h2>Thirty-two hours<br/><em>inside the quiet.</em></h2></div><div className="specGrid"><article className="reveal"><b>32<span>h</span></b><p>Up to 32 hours of playback at moderate volume with ANC activated.</p></article><article className="reveal"><b>30<span>h</span></b><p>Up to 30 hours with Spatial Audio and Head Tracking enabled.</p></article><article className="reveal"><b>24<span>bit</span></b><p>Hi‑Res USB audio can be configured up to 24-bit / 96 kHz on supported systems.</p></article><article className="reveal"><b>4</b><p>Current finishes presented in this interactive study.</p></article></div></section>
  </main>
  <footer><div><span>EXPERIENCE 02 / 10</span><strong>Beoplay H100 · World Volume</strong></div><p>Independent digital design concept. Bang & Olufsen and Beoplay are trademarks of their respective owner. Product imagery is served from Bang & Olufsen’s official Contentful assets.</p><a href="#top">Back to top ↑</a></footer>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
