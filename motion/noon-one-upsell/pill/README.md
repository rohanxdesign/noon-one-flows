# noon One pill — 6s loop

Animated noon One entry point for the 97×50pt pill next to the homepage search bar.

| File | Use |
|---|---|
| `noon-one-pill.mp4` | 970×500 (10×), 60fps, H.264, seamless 6s loop. Corners filled with header sky-blue. |
| `noon-one-pill-transparent.webm` | Same, VP9 with alpha (rounded corners transparent). |
| `noon-one-pill-in-context.mp4` | Preview composited into the homepage header at real size (3×). |

Story: logo → navy wipe, noon van drives in → parcel drops in → van speeds off, yellow wipe → **FREE** slams in, van zips under it → **delivery** rises, holds ~1.2s → van leads a cream wipe back → logo drops in (frame 360 = frame 0).

Assets: van from the illustration & Visual Library Figma (node `I281:38561;3897:8514`), One logo SVG, Figtree only.

Re-render: `node render.mjs` (stills: `node render.mjs stills 1.0,3.0`). Takes ~30s.
