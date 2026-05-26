(function () {
  const assets = window.MagiRealmAssets || {};
  const salesEmail = "info@einksmart.com";

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

  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const lang = document.documentElement.lang || "en";
      const data = new FormData(form);
      const subject = lang.startsWith("zh")
        ? "MagiRealm 网站咨询"
        : "MagiRealm website inquiry";
      const labels = lang.startsWith("zh")
        ? {
            name: "姓名",
            email: "邮箱",
            phone: "电话 / 微信 / WhatsApp",
            intent: "合作类型",
            message: "需求说明"
          }
        : {
            name: "Name",
            email: "Email",
            phone: "Phone / WhatsApp / WeChat",
            intent: "Inquiry Type",
            message: "Message"
          };
      const body = Object.keys(labels)
        .map((key) => labels[key] + ": " + (data.get(key) || ""))
        .join("\n");
      window.location.href =
        "mailto:" +
        salesEmail +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  });
})();
