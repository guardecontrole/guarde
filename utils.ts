
import { Transaction } from './types';

export const formatCurrency = (value: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatCompactCurrency = (value: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(value);

export const getMonthName = (monthIndex: number, year?: number) => {
  const date = new Date(year || 2024, monthIndex, 1);
  return date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
};

export const calculateMovingAverage = (
  targetYear: number, 
  targetMonth: number, 
  incomes: Transaction[], 
  expenses: Transaction[]
): number => {
    const targetDate = new Date(targetYear, targetMonth, 1);
    const windowStart = new Date(targetDate);
    windowStart.setMonth(windowStart.getMonth() - 11);
    
    const relevantIncomes = incomes.filter(i => {
        const d = new Date(i.year, i.month, 1);
        return d >= windowStart && d <= targetDate && !i.isReserveAdjustment && !i.isTransferFromReserve;
    });
    
    const relevantExpenses = expenses.filter(e => {
        const d = new Date(e.year, e.month, 1);
        return d >= windowStart && d <= targetDate && !e.isReserveAdjustment;
    });
    
    const activeMonths = new Set([...relevantIncomes, ...relevantExpenses].map(t => `${t.year}-${t.month}`));
    const numMonthsWithData = activeMonths.size > 0 ? activeMonths.size : 1;
    
    const totalIncome = relevantIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = relevantExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return (totalIncome - totalExpense) / numMonthsWithData;
};

export const calculateMovingIncomeAverage = (
  targetYear: number, 
  targetMonth: number, 
  incomes: Transaction[], 
  expenses: Transaction[]
): number => {
    const targetDate = new Date(targetYear, targetMonth, 1);
    const windowStart = new Date(targetDate);
    windowStart.setMonth(windowStart.getMonth() - 11);
    
    const relevantIncomes = incomes.filter(i => {
        const d = new Date(i.year, i.month, 1);
        return d >= windowStart && d <= targetDate && !i.isReserveAdjustment && !i.isTransferFromReserve;
    });
    
    const relevantExpenses = expenses.filter(e => {
        const d = new Date(e.year, e.month, 1);
        return d >= windowStart && d <= targetDate && !e.isReserveAdjustment;
    });
    
    const activeMonths = new Set([...relevantIncomes, ...relevantExpenses].map(t => `${t.year}-${t.month}`));
    const numMonthsWithData = activeMonths.size > 0 ? activeMonths.size : 1;
    
    const totalIncome = relevantIncomes.reduce((sum, i) => sum + i.amount, 0);
    
    return totalIncome / numMonthsWithData;
};
