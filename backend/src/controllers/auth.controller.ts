import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { supabase } from "../config/database";
import jwt from "jsonwebtoken";
import crypto from "crypto";

function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export async function registerUser(req: Request, res: Response) {
  const { name, mobile_number, password } = req.body;

  if (!name || !mobile_number || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("mobile_number", mobile_number)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from("users").insert([
      {
        name,
        mobile_number,
        password_hash,
        role: "customer",
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function loginUser(
  req: Request,
  res: Response,
): Promise<Response> {
  const { mobile_number, password } = req.body;

  if (!mobile_number || !password) {
    return res
      .status(400)
      .json({ error: "Mobile number and password are required" });
  }

  try {
    // Fetch user by mobile_number
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("mobile_number", mobile_number)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare plain password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT access token (expires in 1 hour)
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET!,
      { expiresIn: "1h" },
    );

    // Generate refresh token (random string)
    const refreshToken = generateRefreshToken();

    // Set refresh token expiry (e.g., 30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Save refresh token in the database
    const { error: insertError } = await supabase
      .from("refresh_tokens")
      .insert([
        {
          user_id: user.id,
          token: refreshToken,
          expires_at: expiresAt.toISOString(),
        },
      ]);

    if (insertError) {
      // Log the error and respond
      console.error("Failed to save refresh token:", insertError);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Return tokens to client
    return res.status(200).json({
      accessToken,
      refreshToken,
      userId: user.id,
      role: user.role,
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  // Find refresh token in DB
  const { data: tokenEntry, error } = await supabase
    .from("refresh_tokens")
    .select("*")
    .eq("token", refreshToken)
    .single();

  if (error || !tokenEntry) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  // Check expiry
  if (new Date(tokenEntry.expires_at) < new Date()) {
    return res.status(401).json({ error: "Refresh token expired" });
  }

  // Get user info
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", tokenEntry.user_id)
    .single();

  if (userError || !user) {
    return res.status(401).json({ error: "User not found" });
  }

  // Generate new tokens
  const newAccessToken = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET!,
    { expiresIn: "1h" },
  );

  const newRefreshToken = generateRefreshToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Save new refresh token and delete the old one
  await supabase.from("refresh_tokens").insert([
    {
      user_id: user.id,
      token: newRefreshToken,
      expires_at: expiresAt.toISOString(),
    },
  ]);

  await supabase.from("refresh_tokens").delete().eq("token", refreshToken);

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
}

export async function logoutUser(
  req: Request,
  res: Response,
): Promise<Response> {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    // Delete the refresh token from DB to revoke it
    const { error } = await supabase
      .from("refresh_tokens")
      .delete()
      .eq("token", refreshToken);

    if (error) {
      return res.status(500).json({ error: "Failed to revoke refresh token" });
    }

    return res.json({ message: "Logged out successfully" });
  } catch (e) {
    console.error("Logout error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function changePassword(
  req: Request,
  res: Response,
): Promise<Response> {
  const { userId } = req.body;
  const { oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Fetch user by userId
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Compare old password with stored hash
  const isOldPasswordValid = await bcrypt.compare(
    oldPassword,
    user.password_hash,
  );
  if (!isOldPasswordValid) {
    return res.status(401).json({ error: "Incorrect previous password" });
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Update user's password in database
  const { error: updateError } = await supabase
    .from("users")
    .update({ password_hash: newPasswordHash })
    .eq("id", userId);

  if (updateError) {
    return res.status(500).json({ error: "Error updating password" });
  }

  return res.json({ message: "Password updated successfully" });
}
