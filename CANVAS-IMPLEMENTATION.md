# Canvas product and inquiry upgrade

Implementation branch: `codex/canvas-inquiry-upgrade`, based on origin/main `543494a`.

## Full-range and gallery follow-up

The September 23 owner-supplied update expands the catalog to 13 diagonals and 14 configurations, including the dual-screen calendar, inserts, Bluetooth badges/tags and the A1/A3 displays. Product families can be filtered without a backend. Nine configurations have multiple matched image views, with thumbnail selection, keyboard navigation and a native zoom dialog. Unknown-model photos are not assigned arbitrarily. See `content/E6-SOURCE-NOTES.md` for unresolved specifications and image classification.

The public PDF set now contains 30 files. After changing the catalog, run `npm run build:products`, `node scripts/sync-range-links.mjs`, the PDF builder and the sitemap script. The new gallery test checks every model in both languages at desktop and mobile widths, image selection, modal focus restoration, filters, downloads and inquiry options. No production inquiry is sent by these tests.

## Build and preview

Static HTML remains deployable without a build server. Product and form templates are maintained in `scripts/site-templates.mjs` and `scripts/build-products.mjs`; approved public facts live in `content/products.json`.

```
npm ci
npm run build:products
python scripts/build-datasheets.py
python scripts/update-sitemap.py
npm run validate
npm run dev
```

PDF generation requires ReportLab; PDF QA uses pypdf, Pillow and Poppler. Do not publish the source quotation directory. The initial catalog is based on the supplied English Canvas specifications and panel/TCON quotation. Prices, lead times, certification status, battery runtime and conflicting parameters were deliberately not promoted to universal promises.

`scripts/integrate-catalog.mjs` updates shared navigation and scripts on existing pages using parsed HTML source locations. It is a migration utility, not required on every deployment. Existing article bodies, sharing and URLs are preserved except the three targeted product-selection updates.

## Verification

Start the static server on port 4187 before running `npm test`, or set `TEST_BASE_URL`. Tests use installed Chrome through Playwright. Requests are intercepted: browser regression tests never send real leads. `.qa/` contains local screenshots and is not committed.

Coverage: desktop 1440 px and mobile 390/360 px, image loading, horizontal overflow, mobile navigation, source persistence, model/intent prefill, HTTP error, unconfirmed receipt, duplicate submissions, confirmed success and timeout. Static validation covers bilingual links, assets, canonical, JSON-LD and new sitemap URLs.

One clearly labeled production acceptance test on 2026-09-23 returned HTTP 200 with `ok: true`, `sync_status: zoho_synced`, `zoho: success`, `feishu: success`, and no warnings. This verifies the API receipt, not a human sales response or mailbox delivery.

## Analytics activation

`assets/analytics-config.js` intentionally has an empty measurement ID until the owner supplies the site's GA4 `G-...` ID. No GA4 network requests are sent with the empty configuration. Do not describe analytics as active before this step and verification in GA4 DebugView/Realtime.

Implemented events: `page_view`, `view_product`, `select_product`, `blog_to_product`, `sample_request`, `quote_click`, `whatsapp_click`, `file_download`, `inquiry_start`, `inquiry_error`, `generate_lead`. Only an explicit API `ok: true` emits `generate_lead`. Mark that event as a key event in the GA4 property. Do not mark clicks or mailto openings as received leads.

Session entry path, referring origin and campaign tags are persisted in sessionStorage and forwarded with the inquiry. Name, email, phone and free-form messages are excluded from analytics events. Review applicable consent requirements before enabling analytics for the intended markets; adding an ID alone does not configure a consent platform.

## Publication checks

Keep www canonical and the existing open AI/search crawler policy. No robots changes are required. Verify the new sitemap URLs and PDF responses after deployment. The 31.5-inch image is a labeled proportion diagram; replace with a confirmed real photograph when available. The A2 image is labeled as a supplier illustration.

Monitor comparable windows of product sessions, confirmed leads and sales-qualified inquiries. Low-volume changes do not establish a conversion-rate improvement on their own.
