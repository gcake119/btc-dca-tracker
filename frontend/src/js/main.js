/**
 * 主應用程式入點
 */

import { SystemAPI } from './services/apiClient.js';
import { LocalStorageService } from './services/localStorageService.js';

/**
 * 應用程式初始化
 */
async function initializeApp() {
  console.log('🚀 BTC DCA Tracker 初始化...');

  try {
    // 檢查後端連接
    const health = await SystemAPI.health();
    console.log('✓ 後端已連接:', health);
    useBackendMode();
  } catch (error) {
    console.error('✗ 後端連接失敗:', error);
    console.log('💾 降級至本地存儲模式...');
    useLocalStorageMode();
  }
}

/**
 * 後端模式 - 使用 API
 */
function useBackendMode() {
  console.log('📡 使用後端 API 模式');
  // TODO: 實作後端相關邏輯
}

/**
 * 本地存儲模式 - 使用 localStorage
 */
function useLocalStorageMode() {
  console.log('🔄 使用本地存儲模式');
  // TODO: 實作本地存儲相關邏輯
}

// 應用程式啟動
document.addEventListener('DOMContentLoaded', initializeApp);
