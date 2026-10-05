import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { base, products, tr, text, escape, shell, card, actions, quote } from './site-templates.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = (path, html) => { const dest=resolve(root,path); mkdirSync(dirname(dest),{recursive:true}); writeFileSync(dest,html); };
const bySlug = Object.fromEntries(products.map(p=>[p.slug,p]));
const pick = (...slugs) => slugs.map(s=>bySlug[s]).filter(Boolean);
const list = (items) => `<ul class="feature-list">${items.map(v=>`<li>${v}</li>`).join('')}</ul>`;
const path = 'e-ink-digital-signage.html';

const groups = [
  { id:'lobby', slugs:['canvas-a1-40-5','canvas-a2-28-5','canvas-a3-20-2'],
    title:['Hotel lobbies, galleries and reception walls','酒店大堂、画廊与前台墙面'],
    body:['Replace printed A1, A2 and A3 posters that change weekly or seasonally. The paper-ratio formats match existing poster frames and artwork, and the screen does not glow in a quiet interior.','替代每周或每季更换的 A1、A2、A3 纸质海报。纸张比例与现有海报框和画作一致，屏幕不发光，适合安静的室内空间。'] },
  { id:'retail', slugs:['canvas-31-5','canvas-a2-28-5'],
    title:['Retail, campus and information boards','零售、园区与信息公告板'],
    body:['Promotions, wayfinding, menus and notices that update a few times a day rather than every few seconds. Choose the landscape 31.5″ where a TV-shaped board is expected, or A2 for portrait posters.','适合一天更新几次、而非每隔几秒滚动的促销、导视、菜单与通知。需要横向“电视比例”的位置选 31.5″，竖版海报选 A2。'] },
  { id:'rooms', slugs:['canvas-5-89-tag','canvas-3-7-badge','canvas-calendar-7-5'],
    title:['Door signs, room labels and desks','门牌、房间标识与桌面'],
    body:['Small magnetic tags and badges for room names, door signs and staff identification, plus a dual-screen desk calendar for reception counters. These update over Bluetooth from a phone app.','小尺寸磁吸标签与工牌，用于房间名、门牌与员工标识；双屏桌面日历适合前台。这些型号通过手机 App 蓝牙更新。'] },
  { id:'art', slugs:['canvas-13-3-cnc'],
    title:['Art walls and branded interiors','艺术墙与品牌空间'],
    body:['A finished 13.3″ aluminium frame for rotating artwork, brand imagery and small pilot deployments, with Wi-Fi image push and TF-card import.','13.3″ 铝合金成品画框，用于轮换艺术作品、品牌画面与小批量试点，支持 Wi-Fi 推送与 TF 卡导入图片。'] },
];
const tableModels = pick('canvas-a1-40-5','canvas-a2-28-5','canvas-a3-20-2','canvas-31-5','canvas-13-3-cnc','canvas-5-89-tag','canvas-calendar-7-5');

const faqs = [
  ['Can color E-Ink signage play video or animation?','彩色电子纸标牌能播放视频或动画吗？',
   'No. Color E-Ink shows still images and redraws the whole screen in several seconds, with a visible refresh. It suits content that changes a few times a day or less. Use LCD where video, motion or rapid slideshows are required.',
   '不能。彩色电子纸只显示静态图片，整屏刷新需要数秒且过程可见，适合一天更新几次或更低频的内容。需要视频、动画或快速轮播的位置请使用 LCD。'],
  ['Does it need a power cable?','需要接电源线吗？',
   'Not always. The panel holds an image without continuous power, so smaller models run on rechargeable batteries. The large A1, A2, A3 and 31.5″ displays use an external battery pack or mains power, chosen per project. Controllers and wireless connections still use some power, so battery life depends on how often the image changes.',
   '不一定。面板保持画面不需要持续供电，因此小尺寸型号使用充电电池。A1、A2、A3 与 31.5″ 大屏按项目选择外置电池包或市电供电。主控与无线连接仍会耗电，续航取决于换图频率。'],
  ['Can meeting-room signs sync with Outlook or Google Calendar?','会议室门牌能和 Outlook 或 Google 日历同步吗？',
   'Not as a standard feature. Door tags and badges update from a phone app over Bluetooth, which suits room names, fixed schedules and notices. Live room-booking status from a calendar system needs gateway and integration work that is scoped as a separate project option.',
   '不是标准功能。门牌与工牌通过手机 App 蓝牙更新，适合房间名称、固定日程与通知。若要从日历系统实时显示会议室占用状态，需要网关与系统对接，作为单独的项目选配评估。'],
  ['How is content updated across many screens?','多块屏幕的内容如何统一更新？',
   'It depends on the model. The 13.3″ frames support Wi-Fi image push and TF-card import; the small tags use a Bluetooth phone app; large displays use a remote update workflow confirmed with the project firmware. Scheduling, device groups, CMS and API integration are project options, included only when demonstrated and agreed.',
   '取决于型号。13.3″ 画框支持 Wi-Fi 推送与 TF 卡导入；小尺寸标签使用手机蓝牙 App；大屏的远程更新流程随项目固件确认。定时排程、设备分组、CMS 与 API 对接属于项目选配，仅在演示并书面确认后纳入交付。'],
  ['How do we start a project?','项目如何开始？',
   'Request a sample or a project quote with the model, quantity and destination. Test your own artwork on the sample, confirm the update method and installation, then agree the deployment configuration.',
   '提交型号、数量与目的地，申请样机或项目报价。先用自己的内容验证样机，确认更新方式与安装，再确定部署配置。'],
];

