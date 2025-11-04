import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

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
