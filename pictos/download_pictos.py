#!/usr/bin/env python3
"""Download best-resolution pictograms per `idligne` from `pictos/data.json`.

Saves each picked image as `<idligne>.png` into a `temp/` folder next to this script.

Usage:
  python download_pictos.py
  python download_pictos.py --data pictos/data.json --out temp --workers 8

Requires: `requests` (install with `pip install requests`).
"""

from __future__ import annotations

import argparse
import json
import logging
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Dict, Any, Optional

try:
	import requests
except Exception:  # pragma: no cover - user environment
	raise SystemExit("The 'requests' package is required. Install it with: pip install requests")


def load_data(path: Path) -> list[Dict[str, Any]]:
	with path.open("r", encoding="utf-8") as fh:
		return json.load(fh)


def pick_best_per_idligne(records: list[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
	"""Return mapping idligne -> best record based on image width (largest).

	If `image.width` is missing, falls back to `taille` if available.
	"""
	best: Dict[str, Dict[str, Any]] = {}
	for rec in records:
		idl = rec.get("idligne")
		if not idl:
			continue
		img = rec.get("image") or {}
		width = img.get("width")
		if width is None:
			# fallback to taille (file size) as proxy
			width = rec.get("taille", 0)

		prev = best.get(idl)
		if prev is None:
			best[idl] = rec
			continue

		prev_img = prev.get("image") or {}
		prev_width = prev_img.get("width")
		if prev_width is None:
			prev_width = prev.get("taille", 0)

		try:
			if int(width) > int(prev_width):
				best[idl] = rec
		except Exception:
			# if comparison fails, keep existing
			pass

	return best


def download_one(url: str, outpath: Path, timeout: int = 30) -> Optional[str]:
	try:
		resp = requests.get(url, stream=True, timeout=timeout)
		resp.raise_for_status()
	except Exception as exc:
		logging.error("Failed to download %s: %s", url, exc)
		return None

	# Write bytes to file
	try:
		with outpath.open("wb") as fh:
			for chunk in resp.iter_content(chunk_size=8192):
				if chunk:
					fh.write(chunk)
	except Exception as exc:
		logging.error("Failed to save %s: %s", outpath, exc)
		return None

	return str(outpath)


def main() -> None:
	parser = argparse.ArgumentParser(description="Download best pictogram per idligne from data.json")
	parser.add_argument("--data", "-d", type=Path, default=Path(__file__).parent / "data.json", help="path to data.json")
	parser.add_argument("--out", "-o", type=Path, default=Path(__file__).parent / "temp", help="output folder")
	parser.add_argument("--workers", "-w", type=int, default=6, help="number of concurrent downloads")
	args = parser.parse_args()

	logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

	data_file = args.data
	if not data_file.exists():
		logging.error("Data file not found: %s", data_file)
		raise SystemExit(1)

	logging.info("Loading %s", data_file)
	records = load_data(data_file)

	logging.info("Selecting best image per idligne")
	best = pick_best_per_idligne(records)
	logging.info("Found %d unique idligne entries", len(best))

	outdir = args.out
	outdir.mkdir(parents=True, exist_ok=True)

	tasks = []
	with ThreadPoolExecutor(max_workers=args.workers) as ex:
		futures = {}
		for idl, rec in best.items():
			img = rec.get("image") or {}
			url = img.get("url")
			if not url:
				logging.warning("No image URL for idligne %s, skipping", idl)
				continue

			outpath = outdir / f"{idl}.png"
			# schedule download
			futures[ex.submit(download_one, url, outpath)] = (idl, url, outpath)

		for fut in as_completed(futures):
			idl, url, outpath = futures[fut]
			res = fut.result()
			if res:
				logging.info("Saved %s -> %s", idl, outpath)
			else:
				logging.error("Failed to get %s from %s", idl, url)

	logging.info("Done. Files saved in: %s", outdir)


if __name__ == "__main__":
	main()

