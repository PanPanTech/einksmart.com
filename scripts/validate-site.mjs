import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {parse} from 'parse5';
const root=process.cwd(), errors=[];
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):e.name.endsWith('.html')?[d+'/'+e.name]:[]);
const nodes=n=>[n,...(n.childNodes||[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const files=[...walk('en'),...walk('zh-cn')];
for(const file of files){
 const html=readFileSync(file,'utf8'), list=nodes(parse(html));
 const canonical=list.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical');
 if(!attr(canonical||{},'href')?.startsWith('https://www.einksmart.com/'))errors.push(file+': canonical');
 for(const n of list){
   if(n.tagName==='script'&&attr(n,'type')==='application/ld+json')try{JSON.parse(n.childNodes.map(c=>c.value||'').join(''));}catch{errors.push(file+': invalid JSON-LD');}
   const ref=attr(n,'src')||(n.tagName==='a'||n.tagName==='link'?attr(n,'href'):null);
   if(!ref||/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(ref))continue;
   const pathname=decodeURIComponent(ref.split(/[?#]/)[0]);
   let target=pathname.startsWith('/')?resolve(root,'.'+pathname):resolve(dirname(resolve(file)),pathname);
   if(existsSync(target)&&statSync(target).isDirectory())target=resolve(target,'index.html');
   if(!existsSync(target))errors.push(file+': missing '+ref);
 }
 if(list.filter(n=>n.tagName==='script'&&attr(n,'src')==='/assets/site.js').length!==1)errors.push(file+': shared script count');
 if(file.includes('/products/')&&(/"offers"|"aggregateRating"/.test(html)))errors.push(file+': unapproved commerce schema');
}
const sitemap=readFileSync('sitemap.xml','utf8');
for(const file of files.filter(f=>f.includes('/products/')||f.endsWith('/privacy.html')))if(!sitemap.includes('https://www.einksmart.com/'+file))errors.push(file+': absent sitemap');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Validation passed: ${files.length} HTML files, local assets/links, canonical and JSON-LD.`);
