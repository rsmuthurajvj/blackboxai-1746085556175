# Step 4 – New footer

The footer is shared by every page. It is made of three parts:
- **A code block** (`footer-embed.html`, ID `cozyFooter`) with the brand, contact details, social icons, Shop links, Help links and the © line. Its links are opened by `masterPage.js`.
- **The native Wix newsletter form**, kept so that sign-ups still go into Contacts. It's restyled and placed to the right.
- **A linen footer background.**

Do this in **desktop view**.

## 1. Clear the old footer
Open **Layers → Footer**. Delete the old content: the CONTACT US block, the house/mail/phone icons, the POLICY links, the social bar and "©2025 by Cozy Buttons". Delete the whole old column strip if that's easiest.
**Keep the newsletter form** (Email Address, the checkbox and Subscribe Now). If it sits inside the strip, right-click it → **Cut** first, delete the strip, then right-click the footer → **Paste**.

## 2. Footer background
Click the footer → **Change Footer Design → Customize**:
- **Background:** `#FBF6EF`
- **Top border:** 2 px `#EAD9C8`
- **Shadow:** off

## 3. Add the code block
1. **Add (+) → Embed Code → Embed HTML**, dropped *inside the footer*. Wix shows "Footer" as its parent.
2. **Enter Code → Code:** paste all of `footer-embed.html`, then click **Update**.
3. **ID:** `cozyFooter`
4. **Size:** **W 650, H 300, X 0, Y 40**.

## 4. Newsletter form (right side)
1. Position: **X 690, Y 40, W 290**.
2. Add a text above it, "**New arrivals in your inbox**": Fredoka 18, `#3D2418`. Delete the old "Receive all our news…" text.
3. Form **Design → Customize**:
   - **Fields:** white background, **2 px** border `#3D2418`, corners **999**, label text `#7A5A4B`.
   - **Button:** background `#3D2418`, text white, corners **999**, text **Join**. Hover background `#E9B320`.
   - **Checkbox text:** `#7A5A4B`.
4. **Footer height:** drag it so there's about 40 px below the lowest element (about **H 380**).

## 5. masterPage.js
Page Code → **masterPage.js** → `Ctrl+A` → paste the new `masterPage.js` → **Save**.
This makes the footer links work on every page. It has no homepage code, so it won't clash with the Home page code.

## 6. Mobile view (phone icon)
- **cozyFooter:** **W 320, X 0, Y 20, H 480**
- **Newsletter form:** below it, **X 10, W 300**
- **Footer height:** drag it until it fits.

## 7. Test
Save, open a fresh Test Site, and check:
- Every Shop and Help link opens the right page. The **Help paths are guesses**. If one gives a 404, open that page from the menu or the Pages panel, copy its path (the part after the site address), and fix it in `LINKS` at the bottom of the code (Edit Code → Update).
- The social icons open the client's profiles. **Paste their real Instagram, Facebook and YouTube links** into `LINKS` too.
- The newsletter form submits.
- Check the footer on a product page and on the cart page as well.
