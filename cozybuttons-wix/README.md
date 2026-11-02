# Cozy Buttons – Wix redesign kit (TechAo)

Redesign of the cozybuttons.com homepage. It stays in **Wix**, and the store, cart, checkout and payments are untouched.

- **Work site:** "Cozy Button Revamp" (a copy of the live site). The client approves it on its free wixsite link.
- **Live site:** "Cozy Button" (cozybuttons.com). **Never edit it** until the client approves.
- **Approach:** each new homepage section is one **Embed HTML** element (design: HTML/CSS/JS). The **Home page code** (Velo) reads real products from Wix Stores and sends them into it. The header, product pages, cart and checkout stay native Wix.

| Step | Folder | Status |
|---|---|---|
| 1. Hero + category buttons + product tabs | `01-home-top/` | **done** (installed in Cozy Button Revamp, tested desktop + mobile) |
| 2. Offer ribbon, shop by age + size finder, starter kit, made in Karur, FAQ, WhatsApp help | `02-home-more/` | ready to install |
| 3. Header / menu / footer restyle (native Wix settings) | `03-…` | later |

Design reference (prototype): https://claude.ai/artifact/UdoDoEfYGFMtTtYdeGtNB5

---

## Step 1 – install the home top block

Time: about 30 minutes. You need two files from `01-home-top/`:
- `embed.html`: the design
- `home-page-code.js`: the Velo code that connects it to the store

### 0. Safety check (every time)
Look at the top-left of the editor, or at the dashboard site switcher. It must say **Cozy Button Revamp**. If it says "Cozy Button", close it.

### 1. Back up the old Home code
1. Editor → left bar **{ }** / **Page Code** → *Main Pages* → **Home**.
2. Click inside the code, press `Ctrl+A`, then `Ctrl+C`.
3. Paste it into Notepad and save it as `old-home-code.txt`. It belongs to the old `#html16` embed.

### 2. Make room at the top of Home
1. On the Home page, click the old **arch photo gallery**, then press `Delete`.
2. Click the big **"New Collection"** heading, then press `Delete`.
3. If there is an old HTML embed (the code used `#html16`), click it and delete it too.
   Tip: the **Layers** icon (bottom of the left bar) lists every element on the page.
4. Leave the other sections lower on the page for now. We replace them in step 2.

### 3. Add the Embed HTML element
1. Left bar **+ (Add Elements)** → **Embed Code** → **Embed HTML**.
2. Drag it just under the header (menu line).
3. Click **Enter Code** → choose **Code** (not Website address).
4. Open `embed.html`, copy **all** of it, paste it, then click **Update**.

### 4. Set its size
Select the element. If you don't see X/Y/W/H boxes, turn on **Tools → Toolbar**.
- **W: 980**, **X: 0**, **H: 1380**
- If it covers older content below, drag that content down (or delete it, if it's from the old design).

### 5. Give it the ID the code expects
With the element selected, open the **Properties & Events** panel (right side, shown when Dev Mode is on).
Set **ID** to `cozyHomeTop` and press Enter. Spelling and capitals must match exactly.

### 6. Paste the page code
1. Page Code → **Home** → `Ctrl+A` → Delete.
2. Paste all of `home-page-code.js`.
3. Press **Save** (top bar).

### 7. Check the SETTINGS (usually no edits needed)
At the top of the code there is a `SETTINGS` block. The `collection` names must match **Dashboard → Catalog → Store Products → Categories** (spelling matters; capitals don't). Links are built automatically from each category (`/category/<slug>`), so you don't need to look up menu links.

### 8. Test
Click **Test Site** and check:
- [ ] The three hero photos and six round category buttons show real product photos (after 1–2 seconds).
- [ ] The tabs (New In / Clothing / Bedding / Ethnic Wear) switch products.
- [ ] Clicking a product opens its product page.
- [ ] **Quick add +** puts the product in the cart; the cart icon number goes up. Products with sizes show **Choose size** and open the product page instead.
- [ ] Every category button and both hero buttons open the right page.

If something is empty, open the **Developer Console** (bottom of the Test Site window). A line like `[CozyButtons] Category not found: "Bedding & Comfort"` means that name in SETTINGS doesn't match the store.

### 9. Mobile layout
1. Click the **phone icon** in the editor top bar.
2. Select the HTML element. If it's hidden, use **Show on mobile**.
3. Set **W: 320**, **X: 0**, **H: 1340**. Then set the section (`section1`) on mobile to block height + about 30 (≈ **1370**). If the content is ever taller than the box, the embed shrinks itself slightly to fit, so it never shows an inner scrollbar.
4. Drag any older mobile elements below it.
5. Test on a real phone after publishing.

### 10. Publish the COPY for the client
1. Check again that it says **Cozy Button Revamp**.
2. Click **Publish**, and send the client the `…wixsite.com/…` link.

Don't connect the domain or move the Premium plan to this copy.

---

## Notes for developers
- Messages from the embed to the page: `{type:'ready'}`, `{type:'go', url}`, `{type:'add', productId, name}`.
- Messages from the page to the embed: `{type:'data', hero, cats, tabs, links}` and `{type:'added', ok}`.
- Products come from `wixData.query('Stores/Products')`. The category filter is `hasSome('collections', [id])`. Products are sorted newest first.
- Products with options (size, colour) can't be added without choosing one, so **Choose size** opens the product page.
- Text inside an Embed HTML element isn't indexed by Google. The product and category pages stay native, so product SEO is unaffected. Set the Home page SEO title and description in **Page Settings → SEO basics**.
- Measured content height of the embed: 1364px at 980 wide and about 1475px at 280–320 wide (compact mobile layout). The sizes above add a small margin. If you change the text, re-check the height so nothing is cut off.

---

## Step 2 – install the lower block

Files: `02-home-more/embed.html` (design) and the **updated** `01-home-top/home-page-code.js` (now feeds both blocks).

1. **Page code:** Page Code → Home → `Ctrl+A` → paste the new `home-page-code.js` → Save. It still runs block 1 exactly as before.
2. **Make room (desktop view):** select `section1`, drag its purple ↕ handle down about **2,500 px** (or add a new blank section below it: hover the section's bottom edge → **+ Add Section** → Blank).
3. **Add a second Embed HTML** (Add → Embed Code → Embed HTML), place it under the first block. **Enter Code → Code** → paste all of `02-home-more/embed.html` → **Update**.
4. **ID:** `cozyHomeMore`.
5. **Size (desktop):** **W 980, X 0, H 2450**. Section height = block bottom + about 30.
6. **Mobile view:** select the block → **W 320, X 0, H 3180**, and make its section tall enough so the footer starts below it. If the content is taller than the box, it shrinks slightly to fit (no inner scrollbar); if there's a gap, lower H by 50.
7. **Save → fresh Test Site → Ctrl+Shift+R.** Console (filter `CozyButtons`) should show `lower block ready: ages with photo 5 | kit: New Born Starter Kit`.

Check: age circles show photos and open the age pages · the slider changes the recommendation and highlights a circle · the kit shows the real price, **Add kit to cart** raises the cart count · FAQ opens/closes · WhatsApp opens a chat.

Text to confirm with the client is in the `CONTENT` block at the top of the `<script>` in `02-home-more/embed.html` (lines marked `CONFIRM`): free-shipping amount, 12 PM cut-off, no-COD wording, kit contents, story wording.
