# NFC 智能名片系統 - MVP 版本

## 🎯 專案簡介

這是一個創新的 NFC 智能名片系統，支援**一個 NFC 標籤，多種分享版本**的獨特功能。

### 核心特色

- ✅ **一 NFC 多版本**：透過 NFC 掃描時，持有者可即時選擇分享版本（廠商版、客戶版、好友版、商會版）
- ✅ **QR Code 預設版本**：每個版本可生成專屬 QR Code，掃描後直接顯示對應內容
- ✅ **資料驅動架構**：只需修改 `config.json` 即可更新名片內容
- ✅ **多語言支援**：中文/英文自動切換
- ✅ **PWA 離線支援**：可安裝到手機桌面，離線也能使用
- ✅ **完整聯絡功能**：vCard 下載、電話、Email、地圖導航、社交媒體

---

## 📁 檔案結構

```
digital-card/
├── index.html          # 主要名片頁面（範本）
├── config.json         # 👈 個人資料配置檔（唯一需要修改的檔案）
├── app.js             # 動態渲染引擎
├── nfc-select.html    # NFC 即時選擇頁面
├── manifest.json      # PWA manifest
├── sw.js              # Service Worker（離線支援）
├── assets/            # 資源檔案
│   ├── qr_contact.png
│   ├── qr_map.png
│   ├── icon-192.png
│   └── icon-512.png
├── CHANGELOG.md       # 變更紀錄
└── README.md          # 本檔案
```

---

## 🚀 快速開始

### 步驟 1: 修改 config.json

這是**唯一**需要修改的檔案！打開 `config.json` 並更新您的個人資料：

```json
{
  "personal": {
    "name": "您的姓名",
    "nameEn": "Your Name",
    "title": "您的職稱",
    "mobile": "0912345678",
    "email": "your@email.com"
  },
  "company": {
    "name": "您的公司名稱",
    "nameEn": "Your Company Name",
    "address": "公司地址"
  },
  "social": {
    "line": "your-line-id",
    "whatsapp": "886912345678",
    "linkedin": "https://linkedin.com/in/your-profile",
    "facebook": "https://facebook.com/your-profile"
  }
}
```

### 步驟 2: 準備資源檔案

將以下檔案放入 `assets/` 資料夾：

