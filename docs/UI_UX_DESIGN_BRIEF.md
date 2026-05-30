# UI/UX Design Brief
## VAPTLearn — Hyperstudio Monochrome Terminal Design

---

## Design System: Hyperstudio

**Source:** https://styles.refero.design/style/8eb9c53e-d69c-497a-b640-610856cf3a60

Monochrome terminal with amber accents. Every element serves a distinct, functional purpose against a dark, featureless backdrop. Feels like a precisely coded interface.

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Deep Space | `#080808` | Secondary/deeper background |
| Midnight Void | `#101010` | Primary page background |
| Dark Carbon | `#333333` | Borders, muted backgrounds |
| Ash Gray | `#949494` | Secondary text |
| Slate | `#C1C1C1` | Borders, dividers |
| Polar White | `#F3F3F3` | Primary text |
| Absolute Zero | `#FFFFFF` | Accent text, button labels |
| Amber Glow | `#E7C59A` | Key accent (interactive, tags, highlights) |
| Neon Green | `#00AC5C` | Status indicators, success, "learned" state |

---

## Typography

| Role | Font | Fallback | Weight | Sizes |
|------|------|----------|--------|-------|
| Primary | Aeonik | Inter | 400, 700 | 13-63px |
| Code | Input | JetBrains Mono | 400 | 13-18px |

### Scale (Minor Third 1.2 from 14px)
- display-lg: 63px / 400 / 1.05
- display: 44px / 400 / 1.07
- heading-lg: 34px / 400 / 1.03
- heading: 23px / 400 / 1.07
- heading-sm: 21px / 400 / 0.95
- subheading: 18px / 400 / 1.31
- body: 16px / 400 / 1.25
- body-sm: 14px / 400 / 1.43
- caption: 13px / 400 / 1.38

---

## Spacing & Shape

| Token | Value |
|-------|-------|
| Density | Comfortable |
| Base unit | 4px |
| Section gap | 64px |
| Card padding | 24px |
| Element gap | 10px |
| Button radius | 8px |
| Default radius | 8px |
| Tag radius | 20px |
| Status icons | 99px (circle) |

---

## Component Specifications

### Sidebar
- Fixed left, width ~240px
- Background: Deep Space (#080808)
- Border-right: 1px solid Dark Carbon (#333333)
- Nav items: Polar White text, Amber Glow for active state
- Logo at top

### Command Card
- Background: Midnight Void (#101010)
- Border: 1px solid Dark Carbon (#333333)
- Radius: 8px
- Padding: 24px
- Tool badge: Amber Glow tag (radius 20px)
- Phase badge: Dark Carbon background, Polar White text
- MITRE badge: Neon Green text

### Code Block
- Background: Deep Space (#080808)
- Border: 1px solid Dark Carbon (#333333)
- Font: JetBrains Mono, 14px
- Text: Polar White
- Copy button: top-right corner

### Search Bar
- Background: Midnight Void (#101010)
- Border: 1px solid Dark Carbon (#333333)
- Focus: border → Amber Glow
- Placeholder: Ash Gray
- Text: Polar White

### Buttons
- Primary: Amber Glow background, #101010 text, 8px radius
- Secondary: Dark Carbon border, Polar White text, 8px radius
- Ghost: transparent, Ash Gray text, hover → Polar White

### Tags/Badges
- Radius: 20px (pill)
- Phase tags: Dark Carbon bg, Polar White text
- Tool tags: Amber Glow border, Amber Glow text
- MITRE tags: Neon Green border, Neon Green text
- OS tags: Slate border, Slate text

---

## Design Rules

### DO
- High contrast: Polar White on Midnight Void
- Amber Glow ONLY for key interactive elements
- Neon Green ONLY for status/success indicators
- Monospace font for ALL commands and code
- 8px radius for cards and buttons
- 64px gap between sections
- Ample whitespace — breathable despite dark theme

### DON'T
- No drop shadows — use dark shades for depth
- No additional colors beyond Amber + Green
- No heavy font weights (>700)
- No generic system fonts — use Inter + JetBrains Mono
- No full-width background images
- No excessive rounding beyond specified values
