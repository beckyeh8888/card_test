# 測試指南

## 🧪 快速測試清單

### 1. 基本功能測試

#### ✅ 檢查檔案是否存在
```bash
# 確認所有檔案都已建立
ls -la

# 應該看到：
# - index.html
# - config.json
# - app.js
# - nfc-select.html
# - manifest.json
# - sw.js
# - README.md
```

#### ✅ 啟動本地伺服器
```bash
# 方式 1: Python
python -m http.server 8000

# 方式 2: Node.js
npx http-server -p 8000

# 方式 3: VS Code Live Server 擴充套件
# 右鍵點擊 index.html > Open with Live Server
```

#### ✅ 瀏覽器測試
開啟 `http://localhost:8000/index.html`

---

### 2. 多版本 URL 測試

測試每個版本的 URL 參數是否正常運作：

| 版本 | URL | 預期結果 |
|------|-----|---------|
| 預設版 | `http://localhost:8000/` | 顯示所有資訊 |
| 廠商版 | `http://localhost:8000/?v=vendor` | 只顯示基本聯絡資訊 |
| 客戶版 | `http://localhost:8000/?v=client` | 顯示完整公司資訊 + 產品介紹 |
| 好友版 | `http://localhost:8000/?v=friend` | 顯示私人社交帳號，隱藏公司資訊 |
| 商會版 | `http://localhost:8000/?v=association` | 顯示最完整的資訊（含統編、傳真） |

**測試步驟：**
1. 開啟每個 URL
2. 檢查是否有資訊被隱藏（如廠商版不應顯示社交帳號）
3. 確認自訂訊息是否正確顯示

---

### 3. 動態資料載入測試

#### ✅ 修改 config.json
```bash
# 1. 編輯 config.json
# 2. 將 name 改為 "測試名字"
# 3. 重新載入網頁
# 4. 確認名字已更新為 "測試名字"
```

#### ✅ 測試多語言切換
```
1. 點擊右上角的 "🌐 English"
2. 確認所有文字都變成英文
3. 確認名字變成 config.json 中的 nameEn
4. 再次點擊切換回中文
5. 確認儲存偏好（重新載入頁面後語言設定仍保留）
```

---

### 4. 社交連結測試

#### ✅ 檢查社交按鈕
在 `config.json` 中：
- 如果 `social.line` 有值 → 應顯示 LINE 按鈕
- 如果 `social.line` 為空字串 `""` → LINE 按鈕應隱藏

**測試步驟：**
```json
// 1. 設定所有社交連結
"social": {
  "line": "test123",
  "whatsapp": "886912345678",
  "linkedin": "https://linkedin.com/in/test",
  "facebook": "https://facebook.com/test"
}

// 2. 重新載入 → 應顯示 4 個社交按鈕

// 3. 清空所有社交連結
"social": {
  "line": "",
  "whatsapp": "",
  "linkedin": "",
  "facebook": ""
}

// 4. 重新載入 → 整個社交區塊應該隱藏
```

---

### 5. NFC 選擇頁面測試

#### ✅ 開啟 NFC 選擇頁面
```
http://localhost:8000/nfc-select.html?mode=select
```

**預期結果：**
- 顯示 4 個版本選項（廠商、客戶、好友、商會）
- 點擊任一選項後，連結被複製到剪貼簿
- 按鈕顯示「已選擇！」確認訊息

#### ✅ 測試等待模式
```
http://localhost:8000/nfc-select.html?mode=wait
```

**預期結果：**
- 顯示「正在連線...」的等待畫面
- 顯示轉圈動畫
- （在實際 SaaS 版本，這裡會等待 WebSocket 回應）

---

### 6. 版本顯示/隱藏邏輯測試

#### ✅ 廠商版（最簡化）
URL: `/?v=vendor`

**應顯示：**
- ✅ 姓名
- ✅ 公司名稱
- ✅ 手機
- ✅ Email

**應隱藏：**
- ❌ 公司電話
- ❌ 地址
- ❌ 社交連結
- ❌ 個人簡介
- ❌ 地圖

#### ✅ 好友版（私人社交）
URL: `/?v=friend`

**應顯示：**
- ✅ 姓名
- ✅ 手機
- ✅ Email
- ✅ 社交連結（LINE、WhatsApp 等）
- ✅ 自訂訊息：「很高興認識你！歡迎隨時聊聊 😊」

**應隱藏：**
- ❌ 公司資訊
- ❌ 職稱
- ❌ 統編

