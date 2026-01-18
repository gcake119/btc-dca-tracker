# 部署指南

> btc-dca-tracker 部署說明（GitHub Pages + Zeabur）

**最後更新**：2026-01-18  
**適用版本**：v1.0.0

---

## 📋 目錄

- [部署架構](#部署架構)
- [部署步驟](#部署步驟)
- [環境變數配置](#環境變數配置)
- [故障排除](#故障排除)

---

## 部署架構

### 系統組成

```text
┌─────────────────────────────────────────────────────┐
│                   使用者瀏覽器                        │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  前端（靜態網頁）- GitHub Pages                       │
│  - HTML/CSS/JavaScript                              │
│  - 免費託管                                          │
└─────────────────┬───────────────────────────────────┘
                  │ HTTPS/API 請求
                  ▼
┌─────────────────────────────────────────────────────┐
│  後端 API（Node.js + Express）- Zeabur               │
│  - RESTful API                                      │
│  - 免費額度或 $5/月                                  │
└─────────────────┬───────────────────────────────────┘
                  │ 讀寫
                  ▼
┌─────────────────────────────────────────────────────┐
│  存儲層（JSON 檔案）- Zeabur 持久化卷                 │
│  - storage/*.json                                   │
│  - 1GB 免費空間                                      │
└─────────────────────────────────────────────────────┘
```

**成本**：$0-5/月  
**難度**：⭐⭐（簡單）  
**適合**：個人使用

---

## 部署步驟

### 架構說明

- **前端**：GitHub Pages（免費）
- **後端**：Zeabur（免費額度或 $5/月）
- **存儲**：Zeabur 持久化卷（1GB 免費）

### 一、準備專案

```bash
# Fork 或 Clone 專案
git clone https://github.com/gcake119/btc-dca-tracker.git
cd btc-dca-tracker

# 確認專案結構
ls -la
# 應該看到：frontend/ backend/ docs/ spec/ README.md
```

### 二、部署後端到 Zeabur

#### 1. 註冊 Zeabur

1. 前往 [zeabur.com](https://zeabur.com)
2. 使用 GitHub 帳號登入
3. 建立新專案（Project）

#### 2. 連接 GitHub 倉庫

1. 點擊「Add Service」→「Git」
2. 選擇你的 `btc-dca-tracker` 倉庫
3. Zeabur 會自動偵測 Node.js 專案

#### 3. 配置後端服務

**方法 1：使用根目錄 `package.json`**

在專案根目錄建立 `package.json`：

```json
{
  "name": "btc-dca-tracker-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "cd backend && npm install && npm start",
    "dev": "cd backend && npm run dev"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**方法 2：選擇 backend 目錄**

- 在 Zeabur 設定中指定 Root Directory：`backend`

#### 4. 設定環境變數

在 Zeabur 控制台設定：

```bash
NODE_ENV=production
PORT=3000
STORAGE_PATH=/data/storage
CORS_ORIGIN=https://your-username.github.io
AUTH_PASSWORD=your-secure-password-2026
```

**重要**：`AUTH_PASSWORD` 用於 Phase 1-2 的簡單密碼驗證，請設定一個強密碼。

#### 5. 配置持久化卷

1. 在 Zeabur 服務設定中點擊「Volumes」
2. 新增卷：
   - **Mount Path**: `/data/storage`
   - **Size**: 1GB（免費額度）
3. 儲存設定

#### 6. 部署與取得 URL

1. Zeabur 會自動部署
2. 部署完成後，記下 URL（例如：`https://btc-tracker-abc123.zeabur.app`）
3. 測試 API：

```bash
curl https://btc-tracker-abc123.zeabur.app/api/health
```

### 三、配置前端

#### 1. 更新 API 端點

編輯 `frontend/src/config/api.js`（或在 `frontend/public/index.html` 中）：

```javascript
// frontend/src/config/api.js
const API_CONFIG = {
  // 生產環境使用 Zeabur URL
  BASE_URL: 'https://btc-tracker-abc123.zeabur.app/api',
  
  // 開發環境使用本地
  // BASE_URL: 'http://localhost:3000/api',
};

export default API_CONFIG;
```

或直接在前端 JavaScript 中：

```javascript
// 自動判斷環境
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : 'https://btc-tracker-abc123.zeabur.app/api';
```

#### 2. 測試本地前端

```bash
cd frontend
python3 -m http.server 5500 --directory ./public
# 訪問 http://localhost:5500 測試
```

### 四、部署前端到 GitHub Pages

#### 1. 啟用 GitHub Pages

1. 前往你的 GitHub 倉庫
2. Settings → Pages
3. Source: 選擇 `main` 分支
4. Folder: 選擇 `/docs` 或 `/frontend/public`

**方法 1：使用 `/docs` 資料夾**

```bash
# 複製前端檔案到 docs/
cp -r frontend/public/* docs/
git add docs/
git commit -m "deploy: Add frontend to docs for GitHub Pages"
git push origin main
```

**方法 2：建立 `gh-pages` 分支**

```bash
cd frontend
# 建立獨立分支
git checkout --orphan gh-pages
git rm -rf .
cp -r public/* .
git add .
git commit -m "Initial GitHub Pages deploy"
git push origin gh-pages
```

然後在 GitHub Settings → Pages 選擇 `gh-pages` 分支。

#### 2. 更新 CORS 設定

後端需要允許 GitHub Pages 的來源。在 Zeabur 環境變數更新：

```bash
CORS_ORIGIN=https://your-username.github.io,https://your-custom-domain.com
```

或在 `backend/src/middleware/index.js` 中：

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5500',
    'https://your-username.github.io',
    'https://gcake119.github.io',
  ],
  credentials: true,
};
```

#### 3. 驗證部署

1. 訪問 `https://your-username.github.io/btc-dca-tracker`
2. 打開瀏覽器開發者工具 → Network
3. 檢查 API 請求是否正常

### 五、自訂網域（可選）

#### 1. GitHub Pages 自訂網域

1. 在 DNS 供應商設定：
   ```
   CNAME  www  your-username.github.io
   A      @    185.199.108.153
   A      @    185.199.109.153
   A      @    185.199.110.153
   A      @    185.199.111.153
   ```

2. 在 GitHub Settings → Pages → Custom domain 輸入：
   ```
   www.your-domain.com
   ```

3. 啟用 HTTPS（自動）

#### 2. Zeabur 自訂網域

1. 在 Zeabur 服務設定中點擊「Domains」
2. 新增自訂網域：`api.your-domain.com`
3. 在 DNS 設定 CNAME：
   ```
   CNAME  api  cname.zeabur.app
   ```



---

## 環境變數配置

### Zeabur 環境變數

在 Zeabur 服務設定中配置：

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `NODE_ENV` | 執行環境 | `production` |
| `PORT` | API 伺服器端口 | `3000` |
| `STORAGE_PATH` | 資料存儲路徑 | `/data/storage` |
| `CORS_ORIGIN` | 允許的來源（你的 GitHub Pages URL） | `https://your-username.github.io` |
| `AUTH_PASSWORD` | 個人登入密碼（Phase 1-2） | `your-secure-password` |

### 認證方式演進

| Phase | 認證方式 | 說明 |
|-------|---------|------|
| Phase 1-2 | 密碼登入 | 使用 `AUTH_PASSWORD` 環境變數設定個人密碼 |
| Phase 3 | 密碼 + Google OAuth | 支援 Google 帳號登入 |
| Phase 4 | 密碼 + Google + Web3 錢包 | 三種方式皆可登入 |

**Phase 1-2 使用方式**：
- 使用者在前端輸入密碼
- 後端驗證密碼是否與 `AUTH_PASSWORD` 環境變數相符
- 驗證通過後可存取個人資料

**未來擴充**：
- Phase 3：Google OAuth 2.0 整合
- Phase 4：Web3 錢包簽名驗證（MetaMask、Cardano）

### 後端 .env 檔案（本地開發）

```bash
# 環境設定
NODE_ENV=development
PORT=3000

# 存儲設定
STORAGE_PATH=./storage

# CORS 設定
CORS_ORIGIN=http://localhost:5500

# 認證設定（Phase 1-2）
AUTH_PASSWORD=my-secret-password-2026
```

**安全建議**：
- 使用強密碼（至少 12 個字元，包含大小寫字母、數字、特殊符號）
- 不要將密碼提交到 Git 倉庫
- 生產環境使用不同於開發環境的密碼
- 定期更換密碼

---

## 故障排除

### 1. CORS 錯誤

**症狀**：瀏覽器控制台顯示 CORS policy 錯誤

**解決**：
```javascript
// backend/src/middleware/index.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
};
app.use(cors(corsOptions));
```

檢查環境變數：
```bash
echo $CORS_ORIGIN
# 應該是：https://your-domain.com
```

### 2. API 無法連接

**解決方法**：

1. 檢查 Zeabur 後端是否運行：
   - 訪問 `https://your-backend.zeabur.app/api/health`
   - 查看 Zeabur 日誌

2. 確認前端 API URL 正確：
   ```javascript
   // 檢查前端的 API_BASE_URL
   console.log(API_BASE_URL);
   ```

3. 在 Zeabur 確認 CORS_ORIGIN 包含你的 GitHub Pages URL

### 3. 資料無法儲存

**原因**：持久化卷未正確配置

**解決方法**：

1. 在 Zeabur 檢查 Volumes 設定
2. 確認 Mount Path 為 `/data/storage`
3. 確認環境變數 `STORAGE_PATH=/data/storage`

### 4. GitHub Pages 404 錯誤

**原因**：檔案路徑或設定錯誤

**解決方法**：

1. 確認 GitHub Pages 已啟用
2. 檢查來源分支和資料夾設定
3. 確認 `index.html` 在正確位置
4. 等待 1-2 分鐘讓 GitHub Pages 部署完成

### 5. 本地測試正常但線上失敗

**檢查清單**：

- [ ] 前端 API URL 已更新為 Zeabur URL（不是 localhost）
- [ ] Zeabur CORS_ORIGIN 已設定
- [ ] 後端環境變數正確（NODE_ENV=production）
- [ ] 瀏覽器開發者工具查看實際錯誤訊息

---

## 快速檢查指令

```bash
# 檢查後端健康狀態
curl https://your-backend.zeabur.app/api/health

# 測試新增交易
curl -X POST https://your-backend.zeabur.app/api/trades/test@example.com \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-01-18","exchange":"Binance","pair":"BTC/USDT","side":"BUY","baseAsset":"BTC","quoteAsset":"USDT","baseAmount":0.01,"quoteAmount":430}'

# 查看交易
curl https://your-backend.zeabur.app/api/trades/test@example.com
```

---

## 部署檢查清單

### 後端（Zeabur）

- [ ] 後端已部署並運行
- [ ] 健康檢查通過：`https://your-backend.zeabur.app/api/health`
- [ ] 環境變數已設定（NODE_ENV, PORT, STORAGE_PATH, CORS_ORIGIN）
- [ ] 持久化卷已配置（/data/storage, 1GB）
- [ ] 可以建立測試交易

### 前端（GitHub Pages）

- [ ] 前端已推送到 GitHub
- [ ] GitHub Pages 已啟用
- [ ] API_BASE_URL 指向 Zeabur 後端
- [ ] 可以訪問前端頁面
- [ ] 瀏覽器控制台無 CORS 錯誤

### 功能測試

- [ ] 可以新增交易
- [ ] 可以查看交易列表
- [ ] 可以編輯交易
- [ ] 可以刪除交易
- [ ] 資料重新載入後仍存在（持久化測試）

---

## 相關文件

- 📖 [README.md](../README.md) - 專案概覽與快速開始
- 📋 [API.md](./API.md) - 完整 API 文件
- 🤝 [CONTRIBUTING.md](../CONTRIBUTING.md) - 貢獻指南

---

**需要協助？**

- 💬 開啟 [GitHub Issue](https://github.com/gcake119/btc-dca-tracker/issues)

**最後更新**：2026-01-18
