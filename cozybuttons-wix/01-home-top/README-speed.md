# Faster homepage loading

## Why it was slow
1. Wix loads the header and footer first. Embed HTML boxes load afterwards, in their own frame.
2. After that, the page code ran about 25 store queries from the visitor's phone, one after another. Some of them were "sort not allowed" retries.

## What changed
- **Backend web module** (`backend/homeData.web.js`): all queries run on Wix's server in **one request**. They're cut to about 14, and category photos use each category's own image.
- **Cached for 10 minutes:** most visitors get the answer straight from Wix's cache, almost instantly.
- **The request starts before the page is ready**, so it no longer waits for the page to finish loading.
- **Both embeds remember the last data in the visitor's browser.** Returning visitors see products and photos as soon as the design appears, and fresh data replaces them a moment later.

## Install (4 files)
1. **Backend:** Dev Mode → **{ } icon** (Backend & Public) → **Backend** → **+** → **New Web Module**. Name it **`homeData.web.js`** and paste the whole file. If Wix creates sample code, replace all of it. Then **Save**.
   If Wix underlines `cache` as an error, delete `, { cache: { tags: ['cozy-home'], ttl: 600 } }` from the last lines and save. It still runs in one request, just without the cache.
2. **Page Code → Home:** `Ctrl+A` → paste the new `home-page-code.js` → **Save**. It's short now; the settings moved to the backend file.
3. **cozyHomeTop:** Edit Code → `Ctrl+A` → paste `01-home-top/embed.html` → **Update**.
4. **cozyHomeMore:** Edit Code → `Ctrl+A` → paste `02-home-more/embed.html` → **Update**.

Then **Save**, **Publish** (the copy), and test on a phone.
- The first visit after a save can still take 1–2 seconds, because the cache is empty.
- Reload once: products should then appear together with the design.

**Settings** (category names, tabs, ages, kit) now live at the top of `backend/homeData.web.js`.
**After changing products or prices**, the homepage shows them within 10 minutes, because of the cache.
