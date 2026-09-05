# DESIGN.md — Sulok Design System

> Design tokens, component conventions, and visual guidelines for Sulok.

---

## Brand

- **Name:** Sulok
- **Pronunciation:** /suː.lok/ (SOO-lok)
- **Tagline:** Your corner of the web.
- **Mascot:** Sulo. A subtle, flat 2D character that serves as the brand's playful identity. Sulo is responsive and expressive (e.g., sleepy, shy, confused) depending on app context and user interaction.
- **Description:** A personal web library for saving, organizing, and rediscovering things you find on the internet.

---

## Color Palette

Five colors only. No additions without explicit approval.

| Token              | Name     | Hex       | HSL          | Usage                              |
| ------------------ | -------- | --------- | ------------ | ---------------------------------- |
| `--color-charcoal` | Charcoal | `#1E1B18` | `30 12% 10%` | Text, foreground, headings         |
| `--color-cream`    | Cream    | `#F7F5F0` | `40 30% 95%` | Page background                    |
| `--color-amber`    | Amber    | `#C49A6C` | `30 40% 60%` | Primary accent, brand, interactive |
| `--color-stone`    | Stone    | `#7C7570` | `25 4% 47%`  | Muted text, borders, icons         |
| `--color-linen`    | Linen    | `#E8E4DE` | `36 16% 89%` | Cards, surfaces, hover states      |

### Semantic Mapping

| Semantic Token | Maps To  | Usage                        |
| -------------- | -------- | ---------------------------- |
| `--foreground` | Charcoal | Primary text                 |
| `--background` | Cream    | Page background              |
| `--primary`    | Amber    | Buttons, links, accents      |
| `--muted`      | Stone    | Secondary text, placeholders |
| `--card`       | Linen    | Card backgrounds, sections   |
| `--border`     | Linen    | Borders, dividers            |
| `--ring`       | Amber    | Focus rings                  |

---

## Typography

| Role            | Font       | Weight  | Size    | Tracking |
| --------------- | ---------- | ------- | ------- | -------- |
| Display         | Fraunces   | 500–700 | 24–32px | -0.02em  |
| Heading (H1)    | Fraunces   | 600     | 20–24px | -0.01em  |
| Heading (H2)    | Geist Sans | 600     | 16–18px | -0.01em  |
| Body            | Geist Sans | 400     | 14px    | 0        |
| Small / Caption | Geist Sans | 400     | 12px    | 0.01em   |
| Monospace / URL | Geist Mono | 400     | 13px    | 0        |

### Font Loading

```css
/* Geist Sans & Mono — self-hosted from Vercel */
@font-face {
	font-family: "Geist Sans";
	src: url("/fonts/geist-sans.woff2") format("woff2");
}

@font-face {
	font-family: "Geist Mono";
	src: url("/fonts/geist-mono.woff2") format("woff2");
}

/* Fraunces — Google Fonts / @fontsource-variable/fraunces */
```

---

## Spacing

Use a 4px base grid. TailwindCSS spacing scale.

| Token   | Value | Usage                    |
| ------- | ----- | ------------------------ |
| `gap-1` | 4px   | Tight inline spacing     |
| `gap-2` | 8px   | Between related elements |
| `gap-3` | 12px  | Default component gap    |
| `gap-4` | 16px  | Section spacing          |
| `gap-6` | 24px  | Major section breaks     |

---

## Border Radius

| Token        | Value | Usage                 |
| ------------ | ----- | --------------------- |
| `rounded-sm` | 4px   | Small inputs, tags    |
| `rounded-md` | 6px   | Cards, buttons        |
| `rounded-lg` | 8px   | Modal dialogs, sheets |

### Squircles (Progressive Enhancement)

We use `@toolwind/corner-shape` (`corner-squircle`) for a premium iOS-like corner smoothing.
Because CSS `corner-shape` is not universally supported, we enforce a strict progressive enhancement pattern:

