"""Synthesised sound design for the noon One film (numpy only). Writes sound.wav (48k stereo, 15s)."""
import numpy as np, wave, os

SR = 48000
DUR = 15.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(3)


def t_(d): return np.arange(int(SR * d)) / SR


def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N: return
    sig = sig[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * gain * l * 1.414
    R[i:i + len(sig)] += sig * gain * r * 1.414


def onepole_lp(x, fc):
    fc = np.broadcast_to(np.asarray(fc, float), x.shape)
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y


def hp(x, fc): return x - onepole_lp(x, fc)


def env(n, a, d, curve=4.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) * curve / max(d, 1e-4))
    return e


def kick(d=0.5, f0=150, f1=42, g=1.0):
    t = t_(d)
    f = f1 + (f0 - f1) * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) * g + rng.normal(0, 1, len(t)) * np.exp(-t * 120) * 0.15


def sub(d=1.6, f0=70, f1=30):
    t = t_(d)
    f = f1 + (f0 - f1) * np.exp(-t * 3)
    return np.tanh(1.6 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 2.4)


def whoosh(d=0.6, f0=300, f1=4000, peak=0.6, q=1.0):
    n = int(SR * d); t = np.arange(n) / SR
    x = rng.normal(0, 1, n)
    fc = f0 * (f1 / f0) ** (t / d)
    y = onepole_lp(x, fc); y = hp(y, fc * 0.35)
    e = np.where(t < peak * d, (t / (peak * d)) ** 2, np.exp(-(t - peak * d) * 8 / d))
    return y * e * 2.2


def riser(d=1.0, f0=200, f1=6000):
    w = whoosh(d, f0, f1, peak=0.97)
    t = t_(d)
    tone = np.sin(2 * np.pi * np.cumsum(220 * (4 ** (t / d))) / SR) * (t / d) ** 2 * 0.25
    return w[: len(t)] + tone


def tick(f=3200, d=0.05):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) * 0.5 + rng.normal(0, 1, len(t)) * 0.5) * np.exp(-t * 90)


def chime(freqs, d=1.6, decay=3.0):
    t = t_(d); y = np.zeros(len(t))
    for i, f in enumerate(freqs):
        y += (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-t * (decay + i * 0.6))
    return y / len(freqs) * np.minimum(1, t / 0.004)


def hat(d=0.06, g=1.0):
    t = t_(d); x = hp(rng.normal(0, 1, len(t)), 7000)
    return x * np.exp(-t * 70) * g


def snap(d=0.18):
    t = t_(d); x = rng.normal(0, 1, len(t))
    return (hp(x, 1500) * np.exp(-t * 30) + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25) * 0.6)


def glitch(d=0.24):
    n = int(SR * d); y = np.zeros(n); i = 0
    while i < n:
        k = int(rng.integers(300, 2400)); f = rng.choice([180, 440, 880, 1760, 3000])
        seg = np.sign(np.sin(2 * np.pi * f * np.arange(k) / SR)) * rng.uniform(0.2, 0.7)
        if rng.random() < 0.3: seg *= 0
        y[i:i + k] = seg[: n - i]; i += k
    return y * 0.5


def pad(freqs, d, g=0.12):
    t = t_(d); y = np.zeros(len(t))
    for f in freqs:
        for det in (-0.25, 0.0, 0.31):
            ph = rng.uniform(0, 1)
            y += 2 * ((t * f * (1 + det / 100) + ph) % 1) - 1
    y = onepole_lp(y / (len(freqs) * 3), 1400)
    e = np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.6)
    return y * e * g


# ── music bed ──
A2, C3, E3, F2, G2, A3, C4, E4, G3, B3, D4 = 110, 130.81, 164.81, 87.31, 98.0, 220, 261.63, 329.63, 196.0, 246.94, 293.66
add(pad([A2, E3, A3, C4], 2.95, 0.10), 0.0)
add(pad([F2, C3, A3, C4, E4], 1.7, 0.12), 2.95)
add(pad([A2, E3, A3, C4, E4], 3.0, 0.11), 4.62, pan=-0.1)
add(pad([F2, C3, A3, E4], 2.6, 0.11), 7.14, pan=0.1)
add(pad([C3, G3, C4, E4], 2.8, 0.11), 9.7)
add(pad([G2, D4, G3, B3], 0.9, 0.09), 12.5)
add(pad([A2, E3, A3, C4, E4, A3 * 2], 2.2, 0.13), 13.47)
beat = 60 / 128
b = 4.62
while b < 12.45:
    add(kick(0.35, 120, 45), b, 0.55)
    for k in range(4):
        add(hat(0.05, 0.9 if k == 2 else 0.45), b + k * beat / 4, 0.18, pan=0.3 if k % 2 else -0.3)
    add(onepole_lp(np.sign(np.sin(2 * np.pi * 55 * t_(beat * 0.45))) * env(int(SR * beat * 0.45), 0.005, 0.2), 500), b + beat / 2, 0.16)
    b += beat

