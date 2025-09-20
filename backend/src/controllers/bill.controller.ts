import type { Response } from "express";
import { supabase } from "../config/database";
import type { AuthRequest } from "../middleware/auth.middleware";

interface Bill {
  id: number;
  user_id: number;
  description: string;
  quantity_kgs: number;
  returned_kgs: number;
  extra_kgs: number;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

// Create bill
export async function createBill(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const { userId, role } = req.user || {};
  if (!userId || role !== "admin")
    return res.status(403).json({ error: "Forbidden" });

  const {
    customer_id,
    description,
    due_date,
    quantity_kgs,
    returned_kgs = 0,
    extra_kgs = 0,
    amount,
  } = req.body;

  if (
    !customer_id ||
    !description ||
    !due_date ||
    typeof quantity_kgs !== "number" ||
    quantity_kgs <= 0
  ) {
    return res
      .status(400)
      .json({ error: "Missing or invalid required fields" });
  }

  let billAmount = amount;

  if (billAmount === undefined || billAmount === null) {
    const { data: prices, error: priceError } = await supabase
      .from("daily_prices")
      .select("price_per_kg")
      .lte("effective_date", due_date)
      .order("effective_date", { ascending: false })
      .limit(1);

    if (priceError || !prices || prices.length === 0) {
      return res
        .status(400)
        .json({ error: "No price set for the bill's date or earlier" });
    }

    const pricePerKg = prices[0]?.price_per_kg ?? null;

    billAmount = Number(pricePerKg) * Number(quantity_kgs);
  }

  const { data: billData, error: billError } = await supabase
    .from("bills")
    .insert([
      {
        user_id: customer_id,
        description,
        quantity_kgs,
        returned_kgs,
        extra_kgs,
        amount: billAmount,
        status: "unpaid",
        due_date,
      },
    ])
    .select("*");

  if (billError || !billData || billData.length === 0) {
    return res.status(500).json({ error: "Failed to create bill" });
  }

  return res.status(201).json({ bill: billData[0] });
}

// Get bills for logged-in user
export async function getBills(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  let query = supabase.from("bills").select("*");

  if (userRole !== "admin") {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.order("due_date", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ bills: data });
}

// Update bill
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

// Delete bill
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
