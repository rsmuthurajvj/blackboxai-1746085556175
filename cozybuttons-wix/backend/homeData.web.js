// =====================================================================
// COZY BUTTONS – BACKEND: homepage data (one call, cached by Wix)
// Where: Dev Mode → left panel "{ }" (Backend & Public) → Backend → "+" → New Web Module
//        name it  homeData.web.js  → paste this whole file → Save.
// Why:   all store queries run on Wix's server in one request, and the answer is
//        cached for 10 minutes, so visitors get products almost instantly.
// =====================================================================
import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';

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

  // ---- Lower block (#cozyHomeMore) ----
  ages: [
    { label: '0–3 Month',  short: '0–3 M',  collection: '0-3 Month' },
    { label: '3–6 Month',  short: '3–6 M',  collection: '3-6 Month' },
    { label: '6–12 Month', short: '6–12 M', collection: '6-12 Month' },
    { label: '1–2 Year',   short: '1–2 Y',  collection: '1-2 Year' },
    { label: '2–3 Years',  short: '2–3 Y',  collection: '2-3 Years' },
  ],
  kit: { nameContains: 'Starter Kit', collection: 'Kids Combo Pack' },
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
// Round photo for a category: its newest in-stock product's photo.
async function categoryImage(name) {
  // (Category images in this store are Wix's grey placeholder, so use a product photo.)
  const first = await products(name, 1);
  return first[0] ? imageUrl(first[0].media, 300, 300) : '';
}
async function resolveLink(link) {
  if (typeof link === 'string') return link;
  if (link && link.collection) return categoryUrl(link.collection);
  return SETTINGS.links.shopAll;
}

// Newest first if the store allows it. Decided once (before the parallel queries).
let sortFieldPromise = null;
function sortField() {
  if (!sortFieldPromise) {
    sortFieldPromise = (async () => {
      try { await wixData.query('Stores/Products').descending('lastUpdated').limit(1).find(); return 'lastUpdated'; }
      catch (e) { return null; }
    })();
  }
  return sortFieldPromise;
}
async function runQuery(build) {
  const field = await sortField();
  const q = field ? build().descending(field) : build();
  return (await q.find()).items;
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
  const [tabs, cats, heroPool] = await Promise.all([
    Promise.all(SETTINGS.tabs.map(async t => ({ label: t.label, items: await products(t.collection, SETTINGS.productsPerTab) }))),
    Promise.all(SETTINGS.categories.map(async c => {
      return { label: c.label, sub: c.sub, url: c.url || await categoryUrl(c.collection), img: await categoryImage(c.collection) };
    })),
    SETTINGS.heroCollection ? products(SETTINGS.heroCollection, 9) : Promise.resolve([]),
  ]);
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

async function findKit() {
  const k = SETTINGS.kit;
  try {
    const res = await wixData.query('Stores/Products').contains('name', k.nameContains).limit(5).find();
    if (res.items.length) return toCard(res.items[0]);
  } catch (e) {
    console.warn('[CozyButtons] kit name search not allowed, using category', e);
  }
  const list = await products(k.collection, 10);
  return list.find(p => p.name.toLowerCase().includes(k.nameContains.toLowerCase())) || list[0] || null;
}

async function buildMore() {
  const [ages, kit] = await Promise.all([Promise.all(SETTINGS.ages.map(async a => {
    return { label: a.label, short: a.short, url: await categoryUrl(a.collection), img: await categoryImage(a.collection) };
  })), findKit()]);
  if (kit) kit.img = imageUrl(kit.media, 640, 800);
  // console.log('[CozyButtons] lower block ready: ages with photo', ages.filter(a => a.img).length, '| kit:', kit ? kit.name : 'not found');
  return { type: 'data', ages, kit };
}


async function build() {
  const [top, more] = await Promise.all([buildData(), buildMore()]);
  return { top, more };
}

// Cached: Wix keeps the answer for 10 minutes (ttl in seconds).
// If Wix underlines "cache" as an error, delete the third argument  , { cache: {...} }  and save.
export const getHomeData = webMethod(Permissions.Anyone, build, {
  cache: { tags: ['cozy-home'], ttl: 600 },
});
