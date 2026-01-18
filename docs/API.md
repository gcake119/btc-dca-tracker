# API 文件

> btc-dca-tracker 後端 RESTful API 完整說明

**版本**：v1.0.0  
**基礎 URL**：`http://localhost:3000/api`（本地開發）  
**內容類型**：`application/json`

---

## 📋 目錄

- [概覽](#概覽)
- [認證](#認證)
- [交易管理 API](#交易管理-api)
- [匯入匯出 API](#匯入匯出-api)
- [系統 API](#系統-api)
- [錯誤處理](#錯誤處理)
- [資料模型](#資料模型)

---

## 概覽

### API 設計原則

- **RESTful 架構**：使用標準 HTTP 方法（GET, POST, PUT, DELETE）
- **JSON 格式**：所有請求與回應均使用 JSON
- **使用者隔離**：透過 `:userId` 參數區分不同使用者的資料
- **無狀態設計**：每個請求獨立，不依賴 session

### 基礎 URL

| 環境 | URL |
|------|-----|
| 本地開發 | `http://localhost:3000/api` |
| 測試環境 | `https://your-app-test.zeabur.app/api` |
| 正式環境 | `https://your-app.zeabur.app/api` |

### HTTP 狀態碼

| 狀態碼 | 說明 |
|--------|------|
| 200 | 請求成功 |
| 201 | 資源建立成功 |
| 400 | 請求參數錯誤 |
| 404 | 資源不存在 |
| 500 | 伺服器內部錯誤 |

---

## 認證

**Phase 1-2**：無需認證，使用 `userId`（email 格式）作為識別

**Phase 3**：將支援 Google OAuth 2.0

**Phase 4**：將支援 Web3 錢包簽名驗證

---

## 交易管理 API

### 1. 取得所有交易

取得指定使用者的所有交易記錄與錢包資訊。

**端點**：`GET /trades/:userId`

**URL 參數**：
- `userId` (string, required) - 使用者 ID（email 格式，例如：`user@example.com`）

**請求範例**：
```bash
curl -X GET http://localhost:3000/api/trades/user@example.com
```

**成功回應**（200 OK）：
```json
{
  "metadata": {
    "version": "1.0.0",
    "userId": "user@example.com",
    "lastModified": "2026-01-18T10:30:00Z"
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

**錯誤回應**（400 Bad Request）：
```json
{
  "error": "User ID is required"
}
```

---

### 2. 新增交易

新增一筆交易記錄。

**端點**：`POST /trades/:userId`

**URL 參數**：
- `userId` (string, required) - 使用者 ID

**請求 Body**：
```json
{
  "date": "2026-01-18",
  "exchange": "Binance",
  "pair": "BTC/USDT",
  "side": "BUY",
  "baseAsset": "BTC",
  "quoteAsset": "USDT",
  "baseAmount": 0.01,
  "quoteAmount": 430,
  "price": 43000,
  "feeAsset": "USDT",
  "feeAmount": 2.15,
  "notes": "Monthly DCA"
}
```

**欄位說明**：

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| date | string | ✅ | 交易日期（ISO 8601: YYYY-MM-DD） |
| exchange | string | ✅ | 交易所名稱（Binance、OKX、Kraken 等） |
| pair | string | ✅ | 交易對（例如：BTC/USDT、ADA/BTC） |
| side | string | ✅ | 交易方向（BUY 或 SELL） |
| baseAsset | string | ✅ | 基礎資產（BTC、ETH、ADA 等） |
| quoteAsset | string | ✅ | 計價資產（USDT、BTC 等） |
| baseAmount | number | ✅ | 基礎資產數量 |
| quoteAmount | number | ✅ | 計價資產數量 |
| price | number | ❌ | 交易價格（可自動計算：quoteAmount / baseAmount） |
| feeAsset | string | ❌ | 手續費資產 |
| feeAmount | number | ❌ | 手續費數量 |
| notes | string | ❌ | 備註（最多 500 字元） |

**請求範例**：
```bash
curl -X POST http://localhost:3000/api/trades/user@example.com \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-01-18",
    "exchange": "Binance",
    "pair": "BTC/USDT",
    "side": "BUY",
    "baseAsset": "BTC",
    "quoteAsset": "USDT",
    "baseAmount": 0.01,
    "quoteAmount": 430
  }'
```

**成功回應**（201 Created）：
```json
{
  "id": "trade_1737194400000",
  "date": "2026-01-18",
  "timestamp": 1737194400000,
  "exchange": "Binance",
  "pair": "BTC/USDT",
  "side": "BUY",
  "baseAsset": "BTC",
  "quoteAsset": "USDT",
  "baseAmount": 0.01,
  "quoteAmount": 430,
  "price": 43000,
  "feeAsset": null,
  "feeAmount": null,
  "notes": null
}
```

**錯誤回應**（400 Bad Request）：
```json
{
  "error": "Invalid trade data",
  "details": {
    "date": "Date is required and must be in YYYY-MM-DD format",
    "baseAmount": "Base amount must be a positive number"
  }
}
```

---

### 3. 更新交易

更新指定的交易記錄。

**端點**：`PUT /trades/:userId/:tradeId`

**URL 參數**：
- `userId` (string, required) - 使用者 ID
- `tradeId` (string, required) - 交易 ID

**請求 Body**（僅需提供要更新的欄位）：
```json
{
  "baseAmount": 0.02,
  "quoteAmount": 860,
  "notes": "Updated DCA amount"
}
```

**請求範例**：
```bash
curl -X PUT http://localhost:3000/api/trades/user@example.com/trade_1737194400000 \
  -H "Content-Type: application/json" \
  -d '{
    "baseAmount": 0.02,
    "notes": "Updated amount"
  }'
```

**成功回應**（200 OK）：
```json
{
  "id": "trade_1737194400000",
  "date": "2026-01-18",
  "timestamp": 1737194400000,
  "exchange": "Binance",
  "pair": "BTC/USDT",
  "side": "BUY",
  "baseAsset": "BTC",
  "quoteAsset": "USDT",
  "baseAmount": 0.02,
  "quoteAmount": 860,
  "price": 43000,
  "notes": "Updated amount"
}
```

**錯誤回應**（404 Not Found）：
```json
{
  "error": "Trade not found",
  "tradeId": "trade_1737194400000"
}
```

---

### 4. 刪除交易

刪除指定的交易記錄。

**端點**：`DELETE /trades/:userId/:tradeId`

**URL 參數**：
- `userId` (string, required) - 使用者 ID
- `tradeId` (string, required) - 交易 ID

**請求範例**：
```bash
curl -X DELETE http://localhost:3000/api/trades/user@example.com/trade_1737194400000
```

**成功回應**（200 OK）：
```json
{
  "success": true,
  "message": "Trade deleted successfully",
  "tradeId": "trade_1737194400000"
}
```

**錯誤回應**（404 Not Found）：
```json
{
  "error": "Trade not found",
  "tradeId": "trade_1737194400000"
}
```

---

## 匯入匯出 API

### 5. 批量匯入交易

從 CSV 或 JSON 格式批量匯入交易記錄。

**端點**：`POST /import`

**請求 Body**：
```json
{
  "userId": "user@example.com",
  "format": "csv",
  "data": "date,exchange,pair,side,baseAsset,quoteAsset,baseAmount,quoteAmount,price,feeAsset,feeAmount,notes\n2026-01-10,Binance,BTC/USDT,BUY,BTC,USDT,0.01,430,43000,USDT,2.15,DCA\n2026-01-15,OKX,ETH/BTC,BUY,ETH,BTC,1,0.02,0.02,ETH,0.001,Rotation"
}
```

或 JSON 格式：
```json
{
  "userId": "user@example.com",
  "format": "json",
  "data": {
    "trades": [
      {
        "date": "2026-01-10",
        "exchange": "Binance",
        "pair": "BTC/USDT",
        "side": "BUY",
        "baseAsset": "BTC",
        "quoteAsset": "USDT",
        "baseAmount": 0.01,
        "quoteAmount": 430
      }
    ]
  }
}
```

**欄位說明**：

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| userId | string | ✅ | 使用者 ID |
| format | string | ✅ | 資料格式（"csv" 或 "json"） |
| data | string/object | ✅ | CSV 字串或 JSON 物件 |

**請求範例**：
```bash
curl -X POST http://localhost:3000/api/import \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user@example.com",
    "format": "json",
    "data": {
      "trades": [
        {
          "date": "2026-01-10",
          "exchange": "Binance",
          "pair": "BTC/USDT",
          "side": "BUY",
          "baseAsset": "BTC",
          "quoteAsset": "USDT",
          "baseAmount": 0.01,
          "quoteAmount": 430
        }
      ]
    }
  }'
```

**成功回應**（201 Created）：
```json
{
  "success": true,
  "message": "Trades imported successfully",
  "imported": 2,
  "failed": 0,
  "details": {
    "successIds": ["trade_1704873600000", "trade_1705132800000"],
    "failedRecords": []
  }
}
```

**部分成功回應**（207 Multi-Status）：
```json
{
  "success": true,
  "message": "Partial import success",
  "imported": 1,
  "failed": 1,
  "details": {
    "successIds": ["trade_1704873600000"],
    "failedRecords": [
      {
        "line": 2,
        "error": "Invalid date format",
        "data": "2026-13-99,Binance,..."
      }
    ]
  }
}
```

---

### 6. 匯出交易資料

匯出使用者的所有交易記錄。

**端點**：`GET /export/:userId`

**URL 參數**：
- `userId` (string, required) - 使用者 ID

**查詢參數**：
- `format` (string, optional) - 匯出格式（"json" 或 "csv"，預設：json）

**請求範例**：

**匯出 JSON**：
```bash
curl -X GET http://localhost:3000/api/export/user@example.com?format=json
```

**匯出 CSV**：
```bash
curl -X GET http://localhost:3000/api/export/user@example.com?format=csv
```

**成功回應 - JSON 格式**（200 OK）：
```json
{
  "metadata": {
    "version": "1.0.0",
    "exportDate": "2026-01-18T10:30:00Z",
    "userId": "user@example.com"
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
  "wallets": []
}
```

**成功回應 - CSV 格式**（200 OK）：
```csv
date,exchange,pair,side,baseAsset,quoteAsset,baseAmount,quoteAmount,price,feeAsset,feeAmount,notes
2025-01-10,Binance,ADA/BTC,BUY,ADA,BTC,100,0.005,0.00005,ADA,0.1,First DCA
2025-01-15,OKX,BTC/USDT,BUY,BTC,USDT,0.5,21500,43000,USDT,10.75,Monthly DCA
```

**錯誤回應**（404 Not Found）：
```json
{
  "error": "User not found or no trades available",
  "userId": "user@example.com"
}
```

---

## 系統 API

### 7. 健康檢查

檢查 API 伺服器運行狀態。

**端點**：`GET /health`

**請求範例**：
```bash
curl -X GET http://localhost:3000/api/health
```

**成功回應**（200 OK）：
```json
{
  "status": "ok",
  "timestamp": "2026-01-18T10:30:00Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "development"
}
```

---

## 錯誤處理

### 錯誤回應格式

所有錯誤回應遵循統一格式：

```json
{
  "error": "錯誤訊息摘要",
  "message": "詳細錯誤說明（可選）",
  "details": {
    "欄位名稱": "具體錯誤原因"
  },
  "timestamp": "2026-01-18T10:30:00Z"
}
```

### 常見錯誤

#### 400 Bad Request - 請求參數錯誤

```json
{
  "error": "Invalid request data",
  "details": {
    "date": "Date is required and must be in YYYY-MM-DD format",
    "baseAmount": "Must be a positive number"
  }
}
```

**原因**：
- 缺少必填欄位
- 資料格式不正確
- 數值範圍錯誤

**解決方法**：
- 檢查請求 Body 是否包含所有必填欄位
- 確認資料類型正確（數字、字串等）
- 驗證日期格式為 ISO 8601（YYYY-MM-DD）

#### 404 Not Found - 資源不存在

```json
{
  "error": "Trade not found",
  "tradeId": "trade_1737194400000"
}
```

**原因**：
- 交易 ID 不存在
- 使用者 ID 錯誤
- 資料已被刪除

**解決方法**：
- 確認 tradeId 正確
- 使用 `GET /trades/:userId` 列出所有交易
- 檢查 userId 是否正確

#### 500 Internal Server Error - 伺服器錯誤

```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

**原因**：
- 檔案系統錯誤
- 伺服器設定問題
- 程式碼錯誤

**解決方法**：
- 檢查伺服器日誌
- 確認存儲目錄權限
- 聯繫系統管理員

---

## 資料模型

### Trade（交易）

```typescript
interface Trade {
  id: string;              // 唯一識別碼（trade_<timestamp>）
  date: string;            // 交易日期（YYYY-MM-DD）
  timestamp: number;       // Unix 時間戳（毫秒）
  exchange: string;        // 交易所名稱
  pair: string;            // 交易對（例如：BTC/USDT）
  side: "BUY" | "SELL";   // 交易方向
  baseAsset: string;       // 基礎資產（BTC、ETH 等）
  quoteAsset: string;      // 計價資產（USDT、BTC 等）
  baseAmount: number;      // 基礎資產數量
  quoteAmount: number;     // 計價資產數量
  price: number;           // 交易價格（自動計算或手動輸入）
  feeAsset?: string;       // 手續費資產（可選）
  feeAmount?: number;      // 手續費數量（可選）
  notes?: string;          // 備註（可選，最多 500 字元）
}
```

### Wallet（錢包）

```typescript
interface Wallet {
  address: string;         // 錢包地址
  chain: string;           // 鏈名稱（ethereum, cardano 等）
  label: string;           // 標籤（自訂名稱）
  addedDate: string;       // 新增日期（YYYY-MM-DD）
}
```

### UserData（使用者資料）

```typescript
interface UserData {
  metadata: {
    version: string;       // 資料格式版本
    userId: string;        // 使用者 ID
    lastModified: string;  // 最後更新時間（ISO 8601）
  };
  trades: Trade[];         // 交易記錄陣列
  wallets: Wallet[];       // 錢包陣列
}
```

---

## 資料驗證規則

### 日期格式
- **格式**：ISO 8601（YYYY-MM-DD）
- **範例**：`2026-01-18`
- **驗證**：日期必須有效且不能是未來日期

### 數值範圍
- **baseAmount**：> 0
- **quoteAmount**：> 0
- **price**：> 0
- **feeAmount**：>= 0

### 字串長度
- **notes**：最多 500 字元
- **exchange**：最多 50 字元
- **pair**：最多 20 字元

### 交易方向
- **允許值**：`BUY`、`SELL`
- **大小寫**：不敏感（會自動轉換為大寫）

---

## 使用範例

### 完整工作流程範例

#### 1. 檢查 API 狀態

```bash
curl -X GET http://localhost:3000/api/health
```

#### 2. 新增第一筆交易

```bash
curl -X POST http://localhost:3000/api/trades/alice@example.com \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-01-10",
    "exchange": "Binance",
    "pair": "BTC/USDT",
    "side": "BUY",
    "baseAsset": "BTC",
    "quoteAsset": "USDT",
    "baseAmount": 0.01,
    "quoteAmount": 430,
    "notes": "First BTC purchase"
  }'
```

#### 3. 查看所有交易

```bash
curl -X GET http://localhost:3000/api/trades/alice@example.com
```

#### 4. 更新交易備註

```bash
curl -X PUT http://localhost:3000/api/trades/alice@example.com/trade_1704873600000 \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Updated: First monthly DCA"
  }'
```

#### 5. 批量匯入 CSV

```bash
curl -X POST http://localhost:3000/api/import \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "alice@example.com",
    "format": "csv",
    "data": "date,exchange,pair,side,baseAsset,quoteAsset,baseAmount,quoteAmount\n2026-01-15,OKX,ETH/BTC,BUY,ETH,BTC,1,0.02\n2026-01-20,Kraken,ADA/BTC,BUY,ADA,BTC,500,0.025"
  }'
```

#### 6. 匯出為 CSV

```bash
curl -X GET http://localhost:3000/api/export/alice@example.com?format=csv \
  -o my_trades.csv
```

#### 7. 刪除交易

```bash
curl -X DELETE http://localhost:3000/api/trades/alice@example.com/trade_1704873600000
```

---

## 前端整合範例

### JavaScript Fetch API

```javascript
// API 客戶端配置
const API_BASE_URL = 'http://localhost:3000/api';

// 取得所有交易
async function getTrades(userId) {
  const response = await fetch(`${API_BASE_URL}/trades/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch trades');
  }
  return await response.json();
}

// 新增交易
async function createTrade(userId, tradeData) {
  const response = await fetch(`${API_BASE_URL}/trades/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tradeData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create trade');
  }
  
  return await response.json();
}

// 更新交易
async function updateTrade(userId, tradeId, updates) {
  const response = await fetch(`${API_BASE_URL}/trades/${userId}/${tradeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update trade');
  }
  
  return await response.json();
}

// 刪除交易
async function deleteTrade(userId, tradeId) {
  const response = await fetch(`${API_BASE_URL}/trades/${userId}/${tradeId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete trade');
  }
  
  return await response.json();
}

// 使用範例
async function example() {
  const userId = 'user@example.com';
  
  try {
    // 新增交易
    const newTrade = await createTrade(userId, {
      date: '2026-01-18',
      exchange: 'Binance',
      pair: 'BTC/USDT',
      side: 'BUY',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      baseAmount: 0.01,
      quoteAmount: 430,
    });
    
    console.log('Trade created:', newTrade);
    
    // 取得所有交易
    const allTrades = await getTrades(userId);
    console.log('All trades:', allTrades);
    
    // 更新交易
    const updated = await updateTrade(userId, newTrade.id, {
      notes: 'Monthly DCA',
    });
    console.log('Trade updated:', updated);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

---

## Rate Limiting（未來實作）

**Phase 3** 將實作 Rate Limiting：

- **限制**：每個使用者每分鐘最多 60 次請求
- **回應標頭**：
  - `X-RateLimit-Limit`: 60
  - `X-RateLimit-Remaining`: 45
  - `X-RateLimit-Reset`: 1737194460

**超過限制時**（429 Too Many Requests）：
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 30
}
```

---

## CORS 設定

**開發環境**：允許所有來源（`*`）

**正式環境**：僅允許特定網域
- `https://gcake119.github.io`
- `https://your-custom-domain.com`

---

## 版本歷史

| 版本 | 日期 | 變更內容 |
|------|------|----------|
| v1.0.0 | 2026-01-18 | 初始版本：交易 CRUD、匯入匯出 |
| v1.1.0 | 待定 | Google OAuth 認證 |
| v2.0.0 | 待定 | Web3 錢包整合 |

---

## 相關文件

- 📖 [README.md](../README.md) - 專案概覽
- 📋 [SPECIFICATION.md](../spec/SPECIFICATION.md) - 系統規格書
- 🔐 [SECURITY.md](../SECURITY.md) - 安全政策
- 🤝 [CONTRIBUTING.md](../CONTRIBUTING.md) - 貢獻指南

---

**最後更新**：2026-01-18  
**維護者**：btc-dca-tracker team
