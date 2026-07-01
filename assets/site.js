(function () {
  const assets = window.EinksmartAssets || window.MagiRealmAssets || {};
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
        ? "灵犀 einksmart 网站咨询"
        : "einksmart website inquiry";
      const labels = lang.startsWith("zh")
        ? {
            company: "公司",
            name: "姓名",
            email: "邮箱",
            phone: "电话 / 微信 / WhatsApp",
            region: "国家 / 区域 / 城市",
            intent: "咨询类型",
            message: "需求说明"
          }
        : {
            company: "Company",
            name: "Name",
            email: "Email",
            phone: "Phone / WhatsApp / WeChat",
            region: "Country / Region / City",
            intent: "Inquiry Type",
            message: "Message"
          };
      const body = Object.keys(labels)
        .filter((key) => data.has(key))
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
