/**
 * API 客户端 - 與後端通訊
 */

import { API_BASE_URL, API_ENDPOINTS } from '../config/api.js';

/**
 * 通用 API 請求函式
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    return response;
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
}

/**
 * 交易 API
 */
export const TradeAPI = {
  /**
   * 取得用戶所有交易
   */
  async getTrades(userId) {
    const response = await fetchAPI(API_ENDPOINTS.trades(userId));
    return response.data;
  },

  /**
   * 新增交易
   */
  async addTrade(userId, trade) {
    const response = await fetchAPI(API_ENDPOINTS.addTrade(userId), {
      method: 'POST',
      body: JSON.stringify(trade),
    });
    return response.data;
  },

  /**
   * 更新交易
   */
  async updateTrade(userId, tradeId, updates) {
    const response = await fetchAPI(
      API_ENDPOINTS.updateTrade(userId, tradeId),
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      },
    );
    return response.data;
  },

  /**
   * 刪除交易
   */
  async deleteTrade(userId, tradeId) {
    await fetchAPI(API_ENDPOINTS.deleteTrade(userId, tradeId), {
      method: 'DELETE',
    });
  },

  /**
   * 批量匯入交易
   */
  async importTrades(userId, trades) {
    const response = await fetchAPI(API_ENDPOINTS.import, {
      method: 'POST',
      body: JSON.stringify({ userId, trades }),
    });
    return response.data;
  },

  /**
   * 匯出交易
   */
  async exportTrades(userId, format = 'json') {
    const response = await fetchAPI(API_ENDPOINTS.export(userId, format));

    if (format === 'csv') {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trades_${userId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      return response;
    }
  },
};

/**
 * 系統 API
 */
export const SystemAPI = {
  /**
   * 健康檢查
   */
  async health() {
    return fetchAPI(API_ENDPOINTS.health);
  },
};
