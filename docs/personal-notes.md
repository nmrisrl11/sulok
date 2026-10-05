# Feature Specification: Personal Notes / Annotations

> Adding a dedicated text area to saved items to enhance intentional curation.

## 1. Overview

Users often bookmark a link but forget the context or specific reason they saved it months later. Adding a simple, local-first note field allows users to write memos to their future selves. This perfectly aligns with Sulok's "intentional curation" philosophy.

## 2. UI / UX Flow

### List & Grid Views (Main Explorer)

- **No Clutter:** The actual note text will **not** be displayed in the main list/grid views to prevent UI clutter.
- **Visual Indicator:** If an item has a note, a subtle indicator (e.g., a small Sticky Note, FileText, or Pencil icon) will appear next to the item's metadata (e.g., alongside the date or domain).
- **Interaction:** Clicking the item or the edit action opens the Item Details Dialog where the note can be read and edited.

### Item Details Dialog (Create / Edit Mode)

- **Responsive Modal:** Sulok uses a responsive modal (`Drawer` on mobile, `Dialog` on desktop) for item details (`ItemDialog` / `ItemForm`).
- **Placement:** Below the URL and Description fields, a new `<Textarea>` input labeled "Personal Note" will be added.
- **Empty State:** If no note exists, the field shows a friendly placeholder like _"Add a note about why you saved this..."_ or _"What are your thoughts on this?"_

### Command Palette Integration

- The contents of the note must be indexed by the Command Palette.
- **Value:** Users can search for their own thoughts (e.g., searching "dashboard" finds a link because the user wrote "Use this for the admin dashboard" in the note, even if the URL/Title doesn't contain the word).

## 3. Implementation Plan

### Step 1: Schema & Data Layer Updates

- Update the Zod schema in `src/schemas/item.ts` to include `note: z.string().trim().optional()`.
- Update the Dexie schema/interfaces if explicit types are defined. Dexie handles new optional fields gracefully without needing a full schema migration, but TypeScript types must be accurate.
- Ensure the export/import logic (JSON/CSV) handles the new `note` field correctly so data isn't lost during backups.

### Step 2: UI Form Integration

- Update the `ItemForm` component (`src/features/items/components/item-form.tsx`).
- Add a new `<FormField>` using `react-hook-form` connected to a shadcn/ui `<Textarea>`.
- Make it span full width and give it an appropriate height (e.g., `min-h-[100px]`).

### Step 3: Visual Indicators

- Update `ItemCard` and `ItemGridCard` components.
- Conditionally render a small icon in the metadata row if `!!item.note` is true.
- Ensure it respects the design system's aesthetic (correct text/icon colors, spacing).

### Step 4: Search Logic

- Update the filtering logic (likely in the Command Palette hooks or `ItemRepository` depending on where in-memory search happens).
- Ensure the search query checks `item.note.toLowerCase().includes(query)` in addition to title, description, and URL.

### Step 5: Extension & Sync Bridge (Phase 2)

- Ensure that the browser extension's message passing and sync bridge can safely handle item payloads that include (or omit) the `note` field.
- _(Optional)_ Add a quick note field to the Chrome Extension popup itself.

## 4. Trade-offs & Considerations

- **Storage Size:** Negligible impact. Storing plain text in IndexedDB takes up very little space compared to caching full HTML.
- **Performance:** Command Palette search might evaluate more text per item, but for local in-memory arrays (which Sulok likely uses for fast filtering), this is trivial for modern browsers.
- **Formatting:** Keep it plain text for now. Full Markdown rendering introduces unnecessary dependency weight and XSS sanitization complexity. Plain text is simple, fast, and secure.
