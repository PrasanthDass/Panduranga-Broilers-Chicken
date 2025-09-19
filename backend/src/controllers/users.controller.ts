import type { Request, Response } from "express";

const users = [
  { id: 1, name: "Ash" },
  { id: 2, name: "Jamie" },
];

// Type the parameters!
export function getUsers(req: Request, res: Response): void {
  res.json(users);
}
