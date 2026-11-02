// =====================================================================
// COZY BUTTONS – HOME PAGE CODE (Velo)
// Where: Wix Editor → Dev Mode ON → left panel "Page Code" → Main Pages → Home
// How:   Select ALL existing code → Delete → Paste this file → Save.
//        (Back up the old code first – see README step 2.)
// Needs: an "Embed HTML" element on Home with ID  cozyHomeTop
// =====================================================================

import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { cart } from 'wix-stores-frontend';

const FRAME = '#cozyHomeTop';

// ---------------------------------------------------------------------
// SETTINGS – the only part you should edit.
// "collection" must match the category name in
//   Dashboard → Catalog → Store Products → Categories   (spelling matters, case does not)
// "url" = the page path. Find it by opening the site and clicking that menu item,
//   then copying everything after the domain, e.g.  /clothing
// ---------------------------------------------------------------------
const SETTINGS = {
  badgeTop: "Winter '26",

  links: {
    shopAll: '/all-products',   // CHECK: path of "ALL PRODUCTS" menu item
    combo: '/combo-packs',      // CHECK: path of "COMBO PACKS" menu item
  },

  // 6 round category buttons (photo = first product in that category)
  categories: [
    { label: 'Combo Packs',        sub: 'Save more',          collection: 'Combo Packs',        url: '/combo-packs' },
    { label: 'Clothing',           sub: '0–4 years',          collection: 'Clothing',           url: '/clothing' },
    { label: 'Bedding & Comfort',  sub: 'Sleep easy',         collection: 'Bedding & Comfort',  url: '/bedding-comfort' },
    { label: 'Accessories',        sub: 'Caps, socks, mitts', collection: 'Accessories',        url: '/accessories' },
    { label: 'Essentials',         sub: 'Bibs & burp cloths', collection: 'Essentials',         url: '/essentials' },
    { label: 'Ethnic Wears',       sub: 'Festive-ready',      collection: 'Ethnic Wears',       url: '/ethnic-wears' },
  ],

  // Product tabs. collection: null = newest products from the whole store.
  tabs: [
    { label: 'New In',       collection: null },
    { label: 'Clothing',     collection: 'Clothing' },
    { label: 'Bedding',      collection: 'Bedding & Comfort' },
    { label: 'Ethnic Wear',  collection: 'Ethnic Wears' },
  ],

  productsPerTab: 12,
};

// ---------------------------------------------------------------------
// Below this line: no changes needed.
// ---------------------------------------------------------------------

// Wix image ("wix:image://v1/abc~mv2.jpg/...") -> resized https URL
function imageUrl(media, w = 480, h = 600) {
  if (!media) return '';
  if (media.startsWith('http')) return media;
  const m = media.match(/^wix:image:\/\/v1\/([^/]+)\//);
  if (!m) return '';
  return `https://static.wixstatic.com/media/${m[1]}/v1/fill/w_${w},h_${h},al_c,q_80,enc_auto/${m[1]}`;
}

function toCard(p) {
  const opts = p.productOptions ? Object.keys(p.productOptions) : [];
  return {
    id: p._id,
    name: p.name,
    price: p.price,
    sale: p.discountedPrice,
    img: imageUrl(p.mainMedia),
    url: p.productPageUrl,
    ribbon: p.ribbon || '',
    inStock: p.inStock !== false,
    hasOptions: opts.length > 0,
    media: p.mainMedia,
  };
}

let collectionIds = null;
async function collectionId(name) {
  if (!name) return null;
  if (!collectionIds) {
    collectionIds = {};
    const res = await wixData.query('Stores/Collections').limit(100).find();
    res.items.forEach(c => { collectionIds[c.name.trim().toLowerCase()] = c._id; });
  }
  const id = collectionIds[name.trim().toLowerCase()];
  if (!id) console.warn(`[CozyButtons] Category not found: "${name}". Check SETTINGS spelling.`);
  return id || null;
}

async function products(collectionName, limit) {
  let q = wixData.query('Stores/Products').descending('_createdDate').limit(limit);
  if (collectionName) {
    const id = await collectionId(collectionName);
    if (!id) return [];
    q = q.hasSome('collections', [id]);
  }
  const res = await q.find();
  return res.items.map(toCard);
}

async function buildData() {
  const [tabs, cats] = await Promise.all([
    Promise.all(SETTINGS.tabs.map(async t => ({ label: t.label, items: await products(t.collection, SETTINGS.productsPerTab) }))),
    Promise.all(SETTINGS.categories.map(async c => {
      const first = await products(c.collection, 1);
      return { label: c.label, sub: c.sub, url: c.url, img: first[0] ? imageUrl(first[0].media, 300, 300) : '' };
    })),
  ]);
  const newest = tabs[0] ? tabs[0].items : [];
  return {
    type: 'data',
    badgeTop: SETTINGS.badgeTop,
    links: SETTINGS.links,
    hero: newest.slice(0, 3).map(p => ({ name: p.name, url: p.url, img: imageUrl(p.media, 600, 800) })),
    cats,
    tabs,
  };
}

$w.onReady(function () {
  const frame = $w(FRAME);
  const dataPromise = buildData().catch(err => { console.error('[CozyButtons] load failed', err); return null; });
  // Send as soon as ready (in case the embed loaded first), and again when the embed says "ready".
  dataPromise.then(data => { if (data) frame.postMessage(data); });

  frame.onMessage(async (event) => {
    const msg = event.data || {};

    if (msg.type === 'ready') {
      const data = await dataPromise;
      if (data) frame.postMessage(data);
    }

    if (msg.type === 'go' && msg.url) {
      wixLocation.to(msg.url);
    }

    if (msg.type === 'add' && msg.productId) {
      try {
        await cart.addProducts([{ productId: msg.productId, quantity: 1 }]);
        frame.postMessage({ type: 'added', ok: true, name: msg.name });
      } catch (err) {
        console.error('[CozyButtons] add to cart failed', err);
        frame.postMessage({ type: 'added', ok: false, name: msg.name });
      }
    }
  });
});
