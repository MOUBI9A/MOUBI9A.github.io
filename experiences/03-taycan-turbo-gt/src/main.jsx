import React,{useEffect,useMemo,useRef,useState}from'react';
import{createRoot}from'react-dom/client';
import{Canvas,useFrame}from'@react-three/fiber';
import*as THREE from'three';
import'./styles.css';

const HERO='https://a.storyblok.com/f/322327/1200x630/9f76bde57e/ta24q3gox0004-taycan-turbo-gt-wp-driving-small.jpg/m/1200x630/smart/filters:format(avif)';
const SQUARE='https://a.storyblok.com/f/322327/1200x1200/208830ff14/ta24q3gox0004-taycan-turbo-gt-wp-driving.jpg/m/1200x1200/smart/filters:format(avif)';

function Tunnel({attack,progress}){
 const group=useRef();
 const lanes=useMemo(()=>Array.from({length:42},(_,i)=>({z:-i*3,x:(i%2?1:-1)*(3.1+(i%3)*.15)})),[]);
 useFrame((_,dt)=>{if(!group.current)return;const speed=attack?26:9;group.current.children.forEach(o=>{o.position.z+=dt*speed*(.8+progress*1.5);if(o.position.z>6)o.position.z-=126});group.current.rotation.z=THREE.MathUtils.lerp(group.current.rotation.z,attack?.035:0,.05)});
 return <group ref={group}>{lanes.map((l,i)=><mesh key={i} position={[l.x,-1.5,l.z]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.06,1.8]}/><meshBasicMaterial color={i%5===0?'#b5ff35':'#ffffff'} transparent opacity={i%5===0?.95:.32}/></mesh>)}</group>
}
function LightRings({attack}){const ref=useRef();useFrame((s,dt)=>{if(ref.current)ref.current.rotation.z+=dt*(attack?.45:.12)});return <group ref={ref} position={[0,0,-18]}>{[5,8,11].map((r,i)=><mesh key={r}><torusGeometry args={[r,.015,8,128]}/><meshBasicMaterial color={i===0?'#b5ff35':'#725cff'} transparent opacity={.28-i*.05}/></mesh>)}</group>}
function SpeedScene({attack,progress}){return <Canvas dpr={[1,1.75]} camera={{position:[0,1.2,7],fov:58}} gl={{antialias:true,alpha:true}}><fog attach="fog" args={['#050507',12,55]}/><ambientLight intensity={.25}/><Tunnel attack={attack} progress={progress}/><LightRings attack={attack}/></Canvas>}

function App(){
 const[attack,setAttack]=useState(false),[progress,setProgress]=useState(0),[mode,setMode]=useState('Track'),[charge,setCharge]=useState(64);
 useEffect(()=>{const on=()=>setProgress(Math.min(1,scrollY/(document.documentElement.scrollHeight-innerHeight)));on();addEventListener('scroll',on,{passive:true});return()=>removeEventListener('scroll',on)},[]);
 return <div className={`app ${attack?'attack':''}`}>
  <header className="nav"><a href="#top" className="mark">TAYCAN <b>TURBO GT</b></a><nav><a href="#attack">Attack</a><a href="#aero">Aero</a><a href="#charge">Charge</a></nav><a className="official" href="https://www.porsche.com/international/models/taycan/taycan-models/taycan-turbo-gt-wp/" target="_blank" rel="noreferrer">Official model ↗</a></header>
  <div className="canvasLayer" aria-hidden="true"><SpeedScene attack={attack} progress={progress}/></div>
  <main>
   <section id="top" className="hero"><img src={HERO} className="heroImage" alt="Porsche Taycan Turbo GT with Weissach Package driving"/><div className="scrim"/><div className="heroCopy"><p className="eyebrow">Porsche Taycan Turbo GT · Weissach Package</p><h1>Electric.<br/><em>Weaponised.</em></h1><p>1,034 PS. 0–100 km/h in 2.2 seconds. A performance EV translated into a responsive speed field.</p><a href="#attack" className="cta">Engage ↓</a></div><div className="heroStats"><span><b>2.2</b>s · 0–100</span><span><b>305</b>km/h</span><span><b>760</b>kW</span></div></section>

   <section id="attack" className="attackSection panel"><div className="attackCopy"><p className="eyebrow">01 · Attack Mode</p><h2>+120 kW.<br/><em>On demand.</em></h2><p>Attack Mode can provide an additional 120 kW under the conditions stated by Porsche. Hold the control to intensify the speed field.</p><button className={`attackButton ${attack?'on':''}`} onPointerDown={()=>setAttack(true)} onPointerUp={()=>setAttack(false)} onPointerLeave={()=>setAttack(false)} onKeyDown={e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();setAttack(true)}}} onKeyUp={()=>setAttack(false)}><span>{attack?'ATTACK ACTIVE':'HOLD ATTACK'}</span><i/></button></div><div className="telemetry" aria-live="polite"><div><small>Power field</small><b>{attack?'1034':'~870'}<span>PS</span></b></div><div><small>Pulse</small><b>{attack?'MAX':'READY'}</b></div><div className="meter"><i style={{width:attack?'100%':'62%'}}/></div></div></section>

   <section id="aero" className="aeroSection"><div className="stickyCopy"><p className="eyebrow">02 · Weissach aero</p><h2>Cut drag.<br/><em>Add intent.</em></h2><p>Fixed carbon rear wing, front spoiler, aeroblades, diffuser and underbody air-control elements build a track-focused silhouette.</p><div className="modeTabs" role="group" aria-label="Driving environment">{['Road','Track','Night'].map(x=><button key={x} className={mode===x?'active':''} onClick={()=>setMode(x)}>{x}</button>)}</div></div><div className={`carFrame mode-${mode.toLowerCase()}`}><img src={SQUARE} alt="Taycan Turbo GT with Weissach Package exterior"/><div className="scanLine"/><span className="tag wing">Fixed wing</span><span className="tag front">Front aero</span><span className="tag floor">Underbody</span></div></section>

   <section className="numbers"><article><span>0–100 km/h</span><b>2.2<small>s</small></b></article><article><span>Top speed</span><b>305<small>km/h</small></b></article><article><span>Launch overboost</span><b>760<small>kW</small></b></article><article><span>Architecture</span><b>800<small>V</small></b></article></section>

   <section id="charge" className="chargeSection panel"><div className="chargeVisual"><div className="battery"><div className="batteryFill" style={{height:`${charge}%`}}/><div className="batteryRead">{charge}<small>%</small></div></div><input aria-label="Simulated battery state" type="range" min="10" max="100" value={charge} onChange={e=>setCharge(+e.target.value)}/></div><div className="chargeCopy"><p className="eyebrow">03 · 800‑V architecture</p><h2>10 → 80.<br/><em>18 minutes.</em></h2><p>Porsche states an 18-minute 10–80% DC charging time under optimal conditions with a suitable high-power charging station.</p><div className="chargeFacts"><span><b>320</b> kW max DC</span><span><b>97</b> kWh net battery</span></div></div></section>

   <section className="final"><p className="eyebrow">Experience 03 / 10</p><h2>Performance is a <em>state change.</em></h2><a href="#top">Restart the run ↑</a></section>
  </main>
  <footer><p>Independent digital design concept. Porsche and Taycan are trademarks of their respective owner. Vehicle imagery is served from Porsche’s official web assets.</p><a href="https://newsroom.porsche.com/en/2026/products/porsche-model-year-innovations-taycan-42641.html" target="_blank" rel="noreferrer">2026 Porsche release ↗</a></footer>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
