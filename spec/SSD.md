# btc-dca-tracker 系統規格書（SSD）

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
- 首次註冊須 Google OAuth，取得 Google 帳號與 Sheets 權限。
- Google 試算表內建 user_profile 表：紀錄 google_uid、web3 address 清單。
- 用戶可綁定/解除 Web3 錢包（EVM/Cardano），以簽名驗證地址所有權。
- 登入可選 Google or Web3 錢包（由前端將地址與 user_profile 關聯）。

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
- 靜態網站部署（GitHub Pages、Zeabur 皆可）
- 試算表為唯一資料庫，前端僅管理當前 session access token

---

## 5. 資料結構（Google Sheets）

- `user_profile` sheet:
  - google_uid
  - primary_email
  - wallet_addresses (JSON)
  - sheet_id
  - 顯示偏好等其他欄位

- `trades` sheet:
  - date、exchange_or_source、pair、side、base_asset、quote_asset、base_amount、quote_amount、fee_asset、fee_amount、note...

- `prices` sheet（可選）、用於快照歷史價格或直接前端即時查 API

---

## 6. 不屬於本版本的內容（Out of Scope）

- 不支援合約／槓桿／保證金交易與任何衍生品。
- 不自動處理複雜DeFi收益產品，僅現貨DCA與持倉。

---

## 7. 安全與部署須知

- Google OAuth 及 Sheets API金鑰屬公開用途、嚴格設限回調網域。
- Web3 登入僅在前端做簽名驗證，不保存私鑰。
- 完全無服務器，所有記帳與敏感資訊均儲存於用戶 Google 試算表，由用戶自身控制。

---
