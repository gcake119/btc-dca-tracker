# btc-dca-tracker 系統規格書

## 1. 專案目標與範圍

- 提供一個「以 BTC 為本位」的現貨 DCA 記帳與分析工具，支援 altcoin/BTC 交易對與法幣→BTC/altcoin 長期定投策略，協助使用者衡量「最終累積了多少 BTC」。
- 僅支援現貨交易與持倉（BTC、主流 altcoin），不支援槓桿與合約。
- 使用 Google 登入並存取 Google 試算表，隨後可綁定 EVM 或 Cardano 錢包登入；所有記帳資料與使用者主檔皆儲存在用戶 Google 試算表。

---

## 2. 角色與使用情境

- 目標：實踐「穩定法幣現金流 + 現貨 DCA + altcoin/BTC 輪動」並以 BTC 為計價核心的長期策略。
- 用戶操作：  
  - 定期以法幣買 BTC/altcoin，或以 altcoin/BTC 策略累積 BTC。
  - 隨時可檢視「總資產折合 BTC」、「歷史 DCA 成本（BTC 計價）」與各 altcoin 帳面績效。

---

## 3. 功能需求（FR）

### 3.1 帳號與身分管理

#### 認證方式演進

本系統採用**多階段認證策略**，逐步增加認證方式：

| 階段 | 認證方式 | 說明 |
|------|---------|------|
| **Phase 1-2** | 密碼登入 | 使用環境變數 `AUTH_PASSWORD` 進行簡單密碼驗證，適合個人使用 |
| **Phase 3** | 密碼 + Google OAuth 2.0 | 新增 Google 登入，取得 Google 帳號與 Sheets 權限 |
| **Phase 4** | 密碼 + Google + Web3 錢包 | 新增 Web3 錢包簽名驗證（EVM/Cardano） |

#### Phase 1-2：密碼登入（當前實作）

- 後端環境變數設定 `AUTH_PASSWORD`
- 使用者僅需輸入 `password` 登入（個人工具，無需 userId）
- 後端驗證密碼後發放 JWT token
- 所有 API 請求需在 Header 帶入 `Authorization: Bearer <token>`
- **適用場景**：個人工具、快速開發、單使用者部署

#### Phase 3：Google OAuth 整合（未來實作）

- 首次註冊須 Google OAuth，取得 Google 帳號與 Sheets 權限
- Google 試算表內建 user_profile 表：紀錄 google_uid、web3 address 清單
- 登入可選密碼或 Google OAuth

#### Phase 4：Web3 錢包整合（未來實作）

- 用戶可綁定/解除 Web3 錢包（EVM/Cardano），以簽名驗證地址所有權
- 登入可選：密碼 or Google or Web3 錢包（由前端將地址與 user_profile 關聯）
- Web3 登入僅在前端做簽名驗證，不保存私鑰

### 3.2 DCA 輸入與資料來源（僅現貨）
- 支援手動輸入與 CSV 匯入（瀏覽器端處理）。
- 如有可用公開 API，支援中心化交易所與鏈上錢包現貨查詢（無 CORS 時不需自架 backend）。
- 交易紀錄、餘額、轉帳均以「現貨」定義，不支援衍生品。

### 3.3 資產與績效計算
- 所有資訊預設 BTC 本位顯示，可切換顯示法幣本位。
- 計算方式：
  - 各幣種現貨持倉、當前 BTC 值和法幣值
  - 投資組合總值、損益、平均 DCA 成本（皆以 BTC 計算）
  - 真實時間對 BTC 的累積（過去某時單純佈局 BTC 的成果對比）

### 3.4 策略與視覺化
- 各 altcoin 匯總 DCA 投入與持倉成本（BTC 基準）。
- 顯示 altcoin/BTC 价格走勢，與用戶切出 BTC 的平均成本線。
- 策略績效圖：現實成果 VS 理論全 BTC 持有（基準線）

---

## 4. 非功能性需求（NFR）

- 前端 HTML/CSS/JS（可選用 Chart.js、PapaParse 等套件）
- 後端 Node.js + Express（簡輕量級 API 服務）
- 靜態網站 + API 伺服器混合部署（GitHub Pages + Zeabur 皆可）
- 試算表為唯一遠端資料庫，前端 + 後端協力管理 session 與資料持久化

