# MMAdHeader Visual Design Guide

## Design System Overview

### Color Palette

#### Primary Colors
- **Background Overlay**: `from-black/70 via-black/40 to-transparent`
- **Text Primary**: White (`text-white`)
- **Text Secondary**: White 90% (`text-white/90`)
- **Text Tertiary**: White 80% (`text-white/80`)
- **Text Muted**: White 60% (`text-white/60`)

#### Glassmorphism Panel
- **Background**: White 10% (`bg-white/10`)
- **Border**: White 20% (`border-white/20`)
- **Accent**: White 20% (`bg-white/20`)

#### Button Colors
- **Primary CTA**: Blue 500 → Blue 600 hover (`bg-blue-500 hover:bg-blue-600`)
- **Secondary CTA**: Transparent White (`border-white/30 hover:bg-white/10`)

### Typography

```
HEADLINE
Sell Tickets and Boost Your Events

Mobile:  3xl (30px)
Tablet:  5xl (48px)
Desktop: 6xl (60px)

Font Weight: Bold (700)
Line Height: Tight (1.25)
Letter Spacing: Normal


SUBHEADING
Powered by MM — Secure Wallet & Card Payments

Mobile:  base (16px)
Tablet:  lg (18px)
Desktop: lg (18px)

Font Weight: Normal (400)
Line Height: Relaxed (1.5)
Color: text-white/90


BUTTON TEXT
Create Event Now / Download MM App

Mobile:  base (16px)
Desktop: lg (18px)

Font Weight: Semibold (600)
Line Height: Normal (1.5)
```

### Spacing Scale

```
HERO SECTION PADDING
Mobile:  Top 24 (96px) | Bottom 20 (80px)
Desktop: Top 32 (128px) | Bottom 24 (96px)

CONTENT PADDING
Horizontal: 16px (mobile) → auto (desktop on container)

VERTICAL GAPS
Headline → Subheading: 16px (md: 24px)
Subheading → CTA: 32px (md: 40px)
CTA buttons: 16px gap

PANEL PADDING
Horizontal & Vertical: 24px (96px total)

PANEL CONTENT GAPS
Items: 16px gap vertically
```

### Responsive Breakpoints

```
Mobile:   < 640px (sm breakpoint)
Tablet:   640px - 1024px (md breakpoint)
Desktop:  1024px + (lg breakpoint)

LAYOUT CHANGES AT BREAKPOINTS:

< 640px (Mobile):
- Full-width hero
- Single-column CTAs
- Bottom sheet QR panel
- 16px horizontal padding

640px - 768px (Small Tablet):
- Full-width hero
- Row CTAs with flex-wrap
- Dropdown QR panel
- 24px horizontal padding

768px+ (Desktop):
- Full-width hero
- Row CTAs
- Right-aligned dropdown panel
- 32px horizontal padding
```

## Component Hierarchy

```
<section className="hero">
  ├─ <div className="overlay">
  └─ <div className="content">
     ├─ <h1 className="headline">
     ├─ <p className="subheading">
     └─ <div className="ctas">
        ├─ <Button className="cta-primary">
        └─ <div className="cta-secondary">
           ├─ <Button className="trigger">
           └─ {isOpen && (
              <div className="panel">
                 ├─ <div className="logo">
                 ├─ <div className="text">
                 ├─ <div className="qr">
                 └─ <p className="footer">
              </div>
           )}
```

## Visual States

