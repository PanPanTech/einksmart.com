const {test}=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4187';
const api='https://inquiry.panpantechnology.com/api/inquiries';
test('responsive product pages and inquiry conversion lifecycle',async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try {
  const context=await browser.newContext();
  await context.addInitScript(()=>{window.qaEvents=[];document.addEventListener('einksmart:analytics',e=>window.qaEvents.push(e.detail));});
  const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [1440,390,360]){
   await page.setViewportSize({width,height:900});
   for(const path of ['/en/','/en/product.html','/zh-cn/product.html','/en/products/canvas-13-3-cnc.html','/en/products/canvas-31-5.html','/en/products/canvas-a2-28-5.html','/en/products/e6-panel-modules.html','/zh-cn/products/canvas-13-3-insert.html','/en/contact.html','/zh-cn/contact.html','/en/partners.html','/en/blog/insights/best-color-e-ink-photo-frames-2026.html']){
    await page.goto(base+path);await page.evaluate(()=>document.fonts.ready);
    await page.locator('img').evaluateAll(nodes=>nodes.forEach(n=>n.loading='eager'));
    await page.waitForFunction(()=>Array.from(document.images).every(n=>n.complete));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`horizontal overflow ${width} ${path}`);
    const broken=await page.locator('img[src]').evaluateAll(nodes=>nodes.filter(n=>!n.complete||n.naturalWidth===0).map(n=>n.src));
    assert.deepEqual(broken,[],`broken images ${path}`);
    if(width===390&&path==='/en/product.html'){
     await page.locator('[data-nav-toggle]').click();assert.equal(await page.locator('[data-nav-toggle]').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('[data-nav-toggle]').getAttribute('aria-expanded'),'false');
    }
    if(width!==360)await page.screenshot({path:'.qa/'+width+'-'+path.replace(/\W+/g,'-')+'.png',fullPage:true});
   }
  }
  await context.clearCookies();await page.evaluate(()=>sessionStorage.clear());
  await page.goto(base+'/en/blog/insights/e-ink-picture-frames-explained.html?utm_source=qa&utm_campaign=canvas');
  await page.goto(base+'/en/products/canvas-13-3-cnc.html');
  await page.goto(base+'/en/contact.html?model=AES-1330CNC&intent=sample');
  assert.equal(await page.locator('[name=model]').inputValue(),'AES-1330CNC');assert.equal(await page.locator('[name=intent]').inputValue(),'sample');
  await page.locator('[name=name]').fill('LOCAL QA ONLY');await page.locator('[name=email]').fill('qa@example.test');await page.locator('[name=message]').fill('private message not for analytics');
  let count=0,payload;
  await page.route(api,async route=>{count++;payload=route.request().postDataJSON();await route.fulfill({status:500,contentType:'application/json',body:'{"ok":false}'});});
  await page.locator('button[type=submit]').click();await page.waitForSelector('[data-inquiry-status][data-state=error]');
  assert.equal(await page.locator('[name=name]').inputValue(),'LOCAL QA ONLY');assert.equal(await page.locator('[data-email-fallback]').isVisible(),true);
  assert.equal(payload.utm_source,'qa');assert.ok(payload.message.includes('/en/blog/insights/e-ink-picture-frames-explained.html'));
  assert.equal((await page.evaluate(()=>qaEvents.filter(e=>e.name==='generate_lead'))).length,0);
  await page.unroute(api);await page.route(api,route=>route.fulfill({status:200,contentType:'application/json',body:'{}'}));
  await page.locator('button[type=submit]').click();await page.waitForSelector('[data-inquiry-status][data-state=error]');
  assert.equal((await page.evaluate(()=>qaEvents.filter(e=>e.name==='generate_lead'))).length,0);
  await page.unroute(api);let accepted=0;
  await page.route(api,async route=>{accepted++;await new Promise(r=>setTimeout(r,150));await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
  await page.locator('button[type=submit]').click();await page.evaluate(()=>document.querySelector('form').requestSubmit());await page.waitForSelector('[data-inquiry-status][data-state=success]');
  await page.locator('button[type=submit]').click();assert.equal(accepted,1);
  const events=await page.evaluate(()=>qaEvents);assert.equal(events.filter(e=>e.name==='generate_lead').length,1);assert.ok(!JSON.stringify(events).includes('qa@example.test'));assert.ok(!JSON.stringify(events).includes('private message'));assert.ok(events.every(e=>e.enabled===false));
  await page.locator('[name=message]').fill('timeout case');await page.unroute(api);await page.route(api,()=>{});
  await page.clock.install();await page.locator('button[type=submit]').click();await page.clock.fastForward(16000);await page.waitForSelector('[data-inquiry-status][data-state=error]');
  assert.equal((await page.evaluate(()=>qaEvents.filter(e=>e.name==='inquiry_error').at(-1))).params.error_type,'timeout');
  assert.deepEqual(errors,[]);
  await context.close();
 } finally {await browser.close();}
});

test('Chinese inquiry remains usable with storage blocked and unknown prefill',async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try {
  const context=await browser.newContext();
  await context.addInitScript(()=>Object.defineProperty(window,'sessionStorage',{get(){throw new Error('disabled');}}));
  const page=await context.newPage();await page.goto(base+'/zh-cn/contact.html?model=unknown&intent=unknown');
  assert.equal(await page.locator('[name=model]').inputValue(),'');assert.equal(await page.locator('[name=intent]').inputValue(),'quote');
  assert.equal(await page.locator('form').evaluate(n=>n.checkValidity()),false);
  await page.locator('[name=name]').fill('本地测试');await page.locator('[name=email]').fill('qa@example.test');await page.locator('[name=quantity]').fill('0');
  assert.equal(await page.locator('form').evaluate(n=>n.checkValidity()),false);await page.locator('[name=quantity]').fill('1');
  await page.route(api,r=>r.fulfill({status:200,contentType:'text/html',body:'<html>not a receipt</html>'}));
  await page.locator('button[type=submit]').click();await page.waitForSelector('[data-inquiry-status][data-state=error]');
  assert.ok((await page.locator('[data-inquiry-status]').textContent()).includes('内容已保留'));
  await page.unroute(api);await page.route(api,r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
  await page.locator('button[type=submit]').click();await page.waitForSelector('[data-inquiry-status][data-state=success]');
  assert.ok((await page.locator('[data-inquiry-status]').textContent()).includes('询盘已收到'));
 } finally {await browser.close();}
});
