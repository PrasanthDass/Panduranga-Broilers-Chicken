import type { Request, Response } from "express";
import { supabase } from "../config/database.js";
import bcrypt from "bcryptjs";
import type { AuthRequest } from "../middleware/auth.middleware.js";

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

  if (error || !data) {
    console.error("Supabase error (getLastTransactions):", error?.message);
    return res.status(500).json({ error: "Failed to fetch last transactions" });
  }

  return res.json({ transactions: data });
}

export async function getCustomers(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, current_balance");

  if (error) {
    return res.status(500).json({ error: "Failed to fetch customers" });
  }
  return res.json({ customers: data });
}

export async function createBill(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const {
    customer_id,
    bill_date,
    total_amount,
    kgs_distributed,
    kgs_returned,
    extra_kgs,
  } = req.body;

  const admin_id = req.user?.userId;

  if (!admin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Could not identify admin user." });
  }

  if (!customer_id || !bill_date || !total_amount) {
    return res.status(400).json({
      error: "Missing required fields: customer_id, bill_date, total_amount",
    });
  }

  if (typeof total_amount !== "number" || total_amount <= 0) {
    return res.status(400).json({ error: "Invalid total_amount" });
  }

  const { data, error } = await supabase.rpc("create_bill_and_transaction", {
    p_customer_id: customer_id,
    p_admin_id: admin_id,
    p_bill_date: bill_date,
    p_total_amount: total_amount,
    p_kgs_distributed: kgs_distributed || 0,
    p_kgs_returned: kgs_returned || 0,
    p_extra_kgs: extra_kgs || 0,
  });

  if (error) {
    console.error("Failed to create bill:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to create bill", details: error.message });
  }

  return res
    .status(201)
    .json({ message: "Bill created successfully", bill: data });
}

export async function getBillsReport(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const { start_date, end_date, customer_id } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({
      error: "Missing required fields: start_date and end_date",
    });
  }

  let query = supabase
    .from("bills")
    .select(
      `
      id,
      bill_date,
      amount,
      kgs_distributed,
      customers ( name )
    `,
    )
    .gte("bill_date", start_date as string)
    .lte("bill_date", end_date as string);

  if (customer_id) {
    query = query.eq("customer_id", customer_id as string);
  }
  query = query.order("bill_date", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch report:", error.message);
    return res.status(500).json({ error: "Failed to fetch report" });
  }

  return res.json({ report: data });
}
