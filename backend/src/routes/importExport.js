import express from 'express';

/**
 * 匯入/匯出路由
 * POST /api/import - 匯入 CSV 或 JSON
 * GET  /api/export/:userId - 匯出用戶資料（JSON 或 CSV）
 */
function createImportExportRouter(storageService) {
  const router = express.Router();

  /**
   * 匯入交易（從 CSV 或 JSON）
   * POST /api/import
   * Body: { userId: string, trades: Array<Trade> }
   */
  router.post('/import', async (req, res) => {
    try {
      const { userId, trades } = req.body;

      if (!userId || !Array.isArray(trades) || trades.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Missing userId or trades array',
        });
      }

      const imported = await storageService.importTrades(userId, trades);

      res.status(201).json({
        success: true,
        message: `${imported.length} trades imported`,
        data: imported,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * 匯出用戶資料
   * GET /api/export/:userId?format=json|csv
   */
  router.get('/export/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { format = 'json' } = req.query;

      const userData = await storageService.readUserData(userId);

      if (format === 'csv') {
        // CSV 格式匯出
        const csv = convertTradesToCSV(userData.trades);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="trades_${userId}.csv"`);
        return res.send(csv);
      }

      // JSON 格式匯出（預設）
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="trades_${userId}.json"`);
      res.send(JSON.stringify(userData, null, 2));
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  return router;
}

/**
 * 將交易陣列轉換為 CSV 格式
 * @param {Array<Object>} trades - 交易陣列
 * @returns {string} CSV 內容
 */
function convertTradesToCSV(trades) {
  if (trades.length === 0) {
    return 'date,exchange,pair,side,baseAsset,quoteAsset,baseAmount,quoteAmount,price,feeAsset,feeAmount,notes\n';
  }

  // CSV 表頭
  const headers = [
    'date',
    'exchange',
    'pair',
    'side',
    'baseAsset',
    'quoteAsset',
    'baseAmount',
    'quoteAmount',
    'price',
    'feeAsset',
    'feeAmount',
    'notes',
  ];

  // 資料列
  const rows = trades.map(trade => [
    trade.date || '',
    trade.exchange || '',
    trade.pair || '',
    trade.side || '',
    trade.baseAsset || '',
    trade.quoteAsset || '',
    trade.baseAmount || '',
    trade.quoteAmount || '',
    trade.price || '',
    trade.feeAsset || '',
    trade.feeAmount || '',
    (trade.notes || '').replace(/"/g, '""'), // 逃脫雙引號
  ]);

  // 組合 CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row
        .map(cell => {
          const str = String(cell);
          // 如果含逗號、雙引號或換行，需用雙引號包含
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(','),
    ),
  ].join('\n');

  return csvContent;
}

export default createImportExportRouter;
