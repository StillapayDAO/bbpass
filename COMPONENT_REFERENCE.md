# MMAdHeader Component - Quick Reference

## Component Location
`client/src/components/hero/MMAdHeader.tsx`

## Import & Usage

### Basic Import
```tsx
import MMAdHeader from "@/components/hero/MMAdHeader";
```

### Usage in Page
```tsx
import MMAdHeader from "@/components/hero/MMAdHeader";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <MMAdHeader />
      
      {/* Additional sections can be added here */}
    </main>
  );
}
```

## Component Structure

### 1. Hero Section
```tsx
<section
  className="relative w-full bg-cover bg-center pt-24 pb-20 md:pt-32 md:pb-24 overflow-hidden"
  style={{
    backgroundImage: "url(/assets/mmoney-ad.gif)",
    backgroundAttachment: "fixed",
  }}
>
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
  
  {/* Content Container */}
  <div className="relative z-10 container mx-auto px-4">
    {/* Headline, Subheading, CTAs */}
  </div>
</section>
```

### 2. Headline
```tsx
<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
  <span className="text-pretty">
    Sell Tickets and Boost Your Events
  </span>
</h1>
```

### 3. Subheading
```tsx
<p className="text-base md:text-lg text-white/90 mb-8 md:mb-10 leading-relaxed max-w-md">
  Powered by MM — Secure Wallet & Card Payments
</p>
```

### 4. Primary CTA
```tsx
<Button
  size="lg"
  className="font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
  onClick={() => navigate("/organizer/create")}
>
  Create Event Now
</Button>
```

### 5. Secondary CTA (with panel trigger)
```tsx
<Button
  ref={triggerRef}
  variant="outline"
  size="lg"
  className="font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 border-white/30 text-white hover:bg-white/10 transition-colors duration-200"
  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  aria-label="Download MM App"
  aria-expanded={isDropdownOpen}
  aria-controls="mm-qr-panel"
>
  <Download className="w-4 h-4 mr-2" />
  Download MM App
</Button>
```

### 6. Glassmorphism Panel

#### Desktop Dropdown
```tsx
{isDropdownOpen && (
  <div
    ref={dropdownRef}
    id="mm-qr-panel"
    role="dialog"
    aria-label="Download Mmoney App"
    className="absolute z-50 animate-in fade-in slide-in-from-top-2 transition-all duration-300 ease-out right-0 top-full mt-3 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl p-6"
  >
    {/* Panel Content */}
  </div>
)}
```

#### Mobile Bottom Sheet
```tsx
className={`
  absolute z-50 animate-in fade-in slide-in-from-top-2 transition-all duration-300 ease-out
  ${isMobile
    ? "fixed bottom-0 left-0 right-0 rounded-t-2xl"
    : "right-0 top-full mt-3 rounded-xl"
  }
  backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl p-6
`}
```

### 7. Panel Content

#### MM Logo
```tsx
<div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm">
  <span className="font-bold text-white text-lg">MM</span>
</div>
```

#### Panel Text
```tsx
<div className="text-center">
  <h3 className="text-white font-semibold mb-1">
    Scan to download
  </h3>
  <p className="text-white/80 text-sm">
    the Mmoney App
  </p>
</div>
```

#### QR Code
```tsx
<div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
  <img
    src="/assets/mm-qr.png"
    alt="QR code to download Mmoney app"
    className="w-40 h-40 md:w-48 md:h-48"
  />
</div>
```

#### Footer Text
```tsx
<p className="text-white/60 text-xs text-center">
  Fast, Secure, Mobile Payments
</p>
```

## Key Hooks & States

### State Management
```tsx
const [, navigate] = useLocation();           // Routing
const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Panel visibility
const dropdownRef = useRef<HTMLDivElement>(null);            // Panel DOM ref
const triggerRef = useRef<HTMLButtonElement>(null);          // Button DOM ref
const isMobile = useIsMobile();                               // Mobile detection
```

### Close on Outside Click
```tsx
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !triggerRef.current?.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  }

  if (isDropdownOpen) {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }
}, [isDropdownOpen]);
```

## Customization Points

### Background Image
```tsx
// Line ~40
backgroundImage: "url(/assets/mmoney-ad.gif)"
// Change to your image
backgroundImage: "url(/assets/your-image.gif)"
```

