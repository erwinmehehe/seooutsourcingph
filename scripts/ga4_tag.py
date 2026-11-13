"""Idempotent Google Analytics 4 head tag for approved website builds.

The inline loader runs on the canonical hostname only, preventing preview traffic.
Publication still requires privacy/consent review and production verification.
"""
GA4_MEASUREMENT_ID = "G-Y6B0JEJRZ4"
GA4_SNIPPET = r'''<script data-sop-ga4>
(function () {
  // Track only the canonical website, never GitHub Pages or local previews.
  if (!/^(?:www\.)?seooutsourcingphilippines\.com$/i.test(location.hostname)) return;
  var id = 'G-Y6B0JEJRZ4';
  // Avoid a duplicate page_view if this property is already installed.
  if (window.__sopGa4Initialized ||
      document.querySelector('script[src*="googletagmanager.com/gtag/js?id=' + id + '"]')) return;
  window.__sopGa4Initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id);
  var loader = document.createElement('script');
  loader.async = true;
  loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(loader);

  // Only send the two established conversion-event names, never form content.
  var quoteRecorded = false;
  function record(name) {
    if (name !== 'quote_request_success' && name !== 'discovery_call_click') return;
    if (name === 'quote_request_success') {
      if (quoteRecorded) return;
      quoteRecorded = true;
    }
    window.gtag('event', name);
  }
  window.addEventListener('sop:conversion', function (event) {
    record(event.detail && event.detail.event);
  });
  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    try {
      if (new URL(link.href, location.href).hostname === 'calendly.com') record('discovery_call_click');
    } catch (_error) {}
  });
  function checkQuoteSuccess() {
    if (document.querySelector('[data-sop-quote-received]')) record('quote_request_success');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkQuoteSuccess, { once: true });
  } else {
    checkQuoteSuccess();
  }
})();
</script>'''


def inject_ga4(html: str) -> str:
    """Add the GA4 head tag once without altering content or robots settings."""
    if 'data-sop-ga4' in html:
        return html
    if '</head>' not in html:
        raise ValueError("HTML is missing </head> for GA4 tag installation")
    return html.replace('</head>', GA4_SNIPPET + '\n</head>', 1)
