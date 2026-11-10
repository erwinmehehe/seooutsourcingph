// Event hooks only; a separately configured analytics tool may consume them.
const allowed = new Set(['quote_request_success', 'discovery_call_click']);
function publish(event: string) {
 if (!allowed.has(event)) return;
 const target = window as Window & {dataLayer?: {event:string}[]};
 target.dataLayer ??= [];
 target.dataLayer.push({event});
}
window.addEventListener('sop:conversion', event => publish((event as CustomEvent<{event:string}>).detail?.event));
document.addEventListener('click', event => {
 const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
 if (link && new URL(link.href, location.href).hostname === 'calendly.com') publish('discovery_call_click');
});
