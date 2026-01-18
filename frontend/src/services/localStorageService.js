/**
 * 本地存儲回退層 - 當後端不可用時使用
 */

export const LocalStorageService = {
  /**
   * 取得用戶交易資料
   */
  getTrades(userId) {
    const data = localStorage.getItem(`trades_${userId}`);
    return data ? JSON.parse(data) : { trades: [], wallets: [] };
  },

  /**
   * 保存用戶交易資料
   */
  saveTrades(userId, data) {
    localStorage.setItem(`trades_${userId}`, JSON.stringify(data));
  },

  /**
   * 新增交易
   */
  addTrade(userId, trade) {
    const data = this.getTrades(userId);
    const newTrade = {
      ...trade,
      id: `trade_${Date.now()}`,
      timestamp: Date.now(),
    };
    data.trades.push(newTrade);
    this.saveTrades(userId, data);
    return newTrade;
  },

  /**
   * 更新交易
   */
  updateTrade(userId, tradeId, updates) {
    const data = this.getTrades(userId);
    const tradeIndex = data.trades.findIndex(t => t.id === tradeId);

    if (tradeIndex === -1) {
      throw new Error('Trade not found');
    }

    data.trades[tradeIndex] = {
      ...data.trades[tradeIndex],
      ...updates,
    };

    this.saveTrades(userId, data);
    return data.trades[tradeIndex];
  },

  /**
   * 刪除交易
   */
  deleteTrade(userId, tradeId) {
    const data = this.getTrades(userId);
    data.trades = data.trades.filter(t => t.id !== tradeId);
    this.saveTrades(userId, data);
  },

  /**
   * 清除用戶資料
   */
  clearTrades(userId) {
    localStorage.removeItem(`trades_${userId}`);
  },
};
