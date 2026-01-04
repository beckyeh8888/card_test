# ⚡ 快速啟動指南

> 5 分鐘內啟動您的 NFC 智能名片！

---

## 📝 Step 1: 修改 config.json（2 分鐘）

打開 `config.json` 並更新您的資料：

```json
{
  "personal": {
    "name": "您的姓名",           // 👈 改這裡
    "nameEn": "Your Name",       // 👈 改這裡
    "mobile": "0912345678",      // 👈 改這裡
    "email": "your@email.com"    // 👈 改這裡
  },
  "company": {
    "name": "您的公司",          // 👈 改這裡
    "nameEn": "Your Company"     // 👈 改這裡
  },
  "social": {
    "line": "your-line-id",      // 👈 改這裡（沒有就留空 ""）
    "whatsapp": "886912345678"   // 👈 改這裡（沒有就留空 ""）
  }
}
```

**其他欄位都可以先不改**，等之後再慢慢完善。

---

## 🚀 Step 2: 本地測試（1 分鐘）

### 方式 A: Python（最簡單）
```bash
python -m http.server 8000
```

### 方式 B: Node.js
```bash
npx http-server -p 8000
```

### 方式 C: VS Code
右鍵點擊 `index.html` → **Open with Live Server**

然後訪問：`http://localhost:8000`

---

## ✅ Step 3: 測試不同版本（30 秒）

在瀏覽器依序開啟：

```
http://localhost:8000/?v=vendor       👈 廠商版（最簡化）
http://localhost:8000/?v=client       👈 客戶版（完整資訊）
http://localhost:8000/?v=friend       👈 好友版（私人社交）
http://localhost:8000/?v=association  👈 商會版（最詳細）
```

確認每個版本顯示的資訊不同！

---

## 🌐 Step 4: 部署上線（1 分鐘）

### 選項 A: Netlify（最簡單）

1. 訪問 [netlify.com](https://netlify.com)
2. 拖拉整個資料夾到網頁
3. 完成！獲得網址：`xxx.netlify.app`

### 選項 B: GitHub Pages

```bash
git init
git add .
git commit -m "My NFC Smart Card"
git remote add origin https://github.com/你的帳號/repo名稱.git
git push -u origin main

# 然後在 GitHub repo > Settings > Pages > 啟用
```

---

## 📱 Step 5: 生成 QR Code（1 分鐘）

1. 訪問 [qr-code-generator.com](https://www.qr-code-generator.com/)
2. 貼上您的網址（例如：`https://your-site.netlify.app/?v=client`）
3. 下載 PNG
4. 完成！

**建議生成 4 個 QR Code：**
- 廠商版：`?v=vendor`
- 客戶版：`?v=client`
- 好友版：`?v=friend`
- 商會版：`?v=association`

---

## 🎉 完成！

現在您可以：

✅ 分享不同版本的 QR Code
✅ 印刷在名片、海報上
✅ 傳送連結給客戶
✅ 寫入 NFC 標籤（選用）

---

## 💡 下一步

- 📖 閱讀完整文檔：**README.md**
- 🧪 完整測試：**TESTING.md**
- 🚀 進階部署：**DEPLOYMENT.md**
- 📊 查看總結：**SUMMARY.md**

---

## ❓ 遇到問題？

### Q: config.json 改完沒反應？
A: 重新載入網頁（Ctrl+F5 強制刷新）

### Q: 顯示錯誤訊息？
A: 檢查 config.json 語法是否正確（使用 [jsonlint.com](https://jsonlint.com) 驗證）

### Q: QR Code 不顯示？
A: 確認 `assets/` 資料夾中有 `qr_contact.png` 和 `qr_map.png`

### Q: 社交連結不顯示？
A: 如果 `config.json` 中的社交帳號是空字串 `""`，整個區塊會自動隱藏

---

**🎊 恭喜！您的 NFC 智能名片已上線！**

快去分享給您的客戶吧！
