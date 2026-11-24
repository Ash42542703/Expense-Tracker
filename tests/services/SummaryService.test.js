import { describe, it, expect } from 'vitest';
import { SummaryService } from '../../src/services/SummaryService.js';
import { Expense } from '../../src/models/Expense.js';
import { Salary } from '../../src/models/Salary.js';

function fakeLedger(entries = []) {
  return {
    findAll() {
      return entries;
    },
  };
}

describe('SummaryService', () => {
  describe('getSummary()', () => {
    it('returns all zeros when there are no expenses or salaries', () => {
      const service = new SummaryService(fakeLedger(), fakeLedger());
      expect(service.getSummary()).toEqual({
        salary: 0,
        basic: 0,
        extra: 0,
        total: 0,
        savings: 0,
      });
    });

    it('adds up all salaries', () => {
      const salaries = fakeLedger([
        new Salary({ amount: 2500, date: '2026-11-01' }),
        new Salary({ amount: 1500.5, date: '2026-11-15' }),
      ]);
      const service = new SummaryService(fakeLedger(), salaries);
      expect(service.getSummary().salary).toBe(4000.5);
    });

    it('adds up basic and extra expenses separately', () => {
      const expenses = fakeLedger([
        new Expense({ description: 'Rent', amount: 1200, category: 'basic', date: '2026-11-01' }),
        new Expense({ description: 'Groceries', amount: 150, category: 'basic', date: '2026-11-03' }),
        new Expense({ description: 'Movie', amount: 15, category: 'extra', date: '2026-11-05' }),
        new Expense({ description: 'Concert', amount: 85, category: 'extra', date: '2026-11-07' }),
      ]);
      const service = new SummaryService(expenses, fakeLedger());
      const summary = service.getSummary();

      expect(summary.basic).toBe(1350);
      expect(summary.extra).toBe(100);
    });

    it('calculates the total of all expenses', () => {
      const expenses = fakeLedger([
        new Expense({ description: 'Rent', amount: 1200, category: 'basic', date: '2026-11-01' }),
        new Expense({ description: 'Movie', amount: 15, category: 'extra', date: '2026-11-05' }),
      ]);
      const service = new SummaryService(expenses, fakeLedger());
      expect(service.getSummary().total).toBe(1215);
    });

    it('calculates savings as total salary minus total expenses', () => {
      const expenses = fakeLedger([
        new Expense({ description: 'Rent', amount: 1200, category: 'basic', date: '2026-11-01' }),
        new Expense({ description: 'Movie', amount: 15, category: 'extra', date: '2026-11-05' }),
      ]);
      const salaries = fakeLedger([new Salary({ amount: 3000, date: '2026-11-01' })]);
      const service = new SummaryService(expenses, salaries);

      expect(service.getSummary()).toEqual({
        salary: 3000,
        basic: 1200,
        extra: 15,
        total: 1215,
        savings: 1785,
      });
    });

    it('returns negative savings when expenses are higher than salary', () => {
      const expenses = fakeLedger([
        new Expense({ description: 'Rent', amount: 1500, category: 'basic', date: '2026-11-01' }),
      ]);
      const salaries = fakeLedger([new Salary({ amount: 1000, date: '2026-11-01' })]);
      const service = new SummaryService(expenses, salaries);

      expect(service.getSummary().savings).toBe(-500);
    });

    it('rounds totals to 2 decimal places', () => {
      const expenses = fakeLedger([
        new Expense({ description: 'Coffee', amount: 0.1, category: 'extra', date: '2026-11-01' }),
        new Expense({ description: 'Tea', amount: 0.2, category: 'extra', date: '2026-11-02' }),
      ]);
      const salaries = fakeLedger([
        new Salary({ amount: 10.1, date: '2026-11-01' }),
        new Salary({ amount: 20.2, date: '2026-11-15' }),
      ]);
      const service = new SummaryService(expenses, salaries);

      expect(service.getSummary()).toEqual({
        salary: 30.3,
        basic: 0,
        extra: 0.3,
        total: 0.3,
        savings: 30,
      });
    });
  });
});