- **Fallback:** Always include a baseline `rounded-*` class (e.g., `rounded-md` / 6px) for Safari/Firefox/Mobile.
- **Enhanced:** Use `supports-[corner-shape:squircle]:rounded-*` to apply the larger radius required for a deep squircle (e.g., `rounded-xl` or `rounded-2xl`) only on supported browsers.

Example: `className="rounded-md supports-[corner-shape:squircle]:rounded-xl corner-squircle"`

---

## Shadows

Minimal shadows. Prefer border/background differentiation.

| Token       | Value                              | Usage                    |
| ----------- | ---------------------------------- | ------------------------ |
| `shadow-sm` | `0 1px 2px rgba(30, 27, 24, 0.05)` | Cards, elevated surfaces |
| `shadow-md` | `0 2px 8px rgba(30, 27, 24, 0.08)` | Dropdowns, popovers      |

---

## Component Guidelines

### Buttons

- **Primary:** Amber background, Charcoal text. Used for main actions (Save, Create).
- **Secondary:** Linen background, Charcoal text. Used for secondary actions.
- **Ghost:** Transparent, Stone text. Used for tertiary actions, toolbar buttons.
- **Destructive:** Muted red (`#B54D4D`), for delete actions only.

### Cards (Link Items)

- Linen background on Cream page.
- Border: 1px solid `--border`.
- Compact padding (12px).
- Favicon (24×24 rounded box) on the left.
- Title + URL stacked on the right.
- Action buttons (open, copy, edit, delete) visible on hover for desktop, or accessible via a 'More' dropdown menu on mobile.
- Primary content (favicon and text) acts as a clickable link.

### Folder Tree

- Indented list with expand/collapse chevrons.
- Folder icon: Amber folder icon or simple chevron.
- Drag handle visible on hover.
- Active/selected folder: Linen background with Amber left border.

### Search / Filter Bar

- Full-width input with search icon.
- Filter dropdowns (tags, type) inline or in a popover.
- Sort toggle (name, date, manual).

### Bulk Action Bar

- Floating pill-shaped bar positioned at `bottom-center` (coordinated via `BottomActionSystem`).
- Uses a glassmorphic background (`bg-card/80 backdrop-blur-md`), elevated with shadow and border.
- Displays selected count and multi-select actions (e.g., Delete Selected, Clear).
- Animated slide-in from bottom when items are selected.

### Quick Link Action Bar

- Floating pill-shaped bar positioned at `bottom-center` (coordinated via `BottomActionSystem`).
- Uses a glassmorphic background (`bg-card/80 backdrop-blur-md`), elevated with shadow and border.
- Minimal input field focused on quickly pasting and previewing URLs.
- Features a subtle `<kbd>` shortcut badge (Ctrl/Cmd V) for discoverability of global paste functionality.
- Integrates the Sulo mascot to provide interactive contextual feedback (e.g., sleeping, attentive, confused).

### Empty States

- Centered text with Fraunces heading.
- Meaningful generic icon (e.g., from lucide-react) or Sulo mascot illustration.
- Clear call-to-action button.

### Notifications

- Use `goey-toast` for all app notifications via `src/lib/notify.ts`.
- Positioned at the `bottom-center` with no timestamps.
- Use friendly, branded copywriting (e.g., "Added to your corner", "Changes saved") instead of generic system terms (e.g., "Item saved", "Success").

---

## Favicon Fetching

```
https://www.google.com/s2/favicons?domain={origin}&sz=64
```

_Note: Always pass the full origin (e.g. `https://example.com`) rather than just the hostname. This ensures Google's bot correctly requests the HTTPS version, which is required by many modern hosting providers (Vercel, Netlify, etc)._

Display in a 24×24 (`h-6 w-6`) bounded box with a rounded border, scaling the inner icon to 75% to ensure uniformity across different native favicon sizes. Cache via service worker for offline access.
