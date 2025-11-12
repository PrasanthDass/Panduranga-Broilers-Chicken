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
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not defined. Please check your .env file.");
  }
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
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }
  return response.json();
};

export const getMyDetails = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BACKEND_URL}/customer/me`, {
    method: "GET",
    headers,
  });
  return handleResponse(response);
};

export const getMyBills = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BACKEND_URL}/customer/my-bills`, {
    method: "GET",
    headers,
  });
  return handleResponse(response);
};
