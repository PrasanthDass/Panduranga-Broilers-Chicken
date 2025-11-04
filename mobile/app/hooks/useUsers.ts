import { useState, useEffect, useCallback } from "react";
import * as api from "../services/admin";

export type User = {
  id: number;
  name: string;
  mobile_number: string;
  role: "admin" | "customer";
  created_at: string;
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchUsers();
      setUsers(data.users);
    } catch (e) {
      console.error("Failed to load users", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const removeUser = async (userId: number) => {
    try {
      await api.deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    } catch (e) {
      console.error("Failed to delete user", e);
    }
  };

  const addUser = async (customerData: any) => {
    try {
      const data = await api.createCustomer(customerData);
      setUsers((prevUsers) => [data.user, ...prevUsers]);
      return { success: true };
    } catch (e: any) {
      console.error("Failed to create user", e);
      return { success: false, error: e.message };
    }
  };

  const editUser = async (userId: number, updateData: any) => {
    try {
      const response = await api.updateUser(userId, updateData);
      const updatedUser = response.user[0];

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user,
        ),
      );
      return { success: true };
    } catch (e: any) {
      console.error("Failed to update user", e);
      return { success: false, error: e.message };
    }
  };

  return {
    users,
    isLoading,
    refreshUsers: loadUsers,
    removeUser,
    addUser,
    editUser,
  };
};

export default useUsers;