### Desktop Layout
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Gradient Overlay
│  ░░ SELL TICKETS AND BOOST YOUR EVENTS                ░ │
│  ░░ Powered by MM — Secure Wallet & Card Payments    ░ │
│  ░░                                                  ░ │
│  ░░ ┌──────────────────┐  ┌──────────────────┐      ░ │
│  ░░ │ Create Event Now │  │ Download MM App │      ░ │
│  ░░ └──────────────────┘  └──────────────────┘      ░ │
│  ░░                                                  ░ │
│  ░░                         ┌────────────────────┐   ░ │  ← Panel appears
│  ░░                         │ ╔══════════════╗  │   ░ │     on click
│  ░░                         │ ║      MM      ║  │   ░ │
│  ░░                         │ ╚══════════════╝  │   ░ │
│  ░░                         │ Scan to download │   ░ │
│  ░░                         │ the Mmoney App   │   ░ │
│  ░░                         │   [QR CODE]      │   ░ │
│  ░░                         │ Fast, Secure,... │   ░ │
│  ░░                         └────────────────────┘   ░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌──────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← Gradient Overlay
│ ░░ SELL TICKETS AND BOOST   ░│
│ ░░ YOUR EVENTS              ░│
│ ░░ Powered by MM — Secure   ░│
│ ░░ Wallet & Card Payments   ░│
│ ░░                          ░│
│ ░░ ┌──────────────────────┐ ░│
│ ░░ │ Create Event Now     │ ░│
│ ░░ └──────────────────────┘ ░│
│ ░░ ┌──────────────────────┐ ░│
│ ░░ │ Download MM App      │ ░│
│ ░░ └──────────────────────┘ ░│
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│                              │
└──────────────────────────────┘

WHEN DOWNLOAD BUTTON CLICKED:
┌──────────────────────────────┐
│                              │
│ ┌────────────────────────────┤  ← Bottom sheet
│ │ X                          │    slides up
│ │ ┌──────────────────────────┤
│ │ │        MM                │
│ │ │  Scan to download        │
│ │ │  the Mmoney App          │
│ │ │                          │
│ │ │     [QR CODE]            │
│ │ │                          │
│ │ │ Fast, Secure, Mobile...  │
│ │ └──────────────────────────┤
│ └────────────────────────────┘
└──────────────────────────────┘
```

## Animation Specifications

### Panel Entrance
```
Duration: 300ms
Easing: ease-out
Effects:
  - Fade in (opacity: 0 → 1)
  - Slide in from top (translateY: -8px → 0)
  - Scale: 0.95 → 1 (implicit in slide-in-from-top)
```

### Button Hover
```
Duration: 200ms
Easing: ease-in-out
Effects:
  - Primary: Blue 500 → Blue 600
  - Secondary: White/0 → White/10 background
```

### Close Animation
```
Duration: 200ms
Easing: ease-in
Effects:
  - Fade out (opacity: 1 → 0)
  - Slight scale down or slide out
```

## Icon Specifications

### Download Icon (lucide-react)
```
Icon: Download
Size: 16px (on 16px buttons)
Color: Inherit from button text (white)
Margin: 8px right of text
```

### Close Icon (lucide-react)
```
Icon: X
Size: 20px
Color: text-white
Button: 8px padding, rounded-lg hover background
```

## Accessibility Visual Indicators

### Keyboard Focus
```
Focus Ring: 2px solid ring-ring (from Tailwind)
Color: Depends on theme
Padding: 4px around element
```

### Interactive States

#### Button - Normal
- Background: Blue 500
- Text: White
- Border: None

#### Button - Hover
- Background: Blue 600
- Text: White
- Cursor: pointer

#### Button - Focus
- Background: Blue 600
- Text: White
- Ring: 2px focus-ring

#### Button - Active
- Background: Blue 700 (implied)
- Text: White

### Panel - Focus States
```
Logo Focus: Focus ring around MM badge
Text Focus: Standard text focus indicator
QR Focus: Focus ring around image container
Button Focus: 2px focus-ring around close button
```

## Image Specifications

### Hero Background (mmoney-ad.gif)
```
Format: GIF (animated)
Aspect Ratio: 16:9 (or wider)
Recommended Size: 1920x1080 or larger
Min Width: 320px (mobile)
Position: Fixed (background-attachment: fixed)
Repeat: No-repeat
Size: Cover
```

### QR Code (mm-qr.png)
```
Format: PNG (transparent preferred)
Dimensions: Square
Content: Valid QR code
Sizes Rendered:
  - Mobile: 160x160px (40x40 in CSS)
  - Desktop: 192x192px (48x48 in CSS)
Min Resolution: 256x256px source
```

## Shadow & Depth

### Panel Shadow
```
Class: shadow-2xl
Effect: 
  0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Panel Glassmorphism
```
Backdrop Filter: blur(12px) [16px for -lg]
Background: White with 10% opacity
Border: 1px solid white 20% opacity
Result: Frosted glass effect
```

