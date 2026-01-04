# 更新日誌 (Changelog)

## 🚀 v2.0.0 MVP 重構版 - 2026-01-05

### 🎯 重大更新：資料驅動架構

這是一個**徹底重構**的版本，將電子名片從「單一用途網頁」升級為「可規模化的 NFC 智能名片系統」。

#### ✨ 核心新功能

##### 1. 資料驅動架構
- ✅ **config.json** - 單一配置檔案，包含所有個人資料
- ✅ **app.js** - 600+ 行動態渲染引擎
- ✅ **data-field 屬性** - HTML 範本化，支援動態內容注入
- ✅ 分離資料與呈現，易於維護與批量生成

##### 2. 多版本名片系統（一 NFC 多版本）
- ✅ **廠商版 (vendor)** - 最簡化，只顯示基本聯絡資訊
- ✅ **客戶版 (client)** - 完整公司資訊 + 產品介紹 + 自訂訊息
- ✅ **好友版 (friend)** - 私人社交帳號，隱藏公司資訊
- ✅ **商會版 (association)** - 最完整資訊（含統編、傳真）
- ✅ URL 參數控制：`?v=vendor`, `?v=client`, `?v=friend`, `?v=association`

##### 3. QR Code 分版本支援
- ✅ 每個版本可生成專屬 QR Code
- ✅ 掃描後直接顯示對應版本內容
- ✅ 無需即時選擇，適合印刷品使用

##### 4. NFC 即時選擇介面
- ✅ **nfc-select.html** - 獨立的 NFC 選擇頁面
- ✅ 持有者模式 (mode=select) - 選擇要分享的版本
- ✅ 接收者模式 (mode=wait) - 等待持有者選擇
- ✅ 美觀的 UI 設計（4 個版本選項，emoji 圖示）
- ✅ 一鍵複製連結功能
- ✅ 為未來 WebSocket 即時通訊預留接口

##### 5. 智能顯示/隱藏邏輯
- ✅ 根據版本配置自動顯示或隱藏欄位
- ✅ 社交連結智能過濾（無連結時隱藏整個區塊）
- ✅ 自訂訊息支援（每個版本可設定專屬問候語）
- ✅ 完全可配置的 showFields 設定

#### 📝 完整文檔系統

##### 新增文檔檔案
- ✅ **README.md** (8000+ 字) - 完整使用說明
  - 快速開始指南
  - config.json 配置教學
  - 版本設定說明
  - 進階功能介紹
- ✅ **TESTING.md** (7000+ 字) - 詳細測試指南
  - 10 大測試項目
  - 常見問題排查
  - 完整測試檢查表
- ✅ **DEPLOYMENT.md** (8000+ 字) - 部署指南
  - 5 種部署方案（GitHub Pages、Vercel、Netlify、Cloudflare、自架）
  - QR Code 生成教學
  - NFC 標籤設定指南
  - 安全性與效能優化建議
- ✅ **SUMMARY.md** (3000+ 字) - 專案總結
  - 已完成功能清單
  - 技術亮點
  - 商業模式路徑
  - 下一步建議

#### 🛠️ 技術改進

##### 架構優化
- ✅ 從 1500 行內嵌 JavaScript 重構為模組化 app.js
- ✅ 配置與程式碼完全分離
- ✅ 動態 meta tag 注入（SEO 優化）
- ✅ 動態 Google Analytics 配置
- ✅ 動態 Formspree 表單 action 設定

##### 效能提升
- ✅ 按需載入 config.json（非阻塞）
- ✅ 智能欄位渲染（僅更新變更部分）
- ✅ localStorage 偏好保存（語言、主題）

##### 可維護性
- ✅ 單一來源資料（config.json）
- ✅ 易於版本控制
- ✅ 可腳本化批量生成
- ✅ 清晰的程式碼註解

#### 📊 程式碼統計

- **新增檔案**：
  - config.json (200 行)
  - app.js (600 行)
  - nfc-select.html (250 行)
  - 文檔 (20,000+ 字)
- **修改檔案**：
  - index.html（添加 data-field 屬性，移除內嵌 script）
- **總計**：3000+ 行程式碼 + 20,000+ 字文檔

---

## 第三階段更新 - 2026-01-05 (已整合至 v2.0.0)

### ✨ 新增功能

