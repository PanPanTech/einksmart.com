(function () {
  function upgradeLegacyToc(toc) {
    if (toc.hasAttribute("data-toc")) return;
    const heading = toc.querySelector(":scope > strong");
    const links = Array.from(toc.querySelectorAll(":scope > a"));
    if (!links.length) return;

    const label = (heading && heading.textContent.trim()) || "On this page";
    const button = document.createElement("button");
    const nav = document.createElement("nav");
    button.className = "toc-toggle";
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "toc-links");
    button.textContent = label;
    nav.className = "toc-links";
    nav.id = "toc-links";
    nav.setAttribute("aria-label", label);
    links.forEach((link) => nav.appendChild(link));
    if (heading) heading.remove();
    toc.append(button, nav);
    toc.setAttribute("data-toc", "");
  }

  function setupToc(toc) {
    const button = toc.querySelector(".toc-toggle");
    const links = Array.from(toc.querySelectorAll('.toc-links a[href^="#"]'));
    const targets = links
      .map((link) => ({ link, target: document.getElementById(link.hash.slice(1)) }))
      .filter((entry) => entry.target);

    function setOpen(open) {
      toc.classList.toggle("is-open", open);
      if (button) button.setAttribute("aria-expanded", String(open));
    }

    function setCurrent(id) {
      links.forEach((link) => {
        const current = link.hash === "#" + id;
        link.classList.toggle("is-current", current);
        if (current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    if (button) {
      button.addEventListener("click", () => setOpen(!toc.classList.contains("is-open")));
    }

    links.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 919px)").matches) setOpen(false);
      });
    });

    const initialId = window.location.hash.slice(1) || (targets[0] && targets[0].target.id);
    if (initialId) setCurrent(initialId);

    if (!("IntersectionObserver" in window) || !targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -72% 0px", threshold: 0 }
    );
    targets.forEach((entry) => observer.observe(entry.target));
  }



  function metaContent(selector) {
    const node = document.querySelector(selector);
    return node ? node.getAttribute("content") || "" : "";
  }

  function canonicalUrl() {
    const canonical = document.querySelector('link[rel="canonical"]');
    return canonical && canonical.href ? canonical.href : window.location.href.split("#")[0];
  }

  function sharePayload() {
    const description = metaContent('meta[property="og:description"]') || metaContent('meta[name="description"]') || "";
    return {
      url: canonicalUrl(),
      title: metaContent('meta[property="og:title"]') || document.title,
      text: description,
      description
    };
  }

  function shareUrl(channel, payload) {
    const url = encodeURIComponent(payload.url);
    const title = encodeURIComponent(payload.title);
    const text = encodeURIComponent((payload.title + (payload.description ? " - " + payload.description : "")).trim());
    const body = encodeURIComponent(payload.title + "\n\n" + payload.url);
    const routes = {
      facebook: "https://www.facebook.com/sharer/sharer.php?u=" + url,
      linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + url,
      x: "https://twitter.com/intent/tweet?url=" + url + "&text=" + title,
      pinterest: "https://www.pinterest.com/pin/create/button/?url=" + url + "&description=" + text,
      whatsapp: "https://wa.me/?text=" + text + "%20" + url,
      telegram: "https://t.me/share/url?url=" + url + "&text=" + title,
      vk: "https://vk.com/share.php?url=" + url + "&title=" + title,
      email: "mailto:?subject=" + title + "&body=" + body
    };
    return routes[channel] || payload.url;
  }

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.top = "-9999px";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  function setupArticleShare(share) {
    const payload = sharePayload();
    share.querySelectorAll("[data-share-channel]").forEach((link) => {
      link.href = shareUrl(link.dataset.shareChannel, payload);
    });

    share.querySelectorAll('[data-share-action="native"]').forEach((button) => {
      if (!navigator.share) {
        button.hidden = true;
        return;
      }
      button.addEventListener("click", async () => {
        try {
          await navigator.share(payload);
        } catch (error) {
          if (!error || error.name !== "AbortError") console.error("[share failed]", error);
        }
      });
    });

    share.querySelectorAll('[data-share-action="copy"]').forEach((button) => {
      const label = button.querySelector(".share-text");
      const original = label ? label.textContent : button.textContent;
      button.addEventListener("click", async () => {
        try {
          await copyText(payload.url);
          button.classList.add("is-copied");
          if (label) label.textContent = button.dataset.copiedLabel || "Copied";
          window.setTimeout(() => {
            button.classList.remove("is-copied");
            if (label) label.textContent = original;
          }, 1800);
        } catch (error) {
          console.error("[copy link failed]", error);
          window.prompt("Copy this article link:", payload.url);
        }
      });
    });
  }

  document.querySelectorAll(".toc").forEach((toc) => {
    upgradeLegacyToc(toc);
    if (toc.hasAttribute("data-toc")) setupToc(toc);
  });

  document.querySelectorAll("[data-article-share]").forEach(setupArticleShare);
})();
