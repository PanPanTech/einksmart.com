import {readFileSync, writeFileSync, readdirSync, existsSync} from 'node:fs';
import {parse} from 'parse5';
import {header, products, card, capabilities, inquiryForm, tr, quote} from './site-templates.mjs';

const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const has=(n,c)=>(attr(n,'class')||'').split(' ').includes(c);
const all=(n,p)=>[...(p(n)?[n]:[]),...(n.childNodes||[]).flatMap(c=>all(c,p))];
const words=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(words).join('');
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(dir+'/'+e.name):e.name.endsWith('.html')?[dir+'/'+e.name]:[]);}
for(const file of [...files('en'),...files('zh-cn')]) {
  const lang=file.startsWith('en/')?'en':'zh-cn', other=lang==='en'?'zh-cn':'en';
  let html=readFileSync(file,'utf8');
  // Generated pages already contain the shared navigation and scripts.
  if(html.includes('class="catalog-page"')) continue;
  const doc=parse(html,{sourceCodeLocationInfo:true}), edits=[];
  const nodes=p=>all(doc,p), first=p=>nodes(p)[0];
  const replace=(n,value)=>{if(n?.sourceCodeLocation)edits.push([n.sourceCodeLocation.startOffset,n.sourceCodeLocation.endOffset,value]);};
  const insert=(offset,value)=>edits.push([offset,offset,value]);
  const oldHeader=first(n=>n.tagName==='header'&&has(n,'site-header'));
  const relative=file.slice(lang.length+1), counterpart=other+'/'+relative;
  const alternate=existsSync(counterpart)?'/'+counterpart.replace(/index\.html$/,''):`/${other}/blog/`;
  if(oldHeader)replace(oldHeader,header(lang,relative==='index.html'?'':relative.startsWith('blog/')?'blog/':relative).replace('__ALTERNATE__',alternate));
  const head=first(n=>n.tagName==='head'), body=first(n=>n.tagName==='body');
  if(!html.includes('/assets/catalog.css'))insert(head.sourceCodeLocation.endTag.startOffset,'<link rel="stylesheet" href="/assets/catalog.css" />\n');
  const scripts=nodes(n=>n.tagName==='script'&&attr(n,'src'));
  for(const n of scripts.filter(n=>/\/(analytics-config|analytics|site)\.js$/.test(attr(n,'src'))))replace(n,'');
  insert(body.sourceCodeLocation.endTag.startOffset,'<script src="/assets/analytics-config.js"></script><script src="/assets/analytics.js"></script><script src="/assets/site.js"></script>\n');
  const footer=first(n=>n.tagName==='footer');
  if(footer&&!html.includes(`/${lang}/privacy.html`)){
    const privacy=`<a href="/${lang}/privacy.html">${tr(lang,'Privacy','隐私说明')}</a>`;
    const legal=nodes(n=>has(n,'footer-legal')).pop();
    if(legal)insert(legal.sourceCodeLocation.endTag.startOffset,privacy);
    else insert(footer.sourceCodeLocation.endTag.startOffset,`<div class="container footer-legal">${privacy}</div>`);
  }
  if(relative==='partners.html')for(const form of nodes(n=>n.tagName==='form'))replace(form,inquiryForm(lang,true));
  if(relative==='index.html'){
    const hero=first(n=>has(n,'hero'));
    if(hero&&!html.includes('id="canvas-models"'))insert(hero.sourceCodeLocation.endOffset,`<section class="section" id="canvas-models"><div class="container"><div class="section-head"><span class="eyebrow">Canvas</span><h2>${tr(lang,'Color E-Ink hardware for your next project.','为下一个项目选择彩色电子纸硬件。')}</h2><p>${tr(lang,'Finished frames, OEM inserts and project displays. Start with a sample and a defined delivery scope.','成品画框、OEM 内胆与项目显示屏，从样机与明确的交付范围开始。')}</p></div><div class="catalog-grid">${products.map(p=>card(p,lang)).join('')}</div><p><a class="text-link" href="/${lang}/product.html#compare">${tr(lang,'Compare all models and panel modules','对比全部型号与裸屏模组')}</a></p></div></section>`);
    replace(first(n=>has(n,'hero-copy')),`<p class="hero-copy">${tr(lang,'Explore Canvas color E-Ink frames, OEM inserts and large-format displays for hospitality, galleries and retail. Evaluate a sample, then agree the hardware and software scope for your deployment.','探索 Canvas 彩色电子纸画框、OEM 内胆与大尺寸显示屏，适用于酒店、画廊与零售。先验证样机，再确定项目的硬件与软件范围。')}</p>`);
    replace(first(n=>has(n,'hero-actions')),`<div class="hero-actions"><a class="btn teal" data-analytics="quote_click" href="${quote(lang)}">${tr(lang,'Get a Quote','获取报价')}</a><a class="btn secondary" href="/${lang}/product.html">${tr(lang,'Explore Products','查看产品')}</a></div>`);
    replace(first(n=>has(n,'hero-facts')),`<div class="hero-facts"><div><strong>13.3 / 28.5 / 31.5</strong><span>${tr(lang,'Frame, insert and display formats','成品框、内胆与显示屏')}</span></div><div><strong>${tr(lang,'Sample first','样机先行')}</strong><span>${tr(lang,'Validate artwork and update workflow','验证实际图片与换图流程')}</span></div><div><strong>${tr(lang,'Defined scope','明确范围')}</strong><span>${tr(lang,'Hardware, firmware and project options','硬件、固件及项目选配')}</span></div></div>`);
    replace(first(n=>has(n,'trust-strip')),'');
    const map=first(n=>has(n,'platform-map')); let section=map;while(section&&section.tagName!=='section')section=section.parentNode;
    if(section)replace(section,capabilities(lang));
  }
  if(relative==='technology.html'||relative==='solutions.html'){
    const main=first(n=>n.tagName==='main');
    if(!html.includes('id="software"'))insert(main.sourceCodeLocation.startTag.endOffset,capabilities(lang));
  }
  if(relative==='sitemap.html'&&!html.includes('products/canvas-13-3-cnc.html')){
    const main=first(n=>n.tagName==='main');
    insert(main.sourceCodeLocation.endTag.startOffset,`<section class="section"><div class="container"><h2>Canvas</h2><ul>${products.map(p=>`<li><a href="/${lang}/products/${p.slug}.html">${p.name[lang]}</a></li>`).join('')}<li><a href="/${lang}/products/e6-panel-modules.html">A1 / A2 / A3 E6</a></li></ul></div></section>`);
  }
  const targets=['e-ink-picture-frames-explained.html','best-color-e-ink-photo-frames-2026.html','frame-tv-alternatives.html'];
  if(lang==='en'&&targets.some(s=>relative.endsWith(s))){
    const ownCopy='<p><strong>Best for: B2B samples, OEM frames and project deployments.</strong> The Canvas range includes a <a href="/en/products/canvas-13-3-cnc.html">13.3-inch aluminium frame</a>, a <a href="/en/products/canvas-13-3-insert.html">13.3-inch OEM insert</a>, an <a href="/en/products/canvas-a2-28-5.html">A2 28.5-inch display</a> and a <a href="/en/products/canvas-31-5.html">31.5-inch landscape display</a>. Sample and project pricing is quoted by configuration. Software, power and installation differ by model; scheduling, groups and CMS require a demonstrated, agreed project scope. This is not a ready-made family photo-sharing service.</p>';
    for(const n of nodes(n=>n.tagName==='h3'&&words(n).includes('einksmart MagiRealm')))replace(n,'<h3>einksmart Canvas: samples, OEM and project displays</h3>');
    for(const n of nodes(n=>n.tagName==='p'&&(/We build 7\.3/.test(words(n))||(/MagiRealm/.test(words(n))&&/real.wood|smaller|13\.3/i.test(words(n))))))replace(n,ownCopy);
    for(const n of nodes(n=>n.tagName==='tr'&&words(n).includes('einksmart MagiRealm'))){
      const cells=all(n,c=>c.tagName==='td');
      const vals=relative.endsWith('frame-tv-alternatives.html')?['einksmart Canvas','Color E-Ink','13.3 / 28.5 / 31.5 inches','Request a quote','By configuration','Confirm project scope']:['einksmart Canvas','13.3 / 28.5 / 31.5 inches','Sample / project quotation','Finished frame, OEM insert and project displays','B2B samples and integration','Software and delivery scope confirmed per project'];
      replace(n,'<tr>'+cells.map((_,i)=>'<td>'+vals[i]+'</td>').join('')+'</tr>');
    }
    const article=first(n=>n.tagName==='article');
    if(article&&!html.includes('id="canvas-selection"'))insert(article.sourceCodeLocation.endTag.startOffset,`<section class="blog-product-bridge" id="canvas-selection"><h2>Planning a sample or a commercial deployment?</h2><p>Choose a finished frame, an OEM insert or a project display before comparing quotes.</p><ul>${products.map(p=>`<li><a href="/en/products/${p.slug}.html" data-placement="blog-selection">${p.name.en}</a> · ${p.fit.en}</li>`).join('')}</ul><a class="btn teal" data-analytics="sample_request" data-placement="blog" href="${quote(lang,'AES-1330CNC','sample')}">Request a Sample Quote</a><p class="source-note">Canvas supply information updated September 23, 2026. Competitor pricing retains the original article reference date; confirm current offers with each supplier.</p></section>`);
  }
  edits.sort((a,b)=>b[0]-a[0]);
  let boundary=Infinity;
  for(const [start,end,value] of edits){if(end>boundary)throw new Error('Overlapping edits '+file);html=html.slice(0,start)+value+html.slice(end);boundary=start;}
  writeFileSync(file,html);
}
console.log('Integrated shared navigation, inquiry forms and product entry points.');
