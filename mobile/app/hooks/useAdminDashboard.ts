import { useState, useEffect } from "react";
import * as api from "../services/admin";

export type Bill = {
  id: number;
  amount: number;
  created_at: string;
  customers: {
    name: string;
  };
};

export type SalesData = {
  totalSales: number;
  totalBills: number;
  startDate: string;
};

export const useAdminDashboard = () => {
  const [sales, setSales] = useState<SalesData | null>(null);
  const [transactions, setTransactions] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [salesData, transactionsData] = await Promise.all([
        api.fetchWeeklySales(),
        api.fetchLastTransactions(),
      ]);

      setSales(salesData);
      setTransactions(transactionsData.transactions);
    } catch (e: any) {
      setError(e.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { sales, transactions, isLoading, error, refresh: loadData };
};

export default useAdminDashboard;
