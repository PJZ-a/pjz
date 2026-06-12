from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(BASE, 'assets', 'og-banner.png')

def linear_gradient(size, start_color, end_color):
    base = Image.new('RGB', size, start_color)
    top = Image.new('RGB', size, end_color)
    mask = Image.new('L', size)
    mask_data = []
    for y in range(size[1]):
        mask_data.extend([int(255 * (y / (size[1]-1)))] * size[0])
    mask.putdata(mask_data)
    base.paste(top, (0,0), mask)
    return base

img = linear_gradient((W,H), (7,16,26), (7,16,26))
draw = ImageDraw.Draw(img)

# translucent rounded panel
panel = Image.new('RGBA', (1120,550), (11,26,40,30))
img.paste(panel, (40,40), panel)

# text
try:
    title_font = ImageFont.truetype('arial.ttf', 64)
    small_font = ImageFont.truetype('arial.ttf', 20)
    mid_font = ImageFont.truetype('arial.ttf', 28)
except:
    title_font = ImageFont.load_default()
    small_font = ImageFont.load_default()
    mid_font = ImageFont.load_default()

draw.text((80,120), '潘建泽', font=title_font, fill=(255,255,255))
draw.text((80,200), '江南大学 · 自动化 · PLC / 嵌入式工程师', font=mid_font, fill=(159,220,255))
draw.rectangle([80,260,720,266], fill=(0,230,255))
desc = '求职意向：PLC 工程师 / 嵌入式工程师 · 熟悉 STM32、PLC 梯形图、PID 控制、MATLAB/Simulink'
draw.text((80,300), desc, font=small_font, fill=(207,239,255))

draw.rectangle([80,420,460,550], fill=(6,26,33,30))
draw.text((96,444), '联系', font=mid_font, fill=(191,239,255))
draw.text((96,480), '邮箱: 1289600019@qq.com', font=small_font, fill=(214,238,248))
draw.text((96,510), '电话: 19235238779', font=small_font, fill=(214,238,248))

os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT)
print('Saved', OUT)
