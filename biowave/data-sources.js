/* Public research-data connectors. They return source metadata alongside data.
 * GDC is used as a discovery/API source; no patient-level data is persisted by this demo.
 */
export const SOURCES={
  GDC:{name:'NCI Genomic Data Commons',publisher:'National Cancer Institute',url:'https://gdc.cancer.gov/',api:'https://api.gdc.cancer.gov/'},
  TCGA:{name:'The Cancer Genome Atlas',publisher:'National Cancer Institute / NHGRI',url:'https://www.cancer.gov/ccg/research/genome-sequencing/tcga',api:'https://api.gdc.cancer.gov/'},
  NCI_DATASETS:{name:'NCI Data Resources',publisher:'National Cancer Institute',url:'https://www.cancer.gov/research/resources/data-sets',api:null}
};
export async function gdcProjectSummary(projectId){const url=`https://api.gdc.cancer.gov/projects/${encodeURIComponent(projectId)}`;const r=await fetch(url);if(!r.ok)throw new Error(`GDC request failed: ${r.status}`);const json=await r.json();return {provenance:{source:SOURCES.GDC.name,publisher:SOURCES.GDC.publisher,sourceUrl:SOURCES.GDC.url,apiUrl:url,retrievedAt:new Date().toISOString()},data:json.data};}
export async function searchGdcProjects(term='TCGA'){const url='https://api.gdc.cancer.gov/projects?size=100&from=0';const r=await fetch(url);if(!r.ok)throw new Error(`GDC request failed: ${r.status}`);const json=await r.json();const hits=(json.data?.hits||[]).filter(x=>JSON.stringify(x).toLowerCase().includes(term.toLowerCase()));return {provenance:{source:SOURCES.GDC.name,publisher:SOURCES.GDC.publisher,sourceUrl:SOURCES.GDC.url,apiUrl:url,retrievedAt:new Date().toISOString()},data:hits};}
export function provenanceEnvelope(payload,sourceKey='GDC'){return {schemaVersion:'1.0',retrievedAt:new Date().toISOString(),source:SOURCES[sourceKey],payload};}
