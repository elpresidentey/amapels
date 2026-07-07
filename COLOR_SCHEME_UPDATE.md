# Color Scheme Update - White, Black & Gold

## New Brand Colors

### Primary Color: White
- `primary` - #FFFFFF (Pure White)
- `primary-light` - #FAFAFA (Off-White)
- `primary-dark` - #F5F5F5 (Light Gray)

### Brand Color 1: Black
- `black` - #000000 (Pure Black)
- `black-light` - #1A1A1A (Dark Gray)
- `black-dark` - #0A0A0A (Deep Black)

### Brand Color 2: Gold
- `gold-light` - #FFD700 (Bright Gold)
- `gold` - #D4AF37 (Classic Gold)
- `gold-dark` - #B8860B (Dark Goldenrod)
- `gold-metallic` - #AA8B2E (Metallic Gold)

## Usage Guidelines

### Backgrounds
- **Primary Background**: White (`bg-primary` or `bg-white`)
- **Alternate Background**: Off-White (`bg-primary-light`)
- **Section Dividers**: Light Gray (`bg-primary-dark`)

### Text
- **Primary Text**: Black (`text-black`)
- **Secondary Text**: Dark Gray (`text-black-light`)
- **Inverted Text**: White on dark backgrounds (`text-white`)

### Accents & CTAs
- **Primary CTA**: Gold (`bg-gold`)
- **Hover States**: Dark Gold (`hover:bg-gold-dark`)
- **Premium Elements**: Metallic Gold (`bg-gold-metallic`)

### Borders
- **Subtle**: Light Gray (`border-gray-200`)
- **Standard**: Gold (`border-gold`)
- **Strong**: Black (`border-black`)

## Component Updates Needed

### Navigation
- Background: White
- Text: Black
- Hover: Gold
- Active: Gold with Black text

### Buttons
- Primary: Black background, White text, Gold border
- Secondary: White background, Black text, Gold border
- Accent: Gold background, Black text

### Cards
- Background: White
- Border: Light Gold or Light Gray
- Shadow: Subtle black shadow
- Hover: Gold border

### Hero Sections
- Background: White with Gold accents
- Overlay: Black with opacity for images
- Text: Black or White depending on background

### Footer
- Background: Black
- Text: White
- Accents: Gold
- Links: White with Gold hover

### Forms
- Background: White
- Borders: Gray
- Focus: Gold border
- Labels: Black
- Error: Keep red for clarity

### Admin Dashboard
- Background: White
- Sidebar: Black with Gold accents
- Text: Black
- Hover: Gold
- Active: Gold background with Black text

## Typography Colors
- **Headings**: Black (`text-black`)
- **Body Text**: Black (`text-black`)
- **Secondary Text**: Dark Gray (`text-black-light`)
- **Links**: Gold (`text-gold`) with darker hover (`hover:text-gold-dark`)
- **Captions**: Gray (`text-gray-600`)

## Status Colors (Keep for functionality)
- **Success**: Green (`text-green-600`)
- **Warning**: Orange (`text-orange-600`)
- **Error**: Red (`text-red-600`)
- **Info**: Blue (`text-blue-600`)

## Backward Compatibility
The old brown/ivory colors are kept in the config for backward compatibility
but should be gradually replaced with the new color scheme.

## Implementation Priority

### High Priority (Do First):
1. Navigation bar
2. Hero sections
3. Call-to-action buttons
4. Footer

### Medium Priority:
1. Product cards
2. Category pages
3. Admin dashboard
4. Forms

### Low Priority:
1. Fine-tune shadows
2. Hover effects
3. Transitions
4. Micro-interactions

## Design Tips

1. **Contrast**: Ensure sufficient contrast between text and backgrounds
2. **Gold Usage**: Use gold sparingly as accent, not as primary background
3. **White Space**: Maximize white space for clean, luxury feel
4. **Black Text**: Use black for all primary text for maximum readability
5. **Gold Highlights**: Use gold for borders, icons, and emphasis
6. **Shadows**: Use subtle black shadows (low opacity) for depth

## Accessibility

- Black text on white: AAA contrast ratio ✅
- Gold text on white: May need to use gold-dark for better contrast
- White text on black: AAA contrast ratio ✅
- Gold text on black: Good contrast ✅
- Test all combinations with contrast checker

## Example Combinations

### Luxury Card
- Background: White
- Border: 1px solid gold
- Shadow: Subtle black (0.05 opacity)
- Text: Black
- Accent: Gold

### Premium Button
- Background: Black
- Text: White
- Border: 2px solid gold
- Hover: Gold background, black text

### Hero Section
- Background: White
- Overlay image: Black overlay (0.4 opacity)
- Text: White on dark areas, Black on light areas
- CTA: Gold button with black text

---

**Updated:** July 7, 2026
**Status:** Ready for Implementation
