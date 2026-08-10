/* eslint-disable react-refresh/only-export-components */
import { checkPasswordStrength } from "../../utils/passwordStrength";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api";


const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const LS_KEY = "hrms_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  // Save or clear user in localStorage when it changes
  useEffect(() => {
    if (user) localStorage.setItem(LS_KEY, JSON.stringify(user));
    else localStorage.removeItem(LS_KEY);
  }, [user]);

  // 🔹 Dynamic login with API
  const login = async ({ email, password }) => {
    try {
      const res = await api.post("/auth/user/login", { email, password });

      const profile = res.data.user; // 👈 depends on backend response
      const token = res.data.token;

      // Save both user + token
      const authData = { ...profile, token };
      setUser(authData);

      localStorage.setItem(LS_KEY, JSON.stringify(authData));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  // 🔹 Dynamic signup with API
  const signup = async ({
    firstName,
    lastName,
    email,
    password,
    organizationName,
    phone,
    slug,
  }) => {
    try {

      // ✅ ADD THIS BLOCK (START)
    const strength = checkPasswordStrength(password);

    if (strength.label === "Weak") {
      throw new Error(
        "Password is too weak. Use minimum 8 characters, uppercase, number & symbol."
      );
    }
    // ✅ ADD THIS BLOCK (END)

      const res = await api.post("/auth/admin/register", {
        firstName,
        lastName,
        email,
        password,
        organizationName,
        phone,
        slug,
      });

      const profile = res.data.user; // 👈 depends on backend response
      const token = res.data.token;

      const authData = { ...profile, token };
      setUser(authData);

      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Signup failed");
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  // AuthContext.js
  const updateEmployee = async (emp_id, updatedData) => {
    try {
      const res = await api.put(
        `employee/update-employee-data/${emp_id}`,
        updatedData
      );
      console.log("[DEBUG] Update employee response:", res.data); // Log response
      return res.data; // return updated employee
    } catch (err) {
      console.error(
        "[ERROR] Update employee failed:",
        err.response?.data || err.message
      );
      throw err;
    }
  };

  const employeeRegister = async ({
    firstName,
    middleName,
    lastName,
    email,
    adharCard,
    designation,
    role,
    phone,
    department,
    dateOfJoining,
    status,
    salary,
    emp_id,
    mgrId,
    hrId,
    workMode,
  }) => {
    try {
      const res = await api.post("/add-employee/register", {
        firstName,
        middleName,
        lastName,
        email,
        adharCard,
        designation,
        role,
        phone,
        department,
        dateOfJoining,
        status,
        salary,
        workMode,
        emp_id,
        hrId,
        mgrId,
      });

      console.log("API response:", res.data);

      //  Optional: treat certain 400 responses as success
      if (res.status === 201 || res.status === 200 || res.data.user) {
        return res.data; // Employee created
      }
    } catch (err) {
      console.error(
        "employee registrations failed",
        err.response?.data || err.message
      );

      // ✅ Throw the full error so frontend can read err.response.data.message
      if (err.response) {
        throw err;
      } else {
        throw new Error("Server not reachable");
      }
    }
  };
  // AuthContext.js (inside AuthProvider)
  const deleteEmployee = async (emp_id) => {
    try {
      const res = await api.delete(`/employee/delete-employee-data/${emp_id}`);
      console.log("[DEBUG] Delete employee response:", res.data); // Log backend response

      if (res.data.success) {
        return res.data; // Return success message
      } else {
        throw new Error(res.data.message || "Failed to delete employee");
      }
    } catch (err) {
      console.error(
        "[ERROR] Delete employee failed:",
        err.response?.data || err.message
      );
      throw err; // Throw so frontend can catch and show toast
    }
  };

  return (
    <AuthCtx.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        employeeRegister,
        updateEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}
