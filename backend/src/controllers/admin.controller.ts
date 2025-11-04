import type { Request, Response } from "express";
import { supabase } from "../config/database";
import bcrypt from "bcryptjs";
import type { AuthRequest } from "../middleware/auth.middleware";

export async function listUsers(
  req: Request,
  res: Response,
): Promise<Response> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, mobile_number, role, created_at");

  if (error) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }

  return res.json({ users: data });
}

export async function createUser(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const { name, mobile_number, password, role } = req.body;

  if (!name || !mobile_number || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, mobile_number, password_hash, role }]);

  if (error || !data) {
    return res.status(500).json({ error: "Failed to create user" });
  }

  return res.status(201).json({ message: "User created", user: data });
}

export async function updateUser(
  req: Request,
  res: Response,
): Promise<Response> {
  const userId = parseInt(req.params.id!);
  const { name, mobile_number, role } = req.body;

  if (!name && !mobile_number && !role) {
    return res.status(400).json({ error: "No valid fields provided" });
  }

  const updateFields: any = {};
  if (name) updateFields.name = name;
  if (mobile_number) updateFields.mobile_number = mobile_number;
  if (role) updateFields.role = role;

  const { data, error } = await supabase
    .from("users")
    .update(updateFields)
    .eq("id", userId);

  if (error) {
    return res.status(500).json({ error: "Failed to update user" });
  }

  return res.json({ message: "User updated", user: data });
}

export async function deleteUser(
  req: Request,
  res: Response,
): Promise<Response> {
  const userId = parseInt(req.params.id!);

  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) {
    return res.status(500).json({ error: "Failed to delete user" });
  }

  return res.json({ message: "User deleted" });
}

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

export async function getWeeklySales(
  req: Request,
  res: Response,
): Promise<Response> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("bills")
    .select("amount")
    .gte("created_at", oneWeekAgo.toISOString());

  if (error) {
    return res.status(500).json({ error: "Failed to fetch weekly sales" });
  }

  const totalSales = data.reduce((acc, bill) => acc + bill.amount, 0);
  const totalBills = data.length;

  console.log(res.json);

  return res.json({
    totalSales,
    totalBills,
    startDate: oneWeekAgo.toISOString(),
  });
}

export async function getLastTransactions(
  req: Request,
  res: Response,
): Promise<Response> {
  const { data, error } = await supabase
    .from("bills")
    .select(
      `
      id,
      amount,
      created_at,
      customers (
        name
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Supabase error (getLastTransactions):", error.message);
    return res.status(500).json({ error: "Failed to fetch last transactions" });
  }

  return res.json({ transactions: data });
}
