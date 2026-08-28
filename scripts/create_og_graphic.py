from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630
OUT = Path('/home/ubuntu/swiftverify/public/swiftverify-og.png')
LOGO = Path('/home/ubuntu/swiftverify/public/swiftverify-logo.jpg')
FONT_REG = '/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf'
FONT_BOLD = '/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf'


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def text(draw, xy, value, size, fill, bold=False, anchor=None):
    draw.text(xy, value, font=font(size, bold), fill=fill, anchor=anchor)


def wrapped(draw, xy, value, size, fill, max_width, leading=1.15, bold=False):
    words = value.split()
    lines = []
    current = ''
    f = font(size, bold)
    for word in words:
        candidate = f'{current} {word}'.strip()
        if draw.textbbox((0, 0), candidate, font=f)[2] <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    x, y = xy
    line_h = int(size * leading)
    for line in lines:
        draw.text((x, y), line, font=f, fill=fill)
        y += line_h
    return y


def circle_logo(size):
    src = Image.open(LOGO).convert('RGBA').resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    src.putalpha(mask)
    return src


base = Image.new('RGB', (W, H), '#071b2b')
pix = base.load()
for y in range(H):
    for x in range(W):
        t = x / W
        r = int(7 + 2 * t)
        g = int(27 + 15 * t)
        b = int(43 + 21 * t)
        pix[x, y] = (r, g, b)

# Soft mint glow behind the right-hand verification map.
glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
gp = glow.load()
for y in range(H):
    for x in range(W):
        dx, dy = x - 930, y - 215
        distance = (dx * dx + dy * dy) ** 0.5
        alpha = max(0, int(54 - distance / 8))
        if alpha:
            gp[x, y] = (45, 211, 154, alpha)
base = Image.alpha_composite(base.convert('RGBA'), glow)

draw = ImageDraw.Draw(base)
# Fine editorial grid, kept low contrast.
for x in range(0, W, 48):
    draw.line((x, 0, x, H), fill=(132, 177, 192, 18), width=1)
for y in range(0, H, 48):
    draw.line((0, y, W, y), fill=(132, 177, 192, 18), width=1)

# Logo card, using the actual circular asset instead of a generated substitute.
draw.rounded_rectangle((74, 62, 214, 202), radius=28, fill=(255, 255, 255, 18), outline=(148, 232, 202, 80), width=2)
base.alpha_composite(circle_logo(112), (88, 76))
text(draw, (244, 81), 'SWIFTVERIFY', 28, '#ffffff', bold=True)
text(draw, (244, 119), 'INDEPENDENT PAYMENT GATEWAY CONSULTANCY', 13, '#72e2b9', bold=True)

# Left content.
text(draw, (76, 257), 'GET VERIFIED.', 56, '#ffffff', bold=True)
text(draw, (76, 319), 'GET PAID.', 56, '#55e0ae', bold=True)
text(draw, (76, 381), 'MOVE FASTER.', 56, '#ffffff', bold=True)
wrapped(draw, (78, 464), 'Compliance-led support for freelancers, agencies and online businesses using global payment gateways.', 20, '#b9cad5', 490, leading=1.35)

# Right verification map panel.
draw.rounded_rectangle((684, 72, 1128, 551), radius=30, fill=(255, 255, 255, 18), outline=(152, 203, 204, 78), width=2)
draw.rounded_rectangle((710, 98, 1102, 148), radius=16, fill=(19, 46, 63, 210))
text(draw, (733, 116), 'YOUR VERIFICATION MAP', 12, '#79e4bd', bold=True)
text(draw, (733, 133), 'A clearer path through compliance', 14, '#cad8de')
text(draw, (1070, 122), 'ADVISORY', 11, '#79e4bd', bold=True, anchor='ra')

steps = [
    ('01', 'Choose the right gateway', 'Based on your country, account type and use case'),
    ('02', 'Prepare the right documents', 'Clear, current and consistent before submission'),
    ('03', 'Submit with confidence', 'Practical support if the provider asks questions'),
]
for i, (num, title, desc) in enumerate(steps):
    y = 174 + i * 78
    draw.rounded_rectangle((710, y, 1102, y + 60), radius=14, fill=(15, 42, 61, 235))
    draw.rounded_rectangle((725, y + 14, 758, y + 47), radius=12, fill=(31, 105, 92, 190))
    text(draw, (741, y + 30), num, 12, '#9bf4ce', bold=True, anchor='mm')
    text(draw, (777, y + 14), title, 15, '#ffffff', bold=True)
    text(draw, (777, y + 36), desc, 11, '#8fa8b6')
    if i == 2:
        text(draw, (1069, y + 30), '✓', 22, '#59dfb0', bold=True, anchor='mm')

# Gateway ribbon.
draw.rounded_rectangle((710, 420, 1102, 525), radius=20, fill='#59dfb0')
text(draw, (733, 438), 'SUPPORTED GATEWAYS', 11, '#0b493d', bold=True)
text(draw, (733, 460), 'One team. Seven routes to getting paid.', 18, '#071b2b', bold=True)
labels = ['Payoneer', 'Stripe', 'PayPal', 'Wise', 'Grey', 'Square', 'Mercury']
x = 733
for label in labels:
    bbox = draw.textbbox((0, 0), label, font=font(9, True))
    width = bbox[2] - bbox[0] + 14
    draw.rounded_rectangle((x, 489, x + width, 509), radius=10, fill=(13, 112, 83, 105))
    text(draw, (x + width / 2, 499), label, 9, '#083f35', bold=True, anchor='mm')
    x += width + 6

# Footer microcopy and accent rule.
draw.line((76, 576, 1128, 576), fill=(146, 192, 198, 55), width=1)
text(draw, (76, 593), 'PAYMENT GATEWAY VERIFICATION  /  DOCUMENT READINESS  /  COMPLIANCE SUPPORT', 12, '#8ea8b7', bold=True)
text(draw, (1128, 593), 'swiftverify-alpha.vercel.app', 12, '#59dfb0', bold=True, anchor='ra')

base.convert('RGB').save(OUT, 'PNG', optimize=True)
print(f'Wrote {OUT} ({W}x{H})')
