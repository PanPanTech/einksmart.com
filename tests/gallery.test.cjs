const {test}=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {products}=require('../content/products.json');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4187';
test('full range, galleries, zoom dialog, category filters and inquiry models',async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try {
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});
   for(const lang of ['en','zh-cn']){
    await page.goto(`${base}/${lang}/product.html`);
    assert.equal(await page.locator('.product-card').count(),14);
    await page.locator('[data-catalog-filter=tags]').click();assert.equal(await page.locator('.product-card:visible').count(),3);
    await page.locator('[data-catalog-filter=frames]').click();assert.equal(await page.locator('.product-card:visible').count(),6);
    await page.locator('[data-catalog-filter=all]').click();assert.equal(await page.locator('.product-card:visible').count(),14);
    await page.screenshot({path:`.qa/e6-catalog-${lang}-${width}.png`,fullPage:true});
    for(const p of products){
     await page.goto(`${base}/${lang}/products/${p.slug}.html`);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`${p.slug} ${width}`);
     if(p.gallery?.length){
      const thumbs=page.locator('[data-gallery-thumb]');assert.equal(await thumbs.count(),p.gallery.length);
      const figureBox=await page.locator('[data-product-gallery] > figure').boundingBox(),stripBox=await page.locator('.gallery-strip').boundingBox();
      assert.ok(stripBox.y>=figureBox.y+figureBox.height-1,'thumbnails below the main photograph');
      for(let i=0;i<p.gallery.length;i++){
       await thumbs.nth(i).click();assert.equal(await thumbs.nth(i).getAttribute('aria-pressed'),'true');
       await page.locator('[data-gallery-image]').evaluate(img=>img.decode());
       assert.ok((await page.locator('[data-gallery-image]').getAttribute('src')).endsWith(p.gallery[i].src));
      }
      await page.locator('[data-gallery-open]').click();await page.waitForSelector('dialog[open]');
      await page.locator('[data-dialog-image]').evaluate(img=>img.decode());
      if(p.gallery.length>1){await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-dialog-count]').textContent(),`1 / ${p.gallery.length}`);}
      if(p.model==='AES-0750V')await page.screenshot({path:`.qa/e6-calendar-dialog-${lang}-${width}.png`});
      await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
      assert.equal(await page.locator('[data-gallery-open]').evaluate(n=>n===document.activeElement),true);
     }
     if(['AES-0750V','AES-1330V','AES-0709V','AES-0370V','AES-2020V','AES-3150V','AES-0154V'].includes(p.model))await page.screenshot({path:`.qa/e6-${p.slug}-${lang}-${width}.png`,fullPage:true});
     const pdf=await page.locator('a[download]').getAttribute('href');const response=await page.request.get(base+pdf);assert.equal(response.status(),200);assert.equal(response.headers()['content-type'],'application/pdf');
    }
    await page.goto(`${base}/${lang}/contact.html?model=AES-0750V&intent=sample`);assert.equal(await page.locator('[name=model]').inputValue(),'AES-0750V');assert.equal(await page.locator('[name=model] option').count(),16);
   }
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
