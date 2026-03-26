# Design System Document

## 1. Overview & Creative North Star
### The Creative North Star: "The Luminous Curator"
This design system rejects the "standard chat app" template in favor of an editorial, high-end messaging experience. The objective is to move away from rigid boxes and harsh borders toward a fluid, atmospheric interface. By leveraging **Luminous Minimalism**, we treat the UI as a series of light-drenched surfaces where hierarchy is defined by tonal depth and deliberate white space rather than structural lines. 

The aesthetic is professional yet friendly—achieved through the sophisticated interplay of charcoal navigation, expansive light-gray surfaces, and a high-energy yellow accent that acts as a "beacon" for user attention.

---

## 2. Colors & Surface Logic

### The "No-Line" Rule
To achieve a premium feel, **1px solid borders are strictly prohibited** for sectioning. Boundaries must be defined through background color shifts or subtle tonal transitions. For example, a chat list item does not need a bottom border; it simply exists on `surface-container-low` while the active item might sit on `surface-container-lowest` to create distinction.

### Surface Hierarchy & Nesting
Depth is achieved through "Tonal Stacking." Treat the interface as layers of fine paper:
- **Base Layer:** `surface` (#f9f9f9)
- **Secondary Sectioning:** `surface-container-low` (#f3f3f3)
- **High-Emphasis Containers (Cards/Inputs):** `surface-container-lowest` (#ffffff)
- **Deep Recess (Navigation/Sidebars):** `inverse-surface` (#2f3131)

### The "Glass & Gradient" Rule
Floating elements (like popovers or tooltips) should utilize **Glassmorphism**. Use `surface` colors at 80% opacity with a `20px` backdrop-blur to allow underlying content to bleed through softly. 

For primary CTAs or notification banners, use a subtle linear gradient transitioning from `secondary` (#705d00) to `secondary_container` (#fdd400) at a 135-degree angle. This adds "soul" and dimension to the flat yellow accent.

---

## 3. Typography
Our typography pairing is designed for high readability with an editorial flair.

*   **Display & Headlines (Plus Jakarta Sans):** A modern, geometric sans-serif that feels authoritative. Use `headline-lg` and `headline-md` for onboarding and major section headers to establish a "magazine" feel.
*   **Body & Labels (Inter):** The workhorse of the system. `body-md` is the standard for chat messages, providing exceptional legibility at small sizes.
*   **Identity through Scale:** We utilize a high-contrast scale. The jump from `label-sm` (metadata like timestamps) to `title-lg` (user names) creates an immediate visual anchor, guiding the eye through the conversation flow without the need for icons or bold colors.

---

## 4. Elevation & Depth

### The Layering Principle
Forget traditional drop shadows. Hierarchy is conveyed through **Tonal Layering**. Place a `surface-container-lowest` card on a `surface-container` background to create a "soft lift." This mimics natural light falling on stacked surfaces.

### Ambient Shadows
When a physical "float" is required (e.g., a floating action button or a modal):
- **Blur:** 24px - 40px
- **Opacity:** 4%-6%
- **Color:** Use a tinted shadow based on `on-surface` (#1a1c1c) rather than pure black to keep the UI feeling "airy."

### The "Ghost Border" Fallback
If contrast ratios require a boundary for accessibility, use a **Ghost Border**: the `outline-variant` token (#d0c6ab) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** High-impact `secondary_container` (#fdd400) with `on-secondary-container` text. Use `roundedness.md` (0.75rem).
*   **Secondary:** `surface-container-highest` with `on-surface` text. No border.
*   **Tertiary:** Transparent background with `primary` (#5f5e5e) text.

### Inputs & Search
Fields should use `surface-container-lowest` (#ffffff) to "pop" against the `surface-container` background. The focus state should never use a thick border; instead, use a 2px outer glow of `secondary_fixed` (#ffe170).

### Cards & Chat Threads
*   **Rule:** Forbid divider lines. 
*   **Implementation:** Use `spacing.4` (1rem) of vertical white space to separate chat bubbles. 
*   **Sent Messages:** Use `primary` (#5f5e5e) with `on-primary` text for a sophisticated, "dark mode" bubble within a light interface.
*   **Received Messages:** Use `surface-container-high` (#e8e8e8) to keep them recessive.

### Selection Chips
Use `roundedness.full` with `surface-container-highest`. Upon selection, transition to `secondary_fixed` with a soft ambient shadow to indicate "press."

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Align timestamps to the far right while keeping names to the left to create a dynamic, editorial rhythm.
*   **Use Generous Padding:** When in doubt, increase spacing. Use `spacing.6` (1.5rem) as your default container padding to let the content breathe.
*   **Layer Neutrals:** Use the full range of grays (from `surface-dim` to `surface-bright`) to create nuance.

### Don't:
*   **Don't use 100% Black:** Even for navigation. Use `inverse-surface` (#2f3131) to maintain a professional, charcoal aesthetic.
*   **Don't use Box Shadows on Everything:** Only use shadows for elements that physically "hover" over the main plane of the UI.
*   **Don't use standard Dividers:** If content feels cluttered, increase the `spacing` scale step rather than adding a line. 
*   **Don't ignore Accessibility:** While we use soft tones, ensure all text meets WCAG AA standards by using the `on-surface` and `on-primary` tokens correctly.