import os, zipfile

root = os.path.dirname(os.path.dirname(__file__))
zipname = os.path.join(root, 'pan-jianze-homepage.zip')
files = ['index.html', 'styles.css', 'README.md', '简历.docx', '.nojekyll']
with zipfile.ZipFile(zipname, 'w', zipfile.ZIP_DEFLATED) as z:
    for fn in files:
        path = os.path.join(root, fn)
        if os.path.exists(path):
            z.write(path, fn)
    assets_dir = os.path.join(root, 'assets')
    if os.path.isdir(assets_dir):
        for fn in os.listdir(assets_dir):
            z.write(os.path.join(assets_dir, fn), os.path.join('assets', fn))
print('Generated:', zipname)
