(function () {
  const assets = window.EinksmartAssets || window.MagiRealmAssets || {};
  const salesEmail = "info@einksmart.com";
  const inquiryEndpoint = "https://inquiry.panpantechnology.com/api/inquiries";

  document.querySelectorAll("[data-image-key]").forEach((node) => {
    const key = node.getAttribute("data-image-key");
    if (!assets[key]) return;
    node.setAttribute("src", assets[key]);
  });

  document.querySelectorAll("[data-bg-key]").forEach((node) => {
    const key = node.getAttribute("data-bg-key");
    if (!assets[key]) return;
    node.style.backgroundImage = "url('" + assets[key] + "')";
  });

  function firstValue(data, keys) {
    for (const key of keys) {
      const item = data.get(key);
      if (item && String(item).trim()) return String(item).trim();
    }
    return "";
  }

  function trackingFields() {
    const params = new URLSearchParams(window.location.search);
    return {
      lead_brand: "EINKSMART",
      site_domain: window.location.hostname,
      page_url: window.location.href,
      page_title: document.title,
      language: document.documentElement.lang || navigator.language || "en",
      market: "global",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_term: params.get("utm_term") || "",
      utm_content: params.get("utm_content") || ""
    };
  }

  function setFormMessage(form, message, isError) {
    let note = form.querySelector("[data-inquiry-status]");
    if (!note) {
      note = document.createElement("p");
      note.setAttribute("data-inquiry-status", "");
      note.className = "inquiry-note";
      form.appendChild(note);
    }
    note.textContent = message;
    note.style.color = isError ? "#b42318" : "";
  }

  function mailtoUrl(subject, body) {
    return (
      "mailto:" +
      salesEmail +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  async function submitInquiry(payload) {
    const response = await fetch(inquiryEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.ok === false) {
      throw new Error(body.error || "Inquiry endpoint returned " + response.status);
    }
    return body;
  }

  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.reportValidity && !form.reportValidity()) return;

      const data = new FormData(form);
      const payload = {
        ...trackingFields(),
        name: firstValue(data, ["name"]),
        email: firstValue(data, ["email"]),
        phone: firstValue(data, ["phone"]),
        company: firstValue(data, ["company"]),
        country: firstValue(data, ["country", "region"]),
        product_interest: firstValue(data, ["product_interest", "intent", "type"]),
        message: firstValue(data, ["message"])
      };

      const body = [
        "Company: " + (payload.company || ""),
        "Name: " + (payload.name || ""),
        "Email: " + (payload.email || ""),
        "Phone / WhatsApp / WeChat: " + (payload.phone || ""),
        "Country / Region / City: " + (payload.country || ""),
        "Inquiry Type: " + (payload.product_interest || ""),
        "Page: " + payload.page_url,
        "Message: " + (payload.message || "")
      ].join("\n");

      const button = form.querySelector("button[type='submit'], input[type='submit']");
      const originalLabel = button ? button.textContent || button.value : "";
      if (button) {
        button.disabled = true;
        if (button.tagName === "INPUT") button.value = "Sending...";
        else button.textContent = "Sending...";
      }

      try {
        await submitInquiry(payload);
        setFormMessage(form, "Submitted. We will contact you soon.", false);
        form.reset();
      } catch (error) {
        console.error("[einksmart inquiry failed]", error);
        setFormMessage(form, "Online submission is temporarily unavailable. Opening email fallback.", true);
        window.setTimeout(() => {
          window.location.href = mailtoUrl("einksmart website inquiry", body);
        }, 600);
      } finally {
        if (button) {
          button.disabled = false;
          if (button.tagName === "INPUT") button.value = originalLabel;
          else button.textContent = originalLabel;
        }
      }
    });
  });
})();
