import './styles.css';

const PRODUCT='https://ams.diptyqueparis.com/cdn/shop/files/diptyque-orpheon-eau-de-parfum-75ml-orphp75c-1.jpg?v=1782914078&width=1920';
const notes={juniper:{label:'Juniper berry',a:'#2f5885',b:'#b7d5e8'},cedar:{label:'Cedar',a:'#5e2e24',b:'#d29a72'},tonka:{label:'Tonka bean',a:'#7c5067',b:'#e4b5c9'},jasmine:{label:'Jasmine',a:'#c1ad73',b:'#fff3c9'}};
let active='juniper',intensity=.64,pulse=true;
let shaderController=null;

document.querySelector('#app').innerHTML=`
<header class="nav"><a href="#top" class="brand">DIPTYQUE · ORPHÉON</a><nav><a href="#notes">Notes</a><a href="#story">Story</a><a href="#bottle">Bottle</a></nav><a class="official" href="https://ams.diptyqueparis.com/en-ca/products/eau-de-parfum-orpheon-orphp75c" target="_blank" rel="noreferrer">Official fragrance ↗</a></header>
<main>
<section class="hero" id="top"><div class="heroWords"><p class="eyebrow">Paris · Saint-Germain · after midnight</p><h1>OR<br>PHÉ<br>ON</h1><p class="lead">Juniper berry. Cedar. Tonka bean. Jasmine. A liquid portrait of a legendary Parisian bar, translated into light, grain and motion.</p><a class="enter" href="#notes">Enter the night ↓</a></div><div class="bottleStage" id="bottleStage"><div class="glassHalo"></div><img src="${PRODUCT}" alt="Diptyque Orphéon Eau de Parfum bottle" id="bottleImg"/><span class="bottleTag">75 ml · Eau de parfum</span></div><div class="jazzSwitch"><span>Jazz pulse</span><button id="pulse" aria-pressed="true">ON</button></div></section>
<section class="notes" id="notes"><div class="sectionIntro"><p class="eyebrow">01 · composition</p><h2>Four notes.<br><em>One room.</em></h2><p>Select a note to retune the atmosphere. The shader changes its colour field while the product stays untouched.</p></div><div class="noteGrid">${Object.entries(notes).map(([k,v])=>`<button class="note ${k==='juniper'?'active':''}" data-note="${k}"><i></i><span>${v.label}</span><b>${k==='juniper'?'01':k==='cedar'?'02':k==='tonka'?'03':'04'}</b></button>`).join('')}</div><div class="intensity"><label for="intensity">Sillage intensity</label><input id="intensity" type="range" min="10" max="100" value="64"><output id="intensityOut">64</output></div></section>
<section class="story" id="story"><div class="storyIndex">1960s</div><div><p class="eyebrow">02 · memory</p><h2>Paris sleeps.<br><em>Orphéon swings.</em></h2><p>Diptyque describes Orphéon as an olfactory portrait of the bar where its founders gathered in 1960s Saint-Germain — an atmosphere of tobacco smoke, powdery traces and burnished wood.</p><button id="nightMode" class="storyButton" aria-pressed="false">Shift the room</button></div></section>
<section class="bottle" id="bottle"><div class="bottleCopy"><p class="eyebrow">03 · bottle for life</p><h2>Glass holds<br><em>the afterimage.</em></h2><p>Made in France. Diptyque states that its iconic fragrance bottles can be refilled at selected boutiques.</p><div class="facts"><span><b>75</b> ml</span><span><b>4</b> signature notes</span><span><b>FR</b> made in France</span></div></div><div class="bottleClose"><img src="${PRODUCT}" alt="Orphéon bottle close view"><div class="refraction"></div></div></section>
<section class="final"><p class="eyebrow">Experience 04 / 10 · WebGL / GLSL</p><h2>A fragrance<br>should leave <em>light</em><br>behind.</h2><a href="#top">Replay ↑</a></section>
</main>
<footer><p>Independent digital design concept. Diptyque and Orphéon are trademarks of their respective owner. Product imagery is served from Diptyque’s official web assets; no synthetic bottle geometry is used.</p><a href="https://ams.diptyqueparis.com/en-ca/products/eau-de-parfum-orpheon-orphp75c" target="_blank" rel="noreferrer">Diptyque product page ↗</a></footer>`;