for (const lang of ['en','zh-cn']) {
  const title = tr(lang,'Color E-Ink Digital Signage for Lobbies & Retail','彩色电子纸数字标牌：酒店大堂、零售与办公空间');
  const meta = tr(lang,'Cordless color E-Ink signage that reads like print: A1–A3 poster displays, 31.5″ information boards and Bluetooth door signs. Compare models, power and updates.','像纸质海报一样的彩色电子纸标牌：A1–A3 海报屏、31.5 英寸信息板与蓝牙门牌。按场景对比型号、供电方式与内容更新方式，申请样机或项目报价。');
  const h1 = tr(lang,'Color E-Ink digital signage that reads like print.','像印刷品一样的彩色电子纸数字标牌。');
  const url = `${base}/${lang}/${path}`;
  const crumbs = `<nav class="breadcrumbs" aria-label="${tr(lang,'Breadcrumb','面包屑导航')}"><a href="/${lang}/">${tr(lang,'Home','首页')}</a><span aria-hidden="true">/</span><a href="/${lang}/solutions.html">${tr(lang,'Solutions','解决方案')}</a><span aria-hidden="true">/</span><span>${tr(lang,'Digital signage','数字标牌')}</span></nav>`;
  const intro = `<section class="product-intro"><div class="container">${crumbs}<span class="eyebrow">${tr(lang,'Color E-Ink signage','彩色电子纸标牌')}</span><h1>${h1}</h1><p class="product-lead">${tr(lang,'For walls that should inform without glowing: lobby posters, retail boards, room signs and art walls. Spectra 6 color displays from 3.7 to 40.5 inches, quoted as samples or projects.','面向“传达信息但不发光”的墙面：大堂海报、零售公告、房间门牌与艺术墙。Spectra 6 彩色电子纸，3.7 至 40.5 英寸，按样机或项目报价。')}</p>${actions(lang)}<p><a class="text-link" href="#models">${tr(lang,'Choose by application','按场景选型')}</a> · <a class="text-link" href="#compare">${tr(lang,'Compare power and updates','对比供电与更新方式')}</a></p></div></section>`;

  const answer = `<section class="section"><div class="container detail-grid"><div><h2>${tr(lang,'Where color E-Ink signage fits','彩色电子纸标牌适合哪里')}</h2><p>${tr(lang,'Color E-Ink is a reflective display: it shows a still image using ambient light, like paper, and keeps that image without continuous panel power. That makes it a strong replacement for printed posters and notices that change daily, weekly or seasonally, especially where there is no convenient power outlet.','彩色电子纸是反射式显示：像纸一样借助环境光呈现静态画面，并且保持画面不需要持续为面板供电。因此它很适合替代按天、按周或按季更换的纸质海报与通知，尤其是在不方便接电的位置。')}</p><p>${tr(lang,`It is not a replacement for video walls. If the content moves, LCD is still the right screen. Our <a class="text-link" href="/en/blog/insights/color-eink-vs-lcd-digital-signage.html">color E-Ink vs LCD signage guide</a> compares the two in detail.`,'它不能替代视频墙。内容需要动起来的位置，LCD 仍是正确选择。<a class="text-link" href="/zh-cn/blog/insights/color-eink-vs-lcd-digital-signage.html">彩色电子纸与 LCD 数字标牌对比</a>一文有详细说明。')}</p></div><div><h3>${tr(lang,'Key facts','要点')}</h3>${list(lang==='en'?[
    'Print-like color from six pigments (E Ink Spectra 6); no backlight or glare.',
    'Holds the image without continuous panel power; controller and wireless still use some energy.',
    'A full refresh takes several seconds and is visible: still images only, no video.',
    'Sizes from 3.7″ tags to A1 40.5″ poster displays; paper-ratio A-series formats.',
    'Update methods differ by model: Bluetooth app, Wi-Fi push, TF card or project firmware.',
  ]:[
    '六色颜料（E Ink Spectra 6）呈现类纸色彩，无背光、无眩光。',
    '保持画面无需持续为面板供电；主控与无线连接仍会耗电。',
    '整屏刷新需要数秒且过程可见：只适合静态图片，不能播放视频。',
    '尺寸覆盖 3.7″ 标签到 A1 40.5″ 海报屏，提供纸张比例的 A 系列规格。',
    '更新方式因型号而异：蓝牙 App、Wi-Fi 推送、TF 卡或项目固件。',
  ])}</div></div></section>`;

  const models = `<section class="section alt" id="models"><div class="container"><div class="section-head"><h2>${tr(lang,'Choose by application','按应用场景选型')}</h2><p>${tr(lang,'Start from the wall and the content, then pick the format. Every model can be evaluated as a sample before a project order.','先确定墙面位置与内容，再选择尺寸规格。每款型号都可以先申请样机评估，再下项目订单。')}</p></div>${groups.map(g=>`<section class="catalog-family" id="${g.id}"><div class="section-head"><h3>${tr(lang,...g.title)}</h3><p>${tr(lang,...g.body)}</p></div><div class="catalog-grid">${pick(...g.slugs).map(p=>card(p,lang)).join('')}</div></section>`).join('')}</div></section>`;

  const rooms = `<section class="section" id="meeting-rooms"><div class="container detail-grid"><div><span class="eyebrow">${tr(lang,'Meeting rooms','会议室')}</span><h2>${tr(lang,'Meeting-room and door signs: what is standard','会议室与门牌：哪些是标准功能')}</h2><p>${tr(lang,'The 5.89″ magnetic tag and the 3.7″ badge show room names, team names, fixed timetables and notices, and are updated from a phone app over Bluetooth. They run on small rechargeable batteries with Qi charging, so no cabling is needed at the door.','5.89″ 磁吸标签与 3.7″ 工牌可显示房间名、部门名、固定日程与通知，通过手机 App 蓝牙更新。它们使用小容量充电电池并支持 Qi 无线充电，门口无需布线。')}</p><p>${tr(lang,'Live booking status pulled from Outlook, Google Calendar or a room-booking system is <strong>not</strong> a standard feature. It requires a gateway workflow and integration that we scope, demonstrate and quote as a separate project option.','从 Outlook、Google 日历或会议室预订系统实时读取占用状态<strong>不是</strong>标准功能，需要网关流程与系统对接，我们会作为单独的项目选配进行评估、演示和报价。')}</p>${actions(lang,'AES-0589V',true)}</div><div><table class="spec-table"><tbody><tr><th scope="row">${tr(lang,'Room name, door sign, notices','房间名、门牌、通知')}</th><td>${tr(lang,'Standard: Bluetooth phone app','标准：手机蓝牙 App')}</td></tr><tr><th scope="row">${tr(lang,'Fixed weekly timetable','固定每周日程')}</th><td>${tr(lang,'Standard: update the image when it changes','标准：日程变化时更新图片')}</td></tr><tr><th scope="row">${tr(lang,'Many signs from one place','集中管理多块门牌')}</th><td>${tr(lang,'Project option: gateway workflow','项目选配：网关流程')}</td></tr><tr><th scope="row">${tr(lang,'Live calendar booking status','日历实时占用状态')}</th><td>${tr(lang,'Project option: integration scoped separately','项目选配：系统对接单独评估')}</td></tr></tbody></table></div></div></section>`;

  const compare = `<section class="section alt" id="compare"><div class="container"><div class="section-head"><h2>${tr(lang,'Power and content updates by model','各型号的供电与内容更新方式')}</h2><p>${tr(lang,'Battery life depends on how often the image changes and how the wireless connection is used. Confirm the configuration for your schedule before ordering.','续航取决于换图频率与无线连接方式。订购前请按实际更新计划确认配置。')}</p></div><div class="table-scroll" tabindex="0" role="region" aria-label="${tr(lang,'Signage model comparison','标牌型号对比')}"><table class="spec-table comparison-table"><thead><tr><th>${tr(lang,'Model','型号')}</th><th>${tr(lang,'Size · resolution','尺寸 · 分辨率')}</th><th>${tr(lang,'Power','供电')}</th><th>${tr(lang,'Image updates','图片更新')}</th></tr></thead><tbody>${tableModels.map(p=>`<tr><th scope="row"><a href="/${lang}/products/${p.slug}.html">${text(p.name,lang)}</a><small>${p.model}</small></th><td>${p.size}″ · ${p.resolution}</td><td>${escape(text(p.power,lang))}</td><td>${escape(text(p.updates,lang))}</td></tr>`).join('')}</tbody></table></div><p class="section-note">${tr(lang,'Scheduling, device groups, CMS and API/SDK integration are scoped by model and project. Only demonstrated and agreed functions are included in delivery.','定时排程、设备分组、CMS 与 API/SDK 对接按型号与项目评估，仅演示并确认的功能纳入交付。')}</p></div></section>`;

  const vs = `<section class="section"><div class="container"><div class="section-head"><h2>${tr(lang,'Color E-Ink or LCD signage?','选彩色电子纸还是 LCD 标牌？')}</h2></div><div class="table-scroll" tabindex="0" role="region" aria-label="${tr(lang,'E-Ink vs LCD','电子纸与 LCD 对比')}"><table class="spec-table comparison-table"><thead><tr><th></th><th>${tr(lang,'Color E-Ink','彩色电子纸')}</th><th>LCD</th></tr></thead><tbody>${[
    ['Look in the room','空间观感','Reflective, paper-like, no glow','反射式、类纸、不发光','Bright, backlit, draws attention','高亮背光、吸引注意'],
    ['Content','内容类型','Still images, a few changes a day','静态图片，每天更新几次','Video, animation, live feeds','视频、动画、实时内容'],
    ['Power at the wall','墙面供电','Battery or mains, by model','按型号选择电池或市电','Mains power required','必须接市电'],
    ['Daylight readability','日光下可读性','Improves with ambient light','环境光越亮越清晰','Needs high brightness','需要更高亮度'],
    ['Best fit','最适合','Posters, notices, art, door signs','海报、通知、艺术画面、门牌','Advertising loops, menus with motion','广告轮播、动态菜单'],
  ].map(r=>`<tr><th scope="row">${tr(lang,r[0],r[1])}</th><td>${tr(lang,r[2],r[3])}</td><td>${tr(lang,r[4],r[5])}</td></tr>`).join('')}</tbody></table></div></div></section>`;

  const steps = `<section class="section alt"><div class="container"><div class="section-head"><h2>${tr(lang,'From sample to deployment','从样机到部署')}</h2></div><div class="delivery-steps"><div><strong>01</strong><h3>${tr(lang,'Select','选型')}</h3><p>${tr(lang,'Wall, content, size and power for each location.','确定每个点位的墙面、内容、尺寸与供电。')}</p></div><div><strong>02</strong><h3>${tr(lang,'Evaluate','验证')}</h3><p>${tr(lang,'Your artwork on a sample; refresh and update method.','用样机验证实际内容、刷新效果与更新方式。')}</p></div><div><strong>03</strong><h3>${tr(lang,'Specify','定配置')}</h3><p>${tr(lang,'Quantity, software scope, warranty and delivery.','确定数量、软件范围、保修与交付。')}</p></div><div><strong>04</strong><h3>${tr(lang,'Deploy','部署')}</h3><p>${tr(lang,'Production, shipping and installation plan.','安排生产、运输与安装。')}</p></div></div></div></section>`;

  const faq = `<section class="section"><div class="container"><div class="section-head"><h2>${tr(lang,'Questions buyers ask','常见问题')}</h2></div><div class="faq">${faqs.map(f=>`<details><summary>${tr(lang,f[0],f[1])}</summary><p>${tr(lang,f[2],f[3])}</p></details>`).join('')}</div><div class="conversion-band"><div><h2>${tr(lang,'Tell us about the wall.','告诉我们墙面的情况。')}</h2><p>${tr(lang,'Share the locations, content and quantity. We will suggest models and the next evaluation step.','告诉我们点位、内容与数量，我们会建议型号与下一步评估方式。')}</p></div>${actions(lang)}</div></div></section>`;

  const schema = [
    {'@type':'WebPage','@id':url+'#webpage',name:title,description:meta,url,inLanguage:lang==='en'?'en':'zh-CN',isPartOf:{'@type':'WebSite',name:'einksmart',url:base+'/'},publisher:{'@type':'Organization',name:'einksmart',url:base+'/'},
     mainEntity:{'@type':'ItemList',itemListElement:groups.flatMap(g=>g.slugs).filter((s,i,a)=>a.indexOf(s)===i).map((s,i)=>({'@type':'ListItem',position:i+1,name:text(bySlug[s].name,lang),url:`${base}/${lang}/products/${s}.html`}))}},
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:tr(lang,'Home','首页'),item:`${base}/${lang}/`},{'@type':'ListItem',position:2,name:tr(lang,'Solutions','解决方案'),item:`${base}/${lang}/solutions.html`},{'@type':'ListItem',position:3,name:tr(lang,'Digital signage','数字标牌'),item:url}]},
    {'@type':'FAQPage',mainEntity:faqs.map(f=>({'@type':'Question',name:tr(lang,f[0],f[1]),acceptedAnswer:{'@type':'Answer',text:tr(lang,f[2],f[3])}}))},
  ];
  output(`${lang}/${path}`, shell({lang,path,title,description:meta,main:intro+answer+models+rooms+compare+vs+steps+faq,active:'solutions.html',schema}));
}
console.log('Generated bilingual color E-Ink digital signage page.');
