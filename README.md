# btc-dca-tracker

> 一個以 **BTC 為本位** 的現貨 DCA 記帳與分析工具

專為實踐「穩定現金流 + 現貨 DCA + altcoin/BTC 輪動」策略設計，協助你衡量**最終累積了多少 BTC**。

使用純 HTML/CSS/JavaScript + Node.js Express 構建，支援本地檔案存儲、CSV 導入/導出，**完全開源**。

---

## ✨ 核心特色

### 📊 BTC 本位計算

- **唯一以 BTC 為基準** 顯示所有資產和收益
- 追蹤「總資產折合 BTC」與「歷史 DCA 成本（BTC 計價）」
- 對比策略績效：現實成果 vs 理論全 BTC 持有

### 💰 現貨 DCA 記帳

- 快速記錄現貨加密貨幣購買（BTC、ETH、ADA 等）
- 支援法幣→BTC、altcoin/BTC 交易對
- **僅支援現貨交易**，不支援槓桿與合約

### 📁 多種資料管理

- **手動輸入**：快速新增交易記錄
- **CSV 匯入**：批量導入交易歷史
- **JSON 匯出**：完整資料備份
- 本地檔案存儲（未來支援 Google Sheets 同步）

### 🔐 隱私優先

- 後端檔案系統存儲，資料完全掌控
- 可本機運行，無需上傳雲端
- 完全開源，可審計代碼

### 🚀 輕量部署

- 前端：純靜態網頁（GitHub Pages / Vercel）
- 後端：Node.js Express（Zeabur / Heroku / 自有伺服器）
- 無需資料庫，JSON 檔案存儲即可運行

## Project Structure

詳見 [STRUCTURE.md](./STRUCTURE.md)

```text
btc-dca-tracker/
├── frontend/              # 前端應用程式
│   ├── public/           # HTML 入口
│   ├── src/              # JavaScript & CSS 原始檔
│   └── package.json
├── backend/              # 後端 API 伺服器
│   ├── src/              # Express 伺服器
│   ├── storage/          # 本機資料存儲
│   ├── docs/             # 後端文檔
│   └── package.json
├── docs/                 # 部署與集成指南
├── spec/                 # 規格書
└── README.md
```

---

## 🚀 快速開始

### 本地開發（推薦開始方式）

#### 1. 啟動後端

```bash
cd backend
npm install
npm run dev
# 後端運行於 http://localhost:3000
```

#### 2. 啟動前端

```bash
cd frontend
python3 -m http.server 5500 --directory ./public
# 前端運行於 http://localhost:5500
```

#### 3. 開始使用

1. 在瀏覽器訪問 `http://localhost:5500`
2. 輸入 User ID（例如：`user@example.com`）
3. 開始新增交易記錄！

**成本**: $0 | **難度**: ⭐ 簡單 | **存儲**: 本地 JSON 檔案

---

### 線上部署（自架方案）

#### 方案 A：GitHub Pages + Zeabur

1. **部署後端到 Zeabur**

   ```bash
   # Fork 此專案
   # 在 Zeabur 連接你的 GitHub repo
   # 選擇 backend 資料夾部署
   # 記下後端 URL：https://your-app.zeabur.app
   ```

2. **部署前端到 GitHub Pages**

   ```bash
   # 修改 frontend/src/config/api.js
   # 將 API_BASE_URL 改為你的 Zeabur URL
   # 推送到 GitHub，啟用 Pages
   ```

**成本**: $0-5/月 | **難度**: ⭐⭐ | **控制**: 完全自主

#### 方案 B：本地伺服器運行

```bash
# 使用 PM2 持久化運行
cd backend
npm install -g pm2
pm2 start src/server.js --name btc-tracker
pm2 save
pm2 startup
```

**成本**: $0 | **難度**: ⭐⭐⭐ | **隱私**: 最高

詳見：

- [frontend/README.md](./frontend/README.md) - 前端開發指南
- [backend/README.md](./backend/README.md) - 後端開發指南
- [docs/deployment.md](./docs/deployment.md) - 完整部署教學

---

## 📋 開發階段

本專案採用多階段開發策略，逐步實現完整功能。詳細進度請參考 [TODO.md](./TODO.md)，階段性更新記錄請見 [CHANGELOG.md](./CHANGELOG.md)。

