#!/usr/bin/env python3
"""Create a sprite sheet from all picto images.

Usage:
  python create_sprite.py
  python create_sprite.py --input ../public/pictos --output ../public --max-width 2048

Requires: Pillow (install with `pip install Pillow`)
"""

from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path
from typing import Dict, List, Tuple

try:
    from PIL import Image
except ImportError:
    raise SystemExit("Pillow is required. Install it with: pip install Pillow")


def pack_images(
    image_files: List[Path], max_width: int = 2048, padding: int = 2, max_image_size: int = 64
) -> Tuple[Image.Image, Dict[str, Dict]]:
    """Pack multiple images into a sprite sheet using a simple row-based algorithm.
    
    Args:
        max_image_size: Maximum dimension for each image (will be scaled down if larger)
    
    Returns:
        - The sprite sheet image
        - A dict mapping filename -> {x, y, width, height}
    """
    # Load all images and get their dimensions
    images = []
    for f in image_files:
        try:
            img = Image.open(f).convert("RGBA")
            
            # Resize if image is too large
            if img.width > max_image_size or img.height > max_image_size:
                # Calculate scale to fit within max_image_size while maintaining aspect ratio
                scale = min(max_image_size / img.width, max_image_size / img.height)
                new_width = int(img.width * scale)
                new_height = int(img.height * scale)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            images.append((f.stem, img))
        except Exception as exc:
            logging.warning(f"Failed to load {f}: {exc}")
    
    if not images:
        raise ValueError("No valid images found")
    
    # Sort by height (tallest first) for better packing
    images.sort(key=lambda x: x[1].height, reverse=True)
    
    # Pack images row by row
    positions = {}
    current_x = padding
    current_y = padding
    row_height = 0
    sprite_width = 0
    sprite_height = 0
    
    for name, img in images:
        img_w, img_h = img.size
        
        # Check if we need to move to next row
        if current_x + img_w + padding > max_width and current_x > padding:
            current_x = padding
            current_y += row_height + padding
            row_height = 0
        
        # Store position
        positions[name] = {
            "x": current_x,
            "y": current_y,
            "width": img_w,
            "height": img_h
        }
        
        # Update trackers
        current_x += img_w + padding
        row_height = max(row_height, img_h)
        sprite_width = max(sprite_width, current_x)
        sprite_height = max(sprite_height, current_y + img_h + padding)
    
    # Create the sprite sheet
    sprite = Image.new("RGBA", (sprite_width, sprite_height), (0, 0, 0, 0))
    
    # Paste all images
    for name, img in images:
        pos = positions[name]
        sprite.paste(img, (pos["x"], pos["y"]), img)
    
    return sprite, positions


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create a sprite sheet from picto images"
    )
    parser.add_argument(
        "--input",
        "-i",
        type=Path,
        default=Path(__file__).parent.parent / "public" / "pictos",
        help="Input folder containing PNG files",
    )
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        default=Path(__file__).parent.parent / "public",
        help="Output folder for sprite sheet and JSON map",
    )
    parser.add_argument(
        "--max-width",
        "-w",
        type=int,
        default=2048,
        help="Maximum width of sprite sheet",
    )
    parser.add_argument(
        "--padding",
        "-p",
        type=int,
        default=2,
        help="Padding between images in pixels",
    )
    parser.add_argument(
        "--max-image-size",
        "-s",
        type=int,
        default=64,
        help="Maximum dimension for each image (will scale down larger images)",
    )
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    input_dir = args.input
    if not input_dir.exists():
        raise SystemExit(f"Input directory not found: {input_dir}")

    # Find all PNG files
    png_files = sorted(input_dir.glob("*.png"))
    logging.info(f"Found {len(png_files)} PNG files in {input_dir}")

    if not png_files:
        raise SystemExit("No PNG files found")

    # Create sprite sheet
    logging.info("Creating sprite sheet...")
    sprite, positions = pack_images(png_files, args.max_width, args.padding, args.max_image_size)

    # Save sprite sheet
    output_dir = args.output
    output_dir.mkdir(parents=True, exist_ok=True)
    
    sprite_path = output_dir / "pictos-sprite.png"
    sprite.save(sprite_path, "PNG", optimize=True)
    logging.info(
        f"Saved sprite sheet: {sprite_path} ({sprite.width}x{sprite.height})"
    )

    # Save positions map
    map_path = output_dir / "pictos-sprite.json"
    with map_path.open("w", encoding="utf-8") as f:
        json.dump(positions, f, indent=2)
    logging.info(f"Saved sprite map: {map_path}")

    # Calculate space savings
    original_size = sum(f.stat().st_size for f in png_files)
    sprite_size = sprite_path.stat().st_size
    savings = (1 - sprite_size / original_size) * 100
    
    logging.info(f"\nOriginal total size: {original_size:,} bytes")
    logging.info(f"Sprite sheet size: {sprite_size:,} bytes")
    logging.info(f"Space savings: {savings:.1f}%")
    logging.info(f"HTTP requests reduced: {len(png_files)} → 1")


if __name__ == "__main__":
    main()
