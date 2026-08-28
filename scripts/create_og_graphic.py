from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path('/home/ubuntu/swiftverify')
SOURCE = ROOT / 'public/swiftverify-logo.jpg'
CIRCLE_OUT = ROOT / 'public/swiftverify-logo-circle.png'
OG_OUT = ROOT / 'public/swiftverify-og.png'


def circular_logo(size: int) -> Image.Image:
    source = Image.open(SOURCE).convert('RGBA').resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    source.putalpha(mask)
    return source


# Standalone circular logo with transparent corners.
circular_logo(512).save(CIRCLE_OUT, 'PNG', optimize=True)

# Simple Open Graph image: only the circular logo on a plain brand background.
canvas = Image.new('RGB', (1200, 630), '#071b2b')
logo = circular_logo(400)
canvas.paste(logo, ((1200 - 400) // 2, (630 - 400) // 2), logo)
canvas.save(OG_OUT, 'PNG', optimize=True)

print(f'Wrote {CIRCLE_OUT}')
print(f'Wrote {OG_OUT} (1200x630, logo only)')
