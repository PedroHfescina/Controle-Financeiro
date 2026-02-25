// src/context/FinanceContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

interface Category {
  id: string;
  name: string;
  limit: number;
  spent: number;
}

interface Expense {
  id: string;
  categoryId: string;
  value: number;
  date: string;
}

interface FinanceContextData {
  income: number;
  savingsGoal: number;
  categories: Category[];
  expenses: Expense[];
  setIncome: (value: number) => void;
  setSavingsGoal: (value: number) => void;
  addExpense: (expense: Expense) => void;
  addCategory: (category: Category) => void;
}

export const FinanceContext = createContext({} as FinanceContextData);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [income, setIncome] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };

  return (
    <FinanceContext.Provider
      value={{
        income,
        savingsGoal,
        categories,
        expenses,
        setIncome,
        setSavingsGoal,
        addExpense,
        addCategory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};