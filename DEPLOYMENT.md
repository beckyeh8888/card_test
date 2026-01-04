# 部署指南

## 🚀 部署選項

選擇最適合您的部署方式：

---

## 選項 1: GitHub Pages（推薦，免費）

### 優點
- ✅ 完全免費
- ✅ 自動 HTTPS
- ✅ 無限流量
- ✅ 易於更新

### 步驟

#### 1. 建立 GitHub Repository
```bash
# 如果還沒有 Git，先初始化
git init

# 添加所有檔案
git add .

# 提交
git commit -m "NFC Smart Business Card MVP"

# 連接到 GitHub（先在 GitHub 建立 repository）
git remote add origin https://github.com/你的帳號/repo名稱.git

# 推送
git push -u origin main
```

#### 2. 啟用 GitHub Pages
```
1. 前往 GitHub repository 頁面
2. Settings > Pages
3. Source: 選擇 "main" branch
4. 點擊 Save
5. 等待 1-2 分鐘
6. 訪問 https://你的帳號.github.io/repo名稱/
```

#### 3. 更新內容
```bash
# 修改 config.json 或其他檔案後
git add .
git commit -m "Update card info"
git push

# 等待 1-2 分鐘後，網站自動更新
```

---

## 選項 2: Vercel（推薦，免費）

### 優點
- ✅ 完全免費
- ✅ 自動 HTTPS
- ✅ 極快的全球 CDN
- ✅ 自動部署（Git push 即部署）
- ✅ 可綁定自訂網域

### 步驟

