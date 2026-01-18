import express from 'express';

/**
 * 交易路由 API
 * GET  /api/trades/:userId - 取得用戶所有交易
 * POST /api/trades/:userId - 新增交易
 * PUT  /api/trades/:userId/:tradeId - 更新交易
 * DELETE /api/trades/:userId/:tradeId - 刪除交易
 */
function createTradesRouter(storageService) {
  const router = express.Router();

  /**
   * 取得用戶所有交易
   * GET /api/trades/:userId
   */
  router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const userData = await storageService.readUserData(userId);
      
      res.json({
        success: true,
        data: userData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * 新增交易
   * POST /api/trades/:userId
   */
  router.post('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const trade = req.body;

      // 基礎驗證
      if (!trade.date || !trade.pair || !trade.side) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: date, pair, side',
        });
      }

      const newTrade = await storageService.addTrade(userId, trade);

      res.status(201).json({
        success: true,
        data: newTrade,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * 更新交易
   * PUT /api/trades/:userId/:tradeId
   */
  router.put('/:userId/:tradeId', async (req, res) => {
    try {
      const { userId, tradeId } = req.params;
      const updates = req.body;

      const updatedTrade = await storageService.updateTrade(userId, tradeId, updates);

      res.json({
        success: true,
        data: updatedTrade,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * 刪除交易
   * DELETE /api/trades/:userId/:tradeId
   */
  router.delete('/:userId/:tradeId', async (req, res) => {
    try {
      const { userId, tradeId } = req.params;

      await storageService.deleteTrade(userId, tradeId);

      res.json({
        success: true,
        message: 'Trade deleted',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  });

  return router;
}

export default createTradesRouter;
