import {readFileSync,writeFileSync} from 'node:fs';
import {parse} from 'parse5';
import {products,card,inquiryForm,tr} from './site-templates.mjs';
const all=n=>[n,...(n.childNodes||[]).flatMap(all)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
for(const lang of ['en','zh-cn']){
 for(const name of ['index','partners','sitemap']){
  const path=`${lang}/${name}.html`;let html=readFileSync(path,'utf8');const nodes=all(parse(html,{sourceCodeLocationInfo:true}));const edits=[];
  const replace=(node,value)=>{const l=node.sourceCodeLocation;edits.push([l.startOffset,l.endOffset,value]);};
  if(name==='index'){
   if(!html.includes('/assets/product-gallery.css')){
    const head=nodes.find(n=>n.tagName==='head');edits.push([head.sourceCodeLocation.endTag.startOffset,head.sourceCodeLocation.endTag.startOffset,'<link rel="stylesheet" href="/assets/product-gallery.css" />']);
   }
   const section=nodes.find(n=>attr(n,'id')==='canvas-models');
   const grid=all(section).find(n=>attr(n,'class')==='catalog-grid');
   const featured=['AES-0750V','AES-1330CNC','AES-2850V','AES-4050V'].map(m=>products.find(p=>p.model===m));
   replace(grid,`<div class="catalog-grid">${featured.map(p=>card(p,lang)).join('')}</div>`);
  }
  if(name==='partners')for(const form of nodes.filter(n=>n.tagName==='form'))replace(form,inquiryForm(lang,true));
  if(name==='sitemap'){
   const main=nodes.find(n=>n.tagName==='main'),marker=nodes.find(n=>attr(n,'id')==='e6-range-links');
   const content=`<section class="section" id="e6-range-links"><div class="container"><h2>${tr(lang,'Full Canvas E6 range','Canvas E6 全系列')}</h2><ul>${products.map(p=>`<li><a href="/${lang}/products/${p.slug}.html">${p.name[lang]}</a></li>`).join('')}</ul></div></section>`;
   if(marker)replace(marker,content);else edits.push([main.sourceCodeLocation.endTag.startOffset,main.sourceCodeLocation.endTag.startOffset,content]);
  }
  for(const [a,b,value] of edits.sort((a,b)=>b[0]-a[0]))html=html.slice(0,a)+value+html.slice(b);
  writeFileSync(path,html);
 }
}
let llms=readFileSync('llms.txt','utf8');
const start=llms.indexOf('## Canvas Product Selection'),end=llms.indexOf('## Primary Site');
llms=llms.slice(0,start)+'## Canvas Product Selection\n\n'+products.map(p=>`- ${p.name.en}, ${p.model} (${p.status.en}): https://www.einksmart.com/en/products/${p.slug}.html`).join('\n')+'\n- A1/A2/A3 open-cell panels + TCON: https://www.einksmart.com/en/products/e6-panel-modules.html\n\nSample and project pricing is by quotation. 7.09-inch units are DVT engineering samples. Confirm 5.89-inch sample scheduling and A3 batch availability. 1.54-inch specifications and the 7.3-inch complete-unit configuration require review. Bluetooth devices do not inherit Wi-Fi frame features. Scheduling, CMS and APIs are not universal standard features.\n\n'+llms.slice(end);
writeFileSync('llms.txt',llms);
