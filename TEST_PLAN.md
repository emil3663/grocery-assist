# 🛒 Grocery Assist — Test Plan

**Version:** 1.0  
**Last updated:** 2026-05-02  
**Status:** In active development

---

## 1. App Overview

Grocery Assist helps households track shopping lists, manage monthly budgets,
scan physical receipts via OCR, and compare estimated prices across South African
grocery chains.

---

## 2. Current Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Add / edit / delete items | ✅ Done | Name, qty, price, category |
| Check off items | ✅ Done | Persisted via localStorage |
| Filter by name / category | ✅ Done | Real-time filter |
| Item count & estimated total | ✅ Done | Auto-calculated |
| Monthly budget setup | ✅ Done | Persisted via localStorage |
| Budget progress bar | ✅ Done | Changes colour when over budget |
| Add / delete expenses | ✅ Done | Date, description, amount |
| Receipt upload (file / drag-drop / camera) | ✅ Done | Accepts image/* |
| OCR text extraction | ✅ Done | Tesseract.js v5 via CDN |
| Parsed item list from receipt | ✅ Done | Regex-based price extraction |
| Import OCR items to shopping list | ✅ Done | Checkbox selection |
| Price comparison — SA stores | ✅ Done | Simulated data (no live API) |
| Offline / PWA | ❌ Not started | Requires manifest + SW |
| Live store price API | ❌ Not started | No free SA grocery API exists yet |
| User accounts / sync | ❌ Not started | localStorage only |
| Share list (URL / QR) | ❌ Not started | |
| Barcode scanning | ❌ Not started | |
| Nutritional info | ❌ Not started | |

---

## 3. Test Cases

### 3.1 Shopping List

| ID | Test | Expected Result | Status |
|----|------|-----------------|--------|
| SL-01 | Add item with all fields | Item appears in list with correct category badge | ⬜ |
| SL-02 | Add item with name only | Item added with qty=1, price=0, category=Other default | ⬜ |
| SL-03 | Add item with empty name | Alert shown, item NOT added | ⬜ |
| SL-04 | Check off item | Item text gains strikethrough, "Checked" counter increments | ⬜ |
| SL-05 | Uncheck item | Strikethrough removed, counter decrements | ⬜ |
| SL-06 | Edit item | Prompt shown, changes persisted on confirm | ⬜ |
| SL-07 | Delete item | Confirm dialog shown; item removed from list | ⬜ |
| SL-08 | Filter by name | Only matching items shown | ⬜ |
| SL-09 | Filter by category | Only items in that category shown | ⬜ |
| SL-10 | Combined filter | Name + category filters work together | ⬜ |
| SL-11 | Est. Total calculation | Sum of (price × qty) for all items | ⬜ |
| SL-12 | Persist on page reload | All items survive a hard page reload | ⬜ |
| SL-13 | Clear All | All items removed after confirmation | ⬜ |

### 3.2 Budget

| ID | Test | Expected Result | Status |
|----|------|-----------------|--------|
| BG-01 | Set budget | Budget saved; remaining = budget | ⬜ |
| BG-02 | Add expense | Bar updates; remaining decreases | ⬜ |
| BG-03 | Over-budget | Bar turns red/orange gradient | ⬜ |
| BG-04 | Delete expense | Remaining amount restored | ⬜ |
| BG-05 | Budget persists on reload | Budget and expenses survive reload | ⬜ |
| BG-06 | Zero budget | Bar shows 0%, remaining shows "No budget set" | ⬜ |
| BG-07 | Missing description | Alert shown, expense NOT added | ⬜ |
| BG-08 | Missing amount | Alert shown, expense NOT added | ⬜ |

### 3.3 Receipt Scan (OCR)

| ID | Test | Expected Result | Status |
|----|------|-----------------|--------|
| OCR-01 | Upload clear receipt image | Items and prices extracted correctly | ⬜ |
| OCR-02 | Upload blurry / low-res image | "No items extracted" message shown | ⬜ |
| OCR-03 | Drag-and-drop image | Same result as file picker | ⬜ |
| OCR-04 | Camera capture (mobile) | Camera opens; captured image processed | ⬜ |
| OCR-05 | Import selected items | Only checked items added to shopping list | ⬜ |
| OCR-06 | Import with no items checked | Alert: "Select at least one item" | ⬜ |
| OCR-07 | Non-image file upload | File picker accepts only image/* | ⬜ |
| OCR-08 | Progress indicator | Spinner shown during processing | ⬜ |

### 3.4 Price Compare

| ID | Test | Expected Result | Status |
|----|------|-----------------|--------|
| PC-01 | Search known item (e.g. "milk") | Stores listed with prices; cheapest tagged BEST | ⬜ |
| PC-02 | Search partial match (e.g. "choc") | Shows "chocolate" results | ⬜ |
| PC-03 | Search unknown item | "No pricing data found" message | ⬜ |
| PC-04 | Press Enter to search | Same result as clicking Search | ⬜ |
| PC-05 | Multiple results | Up to 6 matching products shown | ⬜ |

---

## 4. Known Limitations & Gaps

1. **OCR accuracy** — Tesseract.js accuracy varies greatly with image quality.
   Printed receipts work best; handwritten notes will not parse correctly.
2. **Price data is simulated** — No live SA grocery store API currently exists.
   Future: scrape/partner with Checkers/Shoprite for real pricing.
3. **No cloud sync** — Data lives only in the user's browser localStorage.
4. **No barcode scanning** — QuaggaJS or ZXing could be added.
5. **No multi-currency** — Hardcoded to South African Rand (R).
6. **Not a PWA** — Cannot be installed or used offline.

---

## 5. Roadmap / Next Steps

### Sprint 1 (MVP hardening)
- [ ] Write automated tests with Playwright (OCR flow)
- [ ] Add mobile-responsive layout improvements
- [ ] Camera capture testing on Android / iOS
- [ ] Add data export (CSV download of item list)

### Sprint 2 (PWA)
- [ ] Add `manifest.json` and service worker
- [ ] Enable offline mode (cache Tesseract WASM)
- [ ] Add "Add to Home Screen" prompt

### Sprint 3 (Smart features)
- [ ] Barcode scanning (ZXing.js)
- [ ] Running total while shopping (GPS-triggered)
- [ ] Historical spending charts (Chart.js)

### Sprint 4 (Backend / sync)
- [ ] User accounts (Supabase or Firebase Auth)
- [ ] Cloud list sync across devices
- [ ] Share list via QR code / link

---

## 6. GitHub Project Board Structure

When creating the GitHub Project, use these columns:

| Column | Description |
|--------|-------------|
| 🧊 Backlog | Ideas and future features |
| 🔍 Needs Investigation | Bugs / items needing research |
| 🚧 In Progress | Actively being worked on |
| 👀 In Review | PR open, awaiting review |
| ✅ Done | Merged and released |

### Suggested Labels

| Label | Colour | Use |
|-------|--------|-----|
| `bug` | red | Something isn't working |
| `enhancement` | blue | New feature or request |
| `ocr` | yellow | OCR / receipt scanning |
| `budget` | green | Budget tracker features |
| `pwa` | purple | PWA / offline features |
| `good first issue` | light-green | Easy entry point |
| `blocked` | orange | Waiting on external dependency |
