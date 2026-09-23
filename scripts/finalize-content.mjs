import {readFileSync,writeFileSync} from 'node:fs';
const p='scripts/site-templates.mjs';
let source=readFileSync(p,'utf8').replace("actions(lang,'','false'===true)",'actions(lang)');
source=source.replace('data-inquiry-form><div','data-inquiry-form method="post" action="https://inquiry.panpantechnology.com/api/inquiries"><div');
writeFileSync(p,source);
for(const lang of ['en','zh-cn']){
  for(const page of ['index','technology','solutions']){
    const path=`${lang}/${page}.html`;let html=readFileSync(path,'utf8');
    html=html.replaceAll('MagiRealm becomes the content-generation and story engine inside the platform','MagiRealm is the planned content-generation and story engine inside the platform');
    html=html.replaceAll('MagiRealm 保留为平台内的内容生成与故事引擎','MagiRealm 作为规划中的平台内容生成与故事引擎');
    // Qualification belongs next to the legacy platform narrative, not only in the footer.
    const note=lang==='en'?'<p class="section-note">Delivery scope: hardware and update firmware are confirmed by model. Content libraries, scheduling, groups and API integrations are not universal standard features; request a demonstration and written scope.</p>':'<p class="section-note">交付说明：硬件与换图固件按型号确认。内容库、定时、分组和 API 集成不是全型号标配，请先申请演示并确认书面交付范围。</p>';
    if(!html.includes('Delivery scope: hardware')&&!html.includes('交付说明：硬件'))html=html.replace('</main>',note+'</main>');
    writeFileSync(path,html);
  }
}
