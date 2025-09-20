import type { Response } from "express";
import { supabase } from "../config/database";
import type { AuthRequest } from "../middleware/auth.middleware";
import bcrypt from "bcryptjs";

export async function createCustomer(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  if (req.user?.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });

  const { name, mobile_number, address, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  //create user
  const password_hash = await bcrypt.hash(password, 10);

  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([
      {
        name,
        mobile_number,
        password_hash,
        role: "customer",
      },
    ])
    .select();

  if (userError || !userData || userData.length === 0) {
    return res.status(500).json({ error: "Failed to create user account" });
  }

  const userId = userData[0].id;

  //customer link to user
  const { data: customerData, error: customerError } = await supabase
    .from("customers")
    .insert([
      {
        name,
        mobile_number,
        address,
        user_id: userId,
      },
    ])
    .select();

  if (customerError || !customerData || customerData.length === 0) {
    await supabase.from("users").delete().eq("id", userId);
    return res.status(500).json({ error: "Failed to create customer record" });
  }

  return res.status(201).json({ customer: customerData[0], user: userData[0] });
}
