import { Router } from 'express';
import { Salary } from '../models/Salary.js';

/**
 * Creates the routes for /api/salaries.
 * Each salary is { id, date, amount }.
 *
 * @param {import('../repositories/Ledger.js').Ledger} ledger - Ledger that stores salaries.
 * @returns {Router}
 */
export function salaryRoutes(ledger) {
  const router = Router();

  router.get('/', (req, res) => {
    res.json(ledger.findAll());
  });

  router.get('/:id', (req, res) => {
    const salary = ledger.findById(req.params.id);
    if (!salary) {
      res.status(404).json({ error: 'Salary not found' });
      return;
    }
    res.json(salary);
  });

  router.post('/', (req, res) => {
    const salary = toSalary(req.body);
    const saved = ledger.add(salary);
    res.status(201).json(saved);
  });

  router.put('/:id', (req, res) => {
    const salary = toSalary({ ...req.body, id: req.params.id });
    const updated = ledger.update(req.params.id, salary);
    if (!updated) {
      res.status(404).json({ error: 'Salary not found' });
      return;
    }
    res.json(updated);
  });

  router.delete('/:id', (req, res) => {
    const deleted = ledger.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Salary not found' });
      return;
    }
    res.status(204).end();
  });

  return router;
}

/**
 * @param {object} bod
 * @returns {Salary}
 */
function toSalary(body = {}) {
  return new Salary({
    id: body.id,
    date: body.date,
    amount: body.amount,
  });
}