#### 1. 註冊 Vercel
訪問 [vercel.com](https://vercel.com) 並使用 GitHub 帳號登入

#### 2. 導入專案
```
1. 點擊 "New Project"
2. 選擇您的 GitHub repository
3. 保持所有設定為預設值
4. 點擊 "Deploy"
5. 等待 30 秒
6. 完成！您會獲得一個 xxx.vercel.app 網址
```

#### 3. 綁定自訂網域（選用）
```
1. 前往專案 Settings > Domains
2. 輸入您的網域名稱（例如：card.your-company.com）
3. 依照指示設定 DNS（CNAME 或 A record）
4. 等待 DNS 生效（可能需要 24 小時）
```

#### 4. 環境變數（未來 SaaS 版本才需要）
```
Settings > Environment Variables
KEY: API_KEY
VALUE: your_secret_key
```

---

## 選項 3: Netlify（免費）

### 優點
- ✅ 完全免費
- ✅ 自動 HTTPS
- ✅ 表單處理（可取代 Formspree）
- ✅ 自動部署

### 步驟

#### 方式 A: 拖拉部署（最簡單）
```
1. 訪問 [app.netlify.com](https://app.netlify.com)
2. 將整個專案資料夾拖拉到 "Drop your site folder here"
3. 完成！獲得 xxx.netlify.app 網址
```

#### 方式 B: Git 整合
```
1. 點擊 "New site from Git"
2. 選擇 GitHub
3. 選擇您的 repository
4. 點擊 "Deploy site"
5. 完成！
```

---

## 選項 4: Cloudflare Pages（免費）

### 優點
- ✅ 完全免費
- ✅ 極快的全球 CDN
- ✅ 無限流量
- ✅ 自動 HTTPS

### 步驟

```
1. 訪問 [pages.cloudflare.com](https://pages.cloudflare.com)
2. 連接 GitHub 帳號
3. 選擇 repository
4. Build settings:
   - Build command: (留空)
   - Build output directory: /
5. 點擊 "Save and Deploy"
6. 完成！
```

---

## 選項 5: 自己的伺服器（進階）

### 需求
- VPS 或虛擬主機
- Nginx 或 Apache
- SSH 存取權限

### 步驟（Nginx 範例）

#### 1. 上傳檔案
```bash
# 使用 SCP 或 SFTP
scp -r * user@your-server.com:/var/www/card/
```

#### 2. 設定 Nginx
```nginx
# /etc/nginx/sites-available/card
server {
    listen 80;
    server_name card.your-domain.com;
    root /var/www/card;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 3. 啟用 HTTPS（Let's Encrypt）
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d card.your-domain.com
```

#### 4. 重啟 Nginx
```bash
sudo systemctl restart nginx
```

---

## 📱 QR Code 生成

部署完成後，為每個版本生成 QR Code：

### 使用線上工具

#### 1. [QR Code Generator](https://www.qr-code-generator.com/)
```
1. 貼上網址（例如：https://your-domain.com/?v=vendor）
2. 選擇 "URL"
3. 自訂樣式（可選）
4. 下載 PNG（建議 1000x1000px）
```

#### 2. [QRCode Monkey](https://www.qrcode-monkey.com/)
```
特色：
- 可添加 Logo
- 自訂顏色
- 高解析度（SVG 格式）
```

### 需要生成的 QR Code

| 名稱 | 用途 | URL |
|------|------|-----|
| 預設版 | 通用名片 | `https://your-domain.com/` |
| 廠商版 | 商業夥伴 | `https://your-domain.com/?v=vendor` |
| 客戶版 | 潛在客戶 | `https://your-domain.com/?v=client` |
| 好友版 | 私人社交 | `https://your-domain.com/?v=friend` |
| 商會版 | 商會成員 | `https://your-domain.com/?v=association` |
| vCard | 直接加入聯絡人 | `https://your-domain.com/zhang_yien_maohua.vcf` |

### QR Code 使用建議

**印刷尺寸：**
- 名片：2x2 cm
- 海報：5x5 cm
- 展示板：10x10 cm

**檔案格式：**
- 印刷用：SVG 或 PDF（向量格式）
- 網頁用：PNG（1000x1000px）

---

## 🏷️ NFC 標籤設定

### 1. 購買 NFC 標籤

**推薦規格：**
- 類型：NTAG215 或 NTAG216
- 容量：540 bytes（足夠儲存 URL）
- 尺寸：25mm 圓形或名片型
- 價格：NT$15-30/個（批發價）

**購買管道：**
- 台灣：蝦皮、露天、電子材料行
- 國際：AliExpress、Amazon

### 2. 寫入 NFC 標籤

#### iOS (使用 NFC Tools App)
```
1. 下載 NFC Tools (App Store 免費)
2. 開啟 App > Write
3. Add a record > URL / URI
4. 輸入：https://your-domain.com/nfc-select.html?mode=select
5. Write
6. 將 NFC 標籤靠近 iPhone 背面上方
7. 完成！
```

#### Android (使用 NFC TagWriter)
```
1. 下載 NFC TagWriter (Google Play 免費)
2. Write tags
3. New dataset
4. Link > URL
5. 輸入：https://your-domain.com/nfc-select.html?mode=select
6. Write
7. 將 NFC 標籤靠近手機背面
8. 完成！
```

### 3. 測試 NFC 標籤

```
1. 使用另一支手機碰觸 NFC 標籤
2. 應自動開啟瀏覽器並前往選擇頁面
3. 如果沒有反應：
   - 確認 NFC 功能已開啟（設定 > 連線）
   - 調整手機與標籤的位置
   - 確認 URL 正確
```

---

## 🔒 安全性建議

### 1. HTTPS 強制使用
確保所有部署平台都啟用 HTTPS（GitHub Pages、Vercel、Netlify 預設已啟用）

### 2. Content Security Policy (CSP)
在自己的伺服器上，添加 CSP header：

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://formspree.io https://www.google-analytics.com;";
```

### 3. 定期更新
```bash
# 每個月檢查一次，確保沒有安全性漏洞
# 更新 GA4 追蹤碼
# 檢查 Service Worker 快取策略
```

---

## 📊 部署後檢查清單

- [ ] 網站可正常訪問
- [ ] HTTPS 正常運作（綠鎖圖示）
- [ ] 所有版本 URL 正常（`?v=vendor`, `?v=client` 等）
- [ ] QR Code 圖片正常顯示
- [ ] Service Worker 已註冊（開發者工具確認）
- [ ] Google Analytics 正常追蹤（如有設定）
- [ ] 手機版響應式設計正常
- [ ] vCard 檔案可下載
- [ ] 社交連結正常運作
- [ ] 地圖嵌入正常顯示
- [ ] 多語言切換正常

---

## 🎯 效能優化（選用）

### 1. 圖片優化
```bash
# 使用 ImageOptim 或線上工具壓縮圖片
# 建議：QR Code PNG 壓縮至 50KB 以下
```

### 2. 啟用 Gzip 壓縮
大部分平台預設已啟用，自己的伺服器需手動設定：

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 3. 設定快取
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 🆘 部署問題排查

### 問題 1: 404 Not Found

**原因：** 檔案路徑錯誤

**解決：**
```
確認所有檔案都在根目錄
檢查 manifest.json、sw.js 的路徑
```

### 問題 2: Mixed Content 錯誤

**原因：** HTTPS 頁面載入 HTTP 資源

**解決：**
```
確保所有外部資源都使用 HTTPS
檢查 Google Maps、Formspree 連結
```

### 問題 3: Service Worker 不工作

**原因：** 需要 HTTPS

**解決：**
```
確保網站使用 HTTPS
localhost 也可以（開發用）
```

---

## 📞 聯絡與支援

部署遇到問題？

- Email: ian@mao-hua.com.tw
- LINE: beck830908
- GitHub Issues: 在您的 repository 建立 issue

---

恭喜！您的 NFC 智能名片已成功部署！ 🎊

下一步：
1. 生成各版本 QR Code
2. 寫入 NFC 標籤（如有需要）
3. 開始分享您的智能名片！
