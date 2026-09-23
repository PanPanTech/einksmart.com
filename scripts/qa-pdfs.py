from pathlib import Path
import subprocess
from PIL import Image, ImageOps, ImageDraw
from pypdf import PdfReader
root=Path(__file__).resolve().parent.parent
out=root/'.qa/pdfs'
out.mkdir(parents=True,exist_ok=True)
tiles=[]
for path in sorted((root/'assets/datasheets').glob('*.pdf')):
    reader=PdfReader(path)
    assert 1<=len(reader.pages)<=3, path
    assert all((p.extract_text() or '').strip() for p in reader.pages), path
    subprocess.run(['pdftoppm','-scale-to','800','-png',str(path),str(out/path.stem)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    for i in range(1,len(reader.pages)+1):
        png=out/f'{path.stem}-{i}.png'
        img=Image.open(png).convert('RGB');img.thumbnail((260,365))
        tile=Image.new('RGB',(280,400),'#dddddd');tile.paste(img,((280-img.width)//2,28))
        ImageDraw.Draw(tile).text((5,6),png.stem,fill='black')
        tiles.append(tile)
sheet=Image.new('RGB',(280*4,400*((len(tiles)+3)//4)),'white')
for i,tile in enumerate(tiles):sheet.paste(tile,((i%4)*280,(i//4)*400))
sheet.save(out/'contact-sheet.png')
print(f'Rendered and extracted {len(tiles)} pages across {len(list((root/"assets/datasheets").glob("*.pdf")))} PDF files.')
