/**
 * @param {number} value
 * @returns {number}
 */
function round(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
export class SummaryService {
  /**
   * @param {import('../repositories/Ledger.js').Ledger} expenses - Ledger of expenses.
   * @param {import('../repositories/Ledger.js').Ledger} salaries - Ledger of salaries.
   */
  constructor(expenses, salaries) {
    this.expenses = expenses;
    this.salaries = salaries;
  }

  /**
   * Returns the summary totals, each rounded to 2 decimal places.
   *
   * @returns {{ salary: number, basic: number, extra: number, total: number, savings: number }}
   */
  getSummary() {
    const allSalaries = this.salaries.findAll();
    const allExpenses = this.expenses.findAll();
    const salarytot = allSalaries.reduce((sum, salary) => sum + salary.amount, 0);
    let basictot = 0;
    let extratot = 0;
    allExpenses.forEach((expense) => {
      if (expense.category === 'basic') {
        basictot += expense.amount;
      } else if (expense.category === 'extra') {
        extratot += expense.amount;
      }
    });
    const totalexp = basictot + extratot;
    const savings = salarytot - totalexp;
    return { salary: round(salarytot), basic: round(basictot), extra: round(extratot), total: round(totalexp), savings: round(savings) };
  }
}