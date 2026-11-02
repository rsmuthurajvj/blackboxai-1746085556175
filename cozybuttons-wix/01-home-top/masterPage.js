// masterPage.js – runs on EVERY page.
// Only the footer block (#cozyFooter) is handled here. Homepage code stays in Page Code → Home.
import wixLocation from 'wix-location';

$w.onReady(function () {
  let footer;
  try {
    footer = $w('#cozyFooter');
    if (!footer || typeof footer.onMessage !== 'function') return;
  } catch (e) {
    return;
  }
  footer.onMessage((event) => {
    const msg = event.data || {};
    if (msg.type === 'go' && msg.url) wixLocation.to(msg.url);
  });
});
