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
// Links are built automatically as  /category/<category-slug>  (the store's own
// category pages). Add  url: '/something'  to a line only to override that.
// ---------------------------------------------------------------------
const SETTINGS = {
  badgeTop: "Winter '26",

  links: {
    shopAll: '/category/all-products',
    combo: { collection: 'Combo Packs' },   // link = that category's page
  },

  // 6 round category buttons (photo = newest product in that category)
  categories: [
    { label: 'Combo Packs',        sub: 'Save more',           collection: 'Combo Packs' },
    { label: 'Clothing',           sub: 'Jablas, frocks & more', collection: 'Clothing' },
    { label: 'Bedding & Comfort',  sub: 'Carry beds, blankets', collection: 'Bedding & Comfort' },
    { label: 'Accessories',        sub: 'Caps, mittens, socks', collection: 'Accessories' },
    { label: 'Essentials',         sub: 'Nappies, bibs, towels', collection: 'Essentials' },
    { label: 'Ethnic Wears',       sub: 'Festive-ready',       collection: 'Ethnic Wears' },
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

let collectionMap = null;
async function findCollection(name) {
  if (!name) return null;
  if (!collectionMap) {
    collectionMap = {};
    const res = await wixData.query('Stores/Collections').limit(1000).find();
    res.items.forEach(c => { collectionMap[c.name.trim().toLowerCase()] = c; });
  }
  const c = collectionMap[name.trim().toLowerCase()];
  if (!c) console.warn(`[CozyButtons] Category not found: "${name}". Check SETTINGS spelling.`);
  return c || null;
}
async function collectionId(name) {
  const c = await findCollection(name);
  return c ? c._id : null;
}
async function categoryUrl(name) {
  const c = await findCollection(name);
  return c && c.slug ? `/category/${c.slug}` : SETTINGS.links.shopAll;
}
async function resolveLink(link) {
  if (typeof link === 'string') return link;
  if (link && link.collection) return categoryUrl(link.collection);
  return SETTINGS.links.shopAll;
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
      const url = c.url || await categoryUrl(c.collection);
      return { label: c.label, sub: c.sub, url, img: first[0] ? imageUrl(first[0].media, 300, 300) : '' };
    })),
  ]);
  const newest = tabs[0] ? tabs[0].items : [];
  return {
    type: 'data',
    badgeTop: SETTINGS.badgeTop,
    links: {
      shopAll: await resolveLink(SETTINGS.links.shopAll),
      combo: await resolveLink(SETTINGS.links.combo),
    },
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