## Interaction Zones

### Clickable Areas
```
Primary CTA:
- Min: 44px height (48px with padding)
- Width: Auto (content-based)
- Touch Target: 48x48px minimum

Secondary CTA:
- Min: 44px height (48px with padding)
- Width: Auto (content-based)
- Touch Target: 48x48px minimum

Panel Close Button (Mobile):
- Size: 40x40px (visible as 36x36px)
- Touch Target: 44x44px minimum
- Position: Top-right corner

Panel Outside:
- Close on click anywhere outside
- Except on trigger button (prevents flicker)
```

## Breakpoint-Specific Styling

### Mobile (< 640px)
```
Hero:
  - Padding: 96px 16px 80px
  - Container: max-w-full

Headline:
  - Font Size: 30px (3xl)
  - Max Width: Full
  - Margin Bottom: 16px

Subheading:
  - Font Size: 16px (base)
  - Max Width: 288px (md)
  - Margin Bottom: 32px

CTAs:
  - Layout: flex-col (stacked)
  - Button Gap: 16px
  - Width: Full container

QR Panel:
  - Position: fixed bottom-0
  - Width: Full (0 left, 0 right)
  - Rounded: rounded-t-2xl
  - Animation: Slide up from bottom
```

### Tablet (640px - 1024px)
```
Hero:
  - Padding: 96px 24px 80px
  - Container: max-w-2xl

Headline:
  - Font Size: 48px (5xl)
  - Max Width: 560px
  - Margin Bottom: 24px

Subheading:
  - Font Size: 18px (lg)
  - Max Width: 320px
  - Margin Bottom: 40px

CTAs:
  - Layout: flex-row (flex-wrap for mobile)
  - Button Gap: 16px
  - Width: Auto

QR Panel:
  - Position: absolute
  - Right aligned (right-0)
  - Below button (top-full mt-3)
  - Rounded: rounded-xl
```

### Desktop (1024px+)
```
Hero:
  - Padding: 128px 32px 96px
  - Container: max-w-6xl centered

Headline:
  - Font Size: 60px (6xl)
  - Max Width: 800px
  - Margin Bottom: 24px

Subheading:
  - Font Size: 18px (lg)
  - Max Width: 336px
  - Margin Bottom: 40px

CTAs:
  - Layout: flex-row
  - Button Gap: 16px
  - Width: Auto

QR Panel:
  - Position: absolute
  - Right aligned (right-0)
  - Below button (top-full mt-3)
  - Rounded: rounded-xl
  - Width: Auto content-based
```

## Contrast & Readability

### Text on Overlay
```
Headline:
- Color: White (rgb(255, 255, 255))
- Overlay: Black 70%
- Contrast Ratio: 19.6:1 (WCAG AAA)

Subheading:
- Color: White 90% (rgba(255, 255, 255, 0.9))
- Overlay: Black 70%
- Contrast Ratio: 17.6:1 (WCAG AAA)
```

### Panel Text
```
Title:
- Color: White (rgb(255, 255, 255))
- Background: White 10% + Blur
- Contrast Ratio: Sufficient for readability

Subtitle:
- Color: White 80% (rgba(255, 255, 255, 0.8))
- Background: White 10% + Blur
- Contrast Ratio: Acceptable

Footer:
- Color: White 60% (rgba(255, 255, 255, 0.6))
- Background: White 10% + Blur
- Contrast Ratio: Still readable at normal viewing
```

## Browser-Specific Rendering

### Modern Browsers (Chrome, Firefox, Safari, Edge)
- Full glassmorphism support
- Smooth animations
- Proper backdrop-filter rendering
- CSS Grid/Flexbox fully supported

### Safari (iOS/macOS)
- Requires `-webkit-backdrop-filter`
- May have slight color differences
- Touch interaction works properly

### Fallback Rendering
- If backdrop-filter not supported:
  - Panel background: Solid white with opacity
  - Still readable and functional
  - Animations still work
  - No functionality loss

---

For implementation details, see `COMPONENT_REFERENCE.md`
For setup guide, see `SETUP_GUIDE.md`