### Overlay Gradient
```tsx
// Line ~50
className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
// Darken: from-black/80 via-black/50 to-black/30
// Lighten: from-black/60 via-black/30 to-transparent
```

### Button Colors - Primary CTA
```tsx
// Line ~73
className="... bg-blue-500 hover:bg-blue-600 ..."
// Change blue to: purple, indigo, cyan, teal, etc.
```

### Button Colors - Secondary CTA
```tsx
// Line ~82
className="... border-white/30 text-white hover:bg-white/10 ..."
// Increase opacity: border-white/50 hover:bg-white/20
```

### QR Code Panel Background
```tsx
// Line ~111
className="... bg-white/10 border border-white/20 ..."
// Increase opacity: bg-white/20 border-white/40
```

### Route Destinations
```tsx
// Primary CTA (Line ~74)
onClick={() => navigate("/organizer/create")}

// Change to your route
onClick={() => navigate("/your-custom-path")}
```

### Text Content
```tsx
// Headline (Line ~59)
Sell Tickets and Boost Your Events

// Subheading (Line ~65)
Powered by MM — Secure Wallet & Card Payments

// Panel text (Line ~121)
Scan to download / the Mmoney App

// Footer text (Line ~139)
Fast, Secure, Mobile Payments
```

### Responsive Sizing

#### Hero Padding
```tsx
// Line ~36 - Change top/bottom padding
pt-24 pb-20 md:pt-32 md:pb-24
// More spacing: pt-28 pb-24 md:pt-40 md:pb-32
// Less spacing: pt-20 pb-16 md:pt-28 md:pb-20
```

#### Typography Sizes
```tsx
// Headline (Line ~59)
text-3xl md:text-5xl lg:text-6xl
// Smaller: text-2xl md:text-4xl lg:text-5xl
// Larger: text-4xl md:text-6xl lg:text-7xl

// Subheading (Line ~65)
text-base md:text-lg
// Change to: text-sm md:text-base or text-lg md:text-xl
```

#### QR Code Size
```tsx
// Line ~133
className="w-40 h-40 md:w-48 md:h-48"
// Smaller: w-32 h-32 md:w-40 md:h-40
// Larger: w-48 h-48 md:w-56 md:h-56
```

## Event Handlers

### Toggle Panel
```tsx
onClick={() => setIsDropdownOpen(!isDropdownOpen)}
```

### Navigate to Create Event
```tsx
onClick={() => navigate("/organizer/create")}
```

### Close Panel (Mobile)
```tsx
onClick={() => setIsDropdownOpen(false)}
```

## Accessibility Attributes

```tsx
// Button attributes
aria-label="Download MM App"
aria-expanded={isDropdownOpen}
aria-controls="mm-qr-panel"

// Panel attributes
id="mm-qr-panel"
role="dialog"
aria-label="Download Mmoney App"

// Image alt text
alt="QR code to download Mmoney app"

// Close button label
aria-label="Close"
```

## Animation Classes

### Panel Entrance
```tsx
animate-in fade-in slide-in-from-top-2
```

### Transitions
```tsx
transition-all duration-300 ease-out
transition-colors duration-200
```

## Responsive Classes Used

```tsx
// Display
hidden md:flex
md:hidden

// Sizing
text-3xl md:text-5xl lg:text-6xl
w-40 h-40 md:w-48 md:h-48

// Spacing
pt-24 pb-20 md:pt-32 md:pb-24
mb-4 md:mb-6
gap-4

// Layout
flex-col sm:flex-row
```

## Dependencies

```tsx
// External
import { useState, useRef, useEffect } from "react";
import { Download, X } from "lucide-react";

// Internal
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/useMobile";
```

## File References

| File | Purpose |
|------|---------|
| `/assets/mmoney-ad.gif` | Hero background image |
| `/assets/mm-qr.png` | QR code for app download |
| `@/components/ui/button` | Button component |
| `@/hooks/useMobile` | Mobile detection hook |
| `wouter` | Routing library |

---

For complete documentation, see:
- `MMONEY_IMPLEMENTATION.md` - Full implementation details
- `SETUP_GUIDE.md` - Setup and integration guide
- `README_MMONEY.md` - Overview and examples
