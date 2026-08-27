/* Optional TensorFlow.js feature extraction.
 * This module intentionally produces embeddings/statistical descriptors only.
 * It does not classify cancer, diagnose disease, or estimate patient outcomes.
 */
export function imageBasicFeatures(imageData){const d=imageData.data;let r=0,g=0,b=0,luma=[];for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];luma.push(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2]);}const n=luma.length,mean=luma.reduce((a,x)=>a+x,0)/n,variance=luma.reduce((a,x)=>a+(x-mean)**2,0)/n;return {width:imageData.width,height:imageData.height,pixels:n,meanRGB:[r/n,g/n,b/n],meanLuma:mean,lumaStd:Math.sqrt(variance)};}
export async function tfEmbedding(canvas){if(!globalThis.tf)throw new Error('TensorFlow.js is not loaded');const model=await tf.loadGraphModel('https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/feature_vector/5/default/1', {fromTFHub:true});const input=tf.tidy(()=>tf.browser.fromPixels(canvas).resizeBilinear([224,224]).toFloat().div(255).expandDims(0));const embedding=await model.predict(input).data();input.dispose();return Array.from(embedding);}
export function compareEmbeddings(a,b){if(a.length!==b.length)throw new Error('Embedding lengths differ');let dot=0,na=0,nb=0;for(let i=0;i<a.length;i++){dot+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i]}return dot/(Math.sqrt(na)*Math.sqrt(nb));}
