(function () {
  const assets = window.MagiRealmAssets || {};

  document.querySelectorAll("[data-image-key]").forEach((node) => {
    const key = node.getAttribute("data-image-key");
    if (!assets[key]) return;
    node.setAttribute("src", assets[key]);
  });

  document.querySelectorAll("[data-bg-key]").forEach((node) => {
    const key = node.getAttribute("data-bg-key");
    if (!assets[key]) return;
    node.style.backgroundImage =
      "linear-gradient(90deg, rgba(10, 18, 22, .82), rgba(10, 18, 22, .46)), url('" +
      assets[key] +
      "')";
  });

  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const lang = document.documentElement.lang || "en";
      const message = lang.startsWith("zh")
        ? "已收到你的咨询信息。正式上线时这里会接入 CRM、邮件或企业微信。"
        : "Your inquiry has been received. In production this form can connect to CRM, email, or a partner portal.";
      window.alert(message);
    });
  });
})();
