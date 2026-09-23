(function () {
  "use strict";
  document.documentElement.classList.add("js");
  const assets = window.EinksmartAssets || window.MagiRealmAssets || {};
  const endpoint = "https://inquiry.panpantechnology.com/api/inquiries";
  const salesEmail = "info@einksmart.com";
  const zh = document.documentElement.lang.toLowerCase().startsWith("zh");
  const labels = zh ? {
    sending: "正在提交…", success: "询盘已收到。我们的团队将通过您提供的邮箱与您联系。",
    error: "暂未确认提交成功，您填写的内容已保留。请重试或通过邮件发送。",
    retry: "重新提交", email: "改用邮件发送", duplicate: "此询盘已收到。如需补充内容，请修改后再次提交。"
  } : {
    sending: "Sending...", success: "Your inquiry has been received. Our team will follow up at the email you provided.",
    error: "We could not confirm receipt. Your details are still here. Please retry or send them by email.",
    retry: "Try again", email: "Send by email instead", duplicate: "This inquiry has already been received. Edit your details to send an update."
  };
  const track = (name, fields) => window.EinksmartTracking?.track(name, fields);
  document.querySelectorAll("[data-image-key]").forEach((node) => { if (assets[node.dataset.imageKey]) node.src = assets[node.dataset.imageKey]; });
  document.querySelectorAll("[data-bg-key]").forEach((node) => { if (assets[node.dataset.bgKey]) node.style.backgroundImage = "url('" + assets[node.dataset.bgKey] + "')"; });
  document.querySelectorAll("[data-nav-toggle]").forEach((button) => {
    const nav = document.getElementById(button.getAttribute("aria-controls"));
    if (!nav) return;
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(expanded)); nav.classList.toggle("is-open", expanded);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
        button.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); button.focus();
      }
    });
  });
  const query = new URLSearchParams(location.search);
  document.querySelectorAll("form[data-inquiry-form]").forEach((form) => {
    for (const field of ["model", "intent"]) {
      const select = form.elements.namedItem(field), value = query.get(field);
      if (select && value && Array.from(select.options || []).some((option) => option.value === value)) select.value = value;
    }
    let busy = false, started = false, lastReceived = "";
    const status = form.querySelector("[data-inquiry-status]");
    const fallback = form.querySelector("[data-email-fallback]");
    const button = form.querySelector("button[type=submit]");
    const originalLabel = button.textContent;
    const value = (data, name) => String(data.get(name) || "").trim();
    const eventFields = () => ({ model: form.elements.namedItem("model")?.value || "", intent: form.elements.namedItem("intent")?.value || "", form_id: form.id || "inquiry" });
    form.addEventListener("input", () => {
      if (!started) { track("inquiry_start", eventFields()); started = true; }
      if (!busy) button.textContent = originalLabel;
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (busy || !form.reportValidity()) return;
      const data = new FormData(form), model = value(data, "model"), intent = value(data, "intent");
      const attribution = window.EinksmartTracking?.attribution() || {};
      const lines = ["Model: " + model, "Request: " + intent, "Application: " + value(data, "application"), "Quantity: " + value(data, "quantity"), "Company: " + value(data, "company"), "Country: " + value(data, "country"), "Customer message: " + value(data, "message"), "Landing page: " + (attribution.landing_page || location.origin + location.pathname), "Referrer: " + (attribution.referrer_origin || "direct / unavailable")];
      const payload = {
        lead_brand: "EINKSMART", site_domain: location.hostname, page_url: location.origin + location.pathname,
        page_title: document.title, language: document.documentElement.lang || "en", market: "global",
        name: value(data, "name"), email: value(data, "email"), phone: value(data, "phone"), company: value(data, "company"), country: value(data, "country"),
        product_interest: [model, intent].filter(Boolean).join(" - "), message: lines.join("\n")
      };
      for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) payload[key] = attribution[key] || "";
      const serialized = JSON.stringify(payload);
      if (lastReceived === serialized) { status.textContent = labels.duplicate; return; }
      const mailBody = ["Name: " + payload.name, "Email: " + payload.email, "Phone: " + payload.phone, payload.message].join("\n");
      fallback.href = "mailto:" + salesEmail + "?subject=" + encodeURIComponent("einksmart inquiry: " + (model || intent)) + "&body=" + encodeURIComponent(mailBody);
      fallback.textContent = labels.email; fallback.hidden = true;
      busy = true; button.disabled = true; button.textContent = labels.sending;
      status.textContent = labels.sending; status.dataset.state = "sending";
      const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: serialized, signal: controller.signal });
        const receipt = await response.json();
        // A 2xx HTML/empty response is not proof that the inquiry was accepted.
        if (!response.ok || receipt.ok !== true) throw new Error("unconfirmed_receipt");
        lastReceived = serialized; status.dataset.state = "success"; status.textContent = labels.success;
        track("generate_lead", eventFields()); button.textContent = originalLabel;
      } catch (error) {
        status.dataset.state = "error"; status.textContent = labels.error; fallback.hidden = false; button.textContent = labels.retry;
        track("inquiry_error", { ...eventFields(), error_type: error.name === "AbortError" ? "timeout" : "unconfirmed_receipt" });
      } finally { clearTimeout(timeout); busy = false; button.disabled = false; }
    });
  });
})();
