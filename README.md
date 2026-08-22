# Nisraa — Premium Treatment-Based Hair Care Website

## Project Overview

**Nisraa** is a premium Malaysian treatment-based hair care brand website, designed to be simple, high-trust, and conversion-focused. The site positions Nisraa as a pharmacy & clinic-grade hair repair system — not just a cosmetic shampoo brand — with a strong emphasis on science, expert formulation, and direct website purchasing benefits.

**Approved hero headline:** _Pharmacy & Clinic-Grade Hair Repair for Stronger, Healthier Hair_

---

## ✅ Completed Features

### Pages
- **`index.html`** — Full homepage (streamlined, non-repetitive)
- **`shop.html`** — Complete product catalog with order form
- **`why-nisraa.html`** — Brand story, technology, ingredients, certifications
- **`hair-solutions.html`** — Standalone Hair Solutions page with 6 condition cards, images, "Why it happens" strips, benefits, and CTAs
- **`reviews.html`** — Real customer proof with 4 external proof buttons
- **`rewards.html`** — Loyalty program (Buy 6, Get 1 Free) with account creation
- **`affiliate.html`** — Partner Program application and dashboard preview
- **`faq.html`** — 16 FAQ entries across 4 categories
- **`contact.html`** — Contact form with team info and quick links
- **`about.html`** — About page with founder story
- **`cart.html`** — Cart page

### Design System
- Premium **pharmacy-elegant** visual style
- **Cormorant Garamond** serif headlines + **Inter / DM Sans** body fonts
- Warm brown + gold colour palette (#6C4323, #C49A6C, #FDFAF5)
- Fully responsive across mobile, tablet, and desktop
- Consistent navigation across all 10 pages

### Homepage Sections (current order, clean & non-repetitive)
1. **Hero** — centered layout, "Pharmacy-Grade" headline, product image from 30.4 HOME, trust pills, dual CTAs
2. **Trust Strip** — KKM, Halal, doctor/pharmacist/chemist, patented technology badges
3. **FOMO Bar** — live promo slots countdown
4. **Why Ordinary Products Don't Work** — comparison grid + 30.4 HOME NORMAL SHAMPOO VS NISRAA visual
5. **FiberHance™ Technology** — bond-building explanation, 30.4 HOME BOND BUILDING TECHNOLOGY visual, YouTube embed
6. **Who Is Nisraa For** — 6 visual concern cards (matching Hair Solutions content exactly), each with image, icon, condition name, cause, "Find My Solutions" CTA button linking to hair-solutions.html
7. **Why Buy Direct** — 3 benefit cards + website summary banner
8. **Loyalty Rewards** — Buy 6, Get 1 Free steps
9. **Videos** — launch video + founder + influencer reviews
10. **Social Proof / Testimonials** — Shopee + TikTok slider, 4 external proof buttons
11. **Ingredients** — 4 ingredient categories
12. **Our Story** — founder image, pharmacist journey timeline, credentials (latest version with founder photo)
13. **FAQ Preview** — accordion
14. **Final CTA / Footer**

### Hair Solutions Page (hair-solutions.html)
- Hero with gradient + trust badges
- Problem pills (clickable scroll anchors)
- **6 Solution Cards** — each with:
  - Full image (30.4 NEW series) using `object-fit: contain` — no cropping, full visibility
  - Title overlay on image
  - "Why it happens" dark strip (gold label + cause explanation)
  - Benefits list with checkmarks
  - "Find My Product" CTA → shop.html
- Triple Action infographic
- FiberHance™ banner
- Free-From grid
- Product showcase
- CTA banner

### Recent Updates (this session)
- ✅ Hair Solutions card images replaced with full **30.4 NEW** series (Hair Loss, Postpartum, M Shape, Dandruff, Scalp Acne, Damage Frizzy)
- ✅ Image CSS changed to `object-fit: contain` + `height: auto` — no cropping, full image visible, responsive on all devices
- ✅ **Shop Now section removed** from homepage (Shop accessible via header button and section CTAs)
- ✅ **Who Is Nisraa For** fully redesigned — 6 visual cards with 30.4 NEW images, matching Hair Solutions wording exactly, "Find My Solutions" button → hair-solutions.html
- ✅ **Duplicate "Our Story" section removed** — only the latest founder-image version kept
- ✅ **Hair Solutions Teaser block removed** from homepage — replaced by Who Is Nisraa For section

---

## 🛒 Products & Pricing

| Product | Price |
|---|---|
| Full Treatment Set (250ml Shampoo + 250ml Conditioner + Free 70ml Tonic) | RM 99.90 |
| Trial Set (80ml Shampoo + 80ml Conditioner + Free 40ml Tonic) | RM 48.50 |
| Strengthening Tonic 70ml | RM 43.90 |
| Strengthening Tonic 150ml | RM 62.90 |
| Treatment Shampoo 250ml | RM 49.90 |
| Treatment Conditioner 250ml | RM 49.90 |

---

## 🔗 External Proof Links

| Button | URL |
|---|---|
| Read Shopee Reviews | https://my.shp.ee/9WEKjfuv |
| Visit Our TikTok | https://www.tiktok.com/@nisraapharmaceutics |
| Viral TikTok Post | https://vt.tiktok.com/ZSH4KBJXu/ |
| TikTok Live Testimonials | https://drive.google.com/drive/folders/1MJteb5J8KAR2_KckLn8v6SOLLcdW9v7a?usp=sharing |

---

## 🏆 Loyalty System

**Buy 7 times, Get 1 free**

- Tracked through customer account dashboard
- Exclusive to official website purchases
- Visual progress tracker on homepage and rewards page
- Account registration form on rewards page

---

## 🤝 Affiliate / Partner Program

- Application form on `affiliate.html`
- Dashboard preview showing: clicks, conversions, commission, payout
- Dual tracking: link-based + code-based attribution
- Unique referral link and code per partner

---

## 🔧 Technical Stack

- **HTML5** — semantic structure
- **CSS3** — custom design system with CSS variables
- **Vanilla JavaScript** — no frameworks
- **Google Fonts** — Cormorant Garamond + Inter
- **Font Awesome 6** — icon system
- No external JS dependencies

---

## 📁 File Structure

```
index.html          — Homepage
shop.html           — Product catalog + order form
why-nisraa.html     — Brand story + technology
reviews.html        — Customer proof
rewards.html        — Loyalty program
affiliate.html      — Partner program
faq.html            — FAQ
contact.html        — Contact
css/
  style.css         — Full design system (~1600 lines)
js/
  main.js           — Interactions, FAQ, animations
README.md
```

---

## 🚀 Recommended Next Steps

1. **Connect a real checkout system** — replace the order form with a payment gateway (e.g., Billplz, Stripe, or FPX)
2. **Backend account system** — implement real user auth for loyalty tracking
3. **Real affiliate tracking** — integrate proper referral link tracking system (e.g., ReferralHero or custom backend)
4. **Add product images** — replace icon placeholders with actual product photography
5. **WhatsApp integration** — add a floating WhatsApp button for direct chat
6. **Analytics** — connect Google Analytics or Meta Pixel for conversion tracking
7. **Multilingual support** — add Bahasa Malaysia language option

---

## 📌 Features Not Yet Implemented

- Real payment gateway integration
- Backend user authentication
- Real loyalty purchase tracking (requires backend/database)
- Real affiliate commission tracking (requires backend)
- WhatsApp floating button
- Product image gallery
- Before/after photo section
- Blog / education section
- Live chat widget

---

*Built for Nisraa — Premium Treatment-Based Hair Care, Malaysia*
