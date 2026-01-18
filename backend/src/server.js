import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import FileStorageService from './services/fileStorageService.js';
import createTradesRouter from './routes/trades.js';
import createImportExportRouter from './routes/importExport.js';
import createHealthRouter from './routes/health.js';
import {
  corsMiddleware,
  requestLoggerMiddleware,
  errorHandlerMiddleware,
} from './middleware/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;
const STORAGE_PATH = process.env.STORAGE_PATH || './storage';

// 中間件
app.use(express.json());
app.use(requestLoggerMiddleware);
app.use(corsMiddleware);

// 初始化存儲服務
const storageService = new FileStorageService(STORAGE_PATH);

// 路由
app.use('/api', createHealthRouter());
app.use('/api/trades', createTradesRouter(storageService));
app.use('/api', createImportExportRouter(storageService));

// 錯誤處理
app.use(errorHandlerMiddleware);

// 啟動服務器
async function start() {
  try {
    // 初始化存儲
    await storageService.initialize();

    app.listen(PORT, () => {
      console.log(`\n🚀 BTC DCA Tracker Backend`);
      console.log(`📍 Server running at http://localhost:${PORT}`);
      console.log(`📦 Storage path: ${path.resolve(STORAGE_PATH)}`);
      console.log(`🌍 CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5500'}`);
      console.log(`\n✓ Ready to accept requests\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