### 4.1 後端架構（Phase 2 起實施）

- **技術棧**：Node.js + Express.js
- **存儲層**：
  - 本機開發：本地檔案系統（JSON 格式）
  - 線上部署：Zeabur 掛載卷（持久化存儲）
- **API 設計**：RESTful（交易 CRUD、匯入/匯出、健康檢查）
- **部署方案**：
  - 前端：GitHub Pages 或 Zeabur static site
  - 後端：Zeabur container（自動 CI/CD）

---

## 5. 資料結構與存儲策略

### 5.1 後端存儲層

採用 **JSON + CSV 混合策略**

#### 5.1.1 內部存儲格式：JSON

- 使用 **後端檔案系統 JSON 文件** 存儲交易資料
- 所有資料在後端以 JSON 格式維護
- 優勢：
  - 原生支援複雜型別（日期、數字、物件）
  - 無需型別轉換，邏輯清晰
  - 便於序列化/反序列化與業務邏輯處理
  - **安全的伺服器端存儲，多客戶端支援**

**JSON 資料結構示例：**

```json
{
  "metadata": {
    "version": "1.0.0",
    "exportDate": "2026-01-18T10:30:00Z",
    "userId": "user_email@gmail.com"
  },
  "trades": [
    {
      "id": "trade_1704873600000",
      "date": "2025-01-10",
      "timestamp": 1704873600000,
      "exchange": "Binance",
      "pair": "ADA/BTC",
      "side": "BUY",
      "baseAsset": "ADA",
      "quoteAsset": "BTC",
      "baseAmount": 100,
      "quoteAmount": 0.005,
      "price": 0.00005,
      "feeAsset": "ADA",
      "feeAmount": 0.1,
      "notes": "First DCA"
    }
  ],
  "wallets": [
    {
      "address": "0x1234...abcd",
      "chain": "ethereum",
      "label": "My MetaMask",
      "addedDate": "2025-01-18"
    }
  ]
}
```

**欄位說明：**

- `id`：唯一識別碼（timestamp 或 UUID）
- `date`：ISO 8601 格式（YYYY-MM-DD）
- `timestamp`：毫秒級 Unix 時間戳（便於排序與計算）
- `baseAsset` / `quoteAsset`：交易對拆分（優於單一 pair 欄位）
- `price`：計算欄（可選，`quoteAmount / baseAmount`）
- 所有金額保留完整精度，由前端負責格式化顯示

#### 5.1.2 導入格式：CSV


- 支援用戶上傳 CSV 檔案，匯入交易記錄
- 前端解析 CSV → 轉換為 JSON 格式 → 通過 API 上傳到後端存儲
- 使用 PapaParse 或原生 JavaScript 解析
- 優勢：
  - 兼容大多數交易所導出格式
  - 容易手動編輯與檢查
  - 便於資料遷移與備份
  - **伺服器端驗證與持久化存儲**

**CSV 模板（匯入標準）：**

```csv
date,exchange,pair,side,baseAsset,quoteAsset,baseAmount,quoteAmount,price,feeAsset,feeAmount,notes
2025-01-10,Binance,ADA/BTC,BUY,ADA,BTC,100,0.005,0.00005,ADA,0.1,First DCA
2025-01-15,OKX,BTC/USDT,BUY,BTC,USDT,0.5,21500,43000,USDT,10.75,Monthly DCA
2025-02-01,Kraken,ETH/BTC,BUY,ETH,BTC,2,0.04,0.02,ETH,0.002,Altcoin DCA
```

**CSV 欄位規範：**

- 第一列必為欄位名稱
- 日期格式：ISO 8601（YYYY-MM-DD）
- 金額欄位：支援整數或浮點數（無千位符號）
- `price` 欄位：可選（若缺失，前端自動計算 `quoteAmount / baseAmount`）
- `notes` 欄位：可選，支援任意字串
- 所有字串欄位若含逗號，需用雙引號包含

#### 5.1.3 導出格式：JSON + CSV

- **導出 JSON**：完整資料備份，包含 metadata 與 wallets
- **導出 CSV**：交易記錄清單，便於外部分析或導入其他工具
- 導出時須驗證資料完整性


### 5.2 遠端存儲層（Google Sheets 整合階段）

遷移至 Google Sheets 時，資料結構保持一致性：