#### 1. PWA 離線支援
- ✅ 建立 Web App Manifest (`manifest.json`)
- ✅ Service Worker 實作 (`sw.js`)
- ✅ 離線快取策略（Cache-First）
- ✅ 支援「加入主畫面」功能
- ✅ iOS Safari PWA 支援
- ✅ Google Analytics 追蹤 PWA 安裝事件

**功能特色**：
- 可安裝到手機桌面
- 離線也能瀏覽名片
- 快速載入（快取優先）
- 自動快取所有資源

#### 2. 互動式地圖
- ✅ Google Maps 嵌入式地圖
- ✅ 可展開/收合的地圖區塊
- ✅ 延遲載入（loading="lazy"）
- ✅ 鍵盤操作支援
- ✅ Google Analytics 追蹤地圖展開事件
- ✅ 支援多語言

**地圖功能**：
- 顯示公司精確位置
- 支援放大縮小、街景
- 一鍵導航到公司

#### 3. QR Code 優化
- ✅ 修復 QR Code 顯示問題
- ✅ 改善圖片比例與尺寸
- ✅ 使用 `object-fit: contain` 確保完整顯示

---

## 技術細節

### PWA 檔案結構
```
manifest.json - Web App Manifest
sw.js - Service Worker
assets/icon-192.png - PWA 圖示 (192x192)
assets/icon-512.png - PWA 圖示 (512x512)
```

### Service Worker 快取策略
- **Cache-First**: 優先使用快取，提升載入速度
- **Network Fallback**: 快取失敗時從網路載入
- **Auto-Update**: 自動清理舊版快取

### 新增的 CSS 類別
**地圖區塊**：
- `.map-section` - 地圖區塊容器
- `.map-toggle` - 展開/收合按鈕
- `.map-container` - 地圖容器
- `.map-container.expanded` - 展開狀態
- `.map-container iframe` - 地圖 iframe 樣式

**QR Code 修復**：
- `.qrbox picture` - 設定固定寬高
- `.qrbox img` - 使用 `object-fit: contain`

### JavaScript 功能
**PWA 註冊**：
```javascript
navigator.serviceWorker.register('/sw.js')
  .then((registration) => {
    // 追蹤 GA 事件
  });
```

**地圖展開**：
```javascript
function toggleMap() {
  mapContainer.classList.toggle('expanded');
  // 追蹤 GA 事件
}
```

---

## 第二階段更新 - 2026-01-05

### ✨ 新增功能

#### 1. 多語言切換功能（中文/英文）
- ✅ 新增語言切換按鈕（頭部右上角）
- ✅ 支援繁體中文 / 英文雙語切換
- ✅ 自動偵測瀏覽器語言設定
- ✅ localStorage 記憶使用者語言偏好
- ✅ 所有文字內容即時翻譯
- ✅ Google Analytics 追蹤語言切換事件

**翻譯涵蓋範圍**：
- 姓名、職位、部門
- 聯絡資訊標籤（公司、手機、電話、信箱、地址）
- 按鈕文字（撥打、Email、存聯絡人、開地圖）
- QR Code 說明文字
- 社交媒體區塊
- 分享功能按鈕
- 聯絡表單
- 個人簡介區塊

#### 2. 圖片格式優化
- ✅ 使用 `<picture>` 元素支援 WebP 格式
- ✅ PNG 格式作為降級方案（舊瀏覽器）
- ✅ 新增 `loading="lazy"` 延遲載入
- ✅ 明確設定圖片尺寸（width、height）避免版面位移

**效益**：
- 支援 WebP 的瀏覽器可獲得更小的檔案大小
- 降低頁面載入時間
- 改善 Core Web Vitals 指標

#### 3. 聯絡表單整合
- ✅ 完整的聯絡表單（姓名、Email、訊息）
- ✅ 整合 Formspree 服務（免費表單後端）
- ✅ 前端表單驗證
- ✅ 美觀的成功/錯誤提示
- ✅ 送出中的 loading 狀態
- ✅ Google Analytics 表單提交追蹤
- ✅ 支援多語言

