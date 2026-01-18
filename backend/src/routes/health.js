import express from 'express';

/**
 * 健康檢查路由
 */
function createHealthRouter() {
  const router = express.Router();

  /**
   * GET /api/health - 健康檢查
   */
  router.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  return router;
}

export default createHealthRouter;
