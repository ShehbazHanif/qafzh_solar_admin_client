import React, { createContext, useState, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/admin-auth/login",
        {
          email,
          password,
        }
      );

      const token = res.data.token;

      if (token) {
        localStorage.setItem("adminToken", token); // Store token for auth

        // only for development , not use for production
        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            name: "Admin",
            role: "admin",
          })
        );

        setUser({
          email,
          name: "Admin",
          role: "admin",
        });
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // const logout = () => {
  //   localStorage.removeItem("adminToken");
  //   setUser(null);
  // };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