async function initShader(){
  const THREE=await import('three');
  const canvas=document.querySelector('#shader');
  if(!canvas)return;

  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);const geometry=new THREE.PlaneGeometry(2,2);
  const uniforms={uTime:{value:0},uResolution:{value:new THREE.Vector2(innerWidth,innerHeight)},uPointer:{value:new THREE.Vector2(.5,.5)},uA:{value:new THREE.Color(notes[active].a)},uB:{value:new THREE.Color(notes[active].b)},uIntensity:{value:intensity},uPulse:{value:pulse?1:0}};
  const material=new THREE.ShaderMaterial({uniforms,vertexShader:`void main(){gl_Position=vec4(position,1.0);}`,fragmentShader:`precision highp float;uniform float uTime,uIntensity,uPulse;uniform vec2 uPointer,uResolution;uniform vec3 uA,uB;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+1.7;a*=.5;}return v;}void main(){vec2 uv=gl_FragCoord.xy/max(uResolution,vec2(1.));vec2 p=(uv-.5)*vec2(1.7,1.);float t=uTime*(.025+.04*uPulse);float n=fbm(p*2.3+vec2(t,-t*.7));float smoke=fbm(p*4.2+vec2(-t*1.4,t));float d=length(uv-uPointer);float glow=exp(-d*4.5);vec3 c=mix(vec3(.025,.028,.05),mix(uA,uB,n),(.22+.48*uIntensity)*smoke);c+=glow*uB*.18;c*=.9+.1*sin((uv.y+n*.08)*26.);gl_FragColor=vec4(c,.88);}`});scene.add(new THREE.Mesh(geometry,material));

  function resize(){const dpr=Math.min(devicePixelRatio,1.6);renderer.setPixelRatio(dpr);renderer.setSize(innerWidth,innerHeight,false);uniforms.uResolution.value.set(innerWidth*dpr,innerHeight*dpr)}
  resize();addEventListener('resize',resize,{passive:true});

  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frameId=0,t0=performance.now();
  function frame(now){frameId=0;uniforms.uTime.value=(now-t0)/1000;renderer.render(scene,camera);if(!reducedMotion&&!document.hidden)frameId=requestAnimationFrame(frame)}
  function start(){if(frameId)return;if(reducedMotion){renderer.render(scene,camera);return}if(!document.hidden)frameId=requestAnimationFrame(frame)}
  function stop(){if(frameId){cancelAnimationFrame(frameId);frameId=0}}
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  addEventListener('pointermove',e=>{uniforms.uPointer.value.set(e.clientX/innerWidth,1-e.clientY/innerHeight)},{passive:true});

  shaderController={
    setNote(note){uniforms.uA.value.set(notes[note].a);uniforms.uB.value.set(notes[note].b)},
    setIntensity(value){uniforms.uIntensity.value=value},
    setPulse(value){uniforms.uPulse.value=value?1:0}
  };
  start();
}

const loadShader=()=>void initShader().catch(()=>{});
if('requestIdleCallback' in window){requestIdleCallback(loadShader,{timeout:700})}else{requestAnimationFrame(loadShader)}

document.querySelectorAll('.note').forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.note;document.querySelectorAll('.note').forEach(x=>x.classList.toggle('active',x===btn));shaderController?.setNote(active);document.documentElement.style.setProperty('--note',notes[active].b);fetch('/api/telemetry',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({event:'note-select',note:active})}).catch(()=>{})}));
document.querySelector('#intensity').addEventListener('input',e=>{intensity=+e.target.value/100;shaderController?.setIntensity(intensity);document.querySelector('#intensityOut').value=e.target.value});
document.querySelector('#pulse').addEventListener('click',e=>{pulse=!pulse;e.currentTarget.textContent=pulse?'ON':'OFF';e.currentTarget.setAttribute('aria-pressed',String(pulse));shaderController?.setPulse(pulse)});
document.querySelector('#nightMode').addEventListener('click',e=>{document.body.classList.toggle('blueRoom');const on=document.body.classList.contains('blueRoom');e.currentTarget.setAttribute('aria-pressed',String(on));e.currentTarget.textContent=on?'Return to midnight':'Shift the room'});
const stage=document.querySelector('#bottleStage'),bottle=document.querySelector('#bottleImg');stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;bottle.style.transform=`translate3d(${x*9}px,${y*7}px,0) rotateY(${x*3}deg) rotateX(${-y*2}deg)`});stage.addEventListener('pointerleave',()=>bottle.style.transform='');
