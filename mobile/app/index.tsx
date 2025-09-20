import React, { createContext, useContext } from "react";

type User = { role: "admin" | "customer" | null };
type AuthContextType = {
  user: User | null;
  login: (role: User["role"]) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
