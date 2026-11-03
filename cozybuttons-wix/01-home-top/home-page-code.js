// =====================================================================
// COZY BUTTONS – HOME PAGE CODE (Velo) – fast version
// Where: Page Code → Home → Ctrl+A → Delete → paste this → Save.
// Needs: backend/homeData.web.js (see 01-home-top/README-speed.md)
//        Embed HTML elements  #cozyHomeTop  and  #cozyHomeMore
// =====================================================================
import wixLocation from 'wix-location';
import { cart } from 'wix-stores-frontend';
import { getHomeData } from 'backend/homeData.web';

// Start the request immediately (before the page is ready) to save time.
const dataPromise = getHomeData().catch(err => { console.error('[CozyButtons] load failed', err); return null; });

function connect(id, pick) {
  let frame;
  try {
    frame = $w(id);
    if (!frame || typeof frame.onMessage !== 'function') return;
  } catch (e) { return; }
  const send = async () => { const d = await dataPromise; if (d && d[pick]) frame.postMessage(d[pick]); };
  send();
  frame.onMessage(async (event) => {
    const msg = event.data || {};
    if (msg.type === 'ready') send();
    if (msg.type === 'go' && msg.url) wixLocation.to(msg.url);
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
}

$w.onReady(function () {
  connect('#cozyHomeTop', 'top');
  connect('#cozyHomeMore', 'more');
  dataPromise.then(d => d && console.log('[CozyButtons] data ready', d.top.tabs.map(t => t.label + '=' + t.items.length).join(', ')));
});
