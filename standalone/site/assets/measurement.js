/* Event hooks only. No trackers or personal form data are sent by this file. */
(() => {
 const allowed = new Set(['quote_request_success', 'discovery_call_click']);
 const publish = (event) => {
  if (!allowed.has(event)) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event });
 };
 if (document.querySelector('[data-sop-quote-received]')) publish('quote_request_success');
 window.addEventListener('sop:conversion', (event) => publish(event.detail?.event));
 document.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[href]');
  if (link && new URL(link.href, location.href).hostname === 'calendly.com') publish('discovery_call_click');
 });
})();
