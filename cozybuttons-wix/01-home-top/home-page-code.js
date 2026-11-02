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
  heroCollection: 'Clothing',   // the 3 tilted hero photos come from this category (in-stock only)

  links: {
    shopAll: '/category/all-products',
    combo: { collection: 'Kids Combo Pack' },   // link = that category's page
  },

  // 6 round category buttons (photo = newest product in that category)
  categories: [
    { label: 'Combo Packs',        sub: 'Save more',           collection: 'Kids Combo Pack' },
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

let collectionMapPromise = null;
function loadCollections() {
  // Load the store's categories once; every caller waits for the same result.
  if (!collectionMapPromise) {
    collectionMapPromise = (async () => {
      const map = {};
      try {
        const res = await wixData.query('Stores/Collections').limit(100).find();
        res.items.forEach(c => { map[c.name.trim().toLowerCase()] = c; });
        console.log('[CozyButtons] store categories:', res.items.map(c => c.name).join(' | '));
      } catch (e) {
        console.error('[CozyButtons] could not read store categories', e);
      }
      return map;
    })();
  }
  return collectionMapPromise;
}
function norm(t) { return String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
async function findCollection(name) {
  if (!name) return null;
  const map = await loadCollections();
  const want = norm(name);
  const all = Object.values(map);
  // 1) exact name  2) a name containing it  3) a name containing its first word (e.g. "Combo" -> "Kids Combo Pack")
  const c = all.find(x => norm(x.name) === want)
    || all.find(x => norm(x.name).includes(want) || want.includes(norm(x.name)))
    || all.find(x => norm(x.name).split(' ').includes(want.split(' ')[0]));
  if (!c) console.warn(`[CozyButtons] Category not found: "${name}". Check SETTINGS spelling.`);
  else if (norm(c.name) !== want) console.log(`[CozyButtons] "${name}" matched store category "${c.name}"`);
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

// Newest first if the store allows it. Tries each sort once, then remembers what works.
const SORTS = ['lastUpdated', null];
let sortIndex = 0;
async function runQuery(build) {
  for (let i = sortIndex; i < SORTS.length; i++) {
    const field = SORTS[i];
    try {
      const q = field ? build().descending(field) : build();
      const items = (await q.find()).items;
      if (sortIndex < i) sortIndex = i;
      return items;
    } catch (e) {
      if (!field) throw e;
      console.log(`[CozyButtons] sort by "${field}" not allowed, trying next`);
    }
  }
  return [];
}

async function products(collectionName, limit) {
  try {
    let id = null;
    if (collectionName) {
      id = await collectionId(collectionName);
      if (!id) return [];
    }
    // Fetch extra, then show in-stock products with a photo first.
    const items = await runQuery(() => {
      let q = wixData.query('Stores/Products').limit(Math.min(100, limit * 3));
      if (id) q = q.hasSome('collections', [id]);
      return q;
    });
    const cards = items.map(toCard).filter(c => c.img);
    const inStock = cards.filter(c => c.inStock);
    const soldOut = cards.filter(c => !c.inStock);
    return inStock.concat(soldOut).slice(0, limit);
  } catch (e) {
    console.error(`[CozyButtons] products failed for "${collectionName || 'All'}"`, e);
    return [];
  }
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
  const heroPool = SETTINGS.heroCollection ? await products(SETTINGS.heroCollection, 9) : [];
  const newest = (heroPool.length >= 3 ? heroPool : (tabs[0] ? tabs[0].items : [])).filter(p => p.inStock);
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
  console.log('[CozyButtons] page code started');
  const frame = $w(FRAME);
  const dataPromise = buildData().catch(err => { console.error('[CozyButtons] load failed', err); return null; });
  // Send as soon as ready (in case the embed loaded first), and again when the embed says "ready".
  dataPromise.then(data => {
    if (!data) return;
    console.log('[CozyButtons] data ready:', data.tabs.map(t => `${t.label}=${t.items.length}`).join(', '),
      '| categories with photo:', data.cats.filter(c => c.img).length);
    frame.postMessage(data);
  });

  frame.onMessage(async (event) => {
    const msg = event.data || {};

    if (msg.type === 'ready') {
      console.log('[CozyButtons] embed is ready');
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
