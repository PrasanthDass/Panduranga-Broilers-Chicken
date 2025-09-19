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

  // Hash password
  const password_hash = await bcrypt.hash(password, 10);

  // Create user in DB
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
