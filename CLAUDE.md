# einksmart.com — 站点说明（给 Claude / 任何 AI 助手）

## 站点定位
- PanPanTech 旗下品牌 einksmart（E-Ink Smart），英文为主 + 简体中文（`/en/`、`/zh-cn/`）。
- 两层内容：
  1. **B2B 产品**：Canvas 系列彩色电子纸画框 / OEM 内嵌屏 / 项目大屏（7.5 日历、13.3、10.1、A3 20.2、A2 28.5、31.5、A1 40.5、徽章、桌牌、模组、A1/A2/A3 开放面板 + TCON），全部"样品 / 项目报价"，无公开价格。
  2. **博客（流量主力）**：消费者决策型内容——e-ink 相框/画框选购、Frame TV 替代品、大尺寸电子纸对比、彩色电子纸效果等，用来把搜索和 AI 引用导到产品页和询盘。
- 目标：Google 自然搜索 + AI 搜索（ChatGPT / Perplexity / Google AI 模式）引用 → 样品/项目询盘。
- TODO：首页 `index.html` 的 title/description 仍写 "Color E-Ink Content Platform"（酒店/画廊内容墙），与 `en/index.html` "Color E-Ink Art Frames & Signage" 和 llms.txt "Canvas 画框供应商" 的说法不一致，需用户确认统一口径。

## 品牌事实（页面、JSON-LD、llms.txt 必须一致）
- 品牌 einksmart，PanPanTech 品牌；邮箱 info@einksmart.com
- 型号与供货状态以 `content/products.json` 为准（7.09 为 DVT 工程样品；5.89 样品排期、A3 批量、1.54 规格待确认）
- 价格、交期、认证、电池续航：**不要写成统一承诺**，只写"按报价/按项目确认"。不确定的事实留 TODO 让人工确认，不要编造。

## 跨站关键词分工（硬边界，与 aiesl.com / aieinksmart.com CLAUDE.md 同一张表）
| 领域 | einksmart.com | aieinksmart.com | aiesl.com |
|---|---|---|---|
| 彩色电子纸艺术画框 / 相框 / 消费级电子纸（e ink photo frame, e ink picture frame, color e ink frame, spectra 6 frame） | ✅ 独占 | ✗ | ✗ |
| Frame TV / Samsung The Frame / Meural / Aura / InkPoster / Ionnyk / BLOOMIN8 替代品 | ✅ 独占 | ✗ | ✗ |
| 大尺寸彩色电子纸、电子纸标牌（A1/A2/A3、31.5"、color e-ink signage）、画框 OEM 内嵌屏 | ✅ 主做 | 仅 ESL 相关屏 | ✗ |
| e-ink 技术科普（what is e ink、电子纸原理） | 仅"彩色效果/画框"角度 | ✅ 独占 | ✗ |
| ESL 电子价签硬件、型号、网关、批发/OEM/MOQ | ✗（旧 URL 已跳 aieinksmart） | ✅ 独占 | ✗ |
| AI ESL、零售平台/API/动态定价、零售 ROI | ✗ | 仅实现文 | ✅ 独占 |
| 客流统计 → pyroglaux.com；清洁机器人 → panpantechnology.com | ✗（旧 URL 已跳走） | ✗ | ✗ |

- 同一目标词两站不得同时发新文；新选题先查本表 + 对方 GSC 排名；可互相外链。

## 关键词策略（依据 GSC 2026-08 ~ 11-23，3 个月：725 点击 / 2.63 万曝光 / CTR 2.8% / 平均排名 8.3）
- **核心流量页**：`frame-tv-alternatives`（7,220 曝光，CTR 1.2%，排名 7.9）、`best-color-e-ink-photo-frames-2026`（232 点击）、`large-e-ink-displays-compared`（223 点击）、`e-ink-picture-frames-explained`（5,149 曝光，CTR 1%，排名 11.4）、`e-ink-frame-alternatives`。
- **主攻（排名 10–17，需要往前推）**：e ink photo frame / eink photo frame / e ink picture frame / e ink frame / color eink picture frame / color e ink photo frame → 支柱页 `e-ink-picture-frames-explained` + `best-color-e-ink-photo-frames-2026`。
- **Frame TV 替代词簇**（frame tv alternative(s)、samsung frame alternative、the frame alternatives，排名 6–13，CTR < 1%）→ 优先改 `frame-tv-alternatives` 的 title/meta/开头直答。
- **已有好排名的竞品替代长尾**（3–8 名）：inkposter alternative、ionnyk alternative、switchbot ai art frame alternative、inkframe.net alternatives（3.1 名 0 点击）、framextv alternative（5.9 名 0 点击）→ 在 `e-ink-frame-alternatives` 补对应小节和直答。
- **AI 引用型 / 0 点击**：`frame tv collage app no subscription 2026`（131 曝光，7.4 名，0 点击）、`/en/technology.html`（4.0 名 0 点击）、`/en/solutions.html`（2.9 名 0 点击）→ 页面开头「加粗一句话直答 + 询盘/产品入口」。
- **不追**：mygica / "explore mygica e-paper photo frames"、"paper-like digital photo frames"（排名 30–40，品牌词/意图不符）。
- TODO：电子纸标牌 B2B 词（color e ink signage、large colour e ink display 35 曝光 9.1 名）量还小，是否作为第二支柱需用户确认。

