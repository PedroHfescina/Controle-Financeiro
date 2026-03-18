import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  limit as fsLimit,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useAuth } from "./AuthContext";

export type CategoryName =
  | "Mercado"
  | "Transporte"
  | "Lazer"
  | "Alimentação"
  | "Casa"
  | "Combustível"
  | "Assinaturas"
  | "Outros";

export type CategoryLimits = Partial<Record<CategoryName, number>>;

export interface UserPlan {
  income: number;
  savingsGoal: number;
  selectedCategories: CategoryName[];
  categoryLimits: CategoryLimits;
  setupCompleted: boolean;
}

export interface Expense {
  id: string;
  title: string;
  category: CategoryName;
  value: number;
  note?: string;
  createdAt?: Timestamp | null;
}

export type CategoryStatus = "safe" | "warning" | "danger" | "neutral";

export interface CategorySummary {
  id: string;
  name: CategoryName;
  spent: number;
  limit: number;
  progress: number;
  remaining: number;
  status: CategoryStatus;
  hasLimit: boolean;
}

interface SavePlanPayload {
  income: number;
  savingsGoal: number;
  selectedCategories: CategoryName[];
  categoryLimits: CategoryLimits;
}

interface FinanceContextData {
  loading: boolean;
  isPlanReady: boolean;

  plan: UserPlan;

  income: number;
  savingsGoal: number;
  selectedCategories: CategoryName[];
  categoryLimits: CategoryLimits;
  categories: CategorySummary[];

  setIncomeLocal: (value: number) => void;
  setGoalLocal: (value: number) => void;
  toggleCategoryLocal: (name: CategoryName) => void;
  setCategoryLimitLocal: (name: CategoryName, value: number) => void;

  savePlan: (payload: SavePlanPayload) => Promise<void>;
  updateCategoryLimit: (name: CategoryName, value: number) => Promise<void>;
  updateCategoryLimits: (payload: CategoryLimits) => Promise<void>;

  expenses: Expense[];
  addExpense: (payload: Omit<Expense, "id" | "createdAt">) => Promise<void>;

  getCategoryLimit: (name: CategoryName) => number;
  categoryHasLimit: (name: CategoryName) => boolean;
}

const ALL_CATEGORIES: CategoryName[] = [
  "Mercado",
  "Transporte",
  "Lazer",
  "Alimentação",
  "Casa",
  "Combustível",
  "Assinaturas",
  "Outros",
];

const defaultPlan: UserPlan = {
  income: 0,
  savingsGoal: 0,
  selectedCategories: [],
  categoryLimits: {},
  setupCompleted: false,
};

export const FinanceContext = createContext({} as FinanceContextData);

export function useFinance() {
  return useContext(FinanceContext);
}

function normalizeCategoryName(value: unknown): CategoryName {
  if (typeof value !== "string") return "Outros";

  const normalized = value.trim().toLowerCase();

  const map: Record<string, CategoryName> = {
    mercado: "Mercado",
    transporte: "Transporte",
    lazer: "Lazer",
    alimentação: "Alimentação",
    alimentacao: "Alimentação",
    casa: "Casa",
    combustível: "Combustível",
    combustivel: "Combustível",
    assinaturas: "Assinaturas",
    outros: "Outros",
  };

  return map[normalized] ?? "Outros";
}

function normalizeCategoryLimits(value: unknown): CategoryLimits {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const entries = Object.entries(value as Record<string, unknown>);
  const normalized: CategoryLimits = {};

  for (const [key, rawValue] of entries) {
    const categoryName = normalizeCategoryName(key);
    const limitValue = Number(rawValue);

    normalized[categoryName] =
      Number.isFinite(limitValue) && limitValue > 0 ? limitValue : 0;
  }

  return normalized;
}

function hasMeaningfulPlanData(
  income: number,
  selectedCategories: CategoryName[],
  categoryLimits: CategoryLimits
) {
  const hasIncome = income > 0;
  const hasCategories = selectedCategories.length > 0;
  const hasLimits = Object.values(categoryLimits).some(
    (value) => Number(value) > 0
  );

  return hasIncome || hasCategories || hasLimits;
}

