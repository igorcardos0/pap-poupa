import { createContext, useContext, useEffect, useState } from "react";

export type TransactionCategory = "fixa" | "variavel" | "diaria" | "extraordinaria";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: TransactionCategory;
  tags?: string[];
  isRecurring?: boolean;
};

export type Income = Transaction & {
  type: "income";
};

export type Expense = Transaction & {
  type: "expense";
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
};

export type Investment = {
  id: string;
  type: "renda-fixa" | "acoes" | "fiis" | "cripto";
  name: string;
  currentValue: number;
};

export type Debt = {
  id: string;
  name: string;
  totalAmount: number;
  remainingInstallments: number;
  installmentValue: number;
};

export type MonthlyStats = {
  totalIncome: number;
  totalExpense: number;
  todayExpense: number;
  monthlyDebts: number;
  monthlyGoals: number;
  availableBalance: number;
  projectedEndBalance: number;
};

type FinanceContextType = {
  incomes: Income[];
  expenses: Expense[];
  goals: Goal[];
  investments: Investment[];
  debts: Debt[];
  addIncome: (income: Omit<Income, "id" | "type">) => void;
  addExpense: (expense: Omit<Expense, "id" | "type">) => void;
  addGoal: (goal: Omit<Goal, "id" | "currentAmount">) => void;
  addToGoal: (goalId: string, amount: number) => void;
  addInvestment: (investment: Omit<Investment, "id">) => void;
  addDebt: (debt: Omit<Debt, "id">) => void;
  deleteIncome: (id: string) => void;
  deleteExpense: (id: string) => void;
  deleteGoal: (id: string) => void;
  deleteInvestment: (id: string) => void;
  deleteDebt: (id: string) => void;
  getMonthlyStats: () => MonthlyStats;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [incomes, setIncomes] = useState<Income[]>(() => {
    const stored = localStorage.getItem("incomes");
    return stored ? JSON.parse(stored) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const stored = localStorage.getItem("expenses");
    return stored ? JSON.parse(stored) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = localStorage.getItem("goals");
    return stored ? JSON.parse(stored) : [];
  });

  const [investments, setInvestments] = useState<Investment[]>(() => {
    const stored = localStorage.getItem("investments");
    return stored ? JSON.parse(stored) : [];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const stored = localStorage.getItem("debts");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("investments", JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  const addIncome = (income: Omit<Income, "id" | "type">) => {
    const newIncome: Income = {
      ...income,
      id: Date.now().toString(),
      type: "income",
    };
    setIncomes((prev) => [...prev, newIncome]);
  };

  const addExpense = (expense: Omit<Expense, "id" | "type">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      type: "expense",
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const addGoal = (goal: Omit<Goal, "id" | "currentAmount">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      currentAmount: 0,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const addToGoal = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      )
    );
  };

  const addInvestment = (investment: Omit<Investment, "id">) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
    };
    setInvestments((prev) => [...prev, newInvestment]);
  };

  const addDebt = (debt: Omit<Debt, "id">) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
    };
    setDebts((prev) => [...prev, newDebt]);
  };

  const deleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteInvestment = (id: string) => {
    setInvestments((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((item) => item.id !== id));
  };

  const getMonthlyStats = (): MonthlyStats => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.toISOString().split("T")[0];

    // Receitas do mês
    const monthlyIncomes = incomes.filter((income) => {
      const date = new Date(income.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const totalIncome = monthlyIncomes.reduce((sum, income) => sum + income.amount, 0);

    // Despesas do mês
    const monthlyExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const totalExpense = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Gastos de hoje
    const todayExpenses = expenses.filter((expense) => expense.date === today);
    const todayExpense = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Dívidas do mês (soma das parcelas mensais)
    const monthlyDebts = debts.reduce((sum, debt) => sum + debt.installmentValue, 0);

    // Dinheiro alocado para cofres (assumindo que isso é parte das despesas/planejamento mensal)
    const monthlyGoals = goals.reduce((sum, goal) => {
      // Calcula quanto falta para a meta e divide pelos meses restantes
      const remaining = goal.targetAmount - goal.currentAmount;
      const targetDate = new Date(goal.targetDate);
      const monthsRemaining = Math.max(
        1,
        (targetDate.getFullYear() - currentYear) * 12 + targetDate.getMonth() - currentMonth
      );
      return sum + remaining / monthsRemaining;
    }, 0);

    // Saldo disponível (receita - despesas já realizadas - dívidas do mês)
    const availableBalance = totalIncome - totalExpense - monthlyDebts;

    // Projeção do saldo no final do mês (considerando que não haverá mais gastos)
    const projectedEndBalance = availableBalance - monthlyGoals;

    return {
      totalIncome,
      totalExpense,
      todayExpense,
      monthlyDebts,
      monthlyGoals,
      availableBalance,
      projectedEndBalance,
    };
  };

  return (
    <FinanceContext.Provider
      value={{
        incomes,
        expenses,
        goals,
        investments,
        debts,
        addIncome,
        addExpense,
        addGoal,
        addToGoal,
        addInvestment,
        addDebt,
        deleteIncome,
        deleteExpense,
        deleteGoal,
        deleteInvestment,
        deleteDebt,
        getMonthlyStats,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
