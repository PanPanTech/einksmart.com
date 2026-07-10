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

  document.querySelectorAll(".toc").forEach((toc) => {
    upgradeLegacyToc(toc);
    if (toc.hasAttribute("data-toc")) setupToc(toc);
  });
})();
