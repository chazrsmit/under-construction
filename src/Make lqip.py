#!/usr/bin/env python3
"""
Generates tiny blurred previews (base64 JPEG) for the project images.

Run from the project root:   python scripts/make_lqip.py
Needs Pillow:                pip install pillow
Output:                      src/lqip.json   (keys = paths relative to public/)
"""
import base64
import io
import json
from pathlib import Path

from PIL import Image

PUBLIC = Path("public")
FOLDERS = ["images"]
OUT = Path("src/lqip.json")
PREVIEW_WIDTH = 24
EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
BACKGROUND = (228, 228, 228)


def make_preview(path: Path) -> dict:
    with Image.open(path) as im:
        width, height = im.size
        im = im.convert("RGBA")
        flat = Image.new("RGBA", im.size, BACKGROUND + (255,))
        flat.alpha_composite(im)
        small = flat.convert("RGB").resize(
            (PREVIEW_WIDTH, max(1, round(height * PREVIEW_WIDTH / width))),
            Image.LANCZOS,
        )
        buffer = io.BytesIO()
        small.save(buffer, format="JPEG", quality=40)
        data = base64.b64encode(buffer.getvalue()).decode("ascii")
        return {"src": f"data:image/jpeg;base64,{data}", "w": width, "h": height}


def main() -> None:
    result = {}
    for folder in FOLDERS:
        for path in sorted((PUBLIC / folder).rglob("*")):
            if path.suffix.lower() in EXTENSIONS:
                key = path.relative_to(PUBLIC).as_posix()
                result[key] = make_preview(path)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result), encoding="utf-8")
    print(f"{len(result)} previews written to {OUT}")


if __name__ == "__main__":
    main()