| 階段 | 功能 | 認證方式 | 存儲方案 |
|------|------|----------|----------|
| **Phase 1** | 前端 UI + 後端 API 基礎架構 | 密碼登入 | 本地 JSON 檔案 |
| **Phase 2** | CSV 匯入/匯出 + UI 完善 | 密碼登入 | 本地 JSON + CSV |
| **Phase 3** | Google OAuth 整合 | 密碼 + Google OAuth | Google Sheets API |
| **Phase 4** | Web3 錢包 + BTC 本位分析 | 密碼 + Google + Web3 錢包 | Google Sheets (主) |

**認證方式演進：**
- **Phase 1-2**：簡單密碼登入（環境變數 `AUTH_PASSWORD`），適合個人使用
- **Phase 3**：新增 Google OAuth 2.0，支援 Google Sheets 同步
- **Phase 4**：新增 Web3 錢包簽名驗證（EVM/Cardano）

---

## 📚 文檔與資源

### 核心文檔

- 📖 [SPECIFICATION.md](./spec/SPECIFICATION.md) - 完整規格書
- 🏗️ [STRUCTURE.md](./STRUCTURE.md) - 專案結構說明
- 📝 [TODO.md](./TODO.md) - 開發待辦事項

### API 文檔

- 🔌 [backend/README.md](./backend/README.md) - API 端點說明
- 🎨 [frontend/README.md](./frontend/README.md) - 前端架構

### 部署指南

- 🚀 [docs/deployment.md](./docs/deployment.md) - 部署選項指南

---

## 📊 資料格式

本系統支援 **CSV** 與 **JSON** 兩種資料格式：

| 格式 | 用途 |
|------|------|
| **CSV** | 匯入/匯出、Excel 編輯 |
| **JSON** | 內部存儲、完整備份 |

**快速範例：**

```csv
date,exchange,pair,side,baseAsset,quoteAsset,baseAmount,quoteAmount
2025-01-10,Binance,ADA/BTC,BUY,ADA,BTC,100,0.005
2025-01-15,OKX,BTC/USDT,BUY,BTC,USDT,0.5,21500
```

📖 **完整格式說明請參考**：[docs/DATA_FORMAT.md](./docs/DATA_FORMAT.md)

---

## 🛠️ 技術棧

### 前端

- 純 HTML/CSS/JavaScript（無框架依賴）
- Chart.js（圖表視覺化）
- PapaParse（CSV 解析）

### 後端

- Node.js + Express.js
- 檔案系統存儲（JSON 格式）
- CORS 中間件

### 部署

- 前端：GitHub Pages / Vercel / Netlify
- 後端：Zeabur / Heroku / Railway / 自有伺服器
- 儲存：本地檔案系統（未來支援 Google Sheets）

---

## 🤝 貢獻指南

歡迎 Fork、開 Issue 或提交 Pull Request！

**開發規範：**

- 遵循 Airbnb JavaScript Style Guide
- 提交前請執行 lint 檢查
- 保持清晰的 commit 歷史
- 詳見：[CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 授權

MIT License - 詳見 [LICENSE](./LICENSE)

---

## 💖 支持此專案

If you find this tool helpful or want to support my work, consider contributing:

- **Crypto donate（Web3）：**  
  [https://gcake119.fkey.id/](https://gcake119.fkey.id/)
- **Credit card/Line Pay：**  
  [https://open.firstory.me/join/wwhowbuhow/tier/01925f48-ec8c-449e-74f2-b5ee9380e637](https://open.firstory.me/join/wwhowbuhow/tier/01925f48-ec8c-449e-74f2-b5ee9380e637)

**Cold Wallet / Hardware Wallet Affiliate Links**  
Ledger: [https://shop.ledger.com/pages/referral-program?referral_code=NNS6VK4T6YRFP](https://shop.ledger.com/pages/referral-program?referral_code=NNS6VK4T6YRFP)  
Trezor: [https://affil.trezor.io/SHh5](https://affil.trezor.io/SHh5)  
CoolWallet: [https://www.coolwallet.io/product/coolwallet-pro/?ref=zta0ymf](https://www.coolwallet.io/product/coolwallet-pro/?ref=zta0ymf)

**Thank you for supporting independent Web3 research!**