# ── SFX ──
add(chime([1320, 1980], 0.6, 8), 0.02, 0.18)
add(whoosh(0.4, 600, 6000, 0.6), 0.2, 0.25)
for i in range(3): add(tick(2600 + i * 200), 0.5 + i * 0.07, 0.25, pan=-0.4 + i * 0.4)
for i in range(9): add(tick(1800 + i * 120, 0.04), 0.84 + i * 0.045, 0.16, pan=-0.6 + i * 0.15)
add(kick(0.6, 160, 40), 0.98, 0.9); add(sub(1.0, 60, 30), 0.98, 0.45)
add(whoosh(0.3, 1500, 9000, 0.8), 1.33, 0.4, pan=0.4)
add(glitch(0.24), 1.5, 0.22)
add(kick(0.5, 200, 40), 1.745, 0.9); add(whoosh(0.9, 6000, 300, 0.05), 1.745, 0.6); add(snap(), 1.745, 0.6)
add(riser(0.95, 150, 7000), 2.0, 0.5)
add(kick(0.8, 180, 36), 2.95, 1.0); add(sub(2.0, 75, 28), 2.95, 0.7); add(chime([880, 1318.5, 1760, 2637], 2.2, 2.0), 2.95, 0.3)
add(whoosh(0.5, 400, 3000, 0.5), 3.16, 0.3, pan=-0.5); add(whoosh(0.4, 3000, 500, 0.4), 3.92, 0.3, pan=0.5)
add(riser(0.48, 300, 9000), 4.16, 0.6)
add(snap(), 4.62, 0.35)
for i in range(4): add(kick(0.3, 220, 70), 4.86 + i * 0.05, 0.45); add(snap(0.1), 4.86 + i * 0.05, 0.25)
add(whoosh(0.45, 800, 8000, 0.6), 4.96, 0.35, pan=0.5)
add(chime([1046.5, 1568], 0.5, 9), 5.33, 0.22)
t = t_(0.7); add(np.sin(2 * np.pi * np.cumsum(180 + 120 * np.sin(t * 30) * np.exp(-t * 3)) / SR) * np.exp(-t * 4) * 0.5, 5.8, 0.3)
for i in range(9): add(whoosh(0.4, 500, 5000, 0.7), 6.45 + i * 0.032, 0.12, pan=(-1) ** i * 0.7)
add(kick(0.6, 170, 38), 7.14, 0.8); add(sub(1.4, 70, 30), 7.14, 0.45)
for i in range(9): add(whoosh(0.35, 4000, 600, 0.3), 7.2 + i * 0.03, 0.08, pan=(-1) ** i * 0.7)
n = int(SR * 2.4); tt = np.arange(n) / SR
rum = onepole_lp(rng.normal(0, 1, n), 180 + 600 * np.sin(np.pi * tt / 2.4) ** 2) * np.sin(np.pi * tt / 2.4) ** 1.5 * 2.5
add(rum, 7.15, 0.35)
add(chime([1318.5, 1975.5], 1.0, 5), 8.27, 0.3); add(chime([1975.5, 2637], 0.8, 6), 8.47, 0.22)
t = t_(0.4); add(np.sin(2 * np.pi * np.cumsum(2400 * np.exp(-t * 5) + 300) / SR) * np.exp(-t * 4) * 0.3, 9.3, 0.25)
add(kick(0.5, 140, 40), 9.56, 0.7); add(chime([523.25, 784], 1.2, 3), 9.56, 0.2)
add(whoosh(0.6, 300, 7000, 0.55), 9.6, 0.45)
add(tick(4000, 0.03), 10.22, 0.25)
add(whoosh(0.6, 200, 5000, 0.6), 10.8, 0.45)
add(chime([1568, 2093, 2637, 3136], 1.4, 3), 11.48, 0.25); add(snap(0.08), 11.48, 0.2)
add(tick(1500, 0.06), 12.33, 0.45); add(kick(0.15, 300, 120), 12.33, 0.3)
add(riser(0.45, 400, 9000), 12.06, 0.35)
add(whoosh(0.5, 4000, 300, 0.2), 12.48, 0.5)
for i in range(5): add(kick(0.25, 240, 90), 13.15 + i * 0.07, 0.3); add(tick(1200 + i * 150, 0.05), 13.15 + i * 0.07, 0.2)
add(kick(0.9, 170, 34), 13.47, 1.0); add(sub(2.2, 70, 28), 13.47, 0.6); add(chime([880, 1108.7, 1318.5, 1760, 2217], 2.2, 1.6), 13.47, 0.3)
add(chime([2637, 3520], 1.0, 4), 14.05, 0.12)

# simple stereo reverb (feedback delays)
def verb(x):
    y = np.zeros_like(x)
    for d, g in ((0.031, 0.5), (0.047, 0.45), (0.071, 0.4), (0.113, 0.33), (0.167, 0.25), (0.229, 0.18)):
        k = int(d * SR); y[k:] += x[:-k] * g
    return onepole_lp(y, 5000)
L2 = L + 0.35 * verb(R); R2 = R + 0.35 * verb(L)
mix = np.stack([L2, R2], 1)
fade = np.minimum(1, (N - np.arange(N)) / (SR * 0.6))[:, None]
mix *= fade
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix /= max(1e-9, np.abs(mix).max()) / 0.89
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sound.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', out)
