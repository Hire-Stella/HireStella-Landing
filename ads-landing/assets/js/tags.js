/* Ad and analytics tags, switched on by the IDs in assets/js/config.js.
   Loaded in the <head> of both pages, right after config.js, so the tags are
   on the page before the thank-you page fires the lead conversion. */
(function () {
  var c = window.HS_CONFIG || {};

  // Google Tag Manager. GA4 and the Google Ads conversion are set up inside the container.
  if (/^GTM-[A-Z0-9]+$/.test(c.GTM_ID || '')) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtm.js?id=' + c.GTM_ID;
    document.head.appendChild(g);
  }

  // Meta Pixel: the standard loader, then a PageView. The Lead event fires on the thank-you page.
  if (/^\d{8,20}$/.test(c.META_PIXEL_ID || '')) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', c.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
})();
