import {readFileSync,writeFileSync} from 'node:fs';
import {parse} from 'parse5';
const nodes=n=>[n,...(n.childNodes||[]).flatMap(nodes)];
const words=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(words).join('');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
for(const lang of ['en','zh-cn'])for(const page of ['index','technology']){
 const path=`${lang}/${page}.html`;let html=readFileSync(path,'utf8');const doc=parse(html,{sourceCodeLocationInfo:true}), edits=[];
 const replacement=lang==='en'?'MagiRealm is a planned content-generation and story-engine capability. Expanded AI scene creation and licensed-library workflows are still being developed and are not standard hardware features. Request current availability and an agreed scope before including them in a project.':'MagiRealm 是规划中的内容生成与故事引擎。扩展 AI 场景生成及授权内容库流程仍在开发，不是硬件标配；如需纳入项目，请先确认当前可用功能与交付范围。';
 for(const n of nodes(doc).filter(n=>n.tagName==='p'&&words(n).includes('MagiRealm'))){const l=n.sourceCodeLocation;edits.push([l.startOffset,l.endOffset,`<p>${replacement}</p>`]);}
 if(page==='technology'){
  const list=nodes(doc), software=list.find(n=>attr(n,'id')==='software'), hero=list.find(n=>(attr(n,'class')||'').split(' ').includes('page-hero'));
  if(software&&hero&&software.sourceCodeLocation.startOffset<hero.sourceCodeLocation.startOffset){const l=software.sourceCodeLocation;edits.push([l.startOffset,l.endOffset,'']);edits.push([hero.sourceCodeLocation.endOffset,hero.sourceCodeLocation.endOffset,html.slice(l.startOffset,l.endOffset)]);}
 }
 for(const [a,b,s] of edits.sort((a,b)=>b[0]-a[0]))html=html.slice(0,a)+s+html.slice(b);
 writeFileSync(path,html);
}
const article='en/blog/insights/best-color-e-ink-photo-frames-2026.html';
writeFileSync(article,readFileSync(article,'utf8').replace('and MagiRealm compared for real-world buyers.','and einksmart Canvas compared for real-world buyers.').replace('See MagiRealm frames and the content platform','Compare Canvas frames, inserts and project displays'));
for(const name of ['e-ink-picture-frames-explained','best-color-e-ink-photo-frames-2026','frame-tv-alternatives']){
 const file=`en/blog/insights/${name}.html`;let html=readFileSync(file,'utf8');const doc=parse(html,{sourceCodeLocationInfo:true}),edits=[];
 for(const n of nodes(doc).filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json')){
  let data=JSON.parse(words(n));const update=o=>{if(!o||typeof o!=='object')return;if(['Article','BlogPosting'].includes(o['@type']))o.dateModified='2026-09-23';for(const v of Object.values(o))if(typeof v==='object')Array.isArray(v)?v.forEach(update):update(v);};update(data);edits.push([n.sourceCodeLocation.startTag.endOffset,n.sourceCodeLocation.endTag.startOffset,JSON.stringify(data,null,2)]);
 }
 for(const [a,b,s] of edits.sort((a,b)=>b[0]-a[0]))html=html.slice(0,a)+s+html.slice(b);
 writeFileSync(file,html);
}
