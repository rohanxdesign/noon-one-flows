# noon One · Free Delivery — 15s motion piece

`noon-one-free-delivery.mp4` — 1920×1080, 60 fps, 15 s, H.264 + AAC. All type is Figtree (bundled in `fonts/`).

Upsells noon One free delivery and lands on the entry point: the noon One tile next to the homepage search bar.

| Time | Shot | Techniques |
|---|---|---|
| 0.0–1.75 | "STILL PAYING FOR / DELIVERY?" | ignition dot → horizon line, split-mask kinetic type, letter slam + camera shake, strike-through, slice glitch |
| 1.75–3.0 | Type shatters → vortex → logo | ~4k-particle morph from the type's pixels into the One logo, spiral convergence, colour hand-off |
| 3.0–4.6 | Logo lock + 3D exploded view | flash, shockwaves, chromatic aberration, layered parallax with depth shadows, orbit rings with front/back occlusion, light sweeps, domain-warped fluid shader backlight |
| 4.6–7.1 | Zoom through the yellow layer → FREE DELIVERY | zoom-through with radial blur, letter drops, tri-colour wipe reveal, liquid rising inside the letters (mask), rotating arcs/geometry |
| 6.5–7.6 | Marquee band wipe | 9 tilted kinetic bands sweeping across, scene swap under cover |
| 7.1–10.1 | 3D city delivery run | projected 3D grid, buildings that rise into view, chase camera, glowing route, parcel, "Delivery fee → FREE" slot label, crane to top-down, pin drop, circular reveal |
| 9.7–12.9 | Phone homepage | WebGL perspective phone with sheen and soft shadow, callout, dolly into the noon One tile, focus dim, conic glow, tile flips logo → FREE delivery, confetti, tap |
| 12.5–15.0 | End card | shared-element expansion of the tile, text morph into the headline, logo layers restack, highlighter swipe, "Join noon One" CTA |

Post-processing (WebGL): sub-frame motion blur (4 samples, 180° shutter), chromatic aberration, zoom blur, flashes, vignette and grain. The sound design is synthesized in `sound.py`.

## Re-render

```bash
# from this folder; needs Playwright (Chromium) + ffmpeg
ln -s "$(npm root -g)" node_modules     # or npm i playwright
node render.mjs stills /tmp/stills 1.0,3.5,6.0    # quick checks
node render.mjs video video.mp4 4                # 4 = motion-blur subframes
python3 sound.py                                  # -> sound.wav
ffmpeg -i video.mp4 -i sound.wav -c:v copy -c:a aac -b:a 256k -shortest noon-one-free-delivery.mp4
```

You can also open `index.html` from any static server to watch a live (realtime) preview.
