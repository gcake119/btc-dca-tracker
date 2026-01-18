# 貢獻指南

感謝您對 **btc-dca-tracker** 的貢獻興趣！本專案是一個以 **BTC 為本位** 的現貨 DCA 記帳與分析工具，我們歡迎任何形式的貢獻。

## 📋 目錄

- [行為準則](#行為準則)
- [專案架構](#專案架構)
- [如何開始](#如何開始)
- [開發流程](#開發流程)
- [編碼規範](#編碼規範)
- [測試](#測試)
- [提交指南](#提交指南)
- [Pull Request](#pull-request)

---

## 行為準則

我們致力於維持一個友好、包容的社群。所有參與者應：

- 對他人尊重和友善
- 歡迎不同意見
- 接受建設性批評
- 專注於對社群最有益的事

**不可接受的行為** 包括騷擾、歧視、污辱等。違反者將被移除。

---

## 專案架構

### 核心理念

- **BTC 本位計算**：所有資產和收益以 BTC 為基準
- **現貨交易優先**：僅支援現貨，不支援槓桿與合約
- **後端為唯一資料來源**：無前端本地存儲（localStorage）
- **漸進式發展**：從本地檔案存儲逐步遷移至 Google Sheets

### 技術棧

**前端**：

- 純 HTML/CSS/JavaScript（無框架依賴）
- Chart.js（圖表）、PapaParse（CSV 解析）

**後端**：

- Node.js + Express.js
- 檔案系統存儲（JSON 格式）
- RESTful API 設計

### 當前開發階段

| 階段 | 狀態 | 功能 |
|------|------|------|
| Phase 1 | ✅ 完成 | 基礎架構（前端 UI + 後端 API） |
| Phase 2 | 🚧 進行中 | CSV 匯入/匯出 + UI 完善 |
| Phase 3 | 📅 規劃中 | Google Sheets 整合 |
| Phase 4 | 📅 未來 | Web3 錢包登入 + BTC 本位分析 |

詳見：[SPECIFICATION.md](./spec/SPECIFICATION.md)

---

## 如何開始

### 前置需求

- **Node.js** >= 18（後端開發）
- **Python 3**（前端本地測試用 HTTP server）
- **Git** 基礎知識
- 熟悉 **JavaScript / HTML / CSS**（前端）
- 熟悉 **Express.js**（後端 API 開發）

### Fork 與 Clone

```bash
# Fork 至你的 GitHub 帳戶
# 然後 clone

git clone https://github.com/YOUR_USERNAME/btc-dca-tracker.git
cd btc-dca-tracker

# 新增上游倉庫
git remote add upstream https://github.com/gcake119/btc-dca-tracker.git
```

### 同步上游

```bash
git fetch upstream
git rebase upstream/main
```

---

## 開發流程

### 1. 建立功能分支

```bash
git checkout -b feature/your-feature-name
# 或修復 Bug
git checkout -b fix/your-bug-fix
```

分支命名規範：

- `feature/xxx` - 新功能
- `fix/xxx` - Bug 修復
- `docs/xxx` - 文檔更新
- `refactor/xxx` - 程式碼重構
- `test/xxx` - 測試相關

### 2. 開發本機環境

#### 啟動後端（必須先啟動）

```bash
cd backend
npm install
npm run dev
# 後端運行於 http://localhost:3000
# 資料存儲在 backend/storage/ 目錄
```

#### 啟動前端

```bash
cd frontend
python3 -m http.server 5500 --directory ./public
# 前端運行於 http://localhost:5500
```

#### 測試連接

1. 訪問 http://localhost:5500
2. 檢查後端健康狀態：http://localhost:3000/api/health
3. 輸入測試 User ID（例如：`test@example.com`）
4. 開始新增交易記錄

**注意**：前端直接調用後端 API，沒有本地存儲回退機制。後端必須保持運行。

### 3. 定期提交

```bash
git add .
git commit -m "feat: 簡潔描述你的改變"
```

提交訊息規範（遵守 Conventional Commits）：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**type**:
- `feat`: 新功能
- `fix`: Bug 修復
- `docs`: 文檔
- `style`: 格式（不改變代碼邏輯）
- `refactor`: 重構
- `test`: 測試
- `chore`: 構建、依賴等

**例子**：

```
feat(trades): 新增交易刪除功能

- 實現 DELETE /api/trades/:tradeId 端點
- 新增前端確認對話框
- 更新本地存儲回退

Closes #42
```

---

## 編碼規範

### 通用原則

- **保持簡單**：優先使用原生 JavaScript，避免不必要的依賴
- **後端為中心**：所有資料邏輯在後端處理，前端僅負責 UI
- **無 localStorage**：不使用前端本地存儲，所有資料由後端管理
- **RESTful API**：遵循 REST 設計原則

### JavaScript / Node.js

遵守 [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)：

```javascript
// ✅ 好
const user = {
  name: 'John',
  age: 30,
};

function getUserName(user) {
  return user.name;
}

// ❌ 不好
const user = {name: "John", age: 30}
function getUserName(u) {
  return u.name
}
```

使用 ESLint 檢查：

```bash
npm run lint
```

### HTML / CSS

- 使用有意義的語義 HTML
- CSS 使用 BEM 命名規範
- 使用 CSS 變數維持一致性

```html
<!-- ✅ 好 -->
<button class="btn btn--primary">Click</button>

<!-- ❌ 不好 -->
<button onclick="doSomething()">Click</button>
```

```css
/* ✅ 好 */
.trade-card {
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
}

.trade-card__title {
  font-weight: bold;
}

/* ❌ 不好 */
.card {
  padding: 16px;
  background: #f0f0f0;
}

.card .title {
  font-weight: bold;
}
```

### 註解與文檔

- 使用清晰的註解解釋「為什麼」而非「做什麼」
- 為公開方法/函數添加 JSDoc 註解

```javascript
/**
 * 根據使用者 ID 取得交易清單
 * @param {string} userId - 使用者 ID
 * @returns {Promise<Array>} 交易陣列
 * @throws {Error} 若 userId 無效
 */
async function getTrades(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  // ...
}
```

---

## 測試

### 執行測試

**後端測試**：

```bash
cd backend
npm test
```

**前端測試**（目前為手動測試）：

- 在瀏覽器中測試所有 UI 互動
- 使用瀏覽器開發者工具檢查網路請求
- 驗證錯誤處理和邊界情況

### API 測試

使用 curl 或 Thunder Client / Postman 測試：

```bash
# 健康檢查
curl http://localhost:3000/api/health

# 獲取交易
curl http://localhost:3000/api/trades/test@example.com

# 新增交易
curl -X POST http://localhost:3000/api/trades/test@example.com \
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

### 撰寫測試

- 後端使用 Jest 或 Vitest
- 優先測試 API 端點和資料邏輯
- 重要功能需要測試覆蓋率 >= 80%

```javascript
describe('Trade API', () => {
  it('should create a new trade', async () => {
    const trade = {
      date: '2026-01-18',
      exchange: 'Binance',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      baseAmount: 0.01,
      quoteAmount: 430,
    };
    
    const response = await request(app)
      .post('/api/trades/test@example.com')
      .send(trade);
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.baseAsset).toBe('BTC');
  });
});
```

---

## 提交指南

### 在提交前

1. **確保代碼通過 Lint**

   ```bash
   npm run lint
   npm run format  # 自動格式化
   ```

2. **執行測試**

   ```bash
   npm test
   ```

3. **手動測試**

   - 前端：在瀏覽器測試所有改變
   - 後端：用 curl / Postman 測試 API

4. **更新文檔**

   若有 API 或功能改變，更新相關文檔

### 提交到 GitHub

```bash
# 取得最新上游改變
git fetch upstream
git rebase upstream/main

# 推送你的分支
git push origin feature/your-feature-name
```

---

## Pull Request

### 建立 PR

1. 在 GitHub 建立 Pull Request
2. 填寫 PR 模板（若有）
3. 清楚描述改變內容

**PR 標題範例**：

```
feat: 新增交易批量刪除功能
fix: 修復 CSV 匯入中的日期解析錯誤
docs: 更新 API 文檔
```

**PR 描述應包含**：

```markdown
## 描述
簡潔說明你的改變

## 相關 Issue
Closes #42

## 改變清單
- [ ] 新增功能 A
- [ ] 修復 Bug B
- [ ] 更新文檔 C

## 測試情況
- [ ] 前端手動測試通過
- [ ] 後端 API 測試通過
- [ ] 自動測試通過

## 螢幕截圖（若適用）
[上傳或描述改變前後的螢幕截圖]
```

### PR 審查

- 維護者會審查你的代碼
- 可能會要求改進或澄清
- 保持友善和開放的心態
- 通常 1-3 工作日內會有回應

### PR 合併

一旦批准，PR 會被合併到 `main` 分支。

---

## 常見貢獻類型

### 1. 新功能開發

**前端 UI 功能**：

```bash
git checkout -b feature/add-trade-filter
# 在 frontend/src/ 開發...
# 確保與後端 API 正確整合
git push origin feature/add-trade-filter
```

**後端 API 功能**：

```bash
git checkout -b feature/add-wallet-api
# 在 backend/src/ 開發...
# 更新 API 文檔
git push origin feature/add-wallet-api
```

### 2. Bug 修復

```bash
git checkout -b fix/csv-import-date-parsing
# 修復 Bug...
# 新增測試避免回歸
git push origin fix/csv-import-date-parsing
# 建立 PR（引用 Issue）
```

### 3. 文檔改進

```bash
git checkout -b docs/update-api-reference
# 更新 backend/README.md 或相關文檔
git push origin docs/update-api-reference
```

### 4. CSV 格式支援

```bash
git checkout -b feature/support-exchange-csv
# 新增新交易所的 CSV 格式支援
# 更新 spec/sample-csv.md
git push origin feature/support-exchange-csv
```

### 5. Phase 3/4 功能（未來）

- Google Sheets 整合
- Web3 錢包登入
- BTC 本位圖表分析
- 價格 API 整合

在開發這些功能前，請先開 Issue 討論設計方案。

---

## 常見問題

### Q: 如何處理衝突？

**A**:

```bash
# 更新分支
git fetch upstream
git rebase upstream/main

# 解決衝突，然後
git add .
git rebase --continue
git push origin feature/xxx --force
```

### Q: 如何取消提交？

**A**:

```bash
# 撤銷上次提交但保留改變
git reset --soft HEAD~1

# 或完全撤銷
git reset --hard HEAD~1
```

### Q: 如何查看我的改變？

**A**:

```bash
git diff              # 與 staging 比較
git diff --staged     # Staged 改變
git diff upstream/main # 與上游比較
```

---

## 開發工具

### 推薦的編輯器擴展

**VS Code**:

- ESLint
- Prettier
- GitLens
- Thunder Client（測試 API）

### 有用的命令

```bash
# 格式化代碼
npm run format

# 檢查 Lint 錯誤
npm run lint

# 執行測試並看覆蓋率
npm test -- --coverage
```

---

## 重要提醒

### ❌ 不要做的事

1. **不要使用 localStorage**：所有資料由後端管理
2. **不要引入重型框架**：保持輕量，使用原生 JavaScript
3. **不要支援衍生品交易**：僅支援現貨
4. **不要直接修改 storage/ 資料**：僅透過 API 操作

### ✅ 建議做的事

1. **遵循 BTC 本位理念**：所有計算以 BTC 為基準
2. **保持 API 設計一致**：遵循現有的 RESTful 模式
3. **完善錯誤處理**：提供清晰的錯誤訊息
4. **更新文檔**：功能改變時同步更新文檔

---

## 尋求幫助

- 📖 閱讀 [README.md](./README.md) - 專案概覽
- � 閱讀 [SPECIFICATION.md](./spec/SPECIFICATION.md) - 完整規格書
- 🏗️ 閱讀 [STRUCTURE.md](./STRUCTURE.md) - 專案結構
- 🔌 閱讀 [backend/README.md](./backend/README.md) - API 文檔
- 💬 在 GitHub Discussions 提問
- 🐛 開啟 GitHub Issue 報告 Bug

---

## 致謝

感謝所有貢獻者！每一個改進都讓這個專案更好。

特別感謝：

- 所有提交 PR 的開發者
- 回報 Bug 和建議功能的使用者
- 幫助完善文檔的貢獻者

---

**Last Updated**: 2026-01-18  
**版本**: 1.0.0
