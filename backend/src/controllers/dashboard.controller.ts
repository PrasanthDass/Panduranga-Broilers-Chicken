import type { Response } from "express";
import { supabase } from "../config/database";

export async function getWeeklySales(res: Response) {
  const { data, error } = await supabase.rpc("weekly_sales", {});
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ weeklySales: data });
}

export async function getLastTransactions(res: Response) {
  const { data, error } = await supabase
    .from("bills")
    .select("id, customer_id, amount, status, due_date, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ transactions: data });
}
