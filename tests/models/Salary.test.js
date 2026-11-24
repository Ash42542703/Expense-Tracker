import { describe, it, expect, beforeEach } from 'vitest';
import { Salary } from '../../src/models/Salary.js';

describe('Salary', () => {
  let validSalary;

  beforeEach(() => {
    validSalary = new Salary({id: 'sal-1', amount: 3000, date: '2026-11-01'});
  });

  it('stores the amount and pay date', () => {
    expect(validSalary.id).toBe('sal-1');
    expect(validSalary.amount).toBe(3000);
    expect(validSalary.date).toBe('2026-11-01');
  });

  it('rounds the amount to 2 decimal places', () => {
    const salary = new Salary({amount: 2500.555, date: '2026-11-01'});
    expect(salary.amount).toBe(2500.55);
  });

  it('rejects an amount of zero', () => {
    const salary = new Salary({amount: 0, date: '2026-11-01'});
    expect(salary.validate().length).toBeGreaterThan(0);
  });

  it('rejects a negative amount', () => {
    const salary = new Salary({amount: -500, date: '2026-11-01'});
    expect(salary.validate().length).toBeGreaterThan(0);
  });

  it('rejects a pay date in the wrong format', () => {
    const salary = new Salary({amount: 3000, date: '11-01-2026'});
    expect(salary.validate().length).toBeGreaterThan(0);
  });

  it('rejects a pay date that does not exist', () => {
    const salary = new Salary({amount: 3000, date: '2026-02-30'});
    expect(salary.validate().length).toBeGreaterThan(0);
  });
});