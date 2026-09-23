from pathlib import Path
import xml.etree.ElementTree as ET
import json
root = Path(__file__).resolve().parent.parent
ns='http://www.sitemaps.org/schemas/sitemap/0.9'
xhtml='http://www.w3.org/1999/xhtml'
ET.register_namespace('',ns)
ET.register_namespace('xhtml',xhtml)
tree=ET.parse(root/'sitemap.xml')
data=json.loads((root/'content/products.json').read_text(encoding='utf-8'))
existing={n.find(f'{{{ns}}}loc').text:n for n in tree.getroot()}
for lang in ('en','zh-cn'):
    paths=['products/'+p['slug']+'.html' for p in data['products']]+['products/e6-panel-modules.html','privacy.html']
    for path in paths:
        url=f'https://www.einksmart.com/{lang}/{path}'
        node=existing.get(url)
        if node is None:
            node=ET.SubElement(tree.getroot(),f'{{{ns}}}url')
            ET.SubElement(node,f'{{{ns}}}loc').text=url
            ET.SubElement(node,f'{{{ns}}}lastmod').text=data['revision']
            for code in ('en','zh-cn'):
                ET.SubElement(node,f'{{{xhtml}}}link',{'rel':'alternate','hreflang':'zh-CN' if code=='zh-cn' else code,'href':f'https://www.einksmart.com/{code}/{path}'})
    for path in ('','product.html','contact.html','partners.html','technology.html','solutions.html'):
        node=existing.get(f'https://www.einksmart.com/{lang}/{path}')
        if node is not None: node.find(f'{{{ns}}}lastmod').text=data['revision']
ET.indent(tree,space='  ')
for slug in ('e-ink-picture-frames-explained','best-color-e-ink-photo-frames-2026','frame-tv-alternatives'):
    node=existing.get(f'https://www.einksmart.com/en/blog/insights/{slug}.html')
    if node is not None: node.find(f'{{{ns}}}lastmod').text=data['revision']
tree.write(root/'sitemap.xml',encoding='utf-8',xml_declaration=True)
print('Sitemap includes bilingual product and privacy URLs.')
