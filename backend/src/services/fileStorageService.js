import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 文件存儲服務 - 處理 JSON/CSV 文件的讀寫
 * 本機開發：使用本地檔案系統
 * 線上部署：Zeabur 會掛載持久化存儲卷
 */
class FileStorageService {
  constructor(storagePath = './storage') {
    this.storagePath = path.resolve(storagePath);
  }

  /**
   * 初始化存儲目錄
   */
  async initialize() {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
      console.log(`✓ Storage directory ready: ${this.storagePath}`);
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw error;
    }
  }

  /**
   * 取得用戶資料檔案路徑
   * @param {string} userId - 用戶 ID（email 或 wallet address）
   * @returns {string} 檔案路徑
   */
  getUserFilePath(userId) {
    const sanitizedId = userId.replace(/[^a-zA-Z0-9._-]/g, '_');
    return path.join(this.storagePath, `${sanitizedId}.json`);
  }

  /**
   * 讀取用戶資料
   * @param {string} userId - 用戶 ID
   * @returns {Promise<Object>} 交易資料
   */
  async readUserData(userId) {
    const filePath = this.getUserFilePath(userId);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 檔案不存在，回傳預設結構
        return this.getDefaultUserData();
      }
      throw error;
    }
  }

  /**
   * 保存用戶資料
   * @param {string} userId - 用戶 ID
   * @param {Object} data - 交易資料
   * @returns {Promise<void>}
   */
  async saveUserData(userId, data) {
    const filePath = this.getUserFilePath(userId);
    const jsonContent = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonContent, 'utf-8');
  }

  /**
   * 新增交易記錄
   * @param {string} userId - 用戶 ID
   * @param {Object} trade - 交易物件
   * @returns {Promise<Object>} 添加後的交易（含 id）
   */
  async addTrade(userId, trade) {
    const userData = await this.readUserData(userId);
    
    // 生成交易 ID
    const tradeWithId = {
      id: trade.id || `trade_${Date.now()}`,
      ...trade,
      timestamp: trade.timestamp || Date.now(),
    };

    userData.trades.push(tradeWithId);
    await this.saveUserData(userId, userData);
    
    return tradeWithId;
  }

  /**
   * 更新交易記錄
   * @param {string} userId - 用戶 ID
   * @param {string} tradeId - 交易 ID
   * @param {Object} updates - 更新欄位
   * @returns {Promise<Object>} 更新後的交易
   */
  async updateTrade(userId, tradeId, updates) {
    const userData = await this.readUserData(userId);
    const tradeIndex = userData.trades.findIndex(t => t.id === tradeId);

    if (tradeIndex === -1) {
      const error = new Error('Trade not found');
      error.statusCode = 404;
      throw error;
    }

    userData.trades[tradeIndex] = {
      ...userData.trades[tradeIndex],
      ...updates,
      id: tradeId, // 確保 ID 不變
    };

    await this.saveUserData(userId, userData);
    return userData.trades[tradeIndex];
  }

  /**
   * 刪除交易記錄
   * @param {string} userId - 用戶 ID
   * @param {string} tradeId - 交易 ID
   * @returns {Promise<void>}
   */
  async deleteTrade(userId, tradeId) {
    const userData = await this.readUserData(userId);
    const initialLength = userData.trades.length;

    userData.trades = userData.trades.filter(t => t.id !== tradeId);

    if (userData.trades.length === initialLength) {
      const error = new Error('Trade not found');
      error.statusCode = 404;
      throw error;
    }

    await this.saveUserData(userId, userData);
  }

  /**
   * 批量導入交易（從 CSV 轉換後的陣列）
   * @param {string} userId - 用戶 ID
   * @param {Array<Object>} trades - 交易陣列
   * @returns {Promise<Array<Object>>} 導入的交易清單（含 ID）
   */
  async importTrades(userId, trades) {
    const userData = await this.readUserData(userId);

    const importedTrades = trades.map(trade => ({
      id: trade.id || `trade_${Date.now()}_${uuidv4()}`,
      ...trade,
      timestamp: trade.timestamp || Date.now(),
    }));

    userData.trades.push(...importedTrades);
    await this.saveUserData(userId, userData);

    return importedTrades;
  }

  /**
   * 取得預設用戶資料結構
   * @returns {Object} 預設資料
   */
  getDefaultUserData() {
    return {
      metadata: {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
      },
      trades: [],
      wallets: [],
    };
  }
}

export default FileStorageService;
