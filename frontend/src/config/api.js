/**
 * API 配置
 * 根據環境選擇 API 基礎 URL
 */

const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000',
  },
  production: {
    baseURL: 'https://btc-dca-tracker-backend.zeabur.app',
  },
};

export const API_BASE_URL =
  API_CONFIG[process.env.NODE_ENV || 'development'].baseURL;

export const API_ENDPOINTS = {
  health: '/api/health',
  trades: (userId) => `/api/trades/${userId}`,
  addTrade: (userId) => `/api/trades/${userId}`,
  updateTrade: (userId, tradeId) => `/api/trades/${userId}/${tradeId}`,
  deleteTrade: (userId, tradeId) => `/api/trades/${userId}/${tradeId}`,
  import: '/api/import',
  export: (userId, format = 'json') => `/api/export/${userId}?format=${format}`,
};
