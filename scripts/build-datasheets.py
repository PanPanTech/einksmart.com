"""Publish only the curated catalog data, never the source quotation files."""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / 'content/products.json').read_text(encoding='utf-8'))
out = ROOT / 'assets/datasheets'
out.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))

for lang in ('en', 'zh-cn'):
    zh = lang == 'zh-cn'
    font = 'STSong-Light' if zh else 'Helvetica'
    style = ParagraphStyle('body', fontName=font, fontSize=10, leading=13, spaceAfter=5)
    title = ParagraphStyle('title', parent=style, fontSize=24, leading=30, spaceAfter=14, textColor=colors.HexColor('#156c67'))
    heading = ParagraphStyle('heading', parent=style, fontSize=13, leading=17, spaceBefore=9)
    def value(v): return v[lang] if isinstance(v, dict) else str(v)
    def para(v, s=style): return Paragraph(escape(value(v)), s)
    def footer(canvas, doc):
        canvas.setFont('Helvetica', 8)
        canvas.drawString(42, 27, 'www.einksmart.com | info@einksmart.com | Rev. '+data['revision'])
        canvas.drawRightString(A4[0]-42, 27, str(doc.page))
    for p in data['products']:
        blocks=[para('einksmart / Canvas',heading),para(p['name'],title),para(p['model']),para(p['description'])]
        labels=[('Supply form','交付形态','type'),('Resolution','分辨率','resolution'),('Pixel density','像素密度','ppi'),('Display area','可视区域','area'),('Enclosure','外形尺寸','dimensions'),('Power','供电','power'),('Image updates','图片更新','updates')]
        rows=[[para(cn if zh else en),para(p[key])] for en,cn,key in labels]
        table=Table(rows,colWidths=[110,401])
        table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,-1),.4,colors.HexColor('#d5dedb')),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
        blocks.extend([table,para('标准包含项' if zh else 'Standard scope',heading)])
        blocks.extend(para('- '+v) for v in p['included'][lang])
        blocks.append(para('选配与安装' if zh else 'Options and installation',heading))
        blocks.extend(para('- '+v) for v in p['options'][lang])
        blocks.extend([para(p['mounting']),para('订购与软件范围' if zh else 'Ordering and software scope',heading),para(p['delivery']),para('价格、税费、运费、保修及认证文件按报价确认。定时、分组、CMS/API 须演示并明确交付范围；MagiRealm 扩展内容引擎仍在规划。画面保持功耗不能代替整机功耗或续航指标。' if zh else 'Confirm price, taxes, freight, warranty and compliance documents in the quotation. Scheduling, groups and CMS/API require a demonstration and agreed scope; the expanded MagiRealm content engine remains on the roadmap. Image retention power is not a whole-device power or battery-life specification.'),para(f'https://www.einksmart.com/{lang}/products/{p["slug"]}.html')])
        SimpleDocTemplate(str(out/f'{p["slug"]}-{lang}.pdf'),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=35,bottomMargin=48,title=value(p['name']),author='einksmart').build(blocks,onFirstPage=footer,onLaterPages=footer)
    blocks=[para('einksmart / Canvas',heading),para('A1 / A2 / A3 E6 '+('裸屏模组' if zh else 'Panel Modules'),title),para('裸屏 + TCON 集成入口，不是成品画框。' if zh else 'Open-cell panels plus TCON for integration, not finished frames.')]
    rows=[['Format','Size','Resolution','Active area (mm)'],['A1','40.5 inches','3060 x 4320','594.56 x 839.38'],['A2','28.5 inches','2160 x 3060','418 x 592.17'],['A3','20.2 inches','1530 x 2160','297.28 x 419.69']]
    table=Table([[para(c) for c in row] for row in rows],colWidths=[60,110,140,201]);table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,-1),.4,colors.grey)]));blocks.append(table)
    blocks.extend([Spacer(1,18),para('包含裸屏与 TCON；不包含主机、外壳、电池、Wi-Fi 固件或 CMS。A1/A2 为独立 TCON，A3 为集成 TCON。请提供目标数量、安装空间与接口需求，结构图及接口资料按项目确认。' if zh else 'Scope covers open-cell panel and TCON. Host computer, enclosure, battery, Wi-Fi firmware and CMS are excluded. A1/A2 use separate TCON; A3 uses integrated TCON. Share target quantity, mechanical space and interface requirements. Drawings and interface documentation are confirmed for the project.'),para('价格、样品供应、认证、运输及交期按项目确认。' if zh else 'Prices, sample availability, compliance, freight and delivery are confirmed per project.'),para(f'https://www.einksmart.com/{lang}/products/e6-panel-modules.html')])
    SimpleDocTemplate(str(out/f'e6-panel-modules-{lang}.pdf'),pagesize=A4,leftMargin=42,rightMargin=42,topMargin=35,bottomMargin=48,title='Canvas E6 Panel Modules',author='einksmart').build(blocks,onFirstPage=footer,onLaterPages=footer)
print('Generated 10 public datasheets from curated catalog data.')