---

### 7. PWA 離線功能測試

#### ✅ Service Worker 註冊
```
1. 開啟開發者工具（F12）
2. 前往 Application / 應用程式 標籤
3. 查看 Service Workers
4. 確認 sw.js 已註冊且狀態為 "activated"
```

#### ✅ 離線測試
```
1. 正常載入網頁一次
2. 開啟開發者工具 > Network 標籤
3. 勾選 "Offline" 模式
4. 重新載入網頁
5. 確認頁面仍能正常顯示（從快取載入）
```

---

### 8. Google Analytics 測試（選用）

#### ✅ 設定 GA4
在 `config.json` 中：
```json
"meta": {
  "gaTrackingId": "G-YOUR_ACTUAL_ID"
}
```

#### ✅ 驗證追蹤
```
1. 開啟開發者工具 > Console
2. 輸入: gtag
3. 確認函數存在（不是 undefined）
4. 點擊各種按鈕
5. 在 Console 應該看不到任何錯誤
6. 前往 GA4 即時報表確認事件
```

---

### 9. 響應式設計測試

#### ✅ 測試不同裝置尺寸
```
1. 開啟開發者工具（F12）
2. 點擊 Toggle Device Toolbar（Ctrl+Shift+M）
3. 測試以下尺寸：
   - 📱 iPhone SE (375px)
   - 📱 iPhone 12 Pro (390px)
   - 📱 Pixel 5 (393px)
   - 💻 iPad (768px)
   - 🖥️ Desktop (1920px)
```

**檢查項目：**
- ✅ 所有文字清晰可讀
- ✅ 按鈕大小適合觸控
- ✅ 版面不會橫向溢出
- ✅ 圖片正確顯示

---

### 10. 瀏覽器相容性測試

#### ✅ 測試瀏覽器
- Chrome / Edge (最新版)
- Safari (Mac/iOS)
- Firefox (最新版)
- Samsung Internet (Android)

**檢查項目：**
- ✅ CSS 漸層效果正常
- ✅ 色彩混合（color-mix）正常
- ✅ 所有動畫流暢
- ✅ 3D 傾斜效果（桌面版）

---

## 🐛 常見問題排查

### 問題 1: config.json 載入失敗

**錯誤訊息：** `Failed to load config`

**解決方法：**
```bash
# 檢查 config.json 語法是否正確
# 使用線上工具驗證：https://jsonlint.com/

# 或使用 Node.js
node -e "console.log(JSON.parse(require('fs').readFileSync('config.json')))"
```

### 問題 2: QR Code 不顯示

**可能原因：**
- 圖片檔案不存在
- 檔案路徑錯誤

**解決方法：**
```bash
# 確認檔案存在
ls -la assets/qr_contact.png
ls -la assets/qr_map.png

# 檢查檔案權限
chmod 644 assets/*.png
```

### 問題 3: 版本切換無效

**檢查步驟：**
```
1. 開啟開發者工具 > Console
2. 輸入: console.log(config)
3. 確認 config.profiles 存在
4. 輸入: console.log(currentProfile)
5. 確認正確讀取 URL 參數
```

### 問題 4: CORS 錯誤

**錯誤訊息：** `CORS policy: No 'Access-Control-Allow-Origin'`

**原因：** 直接開啟 HTML 檔案（file:// 協定）會有 CORS 限制

**解決方法：**
```bash
# 必須使用 HTTP 伺服器
python -m http.server 8000
# 然後訪問 http://localhost:8000
```

---

## ✅ 完整測試檢查表

在部署前，請確認以下所有項目：

- [ ] config.json 語法正確
- [ ] 所有 URL 參數版本正常運作
- [ ] 多語言切換正常
- [ ] 社交連結顯示/隱藏邏輯正確
- [ ] NFC 選擇頁面 UI 正常
- [ ] Service Worker 已註冊
- [ ] 離線模式可用
- [ ] 手機版響應式設計正常
- [ ] QR Code 圖片顯示正常
- [ ] 所有按鈕功能正常（電話、Email、地圖）
- [ ] vCard 下載功能正常

---

## 📊 效能測試（選用）

### 使用 Lighthouse
```
1. 開啟開發者工具
2. 前往 Lighthouse 標籤
3. 選擇 Mobile 或 Desktop
4. 點擊 "Generate report"
```

**目標分數：**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 90+

---

恭喜！如果所有測試都通過，您的 NFC 智能名片系統已經準備好部署了！ 🎉