#### 5.2.1 Google Sheets 表單設計

- `user_profile` sheet:
  - `google_uid`：唯一識別碼
  - `primary_email`：主信箱
  - `wallet_addresses`：JSON 格式（Ethereum/Cardano 地址）
  - `sheet_id`：用戶試算表 ID
  - `display_preference`：顯示偏好（BTC/法幣）
  - `created_at` / `updated_at`：時間戳

- `trades` sheet:
  - `id`、`date`、`timestamp`：交易唯一性
  - `exchange_or_source`、`pair`、`side`：交易來源與方向
  - `base_asset`、`quote_asset`：幣種拆分
  - `base_amount`、`quote_amount`：數量
  - `price`、`fee_asset`、`fee_amount`：成本計算
  - `notes`：備註
  - 所有欄位與本地 JSON 格式對應

- `prices` sheet（可選）:
  - 用於快照歷史價格或直接前端即時查 API
  - 欄位：`timestamp`、`asset`、`price_in_usd`、`price_in_btc`

#### 5.2.2 資料同步策略

- 前端編輯 → 立即同步至後端存儲
- **後端為唯一資料來源**
- 支援多裝置同步：登入不同裝置時，自動從後端拉取最新資料

### 5.3 開發階段對應

| 階段 | 存儲方案 | 用途 | 遷移計畫 |
| --- | --- | --- | --- |
| Phase 1 | 後端檔案系統 (JSON) | 本地測試 & TDD | 無遠端依賴 |
| Phase 2 | 後端檔案系統 + CSV | 支援導入/導出 | 資料驗證 |
| Phase 3 | 後端 + Google Sheets | 雲端備份 & 多裝置 | 漸進式遷移 |
| Phase 4 | Google Sheets（主）+ 後端快取 | 生產環境 | 完全雲端化 |

---

## 6. 後端架構與 API 設計

### 6.1 後端服務概覽

後端負責持久化存儲交易資料，支援本機開發與雲端部署。

**API 伺服器職責：**

- 交易記錄的 CRUD 操作
- CSV/JSON 匯入/匯出
- 跨域請求（CORS）管理
- 健康檢查與監控

### 6.2 API 端點設計

#### 認證

| 方法 | 端點 | 說明 | 請求體 | 回應 |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/login` | 使用者登入 | `{ password }` | `{ success, token, expiresIn }` |

**認證流程：**

1. 使用者以 `password` 呼叫 `/api/auth/login`
2. 後端驗證密碼（與 `AUTH_PASSWORD` 環境變數比對）
3. 驗證成功後發放 JWT token（有效期 24 小時）
4. 後續所有 API 請求需在 Header 帶入 `Authorization: Bearer <token>`

#### 交易管理

| 方法 | 端點 | 說明 | 請求體 | 回應 |
| --- | --- | --- | --- | --- |
| GET | `/api/trades/:userId` | 讀取所有交易 | 無 | `{ trades: [...], wallets: [...] }` |
| POST | `/api/trades/:userId` | 新增交易 | Trade 物件 | `{ id, ...trade, timestamp }` |
| PUT | `/api/trades/:userId/:tradeId` | 更新交易 | 更新欄位 | 更新後的 Trade |
| DELETE | `/api/trades/:userId/:tradeId` | 刪除交易 | 無 | `{ success: true }` |

**注意**：所有交易管理端點需要認證（Phase 1-2 起）

#### 匯入/匯出

| 方法 | 端點 | 說明 | 用途 |
| --- | --- | --- | --- |
| POST | `/api/import` | 批量匯入 | 從 CSV/JSON 導入交易 |
| GET | `/api/export/:userId?format=json\|csv` | 匯出資料 | 下載使用者資料 |

#### 系統

| 方法 | 端點 | 說明 |
| --- | --- | --- |
| GET | `/api/health` | 健康檢查 |

### 6.3 本機開發架構

```text
backend/
├── src/
│   ├── server.js                    # 主程式入口
│   ├── services/
│   │   └── fileStorageService.js    # 檔案存儲邏輯
│   ├── routes/
│   │   ├── trades.js                # 交易 CRUD 路由
│   │   ├── importExport.js          # 匯入/匯出路由
│   │   └── health.js                # 健康檢查路由
│   └── middleware/
│       └── index.js                 # CORS、日誌、錯誤處理
├── storage/                         # 本機交易檔案存儲
│   └── user@example.com.json        # 用戶資料檔案
├── package.json
├── .env                             # 本機環境變數
└── .env.example
```

**本機運行：**

```bash
cd backend
npm install
npm run dev  # nodemon 自動重載
```

### 6.4 線上部署（Zeabur）

#### 部署架構

```text
GitHub Repository
    ↓
