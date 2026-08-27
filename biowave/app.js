const $=id=>document.getElementById(id);
const tabs=[...document.querySelectorAll('.tab')];
function go(id){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));tabs.forEach(t=>t.classList.toggle('hidden',t.id!==id));if(id==='cymatics')windowResized();}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>go(b.dataset.tab));
$('overviewRange').oninput=e=>{let v=e.target.value;$('overviewVal').textContent=v;$('overviewFreq').textContent=v+' Hz';$('freq').value=v;$('freqV').textContent=v+' Hz'};
$('vmRange').oninput=e=>{$('vmVal').textContent=e.target.value+' mV';updateState()};$('ampRange').oninput=e=>{updateState()};
function updateState(){let a=+$('ampRange').value/100,v=(+$('vmRange').value+80)/100;$('ampVal').textContent=a.toFixed(2);$('stateVal').textContent=(a*.7+v*.3).toFixed(2)}
let paused=false;
function setup(){let c=createCanvas(760,440);c.parent('canvas-holder');pixelDensity(1);}
function draw(){background(5,9,17);if(paused)return;let f=+$('freq').value,n=+$('nodes').value,ph=+$('phase').value/100;noStroke();for(let x=0;x<width;x+=3){for(let y=0;y<height;y+=3){let cx=width/2,cy=height/2;let d=hypot(x-cx,y-cy);let a=atan2(y-cy,x-cx);let wave=sin(d*.045*n-f*.002+ph)+.55*sin(d*.082*(n+1)+a*n+ph*.7);let q=(wave+1.55)/3.1;fill(35+q*70,80+q*140,120+q*120,210);rect(x,y,3,3)}}stroke(85,230,255,110);noFill();ellipse(width/2,height/2,min(width,height)*.72);noStroke();fill(238);textSize(13);textAlign(LEFT,TOP);text(`Synthetic field • ${f} Hz • ${n} nodes`,14,14)}
['freq','nodes','phase'].forEach(id=>$(id).oninput=()=>{$(id+'V').textContent=id==='freq'?$(id).value+' Hz':id==='phase'?Math.round(+$('phase').value/628*360)+'°':$(id).value});
$('pauseBtn').onclick=()=>{paused=!paused;$('pauseBtn').textContent=paused?'Resume simulation':'Pause simulation'};
let audio=null,gain=null,osc=null;
$('toneBtn').onclick=()=>{if(!audio){audio=new (window.AudioContext||window.webkitAudioContext)();osc=audio.createOscillator();gain=audio.createGain();osc.connect(gain).connect(audio.destination);osc.start();gain.gain.value=0;}$('toneBtn').textContent=gain.gain.value?'Start local tone':'Stop local tone';gain.gain.value=gain.gain.value?.0001:.025;osc.frequency.value=+$('carrier').value};
$('carrier').oninput=e=>{$('carrierV').textContent=e.target.value+' Hz';$('spectrumText').textContent=e.target.value+' Hz';if(osc)osc.frequency.value=e.target.value};$('mod').oninput=e=>{$('modV').textContent=e.target.value+'%'};
function renderBars(){let b=$('bars');b.innerHTML='';for(let i=0;i<45;i++){let s=document.createElement('span');s.style.height=(15+Math.random()*100)+'px';s.style.flex='1';s.style.background='linear-gradient(to top,#55e6ff,#a56cff)';s.style.borderRadius='4px 4px 0 0';b.appendChild(s)}}setInterval(renderBars,500);renderBars();
const evidence=[
['Bioelectricity & cancer','Research literature explores membrane potential, ion channels and electrical signaling in cancer biology.','https://pubmed.ncbi.nlm.nih.gov/?term=cancer+bioelectricity'],
['Cymatics & acoustics','Cymatic patterns are physical visualizations of vibration in media; they are not evidence of anticancer efficacy.','https://pubmed.ncbi.nlm.nih.gov/?term=cymatics+acoustics'],
['Electromagnetic fields','EMF-related oncology research spans multiple modalities with highly variable evidence and exposure conditions.','https://pubmed.ncbi.nlm.nih.gov/?term=electromagnetic+fields+cancer'],
['Cancer datasets','Public cancer datasets can support reproducible computational analysis when provenance and endpoints are documented.','https://www.cancer.gov/research/resources/data-sets']];
function drawEvidence(items=evidence){$('evidenceList').innerHTML=items.map(x=>`<div class="evidence"><div class="tag">Research link</div><h3>${x[0]}</h3><p class="muted">${x[1]}</p><a href="${x[2]}" target="_blank" rel="noreferrer">Open source →</a></div>`).join('')};drawEvidence();
function filterEvidence(){let q=$('evidenceSearch').value.toLowerCase();drawEvidence(evidence.filter(x=>x.join(' ').toLowerCase().includes(q)))}
function analyzeCSV(){let rows=$('csv').value.trim().split(/\r?\n/).slice(1).map(r=>r.split(',').map(Number)).filter(r=>r.length>=3&&!r.some(Number.isNaN));if(!rows.length){$('csvResult').textContent='No valid rows found.';return}let avg=k=>rows.reduce((s,r)=>s+r[k],0)/rows.length;let peak=rows.reduce((a,b)=>b[1]>a[1]?b:a);$('csvResult').innerHTML=`<div class="metric">${rows.length} samples</div><p class="muted">Mean frequency: <b>${avg(0).toFixed(2)} Hz</b> • Mean amplitude: <b>${avg(1).toFixed(3)}</b> • Mean phase: <b>${avg(2).toFixed(2)}°</b></p><p>Peak amplitude sample: <b>${peak[0]} Hz / ${peak[1]}</b></p>`}
windowResized=()=>{let c=document.querySelector('#canvas-holder canvas');if(c){resizeCanvas(Math.min(760,document.getElementById('canvas-holder').clientWidth),440)}};