## 内容规范
- 每篇博客：开头 40–60 字直接回答（Quick verdict）+ 指向对应 Canvas 产品页的 CTA；正文对比表；结尾 FAQ（FAQPage JSON-LD 与可见内容一致）。
- 博客 → 产品页（`/en/products/*.html?model=…&intent=…`）→ 询盘表单；GA4 里博客页 page/session ≈ 1.1，内链导流要加强。
- 新文章同步：`en/blog/insights/index.html`（及中文对应页）、`sitemap.xml`（`python scripts/update-sitemap.py`）、`llms.txt`。
- 标题 ≤ 60 字符，description ≤ 155 字符；时效类标题带 2026。
- 禁止：正文出现 SEO/GEO/关键词数据/TODO；内部端点、报价源文件；攻击性竞品比较。

## 技术
- 纯静态站，GitHub Pages，`main` 根目录直接上线（CNAME = www.einksmart.com；apex 301 到 www）。**没有 CI、没有本地定时部署**；push main 即上线。
- 唯一工作副本：`E:\桌面\情绪陪伴与数字艺术生态平台\einksmart.com`。`E:\桌面\SEO\_footer_sites\einksmart.com` 是 7 月的旧克隆（停在 agent/footer 分支，有 10 个未提交改动，落后 main 55 个提交），**不要从那里改或推送**。
- 产品页由模板生成：事实在 `content/products.json`，模板在 `scripts/site-templates.mjs` / `scripts/build-products.mjs`。改产品后：`npm run build:products` → `node scripts/sync-range-links.mjs` → `python scripts/build-datasheets.py`（仅规格变化时）→ `python scripts/update-sitemap.py` → `npm run validate`。详见 `CANVAS-IMPLEMENTATION.md`。
- 测试：先 `npm run dev`（端口 4187）再 `npm test`（Playwright，拦截请求，不会发真实询盘）。
- GA4：`G-1K3DK1399V`（媒体资源 561877199，账号 PanPanTech 414295528），配置在 `assets/analytics-config.js`，加载器 `assets/analytics.js`。**2026-11-02（#9）起才有数据**。
- 事件：page_view、view_product、select_product、blog_to_product、quote_click、whatsapp_click、file_download、inquiry_start、inquiry_error、generate_lead（仅 API 返回 `ok: true` 时发）。
- 询盘表单 `form[data-inquiry-form]`（`assets/site.js`）→ `https://inquiry.panpantechnology.com/api/inquiries`（`lead_brand: EINKSMART`），失败时显示 mailto 兜底。
- 旧 URL：`/products/*.html`、`/collections/all.html` 是 meta-refresh 跳转页（ESL → aieinksmart.com，客流 → pyroglaux.com，3.7 徽章 → canvas-3-7-badge），不能进 sitemap / llms.txt。
- `robots.txt` 已放行主流 AI 爬虫；`llms.txt` 已有产品与博客清单，新增页面要同步。

## 已知问题（2026-11-24 体检）
- GA4（11-02 ~ 11-23）：936 会话；Organic 493（互动 1 分 10 秒）、Direct 434（互动 12 秒，疑似机器人/内部）、AI Assistant 4、Referral 4；**关键事件 0**，3 周内没有 generate_lead / inquiry_start，只有 14 次 quote_click、/en/contact.html 31 次浏览。
- TODO：在 GA4 确认 `generate_lead` 已标记为关键事件（事件从未触发过，可能还没出现在列表里）；Direct 流量加内部/机器人过滤。
- TODO：`/`（203 曝光）是 JS/meta-refresh 跳 `/en/`，GSC 仍单独计；`/en/contact.html`、`canvas-1-54-module` 平均排名 31。
- 未合并分支：origin/cursor/enable-ga4-a696（已由 #9 等价进 main，可删）；origin/agent/footer-* 4 个（7 月，各 1 提交、落后 55+，大概率已被替代）；本地 `publish-colour-eink-wall`（1 个未推送提交：替换博客卡片图片，4 文件）。均待用户确认。
- 本地有 3 个 prunable worktree 记录（目录已不存在），可 `git worktree prune`。

## 工作流
- 新改动开分支 `seo/<主题>-<MMDD>` 或 `post/<slug>-<MMDD>`，经用户确认后合并 main；一次只动相关文件。
- 每两周看 GSC：曝光高 + CTR < 1% 且排名 ≤ 10 的页面优先改标题和开头。
- 跨站规范见 `E:\桌面\SEO`（总控）。