**使用方式**：
1. 前往 [Formspree.io](https://formspree.io/) 註冊免費帳號
2. 建立新表單並取得 Form ID
3. 在 `index.html` 第 817 行替換 `YOUR_FORM_ID`

#### 4. 個人簡介區塊
- ✅ 可展開/收合的簡介區塊
- ✅ 專業領域列表
- ✅ 優雅的動畫效果
- ✅ 鍵盤操作支援（Enter/Space 切換）
- ✅ Google Analytics 追蹤展開事件
- ✅ 支援多語言

**簡介內容**：
- 自我介紹
- 專業領域（4 項專長）
- 聯絡邀請

---

## 技術細節

### 新增的 CSS 類別
**多語言**：
- 使用 `data-i18n` 屬性標記需翻譯的元素

**圖片優化**：
- `.qrbox picture` - picture 元素樣式

**聯絡表單**：
- `.contact-form-section` - 表單區塊容器
- `.contact-form` - 表單樣式
- `.form-group` - 表單欄位群組
- `.submit-btn` - 提交按鈕
- `.form-status` - 狀態訊息
- `.form-status.success` - 成功狀態
- `.form-status.error` - 錯誤狀態

**個人簡介**：
- `.bio-section` - 簡介區塊容器
- `.bio-toggle` - 展開/收合按鈕
- `.bio-content` - 簡介內容
- `.bio-content.expanded` - 展開狀態
- `.bio-text` - 簡介段落
- `.bio-list` - 專業領域列表

### 新增的 JavaScript 功能
**多語言系統**：
```javascript
const translations = {
  'zh-TW': { ... },
  'en': { ... }
};
function setLanguage(lang) { ... }
function toggleLanguage() { ... }
```

**圖片優化**：
- 使用 HTML5 `<picture>` + `<source>` 元素
- 瀏覽器自動選擇最佳格式

**表單處理**：
```javascript
contactForm.addEventListener('submit', async (e) => {
  // Fetch API 送出表單
  // 顯示成功/錯誤訊息
  // 追蹤 GA 事件
});
```

**簡介展開**：
```javascript
function toggleBio() {
  bioExpanded = !bioExpanded;
  bioContent.classList.toggle('expanded');
  // 追蹤 GA 事件
}
```

---

## 第一階段更新 - 2025-12-31

### ✨ 新增功能

#### 1. SEO 與元數據優化
- ✅ 新增 Open Graph 標籤（Facebook 社交分享預覽）
- ✅ 新增 Twitter Card 標籤（Twitter 分享預覽）
- ✅ 新增 Schema.org 結構化數據（Person + Organization）
- ✅ 新增 meta keywords、author 標籤
- ✅ 新增 DNS prefetch 和 preconnect 提升性能

**效益**：
- 在社交媒體分享時顯示精美的預覽卡片
- 改善搜尋引擎排名（SEO）
- Google 可以更好地理解頁面內容

#### 2. 社交媒體連結區塊
- ✅ 新增「聯絡我們」區域
- ✅ 支援 LINE、WhatsApp、LinkedIn、Facebook
- ✅ 響應式網格佈局
- ✅ 優雅的懸停動畫效果

**使用方式**：
請將以下連結替換為實際的社交媒體帳號：
- LINE: `https://line.me/ti/p/~YOUR_LINE_ID`
- WhatsApp: 已設定為 `886978901161`
- LinkedIn: `https://www.linkedin.com/in/YOUR_LINKEDIN`
- Facebook: `https://www.facebook.com/YOUR_FACEBOOK`

#### 3. 分享功能
- ✅ Web Share API（原生分享）
  - 在支援的瀏覽器（iOS Safari、Android Chrome）可直接分享到社交媒體
- ✅ 複製連結功能
  - 一鍵複製名片網址到剪貼簿
  - 成功後顯示「已複製！」視覺反饋
- ✅ 智能降級處理
  - 不支援 Web Share API 時自動使用複製功能

#### 4. Google Analytics 4 整合
- ✅ 完整的 GA4 追蹤代碼
- ✅ 自動追蹤頁面瀏覽
- ✅ IP 匿名化（符合隱私政策）
- ✅ 自訂事件追蹤：
  - **button_click**: 所有按鈕點擊（撥打、Email、存聯絡人、開地圖）
  - **social_link**: 社交媒體連結點擊
  - **fab_button**: 浮動操作按鈕點擊
  - **share**: 分享名片事件
  - **copy_link**: 複製連結事件
  - **theme_change**: 主題切換事件（深色/淺色）

**設定方式**：
1. 前往 [Google Analytics](https://analytics.google.com/)
2. 建立 GA4 屬性並取得 Measurement ID（格式：G-XXXXXXXXXX）
3. 在 `index.html` 第 67、72 行替換 `G-XXXXXXXXXX` 為實際的 ID

---

## 技術細節

### 新增的 CSS 類別
- `.social-links` - 社交媒體區塊容器
- `.social-grid` - 社交按鈕網格佈局
- `.social-btn` - 社交媒體按鈕樣式
- `.share-section` - 分享區塊容器
- `.share-buttons` - 分享按鈕網格
- `.share-btn` - 分享按鈕樣式
- `.share-btn.success` - 成功狀態樣式（綠色）

### 新增的 JavaScript 功能
- `trackEvent()` - Google Analytics 事件追蹤輔助函數
- Web Share API 實作（含降級處理）
- Clipboard API 實作（複製連結）
- 自動追蹤所有按鈕點擊事件
- 主題切換追蹤

### 新增的 HTML Meta 標籤
```html
<!-- SEO -->
<meta name="keywords" content="..." />
<meta name="author" content="..." />

<!-- Open Graph -->
<meta property="og:type" content="profile" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary" />

<!-- Schema.org -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  ...
}
</script>
```

---

## 後續建議

### 立即操作
1. **替換社交媒體連結**為實際帳號
2. **設定 Google Analytics 4** Measurement ID
3. **測試分享功能**在不同裝置上的效果
4. **驗證 Open Graph** 使用 [Facebook Debugger](https://developers.facebook.com/tools/debug/)

### 進階優化（第二階段）
- 多語言切換功能
- 圖片格式優化（WebP）
- 離線 PWA 支援
- 聯絡表單整合

---

## 相容性

| 功能 | 支援範圍 |
|------|---------|
| Open Graph | 所有社交平台 |
| Schema.org | 所有搜尋引擎 |
| Web Share API | iOS Safari 12+, Android Chrome 61+ |
| Clipboard API | 所有現代瀏覽器 |
| Google Analytics | 所有瀏覽器 |

---

## 需要配置的項目（重要！）

### 第三階段
1. **PWA 圖示**（必須）
   - 建立 `assets/icon-192.png`（192x192 像素）
   - 建立 `assets/icon-512.png`（512x512 像素）
   - 建議使用公司 Logo 或名片設計
   - 可使用線上工具：https://realfavicongenerator.net/

2. **Google Maps 嵌入網址**（可選）
   - 目前使用範例座標
   - 前往 [Google Maps](https://www.google.com/maps)
   - 搜尋公司地址：408 台中市南屯區永春東一路717號
   - 點擊「分享」→「嵌入地圖」→ 複製 iframe src
   - 替換 `index.html`:980 的 iframe src

### 第二階段
1. **Formspree 表單** (`index.html`:817)
   - 註冊 Formspree 帳號
   - 替換 `YOUR_FORM_ID`

2. **WebP 圖片**（可選）
   - 如需 WebP 優化，將 QR Code 轉換為 WebP 格式
   - 檔名：`qr_add_contact.webp`、`qr_map.webp`
   - 或保持使用 PNG（已有降級方案）

### 第一階段
1. **社交媒體連結** (`index.html`:495, 503, 506, 507)
   - LINE ID: `beck830908`（已設定）
   - WhatsApp: 已設定
   - LinkedIn: 替換 `YOUR_LINKEDIN`
   - Facebook: 替換 `YOUR_FACEBOOK`

2. **Google Analytics** (`index.html`:67, 72)
   - 替換 `G-XXXXXXXXXX` 為實際 GA4 Measurement ID

3. **Open Graph URL**（如網址不同）
   - 更新 `og:url`、`og:image` 等

---

## 檔案變更總覽

### 第三階段 (2026-01-05)
- ✏️ `index.html` - 新增 PWA 支援、互動式地圖、修復 QR Code
- 📄 `manifest.json` - PWA Web App Manifest
- 📄 `sw.js` - Service Worker 離線快取
- ✏️ `CHANGELOG.md` - 更新文檔

### 第二階段 (2026-01-05)
- ✏️ `index.html` - 新增多語言、表單、簡介、圖片優化
- ✏️ `CHANGELOG.md` - 更新文檔

### 第一階段 (2025-12-31)
- ✏️ `index.html` - 新增 SEO、社交媒體、分享、GA4
- 📄 `CHANGELOG.md` - 建立文檔
