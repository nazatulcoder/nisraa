# NISRAA — Premium Treatment-Based Hair Care Website

Static website (HTML, CSS, vanilla JS). No build step. Nothing is deployed from this project until the owner authorises it.

## Live pages (6 files)

| Menu label | File | Purpose |
|---|---|---|
| (no menu item) | `index.html` | Entry page. There is no "Home" menu item any more. Opens `shop.html` straight away (keeps `?query` and `#hash`). The old homepage is saved as `reference/home-old.html` |
| About NISRAA | `about.html` | Hero, Best of Beauty 2026 award, Why NISRAA (`#why`), The Science (`#science`), Our Story (`#story`), Ingredients & Safety (`#safety`), FAQ (`#faq`), perks |
| Shop | `shop.html` | 30 products (29 sets + Sandalwood Scalp Massager SM1, BCL #43909), Add to Cart / Checkout, cart drawer, embedded BCL Bayar Cash checkout, customer reviews |
| Testimonials | `reviews.html` | Customer proof |
| Jom Jadi Affiliate | `affiliate.html` | Partner programme |
| Beli NISRAA | `belinisraa.html` | Landing page with the exclusive-gift popup (nav label "Beli NISRAA" on desktop and mobile menus of all 4 main pages, including Affiliate). Has its own inline site header (`.nb-header`, same links as other pages, hamburger on phones) because this page does not load `css/style.css` / `js/main.js`. If the menu links change on the other pages, update this header too. |

Old pages (Why NISRAA, FAQ, Rewards, Cart, Hair Solutions) were merged into About or removed. The six hair concerns now live only in About NISRAA (each card has only a "Testimonials" button; the "Find My Product" buttons were removed on request). The About hero title is large with a light-gold to white gradient (`.ab-hero h1.ab-hero-title` in about.html, each line wrapped in `<span class="hl">`). On phones (max-width 640px) it is forced onto 3 lines ("MORE THAN" / "HAIR CARE," / "IT'S A TREATMENT", about 31px at 390px wide) with tight spacing to the paragraph and chips; on desktop it is 2 lines. Their files are kept for reference only in `reference/` and are not linked from the site.

## Entry paths and QR link

- `nisraa.com` / `www.nisraa.com` -> `index.html` -> redirects to `shop.html`, so Shop is the first page customers see.
- `shop.html` itself is unchanged. The link `https://nisraa.com/shop`, already printed as a QR code, must keep working. It depends on the host serving `/shop` as `shop.html` (clean URLs). Check this on the live domain after any deploy, and do not rename or move `shop.html`.
- The "Home" menu item and the "Home" button in the mobile bottom bar were removed. The logo still points to `index.html`, so it also leads to Shop.

## Website offer (current)

- **Free shipping + free NISRAA Strengthening Tonic 50ml (worth RM35) for purchases above RM100**, website orders only.
- The loyalty / rewards programme has been removed everywhere.
- Popup image: `images/website-exclusive-gift.png`.
- **The popup is shown only once per visitor across the whole site.** `belinisraa.html` has its own inline popup; the other 5 pages load `js/popup.js`. Both share one flag (`localStorage` + cookie, key `nisraa_exclusive_popup_seen_v1`, cookie lasts 1 year). The flag is set the moment the popup appears, so whichever page the visitor opens first shows it, and no other page shows it again. To test it again, clear the site data for the domain. The flag is per browser/device.

## Shop checkout

- Cart is stored in `localStorage` key `nisraa_shop_cart_v1` (max 10 per set).
- The cart drawer shows a price per item (and "qty × price" when qty is more than 1) plus a big "Total (N sets)" row above "Proceed to Checkout". Prices are read from each set card's Promo Price (`.set-promo strong`), so edit the price on the card only. The total excludes delivery; the final amount is confirmed in the BCL form.
- Checkout opens the embedded BCL form (`nisraapharmaceutics.bcl.my`) with prefill `qty_<itemID>=N`.
- Do not edit the BCL block in `shop.html` (`#bclOverlay`, `#bclModal`, `#bcl-payment-form`, the bcl.my script, `openBCL()` / `closeBCL()`).
- A checkout notice (`#bclNotice`, in `shop.html` right after the BCL block) pops up every time the BCL checkout opens. Heading: "Enjoy Free Shipping and Free Tonic 50ml for purchase above RM100 (WM) and RM150 (EM)." Then it tells customers to scroll to the bottom of the form and fill in name, phone and delivery address. It only watches `#bclOverlay` (MutationObserver), so the BCL code itself is untouched. Edit the wording inside `#bclNotice`.
- BCL cannot hide non-selected items; this is a BCL form limitation.

## Files

```
index.html, about.html, shop.html,
reviews.html, affiliate.html, belinisraa.html
css/style.css          shared styles
js/main.js             shared interactions
js/popup.js            once-only exclusive-gift popup (all pages except belinisraa.html, which has it inline)
images/                site images (shop/set-01..30.png, about/, products/, testimonials/ ...)
                       testimonials/tt-01..16 = TikTok Shop reviews, placed at the FRONT of the existing TikTok carousel (About > marketplace), before tiktok-1..6
                       testimonials/mshape-feedback-1month-3month.png = FIRST slide of "M Shape and Pattern Baldness" slider in reviews.html (19 slides).
                       The original file is portrait; the slide shows it as a LANDSCAPE layout (chat strip on top + 1/2/3 month tiles side by side)
                       using CSS background slices of the original file (classes .cat-slide-combo, .combo-strip, .combo-tile in reviews.html).
                       If the image file is replaced, the slice positions in that CSS need re-checking.
                       (tt-01..03 are original PNGs; tt-04..16 are JPEG copies saved from chat previews)
                       logo-nisraa-new.png = CURRENT NISRAA logo (brown NS monogram, tagline "Advanced Hair Treatment", transparent PNG 1024x1017).
                       Used in the header + footer of all 6 pages and the hero of belinisraa.html. Brown on transparent, so on DARK areas it needs a light plate
                       (footer: `.footer-logo .logo-img` in css/style.css has a cream plate). Old logo-nisraa*.png files are only used by reference/*.html.
                       NOT changeable by code (logo baked into the picture): images/website-exclusive-gift.png (popup), shop set posters, images/icon-512.png.
                       images/icon-192.png is an EMPTY (0-byte) file used by manifest/apple-touch-icon; it needs a real image.
manifest.json, sw.js, sitemap.xml, robots.txt
reference/             old pages and backups, not part of the live site
tools/                 helpers, not part of the live site
  tools/make-single-html.html   builds ONE self-contained belinisraa-single.html (embeds the 12 local images) for copying the Beli NISRAA page elsewhere
```

## Before moving to GitHub / publishing

1. **Compress `images/shop/set-01..28.png`** (about 6-7MB each, roughly 180MB total). Aim for 200-400KB each. (`set-29.png` (M5, about 1.8MB) and `set-30.png` (Sandalwood Scalp Massager, about 2.0MB) are smaller; compress them too if you want.) Keep the same file names, or tell the developer if switching to WebP.
2. `reference/` and `tools/` are not needed on the live site.
3. Deployment needs explicit owner approval.
4. **Speed notes (what was done / what is still heavy):**
   - Done: content width is fluid (`--max-width: clamp(1200px, 84vw, 1600px)` in `css/style.css`; 1200px on laptops, up to 1600px on big monitors; About hero/stats scale up at 1400px+). Affiliate images now `loading="lazy"`. `sw.js` pre-caches only the small core files (no 2.2MB `belinisraa.html`).
   - Still heavy (needs an image tool, cannot be done from here): `images/shop/set-01..30.png` (~180MB total), `images/website-exclusive-gift.png` (1.4MB, loads in the first-visit popup), `images/icon-512.png` (958KB), `images/founder.jpg`, `images/nad-zainal-*.png`. Convert to WebP / resize (target 150-400KB each).
   - `belinisraa.html` is ~2.2MB because its images are embedded as base64 inside the HTML (incl. a leftover `data-old-logo` attribute ~350KB). Better: save those images as files in `images/` and link them.
   - `affiliate.html` images are now LOCAL files in `images/affiliate/` (benefit-gift, usp-1..4, komisyen; about 1.9MB total PNG). They used to be external genspark.ai links. They could still be converted to WebP to get lighter.

## Mobile check (390px phone width)

- All pages (checked when there were 6; Hair Solutions has since been removed): viewport meta present, no sideways scrolling, no element past the right edge, every image has alt text.
- Fixed: bigger tap areas for footer links (`css/style.css`), the shop "Read more" button and the shop top-bar close button; a few 9.5px labels raised to 10.5px.
- Left as is: testimonial slider dots on `belinisraa.html` (9px, but the 48px arrows and swipe also work) and some 10-11px badge labels (decorative only).

## Known notes

- The dead user (account) icon was removed from the headers.
- Shop sets A2 and B5: card name, price and poster picture match each other (rechecked). They have NOT been compared with the item names in BCL (A2 = #43796, B5 = #43793). Some BCL prices are unverified.
- `belinisraa.html` stays in Malay on purpose.
- `belinisraa.html` hero `<img>` still carries a leftover `data-old-logo="data:image/webp;base64,..."` attribute (old logo, unused, adds size). Safe to delete that attribute.
