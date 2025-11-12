import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const autoLogout = async () => {
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("userRole");
  await AsyncStorage.removeItem("refreshToken");
  router.replace("/(auth)/LoginScreen");
};

const getAuthHeaders = async () => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const headers: any = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    await autoLogout();
    throw new Error("Your session has expired. Please log in again.");
  }
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", response.status, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchWeeklySales = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BACKEND_URL}/admin/weekly-sales`, {
    method: "GET",
    headers,
  });
  return handleResponse(response);
};

export const fetchLastTransactions = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BACKEND_URL}/admin/last-transactions`, {
    method: "GET",
    headers,
  });
  return handleResponse(response);
};

export const fetchUsers = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BACKEND_URL}/admin/users`, {
    method: "GET",
    headers,
  });
  return handleResponse(response);
};

export const deleteUser = async (userId: number) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BACKEND_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers,
  });
  return handleResponse(response);
};

export const createCustomer = async (customerData: any) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BACKEND_URL}/admin/customer`, {
    method: "POST",
    headers,
    body: JSON.stringify(customerData),
  });
  return handleResponse(response);
};

export const updateUser = async (userId: number, updateData: any) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BACKEND_URL}/admin/users/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updateData),
  });
  return handleResponse(response);
};

export const getCustomers = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BACKEND_URL}/admin/customers`, {
    method: "GET",
    headers,
  });
  return handleResponse(response);
};

export const createBill = async (billData: any) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BACKEND_URL}/admin/bills`, {
    method: "POST",
    headers,
    body: JSON.stringify(billData),
  });
  return handleResponse(response);
};

export const getBillsReport = async (
  start: string,
  end: string,
  filters: {
    startDate: string;
    endDate: string;
    customerId?: number;
  },
) => {
  const headers = await getAuthHeaders();

  const params = new URLSearchParams({
    start_date: filters.startDate,
    end_date: filters.endDate,
  });

  if (filters.customerId) {
    params.append("customer_id", filters.customerId.toString());
  }

  const response = await fetch(
    `${BACKEND_URL}/admin/reports/bills?${params.toString()}`,
    {
      method: "GET",
      headers,
    },
  );
  return handleResponse(response);
};