Zeabur (CI/CD 自動部署)
    ├─ Frontend (Static)
    │   └─ GitHub Pages
    └─ Backend (Container)
        ├─ Node.js + Express
        └─ Volume Mount: /data/storage (持久化卷)
```

#### 環境差異

| 面向 | 本機開發 | Zeabur 線上 |
| --- | --- | --- |
| 存儲位置 | `./storage`（本地檔案） | `/data/storage`（掛載卷） |
| 環境變數來源 | `.env` 檔案 | Zeabur 儀表板 |
| 資料持久化 | 檔案系統級 | 卷級（容器重啟保留） |
| CORS_ORIGIN | `http://localhost:5500` | 前端實際域名 |
| 日誌輸出 | 控制台 | Zeabur 日誌查看器 |

### 6.5 前後端通訊流程

```text
前端 (HTML/JS)
    ↓
用戶操作（新增/編輯/刪除交易）
    ↓
調用 TradeAPI 客户端（apiClient.js）
    ↓
HTTP 請求（附帶 Authorization: Bearer <token>）
    ↓
後端 Express Router
    ↓
認證中間件（驗證 JWT token）
    ↓
FileStorageService（讀寫 storage 目錄）
    ↓
JSON 檔案（user@example.com.json）
    ↓
回應 API（JSON）
    ↓
前端更新 UI（即時顯示）
```

### 6.6 認證與授權機制

#### Phase 1-2：簡單密碼驗證

**環境變數設定：**

```bash
AUTH_PASSWORD=your-secure-password-2026
JWT_SECRET=your-jwt-secret-key
```

**JWT Token 規格：**

- **演算法**：HS256
- **有效期**：24 小時
- **Payload**：
  ```json
  {
    "authenticated": true,
    "iat": 1737194460,
    "exp": 1737280860
  }
  ```

**認證流程：**

1. 使用者輸入 `password`
2. 後端比對 `password` 與 `AUTH_PASSWORD`
3. 驗證通過，簽發 JWT token
4. 前端儲存 token（sessionStorage 或 memory）
5. 後續請求帶入 `Authorization: Bearer <token>`
6. 後端中間件驗證 token 有效性

**安全性建議：**

- 使用強密碼（12+ 字元，混合大小寫、數字、符號）
- 不要將密碼硬編碼或提交到 Git
- 定期更新密碼
- 開發環境與正式環境使用不同密碼

### 6.7 關鍵設計決策

#### 為什麼分離後端？

1. **持久化存儲**：無需立即連接 Google Sheets，便於前端開發與測試
2. **隱私安全**：數據存儲在後端伺服器，支援本機部署或雲端部署
3. **效能優化**：後端處理資料邏輯，前端專注 UI
4. **漸進遷移**：後續可漸進式添加 Google Sheets 同步

#### 檔案存儲 vs 資料庫

- **選擇檔案存儲或 SQLite**的原因：
  - 無需部署資料庫（降低複雜度）
  - Zeabur 掛載卷天生支援
  - 交易數量不大（單個用戶通常 < 10k 筆）
  - 每個用戶單個 JSON 檔，便於備份與遷移

#### 無狀態 API

- 每個請求獨立讀寫檔案，無內存快取
- 優勢：容器崩潰不丟失資料
- 權衡：吞吐量受限（適合 < 1000 DAU 應用）

---

## 7. 不屬於本版本的內容（Out of Scope）

- 不支援合約／槓桿／保證金交易與任何衍生品。
- 不自動處理複雜DeFi收益產品，僅現貨DCA與持倉。

---

## 7. 安全與部署須知

- Google OAuth 及 Sheets API金鑰屬公開用途、嚴格設限回調網域。
- Web3 登入僅在前端做簽名驗證，不保存私鑰。
- 完全無服務器，所有記帳與敏感資訊均儲存於用戶 Google 試算表，由用戶自身控制。

---
