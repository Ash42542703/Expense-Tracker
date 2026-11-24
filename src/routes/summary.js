import { Router } from 'express';

/**
 * Creates the route for /api/summary.
 *
 * @param {import('../services/SummaryService.js').SummaryService} summaryService
 * @returns {Router}
 */
// TODO: Remove this line once summaryService is used below.
export function summaryRoutes(summaryService) {
  const router = Router();

  router.get('/', (req, res) => {
    res.status(200).json(summaryService.getSummary());
  });

  return router;
}