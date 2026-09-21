export interface WeeklyEarning {
  id: string;
  month: string;
  week: number;
  amount: number;
}

export interface MonthlyBill {
  id: string;
  month: string;
  name: string;
  amount: number;
  paid: boolean;
}

export interface WishItem {
  id: string;
  name: string;
  amount: number;
}

export interface FinanceData {
  earnings: WeeklyEarning[];
  bills: MonthlyBill[];
  wishes: WishItem[];
}

export const STORAGE_KEY = "fincontrol-entregador-v1";

export const EMPTY_FINANCE_DATA: FinanceData = {
  earnings: [],
  bills: [],
  wishes: [],
};

export function loadFinanceData(): FinanceData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_FINANCE_DATA;
    const parsed = JSON.parse(raw) as Partial<FinanceData>;
    return {
      earnings: Array.isArray(parsed.earnings) ? parsed.earnings : [],
      bills: Array.isArray(parsed.bills) ? parsed.bills : [],
      wishes: Array.isArray(parsed.wishes) ? parsed.wishes : [],
    };
  } catch {
    return EMPTY_FINANCE_DATA;
  }
}

export function saveFinanceData(data: FinanceData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export function moveMonth(key: string, offset: number) {
  const [year, month] = key.split("-").map(Number);
  return monthKey(new Date(year, month - 1 + offset, 1));
}

export function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function currency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function totalsForMonth(data: FinanceData, month: string) {
  const earnings = data.earnings
    .filter((item) => item.month === month)
    .reduce((sum, item) => sum + item.amount, 0);
  const bills = data.bills.filter((item) => item.month === month);
  const reserved = bills.reduce((sum, item) => sum + item.amount, 0);
  const paid = bills.filter((item) => item.paid).reduce((sum, item) => sum + item.amount, 0);
  return {
    earnings,
    reserved,
    paid,
    pending: reserved - paid,
    free: Math.max(0, earnings - reserved),
    rawFree: earnings - reserved,
  };
}