1. **qr_contact.png** - vCard QR Code（可用 [qr-code-generator.com](https://www.qr-code-generator.com/) 生成）
2. **qr_map.png** - 地圖導航 QR Code
3. **icon-192.png** 和 **icon-512.png** - PWA 圖示

### 步驟 3: 部署

#### 選項 A: GitHub Pages（推薦）
```bash
# 1. 建立 GitHub repository
# 2. 上傳所有檔案
# 3. 在 Settings > Pages 啟用 GitHub Pages
# 4. 您的名片將發布在 https://你的帳號.github.io/repo名稱/
```

#### 選項 B: Vercel / Netlify
```bash
# 1. 連接 GitHub repository
# 2. 自動部署
# 3. 取得免費的 HTTPS 網址
```

#### 選項 C: 本地測試
```bash
# 使用 Python 啟動簡單伺服器
python -m http.server 8000

# 或使用 Node.js
npx http-server
```

---

## 🔗 使用方式

### 方式 1: QR Code 分享（預設版本）

每個版本都有專屬網址，可生成對應的 QR Code：

```
廠商版：https://your-domain.com/?v=vendor
客戶版：https://your-domain.com/?v=client
好友版：https://your-domain.com/?v=friend
商會版：https://your-domain.com/?v=association
預設版：https://your-domain.com/
```

**如何生成 QR Code：**

1. 訪問 [QR Code Generator](https://www.qr-code-generator.com/)
2. 貼上對應版本的網址
3. 下載 PNG 圖片
4. 印刷在名片、海報或展示板上

### 方式 2: NFC 即時選擇（未來功能）

1. **購買 NFC 標籤**（NTAG215/216，約 NT$15-30/個）
2. **寫入 NFC 網址**：`https://your-domain.com/nfc-select.html?mode=select`
3. **使用流程**：
   - 對方用手機碰觸 NFC 標籤
   - 您的手機收到通知，選擇要分享的版本
   - 對方立即看到對應版本的名片

**NFC 寫入工具：**
- iOS: [NFC Tools](https://apps.apple.com/app/nfc-tools/id1252962749)
- Android: [NFC TagWriter](https://play.google.com/store/apps/details?id=com.nxp.nfc.tagwriter)

---

## 🎨 自訂版本設定

在 `config.json` 中的 `profiles` 區塊可設定每個版本顯示哪些資訊：

```json
"profiles": {
  "vendor": {
    "name": "廠商版",
    "showFields": {
      "name": true,
      "company": true,
      "mobile": true,
      "email": true,
      "phone": false,    // ❌ 不顯示公司電話
      "address": false,  // ❌ 不顯示地址
      "social": false,   // ❌ 不顯示社交帳號
      "bio": false       // ❌ 不顯示個人簡介
    }
  },
  "friend": {
    "name": "好友版",
    "showFields": {
      "name": true,
      "mobile": true,
      "email": true,
      "social": true,      // ✅ 顯示社交帳號
      "company": false,    // ❌ 不顯示公司資訊
      "title": false
    },
    "customMessage": "很高興認識你！歡迎隨時聊聊 😊"
  }
}
```

---

## 📊 進階功能

### Google Analytics 追蹤

在 `config.json` 設定您的 GA4 Measurement ID：

```json
"meta": {
  "gaTrackingId": "G-XXXXXXXXXX"
}
```

系統會自動追蹤：
- 頁面瀏覽
- 按鈕點擊
- 語言切換
- 表單提交
- 名片分享
- QR Code 掃描

### Formspree 聯絡表單

1. 註冊 [Formspree](https://formspree.io/)
2. 建立新表單，取得 Form ID
3. 在 `config.json` 設定：

```json
"features": {
  "formspreeId": "您的_FORM_ID"
}
```

### 自訂 Google Maps 嵌入

1. 訪問 [Google Maps](https://www.google.com/maps)
2. 搜尋您的公司地址
3. 點擊「分享」→「嵌入地圖」
4. 複製 `src` 網址到 `config.json`：

```json
"features": {
  "mapEmbedUrl": "https://www.google.com/maps/embed?pb=..."
}
```

---

## 🛠️ 技術規格

### 前端技術
- 純 HTML/CSS/JavaScript（無框架依賴）
- 現代 CSS 特性：CSS Variables、color-mix()、oklab
- 響應式設計（支援所有裝置）
- 漸進式增強（Progressive Enhancement）

### PWA 支援
- Service Worker 離線快取
- Web App Manifest
- 可安裝到手機桌面
- 離線也能瀏覽名片

### 瀏覽器相容性
- ✅ Chrome/Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

---

## 💡 常見問題

### Q: 如何為不同客戶建立多份名片？

A: 複製整個資料夾，修改每份的 `config.json` 即可：

```bash
cp -r digital-card/ client-a-card/
cp -r digital-card/ client-b-card/
# 分別修改 client-a-card/config.json 和 client-b-card/config.json
```

### Q: 如何生成 vCard 檔案？

A: 使用線上工具如 [vCard Generator](https://www.vcard-generator.com/) 或直接編輯 `.vcf` 檔案：

```vcard
BEGIN:VCARD
VERSION:3.0
FN:張倚恩
TEL:+886-978-901-161
EMAIL:ian@mao-hua.com.tw
ORG:茂華實業股份有限公司
END:VCARD
```

### Q: QR Code 顯示不出來怎麼辦？

A: 確認 `assets/` 資料夾中有 `qr_contact.png` 和 `qr_map.png` 檔案。

### Q: 如何測試 NFC 功能？

A: NFC 即時選擇需要後端支援（WebSocket），目前 MVP 版本僅提供 UI。完整功能將在 SaaS 平台版本提供。

---

## 🚀 未來計畫

### Phase 2: SaaS 平台（規劃中）

- [ ] 使用者註冊/登入系統
- [ ] 線上視覺化編輯器
- [ ] WebSocket 即時 NFC 選擇
- [ ] 影音創作者版本（含影片介紹）
- [ ] 自訂網域支援
- [ ] 進階分析儀表板
- [ ] 訂閱付費系統
- [ ] NFC 標籤購買與配送

---

## 📝 更新紀錄

### v2.0.0 (2026-01-05) - MVP 重構版

- ✅ 重構為資料驅動架構
- ✅ 建立 config.json 配置系統
- ✅ 開發 app.js 動態渲染引擎
- ✅ 新增多版本 QR Code 支援
- ✅ 建立 NFC 即時選擇頁面 UI
- ✅ 完整使用文檔

### v1.0.0 (2025-12-31) - 初版

- ✅ 基本電子名片功能
- ✅ SEO 優化
- ✅ 社交媒體連結
- ✅ 多語言支援
- ✅ PWA 離線支援

---

## 📄 授權

本專案僅供茂華實業股份有限公司內部使用。

---

## 🤝 技術支援

如有問題，請聯絡：
- Email: ian@mao-hua.com.tw
- LINE: beck830908

---

**🎉 恭喜！您已完成 NFC 智能名片系統的設定！**

現在您可以：
1. 修改 `config.json` 更新您的資料
2. 生成不同版本的 QR Code
3. 部署到 GitHub Pages
4. 開始分享您的智能名片！
