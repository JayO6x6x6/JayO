const KEY='biowave.experiments.v1';
const AUDIT='biowave.audit.v1';
export function loadExperiments(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
export function saveExperiment(experiment){const record={id:crypto.randomUUID(),createdAt:new Date().toISOString(),schemaVersion:'1.0',...experiment};const all=loadExperiments();all.push(record);localStorage.setItem(KEY,JSON.stringify(all));audit('experiment.created',{id:record.id,name:record.name});return record;}
export function audit(action,details={}){const all=JSON.parse(localStorage.getItem(AUDIT)||'[]');all.push({id:crypto.randomUUID(),timestamp:new Date().toISOString(),action,details});localStorage.setItem(AUDIT,JSON.stringify(all));}
export function exportJSON(value,filename='biowave-export.json'){download(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),filename)}
export function exportCSV(rows,filename='biowave-export.csv'){if(!rows.length)return;const keys=[...new Set(rows.flatMap(x=>Object.keys(x)))];const esc=v=>`"${String(v??'').replaceAll('"','""')}"`;const csv=[keys.map(esc).join(','),...rows.map(r=>keys.map(k=>esc(r[k])).join(','))].join('\n');download(new Blob([csv],{type:'text/csv'}),filename)}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
export function reproducibilityManifest(config){return {schemaVersion:'1.0',createdAt:new Date().toISOString(),app:'BioWave Sonic Health Lab',config,environment:{userAgent:navigator.userAgent,language:navigator.language},codeVersion:'main'}}
