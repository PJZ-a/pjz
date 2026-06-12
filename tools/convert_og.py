import os
import sys
try:
    import cairosvg
except Exception as e:
    print('需要 cairosvg 库，请先安装：pip install cairosvg')
    raise

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SVG = os.path.join(BASE, 'assets', 'og-banner.svg')
PNG = os.path.join(BASE, 'assets', 'og-banner.png')

if not os.path.exists(SVG):
    print('未找到', SVG)
    sys.exit(1)

print('Converting', SVG, '->', PNG)
cairosvg.svg2png(url=SVG, write_to=PNG, output_width=1200, output_height=630)
print('Saved', PNG)
