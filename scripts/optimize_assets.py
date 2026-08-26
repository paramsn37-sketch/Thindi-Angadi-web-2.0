"""Convert referenced raster assets to efficient WebP files and archive sources.

Run from the `site` directory. Original files are retained outside `public/` so
they remain available for future design work without being shipped to visitors.
"""

from __future__ import annotations

import re
import shutil
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "assets"
ARCHIVE = ROOT / "design-archive" / "source-assets"
SOURCE_ROOTS = [ROOT / "src"]
RASTER = {".png", ".jpg", ".jpeg"}


def source_files() -> list[Path]:
    return [
        path
        for root in SOURCE_ROOTS
        for path in root.rglob("*")
        if path.suffix.lower() in {".ts", ".tsx", ".css"}
    ]


files = source_files()
texts = {path: path.read_text(encoding="utf-8") for path in files}
ARCHIVE.mkdir(parents=True, exist_ok=True)
available_sources = {
    path.name: path
    for directory in (PUBLIC, ARCHIVE)
    for path in directory.iterdir()
    if path.is_file() and path.suffix.lower() in RASTER
}
referenced = {
    name
    for name in available_sources
    if any(name in text for text in texts.values())
}
converted: dict[str, str] = {}

for name in sorted(referenced):
    source = available_sources[name]
    target_name = f"{source.stem}.webp"
    target = PUBLIC / target_name
    with Image.open(source) as image:
        image.load()
        max_edge = 2400 if "hero" in source.stem else 1800
        if max(image.size) > max_edge:
            image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        has_alpha = image.mode in {"RGBA", "LA"} or "transparency" in image.info
        if has_alpha:
            image = image.convert("RGBA")
        else:
            image = image.convert("RGB")
        image.save(target, "WEBP", quality=84, method=6, exact=has_alpha)
    converted[name] = target_name

for path, text in texts.items():
    updated = text
    for old, new in converted.items():
        updated = updated.replace(old, new)
    if updated != text:
        path.write_text(updated, encoding="utf-8", newline="")

for source in PUBLIC.iterdir():
    if source.is_file() and source.suffix.lower() in RASTER:
        destination = ARCHIVE / source.name
        if destination.exists():
            destination.unlink()
        shutil.move(str(source), str(destination))

before = sum(path.stat().st_size for path in ARCHIVE.iterdir() if path.is_file())
after = sum(path.stat().st_size for path in PUBLIC.iterdir() if path.is_file())
print(f"Converted {len(converted)} referenced assets.")
print(f"Archived raster sources: {before / 1024 / 1024:.1f} MB")
print(f"Public asset payload: {after / 1024 / 1024:.1f} MB")
