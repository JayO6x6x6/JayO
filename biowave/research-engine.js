/* BioWave Research Engine — browser-safe computational primitives.
 * No clinical inference, diagnosis, treatment recommendation, or patient control.
 */
export function fft(re, im) {
  const n = re.length;
  if (n === 0 || (n & (n - 1))) throw new Error('FFT length must be a power of two');
  for (let i=1,j=0;i<n;i++){let bit=n>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j){[re[i],re[j]]=[re[j],re[i]];[im[i],im[j]]=[im[j],im[i]];}}
  for(let len=2;len<=n;len<<=1){const a=-2*Math.PI/len;for(let i=0;i<n;i+=len){for(let j=0;j<len/2;j++){const c=Math.cos(a*j),s=Math.sin(a*j),k=i+j+len/2;const tr=re[k]*c-im[k]*s,ti=re[k]*s+im[k]*c;re[k]=re[i+j]-tr;im[k]=im[i+j]-ti;re[i+j]+=tr;im[i+j]+=ti;}}}
  return {re,im};
}
export function spectrum(samples,sampleRate){const n=2**Math.floor(Math.log2(samples.length));const re=Float64Array.from(samples.slice(0,n)),im=new Float64Array(n);fft(re,im);return Array.from({length:n/2},(_,i)=>({frequency:i*sampleRate/n,amplitude:2*Math.hypot(re[i],im[i])/n}));}
export function stft(samples,sampleRate,windowSize=256,hop=Math.floor(windowSize/2)){const out=[];for(let start=0;start+windowSize<=samples.length;start+=hop){const w=new Array(windowSize);for(let i=0;i<windowSize;i++){const hann=.5*(1-Math.cos(2*Math.PI*i/(windowSize-1)));w[i]=samples[start+i]*hann;}out.push({time:start/sampleRate,spectrum:spectrum(w,sampleRate)});}return out;}
export function features(samples,sampleRate){const n=samples.length;const mean=samples.reduce((a,b)=>a+b,0)/n;const rms=Math.sqrt(samples.reduce((a,b)=>a+b*b,0)/n);const variance=samples.reduce((a,b)=>a+(b-mean)**2,0)/n;const spec=spectrum(samples,sampleRate);const peak=spec.reduce((a,b)=>b.amplitude>a.amplitude?b:a,spec[0]);const centroid=spec.reduce((a,b)=>a+b.frequency*b.amplitude,0)/(spec.reduce((a,b)=>a+b.amplitude,0)||1);return {samples:n,mean,rms,std:Math.sqrt(variance),peakFrequency:peak.frequency,peakAmplitude:peak.amplitude,spectralCentroid:centroid};}
export function pearson(a,b){if(a.length!==b.length||a.length<2)throw new Error('Equal arrays of length >=2 required');const ma=a.reduce((x,y)=>x+y,0)/a.length,mb=b.reduce((x,y)=>x+y,0)/b.length;let num=0,da=0,db=0;for(let i=0;i<a.length;i++){const x=a[i]-ma,y=b[i]-mb;num+=x*y;da+=x*x;db+=y*y;}return num/Math.sqrt(da*db);}
export function permutationTest(a,b,iterations=2000){const obs=Math.abs(a.reduce((x,y)=>x+y,0)/a.length-b.reduce((x,y)=>x+y,0)/b.length),pool=[...a,...b],n=a.length;let extreme=0;for(let k=0;k<iterations;k++){for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}const d=Math.abs(pool.slice(0,n).reduce((x,y)=>x+y,0)/n-pool.slice(n).reduce((x,y)=>x+y,0)/b.length);if(d>=obs)extreme++;}return {observedDifference:obs,pValue:(extreme+1)/(iterations+1),iterations};}
export function auditRecord(action,details={}){return {id:crypto.randomUUID(),timestamp:new Date().toISOString(),engine:'BioWave Research Engine',version:'1.0.0',action,details};}
