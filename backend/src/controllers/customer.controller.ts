import type { Response } from "express";
import { supabase } from "../config/database";
import type { AuthRequest } from "../middleware/auth.middleware";

export async function getMyDetails(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from("customers")
    .select("id, name, current_balance, address, mobile_number")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Customer profile not found." });
  }

  return res.json(data);
}

export async function getMyBills(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data: customerData, error: customerError } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (customerError || !customerData) {
    console.error("Customer Error:", customerError);
    return res.status(404).json({ error: "Customer profile not found." });
  }

  const customerId = customerData.id;

  const { data, error } = await supabase
    .from("bills")
    .select("id, due_date, amount, quantity_kgs")
    .eq("customer_id", customerId)
    .order("due_date", { ascending: false });

  if (error) {
    console.error("Bills Fetch Error:", error);
    return res.status(500).json({ error: "Failed to fetch bills" });
  }

  return res.json({ bills: data });
}
