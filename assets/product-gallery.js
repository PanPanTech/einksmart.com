(function () {
  'use strict';
  document.querySelectorAll('[data-product-gallery]').forEach(gallery => {
    const thumbs=Array.from(gallery.querySelectorAll('[data-gallery-thumb]'));
    const main=gallery.querySelector('[data-gallery-image]'), opener=gallery.querySelector('[data-gallery-open]');
    const dialog=gallery.querySelector('dialog'), large=gallery.querySelector('[data-dialog-image]');
    let index=0;
    const show=(next,focus=false)=>{
      index=(next+thumbs.length)%thumbs.length;
      const item=thumbs[index], caption=item.dataset.caption;
      main.src=item.dataset.src;main.alt=caption;opener.href=item.dataset.src;
      gallery.querySelector('[data-gallery-caption]').textContent=caption;
      gallery.querySelector('[data-gallery-count]').textContent=`${index+1} / ${thumbs.length}`;
      thumbs.forEach((t,i)=>t.setAttribute('aria-pressed',String(i===index)));
      if(dialog.open){large.src=item.dataset.src;large.alt=caption;gallery.querySelector('[data-dialog-caption]').textContent=caption;gallery.querySelector('[data-dialog-count]').textContent=`${index+1} / ${thumbs.length}`;}
      if(focus) item.focus({preventScroll:true});
    };
    thumbs.forEach((item,i)=>item.addEventListener('click',()=>show(i)));
    gallery.querySelector('.gallery-strip').addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1),true);}
      if(e.key==='Home'||e.key==='End'){e.preventDefault();show(e.key==='Home'?0:thumbs.length-1,true);}
    });
    opener.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||typeof dialog.showModal!=='function')return;e.preventDefault();dialog.showModal();show(index);});
    gallery.querySelector('[data-gallery-close]').addEventListener('click',()=>dialog.close());
    gallery.querySelector('[data-gallery-prev]').addEventListener('click',()=>show(index-1));
    gallery.querySelector('[data-gallery-next]').addEventListener('click',()=>show(index+1));
    dialog.addEventListener('close',()=>opener.focus({preventScroll:true}));
    dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}});
    if(thumbs.length<2)gallery.querySelectorAll('[data-gallery-prev],[data-gallery-next]').forEach(b=>b.hidden=true);
  });
  document.querySelectorAll('[data-product-catalog]').forEach(catalog=>{
    const filters=Array.from(catalog.querySelectorAll('[data-catalog-filter]'));
    filters.forEach(button=>button.addEventListener('click',()=>{
      const key=button.dataset.catalogFilter;
      filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      catalog.querySelectorAll('[data-catalog-family]').forEach(s=>s.hidden=key!=='all'&&s.dataset.catalogFamily!==key);
      const total=catalog.querySelectorAll('[data-catalog-family]:not([hidden]) .product-card').length;
      catalog.querySelector('[data-catalog-results]').textContent=total+(document.documentElement.lang.startsWith('zh')?' 款配置':' configurations');
    }));
  });
})();
