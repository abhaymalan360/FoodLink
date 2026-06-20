---
name: Humanitarian Response System
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#3e4947'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#a50710'
  on-tertiary: '#ffffff'
  tertiary-container: '#c92926'
  on-tertiary-container: '#ffe4e0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  status-indicator:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for high-stakes coordination between commercial kitchens and non-profit organizations. The brand personality is **purposeful, reliable, and urgent**. It avoids the sterile aesthetics of corporate SaaS and the whimsy of consumer food apps, instead adopting a **Humanitarian Aid / Civic Emergency** style. 

The emotional response should be one of "calm agency"—users should feel that while the situation (surplus food) is urgent, the tool is robust enough to handle the logistics without friction. The visual language leans into a **refined utilitarianism**: heavy emphasis on clarity, high-contrast states, and tactile controls that communicate action and progress.

## Colors
The palette is rooted in trust and immediate legibility. 
- **Deep Teal** serves as the primary action color, providing a grounded, authoritative feel for primary buttons and active navigation. 
- **Warm Amber** is used exclusively for "Pending" or "Expiring Soon" states, signaling urgency without triggering panic. 
- **Critical Red** is reserved for immediate logistics failures or highly perishable food alerts. 
- **Success Green** marks completed transfers and successful handoffs.
- **Dark Slate** is used for all primary text to ensure WCAG AAA compliance against the **Soft White** background.

## Typography
This design system utilizes **Inter** for its systematic reliability and neutral tone, paired with **Atkinson Hyperlegible Next** for labels and status indicators to ensure maximum readability for volunteers in variable lighting conditions. 

Hierarchy is strictly enforced. Headlines use tighter letter-spacing and heavier weights to command attention. Body text is set with generous line-height to assist with rapid scanning of logistics data. Status labels use an uppercase secondary font to differentiate metadata from core content.

## Layout & Spacing
The layout follows a **structured dashboard grid**. It uses a 12-column system on desktop and a single-column stack on mobile. 
- **Rhythm:** An 8px base unit (2 x 4px unit) governs all spacing. 
- **Margins:** Desktop views use expansive 48px margins to focus the eye on the central logistics feed. Mobile views utilize 16px margins to maximize screen real estate for "claim" buttons.
- **Density:** High density for data tables, but low density (generous padding) for action-oriented cards to prevent accidental taps in fast-paced kitchen environments.

## Elevation & Depth
Depth is used functionally rather than decoratively. This design system employs **tonal layering** and **low-contrast outlines** to create hierarchy.
- **Level 0 (Background):** Soft White (#F8FAFC).
- **Level 1 (Cards/Containers):** Pure White (#FFFFFF) with a 1px border in Slate-200. No shadow.
- **Level 2 (Active/Urgent):** Pure White with a subtle, 4% opacity Deep Teal shadow (12px blur) to lift urgent notifications above the dashboard plane.
- **Interactive States:** High-contrast color shifts are preferred over shadow increases to indicate hover or focus.

## Shapes
A **Soft** shape language (4px - 8px radius) is used to strike a balance between professional rigor and humanitarian warmth.
- **Standard Elements:** 4px (0.25rem) for input fields and small buttons.
- **Cards & Large Buttons:** 8px (0.5rem) to provide a distinct, "pressable" target.
- **Status Badges:** 2px radius or sharp corners to maintain a serious, "tag-like" appearance.

## Components
- **Buttons:** Large (min 56px height on mobile), high-contrast. Primary buttons use Deep Teal with white text. Success actions use a full-width green "Slide to Confirm" pattern to prevent accidental logistics claims.
- **Urgency Selectors:** Instead of dropdowns, use large "Segmented Control" cards. Each segment includes a color-coded icon (e.g., a clock for Amber/Urgent, a flame for Red/Critical).
- **Logistics Cards:** Standardized containers for food entries. Must feature a "Time Remaining" countdown in the top right corner using the secondary font.
- **Status Indicators:** Small, rectangular badges with high-contrast backgrounds (e.g., Amber background with Dark Slate text) located consistently at the top-left of any card.
- **Input Fields:** Heavy 2px borders when focused. Labels are always visible (never placeholder-only) to ensure users don't lose context while filling out surplus reports.
- **Inventory List:** Highly condensed rows with "Claim" or "Navigate" buttons pinned to the right edge for immediate thumb access.