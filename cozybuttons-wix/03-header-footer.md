# Step 3 – Header and footer restyle (no code)

The header and footer appear on **every page**, including product, cart and checkout. So we restyle Wix's own elements and keep the menu, search, login and cart working everywhere. Work in **Cozy Button Revamp**, in **desktop view** first.

## Colours and fonts (use only these)
| Name | Hex | Used for |
|---|---|---|
| Chocolate | `#3D2418` | Text, menu, buttons |
| Soft brown | `#7A5A4B` | Small text, footer links |
| Butter | `#FFD86B` | Menu hover, highlights |
| Linen | `#FBF6EF` | Footer background |
| Stitch line | `#EAD9C8` | Borders |

- **Headings and menu:** Fredoka. In any text or menu font list, choose **Add Fonts** and search "Fredoka". If it isn't there, use **Poppins** (bold).
- **Body text:** Figtree. If it isn't there, use Poppins (regular).

---

## A. Header (target: one clean row, 96 px tall)

**Target layout:** `[LOGO]   Home · Shop All · Combo Packs · Clothing · Bedding · Accessories · Essentials · Ethnic Wear   [🔍] [👤] [🛒 2]`

1. **Remove clutter from the header** (they move to the footer):
   - Click the **email text** (cozybuttons24@gmail.com) → **Delete**.
   - Click the **social icons** (Instagram, Facebook, YouTube) → **Delete**.
2. **Header height:** click an empty part of the header. Drag its bottom ↕ handle up until the header is about **96 px** tall (the label shows the height).
3. **Logo:** select it and set **W 120** (height follows), **X 0**, **Y 18**.
4. **Menu:** select the horizontal menu.
   - **Size:** X 150, Y 32, **W 640**, H 36.
   - **Rename the long items** (Manage Menu): "ALL PRODUCTS" → **Shop All**, "BEDDING & COMFORT" → **Bedding**, "ETHNIC WEARS" → **Ethnic Wear**. This only changes the text; the links stay the same.
   - **Design → Customize:**
     - **Text:** Fredoka, 15 px, bold, colour Chocolate, **no uppercase**. If there's a "Text transform" option, set it to None. Otherwise retype the items in normal case.
     - **Hover:** background **Butter**, text Chocolate.
     - **Selected (current page):** background **Chocolate**, text white.
     - **Corner radius:** 999 (pill shape). **Spacing between items:** 6–8. **Item padding:** 12.
     - **Borders / dividers:** none.
5. **Icons (right side):** search, login, cart, all at **Y 30**.
   - **Search icon:** X 830.
   - **Login bar:** Settings → **Show: Icon only** (no "Log In" text), X 880.
   - **Cart icon:** X 930. Design → icon colour Chocolate, counter background **Butter**, counter text Chocolate.
6. **Header background and border:** Header → **Change Header Design → Customize**.
   - **Background:** white, opacity 100%.
   - **Border:** bottom only, 2 px, Stitch line `#EAD9C8`.
   - **Shadow:** off.
7. **Sticky header:** Header → **Settings (⚙) → Scroll Effects → Freeze** ("Header stays at the top as you scroll"). If you see **"Fade"** or **"Disappear"**, don't pick them.
8. **Line under the old menu:** the thin grey line above the menu is a separate line element. Click it → **Delete**.

**Mobile header** (phone icon at the top):
- Logo in the centre, W 100. Hamburger menu on the left, X 10. Cart on the right.
- **Hide on mobile:** search and login (eye icon), so the bar stays clean.
- Hamburger menu → **Design:** menu background Linen, item text Fredoka 18 Chocolate, selected item text on a Butter background.
- Header height on mobile: about **64 px**.

Then click **Save → Test Site**. Check that the menu works, the cart count shows, and the header stays on top while scrolling.

---

## B. Footer

**Target layout:** linen background, 4 columns, then a thin bottom line.

| Brand | Shop | Help | Newsletter |
|---|---|---|---|
| Logo, short line, Karur address, phone, email, social icons | Shop All, Combo Packs, Clothing, Bedding, Ethnic Wear | Shipping & Returns, Return & Refund Policy, Privacy Policy, Terms, FAQ | The existing Wix form (keep it, because sign-ups go into Contacts) |

1. **Footer background:** Footer → **Change Footer Design → Customize** → background **Linen** `#FBF6EF`, top border 2 px Stitch line.
2. **Headings** ("CONTACT US:", "POLICY", "Receive all our news…"):
   - Change them to **Visit us**, **Help** and **Get 10% off your first order**. That last one is a **CONFIRM** with the client; if there's no offer, use **"New arrivals in your inbox"**.
   - Style: Fredoka, 18 px, Chocolate, **not purple, not uppercase**.
3. **Links and contact text:** Figtree or Poppins, 15 px, **Soft brown**. Delete the house, mail and phone icons if they look heavy.
4. **Add the Shop column:** **Add → Text**, then type each link and link it to its page with **Link → Page**: Shop All, Combo Packs, Clothing, Bedding, Ethnic Wear. Use the same style as the Help links.
5. **Add social icons** (deleted from the header): **Add → Social → Social Bar**. Set Instagram, Facebook and YouTube with the same links as before, in Chocolate colour, size 28.
6. **Newsletter form:**
   - Input: corner radius **999**, border 2 px Chocolate, white background.
   - Button: background **Chocolate**, text white, radius **999**, text "Join".
   - Checkbox text: Soft brown.
7. **Bottom line:** "© 2026 Cozy Buttons · Sewn with care in Karur", Figtree 13 px, Soft brown, centred, with a 1 px Stitch line above it.
8. **Remove** the old "©2025 by Cozy Buttons" text.

**Mobile footer:** stack the columns in order: Brand → Shop → Help → Newsletter. Use 24 px gaps, left-aligned, and full-width form fields.

Then click **Save**, open a fresh **Test Site**, and check the footer on a product page and on the cart page too.
