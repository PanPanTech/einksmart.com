import {readFileSync,writeFileSync} from 'node:fs';
const edit=(path,changes)=>{let s=readFileSync(path,'utf8');for(const [a,b] of changes){if(s.includes(a))s=s.replaceAll(a,b);else if(!s.includes(b))throw new Error('Missing source: '+a.slice(0,80));}writeFileSync(path,s);};
edit('scripts/site-templates.mjs',[
 ['<link rel="stylesheet" href="/assets/catalog.css" />','<link rel="stylesheet" href="/assets/catalog.css" /><link rel="stylesheet" href="/assets/product-gallery.css" />'],
 ['<script src="/assets/site.js"></script></body>','<script src="/assets/site.js"></script><script src="/assets/product-gallery.js"></script></body>'],
 ['${text(p.type,lang)}</span><h3>','${text(p.type,lang)}</span><h3>'],
 ['<p class="model-code">${p.model}</p>','<p class="model-code">${p.model}</p>${p.status?`<span class="product-status">${text(p.status,lang)}</span>`:\'\'}'],
 ["${p.resolution} · ${p.ppi} ppi","${p.resolution==='To confirm'?tr(lang,'Specifications to confirm','规格待确认'):p.resolution}${p.ppi==='TBC'?'':' · '+p.ppi+' ppi'}"],
 ["${products.map(p=>`<a href=\"/${lang}/products/${p.slug}.html\">${text(p.name,lang)}</a>`).join('')}","${products.filter(p=>['AES-0750V','AES-1330CNC','AES-1330V','AES-2850V','AES-4050V'].includes(p.model)).map(p=>`<a href=\"/${lang}/products/${p.slug}.html\">${text(p.name,lang)}</a>`).join('')}<a href=\"/${lang}/product.html\">${tr(lang,'All sizes and configurations','全部尺寸与配置')}</a>"]
]);
edit('scripts/build-products.mjs',[
 ['specRows, quote }','specRows, quote, catalogGroups, productWorkflow }'],
 ['if(p.image) productSchema.image=base+p.image;','if(p.image) productSchema.image=(p.gallery||[{src:p.image}]).map(item=>base+item.src);'],
 ['${capabilities(lang)}<section class="section"><div class="container"><div class="section-head"><h2>${tr(lang,\'Before your sample or project order\'','${productWorkflow(p,lang)}<section class="section"><div class="container"><div class="section-head"><h2>${tr(lang,\'Before your sample or project order\''],
 ['<div><strong>${p.ppi} ppi</strong><span>${p.resolution}</span></div>','<div><strong>${p.ppi===\'TBC\'?tr(lang,\'Review\',\'待确认\'):p.ppi+\' ppi\'}</strong><span>${p.resolution===\'To confirm\'?tr(lang,\'Specifications pending\',\'规格待确认\'):p.resolution}</span></div>'],
 ['<h2>${tr(lang,\'Evaluate the right configuration.\',\'先验证适合的配置。\')}</h2>','<h2>${tr(lang,\'Evaluate the right configuration.\',\'先验证适合的配置。\')}</h2>${p.status?`<p class="product-status">${text(p.status,lang)}</p>`:\'\'}'],
 ['<div class="catalog-grid">${products.map(p=>card(p,lang)).join(\'\')}</div>','${catalogGroups(lang)}'],
 ['Color E-Ink Frames & Displays','Canvas E6 Product Range'],
 ['彩色电子纸画框与显示屏','Canvas E6 全尺寸产品'],
 ['Compare Canvas 13.3-inch frames and OEM inserts, A2 28.5-inch posters and 31.5-inch project displays. Request a sample, specifications or a project quote.','Explore 13 sizes from 1.54 to 40.5 inches: dual-screen calendars, finished frames, OEM inserts, project displays, Bluetooth tags and display components. Confirm the supply scope and availability of each configuration.'],
 ['对比 Canvas 13.3 英寸成品框与 OEM 内胆、A2 28.5 英寸海报屏及 31.5 英寸信息屏，申请样机、下载规格或获取项目报价。','从 1.54 到 40.5 英寸，按双屏日历、成品画框、OEM 内胆、商用大屏、蓝牙标签及显示组件选型。逐款确认交付形态与供应状态。'],
 ["${p.ppi} ppi · ${p.ratio}","${p.ppi==='TBC'?tr(lang,'Pixel density to confirm','像素密度待确认'):p.ppi+' ppi'} · ${p.ratio}"],
 ["p.size==='13.3'","['frame','insert','badge','tag'].includes(p.kind)"]
]);
console.log('Updated catalog templates for galleries, category selection and model-specific workflows.');
