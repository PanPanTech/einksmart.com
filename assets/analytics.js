(function () {
  "use strict";
  const key = "einksmart-attribution-v1";
  const config = window.EinksmartAnalyticsConfig || {};
  const params = new URLSearchParams(location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const clean = (value) => /^[\p{L}\p{N} _./+-]{1,120}$/u.test(value || "") ? value : "";
  const page = () => location.origin + location.pathname;
  let referrer = "";
  try { referrer = new URL(document.referrer).origin; } catch (_) { /* Direct visit. */ }
  let attribution;
  try { attribution = JSON.parse(sessionStorage.getItem(key)); } catch (_) { /* Storage may be unavailable. */ }
  if (!attribution || attribution.version !== 1) {
    attribution = { version: 1, landing_page: page(), referrer_origin: referrer };
    utmKeys.forEach((name) => { attribution[name] = clean(params.get(name)); });
    try { sessionStorage.setItem(key, JSON.stringify(attribution)); } catch (_) { /* Keep in memory. */ }
  }
  const enabled = /^G-[A-Z0-9]+$/.test(config.measurementId || "") && (config.allowedHosts || []).includes(location.hostname);
  if (enabled) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", config.measurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: page(), page_referrer: referrer });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(config.measurementId);
    document.head.appendChild(script);
  }
  // Only controlled event fields reach analytics. Form contents never do.
  const allowed = new Set(["model", "intent", "placement", "destination", "file_name", "error_type", "form_id"]);
  function track(name, fields) {
    const event = { page_location: page(), page_referrer: attribution.referrer_origin || "", landing_page: attribution.landing_page || page() };
    Object.entries(fields || {}).forEach(([field, value]) => { if (allowed.has(field) && clean(String(value))) event[field] = String(value); });
    utmKeys.forEach((field) => { if (clean(attribution[field])) event[field] = attribution[field]; });
    document.dispatchEvent(new CustomEvent("einksmart:analytics", { detail: { name, params: event, enabled } }));
    if (enabled) window.gtag("event", name, event);
  }
  window.EinksmartTracking = { track, attribution: () => ({ ...attribution }), enabled };
  track("page_view");
  if (document.body.dataset.productModel) track("view_product", { model: document.body.dataset.productModel });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const url = new URL(link.href, location.href);
    const model = link.dataset.model || document.body.dataset.productModel || "";
    let name = link.dataset.analytics;
    if (!name && url.hostname === "wa.me") name = "whatsapp_click";
    if (!name && /\.pdf$/i.test(url.pathname)) name = "file_download";
    if (!name && /\/products\/[^/]+\.html$/.test(url.pathname)) name = "select_product";
    if (name) track(name, { model, intent: link.dataset.intent || "", placement: link.dataset.placement || "page", destination: url.pathname, file_name: url.pathname.split("/").pop() });
    if (location.pathname.includes("/blog/") && /\/products?[/\.]/.test(url.pathname)) track("blog_to_product", { model, destination: url.pathname });
  });
})();
