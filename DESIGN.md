# DESIGN.md - UI/UX Design System & Implementation Guide

This document serves as the single source of truth for the frontend implementation of our responsive web application. It outlines the visual language, component behavior, responsive rules, and section-specific themes required to build the HTML/CSS prototype.

---

## 1. Visual Philosophy & Design Principles

The interface must strictly adhere to a visual style that communicates a **modern, clean, friendly, premium, soft, minimal, and accessible** aesthetic. 

**Avoid at all costs:**
*   Heavy, harsh, or dark shadows
*   Strong, abrupt gradients
*   Excessive or layered glassmorphism effects
*   Sharp corners (0px border-radius)
*   Any colors outside the defined palettes

---

## 2. Typography & Text Hierarchy

We use a two-font system to create contrast between structural headings and readable body text.

| Element | Font Family | Weight | Color Application |
| :--- | :--- | :--- | :--- |
| **Titles (H1, H2)** | DM Sans | Black (900) | High contrast (Dark text on light bg) |
| **Subtitles (H3, H4)**| Poppins | Semi-Bold / Medium | Medium-high contrast |
| **Paragraphs (Body)** | Poppins | Regular (400) | Medium contrast for readability |

---

## 3. Global Color System

The core design system utilizes a soft, pastel-driven color palette.

### Base Palette
*   **Blanco cálido (Warm White):** `#fefdfb`
*   **Lavanda pastel (Pastel Lavender):** `#e3d7fb`
*   **Rosa pastel (Pastel Pink):** `#fee4ef`
*   **Verde pastel (Pastel Green):** `#eaf7ed`

### Color Distribution Strategy
When applying the base palette to generic containers and illustrations, follow this distribution rule:
*   **60%** Dominant
*   **30%** Secondary
*   **10%** Accent
*   **5%** Complement

---

## 4. Section-Specific Themes

The application is split into two distinct visual contexts. Components and backgrounds change depending on the active section.

### A. Corporate Section
*   **Background:** Every screen features a very subtle, ultra-smooth gradient.
    *   *Colors:* `#FDEAC4` → `#FDF3E6` → `#F4DBF0`
    *   *Execution:* Use a linear or radial CSS gradient with high spread and blur to ensure the transition is seamless and elegant, not distracting.
*   **Primary CTA Buttons:** 
    *   Background: `#062573`
    *   Text: White
    *   Style: Pill-shaped (fully rounded corners), soft diffused shadow.

### B. Institutional Section
*   **Background:** Solid color `#F9FFFA`.
*   **Primary CTA Buttons:**
    *   Background: `#FF6C01`
    *   Text: White
    *   Style: Pill-shaped, soft diffused shadow.
*   **Special "Chismear" Button:**
    *   Background: `#336926`
    *   Placement: Must be housed inside the bottom navigation bar.
*   **Bottom Navigation Bar (Mobile):** 
    *   Background: `#4DB21A` (Solid, NO glassmorphism).

---

## 5. UI Components

### Buttons & Tabs
*   **Shape:** Fully rounded (pill shape) for primary buttons and active tabs.
*   **Tab System:** 
    *   *Container:* Soft pastel background (e.g., `#fefdfb` or ultra-light lavender).
    *   *Active Tab:* Solid blue (`#062573`), white text.
    *   *Inactive Tab:* White/light-grey background, dark text, subtle inner or drop shadow to separate from the container.

### Cards & Containers
*   **Border Radius:** Use consistent, generous rounding (e.g., `16px` to `24px`) to maintain a friendly, soft look.
*   **Shadows:** Shadows must be large, soft, and low opacity (e.g., `box-shadow: 0 8px 24px rgba(0,0,0,0.08)`). No harsh offsets.

### Icons
*   **Style:** 3D, playful, and friendly with soft lighting and smooth edges (e.g., Calendar and Map Pin motifs).
*   **Usage:** Keep sizing consistent (e.g., 24x24px for UI controls, larger for empty states).

---

## 6. Glassmorphism Implementation Guide

Glassmorphism is used strictly as a structural accent and must simulate frosted glass.

**CSS Recipe:**
*   `background: rgba(255, 255, 255, 0.4);` (Semi-transparent white)
*   `backdrop-filter: blur(12px);` (Background blur)
*   `border: 1px solid rgba(255, 255, 255, 0.3);` (Thin, low-opacity white border)
*   `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);` (Very soft shadow)
*   `border-radius:` (Matching the global rounded aesthetic)

**Strict Application Matrix:**

| Section | Allowed Glassmorphism Elements |
| :--- | :--- |
| **Corporate** | - Mobile bottom navigation bar<br>- Circular backgrounds behind Like, Share, and Back icons<br>- Featured cards (specifically designed to stand out) |
| **Institutional**| - Hamburger menu container<br>- Featured cards<br>- Bottom map controls/options |

*Warning: Desktop top headers must NEVER use the glassmorphism effect.*

---

## 7. Responsive Behavior & Navigation

The layout must be built with a **mobile-first** methodology.

### Mobile View (Default)
*   **Navigation:** Relies on a fixed Bottom Navigation Bar.
*   **Corporate Section:** The bottom nav uses the Glassmorphism CSS recipe.
*   **Institutional Section:** The bottom nav uses a solid `#4DB21A` background and contains the "Chismear" button.

### Desktop View (Breakpoint: 768px / 1024px and up)
*   **Navigation Transition:** The mobile bottom navigation bar must be completely hidden.
*   **Top Header:** Replaced by a clean, minimal top header.
*   **Corporate Header Specs:** 
    *   Background: Solid `#F5F5F5`
    *   Style: Minimal appearance, absolutely **no** glassmorphism.
*   **Layout Adjustments:** Cards, grids, and typography should scale up proportionally to utilize wider screen real estate while maintaining maximum container widths for readability.