function getCategoryStatus(
  progress: number,
  hasLimit: boolean
): CategoryStatus {
  if (!hasLimit) return "neutral";
  if (progress >= 90) return "danger";
  if (progress >= 70) return "warning";
  return "safe";
}

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isPlanReady, setIsPlanReady] = useState(false);
  const [plan, setPlan] = useState<UserPlan>(defaultPlan);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    let unsubUser: Unsubscribe | null = null;
    let unsubExp: Unsubscribe | null = null;

    const cleanupSubs = () => {
      if (unsubUser) {
        unsubUser();
        unsubUser = null;
      }

      if (unsubExp) {
        unsubExp();
        unsubExp = null;
      }
    };

    if (authLoading) {
      setLoading(true);
      setIsPlanReady(false);
      return cleanupSubs;
    }

    cleanupSubs();

    if (!user) {
      setPlan(defaultPlan);
      setExpenses([]);
      setLoading(false);
      setIsPlanReady(false);
      return cleanupSubs;
    }

    setExpenses([]);
    setLoading(true);
    setIsPlanReady(false);

    const userRef = doc(db, "users", user.uid);

    unsubUser = onSnapshot(
      userRef,
      async (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<UserPlan> & {
            categoryLimits?: unknown;
          };

          const income = Number(data.income ?? 0);
          const savingsGoal = Number(data.savingsGoal ?? 0);
          const selectedCategories = Array.isArray(data.selectedCategories)
            ? data.selectedCategories.map(normalizeCategoryName)
            : [];
          const categoryLimits = normalizeCategoryLimits(data.categoryLimits);

          const inferredSetupCompleted =
            Boolean(data.setupCompleted ?? false) ||
            hasMeaningfulPlanData(income, selectedCategories, categoryLimits);

          setPlan({
            income,
            savingsGoal,
            selectedCategories,
            categoryLimits,
            setupCompleted: inferredSetupCompleted,
          });

          if (!data.setupCompleted && inferredSetupCompleted) {
            try {
              await setDoc(
                userRef,
                {
                  setupCompleted: true,
                  updatedAt: serverTimestamp(),
                },
                { merge: true }
              );
            } catch (error) {
              console.error("Erro ao corrigir setupCompleted:", error);
            }
          }
        } else {
          try {
            await setDoc(
              userRef,
              {
                ...defaultPlan,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          } catch (error) {
            console.error("Erro ao criar plano inicial:", error);
          }

          setPlan(defaultPlan);
        }

        setIsPlanReady(true);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao escutar plano do usuário:", error);
        setPlan(defaultPlan);
        setIsPlanReady(true);
        setLoading(false);
      }
    );

    const expCol = collection(db, "users", user.uid, "expenses");
    const expensesQuery = query(
      expCol,
      orderBy("createdAt", "desc"),
      fsLimit(50)
    );

    unsubExp = onSnapshot(
      expensesQuery,
      (snap) => {
        const rows: Expense[] = snap.docs.map((expenseDoc) => {
          const data = expenseDoc.data();

          return {
            id: expenseDoc.id,
            title: String(data.title ?? "Sem descrição"),
            category: normalizeCategoryName(data.category),
            value: Number(data.value ?? 0),
            note: data.note ? String(data.note) : "",
            createdAt: (data.createdAt as Timestamp) ?? null,
          };
        });

        setExpenses(rows);
      },
      (error) => {
        console.error("Erro ao escutar despesas:", error);
      }
    );

    return cleanupSubs;
  }, [user?.uid, authLoading]);

  const setIncomeLocal = (value: number) => {
    setPlan((prev) => ({
      ...prev,
      income: Number(value) || 0,
    }));
  };

  const setGoalLocal = (value: number) => {
    setPlan((prev) => ({
      ...prev,
      savingsGoal: Number(value) || 0,
    }));
  };

  const toggleCategoryLocal = (name: CategoryName) => {
    setPlan((prev) => {
      const exists = prev.selectedCategories.includes(name);

      const nextSelectedCategories = exists
        ? prev.selectedCategories.filter((category) => category !== name)
        : [...prev.selectedCategories, name];

      const nextCategoryLimits = { ...prev.categoryLimits };

      if (!exists && typeof nextCategoryLimits[name] !== "number") {
        nextCategoryLimits[name] = 0;
      }

      return {
        ...prev,
        selectedCategories: nextSelectedCategories,
        categoryLimits: nextCategoryLimits,
      };
    });
  };

  const setCategoryLimitLocal = (name: CategoryName, value: number) => {
    setPlan((prev) => ({
      ...prev,
      categoryLimits: {
        ...prev.categoryLimits,
        [name]: Number(value) > 0 ? Number(value) : 0,
      },
    }));
  };

  const savePlan: FinanceContextData["savePlan"] = async ({
    income,
    savingsGoal,
    selectedCategories,
    categoryLimits,
  }) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    const userRef = doc(db, "users", currentUser.uid);
    const normalizedCategories = selectedCategories.map(normalizeCategoryName);

    const normalizedLimits = normalizedCategories.reduce((acc, categoryName) => {
      const rawValue = Number(categoryLimits?.[categoryName] ?? 0);
      acc[categoryName] = rawValue > 0 ? rawValue : 0;
      return acc;
    }, {} as CategoryLimits);

    await setDoc(
      userRef,
      {
        income: Number(income) || 0,
        savingsGoal: Number(savingsGoal) || 0,
        selectedCategories: normalizedCategories,
        categoryLimits: normalizedLimits,
        setupCompleted: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setPlan((prev) => ({
      ...prev,
      income: Number(income) || 0,
      savingsGoal: Number(savingsGoal) || 0,
      selectedCategories: normalizedCategories,
      categoryLimits: normalizedLimits,
      setupCompleted: true,
    }));

    setIsPlanReady(true);
  };

  const updateCategoryLimit: FinanceContextData["updateCategoryLimit"] = async (
    name,
    value
  ) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    const normalizedName = normalizeCategoryName(name);
    const safeValue = Number(value) > 0 ? Number(value) : 0;
    const userRef = doc(db, "users", currentUser.uid);

    await setDoc(
      userRef,
      {
        categoryLimits: {
          [normalizedName]: safeValue,
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setPlan((prev) => ({
      ...prev,
      categoryLimits: {
        ...prev.categoryLimits,
        [normalizedName]: safeValue,
      },
    }));
  };

  const updateCategoryLimits: FinanceContextData["updateCategoryLimits"] = async (
    payload
  ) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    const userRef = doc(db, "users", currentUser.uid);

    const normalizedLimits = Object.entries(payload).reduce((acc, [key, value]) => {
      const normalizedName = normalizeCategoryName(key);
      const safeValue = Number(value) > 0 ? Number(value) : 0;
      acc[normalizedName] = safeValue;
      return acc;
    }, {} as CategoryLimits);

    await setDoc(
      userRef,
      {
        categoryLimits: normalizedLimits,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setPlan((prev) => ({
      ...prev,
      categoryLimits: {
        ...prev.categoryLimits,
        ...normalizedLimits,
      },
    }));
  };

  const addExpense: FinanceContextData["addExpense"] = async (payload) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    const expCol = collection(db, "users", currentUser.uid, "expenses");

    await addDoc(expCol, {
      title: payload.title?.trim() ? payload.title.trim() : "Sem descrição",
      category: normalizeCategoryName(payload.category),
      value: Number(payload.value ?? 0),
      note: payload.note?.trim() ? payload.note.trim() : "",
      createdAt: serverTimestamp(),
    });
  };

  const getCategoryLimit = (name: CategoryName) => {
    return Number(plan.categoryLimits?.[name] ?? 0);
  };

  const categoryHasLimit = (name: CategoryName) => {
    return getCategoryLimit(name) > 0;
  };

  const categories = useMemo<CategorySummary[]>(() => {
    const baseCategories =
      plan.selectedCategories.length > 0
        ? plan.selectedCategories
        : ALL_CATEGORIES;

    return baseCategories.map((categoryName) => {
      const spent = expenses
        .filter((expense) => expense.category === categoryName)
        .reduce((total, expense) => total + (Number(expense.value) || 0), 0);

      const limit = Number(plan.categoryLimits?.[categoryName] ?? 0);
      const hasLimit = limit > 0;
      const progress = hasLimit ? Math.min(100, (spent / limit) * 100) : 0;
      const remaining = hasLimit ? Math.max(0, limit - spent) : 0;
      const status = getCategoryStatus(progress, hasLimit);

      return {
        id: categoryName,
        name: categoryName,
        spent,
        limit,
        progress,
        remaining,
        status,
        hasLimit,
      };
    });
  }, [plan.selectedCategories, plan.categoryLimits, expenses]);

  const value = useMemo<FinanceContextData>(
    () => ({
      loading,
      isPlanReady,
      plan,

      income: plan.income,
      savingsGoal: plan.savingsGoal,
      selectedCategories: plan.selectedCategories,
      categoryLimits: plan.categoryLimits,
      categories,

      setIncomeLocal,
      setGoalLocal,
      toggleCategoryLocal,
      setCategoryLimitLocal,

      savePlan,
      updateCategoryLimit,
      updateCategoryLimits,

      expenses,
      addExpense,

      getCategoryLimit,
      categoryHasLimit,
    }),
    [loading, isPlanReady, plan, categories, expenses]
  );

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};