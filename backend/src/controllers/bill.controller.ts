import type { Request, Response } from "express";
import { supabase } from "../config/database";
import type { AuthRequest } from "../middleware/auth.middleware";

interface Bill {
  id: number;
  user_id: number;
  description: string;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

// Create a bill
export async function createBill(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { description, amount, due_date } = req.body;
  if (!description || !amount || !due_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase
    .from("bills")
    .insert([{ user_id: userId, description, amount, due_date }]);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ bill: data?.[0] });
}

// Get bills for logged-in user
export async function getBills(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ bills: data });
}

// Update a bill
export async function updateBill(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const userId = req.user?.userId;
  const billId = Number(req.params.id);

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { description, amount, status, due_date } = req.body;

  const updateData: Partial<Bill> = {};
  if (description) updateData.description = description;
  if (amount) updateData.amount = amount;
  if (status) updateData.status = status;
  if (due_date) updateData.due_date = due_date;

  const { data, error } = await supabase
    .from("bills")
    .update(updateData)
    .eq("id", billId)
    .eq("user_id", userId);

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ bill: data?.[0] });
}

// Delete a bill
export async function deleteBill(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const userId = req.user?.userId;
  const billId = Number(req.params.id);

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { error } = await supabase
    .from("bills")
    .delete()
    .eq("id", billId)
    .eq("user_id", userId);

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ message: "Bill deleted successfully" });
}
