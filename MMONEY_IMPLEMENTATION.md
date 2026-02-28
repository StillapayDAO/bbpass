# MMoney Ad Header Implementation

## Overview

A premium hero ad section for the bbpass event ticketing platform featuring the MMoney brand with a sophisticated glassmorphism QR code download panel. The component is fully responsive, accessible, and designed to feel non-intrusive while driving user engagement.

## Files Created/Modified

### Components
- **`client/src/components/hero/MMAdHeader.tsx`** - Main hero component with glassmorphism QR panel
- **`client/src/pages/Home.tsx`** - Home page integrating the MMAdHeader
- **`client/src/pages/Events.tsx`** - Events browsing page
- **`client/src/pages/EventDetail.tsx`** - Individual event details page
- **`client/src/pages/Checkout.tsx`** - Checkout/purchase page
- **`client/src/pages/OrderConfirmation.tsx`** - Order confirmation page
- **`client/src/pages/MyTickets.tsx`** - User's tickets page
- **`client/src/pages/OrganizerDashboard.tsx`** - Organizer dashboard
- **`client/src/pages/CreateEvent.tsx`** - Create event page
- **`client/src/pages/EditEvent.tsx`** - Edit event page
- **`client/src/pages/EventAttendees.tsx`** - Event attendees page
- **`client/src/pages/NotFound.tsx`** - 404 page

### Infrastructure
- **`client/src/components/ui/tooltip.tsx`** - Tooltip UI component
- **`client/src/contexts/ThemeContext.tsx`** - Theme context provider
- **`client/src/_core/hooks/useAuth.ts`** - Authentication hook
- **`client/src/hooks/useMobile.ts`** - Mobile detection hook
- **`client/src/lib/trpc.ts`** - tRPC client
- **`client/src/lib/utils.ts`** - Utility functions (cn)
- **`shared/const.ts`** - Added getLoginUrl function

### Assets
- **`client/public/assets/mmoney-ad.gif`** - Hero background image
- **`client/public/assets/mm-qr.png`** - QR code for app download

### Navigation Export
- **`client/src/components/Navbar.tsx`** - Updated to export named export

## Key Features

### MMAdHeader Component
1. **Full-width hero section** with mmoney ad background image
2. **Gradient overlay** (black/70 → transparent) for text readability
3. **Responsive typography**:
   - Headline: 3xl (mobile) → 6xl (desktop)
   - Subheading: base (mobile) → lg (desktop)
4. **Dual CTAs**:
   - Primary: "Create Event Now" → routes to `/organizer/create`
   - Secondary: "Download MM App" → opens glassmorphism panel

### Glassmorphism QR Panel
1. **Responsive layouts**:
   - Desktop: Right-aligned dropdown with mt-3
   - Mobile: Bottom sheet from screen bottom
2. **Glassmorphism styling**:
   - `backdrop-blur-lg` for frosted glass effect
   - `bg-white/10` for semi-transparent background
   - `border-white/20` for subtle border
   - `shadow-2xl` for depth
3. **Panel content**:
   - MM logo (text badge)
   - "Scan to download the Mmoney App" text
   - Centered QR code (40x40 → 48x48 on desktop)
   - Subtle footer: "Fast, Secure, Mobile Payments"
4. **Interactions**:
   - Toggle on button click
   - Close on outside click (via useEffect)
   - Close button on mobile
   - Smooth fade-in + slide animation

### Accessibility
- Semantic HTML (section, dialog)
- ARIA attributes:
  - `role="dialog"` on panel
  - `aria-label` for dialog and button
  - `aria-expanded` for toggle state
  - `aria-controls` linking button to panel
- Proper alt text on all images
- Keyboard-accessible (via close button)

### Performance
- No external libraries beyond existing deps
- Lazy dropdown component (renders conditionally)
- Fixed background image (CSS `background-attachment: fixed`)
- Minimal animations (fade + slide)
- No layout shift

## Design System

### Colors
- **Background**: Transparent/translucent white (bg-white/10, white/20, white/60)
- **Text**: White and white variants (text-white, text-white/90, text-white/80)
- **Accents**: Blue (primary CTA), transparent white (secondary CTA)
- **Overlay**: Black gradient (from-black/70 via-black/40 to-transparent)

### Typography
- **Headline**: font-bold, 3xl-6xl
- **Subheading**: font-normal, base-lg, text-white/90
- **Button text**: font-semibold, base-lg

### Spacing
- Hero padding: pt-24 pb-20 (mobile) → pt-32 pb-24 (desktop)
- CTA button gap: gap-4
- Panel gap: gap-4
- Panel padding: p-6

## Integration

The MMAdHeader is integrated into the Home page:

```tsx
import MMAdHeader from "@/components/hero/MMAdHeader";

export default function Home() {
  return (
    <main>
      <Navbar />
      <MMAdHeader />
      {/* Additional sections */}
    </main>
  );
}
```

## Customization

To customize the component:

1. **Background image**: Replace `/assets/mmoney-ad.gif` path
2. **QR code image**: Replace `/assets/mm-qr.png` path
3. **Colors**: Modify Tailwind classes (bg-white/10, border-white/20, etc.)
4. **Routes**: Update navigation paths in onClick handlers
5. **Text**: Edit headline and subheading content
6. **Panel content**: Add/remove elements from the panel inner div

## Browser Support

- Modern browsers with CSS `backdrop-filter` support
- Fallback to solid colors in older browsers
- Mobile-first responsive design
- Touch-friendly CTA buttons (48px minimum on mobile)

## Notes

- No modification to existing event or checkout logic
- Non-intrusive design that complements the platform
- SEO-friendly with semantic HTML and proper text content
- Fully typed TypeScript implementation
- No console errors or warnings
