import zipfile
import xml.etree.ElementTree as ET
import os
import shutil

base = os.path.dirname(os.path.dirname(__file__))
docx_path = os.path.join(base, '简历.docx')
out_txt = os.path.join(base, 'resume.txt')
assets_dir = os.path.join(base, 'assets')

if not os.path.exists(docx_path):
    print('简历.docx 未找到 in', base)
    raise SystemExit(1)

with zipfile.ZipFile(docx_path) as z:
    if 'word/document.xml' not in z.namelist():
        print('document.xml not found in docx')
        raise SystemExit(1)
    data = z.read('word/document.xml')
    root = ET.fromstring(data)
    ns = {'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    texts = []
    for t in root.findall('.//w:t', ns):
        texts.append(t.text if t.text is not None else '')

plain = '\n'.join(texts)
with open(out_txt, 'w', encoding='utf-8') as f:
    f.write(plain)
print('写入', out_txt)

os.makedirs(assets_dir, exist_ok=True)
# copy first jpg/png found in base to assets/wechat.jpg
found = False
for fname in os.listdir(base):
    if fname.lower().endswith(('.png', '.jpg', '.jpeg')):
        src = os.path.join(base, fname)
        dst = os.path.join(assets_dir, 'wechat' + os.path.splitext(fname)[1].lower())
        shutil.copy2(src, dst)
        print('已复制', src, '->', dst)
        found = True
        break
if not found:
    print('未找到图片文件来作为二维码')
