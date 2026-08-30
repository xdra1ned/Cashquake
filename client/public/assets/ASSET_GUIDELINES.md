# Cashquake Artwork & Asset Guidelines 🎨📐

Welcome to the Cashquake Asset System! Cashquake is built on an **Asset-Slot Architecture**. Real SVG, PNG, or WebP artwork can be placed directly into this folder structure to seamlessly replace the built-in procedural vector fallbacks—**no code rewrite required**.

---

## 📁 Directory Structure & File Naming Conventions

```
client/public/assets/
├── avatars/                           # Player avatar / pawn silhouettes
│   ├── av_cat.svg                     # Mischief Cat (or .png / .webp)
│   ├── av_robot.svg                   # Cyber Bot
│   ├── av_star.svg                    # Jasmine’s Star
│   ├── av_ghost.svg                   # Spooky Phantom
│   ├── av_alien.svg                   # Cosmic Invader
│   ├── av_crown.svg                   # Monarch Crown
│   ├── av_fox.svg                     # Sneaky Fox
│   ├── av_dragon.svg                  # Fire Dragon
│   ├── av_ninja.svg                   # Shadow Ninja
│   └── av_pizza.svg                   # Pizza Slice
│
├── themes/                            # Per-theme board artwork slots
│   ├── world_tour/
│   │   ├── board-center.svg           # Center arena centerpiece artwork
│   │   ├── board-bg.svg               # Optional board background texture
│   │   ├── tiles/                     # Optional tile artwork (e.g. tile_0.svg ... tile_39.svg)
│   │   └── cards/                     # Optional theme card art (e.g. chance_c1.svg, fortune_f1.svg)
│   ├── cyber_neon/
│   │   ├── board-center.svg
│   │   ├── board-bg.svg
│   │   └── cards/
│   ├── mystic_fantasy/
│   │   ├── board-center.svg
│   │   ├── board-bg.svg
│   │   └── cards/
│   ├── cosmic_space/
│   │   ├── board-center.svg
│   │   ├── board-bg.svg
│   │   └── cards/
│   └── anime_akiba/
│       ├── board-center.svg
│       ├── board-bg.svg
│       └── cards/
│
├── cards/                             # Global card illustrations
│   ├── chance_c1.svg                  # Cashquake Surge
│   ├── chance_c2.svg                  # Jasmine's Blessing
│   ├── fortune_f1.svg                 # Bank Glitch
│   └── ...
│
├── dice/                              # Custom 2D / 3D dice faces
│   └── ...
│
└── decorations/                       # Trophy badges, icons, UI frames
    └── ...
```

---

## 📐 Recommended Asset Specifications

| Asset Type | Recommended Formats | Target Dimensions | Aspect Ratio | Transparency |
| :--- | :--- | :--- | :--- | :--- |
| **Avatars / Pawns** | Vector `.svg` (preferred) or `.png` / `.webp` | 256×256 px | 1:1 | Yes (Transparent background) |
| **Board Center Art** | Vector `.svg` (preferred) or `.png` / `.webp` | 800×800 px | 1:1 | Yes (Transparent background) |
| **Card Artwork Slot** | Vector `.svg` (preferred) or `.png` / `.webp` | 400×250 px | 16:10 / 16:9 | Yes / Clean framed edges |
| **Tile Artwork** | Vector `.svg` (preferred) or `.png` / `.webp` | 200×250 px | 4:5 | Yes |
| **Special Space Glyphs** | Vector `.svg` (preferred) | 128×128 px | 1:1 | Yes |

---

## 🔄 Graceful Fallback Hierarchy

Cashquake strictly enforces a 3-tier fallback chain:

```
1. Real User Asset (e.g. /assets/themes/world_tour/board-center.svg)
        ↓ (if missing or null)
2. Theme-Specific Vector Motif (e.g. Illustrated Compass Rose SVG)
        ↓ (if missing)
3. Safe Flat Modern Vector Fallback (Clean geometric game emblem)
```

**Never**:
- ❌ No broken image icons.
- ❌ No emojis as substitutes for missing artwork.
- ❌ No generic empty rectangles.
- ❌ No AI-generated or scraped placeholders.

---

## 💡 How to Add New Artwork

1. Export your design as an `.svg` or high-resolution `.png` with transparent background.
2. Name the file matching the corresponding ID (e.g. `av_cat.svg` or `board-center.svg`).
3. Place it in the appropriate folder under `client/public/assets/`.
4. Refresh the game. The asset loader automatically detects the file and displays your custom artwork!
